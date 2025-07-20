# T2P - Internship Schedule Viewer

**Live Site**: [https://gmc-mbnr.github.io/T2P/]

A streamlined, responsive web application for viewing medical internship schedules at Government General Hospital, Mahabubnagar. This tool provides instant access to posting details for both students and faculty.

## Overview

This application eliminates the need to manually parse complex schedule spreadsheets. By simply entering a roll number or selecting a department, users can get immediate, clear, and accurate information about their current or future postings. The app is designed to be fast, intuitive, and mobile-friendly, ensuring information is always accessible. It intelligently handles multiple schedule periods, automatically displaying the correct data based on the selected date.

## Key Features

- **Dual-Mode Interface**: Seamlessly switch between `Student View` and `Faculty View`.
- **Date-Aware Scheduling**:
    - Includes a date picker to look up schedules for any day.
    - Automatically transitions between past and future schedule versions based on the effective date (`21 July 2025`).
- **Student-Specific Lookups**:
    - Search by **Roll Number** or **Group Code** (e.g., `141`, `A1`, `B12`).
    - Instantly view your **Department**, **Posting Site**, and specific **Daily Tasks**.
    - See a list of **Colleagues** assigned to the same posting.
    - Receive a random **Daily Guideline** to reinforce best practices.
- **Faculty & Department View**:
    - Select a department from a dropdown list.
    - Get a comprehensive list of all students and their specific posting sites within that department for the selected date.
    - **Fuzzy Search**: The underlying logic supports searching departments by various aliases and abbreviations (e.g., 'ENT', 'Otorhinolaryngology', 'Nose' all point to the same department).
- **Responsive & User-Friendly**:
    - Clean, modern UI optimized for both desktop and mobile devices.
    - Real-time feedback and clear error messaging.
    - Dark mode theme for comfortable viewing.

## How to Use

1.  **Select Your Role**: Use the toggle to switch between **Student** and **Faculty** mode. The interface will adapt accordingly.
2.  **Choose a Date**: The app defaults to today's date. Click the date text to open a calendar and select a different day.
3.  **Get Your Schedule**:
    - **As a Student**: Enter your roll number (e.g., `123`) or group code (e.g., `A5`) and click "Go".
    - **As a Faculty Member**: Select a department from the dropdown list. The results will appear instantly.
4.  **Review Results**: The app will display the relevant posting details in clear, easy-to-read cards.

## Technical Stack

-   **Frontend**: HTML5, CSS3, and modern Vanilla JavaScript (ES6+).
-   **Styling**: Pure CSS with Flexbox and Grid for responsive layouts. No external frameworks are used.
-   **Data**: All schedule information is loaded from static JSON files, making the app fast and server-independent.
-   **Core Logic**:
    -   Asynchronous data fetching with `Promise.all`.
    -   Efficient in-memory data lookups.
    -   Custom fuzzy search implementation for department queries.

## Project Structure

```
.
├── index.html              # Main application file
├── index.tsx               # (Currently empty, can be used for future TS/React migration)
├── README.md               # You are here!
└── database/
    └── json_data/
        ├── group-*-schedule.json # Detailed weekly schedules for each major group
        ├── group-data.json       # Mappings of groups to roll numbers
        ├── legend.json           # Definitions for posting codes (site, tasks)
        ├── regulations.json      # NMC regulations and department names/durations
        ├── guidelines.json       # Daily guidelines for students
        └── schedule-data.json    # "At-a-glance" schedule for major department rotations
```

## Development & Tooling

This project is developed using **Visual Studio Code** and prototyped iteratively with **Google's Gemini AI Studio**. It is hosted as a static site on **GitHub Pages**.

## Setup and Deployment

This project is a static website and requires no backend or build process.

1.  **Clone the repository.**
2.  **Serve the files**: Use any static web server. For local development, you can use:
    -   VS Code's [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.
    -   Python's built-in server: `python -m http.server`
3.  **Deployment**: Deploy the contents of the folder to any static hosting service like GitHub Pages, Vercel, or Netlify.

## Contributing

Found a bug or have a suggestion? Please [open an issue](https://github.com/Devaprasad-reddy/T2P/issues/new) on the GitHub repository. Clear reports with steps to reproduce are greatly appreciated.

Feel free to contribute by submitting pull requests or suggesting improvements.