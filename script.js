// script.js

// DOM elements
const appointmentLink = document.getElementById('appointment-link');
const showupLink = document.getElementById('showup-link');
const callQualityLink = document.getElementById('callquality-link');
const dagsmejanTasksLink = document.getElementById('dagsmejan-tasks-link');
const leaderboardContainer = document.querySelector('.leaderboard-container');
const leaderboardTitle = document.getElementById('leaderboard-title');

let projectOrder = [];

const APPOINTMENTS_API = 'https://sheetlabs.com/K3/Apt_SM';
const SHOWUPS_API = 'https://sheetlabs.com/K3/held_sm';
const CALLQUALITY_API = 'https://sheetlabs.com/K3/callScore_sm';
const NABEEL_TASKS_API = 'https://sheetlabs.com/K3N/nabeel_tasks';
const SIK_TASKS_API = 'https://sheetlabs.com/K3N/sik_tasks';

const nabeelTaskMapping = {
    'ReturnRequests': 'Return Requests',
    'ReturnsArrived': 'Returns Arrived',
    'DefectivePhotos': 'Defective Photos',
    'Email': 'Email',
    'UnrecordedReturnsRP04/RP13': 'Unrecorded Returns (RP04/RP13)',
    'AdditionalTask': 'Additional Task',
    'WROUpdatedManually': 'WRO Updated Manually'
};

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

function assignCrowns(data, type) {
    let crowns = [];
    let currentRank = 1;
    let previousValue = null;

    data.forEach((item, index) => {
        const currentValue = item[type];
        if (currentValue !== previousValue) {
            currentRank = index + 1;
        }

        if (currentRank === 1) {
            crowns.push('<i class="fas fa-crown" style="color: #FFD700;" title="1st Place"></i>');
        } else if (currentRank === 2) {
            crowns.push('<i class="fas fa-crown" style="color: #C0C0C0;" title="2nd Place"></i>');
        } else if (currentRank === 3) {
            crowns.push('<i class="fas fa-crown" style="color: #CD7F32;" title="3rd Place"></i>');
        } else {
            crowns.push('');
        }

        previousValue = currentValue;
    });

    return crowns;
}

