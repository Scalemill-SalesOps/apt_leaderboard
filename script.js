// script.js

// DOM elements
const appointmentLink = document.getElementById('appointment-link');
const showupLink = document.getElementById('showup-link');
const callQualityLink = document.getElementById('callquality-link');
const leaderboardContainer = document.querySelector('.leaderboard-container');
const leaderboardTitle = document.getElementById('leaderboard-title');

// Initialize projectOrder as an empty array
let projectOrder = [];

// SheetDB API endpoints
const APPOINTMENTS_API = 'https://sheetlabs.com/K3/Apt_SM';
const SHOWUPS_API = 'https://sheetlabs.com/K3/held_sm';
const CALLQUALITY_API = 'https://sheetlabs.com/K3/callScore_sm';

/**
 * Helper Function: Create a Project Table
 * Creates a table element for a specific project.
 * @param {string} project - The project name
 * @param {Array} data - The data array for the project
 * @param {Array} headers - The data keys for the table
 * @param {string} type - The type of leaderboard ('Appointments' or 'Showups')
 * @returns {HTMLElement} - The project table container
 */
function createProjectTable(project, data, headers, type) {
  // Create a container for the project
  const projectContainer = document.createElement('div');
  projectContainer.className = 'mb-4'; // Margin bottom for spacing

  // Add project heading
  const projectHeading = document.createElement('h3');
  projectHeading.textContent = project;
  projectHeading.classList.add('region-heading'); // Reusing existing CSS class
  projectContainer.appendChild(projectHeading);

  // Create table
  const table = document.createElement('table');
  table.className = 'styled-table';

  // Table header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  // Add an empty header for crowns
  const crownTh = document.createElement('th');
  crownTh.textContent = ''; // Empty for the crown column
  headerRow.appendChild(crownTh);

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
  data.forEach((row, index) => {
    const tr = document.createElement('tr');

    // Add crown column based on rank
    const crownTd = document.createElement('td');
    if (index === 0) {
      crownTd.innerHTML = `<i class="fas fa-crown" style="color: #FFD700;"></i>`; // Gold
    } else if (index === 1) {
      crownTd.innerHTML = `<i class="fas fa-crown" style="color: #C0C0C0;"></i>`; // Silver
    } else if (index === 2) {
      crownTd.innerHTML = `<i class="fas fa-crown" style="color: #CD7F32;"></i>`; // Bronze
    }
    tr.appendChild(crownTd);

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
 * Creates a table element for the Call Quality Leaderboard.
 * @param {Array} data - The data array
 * @param {Array} dataKeys - The data keys corresponding to the data
 * @param {Array} displayHeaders - The display-friendly header names
 * @param {string} title - The table title
 * @param {string} type - The type of leaderboard ('AverageScoreAppointment')
 * @returns {HTMLElement} - The table container
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

  // Add an empty header for crowns
  const crownTh = document.createElement('th');
  crownTh.textContent = ''; // Empty for the crown column
  headerRow.appendChild(crownTh);

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

    // Add crown column based on rank
    const crownTd = document.createElement('td');
    if (index === 0) {
      crownTd.innerHTML = `<i class="fas fa-crown" style="color: #FFD700;"></i>`; // Gold
    } else if (index === 1) {
      crownTd.innerHTML = `<i class="fas fa-crown" style="color: #C0C0C0;"></i>`; // Silver
    } else if (index === 2) {
      crownTd.innerHTML = `<i class="fas fa-crown" style="color: #CD7F32;"></i>`; // Bronze
    }
    tr.appendChild(crownTd);

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
 */
function renderTables(data, headers, title, isSingleTable = false, type = 'Appointments') {
  // Set the main heading
  leaderboardTitle.textContent = title;

  // Clear existing content
  leaderboardContainer.innerHTML = '';

  if (isSingleTable) {
    // Define display-friendly headers
    const displayHeaders = ['SDR', 'Project', 'Number of Appointments', 'Total Score', 'Average Score/Appointment'];
    // Create and append single table
    const table = createSingleTable(data, headers, displayHeaders, title, type);
    leaderboardContainer.appendChild(table);
  } else {
    // Iterate through projects and create tables
    for (let i = 0; i < projectOrder.length; i += 1) {
      const project = projectOrder[i];
      if (data[project] && data[project].length > 0) {
        // Define display-friendly headers
        const displayHeaders = ['SDR', type];
        // Create and append project table
        const table = createProjectTable(project, data[project], displayHeaders, type);
        leaderboardContainer.appendChild(table);
      }
    }
  }
}

/**
 * Function to fetch data from SheetDB API and group by Team (Project)
 * Limits each project to top 3 SDRs based on the specified type
 * Orders projects dynamically based on total appointments or showups
 * @param {string} apiUrl - The API endpoint URL
 * @param {string} type - The type of leaderboard ('Appointments' or 'Showups')
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

    // Process data: group by project, select top 3 SDRs per project
    const processedData = {};

    projectOrder.forEach(project => {
      let projectData = data
        .filter(entry => entry.Team.trim() === project)
        .sort((a, b) => parseInt(b[type], 10) - parseInt(a[type], 10))
        .slice(0, 3); // Limit to top 3 SDRs

      if (projectData.length > 0) {
        processedData[project] = projectData.map(entry => ({
          SDR: entry.SDR.trim(),
          [type]: parseInt(entry[type], 10) || 0
        }));
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
 * Function to fetch Call Quality Scoring data (remains unchanged)
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

    // Assuming data is already in the desired format
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
      ['SDR', 'Appointments'],
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
      ['SDR', 'Showups'],
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
      ['SDR', 'Project', 'NumberofAppointments', 'TotalScore', 'AverageScoreAppointment'],
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
      ['SDR', 'Appointments'],
      'Appointment Leaderboard',
      false,
      'Appointments'
    );
  }
});
