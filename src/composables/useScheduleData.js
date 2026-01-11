import { ref } from 'vue'

const appData = ref({})
const PIVOT_DATE = new Date('2025-07-21T00:00:00Z')

export function useScheduleData() {
  const loadData = async () => {
    const dataFiles = {
      groups: '/json_data/group-data.json',
      oldGroups: '/json_data/old-group-data.json',
      schedule: '/json_data/schedule-data.json',
      groupA: '/json_data/group-a-schedule.json',
      groupB: '/json_data/group-b-schedule.json',
      groupC: '/json_data/group-c-schedule.json',
      groupD: '/json_data/group-d-schedule.json',
      legend: '/json_data/legend.json',
      guidelines: '/json_data/guidelines.json',
      regulations: '/json_data/regulations.json',
      unifiedSites: '/json_data/unified-sites.json'
    }

    const promises = Object.entries(dataFiles).map(async ([key, url]) => {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`Failed to load ${url}`)
      const data = await response.json()
      appData.value[key] = data
    })

    await Promise.all(promises)
  }

  const findGroupFromRoll = (roll, groupData) => {
    const numericRoll = parseInt(roll, 10)
    const searchKey = isNaN(numericRoll) ? roll.toUpperCase() : numericRoll
    return Object.entries(groupData).find(([, rolls]) => rolls.includes(searchKey))?.[0]
  }

  const getCanonicalPostingCode = (postingCode) => {
    const variations = {
      'GM - FMTW': 'GM - FMW',
      'FP & AY': 'FP&AY'
    }
    return variations[postingCode] || postingCode
  }

  const lookupStudent = async (rollInput, selectedDate) => {
    const cleanRoll = rollInput.trim().toUpperCase().replace(/^R0+/, 'R')
    const isOldSchedule = selectedDate < PIVOT_DATE
    const groupData = isOldSchedule ? appData.value.oldGroups : appData.value.groups
    const groupKey = findGroupFromRoll(cleanRoll, groupData) || cleanRoll

    if (!groupData[groupKey]) {
      throw new Error('No matching group found')
    }

    const groupLetter = groupKey.charAt(0)
    const scheduleKey = isOldSchedule ? 'oldSchedule' : 'newSchedule'
    const selectedDateISO = selectedDate.toISOString().split('T')[0]
    
    const weekSchedule = appData.value[`group${groupLetter}`]?.[scheduleKey]?.find(w => 
      selectedDateISO >= w.startDate && selectedDateISO <= w.endDate
    )

    const atAGlanceWeek = appData.value.schedule[scheduleKey].find(w => 
      selectedDateISO >= w.startDate && selectedDateISO <= w.endDate
    )

    if (!weekSchedule || !atAGlanceWeek) {
      throw new Error('No schedule found for selected date')
    }

    const postingCode = weekSchedule.postings[groupKey]
    const deptCode = atAGlanceWeek.postings[groupKey]

    if (!postingCode || !deptCode) {
      throw new Error('Posting details not found')
    }

    const legendEntry = appData.value.legend.legend.find(item => 
      item.code === getCanonicalPostingCode(postingCode)
    )
    const deptEntry = appData.value.regulations.regulations.find(item => 
      item.abbreviation === deptCode
    )

    // Find colleagues
    const colleagues = Object.entries(weekSchedule.postings)
      .filter(([, code]) => code === postingCode)
      .flatMap(([group]) => groupData[group] || [])
      .filter(roll => roll !== (isNaN(cleanRoll) ? cleanRoll.toUpperCase() : parseInt(cleanRoll, 10)))
      .join(', ')

    // Random guideline
    const guideline = appData.value.guidelines[Math.floor(Math.random() * appData.value.guidelines.length)]

    return {
      student: {
        department: deptEntry?.department || deptCode,
        site: legendEntry?.site || postingCode,
        task: legendEntry?.split || "No task description"
      },
      colleagues: colleagues || "No colleagues found",
      guideline
    }
  }

  const lookupFaculty = async (query, selectedDate) => {
    // Implementation for faculty lookup
    // This would be similar to the original but adapted for Vue
    throw new Error('Faculty lookup not implemented yet')
  }

  const lookupUnifiedSite = async (siteName, selectedDate) => {
    // Implementation for unified site lookup
    throw new Error('Unified site lookup not implemented yet')
  }

  return {
    appData,
    loadData,
    lookupStudent,
    lookupFaculty,
    lookupUnifiedSite
  }
}