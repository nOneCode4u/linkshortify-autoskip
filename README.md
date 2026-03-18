# linkshortify-autoskip

> A lightweight userscript that automatically bypasses countdowns and ads on **LinkShortify (lksfy.com)**.

---

## What it does

- ⏩ Automatically clicks through the countdown timer
- 🔕 Shows a small on-screen status badge
- 🔄 Auto-updates via your userscript manager

---

## Requirements

### Step 1 — Install a userscript manager for your browser

**Desktop**

| Browser | Supported Managers |
|---------|-------------------|
| Chrome | [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) |
| Firefox | [Greasemonkey](https://addons.mozilla.org/firefox/addon/greasemonkey/), [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/), [Violentmonkey](https://addons.mozilla.org/firefox/addon/violentmonkey/) |
| Safari | [Tampermonkey](https://apps.apple.com/app/tampermonkey/id1482490089), [Userscripts](https://apps.apple.com/app/userscripts/id1463298887) |
| Edge | [Tampermonkey](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd) |
| Opera | [Tampermonkey](https://addons.opera.com/extensions/details/tampermonkey-beta/), [Violentmonkey](https://violentmonkey.github.io/get-it/) |
| Maxthon | [Violentmonkey](https://violentmonkey.github.io/get-it/) |

**Android**

| Browser | Supported Managers |
|---------|-------------------|
| Firefox | [Greasemonkey](https://addons.mozilla.org/firefox/addon/greasemonkey/), [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/), [Violentmonkey](https://addons.mozilla.org/firefox/addon/violentmonkey/) |
| Kiwi | [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo), [Violentmonkey](https://chromewebstore.google.com/detail/violentmonkey/jinjaccalgkegedbjckiignlkbdflefd) |
| Edge | [Tampermonkey](https://www.tampermonkey.net/) |
| Maxthon | [Violentmonkey](https://violentmonkey.github.io/get-it/) |
| Dolphin | [Tampermonkey](https://www.tampermonkey.net/) |

**iOS**

| Browser | Supported Managers |
|---------|-------------------|
| Safari | [Tampermonkey](https://apps.apple.com/app/tampermonkey/id1482490089), [Userscripts](https://apps.apple.com/app/userscripts/id1463298887) |

### Step 2 — Install uBlock Origin *(recommended)*

Blocks ads on the shortener page. Available for [Firefox](https://addons.mozilla.org/firefox/addon/ublock-origin/) and [Chrome/Kiwi](https://chromewebstore.google.com/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm).

---

## Install Script

Tap your preferred version — your userscript manager will prompt you automatically.

| Version | Description | Install |
|---------|-------------|---------|
| **Smart** ✅ *recommended* | On-screen status badge, most reliable | [Install](https://raw.githubusercontent.com/nOneCode4u/linkshortify-autoskip/main/versions/smart.user.js) |
| Aggressive | Attempts instant skip | [Install](https://raw.githubusercontent.com/nOneCode4u/linkshortify-autoskip/main/versions/aggressive.user.js) |
| Standard | With console debug logs | [Install](https://raw.githubusercontent.com/nOneCode4u/linkshortify-autoskip/main/versions/standard.user.js) |
| Minimal | Silent, no extras | [Install](https://raw.githubusercontent.com/nOneCode4u/linkshortify-autoskip/main/versions/minimal.user.js) |

---

## Auto-Update

All versions auto-update via your userscript manager.

To manually check:
1. Open your userscript manager → tap/click the script
2. Tap **Check for updates**

---

## Supported Sites

| Site | Status |
|------|--------|
| lksfy.com | ✅ Working |
| linkshortify.com | ✅ Working |

---

## Disclaimer

For personal use only on links you are legitimately accessing.

---

## License

MIT
