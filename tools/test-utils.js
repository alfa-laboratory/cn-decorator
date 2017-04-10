import ReactDOM from 'react-dom';

let sharedContainer = null;

/**
 * Test wrapper.
 *
 * @typedef {Object} TestWrapper
 * @property {React.Component} instance component's instance
 * @property {Node} node Root component's HTML node
 * @property {Node} container HTML container where component was rendered
 */

/**
 * Renders component into DOM.
 *
 * @param {Object} jsx JSX for render.
 * @param {Object} [options] Render options.
 * @param {String} [options.css] Additional CSS.
 * @param {Node} [options.container] Контейнер, в который нарендерить компонент.
 * @returns {TestWrapper}
 */
export function render(jsx, options = {}) {
    let container = options.container;

    if (!container) {
        if (!sharedContainer) {
            sharedContainer = document.createElement('div');
            document.body.appendChild(sharedContainer);
        }
        container = sharedContainer;
    }

    if (options.css) {
        container.setAttribute('style', options.css);
    }

    let instance = ReactDOM.render(jsx, container); // eslint-disable-line

    return {
        instance,
        node: ReactDOM.findDOMNode(instance), // eslint-disable-line
        container
    };
}

/**
 * Clean up DOM after test.
 */
export function cleanUp() {
    if (sharedContainer) {
        if (sharedContainer.parentNode) {
            sharedContainer.parentNode.removeChild(sharedContainer);
        }

        sharedContainer = null;
    }
}
