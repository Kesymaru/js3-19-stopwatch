/**
 * Simple modal class
 */
class Modal {
    /**
     * Constructor for the modal
     * @param {HTMLElement\string} container optional default document.body
     * @param {String} title optional
     * @param {Function} onClose optional
     * @return {Promise}
     */
    constructor({
                    container = document.body,
                    title = '',
                    content = null,
                    footer = null,
                    autoOpen = false,
    } = {}){
        if(!container || typeof container === 'object' && !(container instanceof HTMLElement))
            throw new Error(`Invalid container, must be HTMLElement or querySelector: ${container}`);

        if(typeof container === 'string'){
            let element = document.querySelector(container);
            if(!container)
                throw new Error(`Could not find the the container: ${container}`);
            container = element;
        }

        this.container = container;
        this.title = title;
        this.modalContent = content;
        this.modalFooter = footer;
        this.autoOpen = autoOpen;

        // compose the modal
        this.element = this.modal();

        // init the modal
        this.modal = M.Modal.init(this.element);

        // append the modal to the container
        this.container.appendChild(this.element);

        if(this.autoOpen) this.open();

        // promise
        this.promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    /**
     * Compose the modal title, content and footer
     * @returns {HTMLDivElement} modal
     */
    modal () {
        let modal = StopWatchDoom.div({className: ['modal']});

        let content = StopWatchDoom.div({className: ['modal-content']});
        modal.appendChild(content);

        if(this.title) {
            let title = document.createElement('h4');
            title.innerText = this.title;
            StopWatchDoom.addClass(title, 'center');
            content.appendChild(title);
        }

        if(this.modalContent instanceof HTMLElement)
            content.appendChild(this.modalContent);
        
        let footer = StopWatchDoom.div({className: 'modal-footer'});
        modal.appendChild(footer);

        if(this.modalFooter instanceof HTMLElement)
            footer.appendChild(this.modalFooter);
        else footer.appendChild(this.footer());

        return modal;
    }

    /**
     * Compose the modal default footer
     * @returns {HTMLElement}
     */
    footer () {
        let row = StopWatchDoom.div({className: 'row'});

        let col = StopWatchDoom.div({className: ['col', 's6']});
        row.appendChild(col);
        
        let btnSave = StopWatchDoom.button({
            text: 'Cancel',
            className: ['btn', 'waves-effect', 'waves-light', 'left'],
            icon: {
                className: ['material-icons', 'right'],
                text: 'clear'
            },
            click: () => this.close()
        });
        col.appendChild(btnSave);
        row.appendChild(col);

        col = StopWatchDoom.div({className: ['col', 's6']});
        let btnClose = StopWatchDoom.button({
            text: 'Continue',
            className: ['btn', 'waves-effect', 'waves-light', 'red'],
            icon: {
                className: ['material-icons', 'right'],
                text: 'done'
            },
            click: () => this.confirm()
        });
        col.appendChild(btnClose);
        row.appendChild(col);

        return row;
    }

    open () {
        this.modal.open();
    }

    close () {
        this.modal.close();
        this._reject('cancelled');
    }

    confirm () {
        this.modal.close();
        this._resolve('accepeted');
    }
}