const appData = {};
const fuzzyDeptSearch = {};
let currentMode = 'student';
let selectedDate = new Date();
const PIVOT_DATE = new Date('2025-07-21T00:00:00Z');

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

  // Date handling functions
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

  updateDateDisplay(selectedDate);
  datePicker.value = selectedDate.toISOString().split('T')[0];

  dateWrapper.addEventListener('click', () => {
    dateElement.style.display = 'none';
    datePicker.style.display = 'block';
    datePicker.focus();
  });

  datePicker.addEventListener('change', () => {
    selectedDate = datePicker.value ? new Date(datePicker.value + 'T00:00:00Z') : new Date();
    updateDateDisplay(selectedDate);
    datePicker.style.display = 'none';
    dateElement.style.display = 'block';
    
    if (currentMode === 'student' && rollInputElement.value.trim()) {
      lookupStudent();
    } else if (currentMode === 'faculty' && departmentSelect.value) {
      lookupFaculty(departmentSelect.options[departmentSelect.selectedIndex].dataset.code);
    }
  });

  datePicker.addEventListener('blur', () => {
    datePicker.style.display = 'none';
    dateElement.style.display = 'block';
  });

  // Mode toggle handling
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

  // Search functionality
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

  // Data loading
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

  Promise.all(Object.entries(dataFiles).map(([key, url]) => 
    fetch(url)
      .then(res => res.ok ? res.json() : Promise.reject(`Failed to load ${url}: ${res.status} ${res.statusText}`))
      .then(data => appData[key] = data)
  ))
  .then(() => {
    populateDepartmentDatalist();
    buildFuzzySearchData();
    departmentSelect.disabled = false;
    rollInputElement.placeholder = "Enter Roll No. or Group";
    rollInputElement.disabled = false;
    searchButton.disabled = false;
  })
  .catch(error => {
    console.error("Data load error:", error);
    statusElement.textContent = "Failed to load data. Please refresh.";
    rollInputElement.placeholder = "Error";
  });

  // Event listeners
  rollInputElement.addEventListener("keyup", e => e.key === "Enter" && lookupStudent());
  departmentSelect.addEventListener('change', handleDepartmentChange);
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
  const equivalents = {
    'RD*': ['R&L'], 'LAB*': ['R&L'], 'R&L': ['RD*', 'LAB*'],
    'TB*': ['TB'], 'FP': ['FP&AY'], 'AY*': ['FP&AY']
  };
  return [deptCode, ...(equivalents[deptCode] || [])];
}

function getCanonicalPostingCode(postingCode) {
  const variations = {
    'GM - FMTW': 'GM - FMW', 'FP & AY': 'FWP', 'R&L': 'RD*', 'LABS': 'LAB*'
  };
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
    return statusElement.textContent = findGroupFromRoll(rollInput, otherData)
      ? `Found in ${isOldSchedule ? 'new' : 'old'} schedule (from ${PIVOT_DATE.toLocaleDateString()})`
      : "No matching group found";
  }

  const groupLetter = groupKey.charAt(0);
  const scheduleKey = isOldSchedule ? 'oldSchedule' : 'newSchedule';
  const weekSchedule = appData[`group${groupLetter}`]?.[scheduleKey]?.find(w => 
    selectedDate >= new Date(w.startDate) && selectedDate <= new Date(w.endDate)
  );

  if (!weekSchedule) return statusElement.textContent = "No schedule found for selected date";

  const postingCode = weekSchedule.postings[groupKey];
  const deptCode = appData.schedule[scheduleKey].find(w => 
    selectedDate >= new Date(w.startDate) && selectedDate <= new Date(w.endDate)
  )?.postings[groupKey];

  if (!postingCode || !deptCode) return statusElement.textContent = "Posting details not found";

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
  const statusElement = document.getElementById("result-status");
  const resultsContainer = document.getElementById("faculty-results-container");
  statusElement.textContent = "";
  resultsContainer.style.display = "none";
  resultsContainer.innerHTML = '';

  const isOldSchedule = selectedDate < PIVOT_DATE;
  const scheduleKey = isOldSchedule ? 'oldSchedule' : 'newSchedule';
  const weekSchedule = appData.schedule[scheduleKey].find(w => 
    selectedDate >= new Date(w.startDate) && selectedDate <= new Date(w.endDate)
  );

  if (!weekSchedule) return statusElement.textContent = "No schedule found";

  const postingsBySite = Object.entries(weekSchedule.postings)
    .filter(([, code]) => getEquivalentScheduleCodes(deptCode).includes(code))
    .reduce((acc, [group, code]) => {
      const groupLetter = group.charAt(0);
      const detailedWeek = appData[`group${groupLetter}`]?.[scheduleKey]?.find(w => w.startDate === weekSchedule.startDate);
      const rawCode = detailedWeek?.postings[group];
      const canonicalCode = getCanonicalPostingCode(rawCode);
      const site = appData.legend.legend.find(item => item.code === canonicalCode)?.site || rawCode;
      return {...acc, [site]: [...(acc[site] || []), ...(appData[isOldSchedule ? 'oldGroups' : 'groups'][group] || [])]};
    }, {});

  if (!Object.keys(postingsBySite).length) return statusElement.textContent = "No students found";

  resultsContainer.innerHTML = `<ul>${Object.entries(postingsBySite).map(([site, rolls]) => 
    `<li><strong>${site}:</strong><br>${rolls.join(', ')}</li>`
  ).join('')}</ul>`;
  resultsContainer.style.display = 'block';
}

function handleDepartmentChange() {
  const selected = document.getElementById("department-select").value;
  if (!selected) return;
  const dept = appData.regulations.regulations.find(r => r.department === selected);
  dept && lookupFaculty(dept.abbreviation);
}