/**
 * StopWatch class
 * generates the stopwatch html that can be used to create multiples instances
 */
class StopWatch {
    _interval = null;
    _time = 0;

    /**
     * Constructor for the stopwatch, renders a new stopwatch card
     * @param {string} container
     * @param {Settings} settings optional default new Settings()
     */
    constructor (container, settings = new StopWatchSettings()){
        if(!container)
            throw new Error(`Invalid container: ${container}`);

        if(!settings || !(settings instanceof StopWatchSettings))
            throw new Error(`Invalid settings: ${settings}`);

        // settings
        this._settings = settings;

        // DOM elements
        this.container = document.querySelector(container);
        this.element = null;
        this.timer = null;
        this.btnStart = null;
        this.btnStop = null;
        this.btnClear = null;

        if(!this.container)
            throw new Error(`Could not find the container: ${container}`);

        // render the stopwatch inside the container
        this.render();

        if(this._settings.autoStart) this.start();
    }

    /**
     * Getter to format the timer on hours:minutes:seconds
     * @returns {string} hh:mm:ss / --:--:--
     */
    get time () {
        if(this._time === 0) return '--:--:--';
        let secs = Math.round(this._time);
        let hours = Math.floor(secs / (60 * 60));

        let minutesDivisor = secs % (60 * 60);
        let minutes = Math.floor(minutesDivisor / 60);

        let secondsDivisor = minutesDivisor % 60;
        let seconds = Math.ceil(secondsDivisor);

        hours = hours ? (hours < 10 ? `0${hours}` : hours) : '--';
        minutes = minutes ? (minutes < 10 ? `0${minutes}` : minutes) : '--';
        seconds = seconds < 10 ? `0${seconds}` : seconds;

        return `${hours}:${minutes}:${seconds}`;
    }

    /**
     * Compose the stopwatch HTML and render it
     */
    render () {
        let col = StopWatchDoom.div({className: ['col', 's12', 'm4', 'l3']});
        this.element = col;

        // compose the card for the stopwatch
        col.appendChild(this.card());

        this.container.appendChild(col);
    }

    /**
     * Compose the stopwatch card DOM
     * @returns {HTMLDivElement}
     */
    card() {
        // card
        let card = StopWatchDoom.div({className: ['card', 'blue-grey', 'darken-1']});

        // card close button
        card.appendChild(StopWatchDoom.button({
            className: ['btn-flat', 'waves-effect', 'waves-light', 'right', 'white-text'],
            icon: {
                text: 'clear',
                // className: ['material-icons']
            },
            click: () => this.remove()
        }));

        // card content
        let content = StopWatchDoom.div({className: ['card-content', 'white-text']});
        card.appendChild(content);

        // let timer = StopWatchDoom.div({className: ['row']});
        let timer = document.createElement('h3');
        timer.classList.add('center');
        timer.innerText = this.time;
        this.timer = timer;
        content.appendChild(timer);

        // compose the card actions buttons
        card.appendChild(this.cardActions());

        return card;
    }

    /**
     * Compose the card actions
     * Includes the start, clear and stop buttons
     * @returns {HTMLDivElement}
     * @private
     */
    cardActions () {
        // card actions
        let actions = StopWatchDoom.div({className: ['card-action']});
        let row = StopWatchDoom.div({className: ['row']});
        actions.appendChild(row);

        let col = StopWatchDoom.div({className: ['col', 's4']});

        // start button
        this.btnStart = StopWatchDoom.button({
            // className: ['btn', 'waves-effect', 'waves-light'],
            icon: {
                text: 'play_arrow',
                // className: ['material-icons']
            },
            click: () => this.start()
        });
        col.appendChild(this.btnStart);
        row.appendChild(col);

        // new col
        col = StopWatchDoom.div({className: ['col', 's4', 'center-align']});

        // reset/clear button
        this.btnClear = StopWatchDoom.button({
            // className: ['btn', 'waves-effect', 'waves-light', 'disabled'],
            icon: {
                text: 'replay',
                // className: ['material-icons']
            },
            attrs: {
                disabled: ''
            },
            click: () => this.clear()
        });
        col.appendChild(this.btnClear);
        row.appendChild(col);

        // new col
        col = StopWatchDoom.div({className: ['col', 's4', 'right-align']});

        // stop button
        this.btnStop = StopWatchDoom.button({
            className: ['btn', 'waves-effect', 'waves-light', 'disabled'],
            icon: {
                text: 'stop',
                className: ['material-icons']
            },
            attrs: {
                disabled: ''
            },
            click: () => this.stop()
        });
        col.appendChild(this.btnStop);
        row.appendChild(col);

        return actions;
    }

    /**
     * Start the stopwatch interval
     * @return {boolean} started
     */
    start () {
        // already started
        if(this._interval) return;

        // start a new interval
        this._interval = setInterval(() => {
            this._time += 1;
            this.timer.innerText = this.time;
        }, 1000);

        StopWatchDoom.disableButton(this.btnStart);
        StopWatchDoom.enableButton(this.btnStop);
        StopWatchDoom.enableButton(this.btnClear);
    }

    /**
     * Stop the timer
     */
    stop () {
        if(this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }

        if(this._settings.resetOnStop) this.clear();

        StopWatchDoom.disableButton(this.btnStop);
        StopWatchDoom.enableButton(this.btnStart);

        if(this._time) StopWatchDoom.enableButton(this.btnClear);
        else StopWatchDoom.disableButton(this.btnClear);
    }

    /**
     * Reset the timer
     */
    clear () {
        this._time = 0;

        // is not running
        if(!this._interval) {
            this.timer.innerText = this.time;

            StopWatchDoom.disableButton(this.btnClear);
            StopWatchDoom.disableButton(this.btnStop);
            StopWatchDoom.enableButton(this.btnStart)
        }
    }

    /**
     * Remove the stopwatch and notify the settings onRemove callback
     */
    remove () {
        this.destroy();

        // execute the on remove callback
        if(this._settings.onRemove && typeof this._settings.onRemove === 'function')
            this._settings.onRemove(this);
    }

    /**
     * Remove the stopwatch on the DOM
     */
    destroy () {
        this.stop();
        this.container.removeChild(this.element);
    }
}