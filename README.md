# linkshortify-autoskip

> A ViolentMonkey userscript that automatically skips the LinkShortify (lksfy.com) countdown timer and clicks through to the destination link.

---

## What it does

When you open an `lksfy.com` link, it normally shows a countdown timer with ads before letting you proceed. This script:

- Waits for the countdown to finish
- Automatically clicks the "Get Link" / proceed button
- Redirects you to the destination without any manual interaction

**Result:** What used to take 15–20 minutes of clicking through ads now takes under 10 seconds.

---

## Requirements

- [Kiwi Browser](https://play.google.com/store/apps/details?id=com.kiwibrowser.browser) (Android) — required because Cloudflare fingerprinting blocks Firefox
- [ViolentMonkey](https://chromewebstore.google.com/detail/violentmonkey/jinjaccalgkegedbjckiignlkbdflefd) extension installed in Kiwi Browser
- [uBlock Origin](https://chromewebstore.google.com/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm) (optional but recommended to block ads)

---

## Installation

1. Open Kiwi Browser on Android
2. Make sure ViolentMonkey is installed
3. Tap the link for the version you want below — ViolentMonkey will prompt you to install it automatically

---

## Versions

Choose the version that suits you. All versions do the same core job.

| Version | File | Best for |
|---------|------|----------|
| **v1 - Minimal** | [v1-minimal.user.js](versions/v1-minimal.user.js) | Clean install, no extras |
| **v2 - Standard** | [v2-standard.user.js](versions/v2-standard.user.js) | Same as minimal + console logs for debugging |
| **v3 - Aggressive** | [v3-aggressive.user.js](versions/v3-aggressive.user.js) | Tries to force-skip the countdown immediately |
| **v4 - Smart** | [v4-smart.user.js](versions/v4-smart.user.js) | Shows on-screen status toast — best UX |

### Direct Install Links

- [Install v1 Minimal](https://raw.githubusercontent.com/nOneCode4u/linkshortify-autoskip/main/versions/v1-minimal.user.js)
- [Install v2 Standard](https://raw.githubusercontent.com/nOneCode4u/linkshortify-autoskip/main/versions/v2-standard.user.js)
- [Install v3 Aggressive](https://raw.githubusercontent.com/nOneCode4u/linkshortify-autoskip/main/versions/v3-aggressive.user.js)
- [Install v4 Smart](https://raw.githubusercontent.com/nOneCode4u/linkshortify-autoskip/main/versions/v4-smart.user.js)

---

## Auto-Update

All versions include `@updateURL` and `@downloadURL` headers pointing to this repo.  
In ViolentMonkey, tap the script → **Check for updates** — it will pull the latest version automatically.

---

## How it works (technical)

LinkShortify runs a JavaScript countdown timer. Once the timer reaches zero, a button becomes active. The script polls every 500ms for that button to become clickable (not disabled, not showing "Please wait"), then triggers a click programmatically.

v3 additionally hooks into `setTimeout`/`setInterval` to speed up the internal countdown clock itself.

---

## Disclaimer

This script is for personal use to save time on links you are legitimately accessing. It does not bypass paywalls or access restricted content.

---

## License

MIT — 
free to use, modify, and share.
