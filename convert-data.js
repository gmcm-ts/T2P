const fs = require('fs');
const path = require('path');

// --- Configuration ---
const tsvDir = path.join(__dirname, 'database', 'TSV_data');
const outputDir = path.join(__dirname, 'database', 'json_data');

// --- Helper Functions ---

/**
 * Formats a date string from "DD MMM YY" to "YYYY-MM-DD".
 * @param {string} dateStr The date string to format.
 * @returns {string|null} The formatted date string or null if invalid.
 */
function formatTsvDate(dateStr) {
    // Handle cases like "04 JAN 26" -> "04 JAN 2026"
    const dateWithFullYear = dateStr.replace(/(\d{2})$/, '20$1');
    const dateObj = new Date(dateWithFullYear);
    if (isNaN(dateObj.getTime())) {
        console.warn(`Warning: Invalid date string encountered: "${dateStr}"`);
        return null;
    }
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Parses the 'At a Glance' TSV file to create the schedule data.
 * @param {string} tsvContent The raw string content of the TSV file.
 * @returns {object} An object containing old and new schedule data.
 */
function parseScheduleTsv(tsvContent) {
    const lines = tsvContent.split(/\r?\n/).filter(line => line.trim() && !line.startsWith('COMPLETE SCHEDULE') && !line.startsWith('DURATION'));
    const result = { oldSchedule: [], newSchedule: [] };
    let currentSchedule = result.oldSchedule;
    let departments = [];

    // Helper to expand group codes like "A1-A11,A12" into ["A1", "A2", ..., "A11", "A12"]
    const expandGroupCodes = (codeStr) => {
        if (!codeStr || !codeStr.trim()) return [];
        const expanded = new Set();
        codeStr.split(',').map(p => p.trim()).forEach(part => {
            const rangeMatch = part.match(/^([A-D])(\d{1,2})-(?:[A-D])?(\d{1,2})$/);
            if (rangeMatch) {
                const [, prefix, start, end] = rangeMatch;
                for (let i = parseInt(start, 10); i <= parseInt(end, 10); i++) {
                    expanded.add(`${prefix}${i}`);
                }
            } else if (part) {
                expanded.add(part);
            }
        });
        return Array.from(expanded);
    };

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.includes('NEW SCHEDULE - DEPARTMENTS') || trimmedLine.includes('NEW DURATION')) {
            currentSchedule = result.newSchedule;
            departments = []; // Reset departments for the new schedule
            continue;
        }

        const columns = line.split('\t').map(c => c.trim());

        if (columns.some(c => ['PSM', 'GM', 'GS', 'OBG'].includes(c))) { // Header row
            departments = columns.slice(1).filter(Boolean);
        } else if (columns[0] && columns[0].match(/\d{1,2} [A-Z]{3} \d{2}/)) { // Data row
            if (departments.length === 0) continue;

            const [dateRangeStr, ...groupCodeCells] = columns;
            const [startStr, endStr] = dateRangeStr.split(' - ').map(s => s.trim());
            const startDate = formatTsvDate(startStr);
            const endDate = formatTsvDate(endStr);

            if (!startDate || !endDate) continue; // Skip if dates are invalid

            const weekSchedule = { startDate, endDate, postings: {} };
            groupCodeCells.forEach((cellContent, index) => {
                const department = departments[index];
                if (department) {
                    expandGroupCodes(cellContent).forEach(code => {
                        weekSchedule.postings[code] = department;
                    });
                }
            });
            currentSchedule.push(weekSchedule);
        }
    }
    return result;
}

/**
 * Parses a detailed group schedule TSV file (e.g., 'Group A.tsv').
 * @param {string} tsvContent The raw string content of the TSV file.
 * @returns {object} An object containing old and new schedule data.
 */
