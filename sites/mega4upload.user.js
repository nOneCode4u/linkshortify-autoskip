// ==UserScript==
// @name         Mega4Upload Auto-Skip
// @namespace    https://github.com/nOneCode4u/bypass-autoskip
// @version      1.0.0
// @description  Auto-clicks Free Download and waits for reCAPTCHA, then auto-clicks download on mega4upload.net
// @author       nOneCode4u
// @match        *://mega4upload.net/*
// @match        *://*.mega4upload.net/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/nOneCode4u/bypass-autoskip/main/sites/mega4upload.user.js
// @downloadURL  https://raw.githubusercontent.com/nOneCode4u/bypass-autoskip/main/sites/mega4upload.user.js
// ==/UserScript==

(function () {
    'use strict';

    const L = (m) => console.log('[m4u-skip]', m);

    // ─────────────────────────────────────────────────────────
    // AUTO-REDIRECT TOGGLE
    // Shared storage key with linkshortify script so one toggle
    // controls both. Change key to 'autoRedirect_m4u' if you
    // want independent control per site.
    // ─────────────────────────────────────────────────────────
    let autoRedirect = GM_getValue('autoRedirect', true);
    let menuId;

    const updateMenu = () => {
        if (menuId !== undefined) {
            try { GM_unregisterMenuCommand(menuId); } catch (_) {}
        }
        menuId = GM_registerMenuCommand(
            autoRedirect
                ? '🟢 Auto-Redirect: ON  —  click to disable'
                : '🔴 Auto-Redirect: OFF  —  click to enable',
            () => {
                autoRedirect = !autoRedirect;
                GM_setValue('autoRedirect', autoRedirect);
                updateMenu();
            }
        );
    };

    updateMenu();

    // ─────────────────────────────────────────────────────────
    // TOAST UI
    // ─────────────────────────────────────────────────────────
    const wrap = document.createElement('div');
    wrap.style.cssText = `
        position:fixed;bottom:20px;left:50%;transform:translateX(-50%);
        background:#1a1a2e;color:#e0e0e0;padding:10px 22px;
        border-radius:22px;font-size:13px;font-family:sans-serif;
        z-index:999999;box-shadow:0 4px 18px rgba(0,0,0,.5);
        border:1px solid #333;pointer-events:none;
        transition:opacity .4s;white-space:nowrap;
        display:flex;align-items:center;gap:10px;
    `;
    const msg = document.createElement('span');
    msg.textContent = '⏳ Auto-Skip: Starting...';
    wrap.appendChild(msg);

    const proceedBtn = document.createElement('button');
    proceedBtn.textContent = 'Download →';
    proceedBtn.style.cssText = `
        display:none;background:#4caf50;color:#fff;border:none;
        padding:5px 14px;border-radius:14px;font-size:13px;
        cursor:pointer;pointer-events:all;font-family:sans-serif;font-weight:600;
    `;
    wrap.appendChild(proceedBtn);
    document.body.appendChild(wrap);

    const toast   = (m, c) => { msg.textContent = m; if (c) msg.style.color = c; };
    const fade    = (ms=3000) => setTimeout(() => { wrap.style.opacity='0'; }, ms);
    const showBtn = (action) => {
        wrap.style.pointerEvents = 'none';
        proceedBtn.style.display = 'inline-block';
        proceedBtn.style.pointerEvents = 'all';
        proceedBtn.onclick = () => { wrap.style.opacity='0'; action(); };
    };

    const proceed = (action, readyMsg) => {
        if (autoRedirect) {
            toast('✅ Done!', '#4caf50');
            fade(2500);
            action();
        } else {
            toast(readyMsg, '#4caf50');
            showBtn(action);
        }
    };

    // ─────────────────────────────────────────────────────────
    // STEP 1 — Auto-click "Free Download" button
    // This appears immediately on page load.
    // ─────────────────────────────────────────────────────────
    const step1 = () => {
        const btn = document.querySelector('input[value="Free Download"]')
                 || document.querySelector('input[name="method_free"]')
                 || document.querySelector('.free_btn');
        if (btn) {
            L('Step 1: clicking Free Download');
            toast('🖱️ Clicking Free Download...');
            btn.click();
            return true;
        }
        return false;
    };

    // ─────────────────────────────────────────────────────────
    // STEP 2 — reCAPTCHA check
    // Cannot be bypassed — user must solve it.
    // Script polls until grecaptcha.getResponse() is non-empty.
    // ─────────────────────────────────────────────────────────
    const isRecaptchaSolved = () => {
        try {
            return window.grecaptcha && window.grecaptcha.getResponse().length > 0;
        } catch (_) {
            return false;
        }
    };

    // ─────────────────────────────────────────────────────────
    // STEP 3 — Auto-click download button after captcha solved
    // ─────────────────────────────────────────────────────────
    const step3 = () => {
        const btn = document.querySelector('button#downloadbtn')
                 || document.querySelector('#downloadbtn')
                 || document.querySelector('button[id*="download"]');
        if (btn && !btn.disabled) {
            L('Step 3: clicking download button');
            proceed(() => btn.click(), '✅ Ready — tap to download');
            return true;
        }
        return false;
    };

    // ─────────────────────────────────────────────────────────
    // MAIN LOOP
    // State machine: step1 → wait for captcha → step3
    // ─────────────────────────────────────────────────────────
    let state    = 'step1'; // 'step1' | 'captcha' | 'step3' | 'done'
    let elapsed  = 0;
    const MAX    = 120000; // 2 min max (captcha needs time)

    const poll = setInterval(() => {
        elapsed += 500;

        if (state === 'step1') {
            if (step1()) {
                state = 'captcha';
                toast('🔒 Solve the CAPTCHA to continue...', '#f0a500');
            }
        }

        else if (state === 'captcha') {
            if (isRecaptchaSolved()) {
                L('reCAPTCHA solved');
                state = 'step3';
            } else {
                toast('🔒 Waiting for CAPTCHA... (' + Math.round(elapsed/1000) + 's)');
            }
        }

        else if (state === 'step3') {
            if (step3()) {
                state = 'done';
                clearInterval(poll);
            }
        }

        if (elapsed >= MAX) {
            toast('❌ Timed out — proceed manually', '#f44336');
            fade(6000);
            clearInterval(poll);
        }
    }, 500);

})();
