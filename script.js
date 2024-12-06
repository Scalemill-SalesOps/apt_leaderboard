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
const APPOINTMENTS_API = 'https://sheetdb.io/api/v1/bxy8qm8ctm6hi';
const SHOWUPS_API = 'https://sheetdb.io/api/v1/wybohx0emry9z';
const CALLQUALITY_API = 'https://sheetdb.io/api/v1/fdxxwkttf1vzq';

/**
 * Helper function to create a table for a specific project
 * @param {string} project - The project name
 * @param {Array} data - The data array for the project
 * @param {Array} headers - The table headers
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

  // Extract unique scores in descending order to map scores to colors
  const uniqueScores = [...new Set(data.map(entry => parseInt(entry[type], 10)))].sort((a, b) => b - a);

  // Map top 3 unique scores to crown colors
  const colorMap = {};
  if (uniqueScores.length >= 1) colorMap[uniqueScores[0]] = '#FFD700'; // Gold
  if (uniqueScores.length >= 2) colorMap[uniqueScores[1]] = '#C0C0C0'; // Silver
  if (uniqueScores.length >= 3) colorMap[uniqueScores[2]] = '#CD7F32'; // Bronze

  // Iterate through SDRs and create table rows
  data.forEach((row) => {
    const tr = document.createElement('tr');

    // Add crown column based on the SDR's score
    const sdrScore = parseInt(row[type], 10);
    const crownTd = document.createElement('td');

    if (colorMap[sdrScore]) {
      crownTd.innerHTML = `<i class="fas fa-crown" style="color: ${colorMap[sdrScore]};"></i>`;
    } else {
      crownTd.textContent = ''; // No crown for SDRs outside top 3
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
 * Helper function to create a single table without projects
 * @param {Array} data - The data array
 * @param {Array} headers - The table headers
 * @param {string} title - The table title
 * @param {string} type - The type of leaderboard ('Average Score/Appointment')
 * @returns {HTMLElement} - The table container
 */
