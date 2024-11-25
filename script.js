// DOM elements
const appointmentLink = document.getElementById('appointment-link');
const showupLink = document.getElementById('showup-link');
const tableHeaders = document.getElementById('table-headers');
const tableBody = document.getElementById('table-body');

// Function to render table
function renderTable(data, headers) {
  // Clear existing table content
  tableHeaders.innerHTML = '';
  tableBody.innerHTML = '';

  // Add an empty header for the crown column
  const crownTh = document.createElement('th');
  crownTh.textContent = ''; // Empty header for crowns
  tableHeaders.appendChild(crownTh);

  // Render other headers
  headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      tableHeaders.appendChild(th);
  });

  // Render rows with crown icons for top 3 performers
  data.forEach((row, index) => {
      const tr = document.createElement('tr');

      // Add crown column
      const crownTd = document.createElement('td');
      if (index === 0) {
          crownTd.innerHTML = `<i class="fas fa-crown" style="color: #FFD700;"></i>`;
      } else if (index === 1) {
          crownTd.innerHTML = `<i class="fas fa-crown" style="color: #CD7F32;"></i>`;
      } else if (index === 2) {
          crownTd.innerHTML = `<i class="fas fa-crown" style="color: #C0C0C0;"></i>`;
      }
      tr.appendChild(crownTd);

      // Add other data columns
      Object.values(row).forEach(cell => {
          const td = document.createElement('td');
          td.textContent = cell;
          tr.appendChild(td);
      });

      tableBody.appendChild(tr);
  });
}



// Event listeners
appointmentLink.addEventListener('click', () => {
    renderTable(leaderboardData, ['Team', 'SDR', 'Appointments']);
});

showupLink.addEventListener('click', () => {
    renderTable(showupLeaderboardData, ['Team', 'SDR', 'Showups']);
});

document.addEventListener('DOMContentLoaded', () => {
  renderTable(leaderboardData, ['Team', 'SDR', 'Appointments']);
});
