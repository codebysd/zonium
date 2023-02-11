import { html, Component, css } from './deps.js';
import { NavBar } from './NavBar.js';
import { ZoneSearch } from './ZoneSearch.js';

/**
 * Component styles
 */
const styles = {
    content:css`
        & {
            overflow-y: auto;
            padding: 1rem;
        }
    `
}

/**
 * Root component
 */
export class App extends Component {

    /**
     * Render component.
     * @param {*} props - component properties
     * @param {*} state - component state
     * @returns HTML template
     */
    render(props, state) {
        return html`
            <!-- navigation bar -->
            <${NavBar} />

            <!-- content -->
            <section class="container ${styles.content}">
                <${ZoneSearch} />
            </section>
        `;
    }
}