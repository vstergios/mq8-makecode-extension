// MakeCode extension for MQ-8 Hydrogen Gas Sensor
// Supports reading analog values and calculating H2 concentration in ppm

//% weight=100 color=#00A2E8 icon="\u26A1"
namespace MQ8 {

    let RL = 10000; // Default load resistance in ohms (10kΩ)
    let Vc = 5;     // Default supply voltage (5V)
    let Ro = 10000; // Default sensor resistance in clean air (calibrated value)

    /**
     * Set the load resistance (RL) in ohms
     * @param resistance Load resistance in ohms
     */
    //% block="set load resistance to %resistance ohms"
    export function setLoadResistance(resistance: number): void {
        RL = resistance;
    }

    /**
     * Set the sensor baseline resistance in clean air (Ro)
     * @param resistance Baseline resistance in ohms
     */
    //% block="set baseline resistance to %resistance ohms"
    export function setBaselineResistance(resistance: number): void {
        Ro = resistance;
    }

    /**
     * Read the sensor value and calculate Rs
     * @param pin The analog pin connected to the sensor
     * @returns The sensor resistance Rs in ohms
     */
    //% block="get sensor resistance from %pin"
    export function getSensorResistance(pin: AnalogPin): number {
        let Vout = pins.analogReadPin(pin) * (Vc / 1023); // Convert analog reading to voltage
        if (Vout <= 0) return 0; // Avoid division by zero
        let Rs = RL * ((Vc - Vout) / Vout);
        return Rs;
    }

    /**
     * Calculate hydrogen concentration in ppm
     * @param Rs Sensor resistance in ohms
     * @returns Hydrogen concentration in ppm
     */
    //% block="calculate ppm from sensor resistance %Rs"
    export function calculatePPM(Rs: number): number {
        if (Rs <= 0) return 0; // Avoid invalid calculations
        let ratio = Rs / Ro; // Rs/Ro
        let ppm = Math.pow(10, (Math.log10(ratio) - Math.log10(1)) / (-0.6)); // Example formula
        return ppm;
    }

    /**
     * Read hydrogen concentration directly in ppm
     * @param pin The analog pin connected to the sensor
     * @returns Hydrogen concentration in ppm
     */
    //% block="get hydrogen concentration from %pin"
    export function getHydrogenConcentration(pin: AnalogPin): number {
        let Rs = getSensorResistance(pin);
        return calculatePPM(Rs);
    }
}
