// script.js

// DOM elements
const appointmentLink = document.getElementById('appointment-link');
const showupLink = document.getElementById('showup-link');
const callQualityLink = document.getElementById('callquality-link');
const leaderboardContainer = document.querySelector('.leaderboard-container');
const leaderboardTitle = document.getElementById('leaderboard-title');
const searchInput = document.getElementById('search-input'); // From previous enhancements

// Export Buttons
const exportCsvBtn = document.getElementById('export-csv');
const exportPdfBtn = document.getElementById('export-pdf');

// Initialize projectOrder as an empty array
let projectOrder = [];

// SheetDB API endpoints
const APPOINTMENTS_API = 'https://sheetlabs.com/K3/Apt_SM';
const SHOWUPS_API = 'https://sheetlabs.com/K3/held_sm';
const CALLQUALITY_API = 'https://sheetlabs.com/K3/callScore_sm';

/**
 * Helper Function: Assign Crowns Based on Rankings with Ties
 * @param {Array} data - The sorted data array
 * @param {string} type - The type of leaderboard ('Appointments', 'Showups', 'AverageScoreAppointment')
 * @returns {Array} - The crowns array
 */
function assignCrowns(data, type) {
    let crowns = [];
    let currentRank = 1;
    let previousValue = null;

    data.forEach((item, index) => {
        const currentValue = item[type];
        if (currentValue !== previousValue) {
            currentRank = index + 1;
        }

        // Assign crowns based on rank
        if (currentRank === 1) {
            crowns.push('<i class="fas fa-crown" style="color: #FFD700;" title="1st Place"></i>'); // Gold
        } else if (currentRank === 2) {
            crowns.push('<i class="fas fa-crown" style="color: #C0C0C0;" title="2nd Place"></i>'); // Silver
        } else if (currentRank === 3) {
            crowns.push('<i class="fas fa-crown" style="color: #CD7F32;" title="3rd Place"></i>'); // Bronze
        } else {
            crowns.push(''); // No crown
        }

        previousValue = currentValue;
    });

    return crowns;
}

/**
 * Helper Function: Create a Project Table
 * Modified to include 'SDR' as the first header and include crowns within the SDR name cell.
 */
