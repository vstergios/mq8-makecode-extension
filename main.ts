//% weight=100 color=#00A6F0 icon=""
//% block="MQ-8 Sensor"
namespace MQ8Sensor {
    let Ro = 10; // Default Ro value
    const RL_VALUE = 10; // Load resistance in kilo-ohms
    const RO_CLEAN_AIR_FACTOR = 9.21; // Clean air factor from datasheet

    // H2 Curve: {x, y, slope}
    const H2Curve = [2.3, 0.93, -1.44];

    // Sampling settings
    let calibrationSamples = 50;
    let calibrationInterval = 500;
    let readSamples = 5;
    let readInterval = 50;

    /**
     * Calibrate the MQ-8 sensor in clean air
     * @param pin the analog pin connected to the sensor
     */
    //% block="calibrate MQ-8 on pin %pin"
    //% pin.defl=AnalogPin.P0
    export function calibrate(pin: AnalogPin): void {
        let total = 0;
        for (let i = 0; i < calibrationSamples; i++) {
            total += calculateResistance(pins.analogReadPin(pin));
            basic.pause(calibrationInterval);
        }
        Ro = total / calibrationSamples / RO_CLEAN_AIR_FACTOR;
    }

    /**
     * Read the H2 concentration in ppm
     * @param pin the analog pin connected to the sensor
     */
    //% block="read H2 concentration on pin %pin"
    //% pin.defl=AnalogPin.P0
    export function readH2(pin: AnalogPin): number {
        let rs = readSensor(pin);
        let ratio = rs / Ro;
        return calculateGasPercentage(ratio, H2Curve);
    }

    /**
     * Set sampling parameters for calibration and reading
     * @param calSamples number of calibration samples
     * @param calInterval interval between calibration samples (ms)
     * @param readSamples number of read samples
     * @param readInterval interval between read samples (ms)
     */
    //% block="set sampling parameters: cal samples %calSamples interval %calInterval ms, read samples %readSamples interval %readInterval ms"
    export function setSamplingParameters(
        calSamples: number,
        calInterval: number,
        newReadSamples: number,
        newReadInterval: number
    ): void {
        calibrationSamples = calSamples;
        calibrationInterval = calInterval;
        readSamples = newReadSamples; // Change readSamples directly
        readInterval = newReadInterval; // Change readInterval directly
    }

    /**
     * Read the raw resistance (Rs) from the sensor
     * @param pin the analog pin connected to the sensor
     */
    //% block="read Rs from pin %pin"
    export function readSensor(pin: AnalogPin): number {
        let total = 0;
        for (let i = 0; i < readSamples; i++) {
            total += calculateResistance(pins.analogReadPin(pin));
            basic.pause(readInterval);
        }
        return total / readSamples;
    }

    /**
     * Calculate resistance from ADC value
     * @param rawADC the raw analog value
     */
    function calculateResistance(rawADC: number): number {
        return (RL_VALUE * (1023 - rawADC)) / rawADC;
    }

    /**
     * Calculate gas concentration in ppm from Rs/Ro ratio
     * @param ratio Rs divided by Ro
     * @param curve the gas curve
     */
    function calculateGasPercentage(ratio: number, curve: number[]): number {
        return Math.pow(10, (Math.log(ratio) / Math.LN10 - curve[1]) / curve[2] + curve[0]);
    }
}
