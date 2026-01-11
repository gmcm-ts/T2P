<template>
  <div class="search-card">
    <!-- Theme Toggle Button -->
    <button class="theme-toggle" @click="toggleTheme" :title="`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`">
      <Moon v-if="theme === 'light'" :size="16" />
      <Sun v-else :size="16" color="white" />
    </button>

    <!-- Mode Toggle -->
    <div class="mode-toggle">
      <span 
        :class="{ active: mode === 'student' }"
        @click="$emit('update:mode', 'student')"
      >
        Intern
      </span>
      <span 
        :class="{ active: mode === 'faculty' }"
        @click="$emit('update:mode', 'faculty')"
      >
        Faculty
      </span>
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
          type="tel" 
          inputmode="numeric"
          pattern="[0-9]*"
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
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { Moon, Sun } from 'lucide-vue-next'

const props = defineProps({
  mode: String,
  date: Date,
  query: String,
  loading: Boolean,
  departments: Array,
  sites: Array
})

const emit = defineEmits(['update:mode', 'update:date', 'update:query', 'search', 'clear'])

const theme = ref('light')

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  document.body.className = theme.value === 'light' ? 'light-theme' : 'dark-theme'
  localStorage.setItem('theme', theme.value)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  theme.value = savedTheme
  document.body.className = savedTheme === 'light' ? 'light-theme' : 'dark-theme'
})

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
    // Check if it's a department or site based on the data
    const isDepartment = departments.value.some(d => d.value === newQuery || d.name === newQuery)
    if (isDepartment) {
      departmentValue.value = newQuery
      siteValue.value = ''
    } else {
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
  const selectedValue = event.target.value;
  emit('update:query', selectedValue);
  if (selectedValue) {
    emit('search');
  } else {
    emit('clear');
  }
}

const handleSiteChange = (event) => {
  departmentValue.value = '' // Reset the other dropdown
  const selectedValue = event.target.value;
  emit('update:query', selectedValue);
  if (selectedValue) {
    emit('search');
  } else {
    emit('clear');
  }
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
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  margin-bottom: 24px;
  position: relative;
}

.theme-toggle {
  position: absolute;
  top: 16px;
  right: 16px;
  background: var(--bg-hover);
  border: 1px solid var(--border);
  border-radius: 50%;
  padding: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.15s ease;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  background: var(--border);
}

.mode-toggle {
  display: inline-flex;
  background: var(--bg-hover);
  border-radius: var(--radius);
  padding: 2px;
  margin-bottom: 24px;
}

.mode-toggle span {
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s ease;
}

.mode-toggle span.active {
  background: var(--text);
  color: var(--bg);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.switch {
  display: none;
}

.date-section {
  margin-bottom: 24px;
}

.date-display {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
  margin: 0 0 8px 0;
}

.date-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 14px;
  background: var(--bg-card);
  color: var(--text);
  font-family: var(--font-sans);
}

.date-input:focus {
  outline: none;
  border-color: var(--border-strong);
}

.search-section {
  margin-bottom: 16px;
}

.input-group {
  display: flex;
  gap: 8px;
}

@media (max-width: 640px) {
  .input-group {
    flex-direction: column;
  }
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 14px;
  background: var(--bg-card);
  color: var(--text);
  font-family: var(--font-sans);
  transition: border-color 0.15s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--border-strong);
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.search-btn {
  padding: 8px 16px;
  background: var(--text);
  color: var(--bg);
  border: 1px solid var(--text);
  border-radius: var(--radius);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font-sans);
  transition: opacity 0.15s ease;
}

@media (max-width: 640px) {
  .search-btn {
    width: 100%;
  }
}

.search-btn:hover:not(:disabled) {
  opacity: 0.8;
}

.search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.faculty-inputs {
  display: grid;
  gap: 16px;
}

@media (min-width: 768px) {
  .faculty-inputs {
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 24px;
  }
}

.select-input {
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 14px;
  background: var(--bg-card);
  color: var(--text);
  cursor: pointer;
  font-family: var(--font-sans);
  transition: border-color 0.15s ease;
  width: 100%;
  min-width: 0;
}

.select-input:focus {
  outline: none;
  border-color: var(--border-strong);
}

.divider {
  text-align: center;
  font-weight: 500;
  color: var(--text-tertiary);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@media (min-width: 768px) {
  .divider {
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }
}

.clear-btn {
  width: 100%;
  padding: 8px 16px;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font-sans);
  transition: all 0.15s ease;
}

.clear-btn:hover {
  background: var(--bg-hover);
  border-color: var(--border-strong);
}
</style>