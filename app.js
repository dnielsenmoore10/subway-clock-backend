const LOCAL_SERVER_URL = "http://127.0.0.1:5000/api/subway";

async function updateSubwayTimes() {
    console.log("Polling for subway times...");
    try {
        const response = await fetch(LOCAL_SERVER_URL);
        const data = await response.json();
        
        // Inject the dynamic station name
        if (document.getElementById('station-name')) {
            document.getElementById('station-name').innerText = data.station_name;
        }

        // Inject the F train times into the f-uptown slot
        if (document.getElementById('f-times')) {
            document.getElementById('f-times').innerText = 
                (data.f_trains && data.f_trains.length > 0) ? data.f_trains.join(", ") : "No Trains";
        }

        // Inject the G train times into the g-uptown slot
        if (document.getElementById('g-times')) {
            document.getElementById('g-times').innerText = 
                (data.g_trains && data.g_trains.length > 0) ? data.g_trains.join(", ") : "No Trains";
        }

    } catch (error) {
        console.error("Local server connection issue:", error);
    }
}

// Run immediately on page load, then poll every 30 seconds
updateSubwayTimes();
setInterval(updateSubwayTimes, 30000);