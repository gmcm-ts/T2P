# T2P - Internship Schedule Lookup

A comprehensive web application for managing and viewing internship schedules, designed for both students and faculty.

## Features

### Student View

- Look up internship postings by roll number or group code
- View detailed posting information:
  - Department and site location
  - Current day's focus/tasks
  - List of colleague interns in the same posting
  - Daily guideline reminders
- Supports both old and new schedules with automatic date-based switching

### Faculty View

- Search departments using fuzzy matching
- View all students currently posted in different sites
- Intelligent handling of department aliases and variations
- Supports multiple schedule periods

### Common Features

- Date selection with automatic today's date default
- Clean, responsive interface
- Real-time search and updates
- Comprehensive data validation and error handling

## Setup

This project is a static website requiring no server-side setup.

1. Ensure all JSON data files are present in the `database/json_data/` directory:
   - Schedule files (group-data.json, schedule-data.json)
   - Detailed schedules (group-a-schedule.json through group-d-schedule.json)
   - Reference data (legend.json, guidelines.json, regulations.json)
2. Host the folder on any static web host, like GitHub Pages

## Technical Details

- **Frontend Technologies**:
  - HTML5/CSS3 for structure and responsive design
  - Vanilla JavaScript for functionality
  - Modern CSS Grid and Flexbox for layouts
- **Data Management**:
  - Asynchronous JSON data loading
  - Fuzzy search implementation for department matching
  - Smart date-based schedule switching
  - Efficient data structures for quick lookups
- **User Experience**:
  - Real-time feedback
  - Intuitive mode switching
  - Comprehensive error messages
  - Mobile-responsive design
