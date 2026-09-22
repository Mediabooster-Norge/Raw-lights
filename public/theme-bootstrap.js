try {
  var rawTheme = localStorage.getItem('raw-theme')
  document.documentElement.dataset.theme = rawTheme === 'light' ? 'light' : 'dark'
} catch (_) {
  document.documentElement.dataset.theme = 'dark'
}
