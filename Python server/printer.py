from flask import Flask, jsonify
import serial
import threading
import time

app = Flask(__name__)
TESTING = False
# Setup serial communication (update COM port as needed)
arduino = serial.Serial('/dev/ttyACM0', 9600, timeout=2)
time.sleep(2)  # Give Arduino time to reset
if arduino.is_open:
    print("Connection successful.")
else:
    print("Connection failed")
# Shared dictionary to hold fetched sensor data
sensor_data = {
    "height": None,
    "temperature": None,
    "pulse": None,
    "bp": None,
    "weight": None
}


# Dummy values for instant response
dummy_values = {
    "height": "172",
    "temperature": "36.5",
    "pulse": "72",
    "bp": "120/80",
    "weight": "63.4"
}

# Function to communicate with Arduino and update sensor_data
def fetch_sensor(sensor):
    try:
        command = f"{sensor}"
        arduino.write((command + "\n").encode())
        time.sleep(5)  # Wait for Arduino to respond
        if arduino.in_waiting:
            response = arduino.readline().decode().strip()
            sensor_data[sensor] = response
    except Exception as e:
        sensor_data[sensor] = f"Error: {str(e)}"

# Unified function to handle sensor requests
def handle_sensor_request(sensor):
    if sensor not in sensor_data:
        return jsonify(error="Unknown sensor"), 404

    # Start background fetching
    threading.Thread(target=fetch_sensor, args=(sensor,)).start()

    # Respond immediately with dummy value
    return jsonify(sensor=sensor, value=dummy_values[sensor], status="fetching")

# Unified function to handle polling
def handle_poll_request(sensor):
    if sensor not in sensor_data:
        return jsonify(error="Unknown sensor"), 404
    if TESTING :
        value = dummy_values[sensor]
    else:
        value = sensor_data[sensor]
        
    if value is None:
        return jsonify(sensor=sensor, value=None, status="waiting")
    else:
        sensor_data[sensor] = None  # Reset after retrieval
        return jsonify(sensor=sensor, value=value, status="ready")

# Routes for all sensors
@app.route('/height', methods=['GET'])
def get_height():
    return handle_sensor_request("height")

@app.route('/weight', methods=['GET'])
def get_weight():
    return handle_sensor_request("weight")


@app.route('/temperature', methods=['GET'])
def get_temperature():
    return handle_sensor_request("temperature")

@app.route('/pulse', methods=['GET'])
def get_pulse():
    return handle_sensor_request("pulse")

@app.route('/bp', methods=['GET'])
def get_blood_pressure():
    return handle_sensor_request("bp")

# Polling routes
@app.route('/poll/height', methods=['GET'])
def poll_height():
    return handle_poll_request("height")

@app.route('/poll/weight', methods=['GET'])
def poll_weight():
    return handle_poll_request("weight")

@app.route('/poll/temperature', methods=['GET'])
def poll_temperature():
    return handle_poll_request("temperature")

@app.route('/poll/pulse', methods=['GET'])
def poll_pulse():
    return handle_poll_request("pulse")

@app.route('/poll/bp', methods=['GET'])
def poll_blood_pressure():
    return handle_poll_request("bp")

if __name__ == '__main__':
    app.run(debug=True)