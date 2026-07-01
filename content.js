(() => {
  const adPattern = /(^|[-_\s])(ad|ads|adslot|advert|advertisement|sponsor|promo|banner|gpt|gslot)([-_\s]|$)/i;
  const providerPattern = /google_ads|doubleclick|googlesyndication|googads|pubmatic|criteo|amazon-ads|adservice|admanager|adsbygoogle/i;

  const hideElement = (el) => {
    if (!(el instanceof Element)) return;

    let text = '';
    try {
      text = `${el.id || ''} ${el.className || ''} ${el.getAttribute('role') || ''} ${el.getAttribute('aria-label') || ''} ${el.getAttribute('alt') || ''} ${el.getAttribute('src') || ''}`.toLowerCase();
    } catch (e) {
      text = '';
    }

    const matchesAdText = adPattern.test(text) || providerPattern.test(text);
    const matchesAdSelectors = el.matches(
      'iframe[src*="doubleclick"], iframe[src*="googleads"], iframe[src*="googlesyndication"], iframe[src*="adsbygoogle"], iframe[src*="adservice"], iframe[src*="admanager"], [data-ad-slot], [data-google-query-id], [aria-label*="Advertisement" i], [alt*="Advertisement" i], [class*="adsbygoogle"], [class*="sponsor"], [class*="promo"], [class*="banner"], [class*="ad-"], [class*="-ad"], [id*="ad-"]'
    );

    if (!matchesAdText && !matchesAdSelectors) {
      return;
    }
  
   const wrapper = el.closest(
    '[class*="ad"], [id*="ad"], [class*="sponsor"], [class*="promo"], [class*="banner"], .am-entry, [id^="vxxh"], [id^="iframeVideoWrapper"]'
) || el;

  wrapper.style.setProperty('display', 'none', 'important');
  wrapper.style.setProperty('visibility', 'hidden', 'important');
  wrapper.style.setProperty('opacity', '0', 'important');
  wrapper.style.setProperty('height', '0', 'important');
  wrapper.style.setProperty('width', '0', 'important');
  wrapper.style.setProperty('overflow', 'hidden', 'important');
  wrapper.style.setProperty('margin', '0', 'important');
  wrapper.style.setProperty('padding', '0', 'important');
  wrapper.style.setProperty('border', '0', 'important');
  };

  const scanRoot = (root) => {
    if (!(root instanceof Element || root instanceof Document)) return;
    root.querySelectorAll('iframe,div,section,aside,article,span,a,li').forEach(hideElement);
  };

  const observer = new MutationObserver((mutations) => {
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
})();
