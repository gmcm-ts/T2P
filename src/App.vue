<template>
  <div class="app">
    <Header />
    <main class="main-content">
      <SearchCard 
        v-model:mode="currentMode"
        v-model:date="selectedDate"
        v-model:query="searchQuery"
        :loading="loading"
        @search="handleSearch"
        @clear="handleClear"
      />
      
      <Transition name="fade" mode="out-in">
        <StudentResults 
          v-if="currentMode === 'student' && studentResult"
          :result="studentResult"
          :colleagues="colleagues"
          :guideline="guideline"
        />
        <FacultyResults 
          v-else-if="currentMode === 'faculty' && facultyResult"
          :result="facultyResult"
        />
        <ErrorMessage 
          v-else-if="error"
          :message="error"
        />
      </Transition>
    </main>
    
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useScheduleData } from './composables/useScheduleData'
import { useLocalStorage } from './composables/useLocalStorage'
import Header from './components/Header.vue'
import SearchCard from './components/SearchCard.vue'
import StudentResults from './components/StudentResults.vue'
import FacultyResults from './components/FacultyResults.vue'
import ErrorMessage from './components/ErrorMessage.vue'
import Footer from './components/Footer.vue'

const { loadData, lookupStudent, lookupFaculty, lookupUnifiedSite } = useScheduleData()
const { getItem, setItem } = useLocalStorage()

const currentMode = ref('student')
const selectedDate = ref(new Date())
const searchQuery = ref('')
const loading = ref(false)
const error = ref('')
const studentResult = ref(null)
const facultyResult = ref(null)
const colleagues = ref('')
const guideline = ref(null)

const handleSearch = async () => {
  if (!searchQuery.value.trim()) return
  
  loading.value = true
  error.value = ''
  studentResult.value = null
  facultyResult.value = null
  
  try {
    if (currentMode.value === 'student') {
      const result = await lookupStudent(searchQuery.value, selectedDate.value)
      studentResult.value = result.student
      colleagues.value = result.colleagues
      guideline.value = result.guideline
      setItem('lastSearchedRoll', searchQuery.value)
    } else {
      const result = await lookupFaculty(searchQuery.value, selectedDate.value)
      facultyResult.value = result
      setItem('lastSelectedFacultyValue', searchQuery.value)
    }
    setItem('currentMode', currentMode.value)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const handleClear = () => {
  searchQuery.value = ''
  studentResult.value = null
  facultyResult.value = null
  error.value = ''
}

onMounted(async () => {
  loading.value = true
  try {
    await loadData()
    
    // Restore session
    const savedMode = getItem('currentMode')
    if (savedMode) currentMode.value = savedMode
    
    const savedQuery = getItem(currentMode.value === 'student' ? 'lastSearchedRoll' : 'lastSelectedFacultyValue')
    if (savedQuery) {
      searchQuery.value = savedQuery
      await handleSearch()
    }
  } catch (err) {
    error.value = 'Failed to load application data'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>