function createProjectTable(projectData, headers, type) {
    // Create a container for the project
    const projectContainer = document.createElement('div');
    projectContainer.className = 'mb-4'; // Margin bottom for spacing

    // Add project heading
    const projectHeading = document.createElement('h3');
    projectHeading.textContent = projectData.project;
    projectHeading.classList.add('region-heading'); // Reusing existing CSS class
    projectContainer.appendChild(projectHeading);

    // Create table
    const table = document.createElement('table');
    table.className = 'styled-table';

    // Table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // Add 'SDR' header
    const sdrTh = document.createElement('th');
    sdrTh.textContent = 'SDR';
    headerRow.appendChild(sdrTh);

    // Add other headers
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Table body
    const tbody = document.createElement('tbody');

    // Iterate through SDRs and create table rows
    projectData.data.forEach((row, index) => {
        const tr = document.createElement('tr');

        // SDR cell with crown and name
        const sdrTd = document.createElement('td');
        sdrTd.classList.add('sdr-cell'); // Add a class for styling
        sdrTd.innerHTML = `
            <span class="crown-icon">${row.crown}</span>
            <span class="sdr-name">${row['SDR']}</span>
        `;
        tr.appendChild(sdrTd);

        // Add other data columns
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header];
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    // Append table to project container
    projectContainer.appendChild(table);

    return projectContainer;
}

/**
 * Helper Function: Create a Single Table with Display Headers
 * Modified to include 'SDR' as the first header and include crowns within the SDR name cell.
 */
function createSingleTable(data, dataKeys, displayHeaders, title, type) {
    // Create a container for the table
    const tableContainer = document.createElement('div');
    tableContainer.className = 'mb-4'; // Margin bottom for spacing

    // Add heading
    const tableHeading = document.createElement('h3');
    tableHeading.textContent = title;
    tableHeading.classList.add('region-heading');
    tableContainer.appendChild(tableHeading);

    // Create table
    const table = document.createElement('table');
    table.className = 'styled-table';

    // Table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // Add 'SDR' header
    const sdrTh = document.createElement('th');
    sdrTh.textContent = 'SDR';
    headerRow.appendChild(sdrTh);

    // Add other headers with display-friendly names
    displayHeaders.forEach(displayHeader => {
        const th = document.createElement('th');
        th.textContent = displayHeader;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Table body
    const tbody = document.createElement('tbody');

    // Iterate through SDRs and create table rows
    data.forEach((row, index) => {
        const tr = document.createElement('tr');

        // SDR cell with crown and name
        const sdrTd = document.createElement('td');
        sdrTd.classList.add('sdr-cell'); // Add a class for styling
        sdrTd.innerHTML = `
            <span class="crown-icon">${row.crown}</span>
            <span class="sdr-name">${row['SDR']}</span>
        `;
        tr.appendChild(sdrTd);

        // Add other data columns
        dataKeys.forEach((key, idx) => {
            const td = document.createElement('td');
            td.textContent = row[key];
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    // Append table to container
    tableContainer.appendChild(table);

    return tableContainer;
}

/**
 * Function to render tables and set heading
 * @param {Object|Array} data - The processed data
 * @param {Array} headers - The data keys for the table
 * @param {Array} displayHeaders - The display-friendly header names
 * @param {string} title - The main heading title
 * @param {boolean} isSingleTable - Flag to indicate single table rendering
 * @param {string} type - The type of leaderboard ('Appointments', 'Showups', 'AverageScoreAppointment')
 * @param {string} searchQuery - The search query for filtering SDRs (if any)
 */
function renderTables(data, headers, title, isSingleTable = false, type = 'Appointments', searchQuery = '') {
    // Set the main heading
    leaderboardTitle.textContent = title;

    // Clear existing content
    leaderboardContainer.innerHTML = '';

    if (isSingleTable) {
        // Define display-friendly headers
        const displayHeaders = ['Project', 'Number of Appointments', 'Total Score', 'Average Score/Appointment'];
        // Create and append single table
        const table = createSingleTable(data, headers, displayHeaders, title, type);
        leaderboardContainer.appendChild(table);
    } else {
        // Initialize a Bootstrap row
        let rowDiv = document.createElement('div');
        rowDiv.className = 'row';

        // Iterate through projects and create tables
        for (let i = 0; i < projectOrder.length; i++) {
            const project = projectOrder[i];
            if (data[project] && data[project].length > 0) {
                // Define display-friendly headers
                const displayHeaders = [type];
                // Create and append project table
                const table = createProjectTable({ project: project, data: data[project] }, displayHeaders, type);

                // Wrap the table in a Bootstrap column
                const colDiv = document.createElement('div');
                colDiv.className = 'col-md-6 mb-4'; // Two tables per row with margin-bottom

                colDiv.appendChild(table);
                rowDiv.appendChild(colDiv);

                // After every two tables, append the row to the container and start a new row
                if ((i + 1) % 2 === 0 && i !== projectOrder.length - 1) {
                    leaderboardContainer.appendChild(rowDiv);
                    rowDiv = document.createElement('div');
                    rowDiv.className = 'row';
                }
            }
        }

        // Append the last row if it has any tables
        if (rowDiv.children.length > 0) {
            leaderboardContainer.appendChild(rowDiv);
        }
    }

    // Style total rows if necessary
    styleTotalRows();
}

/**
 * Function to fetch data from SheetDB API and group by Team (Project)
 * Limits each project to top 3 SDRs based on the specified type
 * Orders projects dynamically based on total appointments or showups
 * @param {string} apiUrl - The API endpoint URL
 * @param {string} type - The type of leaderboard ('Appointments', 'Showups')
 * @returns {Object|null} - The processed data grouped by Team or null on failure
 */
async function fetchLeaderboardData(apiUrl, type) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Calculate total appointments or showups per project
        const projectTotals = {};
        data.forEach(entry => {
            const project = entry.Team.trim();
            const value = parseInt(entry[type], 10) || 0;
            if (!projectTotals[project]) {
                projectTotals[project] = 0;
            }
            projectTotals[project] += value;
        });

        // Sort projects based on total appointments/showups in descending order
        projectOrder = Object.keys(projectTotals).sort((a, b) => projectTotals[b] - projectTotals[a]);

        // Process data: group by project, sort within project, assign crowns
        const processedData = {};

        projectOrder.forEach(project => {
            let projectData = data
                .filter(entry => entry.Team.trim() === project)
                .sort((a, b) => parseInt(b[type], 10) - parseInt(a[type], 10));

            // Assign crowns with ties
            const crowns = assignCrowns(projectData, type);

            // Assign crowns to the data
            projectData = projectData.slice(0, 3).map((entry, index) => ({
                SDR: entry.SDR.trim(),
                [type]: parseInt(entry[type], 10) || 0,
                crown: crowns[index] || ''
            }));

            if (projectData.length > 0) {
                processedData[project] = projectData;
            }
        });

        return processedData;
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        leaderboardContainer.innerHTML = `<p class="text-danger">Failed to load data. Please try again later.</p>`;
        return null;
    }
}

/**
 * Function to fetch Call Quality Scoring data
 * Sorts SDRs by AverageScoreAppointment in descending order and limits to top 10
 * Assigns crowns based on rankings with ties
 * Filters out SDRs with fewer than 3 appointments
 * @param {string} apiUrl - The API endpoint URL
 * @returns {Array|null} - The processed Call Quality data or null on failure
 */
async function fetchCallQualityData(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let data = await response.json();

        // Filter out SDRs with fewer than 3 appointments
        data = data.filter(entry => parseInt(entry.NumberofAppointments, 10) >= 3);

        // Check if any SDRs are left after filtering
        if (data.length === 0) {
            leaderboardContainer.innerHTML = `<p class="text-warning">No SDRs have at least 3 appointments to be eligible for the Call Quality Scoring Leaderboard.</p>`;
            return null;
        }

        // Convert AverageScoreAppointment to float for accurate sorting
        data.forEach(entry => {
            entry.AverageScoreAppointment = parseFloat(entry.AverageScoreAppointment) || 0;
        });

        // Sort data by AverageScoreAppointment in descending order
        data.sort((a, b) => b.AverageScoreAppointment - a.AverageScoreAppointment);

        // Limit to top 10 SDRs
        data = data.slice(0, 10);

        // Assign crowns with ties
        const crowns = assignCrowns(data, 'AverageScoreAppointment');

        // Assign crowns to the data
        data = data.map((entry, index) => ({
            SDR: entry.SDR.trim(),
            Project: entry.Project.trim(),
            NumberofAppointments: entry.NumberofAppointments,
            TotalScore: entry.TotalScore,
            AverageScoreAppointment: entry.AverageScoreAppointment.toFixed(2), // Format to 2 decimal places
            crown: crowns[index] || ''
        }));

        return data;
    } catch (error) {
        console.error('Error fetching Call Quality Scoring data:', error);
        leaderboardContainer.innerHTML = `<p class="text-danger">Failed to load Call Quality Scoring data. Please try again later.</p>`;
        return null;
    }
}

/**
 * Style "Total" Rows by Adding the 'total-row' Class
 * Scans all tables within the leaderboard container and styles rows containing "Total".
 */
function styleTotalRows() {
    // Select all tables within the leaderboard container
    const tables = leaderboardContainer.querySelectorAll('table');

    tables.forEach(table => {
        // Iterate through each row in the table body
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach(cell => {
                if (cell.textContent.trim().toLowerCase() === 'total') {
                    row.classList.add('total-row');
                }
            });
        });
    });
}

// Event listeners for navigation links
appointmentLink.addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent default link behavior
    leaderboardTitle.textContent = 'Loading Appointment Leaderboard...';
    const data = await fetchLeaderboardData(APPOINTMENTS_API, 'Appointments');
    if (data) {
        renderTables(
            data,
            ['Appointments'],
            'Appointment Leaderboard',
            false,
            'Appointments'
        );
    }
});

