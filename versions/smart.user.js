// ==UserScript==
// @name         LinkShortify Auto-Skip
// @namespace    https://github.com/nOneCode4u/linkshortify-autoskip
// @version      2.3.0
// @description  Automatically skips LinkShortify (lksfy.com) countdown and proceeds to destination
// @author       nOneCode4u
// @match        *://lksfy.com/*
// @match        *://*.lksfy.com/*
// @match        *://linkshortify.com/*
// @match        *://*.linkshortify.com/*
// @grant        none
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/nOneCode4u/linkshortify-autoskip/main/versions/smart.user.js
// @downloadURL  https://raw.githubusercontent.com/nOneCode4u/linkshortify-autoskip/main/versions/smart.user.js
// ==/UserScript==

(function () {
    'use strict';

    const log = (msg) => console.log('[LS-Skip]', msg);
    log('Script loaded v2.3.0');

    // ── Fetch intercept — catches destination URL from API response ──
    let interceptedUrl = null;

    const _realFetch = window.fetch.bind(window);
    window.fetch = async function (...args) {
        const res = await _realFetch(...args);
        res.clone().text().then(body => {
            try {
                const json = JSON.parse(body);
                const url  = json?.url || json?.destination || json?.redirect || json?.link;
                if (url && url.startsWith('http') && !url.includes('lksfy') && !url.includes('linkshortify')) {
                    interceptedUrl = url;
                    log('Fetch intercepted: ' + url);
                }
            } catch(_) {}
        });
        return res;
    };

    // ── XHR intercept ──
    const _realXHROpen = XMLHttpRequest.prototype.open;
    const _realXHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._url = url;
        return _realXHROpen.apply(this, [method, url, ...rest]);
    };
    XMLHttpRequest.prototype.send = function(...args) {
        this.addEventListener('load', function() {
            try {
                const json = JSON.parse(this.responseText);
                const url  = json?.url || json?.destination || json?.redirect || json?.link;
                if (url && url.startsWith('http') && !url.includes('lksfy') && !url.includes('linkshortify')) {
                    interceptedUrl = url;
                    log('XHR intercepted: ' + url);
                }
            } catch(_) {}
        });
        return _realXHRSend.apply(this, args);
    };

    // ── Force window countdown variables to zero ──
    const forceCountdownZero = () => {
        ['counter','count','countdown','timer','seconds','time','sec','remaining'].forEach(key => {
            if (typeof window[key] === 'number' && window[key] > 0) {
                window[key] = 0;
                log('Zeroed window.' + key);
            }
        });
    };

    // ── Toast UI ──
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; bottom: 20px; left: 50%;
        transform: translateX(-50%);
        background: #1a1a2e; color: #e0e0e0;
        padding: 10px 22px; border-radius: 22px;
        font-size: 13px; font-family: sans-serif;
        z-index: 999999; box-shadow: 0 4px 18px rgba(0,0,0,0.5);
        border: 1px solid #333; pointer-events: none;
        transition: opacity 0.4s; white-space: nowrap;
    `;
    toast.textContent = '⏳ Auto-Skip: Starting...';
    document.body.appendChild(toast);

    const setToast  = (msg, color) => { toast.textContent = msg; if (color) toast.style.color = color; };
    const fadeToast = (ms = 3000)  => { setTimeout(() => { toast.style.opacity = '0'; }, ms); };

    // ── Button detection by visible text ──
    const PROCEED_WORDS = ['get link','continue','proceed','go','click here','visit','open','next'];
    const SKIP_WORDS    = ['wait','please','loading','verif'];

    const findReadyButton = () => {
        for (const el of document.querySelectorAll('a, button, input[type="submit"], input[type="button"]')) {
            if (el.disabled || el.offsetParent === null) continue;
            const text = (el.innerText || el.value || el.textContent || '').toLowerCase().trim();
            if (!text) continue;
            if (SKIP_WORDS.some(w => text.includes(w))) continue;
            if (PROCEED_WORDS.some(w => text.includes(w))) return el;
        }
        return null;
    };

    // ── CSS selector fallback ──
    const findBySelector = () => {
        for (const sel of ['#btn-main','.btn-main','a.btn','button[id*="go"]','a[id*="go"]','.skip-btn','#skip','button.btn','a[href*="go"]','.get-link','#get-link']) {
            const el = document.querySelector(sel);
            if (el && !el.disabled && !SKIP_WORDS.some(w => (el.innerText||'').toLowerCase().includes(w))) return el;
        }
        return null;
    };

    // ── Click handler ──
    let clicked = false;
    const doClick = (el, reason) => {
        if (clicked) return;
        clicked = true;
        log('Clicking via: ' + reason);
        setToast('✅ Done! Redirecting...', '#4caf50');
        fadeToast(2500);
        observer.disconnect();
        clearInterval(pollTimer);
        el.removeAttribute('disabled');
        el.click();
    };

    // ── MutationObserver ──
    const observer = new MutationObserver(() => {
        const btn = findReadyButton() || findBySelector();
        if (btn) doClick(btn, 'MutationObserver');
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    // ── Main poll loop ──
    const MAX_WAIT = 60000;
    let elapsed = 0;

    const pollTimer = setInterval(() => {
        elapsed += 300;

        if (interceptedUrl && !clicked) {
            clicked = true;
            observer.disconnect();
            clearInterval(pollTimer);
            setToast('✅ Done! Redirecting...', '#4caf50');
            fadeToast(2500);
            window.location.href = interceptedUrl;
            return;
        }

        forceCountdownZero();
        const btn = findReadyButton() || findBySelector();
        if (btn) { doClick(btn, 'poll'); return; }

        setToast('⏳ Auto-Skip: Waiting... (' + Math.round(elapsed / 1000) + 's)');

        if (elapsed >= MAX_WAIT) {
            setToast('❌ Timed out — tap manually', '#f44336');
            fadeToast(6000);
            observer.disconnect();
            clearInterval(pollTimer);
        }
    }, 300);

})();
