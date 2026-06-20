from flask import Flask, jsonify
from flask_cors import CORS
import requests
import time
from google.transit import gtfs_realtime_pb2

app = Flask(__name__)
CORS(app)

F_LINE_URL = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm"
G_LINE_URL = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g"
TARGET_STATION = "F27N" # Fort Hamilton Pkwy

def fetch_feed_arrivals(url, route_filter):
    arrivals = []
    try:
        response = requests.get(url, timeout=5)
        feed = gtfs_realtime_pb2.FeedMessage()
        feed.ParseFromString(response.content)
        current_time = time.time()

        for entity in feed.entity:
            if entity.HasField('trip_update'):
                if entity.trip_update.trip.route_id == route_filter:
                    for stop_time in entity.trip_update.stop_time_update:
                        if stop_time.stop_id == TARGET_STATION and stop_time.arrival.time:
                            minutes_away = int((stop_time.arrival.time - current_time) / 60)
                            if minutes_away >= 0:
                                arrivals.append(minutes_away)
    except Exception as e:
        print(f"Error: {e}")
    arrivals.sort()
    return arrivals[:3] # Pull up to the top 3 arrivals for a clean layout

@app.route('/api/subway', methods=['GET'])
def get_subway_times():
    return jsonify({
        "f_trains": fetch_feed_arrivals(F_LINE_URL, "F"),
        "g_trains": fetch_feed_arrivals(G_LINE_URL, "G")
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)