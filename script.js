// script.js

// DOM elements
const appointmentLink = document.getElementById('appointment-link');
const showupLink = document.getElementById('showup-link');
const callQualityLink = document.getElementById('callquality-link');
const leaderboardContainer = document.querySelector('.leaderboard-container');
const leaderboardTitle = document.getElementById('leaderboard-title');

// Define the order of regions for consistent layout
const regionOrder = ['America', 'Europe', 'Asia', 'Middle East'];

// SheetDB API endpoints
const APPOINTMENTS_API = 'https://sheetdb.io/api/v1/bxy8qm8ctm6hi';
const SHOWUPS_API = 'https://sheetdb.io/api/v1/wybohx0emry9z';
const CALLQUALITY_API = 'https://sheetdb.io/api/v1/fdxxwkttf1vzq';

// Helper function to create a table for a specific region
function createRegionTable(region, data, headers) {
  // Create a container for the region
  const regionContainer = document.createElement('div');
  regionContainer.className = 'mb-4'; // Margin bottom for spacing

  // Add region heading
  const regionHeading = document.createElement('h3');
  regionHeading.textContent = region;
  regionHeading.classList.add('region-heading');
  regionContainer.appendChild(regionHeading);

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

  // Append table to region container
  regionContainer.appendChild(table);

  return regionContainer;
}

// Helper function to create a single table without regions
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

// Function to render tables and set heading
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
    // Iterate through regions in pairs to create rows with two columns
    for (let i = 0; i < regionOrder.length; i += 2) {
      // Create a Bootstrap row
      const row = document.createElement('div');
      row.className = 'row mb-4'; // mb-4 for spacing between rows

      // First column (Left)
      const col1 = document.createElement('div');
      col1.className = 'col-md-6'; // Half width on medium and larger screens

      const region1 = regionOrder[i];
      if (data[region1] && data[region1].length > 0) {
        const table1 = createRegionTable(region1, data[region1], headers);
        col1.appendChild(table1);
      }

      // Second column (Right)
      const col2 = document.createElement('div');
      col2.className = 'col-md-6';

      const region2 = regionOrder[i + 1];
      if (region2 && data[region2] && data[region2].length > 0) {
        const table2 = createRegionTable(region2, data[region2], headers);
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

// Function to fetch data from SheetDB API
async function fetchLeaderboardData(apiUrl, type) {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    // Process data
    const processedData = {};

    regionOrder.forEach(region => {
      let regionData = data
        .filter(entry => entry.Region === region)
        .sort((a, b) => parseInt(b[type]) - parseInt(a[type]));

      if (region === 'America') {
        regionData = regionData.slice(0, 10);
      }

      if (regionData.length > 0) {
        processedData[region] = regionData.map(entry => ({
          Team: entry.Team,
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

// Function to fetch Call Quality Scoring data
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
appointmentLink.addEventListener('click', async () => {
  leaderboardTitle.textContent = 'Loading Appointment Leaderboard...';
  const data = await fetchLeaderboardData(APPOINTMENTS_API, 'Appointments');
  if (data) {
    renderTables(data, ['Team', 'SDR', 'Appointments'], 'Appointment Leaderboard');
  }
});

showupLink.addEventListener('click', async () => {
  leaderboardTitle.textContent = 'Loading Showups Leaderboard...';
  const data = await fetchLeaderboardData(SHOWUPS_API, 'Showups');
  if (data) {
    renderTables(data, ['Team', 'SDR', 'Showups'], 'Showups Leaderboard');
  }
});

callQualityLink.addEventListener('click', async () => {
  leaderboardTitle.textContent = 'Loading Call Quality Scoring Leaderboard...';
  const data = await fetchCallQualityData(CALLQUALITY_API);
  if (data && data.length > 0) {
    renderTables(data, ['SDR', 'Number of Appointments', 'Total Score', 'Average Score/Appointment'], 'Call Quality Scoring Leaderboard', true);
  } else {
    leaderboardContainer.innerHTML = `<p class="text-danger">No data available for Call Quality Scoring Leaderboard.</p>`;
  }
});

// Initial render when the page loads
document.addEventListener('DOMContentLoaded', async () => {
  leaderboardTitle.textContent = 'Loading Appointment Leaderboard...';
  const data = await fetchLeaderboardData(APPOINTMENTS_API, 'Appointments');
  if (data) {
    renderTables(data, ['Team', 'SDR', 'Appointments'], 'Appointment Leaderboard');
  }
});
