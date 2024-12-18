// script.js

// DOM elements
const appointmentLink = document.getElementById('appointment-link');
const showupLink = document.getElementById('showup-link');
const callQualityLink = document.getElementById('callquality-link');
const dagsmejanTasksLink = document.getElementById('dagsmejan-tasks-link'); // New link
const leaderboardContainer = document.querySelector('.leaderboard-container');
const leaderboardTitle = document.getElementById('leaderboard-title');

// Export Buttons (Assuming they exist; remove if not needed)
const exportCsvBtn = document.getElementById('export-csv');
const exportPdfBtn = document.getElementById('export-pdf');

// Initialize projectOrder as an empty array
let projectOrder = [];

// SheetDB API endpoints
const APPOINTMENTS_API = 'https://sheetlabs.com/K3/Apt_SM';
const SHOWUPS_API = 'https://sheetlabs.com/K3/held_sm';
const CALLQUALITY_API = 'https://sheetlabs.com/K3/callScore_sm';

// New API endpoints for Dagsmejan Tasks
const NABEEL_TASKS_API = 'https://sheetlabs.com/K3N/nabeel_tasks';
const SIK_TASKS_API = 'https://sheetlabs.com/K3N/sik_tasks';

/**
 * Mapping Objects for Task Names
 * Maps API task names to display-friendly names.
 * Ensure that all task names fetched from the API are included here.
 */

// Mapping for Nabeel Tasks
const nabeelTaskMapping = {
    'ReturnRequests': 'Return Requests',
    'ReturnsArrived': 'Returns Arrived',
    'DefectivePhotos': 'Defective Photos',
    'Email': 'Email',
    'UnrecordedReturnsRP04/RP13': 'Unrecorded Returns (RP04/RP13)',
    'AdditionalTask': 'Additional Task',
    'WROUpdatedManually': 'WRO Updated Manually'
};

// Mapping for Sikendar Tasks
const sikTaskMapping = {
    'ReturnRequests': 'Return Requests',
    'ReturnsArrived': 'Returns Arrived',
    'ReplacementsReshipments': 'Replacements/Reshipments',
    'UpdateShippedPendingOrders': 'Update/Shipped Pending Orders',
    'B2BOrders': 'B2B Orders',
    'SplitOrders': 'Split Orders',
    'SignedInvoices': 'Signed Invoices',
    'Errors': 'Errors',
    'Email': 'Email',
    'SampleOrders': 'Sample Orders',
    'RemovedReservations': 'Removed Reservations',
    'UnrecordedReturns': 'Unrecorded Returns',
    'AdditionalTask': 'Additional Task'
};

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
 * Includes 'SDR' as the first header and includes crowns within the SDR name cell.
 * @param {Object} projectData - The project data containing project name and SDRs
 * @param {Array} headers - The headers for the table
 * @param {string} type - The type of leaderboard ('Appointments', 'Showups')
 * @returns {HTMLElement} - The project table container
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
    table.className = 'styled-table table'; // Added 'table' class for Bootstrap styling

    // Table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // Add 'SDR' header
    const sdrTh = document.createElement('th');
    sdrTh.textContent = 'SDR';
    headerRow.appendChild(sdrTh);

    // Add other headers with display-friendly names
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

    // Append table to project container with responsive wrapper
    const responsiveDiv = document.createElement('div');
    responsiveDiv.className = 'table-responsive';
    responsiveDiv.appendChild(table);
    projectContainer.appendChild(responsiveDiv);

    return projectContainer;
}

/**
 * Helper Function: Create a Generic Table with Display Headers
 * Suitable for both SDR-based tables and task-based tables.
 * @param {Array} data - The data array
 * @param {Array} dataKeys - The keys to extract from data objects
 * @param {Array} displayHeaders - The display-friendly header names
 * @param {string} title - The table title
 * @returns {HTMLElement} - The table container element
 */
