import { ref } from 'vue'

const appData = ref({})
const PIVOT_DATE = new Date('2025-07-21T00:00:00Z')

export function useScheduleData() {
  const loadData = async () => {
    const dataFiles = {
      groups: '/database/json_data/group-data.json',
      oldGroups: '/database/json_data/old-group-data.json',
      schedule: '/database/json_data/schedule-data.json',
      groupA: '/database/json_data/group-a-schedule.json',
      groupB: '/database/json_data/group-b-schedule.json',
      groupC: '/database/json_data/group-c-schedule.json',
      groupD: '/database/json_data/group-d-schedule.json',
      legend: '/database/json_data/legend.json',
      guidelines: '/database/json_data/guidelines.json',
      regulations: '/database/json_data/regulations.json',
      unifiedSites: '/database/json_data/unified-sites.json'
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

  const findColleagues = (searchedInput, postingCode, weekSchedule, groupData) => {
    return Object.entries(weekSchedule.postings)
      .filter(([, code]) => code === postingCode)
      .flatMap(([group]) => groupData[group] || [])
      .filter(roll => roll !== (isNaN(searchedInput) ? searchedInput.toUpperCase() : parseInt(searchedInput, 10)))
      .join(', ')
  }

  const getEquivalentScheduleCodes = (deptCode) => {
    const cleanedDeptCode = deptCode.split('/').pop()
    const equivalents = {
      'RD*': ['R&L', 'RD'],
      'LAB*': ['R&L', 'LABS'],
      'LABS*': ['R&L', 'LABS'],
      'FP': ['FP&AY', 'FWP'],
      'AY*': ['FP&AY', 'AYUSH'],
      'AYUSH*': ['FP&AY', 'AYUSH'],
      'TB*': ['TB']
    }
    const searchCodes = new Set([deptCode, cleanedDeptCode])
    const mappedCodes = equivalents[cleanedDeptCode] || []
    mappedCodes.forEach(code => searchCodes.add(code))
    return Array.from(searchCodes)
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
    if (!cleanRoll) throw new Error('Please enter a roll number or group code.')

    const isOldSchedule = selectedDate < PIVOT_DATE
    const groupData = isOldSchedule ? appData.value.oldGroups : appData.value.groups
    const groupKey = findGroupFromRoll(cleanRoll, groupData) || cleanRoll

    if (!groupData[groupKey]) {
      const otherData = isOldSchedule ? appData.value.groups : appData.value.oldGroups
      const foundInOther = findGroupFromRoll(cleanRoll, otherData)
      if (foundInOther) {
        throw new Error(`Found in ${isOldSchedule ? 'new' : 'old'} schedule but not for selected date`)
      } else {
        throw new Error('No matching group found')
      }
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
    const colleagues = findColleagues(cleanRoll, postingCode, weekSchedule, groupData)
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

  const lookupFaculty = async (deptCode, selectedDate) => {
    if (!appData.value.schedule) {
      throw new Error('Schedule data not loaded')
    }
    
    const isOldSchedule = selectedDate < PIVOT_DATE
    const scheduleKey = isOldSchedule ? 'oldSchedule' : 'newSchedule'
    const selectedDateISO = selectedDate.toISOString().split('T')[0]
    
    const weekSchedule = appData.value.schedule[scheduleKey]?.find(w => 
      selectedDateISO >= w.startDate && selectedDateISO <= w.endDate
    )

    if (!weekSchedule || !weekSchedule.postings) {
      throw new Error('No schedule found for selected date')
    }

    const postingsBySite = {}
    const searchCodes = getEquivalentScheduleCodes(deptCode)

    for (const [groupCode, code] of Object.entries(weekSchedule.postings)) {
      if (searchCodes.includes(code)) {
        const groupLetter = groupCode.charAt(0)
        const detailedWeek = appData.value[`group${groupLetter}`]?.[scheduleKey]?.find(w => 
          w.startDate === weekSchedule.startDate && w.endDate === weekSchedule.endDate
        )
        
        if (detailedWeek && detailedWeek.postings && detailedWeek.postings[groupCode]) {
          const rawCode = detailedWeek.postings[groupCode]
          const canonicalCode = getCanonicalPostingCode(rawCode)
          const site = appData.value.legend?.legend?.find(item => item.code === canonicalCode)?.site || rawCode
          
          const groupMembers = appData.value[isOldSchedule ? 'oldGroups' : 'groups']?.[groupCode]
          if (groupMembers && Array.isArray(groupMembers)) {
            postingsBySite[site] = postingsBySite[site] || []
            postingsBySite[site].push(...groupMembers)
          }
        }
      }
    }

    if (Object.keys(postingsBySite).length === 0) {
      throw new Error('No students found for selected date')
    }

    return Object.entries(postingsBySite).map(([site, rolls]) => ({
      site,
      students: rolls.join(', ')
    }))
  }

  const lookupUnifiedSite = async (siteName, selectedDate) => {
    if (!appData.value.unifiedSites?.unifiedSites) {
      throw new Error('Unified sites data not loaded')
    }
    
    const unifiedSite = appData.value.unifiedSites.unifiedSites.find(s => s.name === siteName)
    
    if (!unifiedSite) {
      throw new Error(`Unified site "${siteName}" not found`)
    }
    
    if (!unifiedSite.postings || !Array.isArray(unifiedSite.postings)) {
      throw new Error(`Unified site "${siteName}" has no valid postings configuration`)
    }

    const isOldSchedule = selectedDate < PIVOT_DATE
    const scheduleKey = isOldSchedule ? 'oldSchedule' : 'newSchedule'
    const groupData = isOldSchedule ? appData.value.oldGroups : appData.value.groups
    const selectedDateISO = selectedDate.toISOString().split('T')[0]

    const studentsByPosting = {}
    const contributingCodes = unifiedSite.postings.map(p => p.code)

    for (const groupLetter of ['A', 'B', 'C', 'D']) {
      const groupScheduleData = appData.value[`group${groupLetter}`]?.[scheduleKey]
      if (!groupScheduleData || !Array.isArray(groupScheduleData)) {
        continue;
      }

      const weekSchedule = groupScheduleData.find(w =>
        selectedDateISO >= w.startDate && selectedDateISO <= w.endDate
      )

      if (weekSchedule && weekSchedule.postings && typeof weekSchedule.postings === 'object') {
        for (const [groupCode, postingCode] of Object.entries(weekSchedule.postings)) {
          const canonicalCode = getCanonicalPostingCode(postingCode)

          if (contributingCodes.includes(canonicalCode)) {
            const members = groupData?.[groupCode]
            
            if (!members || !Array.isArray(members) || members.length === 0) {
              continue;
            }

            const rule = unifiedSite.postings.find(p => p.code === canonicalCode)
            if (!rule) {
              continue;
            }

            if (!studentsByPosting[canonicalCode]) {
              studentsByPosting[canonicalCode] = {
                rule: rule,
                members: new Set()
              }
            }
            members.forEach(student => studentsByPosting[canonicalCode].members.add(student))
          }
        }
      }
    }
    
    if (Object.keys(studentsByPosting).length === 0) {
      throw new Error('No students found for this site on the selected date.')
    }

    const results = []
    const sortedPostingCodes = Object.keys(studentsByPosting).sort()

    for (const code of sortedPostingCodes) {
      const { rule, members: memberSet } = studentsByPosting[code]
      const sortedMembers = Array.from(memberSet).sort((a, b) => {
        const numA = parseInt(String(a).replace('R', ''), 10)
        const numB = parseInt(String(b).replace('R', ''), 10)
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB
        return String(a).localeCompare(String(b))
      })

      if (sortedMembers.length > 0) {
        let studentsText
        if (rule.count === "all" || rule.count >= sortedMembers.length) {
          studentsText = sortedMembers.join(', ')
        } else {
          const count = rule.count
          const countText = { 1: 'One', 2: 'Two', 3: 'Three' }[count] || count
          const plural = count > 1 ? 's' : ''
          studentsText = `${countText} intern${plural} from [${sortedMembers.join(', ')}]`
        }
        
        const legendEntry = appData.value.legend?.legend?.find(item => item.code === code)
        const siteName = legendEntry?.site || code
        
        results.push({ site: siteName, students: studentsText })
      }
    }
    return results
  }

  return {
    appData,
    loadData,
    lookupStudent,
    lookupFaculty,
    lookupUnifiedSite
  }
}