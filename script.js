// Static data (sorted by "Appointments" in descending order)
const leaderboardData = [
    { Team: "Payoneer", SDR: "Maryam Rehman", Appointments: 30 },
    { Team: "Payoneer", SDR: "Mehwish Ali", Appointments: 25 },
    { Team: "Pureversity", SDR: "Zuhaib", Appointments: 14 },
    { Team: "PureVPN & PureDome", SDR: "Amar", Appointments: 10 },
    { Team: "illumin", SDR: "Hammad Faisal", Appointments: 10 },
    { Team: "PureVPN & PureDome", SDR: "Sophia", Appointments: 9 },
    { Team: "ABCL", SDR: "Usman Hussain", Appointments: 8 },
    { Team: "Avibra", SDR: "Earnest Isic", Appointments: 8 },
    { Team: "Payactiv", SDR: "Samuel Bhatti", Appointments: 7 },
    { Team: "Pureversity", SDR: "Babar", Appointments: 6 },
    { Team: "FP&A", SDR: "Haseeb", Appointments: 6 },
    { Team: "Payactiv", SDR: "Shahmir Shah", Appointments: 6 },
    { Team: "Payactiv", SDR: "Usman Amin", Appointments: 6 },
    { Team: "illumin", SDR: "Ali Murtaza", Appointments: 5 },
    { Team: "Payactiv", SDR: "Nikolai Noronha", Appointments: 5 },
    { Team: "CanopyConnect", SDR: "Ibrahim Shahid", Appointments: 4 },
    { Team: "CanopyConnect", SDR: "Vivek kumar", Appointments: 4 },
    { Team: "Payactiv", SDR: "Anthony Dsouza", Appointments: 4 },
    { Team: "Payactiv", SDR: "Shahwaiz Alam", Appointments: 4 },
    { Team: "Payactiv", SDR: "Shiraz Iqbal", Appointments: 4 },
    { Team: "Payactiv", SDR: "Tahir Yaqoob", Appointments: 4 },
    { Team: "NINJIO", SDR: "Joshua Rodrigues", Appointments: 4 },
    { Team: "Qubriux", SDR: "Anas", Appointments: 4},
    {Team: "Payoneer Checkout", SDR: "Ali Hassan", Appointments: 4},
    { Team: "illumin", SDR: "Amjad Baig", Appointments: 3 },
    { Team: "illumin", SDR: "Khuzaima Tahir", Appointments: 3 },
    { Team: "Payactiv", SDR: "Ali Saqlain", Appointments: 3 },
    { Team: "Payactiv", SDR: "Moiz Sheraz", Appointments: 3 },
    { Team: "Payactiv", SDR: "Shane Samson", Appointments: 3 },
    { Team: "NINJIO", SDR: "Muneeb Khan", Appointments: 3 },
    { Team: "ABCL", SDR: "Iqra Irshad", Appointments: 2 },
    { Team: "CanopyConnect", SDR: "Daniyal Babar", Appointments: 2 },
    { Team: "illumin", SDR: "Ahmed Ali", Appointments: 2 },
    { Team: "Payactiv", SDR: "Matthew Noor", Appointments: 2 },
    { Team: "NINJIO", SDR: "Omer Abdali", Appointments: 2 },
    { Team: "ABCL", SDR: "Muhammad Asim", Appointments: 1 },
    { Team: "Avibra", SDR: "Jayden Correa", Appointments: 1 },
    { Team: "FP&A", SDR: "Sunny", Appointments: 1 },
    { Team: "CanopyConnect", SDR: "Gareth Cajetan", Appointments: 1 },
    { Team: "CanopyConnect", SDR: "Webster Davies", Appointments: 1 },
    { Team: "Payactiv", SDR: "Ahmed Sarwaich", Appointments: 1 },
    { Team: "Payactiv", SDR: "Jaish Yousaf", Appointments: 1 },
    { Team: "Payactiv", SDR: "Muhammad Wajahat", Appointments: 1 },
    { Team: "Qubriux", SDR: "Samuel", Appointments: 1}
];

// Populate the leaderboard table
const populateTable = () => {
    const tableBody = document.querySelector("#leaderboard tbody");
    leaderboardData.forEach((row, index) => {
        const tr = document.createElement("tr");

        // Add crown icons for top 3 rankers
        let crownIcon = "";
        if (index === 0) {
            crownIcon = '<i class="fas fa-crown" style="color: #FFD700; font-size: 1.5em;"></i>'; // Gold crown
        } else if (index === 1) {
            crownIcon = '<i class="fas fa-crown" style="color: #CD7F32; font-size: 1.5em;"></i>'; // Silver crown
        } else if (index === 2) {
            crownIcon = '<i class="fas fa-crown" style="color: #C0C0C0; font-size: 1.5em;"></i>'; // Bronze crown
        }

        tr.innerHTML = `
            <td class="crown-column">${crownIcon}</td>
            <td>${row.Team}</td>
            <td>${row.SDR}</td>
            <td>${row.Appointments}</td>
        `;
        tableBody.appendChild(tr);
    });

    // Initialize DataTables without sorting
    $('#leaderboard').DataTable({
        ordering: false,
        searching: true,
        paging: true,
        info: false,
    });
};


// Initialize the script when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", populateTable);
