import { loadTzDb } from './deps.js';

/**
 * @typedef TzItem
 * @property {string[]} keywords
 * @property {string} name
 * @property {string} alternativeName
 * @property {string[]} group
 * @property {string} continentName
 * @property {string} countryName
 * @property {string[]} mainCities
 * @property {string} abbreviation
 * @property {number} rawOffsetInMinutes 
 */

/**
 * Time zone utilitites.
 */
export class Tz {
    /**
     * Time zone indexing promise.
     * @type {Promise<TzItem[]>}
     */
    static #indexPromise = null;

    /**
     * Add keywords to time zone item.
     * @param {TzItem} d  time zone item.
     */
    static #index(d) {
        const keywords = [
            d.name, d.alternativeName,
            d.countryName, d.countryCode, d.continentName, d.abbreviation,
            ...d.mainCities
        ].filter(s => typeof s === 'string')
            .map(s => s.toLowerCase().trim());
        return { ...d, keywords };
    }

    /**
     * Indexed version of time zone data.
     * @type {Promise<TzItem[]>}
     */
    static get #indexed() {
        if (this.#indexPromise === null) {
            this.#indexPromise = loadTzDb().then(db => db.map(d => Tz.#index(d)));
        }
        return this.#indexPromise;
    }

    /**
     * Search time zone db.
     * @param {string} text 
     * @returns {Promise<TzItem[]>}
     */
    static async search(text) {
        if (typeof text !== 'string' || text.length < 1 || /^\s+$/.test(text)) {
            return [];
        }

        const db = await this.#indexed;
        const str = text.toLocaleLowerCase();
        return db.filter(d => d.keywords.some(k => k.includes(str)));
    }
}