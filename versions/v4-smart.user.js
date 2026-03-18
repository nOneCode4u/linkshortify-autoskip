// ==UserScript==
// @name         LinkShortify Auto-Skip
// @namespace    https://github.com/nOneCode4u/linkshortify-autoskip
// @version      1.0.0
// @description  Auto-skips LinkShortify with on-screen status notification
// @author       nOneCode4u
// @match        *://lksfy.com/*
// @match        *://*.lksfy.com/*
// @grant        none
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/nOneCode4u/linkshortify-autoskip/main/versions/v4-smart.user.js
// @downloadURL  https://raw.githubusercontent.com/nOneCode4u/linkshortify-autoskip/main/versions/v4-smart.user.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Toast notification UI ---
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #1a1a2e;
        color: #e0e0e0;
        padding: 10px 20px;
        border-radius: 20px;
        font-size: 13px;
        font-family: sans-serif;
        z-index: 999999;
        box-shadow: 0 4px 15px rgba(0,0,0,0.4);
        border: 1px solid #444;
        pointer-events: none;
        transition: opacity 0.3s;
    `;
    toast.textContent = '⏳ LS-Skip: Waiting for button...';
    document.body.appendChild(toast);

    const setToast = (msg, color = '#e0e0e0') => {
        toast.textContent = msg;
        toast.style.color = color;
    };

    const hideToast = (delay = 3000) => {
        setTimeout(() => { toast.style.opacity = '0'; }, delay);
    };

    // --- Button detection ---
    const SELECTORS = [
        'a.btn', '#btn-main', '.btn-main',
        'button[id*="go"]', 'a[id*="go"]',
        'input[type="submit"]', '.skip-btn',
        '#skip', 'button.btn', 'a[href*="go"]'
    ];

    const CHECK_INTERVAL = 500;
    const MAX_WAIT = 60000;
    let elapsed = 0;

    const timer = setInterval(() => {
        elapsed += CHECK_INTERVAL;

        for (const sel of SELECTORS) {
            const btn = document.querySelector(sel);
            if (btn) {
                const text = (btn.innerText || btn.value || '').toLowerCase();
                const isReady = !btn.disabled &&
                                !text.includes('wait') &&
                                !text.includes('please');

                if (isReady) {
                    setToast('✅ LS-Skip: Done! Redirecting...', '#4caf50');
                    hideToast(2000);
                    clearInterval(timer);
                    btn.click();
                    return;
                } else {
                    setToast(`⏳ LS-Skip: Waiting... (${Math.round(elapsed / 1000)}s)`);
                }
                break;
            }
        }

        if (elapsed >= MAX_WAIT) {
            setToast('❌ LS-Skip: Timed out. Click manually.', '#f44336');
            hideToast(5000);
            clearInterval(timer);
        }
    }, CHECK_INTERVAL);
})();
