// Test script for MQ8 MakeCode extension

// Select the analog pin for the sensor
let sensorPin = AnalogPin.P0;

// Test Calibration
serial.writeLine("Starting Calibration...");
MQ8Sensor.calibrate(sensorPin);
serial.writeLine("Calibration Complete.");

// Test H2 Concentration Reading
serial.writeLine("Reading H2 concentration...");
let h2Concentration = MQ8Sensor.readH2(sensorPin);
serial.writeNumber(h2Concentration);

// Test Changing Sampling Parameters
serial.writeLine("Setting new sampling parameters...");
MQ8Sensor.setSamplingParameters(100, 300, 10, 30);
serial.writeLine("New sampling parameters set.");

// Test Rs Reading
serial.writeLine("Reading sensor resistance...");
let rsValue = MQ8Sensor.readSensor(sensorPin);
serial.writeNumber(rsValue);

serial.writeLine("Test script complete.");
