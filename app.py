from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

API_KEY = "YOUR_OPENWEATHER_API_KEY"

@app.route("/weather", methods=["GET"])
def get_weather():
    city = request.args.get("city")
    if not city:
        return jsonify({"error": "City is required"}), 400

    # Current weather
    current_url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    current = requests.get(current_url).json()

    # Smart Alerts
    temp = current["main"]["temp"]
    alert = None

    if temp > 40:
        alert = "🔥 Heatwave Alert"
    elif temp < 5:
        alert = "❄ Coldwave Alert"
    elif current["weather"][0]["main"] == "Rain":
        alert = "☔ Rain Alert"

    # 5-day forecast
    forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"
    forecast_data = requests.get(forecast_url).json()

    forecast_list = []
    for entry in forecast_data["list"][::8]:  # every 24 hours
        forecast_list.append({
            "date": entry["dt_txt"],
            "temp": entry["main"]["temp"],
            "min": entry["main"]["temp_min"],
            "max": entry["main"]["temp_max"],
            "humidity": entry["main"]["humidity"],
            "icon": entry["weather"][0]["icon"]
        })

    return jsonify({
        "city": current["name"],
        "temperature": temp,
        "humidity": current["main"]["humidity"],
        "pressure": current["main"]["pressure"],
        "wind": current["wind"]["speed"],
        "description": current["weather"][0]["description"],
        "alert": alert,
        "forecast": forecast_list
    })

if __name__ == "__main__":
    app.run(debug=True)