showupLink.addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent default link behavior
    leaderboardTitle.textContent = 'Loading Showups Leaderboard...';
    const data = await fetchLeaderboardData(SHOWUPS_API, 'Showups');
    if (data) {
        renderTables(
            data,
            ['Showups'],
            'Showups Leaderboard',
            false,
            'Showups'
        );
    }
});

callQualityLink.addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent default link behavior
    leaderboardTitle.textContent = 'Loading Call Quality Scoring Leaderboard...';

    const data = await fetchCallQualityData(CALLQUALITY_API);

    if (data && data.length > 0) {
        renderTables(
            data,
            ['Project', 'NumberofAppointments', 'TotalScore', 'AverageScoreAppointment'],
            'Call Quality Scoring Leaderboard',
            true,
            'AverageScoreAppointment'
        );
    } else {
        leaderboardContainer.innerHTML = `<p class="text-danger">No data available for Call Quality Scoring Leaderboard.</p>`;
    }
});

// Initial render when the page loads (default to Appointment Leaderboard)
document.addEventListener('DOMContentLoaded', async () => {
    leaderboardTitle.textContent = 'Loading Appointment Leaderboard...';
    const data = await fetchLeaderboardData(APPOINTMENTS_API, 'Appointments');
    if (data) {
        renderTables(
            data,
            ['Appointments'],
            'Appointment Leaderboard',
            false,
            'Appointments'
        );
    }
});
