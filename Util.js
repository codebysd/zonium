/**
 * Popper modifiers
 */
export const PopperModifiers = {
    /**
     * Keeps popups same width as the reference
     */
    sameWidth: {
        name: 'sameWidth',
        enabled: true,
        phase: 'beforeWrite',
        requires: ['computeStyles'],
        fn: ({ state }) => {
            state.styles.popper.width = `${state.rects.reference.width}px`;
        },
        effect: ({ state }) => {
            state.elements.popper.style.width = `${state.elements.reference.offsetWidth}px`;
        }
    }
}

/**
 * Detect if the given mouse event happened inside the bounding box of given element.
 * @param {MouseEvent} event - mouse event
 * @param  {Element} element - element to test
 */
export function isClickInside(event, element) {
    if (!(event instanceof MouseEvent) || event.type !== 'click') {
        return false;
    }

    if (!(element instanceof Element)) {
        return false;
    }

    const x = event.clientX;
    const y = event.clientY;
    const rect = element.getBoundingClientRect();

    return x > rect.left && x < rect.right && y > rect.top && y < rect.bottom;
}

/**
 * Minimal reactive switch-map stream.
 */
export class Stream {
    #counter = 0;
    #mapper = null;
    #handler = null;
    #active = true;

    /**
     * Create a new stream
     * @param {(any) => any} mapper mapper function
     * @param {(any,err) => void} handler handler function 
     */
    constructor(mapper, handler) {
        this.#mapper = mapper;
        this.#handler = handler;
    }

    /**
     * Publish a value
     * @param {*} value 
     */
    next(value) {
        if (!this.#active) {
            return;
        }

        const id = ++this.#counter;
        Promise.resolve(value).then(input => {
            if (this.#active && id === this.#counter && typeof this.#mapper === 'function') {
                return this.#mapper(input);
            } else {
                return input;
            }
        }).then(output => {
            if (this.#active && id === this.#counter && typeof this.#handler === 'function') {
                this.#handler(output);
            }
        }).catch(err => {
            if (this.#active && id === this.#counter && typeof this.#handler === 'function') {
                this.#handler(undefined, err);
            }
        })
    }

    /**
     * Aborts any currently enqueued processing.
     */
    abort(){
        this.#counter++;
    }

    /**
     * Disable stream permanently.
     */
    destroy() {
        this.#active = false;
    }
}