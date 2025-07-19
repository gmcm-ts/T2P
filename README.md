# T2P - Student Group Lookup

A simple, fast, static web application to look up a student's group based on their roll number.

## Features
- Fetches group data from an external JSON file.
- Provides a clean interface to search for a group by roll number.
- Supports both numeric and alphanumeric (e.g., "R5") roll numbers.
- User-friendly feedback during data loading and for search results.

## Setup
This project is a static website and requires no special server-side setup.
1.  Ensure the `group-data.json` file is present in the root directory and contains the group mappings.
2.  Host the folder (containing `index.html` and `group-data.json`) on any static web host, like GitHub Pages.

## How it Works
-   **HTML5/CSS3**: Structures and styles the user interface.
-   **JavaScript**:
    -   On page load, it asynchronously fetches the `group-data.json` file.
    -   It handles user input to search for a roll number within the loaded data.
    -   It dynamically displays the result to the user.
-   **GitHub Pages**: Used for hosting the static website.
