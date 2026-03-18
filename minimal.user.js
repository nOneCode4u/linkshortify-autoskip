// ==UserScript==
// @name         LinkShortify Auto-Skip
// @namespace    https://github.com/nOneCode4u/linkshortify-autoskip
// @version      1.0.0
// @description  Automatically skips LinkShortify timer and clicks through to destination
// @author       nOneCode4u
// @match        *://lksfy.com/*
// @match        *://*.lksfy.com/*
// @grant        none
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/nOneCode4u/linkshortify-autoskip/main/versions/minimal.user.js
// @downloadURL  https://raw.githubusercontent.com/nOneCode4u/linkshortify-autoskip/main/versions/minimal.user.js
// ==/UserScript==

(function () {
    'use strict';

    const CHECK_INTERVAL = 500;
    const MAX_WAIT = 60000;
    let elapsed = 0;

    const timer = setInterval(() => {
        elapsed += CHECK_INTERVAL;

        const btn = document.querySelector('a.btn, button[id*="go"], a[id*="go"], #btn-main, .btn-main, input[type="submit"]');

        if (btn) {
            const text = btn.innerText || btn.value || '';
            const isReady = !btn.disabled &&
                            !text.toLowerCase().includes('wait') &&
                            !text.toLowerCase().includes('please');
            if (isReady) {
                clearInterval(timer);
                btn.click();
            }
        }

        if (elapsed >= MAX_WAIT) clearInterval(timer);
    }, CHECK_INTERVAL);
})();
