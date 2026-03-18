// ==UserScript==
// @name         LinkShortify Auto-Skip
// @namespace    https://github.com/nOneCode4u/linkshortify-autoskip
// @version      1.0.0
// @description  Automatically skips LinkShortify — aggressively forces countdown to zero
// @author       nOneCode4u
// @match        *://lksfy.com/*
// @match        *://*.lksfy.com/*
// @grant        none
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/nOneCode4u/linkshortify-autoskip/main/versions/v3-aggressive.user.js
// @downloadURL  https://raw.githubusercontent.com/nOneCode4u/linkshortify-autoskip/main/versions/v3-aggressive.user.js
// ==/UserScript==

(function () {
    'use strict';

    // --- PHASE 1: Hook into setTimeout/setInterval to speed up countdowns ---
    const _setTimeout = window.setTimeout;
    const _setInterval = window.setInterval;

    window.setTimeout = function (fn, delay, ...args) {
        return _setTimeout(fn, Math.min(delay, 100), ...args);
    };

    window.setInterval = function (fn, delay, ...args) {
        return _setInterval(fn, Math.min(delay, 100), ...args);
    };

    // --- PHASE 2: On DOM ready, manipulate countdown display and click button ---
    document.addEventListener('DOMContentLoaded', () => {

        // Force any visible countdown number to 0
        const forceZero = () => {
            document.querySelectorAll('*').forEach(el => {
                if (/^\d+$/.test((el.innerText || '').trim()) && el.children.length === 0) {
                    el.innerText = '0';
                }
            });
        };

        // Try clicking button
        const tryClick = () => {
            const selectors = [
                'a.btn', '#btn-main', '.btn-main',
                'button[id*="go"]', 'a[id*="go"]',
                'input[type="submit"]', 'a[href*="go"]',
                '.skip-btn', '#skip', 'button.btn'
            ];

            for (const sel of selectors) {
                const el = document.querySelector(sel);
                if (el) {
                    const text = (el.innerText || el.value || '').toLowerCase();
                    if (!text.includes('wait') && !text.includes('please')) {
                        console.log('[LS-Skip v3] Clicking:', sel);
                        el.removeAttribute('disabled');
                        el.click();
                        return true;
                    }
                }
            }
            return false;
        };

        let attempts = 0;
        const max = 120; // 12 seconds max

        const loop = setInterval(() => {
            attempts++;
            forceZero();
            if (tryClick() || attempts >= max) clearInterval(loop);
        }, 100);
    });
})();
