import { html, Component, css, createRef, createPopper } from './deps.js';
import { PopperModifiers, isClickInside, Stream } from './Util.js';
import { Tz } from './Tz.js';

/**
 * Component styles
 */
const styles = {
    popup: css`
        & {
            display: none;
        }

        &[data-shown]{
            display: block;
        }
    `,
    popupContent: css`
        & {
            padding: 1rem;
            margin: 1rem;
        }

        button {
            max-width: min-content;
        }
    `,
    results: css`
        & {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 12px;
        }
    `
}

/**
 * Presents search and search results for selecting a time zone.
 */
export class ZoneSearch extends Component {
    /**
     * Handler for global click events.
     */
    #docClickHandler = this.#onDocClicked.bind(this);

    /**
     * Reference for input element.
     */
    #inputRef = createRef();

    /**
     * Reference for popup element.
     */
    #popupRef = createRef();

    /**
     * Search operation.
     */
    #searchOp = new Stream(text => this.#doSearch(text), r => this.setState({ results: r, popupShown: true }));

    /**
     * Popper instance.
     */
    #popper;

    /**
     * Component state.
     */
    state = {
        popupShown: false,
        results: []
    }

    /**
     * @inheritdoc
     */
    componentDidMount() {
        // create popper instance
        this.#popper = createPopper(this.#inputRef.current, this.#popupRef.current, {
            modifiers: [PopperModifiers.sameWidth]
        });

        // register for global clicks
        document.addEventListener('click', this.#docClickHandler);
    }

    /**
     * Update results and toggle popup visibility based on current search text.
     */
    #updateResults() {
        const text = this.#inputRef.current?.value;
        const empty = (text?.length ?? 0) < 1 || /^\s+$/.test(text);

        if (empty) {
            this.#searchOp.abort();
            this.setState({ results: [], popupShown: false });
        } else {
            this.#searchOp.next(text);
        }
    }

    /**
     * Hanlde zone selection.
     * @param {*} z 
     */
    #selectZone(z) {
        if (this.#inputRef.current) {
            this.#inputRef.current.value = '';
            this.#updateResults();
        }
    }

    /**
     * Handle global clicks.
     * @param {MouseEvent} evt - event 
     */
    #onDocClicked(evt) {
        const elements = [this.#inputRef.current, this.#popupRef.current];
        if (!elements.some(e => isClickInside(evt, e))) {
            // clicked outside
            this.setState({ popupShown: false });
        }
    }

    async #doSearch(text) {
        const results = await Tz.search(text);
        return results.map(r => r.name);
    }

    /**
     * Render component.
     * @param {*} props - component properties
     * @param {*} state - component state
     * @returns HTML template
     */
    render(props, state) {
        return html`
            <!-- Search Input -->
            <input type="search" placeholder="Search Timezone" 
                ref=${this.#inputRef} 
                oninput=${() => this.#updateResults()}
                onfocus=${() => this.#updateResults()} /> 

            <!-- Results Popup -->
            <div ref=${this.#popupRef} class="${styles.popup}" data-shown="${state.popupShown || null}">

                <!-- Popup content -->
                <article class="${styles.popupContent}">
                    <!-- status -->
                    <h5>${state.results.length > 0 ? 'Add a Timezone' : 'No matching Timezones'}</h5>
                    
                    <div class="${styles.results}">
                        <!-- Time zone buttons -->
                        ${state.results.map(r => html`
                            <button class="outline secondary" 
                            onclick=${() => this.#selectZone(r)}>${r}</button>
                        `)}
                    </div>
                </article>

            </div>
        `;
    }

    /**
     * Handle component updated.
     */
    componentDidUpdate() {
        this.#popper?.update();
    }

    /**
     * Handle component detach.
     */
    componentWillUnmount() {
        this.#popper?.destroy();
        document.removeEventListener('click', this.#docClickHandler);
        this.#searchOp.destroy();
    }
}