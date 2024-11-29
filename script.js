// DOM elements
const appointmentLink = document.getElementById('appointment-link');
const showupLink = document.getElementById('showup-link');
const leaderboardContainer = document.querySelector('.leaderboard-container');
const leaderboardTitle = document.getElementById('leaderboard-title');

// Define the order of regions for consistent layout
const regionOrder = ['America', 'Europe', 'Asia', 'Middle East'];

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

// Function to render tables and set heading
function renderTables(data, headers, title) {
  // Set the main heading
  leaderboardTitle.textContent = title;

  // Clear existing content
  leaderboardContainer.innerHTML = '';

  // Iterate through regions in pairs to create rows with two columns
  for (let i = 0; i < regionOrder.length; i += 2) {
    // Create a Bootstrap row
    const row = document.createElement('div');
    row.className = 'row mb-4'; // mb-4 for spacing between rows

    // First column (Left)
    const col1 = document.createElement('div');
    col1.className = 'col-md-6'; // Half width on medium and larger screens

    const region1 = regionOrder[i];
    if (data[region1]) {
      const table1 = createRegionTable(region1, data[region1], headers);
      col1.appendChild(table1);
    }

    // Second column (Right)
    const col2 = document.createElement('div');
    col2.className = 'col-md-6';

    const region2 = regionOrder[i + 1];
    if (region2 && data[region2]) {
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

// Event listeners for navigation links
appointmentLink.addEventListener('click', () => {
  renderTables(leaderboardData, ['Team', 'SDR', 'Appointments'], 'Appointment Leaderboard');
});

showupLink.addEventListener('click', () => {
  renderTables(showupLeaderboardData, ['Team', 'SDR', 'Showups'], 'Showup Leaderboard');
});

// Initial render when the page loads
document.addEventListener('DOMContentLoaded', () => {
  renderTables(leaderboardData, ['Team', 'SDR', 'Appointments'], 'Appointment Leaderboard');
});
