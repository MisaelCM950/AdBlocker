# Ad Blocker

Small Chrome extension that hides visual ad elements on sites without using network blocking.

## Quick links
- Download release: https://github.com/MisaelCM950/AdBlocker/releases/tag/v1.0
- Report issues: https://github.com/MisaelCM950/AdBlocker/issues

## Install (unpacked)
1. Download the ZIP or clone this repo and extract it so the folder contains `manifest.json`.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** (top-right).
4. Click **Load unpacked** and select the extension folder (the folder containing `manifest.json`).
5. The extension icon will appear in the toolbar.

## Usage
- Click the toolbar icon to open the popup.
- The large power button toggles ad-hiding on the current site.
- Status text shows `Enabled` / `Disabled`.
- Pin the extension (optional): click the puzzle icon → pin the Ad Blocker.

## Update (unpacked users)
- Replace the folder contents with the new release, then open `chrome://extensions` and click **Reload** for the Ad Blocker entry.
- Alternatively, enable Developer mode → click **Update** to refresh all unpacked extensions.

## Troubleshooting
- If Load unpacked fails, ensure you selected the folder that directly contains `manifest.json`.
- If toggling changes the stored state but the page doesn't update, refresh the page.
- Open DevTools → Console on the page to see content script errors.
- If Chrome refuses to load unpacked extensions, the device might be enterprise-managed.

## Permissions & Privacy
- Uses `storage` to save the on/off toggle.
- Content script only modifies page DOM to hide elements; it does not send page content to external servers.

## Download options
- Download the extension ZIP from GitHub Releases: https://github.com/MisaelCM950/AdBlocker/releases/tag/v1.0
- After downloading, install it using the unpacked extension steps above.

## Contributing
- PRs welcome. Please open issues for bugs and feature requests.

## License
No license specified. All rights reserved.

## Contact
Built by Misael C — https://sci-fi.site/