function createSingleTable(data, headers, title, type) {
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

  // Extract unique scores in descending order to map scores to colors
  const uniqueScores = [...new Set(data.map(entry => parseFloat(entry[type])))].sort((a, b) => b - a);

  // Map top 3 unique scores to crown colors
  const colorMap = {};
  if (uniqueScores.length >= 1) colorMap[uniqueScores[0]] = '#FFD700'; // Gold
  if (uniqueScores.length >= 2) colorMap[uniqueScores[1]] = '#C0C0C0'; // Silver
  if (uniqueScores.length >= 3) colorMap[uniqueScores[2]] = '#CD7F32'; // Bronze

  // Iterate through SDRs and create table rows
  data.forEach((row) => {
    const tr = document.createElement('tr');

    // Add crown column based on the SDR's score
    const sdrScore = parseFloat(row[type]);
    const crownTd = document.createElement('td');

    if (colorMap[sdrScore]) {
      crownTd.innerHTML = `<i class="fas fa-crown" style="color: ${colorMap[sdrScore]};"></i>`;
    } else {
      crownTd.textContent = ''; // No crown for SDRs outside top 3
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

  // Append table to container
  tableContainer.appendChild(table);

  return tableContainer;
}

/**
 * Function to render tables and set heading
 * @param {Object} data - The processed data
 * @param {Array} headers - The table headers
 * @param {string} title - The main heading title
 * @param {boolean} isSingleTable - Flag to indicate single table rendering
 * @param {string} type - The type of leaderboard ('Appointments' or 'Showups')
 */
function renderTables(data, headers, title, isSingleTable = false, type = 'Appointments') {
  // Set the main heading
  leaderboardTitle.textContent = title;

  // Clear existing content
  leaderboardContainer.innerHTML = '';

  if (isSingleTable) {
    // Create and append single table
    const table = createSingleTable(data, headers, title, type);
    leaderboardContainer.appendChild(table);
  } else {
    // Iterate through projects in pairs to create rows with two columns
    for (let i = 0; i < projectOrder.length; i += 2) {
      // Create a Bootstrap row
      const row = document.createElement('div');
      row.className = 'row mb-4'; // mb-4 for spacing between rows

      // First column (Left)
      const col1 = document.createElement('div');
      col1.className = 'col-md-6'; // Half width on medium and larger screens

      const project1 = projectOrder[i];
      if (data[project1] && data[project1].length > 0) {
        const table1 = createProjectTable(project1, data[project1], headers, type);
        col1.appendChild(table1);
      }

      // Second column (Right)
      const col2 = document.createElement('div');
      col2.className = 'col-md-6';

      const project2 = projectOrder[i + 1];
      if (project2 && data[project2] && data[project2].length > 0) {
        const table2 = createProjectTable(project2, data[project2], headers, type);
        col2.appendChild(table2);
      }

      // Append columns to row
      row.appendChild(col1);
      row.appendChild(col2);

      // Append row to leaderboard container
      leaderboardContainer.appendChild(row);
    }
  }
}

/**
 * Function to fetch data from SheetDB API and group by Team (Project)
 * Limits each project to top 3 SDRs based on the specified type
 * Orders projects dynamically based on total appointments or showups
 * @param {string} apiUrl - The API endpoint URL
 * @param {string} type - The type of data ('Appointments' or 'Showups')
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

    // Filter SDRs with at least 5 appointments
    data = data.filter(entry => parseInt(entry['Number of Appointments'], 10) >= 5);

    // Sort data in descending order based on Average Score/Appointment
    data.sort((a, b) => parseFloat(b['Average Score/Appointment']) - parseFloat(a['Average Score/Appointment']));

    return data;
  } catch (error) {
    console.error('Error fetching Call Quality data:', error);
    leaderboardContainer.innerHTML = `<p class="text-danger">Failed to load Call Quality data. Please try again later.</p>`;
    return null;
  }
}

// Event listeners for navigation links
appointmentLink.addEventListener('click', async (e) => {
  e.preventDefault(); // Prevent default link behavior
  leaderboardTitle.textContent = 'Loading Appointment Leaderboard...';
  const data = await fetchLeaderboardData(APPOINTMENTS_API, 'Appointments');
  if (data) {
    renderTables(data, ['SDR', 'Appointments'], 'Appointment Leaderboard', false, 'Appointments');
  }
});

showupLink.addEventListener('click', async (e) => {
  e.preventDefault(); // Prevent default link behavior
  leaderboardTitle.textContent = 'Loading Showups Leaderboard...';
  const data = await fetchLeaderboardData(SHOWUPS_API, 'Showups');
  if (data) {
    renderTables(data, ['SDR', 'Showups'], 'Showups Leaderboard', false, 'Showups');
  }
});

callQualityLink.addEventListener('click', async (e) => {
  e.preventDefault(); // Prevent default link behavior
  leaderboardTitle.textContent = 'Loading Call Quality Scoring Leaderboard...';
  const data = await fetchCallQualityData(CALLQUALITY_API);
  if (data && data.length > 0) {
    renderTables(data, ['SDR', 'Number of Appointments', 'Total Score', 'Average Score/Appointment'], 'Call Quality Scoring Leaderboard', true, 'Average Score/Appointment');
  } else {
    leaderboardContainer.innerHTML = `<p class="text-danger">No data available for Call Quality Scoring Leaderboard.</p>`;
  }
});

// Initial render when the page loads (default to Appointment Leaderboard)
document.addEventListener('DOMContentLoaded', async () => {
  leaderboardTitle.textContent = 'Loading Appointment Leaderboard...';
  const data = await fetchLeaderboardData(APPOINTMENTS_API, 'Appointments');
  if (data) {
    renderTables(data, ['SDR', 'Appointments'], 'Appointment Leaderboard', false, 'Appointments');
  }
});
