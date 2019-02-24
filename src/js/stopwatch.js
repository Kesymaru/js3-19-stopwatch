/**
 * Stopwatch class
 * generates the stopwatch html can be used to crea multiples instances
 */
class Stopwatch {
    _interval = null;
    _time = 0;

    /**
     * Constructor for the stopwatch, renders a new stopwatch card
     * @param {string} container
     * @param {Settings} settings optional default new Settings()
     */
    constructor (container, settings = new Settings()){
        if(!container)
            throw new Error(`Invalid container: ${container}`);

        if(!settings || !(settings instanceof Settings))
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
        let col = Stopwatch.div({className: ['col', 's12', 'm4', 'l3']});
        this.element = col;

        // compose the card for the stopwatch
        col.appendChild(this._card());

        this.container.appendChild(col);
    }

    _card() {
        // card
        let card = Stopwatch.div({className: ['card', 'blue-grey', 'darken-1']});

        // card close button
        card.appendChild(Stopwatch.button({
            className: ['btn-flat', 'waves-effect', 'waves-light', 'right', 'white-text'],
            icon: {
                text: 'clear',
                className: ['material-icons']
            },
            click: () => this.remove()
        }));

        // card content
        let content = Stopwatch.div({className: ['card-content', 'white-text']});
        card.appendChild(content);

        // let timer = Stopwatch.div({className: ['row']});
        let timer = document.createElement('h3');
        timer.classList.add('center');
        timer.innerText = this.time;
        this.timer = timer;
        content.appendChild(timer);

        // compose the card actions buttons
        card.appendChild(this._cardActions());

        return card;
    }

    /**
     * Compose the card actions
     * Includes the start, clear and stop buttons
     * @returns {HTMLDivElement}
     * @private
     */
    _cardActions () {
        // card actions
        let actions = Stopwatch.div({className: ['card-action']});
        let row = Stopwatch.div({className: ['row']});
        actions.appendChild(row);

        let col = Stopwatch.div({className: ['col', 's4']});

        // start button
        this.btnStart = Stopwatch.button({
            // text: 'Start',
            className: ['btn', 'waves-effect', 'waves-light'],
            icon: {
                text: 'play_arrow',
                className: ['material-icons']
            },
            click: () => this.start()
        });
        col.appendChild(this.btnStart);
        row.appendChild(col);

        // new col
        col = Stopwatch.div({className: ['col', 's4', 'center-align']});

        // clear button
        this.btnClear = Stopwatch.button({
            // text: 'Stop',
            className: ['btn', 'waves-effect', 'waves-light', 'disabled'],
            icon: {
                text: 'replay',
                className: ['material-icons']
            },
            attrs: {
                disabled: ''
            },
            click: () => this.clear()
        });
        col.appendChild(this.btnClear);
        row.appendChild(col);

        // new col
        col = Stopwatch.div({className: ['col', 's4', 'right-align']});

        // stop button
        this.btnStop = Stopwatch.button({
            // text: 'Stop',
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
     * Compose a DIV element
     * @param {string} text optional
     * @param {array} className optional
     * @returns {HTMLDivElement}
     */
    static div ({text = '', className = []}) {
        let div = document.createElement('div');
        div.classList.add(...className);

        if(text) div.innerText = text;

        return div;
    }

    /**
     * Compose a buttons
     * @param {string} text default ''
     * @param {array} className optional
     * @param {object} icon optional
     * @param {array} attrs button attributes optional
     * @param {function} click handler optional
     * @returns {HTMLButtonElement}
     */
    static button ({text = '', className = [], icon = null, attrs = null, click = null}) {
        let button = document.createElement('button');
        if(text) button.innerText = text;
        button.classList.add(...className);

        // button with icon
        if(icon) button.appendChild(Stopwatch.icon(icon));

        // button attributes
        if(attrs && Array.isArray(attrs))
            attrs.forEach((value, attr) => button.setAttribute(attr, value));

        // click handler
        if(click && typeof click === 'function')
            button.addEventListener('click', click);

        return button;
    }

    static icon ({text =  '', className = []}) {
        let icon = document.createElement('i');
        icon.innerText = text;
        icon.classList.add(...className);
        return icon;
    }

    static disableButton (btn) {
        btn.setAttribute('disabled', '');
        btn.classList.add('disabled');
    }

    static enableButton (btn) {
        btn.removeAttribute('disabled');
        btn.classList.remove('disabled');
    }

    /**
     * Start the stopwatch interval
     * @return {boolean} started
     */
    start () {
        // already started
        if(this._interval) return true;

        // start a new interval
        this._interval = setInterval(() => {
            this._time += 1;
            this.timer.innerText = this.time;
        }, 1000);

        Stopwatch.disableButton(this.btnStart);
        Stopwatch.enableButton(this.btnStop);
        Stopwatch.enableButton(this.btnClear);
    }

    /**
     * Stop the timer
     */
    stop () {
        if(this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }

        Stopwatch.disableButton(this.btnStop);
        Stopwatch.enableButton(this.btnStart);

        if(this._time) Stopwatch.enableButton(this.btnClear);
        else Stopwatch.disableButton(this.btnClear);
    }

    /**
     * Reset the timer
     */
    clear () {
        this._time = 0;

        // is not running
        if(!this._interval) {
            this.timer.innerText = this.time;

            Stopwatch.disableButton(this.btnClear);
            Stopwatch.disableButton(this.btnStop);
            Stopwatch.enableButton(this.btnStart)
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