// ==UserScript==
// @name         LinkShortify Auto-Skip
// @namespace    https://github.com/nOneCode4u/linkshortify-autoskip
// @version      3.1.0
// @description  Automatically skips LinkShortify — aggressively accelerates countdown timers
// @author       nOneCode4u
// @match        *://lksfy.com/*
// @match        *://*.lksfy.com/*
// @match        *://linkshortify.com/*
// @match        *://*.linkshortify.com/*
// @grant        none
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/nOneCode4u/linkshortify-autoskip/main/versions/aggressive.user.js
// @downloadURL  https://raw.githubusercontent.com/nOneCode4u/linkshortify-autoskip/main/versions/aggressive.user.js
// ==/UserScript==

(function () {
    'use strict';

    // ── Timer acceleration ────────────────────────────────────────────────────
    // ONLY collapses delays in the countdown range (500ms–90s).
    // Delays below 500ms are animations, debounce, UI loops — left untouched.
    // Delays above 90s are not countdowns — left untouched.
    // This prevents breaking page rendering, Cloudflare checks, and UI timers.
    // ─────────────────────────────────────────────────────────────────────────
    const _setTimeout  = window.setTimeout.bind(window);
    const _setInterval = window.setInterval.bind(window);

    const accelerate = (delay) => {
        const d = delay || 0;
        return (d >= 500 && d <= 90000) ? 50 : d;
    };

    window.setTimeout  = (fn, delay, ...args) => _setTimeout(fn,  accelerate(delay), ...args);
    window.setInterval = (fn, delay, ...args) => _setInterval(fn, accelerate(delay), ...args);

    // ── DOM ready ─────────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {

        // Force visible countdown numbers to 0
        const forceZero = () => {
            document.querySelectorAll('*').forEach(el => {
                if (/^\d+$/.test((el.innerText || '').trim()) && el.children.length === 0) {
                    el.innerText = '0';
                }
            });
        };

        // Try clicking proceed button
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
                        el.removeAttribute('disabled');
                        el.click();
                        return true;
                    }
                }
            }
            return false;
        };

        let attempts = 0;
        const MAX_ATTEMPTS = 200; // 10 seconds at 50ms

        const loop = setInterval(() => {
            attempts++;
            forceZero();
            if (tryClick() || attempts >= MAX_ATTEMPTS) clearInterval(loop);
        }, 50);
    });
})();
