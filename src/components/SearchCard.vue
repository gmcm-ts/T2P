<template>
  <div class="search-card">
    <!-- Mode Toggle -->
    <div class="mode-toggle">
      <span :class="{ active: mode === 'student' }">Intern</span>
      <label class="switch">
        <input 
          type="checkbox" 
          :checked="mode === 'faculty'"
          @change="$emit('update:mode', $event.target.checked ? 'faculty' : 'student')"
        >
        <span class="slider"></span>
      </label>
      <span :class="{ active: mode === 'faculty' }">Faculty</span>
    </div>

    <!-- Date Picker -->
    <div class="date-section" @click="showDatePicker = !showDatePicker">
      <p class="date-display">{{ dateDisplay }}</p>
      <input 
        v-if="showDatePicker"
        type="date" 
        :value="dateValue"
        @change="updateDate"
        @blur="showDatePicker = false"
        class="date-input"
        ref="dateInput"
      >
    </div>

    <!-- Search Input -->
    <div class="search-section">
      <div v-if="mode === 'student'" class="input-group">
        <input 
          v-model="localQuery"
          type="text" 
          placeholder="Enter Roll No. or Group (e.g., 141, A5)"
          class="search-input"
          :disabled="loading"
          @keyup.enter="handleSearch"
        >
        <button 
          @click="handleSearch"
          :disabled="loading || !localQuery.trim()"
          class="search-btn"
        >
          {{ loading ? '...' : 'Go' }}
        </button>
      </div>

      <div v-else class="faculty-inputs">
        <select 
          v-model="departmentValue"
          class="select-input"
          :disabled="loading"
          @change="handleDepartmentChange"
        >
          <option value="">Select Department...</option>
          <option 
            v-for="dept in (departments || [])" 
            :key="dept.code || dept.name" 
            :value="dept.value || dept.name"
            :data-code="dept.code"
          >
            {{ dept.name }}
          </option>
        </select>
        
        <div class="divider">OR</div>
        
        <select 
          v-model="siteValue"
          class="select-input"
          :disabled="loading"
          @change="handleSiteChange"
        >
          <option value="">Select Site...</option>
          <option v-for="site in (sites || [])" :key="site" :value="site">
            {{ site }}
          </option>
        </select>
      </div>
    </div>

    <!-- Clear Button -->
    <button 
      v-if="query"
      @click="$emit('clear')"
      class="clear-btn"
    >
      Clear Results
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  mode: String,
  date: Date,
  query: String,
  loading: Boolean,
  departments: Array,
  sites: Array
})

const emit = defineEmits(['update:mode', 'update:date', 'update:query', 'search', 'clear'])

const showDatePicker = ref(false)
const dateInput = ref(null)
const localQuery = ref('')
const departmentValue = ref('')
const siteValue = ref('')
const departments = ref([])
const sites = ref([])

// Watch for mode changes and clear everything
watch(() => props.mode, (newMode) => {
  localQuery.value = ''
  departmentValue.value = ''
  siteValue.value = ''
  emit('update:query', '')
  emit('clear')
})

// Watch for departments and sites props
watch(() => props.departments, (newDepts) => {
  if (newDepts && Array.isArray(newDepts)) {
    departments.value = newDepts
  }
})

watch(() => props.sites, (newSites) => {
  if (newSites && Array.isArray(newSites)) {
    sites.value = newSites
  }
})

// Watch for query to set dropdown values
watch(() => props.query, (newQuery) => {
  if (props.mode === 'student') {
    localQuery.value = newQuery || ''
  } else if (props.mode === 'faculty' && newQuery) {
    const savedFacultyType = localStorage.getItem('lastSelectedFacultyType')
    if (savedFacultyType === 'department') {
      departmentValue.value = newQuery
      siteValue.value = ''
    } else if (savedFacultyType === 'site') {
      siteValue.value = newQuery
      departmentValue.value = ''
    }
  } else if (props.mode === 'faculty' && !newQuery) {
    departmentValue.value = ''
    siteValue.value = ''
  }
}, { immediate: true })

const dateDisplay = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const displayDate = new Date(props.date)
  displayDate.setHours(0, 0, 0, 0)
  
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  
  return today.getTime() === displayDate.getTime() 
    ? `Today is ${props.date.toLocaleDateString('en-US', options)}`
    : `Showing for: ${props.date.toLocaleDateString('en-US', options)}`
})

const dateValue = computed(() => {
  return props.date.toISOString().split('T')[0]
})

const updateDate = (event) => {
  const newDate = new Date(event.target.value + 'T00:00:00')
  emit('update:date', newDate)
  showDatePicker.value = false
}

const handleSearch = () => {
  if (localQuery.value.trim()) {
    emit('update:query', localQuery.value)
    emit('search')
  }
}

const handleDepartmentChange = (event) => {
  siteValue.value = '' // Reset the other dropdown
  const selectedValue = event.target.value
  if (!selectedValue) {
    emit('clear')
    return
  }
  
  // Find the department by matching the selected value (department name)
  const selectedDept = departments.value.find(d => d.value === selectedValue || d.name === selectedValue)
  
  if (selectedDept && selectedDept.code) {
    // Store the department name as query but pass code for lookup
    emit('update:query', selectedValue)
    // Save faculty type for session restoration
    localStorage.setItem('lastSelectedFacultyType', 'department')
    localStorage.setItem('lastSelectedFacultyValue', selectedValue)
    emit('search', { type: 'department', code: selectedDept.code })
  }
}

const handleSiteChange = (event) => {
  departmentValue.value = '' // Reset the other dropdown
  const selectedValue = event.target.value
  if (!selectedValue) {
    emit('clear')
    return
  }
  
  // Save faculty type for session restoration
  localStorage.setItem('lastSelectedFacultyType', 'site')
  localStorage.setItem('lastSelectedFacultyValue', selectedValue)
  emit('update:query', selectedValue)
  emit('search', { type: 'site', value: selectedValue })
}

watch(showDatePicker, async (show) => {
  if (show) {
    await nextTick()
    dateInput.value?.focus()
  }
})
</script>

<style scoped>
.search-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.mode-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.mode-toggle span {
  font-weight: 500;
  transition: color 0.3s;
}

.mode-toggle span.active {
  color: #007bff;
}

.switch {
  position: relative;
  width: 60px;
  height: 30px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 30px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #007bff;
}

input:checked + .slider:before {
  transform: translateX(30px);
}

.date-section {
  text-align: center;
  margin-bottom: 2rem;
  cursor: pointer;
}

.date-display {
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
  margin: 0;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.date-display:hover {
  background-color: #f8f9fa;
}

.date-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #007bff;
  border-radius: 8px;
  font-size: 1rem;
  margin-top: 0.5rem;
}

.search-section {
  margin-bottom: 1rem;
}

.input-group {
  display: flex;
  gap: 0.5rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
}

.search-btn {
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-btn:hover:not(:disabled) {
  background: #0056b3;
}

.search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.faculty-inputs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.select-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.3s;
}

.select-input:focus {
  outline: none;
  border-color: #007bff;
}

.divider {
  text-align: center;
  font-weight: 500;
  color: #6c757d;
}

.clear-btn {
  width: 100%;
  padding: 0.75rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.clear-btn:hover {
  background: #c82333;
}

@media (max-width: 768px) {
  .search-card {
    padding: 1.5rem;
  }
  
  .input-group {
    flex-direction: column;
  }
}
</style>