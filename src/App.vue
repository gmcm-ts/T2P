<template>
  <div class="app">
    <Header />
    <main class="main-content">
      <SearchCard 
        v-model:mode="currentMode"
        v-model:date="selectedDate"
        v-model:query="searchQuery"
        :loading="loading"
        :departments="departments"
        :sites="sites"
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
          :title="searchQuery"
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
import { ref, onMounted, watch, nextTick } from 'vue'
import { useScheduleData } from './composables/useScheduleData'
import { useLocalStorage } from './composables/useLocalStorage'
import Header from './components/Header.vue'
import SearchCard from './components/SearchCard.vue'
import StudentResults from './components/StudentResults.vue'
import FacultyResults from './components/FacultyResults.vue'
import ErrorMessage from './components/ErrorMessage.vue'
import Footer from './components/Footer.vue'

const { loadData, lookupStudent, lookupFaculty, lookupUnifiedSite, appData } = useScheduleData()
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
const departments = ref([])
const sites = ref([])

// Watch for mode changes and clear results
watch(currentMode, () => {
  handleClear()
})

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
      // Faculty mode - check if it's a department name or site name
      const selectedDept = departments.value.find(d => d.value === searchQuery.value)
      
      if (selectedDept) {
        // It's a department lookup - use the code
        const result = await lookupFaculty(selectedDept.code, selectedDate.value)
        facultyResult.value = result
      } else {
        // It's a unified site lookup
        const result = await lookupUnifiedSite(searchQuery.value, selectedDate.value)
        facultyResult.value = result
      }
      
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
  colleagues.value = ''
  guideline.value = null
}

onMounted(async () => {
  loading.value = true
  try {
    await loadData()
    
    // Populate departments and sites
    if (appData.value.regulations?.regulations) {
      departments.value = appData.value.regulations.regulations
        .filter(reg => reg.department && !reg.department.includes('TOTAL'))
        .map(reg => ({ 
          value: reg.department,
          code: reg.abbreviation,
          name: reg.department
        }))
    }
    
    if (appData.value.unifiedSites?.unifiedSites && Array.isArray(appData.value.unifiedSites.unifiedSites)) {
      sites.value = appData.value.unifiedSites.unifiedSites.map(site => site.name)
    }
    
    // Restore session EXACTLY like original
    const savedMode = getItem('currentMode')
    if (savedMode === 'faculty') {
      currentMode.value = 'faculty'
      
      const savedFacultyValue = getItem('lastSelectedFacultyValue')
      
      if (savedFacultyValue) {
        await nextTick() // REQUIRED: Wait for mode change to propagate to SearchCard component
        searchQuery.value = savedFacultyValue
        await nextTick(() => handleSearch()) // REQUIRED: Ensure SearchCard receives query before search
      }
    } else {
      currentMode.value = 'student'
      const savedRoll = getItem('lastSearchedRoll')
      if (savedRoll) {
        searchQuery.value = savedRoll
        await handleSearch()
      }
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
  background: var(--bg);
}

.main-content {
  max-width: 1048px;
  margin: 0 auto;
  padding: 24px;
}

@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>