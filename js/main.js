const appData = {};
const fuzzyDeptSearch = {};
let currentMode = 'student'; // 'student' or 'faculty'
let selectedDate = new Date();
const PIVOT_DATE = new Date('2025-07-21T00:00:00Z'); // The date the new schedule starts

document.addEventListener("DOMContentLoaded", () => {
  const rollInputElement = document.getElementById("rollInput");
  const searchButton = document.getElementById("searchButton");
  const statusElement = document.getElementById("result-status");
  const dateWrapper = document.getElementById("date-wrapper");
  const dateElement = document.getElementById("current-date");
  const datePicker = document.getElementById("date-picker");
  const modeToggle = document.getElementById("mode-toggle-switch");
  const studentInput = document.getElementById("student-input-container");
  const facultyInput = document.getElementById("faculty-input-container");
  const departmentSelect = document.getElementById("department-select");

  function updateDateDisplay(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const displayDate = new Date(date);
    displayDate.setHours(0, 0, 0, 0);

    dateElement.textContent = today.getTime() === displayDate.getTime() 
      ? `Today is ${date.toLocaleDateString('en-US', options)}`
      : `Showing for: ${date.toLocaleDateString('en-US', options)}`;
  }

  // Initial setup
  updateDateDisplay(selectedDate);
  datePicker.value = selectedDate.toISOString().split('T')[0];

  dateWrapper.addEventListener('click', () => {
    dateElement.style.display = 'none';
    datePicker.style.display = 'block';
    datePicker.focus();
  });

  datePicker.addEventListener('change', () => {
    if (!datePicker.value) {
      selectedDate = new Date();
    } else {
      selectedDate = new Date(datePicker.value + 'T00:00:00');
    }
    updateDateDisplay(selectedDate);
    datePicker.style.display = 'none';
    dateElement.style.display = 'block';

    if (currentMode === 'student' && rollInputElement.value.trim()) {
      lookupStudent();
    } else if (currentMode === 'faculty' && departmentSelect.value.trim()) {
      lookupFaculty(departmentSelect.options[departmentSelect.selectedIndex].dataset.code);
    }
  });

  datePicker.addEventListener('blur', () => {
    datePicker.style.display = 'none';
    dateElement.style.display = 'block';
  });

  modeToggle.addEventListener('change', () => {
    currentMode = modeToggle.checked ? 'faculty' : 'student';
    studentInput.style.display = currentMode === 'student' ? 'block' : 'none';
    facultyInput.style.display = currentMode === 'faculty' ? 'block' : 'none';
    document.getElementById('student-results-container').style.display = 'none';
    document.getElementById('faculty-results-container').style.display = 'none';
    statusElement.textContent = '';
    rollInputElement.value = '';
    departmentSelect.value = '';
    searchButton.innerHTML = 'Go';
  });

  searchButton.addEventListener('click', () => {
    const studentResultsContainer = document.getElementById('student-results-container');
    if (studentResultsContainer.style.display === 'flex') {
      studentResultsContainer.style.display = 'none';
      rollInputElement.value = '';
      statusElement.textContent = '';
      searchButton.innerHTML = 'Go';
    } else {
      lookupStudent();
    }
  });

  // Load all data files concurrently
  const dataFiles = {
    groups: 'database/json_data/group-data.json',
    oldGroups: 'database/json_data/old-group-data.json',
    schedule: 'database/json_data/schedule-data.json',
    groupA: 'database/json_data/group-a-schedule.json',
    groupB: 'database/json_data/group-b-schedule.json',
    groupC: 'database/json_data/group-c-schedule.json',
    groupD: 'database/json_data/group-d-schedule.json',
    legend: 'database/json_data/legend.json',
    guidelines: 'database/json_data/guidelines.json',
    regulations: 'database/json_data/regulations.json',
  };

  const promises = Object.entries(dataFiles).map(([key, url]) =>
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load ${url}`);
        return res.json();
      })
      .then(data => { appData[key] = data; })
  );

  Promise.all(promises)
    .then(() => {
      console.log("All data loaded successfully:", appData);
      populateDepartmentDatalist();
      buildFuzzySearchData();
      departmentSelect.disabled = false;
      rollInputElement.placeholder = "Enter Roll No. or Group";
      rollInputElement.disabled = false;
      searchButton.disabled = false;
    })
    .catch(error => {
      console.error("Error loading application data:", error);
      statusElement.textContent = "Failed to load data. Please refresh.";
      rollInputElement.placeholder = "Error";
    });

  rollInputElement.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      lookupStudent();
    }
  });

  departmentSelect.addEventListener('change', () => {
    const selectedDepartment = departmentSelect.value;
    if (selectedDepartment) {
      const dept = appData.regulations.regulations.find(r => r.department === selectedDepartment);
      if (dept) {
        lookupFaculty(dept.abbreviation);
      }
    } else {
      document.getElementById('faculty-results-container').style.display = 'none';
      document.getElementById("result-status").textContent = '';
    }
  });
});

function populateDepartmentDatalist() {
  const departmentSelect = document.getElementById("department-select");
  departmentSelect.innerHTML = '<option value="">Select a department...</option>';
  appData.regulations.regulations.forEach(reg => {
    if (reg.department && !reg.department.includes('TOTAL')) {
      const option = document.createElement('option');
      option.value = reg.department;
      option.dataset.code = reg.abbreviation;
      option.textContent = reg.department;
      departmentSelect.appendChild(option);
    }
  });
}

function buildFuzzySearchData() {
  appData.regulations.regulations.forEach(reg => {
    if (!reg.department || reg.department.includes('TOTAL')) return;

    const code = reg.abbreviation;
    const name = reg.department.toLowerCase();
    const terms = [
      ...name.split(/[\/,&\(\)]+/).map(t => t.trim()).filter(t => t.length > 1),
      name,
      code.replace('*', '').toLowerCase()
    ];

    const customAliases = {
      'PSM': ['psm', 'cm', 'community', 'social', 'preventive', 'medicine'],
      'GM': ['gm', 'medicine', 'general'],
      'GS': ['gs', 'surgery', 'general'],
      'OBG': ['obg', 'obs', 'gyn', 'gynae', 'obstetrics', 'gynaecology'],
      'PED': ['ped', 'paediatrics', 'pediatrics'],
      'ORT': ['ort', 'ortho', 'pmr', 'rehabilitation', 'physical medicine'],
      'OPT': ['opt', 'eye', 'ophth', 'ophthalmology'],
      'ENT': ['ent', 'ear', 'nose', 'throat', 'otorhinolaryngology'],
      'EM': ['em', 'emergency', 'casualty', 'trauma'],
      'ANS': ['ans', 'anesthesia', 'anaesthesia', 'critical', 'care'],
      'PSY': ['psy', 'psych', 'psychiatry'],
      'DVL': ['dvl', 'derm', 'skin', 'venereology', 'leprosy', 'dermatology'],
      'FP': ['fp', 'family', 'welfare', 'planning'],
      'FMT': ['fmt', 'forensic', 'toxicology'],
      'RD*': ['rd', 'radio', 'radiology', 'diagnosis', 'r&l'],
      'LAB*': ['lab', 'path', 'micro', 'pathology', 'microbiology', 'r&l', 'labs'],
      'R&L': ['r&l', 'rl', 'radiology', 'lab', 'pathology', 'radio', 'labs'],
      'TB*': ['tb', 'dots', 'tuberculosis', 'center'],
      'AY*': ['ay', 'ayur', 'ayurvedic', 'medicine']
    };

    new Set([...terms, ...(customAliases[code] || [])]).forEach(term => {
      fuzzyDeptSearch[term] = { name: reg.department, code };
    });
  });
}

function findGroupFromRoll(roll, groupData) {
  const numericRoll = parseInt(roll, 10);
  const searchKey = isNaN(numericRoll) ? roll.toUpperCase() : numericRoll;
  return Object.entries(groupData).find(([, rolls]) => rolls.includes(searchKey))?.[0];
}

function findColleagues(searchedInput, postingCode, weekSchedule, groupData) {
  return Object.entries(weekSchedule.postings)
    .filter(([, code]) => code === postingCode)
    .flatMap(([group]) => groupData[group] || [])
    .filter(roll => roll !== (isNaN(searchedInput) ? searchedInput.toUpperCase() : parseInt(searchedInput, 10)))
    .join(', ');
}

function getEquivalentScheduleCodes(deptCode) {
  // Handle potential data entry errors like "R/RD*" by taking the part after the last slash.
  const cleanedDeptCode = deptCode.split('/').pop();

  const equivalents = {
    // Maps the regulation deptCode to its variations in old ('R&L', 'FP&AY') and new ('RD', 'LABS', etc.) schedule files.
    'RD*': ['R&L', 'RD'],
    'LAB*': ['R&L', 'LABS'],
    'FP': ['FP&AY', 'FWP'],
    'AY*': ['FP&AY', 'AYUSH'],
    'TB*': ['TB'] // e.g. TB* in regulations is TB in schedule
  };

  // Use a Set to gather all possible codes (original, cleaned, and mapped) to avoid duplicates.
  const searchCodes = new Set([deptCode, cleanedDeptCode]);
  const mappedCodes = equivalents[cleanedDeptCode] || [];
  mappedCodes.forEach(code => searchCodes.add(code));

  return Array.from(searchCodes);
}

function getCanonicalPostingCode(postingCode) {
  const variations = {
    'GM - FMTW': 'GM - FMW', // Corrects a typo in old schedule data
    'FP & AY': 'FP&AY'      // Normalizes spacing from 'FP & AY' to 'FP&AY' for consistency
  };
  // The R&L and LABS mappings were incorrect and conflicting with getEquivalentScheduleCodes.
  // This function should only handle minor data variations, not logical code mapping.
  return variations[postingCode] || postingCode;
}

function lookupStudent() {
  const statusElement = document.getElementById("result-status");
  const resultsContainer = document.getElementById("student-results-container");
  statusElement.textContent = "";
  resultsContainer.style.display = "none";

  const rollInput = document.getElementById("rollInput").value.trim().toUpperCase().replace(/^R0+/, 'R');
  if (!rollInput) return statusElement.textContent = "Please enter a roll number or group code.";

  const isOldSchedule = selectedDate < PIVOT_DATE;
  const groupData = isOldSchedule ? appData.oldGroups : appData.groups;
  const groupKey = findGroupFromRoll(rollInput, groupData) || rollInput;

  if (!groupData[groupKey]) {
    const otherData = isOldSchedule ? appData.groups : appData.oldGroups;
    const foundInOther = findGroupFromRoll(rollInput, otherData);
    if (foundInOther) {
      statusElement.textContent = `Found in ${isOldSchedule ? 'new' : 'old'} schedule but not for selected date`;
    } else {
      statusElement.textContent = "No matching group found";
    }
    return;
  }

  const groupLetter = groupKey.charAt(0);
  const scheduleKey = isOldSchedule ? 'oldSchedule' : 'newSchedule';
  const selectedDateISO = selectedDate.toISOString().split('T')[0];
  
  const weekSchedule = appData[`group${groupLetter}`]?.[scheduleKey]?.find(w => 
    selectedDateISO >= w.startDate && selectedDateISO <= w.endDate
  );

  const atAGlanceWeek = appData.schedule[scheduleKey].find(w => 
    selectedDateISO >= w.startDate && selectedDateISO <= w.endDate
  );

  if (!weekSchedule || !atAGlanceWeek) {
    statusElement.textContent = "No schedule found for selected date";
    return;
  }

  const postingCode = weekSchedule.postings[groupKey];
  const deptCode = atAGlanceWeek.postings[groupKey];

  if (!postingCode || !deptCode) {
    statusElement.textContent = "Posting details not found";
    return;
  }

  const legendEntry = appData.legend.legend.find(item => item.code === getCanonicalPostingCode(postingCode));
  const deptEntry = appData.regulations.regulations.find(item => item.abbreviation === deptCode);
  const colleagues = findColleagues(rollInput, postingCode, weekSchedule, groupData);
  const guideline = appData.guidelines[Math.floor(Math.random() * appData.guidelines.length)];

  document.getElementById('result-department').textContent = deptEntry?.department || deptCode;
  document.getElementById('result-site').textContent = legendEntry?.site || postingCode;
  document.getElementById('result-task').textContent = legendEntry?.split || "No task description";
  document.getElementById('result-colleagues').textContent = colleagues || "No colleagues found";
  document.getElementById('guideline-title').textContent = guideline.title;
  document.getElementById('guideline-text').textContent = guideline.points.join(' ');

  resultsContainer.style.display = "flex";
  document.getElementById("searchButton").innerHTML = '❌';
}

function lookupFaculty(deptCode) {
  console.log(`[lookupFaculty] Starting lookup for deptCode: "${deptCode}"`);
  const statusElement = document.getElementById("result-status");
  const resultsContainer = document.getElementById("faculty-results-container");
  statusElement.textContent = "";
  resultsContainer.style.display = "none";
  resultsContainer.innerHTML = '';

  const isOldSchedule = selectedDate < PIVOT_DATE;
  const scheduleKey = isOldSchedule ? 'oldSchedule' : 'newSchedule';
  console.log(`[lookupFaculty] Schedule type: ${scheduleKey}`);
  const selectedDateISO = selectedDate.toISOString().split('T')[0];
  
  const weekSchedule = appData.schedule[scheduleKey].find(w => 
    selectedDateISO >= w.startDate && selectedDateISO <= w.endDate
  );

  if (!weekSchedule) {
    console.error(`[lookupFaculty] No schedule found for date: ${selectedDateISO}`);
    statusElement.textContent = "No schedule found for selected date";
    return;
  }
  console.log(`[lookupFaculty] Found schedule week: ${weekSchedule.startDate} to ${weekSchedule.endDate}`);

  const postingsBySite = {};
  const searchCodes = getEquivalentScheduleCodes(deptCode);
  console.log(`[lookupFaculty] Searching for department codes:`, searchCodes);

  for (const [groupCode, code] of Object.entries(weekSchedule.postings)) {
    if (searchCodes.includes(code)) {
      // Found a group in the main schedule that matches the department.
      // Now, get the detailed posting site from the group-specific schedule.
      const groupLetter = groupCode.charAt(0);
      const detailedWeek = appData[`group${groupLetter}`]?.[scheduleKey]?.find(w => 
        w.startDate === weekSchedule.startDate && w.endDate === weekSchedule.endDate
      );
      
      if (detailedWeek && detailedWeek.postings[groupCode]) {
        const rawCode = detailedWeek.postings[groupCode];
        const canonicalCode = getCanonicalPostingCode(rawCode);
        const site = appData.legend.legend.find(item => item.code === canonicalCode)?.site || rawCode;
        
        const groupMembers = appData[isOldSchedule ? 'oldGroups' : 'groups'][groupCode];
        if (groupMembers) {
            postingsBySite[site] = postingsBySite[site] || [];
            postingsBySite[site].push(...groupMembers);
        } else {
            console.warn(`[lookupFaculty] Group code "${groupCode}" found in schedule but not in group data.`);
        }
      }
    }
  }

  console.log('[lookupFaculty] Final student list by site:', postingsBySite);
  if (Object.keys(postingsBySite).length === 0) {
    statusElement.textContent = "No students found for selected date";
    return;
  }

  resultsContainer.innerHTML = `<ul>${
    Object.entries(postingsBySite).map(([site, rolls]) => 
      `<li><strong>${site}:</strong><br>${rolls.join(', ')}</li>`
    ).join('')
  }</ul>`;
  resultsContainer.style.display = 'block';
}