/*************************************************************
 *  Dependencies, loaded from unpkg CDN and sanely exposed
 *************************************************************/

/**
 * Preact for Components 
 */
import * as preact from 'https://unpkg.com/preact@10.12.1?module'; 
export const { 
    render,
    Component,
    createRef,
    createContext
} = preact; 

/**
 * htm for html templating
 */
import htm from 'https://unpkg.com/htm@3.1.1?module'; 
export const html = htm.bind(preact.h);

/**
 * Emotion for css generation
 */
import 'https://unpkg.com/@emotion/css@11.0.0/dist/emotion-css.umd.min.js';
export const {
    css
} = emotion;

/**
 * Popper for overlays and tooltips
 */
import 'https://unpkg.com/@popperjs/core@2.11.6/dist/umd/popper-lite.min.js';
export const {
    createPopper
} = Popper;

/**
 * Luxon for date time functionality
 */
import * as luxon from 'https://unpkg.com/luxon@3.2.1/build/es6/luxon.js';
export const {
    DateTime,
    Zone
} = luxon;

/**
 * tzdb for time zone data.
 * @type {Promise<TzItem[]>}
 */
let _tzdbPromise = fetch('https://unpkg.com/@vvo/tzdb@6.96.0/raw-time-zones.json').then(res => res.json());
export function loadTzDb(){return _tzdbPromise};