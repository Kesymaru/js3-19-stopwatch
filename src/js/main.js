(function () {
    const CONTAINER = '.stopwatch';
    const ADD_BTN = '.add-stopwatch';
    const FOOTER = '.page-footer';

    const settings = new StopWatchSettings(onRemove);

    // data
    let stopwatches = [];

    // DOM
    let addBtn = null;
    let footer = null;

    /**
     * Adds a new stopwatch instance
     */
    function add () {
        stopwatches.push(new StopWatch(CONTAINER, settings));
    }

    function settingForm () {
        let form = footer.querySelector('form');
        if(!form) throw new Error(`Could not find the settings form.`);

        // set the value on the from
        form.autoStart.checked = settings.autoStart;
        form.resetOnStop.checked = settings.resetOnStop;

        // auto start on change event
        form.autoStart.addEventListener('change', () => settings.autoStart = !settings.autoStart);

        // reset on stop on change event
        form.resetOnStop.addEventListener('change', () =>{
            settings.resetOnStop = !settings.resetOnStop;
        });

        // start all
        form.startAll.addEventListener('click', () => stopwatches.forEach(s => s.start()));

        // clear all
        form.clearAll.addEventListener('click', () => stopwatches.forEach(s => s.clear()));

        // stop all
        form.stopAll.addEventListener('click', () => stopwatches.forEach(s => s.stop()));

        // remove all
        form.removeAll.addEventListener('click', removeAll);
    }

    /**
     * Remove all
     * Opens a modal to confirm with the user the action
     * @returns {boolean}
     */
    function removeAll () {
        if(!stopwatches.length) return false;

        let content = StopWatchDoom.div();

        let header = document.createElement('h5');
        header.innerText = 'Are you sure you?';
        content.appendChild(header);

        let p = document.createElement('p');
        p.innerText = `This action is irreversible, ${stopwatches.length} StopWatch${stopwatches.length > 1 ? 'es' : ''} will be destroyed.`;
        content.appendChild(p);

        // create the modal
        let modal = new Modal({
            title: 'Remove All',
            content,
            autoOpen: true,
        });

        // promise to wait for user cancelation or confirmation
        modal.promise.then(result => {
                // remove all the stopwatches
                stopwatches = stopwatches
                    .map(s => s.destroy())
                    .filter(s => !!s);
            })
            .catch(err => console.log('canceled', err));
    }

    /**
     * Remove the stopwatch after been removed from the class
     * This methods is called on the StopWatch.remove()
     * Updates the stopwatches array
     * @param {Stopwatch} stopwatch
     */
    function onRemove(stopwatch){
        // finds the index
        let idx = stopwatches.findIndex(s => s === stopwatch);

        // remove it on the array
        if(idx >= 0 ) stopwatches.splice(idx, 1);
    }

    function init () {
        addBtn = document.querySelector(ADD_BTN);
        footer = document.querySelector(FOOTER);

        if(!addBtn) throw new Error(`Could not find the add button: ${ADD_BTN}`);
        if(!footer) throw new Error(`Could not find the footer: ${FOOTER}`);

        // load the form
        settingForm();

        // add a new stopwatch
        add();

        // events
        addBtn.addEventListener('click', add);
    }

    init();
})();