function parseDetailedGroupSchedule(tsvContent) {
    const lines = tsvContent.split(/\r?\n/);
    const result = {
        oldSchedule: [],
        newSchedule: []
    };
    let currentSchedule = result.oldSchedule;
    let headers = [];

    for (const line of lines) {
        const trimmedLine = line.trim();
        // Skip empty lines or the top-level title
        if (!trimmedLine || trimmedLine.includes('Detailed view')) continue;

        // Switch to parsing the new schedule when we see the marker
        if (trimmedLine.includes('NEW SCHEDULE') || trimmedLine.includes('NEW DURATION')) {
            currentSchedule = result.newSchedule;
            headers = []; // Reset headers for the new schedule section
            continue;
        }

        const columns = line.split('\t').map(c => c.trim());

        // Identify header rows.
        // The old schedule header starts with "DURATION".
        // The new schedule header starts with an empty column, followed by group codes.
        if (columns[0].toUpperCase() === 'DURATION' || (columns[0] === '' && columns[1] && columns[1].match(/^[A-D]\d{1,2}$/))) {
            headers = columns.slice(1).filter(Boolean);
            continue; // Found headers, move to next line
        }

        // Skip roll number lines. They also start with an empty column, but the second column is a list of numbers.
        if (columns[0] === '' && columns[1] && columns[1].match(/^\d/)) {
            continue;
        }

        // Process data rows, which start with a date.
        if (columns[0] && columns[0].match(/\d{1,2} [A-Z]{3} \d{2}/)) {
            // If we haven't found a header for the current schedule part, skip.
            if (headers.length === 0) continue;

            const [dateRangeStr, ...postingCells] = columns;
            const [startStr, endStr] = dateRangeStr.split(' - ').map(s => s.trim());
            const startDate = formatTsvDate(startStr);
            const endDate = formatTsvDate(endStr);

            if (!startDate || !endDate) continue;

            const weekSchedule = { startDate, endDate, postings: {} };
            postingCells.forEach((posting, index) => {
                const groupCode = headers[index];
                if (groupCode && posting) {
                    weekSchedule.postings[groupCode] = posting;
                }
            });
            currentSchedule.push(weekSchedule);
        }
    }
    return result;
}

/**
 * Parses the 'NEW Group Codes' TSV file to create the group data.
 * @param {string} tsvContent The raw string content of the TSV file.
 * @returns {object} The structured group data.
 */
function parseGroupCodesTsv(tsvContent) {
    const lines = tsvContent.split(/\r?\n/);
    const groupData = {};

    const parseRolls = (rollStr) => {
        if (!rollStr) return [];
        return rollStr.split(',')
            .map(r => r.trim().replace('*', ''))
            .filter(r => r) // Remove empty strings
            .map(r => {
                // Keep as string if it starts with 'R', otherwise parse as number
                return r.toUpperCase().startsWith('R') ? r.toUpperCase() : parseInt(r, 10);
            });
    };

    let startParsing = false;
    for (const line of lines) {
        if (line.startsWith('CODE\tROLL. NO.')) {
            startParsing = true;
            continue;
        }
        if (!startParsing) continue;
        if (line.startsWith('Directions to Candidates')) break; // Stop parsing here

        const columns = line.split('\t').map(c => c.trim());
        if (columns.length < 2 || !columns[0]) continue; // Skip empty or malformed lines

        // Process up to 4 groups (8 columns) per line
        for (let j = 0; j < 8; j += 2) {
            const code = columns[j];
            const rolls = columns[j + 1];
            if (code && rolls) {
                groupData[code] = parseRolls(rolls);
            }
        }
    }
    return groupData;
}

/**
 * Parses the 'Legend' TSV file.
 * @param {string} tsvContent The raw string content of the TSV file.
 * @returns {object} Structured legend data.
 */
function parseLegendTsv(tsvContent) {
    const lines = tsvContent.split(/\r?\n/);
    const legend = [];
    let note = '';
    let parsingLegend = false;

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('CODE\tSITE\tSPLIT')) {
            parsingLegend = true;
            continue;
        }
        if (!parsingLegend || !trimmedLine) continue;

        const columns = line.split('\t');
        if (columns.length >= 3 && columns[0]) {
            legend.push({
                code: columns[0].trim(),
                site: columns[1].trim(),
                split: columns[2].trim()
            });
        } else if (columns.length === 1 && trimmedLine) {
            // Assume single-column lines at the end are part of the note
            note += (note ? ' ' : '') + trimmedLine;
        }
    }
    return { legend, note };
}

/**
 * Parses the 'Guidelines' TSV file.
 * @param {string} tsvContent The raw string content of the TSV file.
 * @returns {object[]} Structured guidelines data.
 */
