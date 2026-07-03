const statusEl = document.getElementById('status');
const toggleButton = document.getElementById('toggle');

const updateUI = (enabled) => {
  statusEl.textContent = enabled ? 'Enabled' : 'Disabled';
  statusEl.classList.toggle('disabled', !enabled);
  toggleButton.textContent = enabled ? '⏻' : '⏼';
  toggleButton.classList.toggle('on', enabled);
  toggleButton.classList.toggle('off', !enabled);
};

const setState = (enabled) => {
  chrome.storage.local.set({ enabled }, () => {
    updateUI(enabled);
  });
};

chrome.storage.local.get({ enabled: true }, (result) => {
  updateUI(Boolean(result.enabled));
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.enabled) {
    updateUI(Boolean(changes.enabled.newValue));
  }
});

toggleButton.addEventListener('click', () => {
  chrome.storage.local.get({ enabled: true }, (result) => {
    setState(!Boolean(result.enabled));
  });
});