(function () {
    const CONTAINER = '.stopwatch';
    const ADD_BTN = '.add-stopwatch';
    const FOOTER = '.page-footer';

    const settings = new Settings(onRemove);

    // data
    let stopwatches = [];

    // DOM
    let addBtn = null;
    let footer = null;

    /**
     * Adds a new stopwatch instance
     */
    function add () {
        stopwatches.push(new Stopwatch(CONTAINER, settings));
    }

    function settingForm () {
        let form = footer.querySelector('form');
        if(!form) throw new Error(`Could not find the settings form.`);

        // set the value
        form.autoStart.checked = settings.autoStart;

        // auto start on change
        form.autoStart.addEventListener('change', () => settings.autoStart = !settings.autoStart);

        // start all
        form.startAll.addEventListener('click', () => stopwatches.forEach(s => s.start()));

        // clear all
        form.clearAll.addEventListener('click', () => stopwatches.forEach(s => s.clear()));

        // stop all
        form.stopAll.addEventListener('click', () => stopwatches.forEach(s => s.stop()));

        // remove all
        form.removeAll.addEventListener('click', () => stopwatches = stopwatches
            .map(s => s.destroy())
            .filter(s => !!s)
        );
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