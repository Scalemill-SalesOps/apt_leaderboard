// DOM elements
const appointmentLink = document.getElementById('appointment-link');
const showupLink = document.getElementById('showup-link');
const leaderboardContainer = document.querySelector('.leaderboard-container');
const leaderboardTitle = document.getElementById('leaderboard-title');

// Function to render tables and set heading
function renderTables(data, headers, title) {
  // Set the main heading
  leaderboardTitle.textContent = title;

  // Clear existing content
  leaderboardContainer.innerHTML = '';

  // Iterate over regions
  for (const region in data) {
    // Add region heading
    const regionHeading = document.createElement('h3');
    regionHeading.textContent = region;
    regionHeading.classList.add('region-heading');
    leaderboardContainer.appendChild(regionHeading);

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
    data[region].forEach((row, index) => {
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
    leaderboardContainer.appendChild(table);
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
