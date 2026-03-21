// ==UserScript==
// @name         LinkShortify Auto-Skip
// @namespace    https://github.com/nOneCode4u/linkshortify-autoskip
// @version      3.3.0
// @description  Automatically bypasses countdowns, timers and ads on LinkShortify (lksfy.com)
// @author       nOneCode4u
// @match        *://lksfy.com/*
// @match        *://*.lksfy.com/*
// @match        *://linkshortify.com/*
// @match        *://*.linkshortify.com/*
// @grant        none
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/nOneCode4u/linkshortify-autoskip/main/sites/linkshortify.user.js
// @downloadURL  https://raw.githubusercontent.com/nOneCode4u/linkshortify-autoskip/main/sites/linkshortify.user.js
// ==/UserScript==

(function () {
    'use strict';

    // ─────────────────────────────────────────────────────────
    // SITE CONFIG
    // To add a new site in future, add a new entry here.
    //   hosts     → hostname substrings to match
    //   proceed   → words on the proceed button (text detection)
    //   selectors → CSS selectors for the proceed button
    //   bottomBtn → multi-step button selector (optional)
    //   bottomTxt → texts that mean "proceed" on that button
    // ─────────────────────────────────────────────────────────
    const SITES = [
        {
            hosts:     ['lksfy.com', 'linkshortify.com'],
            selectors: [
                'a.get-link:not(.disabled)',
                '.get-link.btn-primary.btn',
                'a.get-link',
                '#bottomButton',
                'a.btn.btn-primary.btn-lg',
                'a.btn:not(.disabled)',
                'button.btn:not([disabled])'
            ],
            proceed:   ['get link', 'continue', 'proceed', 'click here',
                        'visit link', 'open', 'access link', 'next', 'get'],
            bottomBtn: '#bottomButton',
            bottomTxt: ['get link', 'continue', 'click to continue', 'next', 'visit']
        }
    ];

    // ─────────────────────────────────────────────────────────
    // INIT — match current page
    // ─────────────────────────────────────────────────────────
    const HOST = window.location.hostname;
    const cfg  = SITES.find(s => s.hosts.some(h => HOST.includes(h)));
    if (!cfg) return;

    const L    = (m) => console.log('[skip]', m);
    const SKIP = ['wait', 'please', 'loading', 'verif', 'second', 'generating'];

    // ─────────────────────────────────────────────────────────
    // METHOD 1 — NETWORK INTERCEPT
    // Hooks fetch() and XHR at document-start to capture the
    // destination URL directly from API responses.
    // Hardest to patch — requires full backend API redesign.
    // ─────────────────────────────────────────────────────────
    let destUrl = null;

    const isExternal = (url) =>
        url && url.startsWith('http') && !cfg.hosts.some(h => url.includes(h));

    const tryExtract = (body) => {
        try {
            const j = JSON.parse(body);
            const u = j?.url || j?.destination || j?.dest || j?.redirect
                   || j?.link || j?.target || j?.href || j?.data?.url
                   || j?.result?.url || j?.response?.url;
            if (isExternal(u)) { destUrl = u; L('Network: ' + u); }
        } catch (_) {}
    };

    const _fetch = window.fetch.bind(window);
    window.fetch = async (...a) => {
        const r = await _fetch(...a);
        r.clone().text().then(tryExtract);
        return r;
    };

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
    // METHOD 2 — STATE TRANSITION WATCHER
    // Detects elements changing disabled → enabled.
    // Purely behavioral — unaffected by ID/class renames.
    // WeakSet is pre-seeded on domReady with all currently
    // disabled elements so transitions are never missed.
    // ─────────────────────────────────────────────────────────
    const wasDisabled = new WeakSet();

    // ─────────────────────────────────────────────────────────
    // METHOD 3 — COUNTDOWN VARIABLE ZEROING
    // Zeroes common JS countdown variables on window object.
    // ─────────────────────────────────────────────────────────
    const zeroCountdown = () => {
        const keys = ['counter','count','countdown','timer','seconds',
                      'time','sec','remaining','timeLeft','timerCount'];
        keys.forEach(k => {
            if (typeof window[k] === 'number' && window[k] > 0) window[k] = 0;
        });
        // Also catch dynamically named countdown variables
        try {
            Object.keys(window).forEach(k => {
                if (typeof window[k] === 'number' && window[k] > 0 && window[k] < 120
                    && k.toLowerCase().match(/time|count|sec|tick|remain/)) {
                    window[k] = 0;
                }
            });
        } catch (_) {}
    };

    // ─────────────────────────────────────────────────────────
    // METHOD 4 — BUTTON DETECTION
    // isClickable: unified check used by all detection paths.
    // findBottomButton: handles lksfy's multi-step #bottomButton
    //   which changes text at each stage — checked by text match.
    //   Uses offsetParent (not just inline style) to detect all
    //   hiding methods including CSS classes and computed styles.
    // findBySelector: fast path using known CSS selectors.
    // findByText: resilient fallback using visible button text.
    // ─────────────────────────────────────────────────────────
    const isClickable = (el) => {
        if (!el) return false;
        if (el.disabled) return false;
        if (el.classList && el.classList.contains('disabled')) return false;
        if (el.offsetParent === null) return false;
        const t = (el.innerText || el.value || el.textContent || '').toLowerCase().trim();
        return !SKIP.some(w => t.includes(w));
    };

    const findBottomButton = () => {
        if (!cfg.bottomBtn) return null;
        const el = document.querySelector(cfg.bottomBtn);
        if (!el) return null;
        if (el.offsetParent === null) return null;  // hidden by any method
        if (el.disabled || (el.classList && el.classList.contains('disabled'))) return null;
        const text = (el.textContent || el.innerText || '').toLowerCase().trim();
        if (cfg.bottomTxt.some(w => text.includes(w))) return el;
        return null;
    };

    const findBySelector = () => {
        for (const sel of cfg.selectors) {
            const el = document.querySelector(sel);
            if (el && isClickable(el)) return el;
        }
        return null;
    };

    const findByText = () => {
        for (const el of document.querySelectorAll('a,button,input[type=submit],input[type=button]')) {
            if (!isClickable(el)) continue;
            const t = (el.innerText || el.value || el.textContent || '').toLowerCase();
            if (cfg.proceed.some(w => t.includes(w))) return el;
        }
        return null;
    };

    // ─────────────────────────────────────────────────────────
    // DOM READY — active phase begins
    // ─────────────────────────────────────────────────────────
    const domReady = () => {

        // BUG FIX: Pre-seed wasDisabled with all currently disabled
        // interactive elements so transition detection works immediately.
        document.querySelectorAll('a,button,input[type=submit],input[type=button]')
            .forEach(el => { if (!isClickable(el)) wasDisabled.add(el); });

        // Toast UI
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

        // Click handler
        let done = false;
        const go = (el, why) => {
            if (done) return;
            done = true;
            L('Click: ' + why);
            toast('✅ Redirecting...', '#4caf50');
            fade(2500);
            obs.disconnect();
            clearInterval(poll);
            el.removeAttribute('disabled');
            el.classList && el.classList.remove('disabled');
            el.click();
        };

        // MutationObserver — reacts to any DOM change instantly
        const obs = new MutationObserver((mutations) => {
            for (const m of mutations) {
                // Method 2 — state transition
                if (m.type === 'attributes' && m.target) {
                    const el = m.target;
                    if (wasDisabled.has(el) && isClickable(el)) { go(el, 'transition'); return; }
                    if (!isClickable(el)) wasDisabled.add(el);
                }
                // Newly added elements
                for (const n of m.addedNodes) {
                    if (n.nodeType === 1 && isClickable(n)) {
                        const txt = (n.innerText||'').toLowerCase();
                        if (cfg.proceed.some(w => txt.includes(w))) { go(n, 'added-node'); return; }
                    }
                }
            }
            const btn = findBottomButton() || findBySelector() || findByText();
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

            // Method 1 — best case: redirect directly from intercepted URL
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

            const btn = findBottomButton() || findBySelector() || findByText(); // Method 4
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
