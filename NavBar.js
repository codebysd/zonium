import { html, Component, css } from './deps.js';

/**
 * Component styles
 */
const styles = {
    navBar: css`
        & {
            border-bottom: 1px solid var(--form-element-border-color);
        }

        li {
            padding: 0.5rem;
            font-size:1.25rem;
        }

        li [role="button"] {
            border:unset;
            padding: 0 0.25rem;
            font-size:1.25rem;
        }
    `
};

/**
 * App navigation bar.
 */
export class NavBar extends Component {
    /**
     * Media query to detect external dark mode settings and changes
     */
    #darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    /**
     * Handles dark mode change events
     * @param {MediaQueryListEvent} evt - Media query list event
     */
    #modeChangeHandler = evt => this.#setDarkMode(evt.matches);

    /**
     * Component state
     */
    state = {
        darkMode: this.#darkModeQuery.matches
    }

    /**
     * Handle component attached.
     */
    componentDidMount() {
        // listen to external changes to dark mode
        this.#darkModeQuery.addEventListener('change', this.#modeChangeHandler);
    }

    /**
     * Toggle or apply dark more
     * @param {boolean} enabled - True to enable dark mode, false to disable. 
     */
    #setDarkMode(enabled) {
        const darkMode = enabled ?? !this.state.darkMode;
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
        this.setState({ darkMode });
    }

    /**
     * Render component.
     * @param {*} props - component properties
     * @param {*} state - component state
     * @returns HTML template
     */
    render(props,state) {
        return html`
        <nav class="container-fluid ${styles.navBar}">
            <!-- App icon -->
            <ul>
                <li><i class="bi bi-calendar-check"></i></li>
                <li><strong>Zonium</strong></li>
            </ul>

            <!-- Actions and Links -->
            <ul>
                <li>
                    <!-- Dark mode toggle -->
                    <i class="bi ${state.darkMode ? 'bi-lightbulb-off' : 'bi-lightbulb'} outline" role="button" 
                        aria-roledescription="Switch color theme"
                        onclick=${() => this.#setDarkMode(!state.darkMode)}></i>
                </li>
                <li>
                    <!-- Github link -->
                    <a class="bi bi-github outline" role="button" 
                        href="https://github.com/codebysd/zonium" target="_blank"
                        aria-roledescription="Go to Github"></a>
                </li>
            </ul>   
        </nav>
        `;
    }

    /**
     * Handle component detach.
     */
    componentWillUnmount() {
        // unsubscribe from media query events
        this.#darkModeQuery.removeEventListener('change', this.#modeChangeHandler);
    }
}