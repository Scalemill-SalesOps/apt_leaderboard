// script.js

// DOM elements
const appointmentLink = document.getElementById('appointment-link');
const showupLink = document.getElementById('showup-link');
const callQualityLink = document.getElementById('callquality-link');
const callQualityLink = document.getElementById('callquality-link');
const leaderboardContainer = document.querySelector('.leaderboard-container');
const leaderboardTitle = document.getElementById('leaderboard-title');

// Define the order of projects (Teams) for consistent layout
const projectOrder = [
  'Avibra',
  'CanopyConnect',
  'FP&A',
  'illumin',
  'NINJIO',
  'Payactiv',
  'Payoneer',
  'Payoneer Checkout',
  'PureVPN & PureDome',
  'Qubriux'
];

// SheetDB API endpoints
const APPOINTMENTS_API = 'https://sheetdb.io/api/v1/bxy8qm8ctm6hi';
const SHOWUPS_API = 'https://sheetdb.io/api/v1/wybohx0emry9z';
const CALLQUALITY_API = 'https://sheetdb.io/api/v1/fdxxwkttf1vzq';

/**
 * Helper function to create a table for a specific project
 * @param {string} project - The project name
 * @param {Array} data - The data array for the project
 * @param {Array} headers - The table headers
 * @returns {HTMLElement} - The project table container
 */
function createProjectTable(project, data, headers) {
  // Create a container for the project
  const projectContainer = document.createElement('div');
  projectContainer.className = 'mb-4'; // Margin bottom for spacing

  // Add project heading
  const projectHeading = document.createElement('h3');
  projectHeading.textContent = project;
  projectHeading.classList.add('region-heading'); // You can rename this class if desired
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
  data.forEach((row, index) => {
    const tr = document.createElement('tr');

    // Add crown column for top 3 performers
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
 * Helper function to create a single table without projects
 * @param {Array} data - The data array
 * @param {Array} headers - The table headers
 * @param {string} title - The table title
 * @returns {HTMLElement} - The table container
 */
function createSingleTable(data, headers, title) {
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
  data.forEach((row, index) => {
    const tr = document.createElement('tr');

    // Add crown column for top 3 performers
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

  // Append table to container
  tableContainer.appendChild(table);

  return tableContainer;
}

/**
 * Function to render tables and set heading
 * @param {Object|Array} data - The processed data
 * @param {Array} headers - The table headers
 * @param {string} title - The main heading title
 * @param {boolean} isSingleTable - Flag to indicate single table rendering
 */
function renderTables(data, headers, title, isSingleTable = false) {
  // Set the main heading
  leaderboardTitle.textContent = title;

  // Clear existing content
  leaderboardContainer.innerHTML = '';

  if (isSingleTable) {
    // Create and append single table
    const table = createSingleTable(data, headers, title);
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
      // First column (Left)
      const col1 = document.createElement('div');
      col1.className = 'col-md-6'; // Half width on medium and larger screens

      const project1 = projectOrder[i];
      if (data[project1] && data[project1].length > 0) {
        const table1 = createProjectTable(project1, data[project1], headers);
        col1.appendChild(table1);
      }

      // Second column (Right)
      const col2 = document.createElement('div');
      col2.className = 'col-md-6';
      // Second column (Right)
      const col2 = document.createElement('div');
      col2.className = 'col-md-6';

      const project2 = projectOrder[i + 1];
      if (project2 && data[project2] && data[project2].length > 0) {
        const table2 = createProjectTable(project2, data[project2], headers);
        col2.appendChild(table2);
      }

      // Append columns to row
      row.appendChild(col1);
      row.appendChild(col2);
      // Append columns to row
      row.appendChild(col1);
      row.appendChild(col2);

      // Append row to leaderboard container
      leaderboardContainer.appendChild(row);
    }
      // Append row to leaderboard container
      leaderboardContainer.appendChild(row);
    }
  }
}

/**
 * Function to fetch data from SheetDB API and group by Team (Project)
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

    // Process data
    const processedData = {};

    // Group data by Team (Project)
    projectOrder.forEach(project => {
      let projectData = data
        .filter(entry => entry.Team === project)
        .sort((a, b) => parseInt(b[type]) - parseInt(a[type]));

      // Optionally, limit to top N entries per project
      // For example, top 10 for larger projects
      // Adjust the condition based on your requirements
      if (project === 'Payoneer' || project === 'Payactiv') {
        projectData = projectData.slice(0, 10);
      }

      if (projectData.length > 0) {
        // Map relevant fields based on the leaderboard type
        processedData[project] = projectData.map(entry => ({
          SDR: entry.SDR,
          [type]: parseInt(entry[type])
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
    data = data.filter(entry => parseInt(entry['Number of Appointments']) >= 5);

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
    renderTables(data, ['SDR', 'Appointments'], 'Appointment Leaderboard');
  }
});

showupLink.addEventListener('click', async (e) => {
  e.preventDefault(); // Prevent default link behavior
  leaderboardTitle.textContent = 'Loading Showups Leaderboard...';
  const data = await fetchLeaderboardData(SHOWUPS_API, 'Showups');
  if (data) {
    renderTables(data, ['SDR', 'Showups'], 'Showups Leaderboard');
  }
});

callQualityLink.addEventListener('click', async (e) => {
  e.preventDefault(); // Prevent default link behavior
  leaderboardTitle.textContent = 'Loading Call Quality Scoring Leaderboard...';
  const data = await fetchCallQualityData(CALLQUALITY_API);
  if (data && data.length > 0) {
    renderTables(data, ['SDR', 'Number of Appointments', 'Total Score', 'Average Score/Appointment'], 'Call Quality Scoring Leaderboard', true);
  } else {
    leaderboardContainer.innerHTML = `<p class="text-danger">No data available for Call Quality Scoring Leaderboard.</p>`;
  }
});

// Initial render when the page loads (default to Appointment Leaderboard)
document.addEventListener('DOMContentLoaded', async () => {
  leaderboardTitle.textContent = 'Loading Appointment Leaderboard...';
  const data = await fetchLeaderboardData(APPOINTMENTS_API, 'Appointments');
  if (data) {
    renderTables(data, ['SDR', 'Appointments'], 'Appointment Leaderboard');
  }
});
