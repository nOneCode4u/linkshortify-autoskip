// ==UserScript==
// @name         LinkShortify Auto-Skip
// @namespace    https://github.com/nOneCode4u/linkshortify-autoskip
// @version      3.1.0
// @description  Automatically bypasses countdowns, timers and ads on LinkShortify (lksfy.com)
// @author       nOneCode4u
// @match        *://lksfy.com/*
// @match        *://*.lksfy.com/*
// @match        *://linkshortify.com/*
// @match        *://*.linkshortify.com/*
// @grant        none
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/nOneCode4u/linkshortify-autoskip/main/versions/smart.user.js
// @downloadURL  https://raw.githubusercontent.com/nOneCode4u/linkshortify-autoskip/main/versions/smart.user.js
// ==/UserScript==

(function () {
    'use strict';

    // ─────────────────────────────────────────────────────────
    // SITE CONFIG
    // Add new shortener sites here. Each entry needs:
    //   hosts     → hostname substrings to match
    //   proceed   → words that appear on the "go" button
    //   selectors → CSS selectors for the proceed button (fallback)
    // ─────────────────────────────────────────────────────────
    const SITES = [
        {
            hosts:     ['lksfy.com', 'linkshortify.com'],
            proceed:   ['get link', 'continue', 'proceed', 'go', 'click here',
                        'visit', 'open', 'next', 'get', 'access'],
            selectors: ['#btn-main', '.btn-main', 'a.btn', 'button.btn',
                        '[id*="go-link"]', '[id*="getlink"]', '[class*="get-link"]',
                        '[id*="btn"]', '[class*="btn-get"]']
        }
        // Future site example:
        // { hosts: ['example.com'], proceed: ['continue'], selectors: ['#skip'] }
    ];

    // ─────────────────────────────────────────────────────────
    // INIT — match current page to config
    // ─────────────────────────────────────────────────────────
    const HOST = window.location.hostname;
    const cfg  = SITES.find(s => s.hosts.some(h => HOST.includes(h)));
    if (!cfg) return;

    const L    = (m) => console.log('[skip]', m);
    const SKIP = ['wait', 'please', 'loading', 'verif', 'second'];

    // ─────────────────────────────────────────────────────────
    // METHOD 1 — NETWORK INTERCEPT (hardest to patch)
    // Hooks fetch() and XHR to capture the destination URL
    // directly from API responses. Requires backend redesign
    // to defeat — renaming buttons/classes has zero effect.
    // ─────────────────────────────────────────────────────────
    let destUrl = null;

    const isExternal = (url) =>
        url && url.startsWith('http') && !cfg.hosts.some(h => url.includes(h));

    const tryExtract = (body) => {
        try {
            const j = JSON.parse(body);
            // Check common API response field names
            const u = j?.url || j?.destination || j?.dest || j?.redirect
                   || j?.link || j?.target || j?.href || j?.data?.url
                   || j?.result?.url || j?.response?.url;
            if (isExternal(u)) { destUrl = u; L('Network hit: ' + u); }
        } catch (_) {}
    };

    // Hook fetch()
    const _fetch = window.fetch.bind(window);
    window.fetch = async (...a) => {
        const r = await _fetch(...a);
        r.clone().text().then(tryExtract);
        return r;
    };

    // Hook XHR
    const _xOpen = XMLHttpRequest.prototype.open;
    const _xSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (m, u, ...r) {
        this._u = u; return _xOpen.apply(this, [m, u, ...r]);
    };
    XMLHttpRequest.prototype.send = function (...a) {
        this.addEventListener('load', function () { tryExtract(this.responseText); });
        return _xSend.apply(this, a);
    };

    // ─────────────────────────────────────────────────────────
    // METHOD 2 — STATE TRANSITION WATCHER (hard to patch)
    // Watches for ANY element changing from disabled→enabled
    // Does not rely on IDs, classes, or text — purely behavioral.
    // Defeating this requires not using disabled state at all.
    // ─────────────────────────────────────────────────────────
    const wasDisabled = new WeakSet();

    const checkTransition = (el) => {
        if (!el || el.tagName === 'INPUT' && el.type === 'hidden') return null;
        const wasOff = wasDisabled.has(el);
        const isNowOn = !el.disabled && el.offsetParent !== null;
        if (wasOff && isNowOn) return el;
        if (el.disabled) wasDisabled.add(el);
        return null;
    };

    // ─────────────────────────────────────────────────────────
    // METHOD 3 — COUNTDOWN VARIABLE ZEROING
    // Zeroes common JS countdown variables on window object.
    // ─────────────────────────────────────────────────────────
    const zeroCountdown = () => {
        const keys = ['counter','count','countdown','timer','seconds',
                      'time','sec','remaining','timeLeft','timerCount'];
        keys.forEach(k => {
            if (typeof window[k] === 'number' && window[k] > 0) {
                window[k] = 0; L('Zeroed: ' + k);
            }
        });
        // Also zero any property on window that looks like a small countdown
        Object.keys(window).forEach(k => {
            if (typeof window[k] === 'number' && window[k] > 0 && window[k] < 120
                && k.toLowerCase().match(/time|count|sec|tick|remain/)) {
                window[k] = 0;
            }
        });
    };

    // ─────────────────────────────────────────────────────────
    // METHOD 4 — BUTTON DETECTION (text + selector fallback)
    // Text detection is more resilient than selectors.
    // Selectors are last resort fallback only.
    // ─────────────────────────────────────────────────────────
    const isReady = (el) => {
        if (!el || el.disabled || el.offsetParent === null) return false;
        const t = (el.innerText || el.value || el.textContent || '').toLowerCase().trim();
        return !SKIP.some(w => t.includes(w));
    };

    const findByText = () => {
        for (const el of document.querySelectorAll('a,button,input[type=submit],input[type=button]')) {
            if (!isReady(el)) continue;
            const t = (el.innerText || el.value || el.textContent || '').toLowerCase();
            if (cfg.proceed.some(w => t.includes(w))) return el;
        }
        return null;
    };

    const findBySelector = () => {
        for (const s of cfg.selectors) {
            const el = document.querySelector(s);
            if (el && isReady(el)) return el;
        }
        return null;
    };

    // ─────────────────────────────────────────────────────────
    // DOM READY — start active phase
    // ─────────────────────────────────────────────────────────
    const domReady = () => {

        // Toast
        const t = document.createElement('div');
        t.style.cssText = `
            position:fixed;bottom:20px;left:50%;transform:translateX(-50%);
            background:#1a1a2e;color:#e0e0e0;padding:10px 22px;
            border-radius:22px;font-size:13px;font-family:sans-serif;
            z-index:999999;box-shadow:0 4px 18px rgba(0,0,0,.5);
            border:1px solid #333;pointer-events:none;
            transition:opacity .4s;white-space:nowrap;
        `;
        t.textContent = '⏳ Auto-Skip: Starting...';
        document.body.appendChild(t);
        const toast = (m, c) => { t.textContent = m; if (c) t.style.color = c; };
        const fade  = (ms=3000) => setTimeout(() => { t.style.opacity='0'; }, ms);

        // Click
        let done = false;
        const go = (el, why) => {
            if (done) return;
            done = true;
            L('Click via: ' + why);
            toast('✅ Redirecting...', '#4caf50');
            fade(2500);
            obs.disconnect();
            clearInterval(poll);
            el.removeAttribute('disabled');
            el.click();
        };

        // MutationObserver — reacts to ANY DOM change
        const obs = new MutationObserver((mutations) => {
            // Check state transitions first (Method 2)
            for (const m of mutations) {
                for (const n of m.addedNodes) {
                    if (n.nodeType === 1 && isReady(n)) {
                        const t2 = (n.innerText||'').toLowerCase();
                        if (cfg.proceed.some(w => t2.includes(w))) { go(n, 'added-node'); return; }
                    }
                }
                if (m.type === 'attributes' && m.target) {
                    const el = checkTransition(m.target);
                    if (el) { go(el, 'transition'); return; }
                }
            }
            // Then text + selector detection
            const btn = findByText() || findBySelector();
            if (btn) go(btn, 'mutation-scan');
        });
        obs.observe(document.body, {
            childList: true, subtree: true,
            attributes: true, attributeFilter: ['disabled', 'class', 'style']
        });

        // Poll loop — safety net for all methods
        let elapsed = 0;
        const poll = setInterval(() => {
            elapsed += 300;

            // Method 1 result — best outcome
            if (destUrl && !done) {
                done = true;
                obs.disconnect();
                clearInterval(poll);
                toast('✅ Redirecting...', '#4caf50');
                fade(2500);
                window.location.href = destUrl;
                return;
            }

            zeroCountdown(); // Method 3

            const btn = findByText() || findBySelector(); // Method 4
            if (btn) { go(btn, 'poll'); return; }

            toast('⏳ Auto-Skip: Waiting... (' + Math.round(elapsed/1000) + 's)');

            if (elapsed >= 60000) {
                toast('❌ Timed out — tap manually', '#f44336');
                fade(6000);
                obs.disconnect();
                clearInterval(poll);
            }
        }, 300);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', domReady);
    } else {
        domReady();
    }

})();