function createGenericTable(data, dataKeys, displayHeaders, title) {
    // Create a container for the table with Bootstrap's table-responsive class
    const tableContainer = document.createElement('div');
    tableContainer.className = 'table-responsive mb-4'; // Added 'table-responsive' for horizontal scrolling on small screens

    // Add heading
    const tableHeading = document.createElement('h3');
    tableHeading.textContent = title;
    tableHeading.classList.add('region-heading'); // Reusing existing CSS class
    tableContainer.appendChild(tableHeading);

    // Create table
    const table = document.createElement('table');
    table.className = 'styled-table table'; // Added 'table' class for Bootstrap styling

    // Table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // Add headers
    displayHeaders.forEach(displayHeader => {
        const th = document.createElement('th');
        th.textContent = displayHeader;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Table body
    const tbody = document.createElement('tbody');

    // Iterate through data and create table rows
    data.forEach((row) => {
        const tr = document.createElement('tr');

        // Add data columns
        dataKeys.forEach(key => {
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
 */
function renderTables(data, headers, title, isSingleTable = false, type = 'Appointments') {
    // Set the main heading
    leaderboardTitle.textContent = title;

    // Clear existing content
    leaderboardContainer.innerHTML = '';

    if (isSingleTable) {
        // Define display-friendly headers
        const displayHeaders = ['Project', 'Number of Appointments', 'Total Score', 'Average Score/Appointment'];
        // Create and append single table
        const table = createGenericTable(data, headers, displayHeaders, title);
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
 * @returns {Array|null} - The processed Call Quality Scoring data or null on failure
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
 * Function to fetch Nabeel Tasks data
 * @returns {Array|null} - Processed Nabeel Tasks data or null on failure
 */
async function fetchNabeelTasksData() {
    try {
        const response = await fetch(NABEEL_TASKS_API);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (data.length === 0) {
            console.warn('Nabeel Tasks API returned empty data.');
            return null;
        }

        // Assuming only one object in the array
        const nabeelDataRaw = data[0];

        // Process data into key-value pairs with mapping
        const processedData = Object.entries(nabeelDataRaw).map(([key, value]) => {
            const displayTask = nabeelTaskMapping[key] || key; // Use mapping or fallback to original key
            return {
                Task: displayTask,
                Count: parseInt(value, 10) || 0
            };
        });

        return processedData;
    } catch (error) {
        console.error('Error fetching Nabeel Tasks data:', error);
        return null;
    }
}

/**
 * Function to fetch Sik Tasks data
 * @returns {Array|null} - Processed Sik Tasks data or null on failure
 */
async function fetchSikTasksData() {
    try {
        const response = await fetch(SIK_TASKS_API);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (data.length === 0) {
            console.warn('Sik Tasks API returned empty data.');
            return null;
        }

        // Assuming only one object in the array
        const sikDataRaw = data[0];

        // Process data into key-value pairs with mapping
        const processedData = Object.entries(sikDataRaw).map(([key, value]) => {
            const displayTask = sikTaskMapping[key] || key; // Use mapping or fallback to original key
            return {
                Task: displayTask,
                Count: parseInt(value, 10) || 0
            };
        });

        return processedData;
    } catch (error) {
        console.error('Error fetching Sik Tasks data:', error);
        return null;
    }
}

/**
 * Function to render Dagsmejan Tasks Leaderboard
 * @param {Array} sikData - Processed Sik Tasks data
 * @param {Array} nabeelData - Processed Nabeel Tasks data
 */
function renderDagsmejanTasks(sikData, nabeelData) {
    // Set the main heading
    leaderboardTitle.textContent = 'Dagsmejan Tasks';

    // Clear existing content
    leaderboardContainer.innerHTML = '';

    // Create a Bootstrap row to hold both tables side by side
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row';

    // Create Sikendar table
    const sikTableContainer = createGenericTable(
        sikData,
        ['Task', 'Count'],
        ['Task', 'Count'],
        'Sikendar'
    );

    // Wrap the Sikendar table in a Bootstrap column
    const sikColDiv = document.createElement('div');
    sikColDiv.className = 'col-md-6 mb-4'; // Half-width on medium and larger screens
    sikColDiv.appendChild(sikTableContainer);

    // Create Nabeel table
    const nabeelTableContainer = createGenericTable(
        nabeelData,
        ['Task', 'Count'],
        ['Task', 'Count'],
        'Nabeel'
    );

    // Wrap the Nabeel table in a Bootstrap column
    const nabeelColDiv = document.createElement('div');
    nabeelColDiv.className = 'col-md-6 mb-4'; // Half-width on medium and larger screens
    nabeelColDiv.appendChild(nabeelTableContainer);

    // Append both columns to the row
    rowDiv.appendChild(sikColDiv);
    rowDiv.appendChild(nabeelColDiv);

    // Append the row to the leaderboard container
    leaderboardContainer.appendChild(rowDiv);
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

/**
 * Event listeners for navigation links
 */

// Appointment Leaderboard
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

// Showups Leaderboard
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

// Call Quality Scoring Leaderboard
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

// Dagsmejan Tasks Leaderboard
dagsmejanTasksLink.addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent default link behavior
    leaderboardTitle.textContent = 'Loading Dagsmejan Tasks Leaderboard...';

    // Fetch data from both APIs concurrently
    const [sikData, nabeelData] = await Promise.all([
        fetchSikTasksData(),
        fetchNabeelTasksData()
    ]);

    if (sikData && nabeelData) {
        renderDagsmejanTasks(sikData, nabeelData);
    } else {
        leaderboardContainer.innerHTML = `<p class="text-danger">Failed to load Dagsmejan Tasks data. Please try again later.</p>`;
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