function parseGuidelinesTsv(tsvContent) {
    const lines = tsvContent.split(/\r?\n/).filter(line => line.trim());
    const guidelines = [];
    let currentGuideline = null;

    for (const line of lines) {
        const titleMatch = line.match(/^(\d+\.\s.*)/);
        if (titleMatch) {
            if (currentGuideline) guidelines.push(currentGuideline);
            currentGuideline = {
                title: titleMatch[1].trim(),
                points: []
            };
        } else if (currentGuideline) {
            currentGuideline.points.push(line.trim());
        }
    }
    if (currentGuideline) guidelines.push(currentGuideline); // Add the last one
    return guidelines;
}

/**
 * Parses the 'Regulations' TSV file.
 * @param {string} tsvContent The raw string content of the TSV file.
 * @returns {object} Structured regulations data.
 */
function parseRegulationsTsv(tsvContent) {
    const lines = tsvContent.split(/\r?\n/);
    const regulations = [];
    let note = '';
    let startParsing = false;

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('Abbreviation used')) {
            startParsing = true;
            continue;
        }
        if (!startParsing || !trimmedLine) continue;

        if (trimmedLine.startsWith('*Electives')) {
            note = trimmedLine;
            continue;
        }

        const columns = line.split('\t').map(c => c.trim());
        if (columns.length >= 3 && columns[0]) {
            regulations.push({
                abbreviation: columns[0],
                department: columns[1],
                duration: columns[2]
            });
        }
    }
    return { regulations, note };
}

// --- Main Script Logic ---
try {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log(`Created output directory: ${outputDir}`);
    }

    console.log(`Scanning for TSV files in ${tsvDir}...`);
    const files = fs.readdirSync(tsvDir);
    let filesConverted = 0;

    for (const file of files) {
        if (file.endsWith('.tsv')) {
            const filePath = path.join(tsvDir, file);
            const tsvContent = fs.readFileSync(filePath, 'utf-8');
            let outputPath;
            let data;
            let fileName = path.basename(file);

            if (file.includes('At a Glance')) {
                console.log(`- Processing 'At a Glance' schedule: ${fileName}`);
                data = parseScheduleTsv(tsvContent);
                outputPath = path.join(outputDir, 'schedule-data.json');
            } else if (file.match(/Group [A-D][ .]/i)) {
                const groupName = file.match(/Group [A-D]/i)[0].toLowerCase().replace(' ', '-');
                console.log(`- Processing detailed schedule: ${fileName}`);
                data = parseDetailedGroupSchedule(tsvContent);
                outputPath = path.join(outputDir, `${groupName}-schedule.json`);
            } else if (file.includes('NEW Group Codes')) {
                console.log(`- Processing NEW group codes: ${fileName}`);
                data = parseGroupCodesTsv(tsvContent);
                outputPath = path.join(outputDir, 'group-data.json');
            } else if (file.includes('Group Codes')) { // Must be after 'NEW Group Codes' to be correctly identified
                console.log(`- Processing OLD group codes: ${fileName}`);
                data = parseGroupCodesTsv(tsvContent);
                outputPath = path.join(outputDir, 'old-group-data.json');
            } else if (file.includes('Legend')) {
                console.log(`- Processing legend: ${fileName}`);
                data = parseLegendTsv(tsvContent);
                outputPath = path.join(outputDir, 'legend.json');
            } else if (file.includes('Guidelines')) {
                console.log(`- Processing guidelines: ${fileName}`);
                data = parseGuidelinesTsv(tsvContent);
                outputPath = path.join(outputDir, 'guidelines.json');
            } else if (file.includes('Regulations')) {
                console.log(`- Processing regulations: ${fileName}`);
                data = parseRegulationsTsv(tsvContent);
                outputPath = path.join(outputDir, 'regulations.json');
            } else {
                console.log(`- Skipping unrecognized TSV file: ${fileName}`);
            }

            if (outputPath && data) {
                fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
                console.log(`  ✅ Success! Converted and saved to ${path.basename(outputPath)}\n`);
                filesConverted++;
            }
        }
    }

    if (filesConverted === 0) {
        console.log('⚠️ No TSV files were found or converted. Make sure TSV files are in the database/TSV_data folder.');
    }

} catch (error) {
    console.error(`❌ Error during conversion: ${error.message}`);
}