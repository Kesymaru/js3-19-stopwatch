/**
 * StopWatch Settings class
 */
class Settings {
    autoStart = true;

    constructor (onRemove = null) {
        if(onRemove && typeof onRemove !== 'function')
            throw new Error(`Invalid on remove callback: ${onRemove}`);

        this.onRemove = onRemove;
    }
}