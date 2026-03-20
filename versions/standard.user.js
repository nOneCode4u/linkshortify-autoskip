// ==UserScript==
// @name         LinkShortify Auto-Skip
// @namespace    https://github.com/nOneCode4u/linkshortify-autoskip
// @version      3.1.0
// @description  Automatically skips LinkShortify timer — with console debug logs
// @author       nOneCode4u
// @match        *://lksfy.com/*
// @match        *://*.lksfy.com/*
// @match        *://linkshortify.com/*
// @match        *://*.linkshortify.com/*
// @grant        none
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/nOneCode4u/linkshortify-autoskip/main/versions/standard.user.js
// @downloadURL  https://raw.githubusercontent.com/nOneCode4u/linkshortify-autoskip/main/versions/standard.user.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('[LS-Skip] Loaded v3.1.0 (standard)');

    const CHECK_INTERVAL = 500;
    const MAX_WAIT = 60000;
    let elapsed = 0;

    const timer = setInterval(() => {
        elapsed += CHECK_INTERVAL;

        const btn = document.querySelector('a.btn, button[id*="go"], a[id*="go"], #btn-main, .btn-main, input[type="submit"]');

        if (btn) {
            const text = (btn.innerText || btn.value || '').toLowerCase();
            const isReady = !btn.disabled &&
                            !text.includes('wait') &&
                            !text.includes('please');

            if (isReady) {
                console.log('[LS-Skip] Button ready, clicking:', text);
                clearInterval(timer);
                btn.click();
                return;
            } else {
                console.log('[LS-Skip] Button found but not ready:', text);
            }
        } else {
            console.log('[LS-Skip] Waiting... elapsed:', elapsed + 'ms');
        }

        if (elapsed >= MAX_WAIT) {
            console.log('[LS-Skip] Timed out after 60s');
            clearInterval(timer);
        }
    }, CHECK_INTERVAL);
})();
