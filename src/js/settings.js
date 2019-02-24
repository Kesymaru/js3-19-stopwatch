/**
 * StopWatch Settings class
 */
class Settings {
    autoStart = true; // automatically start when stopwatch is created
    resetOnStop = false; // reset the time when stopped

    constructor (onRemove = null) {
        if(onRemove && typeof onRemove !== 'function')
            throw new Error(`Invalid on remove callback: ${onRemove}`);

        this.onRemove = onRemove;
    }
}