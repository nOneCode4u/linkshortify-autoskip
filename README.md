# bypass-autoskip

> Userscripts that automatically bypass countdowns, ads, and timers on supported sites.

---

## What it does

- ⏩ Automatically clicks through countdown timers
- 🔒 Waits for CAPTCHA when required (cannot bypass — human input needed)
- 🔕 Shows a small on-screen status badge
- 🔄 Auto-updates via your userscript manager

---

## Requirements

### Step 1 — Install a userscript manager for your browser

**Desktop**

| Browser | Supported Managers |
|---------|-------------------|
| Chrome | [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) |
| Firefox | [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/), [Violentmonkey](https://addons.mozilla.org/firefox/addon/violentmonkey/), [Greasemonkey](https://addons.mozilla.org/firefox/addon/greasemonkey/) |
| Safari | [Tampermonkey](https://apps.apple.com/app/tampermonkey/id1482490089), [Userscripts](https://apps.apple.com/app/userscripts/id1463298887) |
| Edge | [Tampermonkey](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd), [Violentmonkey](https://microsoftedge.microsoft.com/addons/detail/violentmonkey/eeagobfjdenkkddmbclomhiblgggliao) |
| Opera | [Tampermonkey](https://addons.opera.com/extensions/details/tampermonkey-beta/), [Violentmonkey](https://violentmonkey.github.io/get-it/) |
| Brave | [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo), [Violentmonkey](https://violentmonkey.github.io/get-it/) |
| Vivaldi | [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo), [Violentmonkey](https://violentmonkey.github.io/get-it/) |
| Maxthon | [Violentmonkey](https://violentmonkey.github.io/get-it/) |

> ⚠️ **Note:** Violentmonkey is no longer supported on Chrome (Manifest V2 issue). Use Tampermonkey on Chrome instead.

**Android**

| Browser | Supported Managers |
|---------|-------------------|
| Firefox | [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/), [Violentmonkey](https://addons.mozilla.org/firefox/addon/violentmonkey/), [Greasemonkey](https://addons.mozilla.org/firefox/addon/greasemonkey/) |
| Kiwi | [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo), [Violentmonkey](https://violentmonkey.github.io/get-it/) |
| Edge | [Tampermonkey](https://www.tampermonkey.net/) |
| Dolphin | [Tampermonkey](https://www.tampermonkey.net/) |
| UC Browser | [Tampermonkey](https://www.tampermonkey.net/) |
| Maxthon | [Violentmonkey](https://violentmonkey.github.io/get-it/) |
| XBrowser | Built-in support |

**iOS**

| Browser | Supported Managers |
|---------|-------------------|
| Safari | [Tampermonkey](https://apps.apple.com/app/tampermonkey/id6738342400), [Userscripts](https://apps.apple.com/app/userscripts/id1463298887) |

### Step 2 — Install uBlock Origin *(recommended)*

Blocks ads on shortener pages.
- [Firefox](https://addons.mozilla.org/firefox/addon/ublock-origin/)
- [Chrome / Kiwi / Brave / Edge / Opera](https://chromewebstore.google.com/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm)

---

## Install Scripts

Tap a link — your userscript manager will prompt you automatically.

| Site | Script | Notes |
|------|--------|-------|
| lksfy.com / linkshortify.com | [Install](https://raw.githubusercontent.com/nOneCode4u/bypass-autoskip/main/sites/linkshortify.user.js) | Fully automatic |
| mega4upload.net | [Install](https://raw.githubusercontent.com/nOneCode4u/bypass-autoskip/main/sites/mega4upload.user.js) | Auto-clicks steps 1 & 3. You must solve the CAPTCHA manually |

---

## Auto-Update

All scripts auto-update via your userscript manager.

To manually check:
1. Open your userscript manager → click/tap the script
2. Click **Check for updates**

---

## Supported Sites

| Site | Status | Notes |
|------|--------|-------|
| lksfy.com | ✅ Working | Fully automatic |
| linkshortify.com | ✅ Working | Fully automatic |
| mega4upload.net | ✅ Working | CAPTCHA required (human) |

---

## Similar Projects

These support a much larger number of sites:

- [Bypass All Shortlinks Debloated](https://github.com/gongchandang49/bypass-all-shortlinks-debloated) *(updated fork)*
- [Bypass All Shortlinks (GreasyFork)](https://greasyfork.org/en/scripts/431691-bypass-all-shortlinks)
- [AdsBypasser](https://github.com/adsbypasser/adsbypasser)
- [bypass.city](https://bypass.city/)

---

## Disclaimer

For personal use only on links you are legitimately accessing.

---

## License

MIT
