(() => {
  const HIDDEN_CLASS = 'adblocker-hidden';
  const adSelector = [
    'iframe[src*="doubleclick"]',
    'iframe[src*="googleads"]',
    'iframe[src*="googlesyndication"]',
    'iframe[src*="adsbygoogle"]',
    'iframe[src*="adservice"]',
    'iframe[src*="admanager"]',
    'iframe[id^="iframeVideoWrapper"]',
    'div.am-entry',
    'div[id^="vxxh"]',
    '[data-ad-slot]',
    '[data-google-query-id]',
    '[aria-label*="Advertisement" i]',
    '[alt*="Advertisement" i]',
    '[class*="ad-container"]',
    '[class*="ad-slot"]',
    '[class*="ad-wrapper"]',
    '[class*="adsbygoogle"]',
    '[class*="sponsor"]',
    '[class*="promo"]',
    '[class*="banner"]',
    '[class*="ad-"]',
    '[class*="-ad"]',
    '[id*="ad-"]',
    '[id*="-ad"]'
  ].join(', ');

  let observer = null;

  const hideElement = (el) => {
    if (!(el instanceof Element)) return;

    let text = '';
    try {
      text = `${el.id || ''} ${el.className || ''} ${el.getAttribute('role') || ''} ${el.getAttribute('aria-label') || ''} ${el.getAttribute('alt') || ''} ${el.getAttribute('src') || ''}`.toLowerCase();
    } catch (e) {
      text = '';
    }

    const adPattern = /(^|[-_\s])(ad|ads|adslot|advert|advertisement|sponsor|promo|banner|gpt|gslot)([-_\s]|$)/i;
    const providerPattern = /google_ads|doubleclick|googlesyndication|googads|pubmatic|criteo|amazon-ads|adservice|admanager|adsbygoogle/i;
    const matchesAdText = adPattern.test(text) || providerPattern.test(text);
    const matchesAdSelectors = el.matches(adSelector);

    if (!matchesAdText && !matchesAdSelectors) return;

    const target = el.closest(adSelector) || el;
    target.classList.add(HIDDEN_CLASS);
  };

  const scanRoot = (root) => {
    if (!(root instanceof Element || root instanceof Document)) return;
    root.querySelectorAll('iframe,div,section,aside,article,span,a,li').forEach(hideElement);
  };

  const clearHidden = () => {
    document.querySelectorAll(`.${HIDDEN_CLASS}`).forEach((node) => node.classList.remove(HIDDEN_CLASS));
  };

  function startBlocking() {
    if (observer) return;

    observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof Element)) continue;
          hideElement(node);
          scanRoot(node);
        }
      }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
    scanRoot(document);
  }

  function stopBlocking() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    clearHidden();
  }

  function setEnabled(enabled) {
    document.documentElement.classList.toggle('adblocker-enabled', enabled);

    if (enabled) {
      startBlocking();
    } else {
      stopBlocking();
    }
  }

  chrome.storage.local.get({ enabled: true }, ({ enabled }) => {
    setEnabled(Boolean(enabled));
  });

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.enabled) {
      setEnabled(Boolean(changes.enabled.newValue));
    }
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'SET_ENABLED') {
    setEnabled(Boolean(message.enabled));
    sendResponse({ ok: true });
  }
});
})();