function createProjectTable(projectData, headers, type) {
    const projectContainer = document.createElement('div');
    projectContainer.className = 'mb-4';

    const projectHeading = document.createElement('h3');
    projectHeading.textContent = projectData.project;
    projectHeading.classList.add('region-heading');
    projectContainer.appendChild(projectHeading);

    const table = document.createElement('table');
    table.className = 'styled-table table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const sdrTh = document.createElement('th');
    sdrTh.textContent = 'SDR';
    headerRow.appendChild(sdrTh);

    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    projectData.data.forEach((row) => {
        const tr = document.createElement('tr');

        const sdrTd = document.createElement('td');
        sdrTd.classList.add('sdr-cell');
        sdrTd.innerHTML = `
            <span class="crown-icon">${row.crown}</span>
            <span class="sdr-name">${row['SDR']}</span>
        `;
        tr.appendChild(sdrTd);

        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header];
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    const responsiveDiv = document.createElement('div');
    responsiveDiv.className = 'table-responsive';
    responsiveDiv.appendChild(table);
    projectContainer.appendChild(responsiveDiv);

    return projectContainer;
}

function createGenericTable(data, dataKeys, displayHeaders, title, includeCrown = false) {
    const tableContainer = document.createElement('div');
    tableContainer.className = 'table-responsive mb-4';

    const table = document.createElement('table');
    table.className = 'styled-table table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    displayHeaders.forEach(displayHeader => {
        const th = document.createElement('th');
        th.textContent = displayHeader;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    data.forEach((row) => {
        const tr = document.createElement('tr');

        if (includeCrown && row.crown && row.SDR) {
            const sdrTd = document.createElement('td');
            sdrTd.classList.add('sdr-cell');
            sdrTd.innerHTML = `
                <span class="crown-icon">${row.crown}</span>
                <span class="sdr-name">${row['SDR']}</span>
            `;
            tr.appendChild(sdrTd);

            dataKeys.forEach(key => {
                if (key === 'SDR') return;
                const td = document.createElement('td');
                td.textContent = row[key];
                tr.appendChild(td);
            });
        } else {
            dataKeys.forEach(key => {
                const td = document.createElement('td');
                td.textContent = row[key];
                tr.appendChild(td);
            });
        }

        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    tableContainer.appendChild(table);

    return tableContainer;
}

function renderTables(data, headers, title, isSingleTable = false, type = 'Appointments') {
    leaderboardTitle.textContent = title;
    leaderboardContainer.innerHTML = '';

    if (isSingleTable) {
        let displayHeaders;
        let includeCrown = false;
        let dataKeys;

        if (type === 'AverageScoreAppointment') {
            displayHeaders = ['SDR', 'Project', 'Number of Appointments', 'Total Score', 'Average Score/Appointment'];
            dataKeys = ['SDR', 'Project', 'NumberofAppointments', 'TotalScore', 'AverageScoreAppointment'];
            includeCrown = true;
        } else {
            displayHeaders = ['Project', 'Number of Appointments', 'Total Score', 'Average Score/Appointment'];
            dataKeys = ['Project', 'NumberofAppointments', 'TotalScore', 'AverageScoreAppointment'];
        }

        const table = createGenericTable(data, dataKeys, displayHeaders, title, includeCrown);
        leaderboardContainer.appendChild(table);
    } else {
        let rowDiv = document.createElement('div');
        rowDiv.className = 'row';

        for (let i = 0; i < projectOrder.length; i++) {
            const project = projectOrder[i];
            if (data[project] && data[project].length > 0) {
                const displayHeaders = [type];
                const table = createProjectTable({ project: project, data: data[project] }, displayHeaders, type);

                const colDiv = document.createElement('div');
                colDiv.className = 'col-md-6 mb-4';
                colDiv.appendChild(table);
                rowDiv.appendChild(colDiv);

                if ((i + 1) % 2 === 0 && i !== projectOrder.length - 1) {
                    leaderboardContainer.appendChild(rowDiv);
                    rowDiv = document.createElement('div');
                    rowDiv.className = 'row';
                }
            }
        }

        if (rowDiv.children.length > 0) {
            leaderboardContainer.appendChild(rowDiv);
        }
    }

    styleTotalRows();
}

async function fetchLeaderboardData(apiUrl, type) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        const projectTotals = {};
        data.forEach(entry => {
            const project = entry.Team.trim();
            const value = parseInt(entry[type], 10) || 0;
            if (!projectTotals[project]) {
                projectTotals[project] = 0;
            }
            projectTotals[project] += value;
        });

        projectOrder = Object.keys(projectTotals).sort((a, b) => projectTotals[b] - projectTotals[a]);

        const processedData = {};

        projectOrder.forEach(project => {
            let projectData = data
                .filter(entry => entry.Team.trim() === project)
                .sort((a, b) => parseInt(b[type], 10) - parseInt(a[type], 10));

            const crowns = assignCrowns(projectData, type);

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

async function fetchCallQualityData(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let data = await response.json();

        data = data.filter(entry => parseInt(entry.NumberofAppointments, 10) >= 3);

        if (data.length === 0) {
            leaderboardContainer.innerHTML = `<p class="text-warning">No SDRs have at least 3 appointments to be eligible for the Call Quality Scoring Leaderboard.</p>`;
            return null;
        }

        data.forEach(entry => {
            entry.AverageScoreAppointment = parseFloat(entry.AverageScoreAppointment) || 0;
        });

        data.sort((a, b) => b.AverageScoreAppointment - a.AverageScoreAppointment);

        data = data.slice(0, 10);

        const crowns = assignCrowns(data, 'AverageScoreAppointment');

        data = data.map((entry, index) => ({
            SDR: entry.SDR.trim(),
            Project: entry.Project.trim(),
            NumberofAppointments: entry.NumberofAppointments,
            TotalScore: entry.TotalScore,
            AverageScoreAppointment: entry.AverageScoreAppointment.toFixed(2),
            crown: crowns[index] || ''
        }));

        return data;
    } catch (error) {
        console.error('Error fetching Call Quality Scoring data:', error);
        leaderboardContainer.innerHTML = `<p class="text-danger">Failed to load Call Quality Scoring data. Please try again later.</p>`;
        return null;
    }
}

async function fetchNabeelTasksData() {
    try {
        const response = await fetch(NABEEL_TASKS_API);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (data.length === 0) {
            return null;
        }

        const nabeelDataRaw = data[0];

        const processedData = Object.entries(nabeelDataRaw).map(([key, value]) => {
            const displayTask = nabeelTaskMapping[key] || key;
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

async function fetchSikTasksData() {
    try {
        const response = await fetch(SIK_TASKS_API);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (data.length === 0) {
            return null;
        }

        const sikDataRaw = data[0];

        const processedData = Object.entries(sikDataRaw).map(([key, value]) => {
            const displayTask = sikTaskMapping[key] || key;
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

function renderDagsmejanTasks(sikData, nabeelData) {
    leaderboardTitle.textContent = 'Dagsmejan Tasks';
    leaderboardContainer.innerHTML = '';

    const rowDiv = document.createElement('div');
    rowDiv.className = 'row';

    const sikTableContainer = createGenericTable(
        sikData,
        ['Task', 'Count'],
        ['Task', 'Count'],
        'Sikendar'
    );

    const sikColDiv = document.createElement('div');
    sikColDiv.className = 'col-md-6 mb-4';
    sikColDiv.appendChild(sikTableContainer);

    const nabeelTableContainer = createGenericTable(
        nabeelData,
        ['Task', 'Count'],
        ['Task', 'Count'],
        'Nabeel'
    );

    const nabeelColDiv = document.createElement('div');
    nabeelColDiv.className = 'col-md-6 mb-4';
    nabeelColDiv.appendChild(nabeelTableContainer);

    rowDiv.appendChild(sikColDiv);
    rowDiv.appendChild(nabeelColDiv);

    leaderboardContainer.appendChild(rowDiv);
}

function styleTotalRows() {
    const tables = leaderboardContainer.querySelectorAll('table');

    tables.forEach(table => {
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

appointmentLink.addEventListener('click', async (e) => {
    e.preventDefault();
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
    e.preventDefault();
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
    e.preventDefault();
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

dagsmejanTasksLink.addEventListener('click', async (e) => {
    e.preventDefault();
    leaderboardTitle.textContent = 'Loading Dagsmejan Tasks Leaderboard...';

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
