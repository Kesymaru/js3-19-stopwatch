/**
 * Utility class to compose DOOM
 */
class StopWatchDoom {
    /**
     * Compose a DIV element
     * @param {string} text optional
     * @param {array} className optional
     * @returns {HTMLDivElement}
     */
    static div ({text = '', className = []} = {}) {
        let div = document.createElement('div');

        StopWatchDoom.addClass(div, className);

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
    static button ({
                       text = '',
                       className = ['btn', 'waves-effect', 'waves-light'],
                       icon = null,
                       attrs = null,
                       click = null
                   }) {
        let button = document.createElement('button');
        if(text) button.innerText = text;

        StopWatchDoom.addClass(button, className);

        // button with icon
        if(icon) button.appendChild(StopWatchDoom.icon(icon));

        // button attributes
        if(attrs && Array.isArray(attrs))
            attrs.forEach((value, attr) => button.setAttribute(attr, value));

        // click handler
        if(click && typeof click === 'function')
            button.addEventListener('click', click);

        return button;
    }

    /**
     * Add a list or a single class to an element
     * @param {HTMLElement} element
     * @param {Array|String} className
     * @returns {Boolean} is class was added
     */
    static addClass (element, className) {
        if(!element || !(element instanceof HTMLElement) || !className || !className.length)
            return false;

        if(Array.isArray(className)) {
            element.classList.add(...className);
            return true;
        }
        else if(typeof className === 'string') {
            element.classList.add(className);
            return true;
        }

        return false;
    }

    /**
     * Compose a icon element
     * Uses materialize for the icon
     * @param {string} text optional
     * @param {array} className optional
     * @returns {HTMLElement} icon
     */
    static icon ({text =  '', className = ['material-icons']}) {
        let icon = document.createElement('i');
        icon.innerText = text;

        StopWatchDoom.addClass(icon, className);

        return icon;
    }

    /**
     * Disable a button
     * @param {HTMLButtonElement} button
     */
    static disableButton (button) {
        if(!(button instanceof HTMLButtonElement))
            throw new Error(`Invalid button is not a HTMLButtonElement: ${button}`);

        button.setAttribute('disabled', '');
        button.classList.add('disabled');
    }

    /**
     * Disable a button
     * @param {HTMLButtonElement} button
     */
    static enableButton (button) {
        if(!(button instanceof HTMLButtonElement))
            throw new Error(`Invalid button is not a HTMLButtonElement: ${button}`);

        button.removeAttribute('disabled');
        button.classList.remove('disabled');
    }
}