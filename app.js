// Pointing directly to your live cloud instance endpoint!
const LOCAL_SERVER_URL = "https://subway-clock-backend.onrender.com/api/subway";
async function updateSubwayTimes() {
    console.log("Polling for comma-separated matrix array boards...");
    try {
        const response = await fetch(LOCAL_SERVER_URL);
        const data = await response.json();

        // Format and print the F train times array joined with a comma separator
        if (data.f_trains && data.f_trains.length > 0) {
            document.getElementById("f-times").innerText = data.f_trains.join(",");
        } else {
            document.getElementById("f-times").innerText = "No Trains";
        }

        // Format and print the G train times array joined with a comma separator
        if (data.g_trains && data.g_trains.length > 0) {
            document.getElementById("g-times").innerText = data.g_trains.join(",");
        } else {
            document.getElementById("g-times").innerText = "No Trains";
        }

    } catch (error) {
        console.error("Local server connection issue:", error);
    }
}

updateSubwayTimes();
setInterval(updateSubwayTimes, 30000);