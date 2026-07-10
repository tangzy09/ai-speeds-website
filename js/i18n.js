/* Lightweight i18n engine — locales/<lang>.json + t('dotted.key', {params}) */
(function () {
  'use strict';

  var SUPPORTED = ['en', 'zh-CN', 'ja', 'fr'];
  var FALLBACK = 'en';
  var NATIVE = { 'en': 'English', 'zh-CN': '中文', 'ja': '日本語', 'fr': 'Français' };
  var STORAGE_KEY = 'as_lang';

  // Prefix table derived from SUPPORTED (first come, first served)
  var PREFIX = {};
  SUPPORTED.forEach(function (l) {
    var p = l.split('-')[0];
    if (!(p in PREFIX)) PREFIX[p] = l;
  });

  var dict = {};
  var current = null;
  var listeners = [];

  function detect() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
    } catch (e) { /* storage unavailable */ }
    var langs = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < langs.length; i++) {
      var l = String(langs[i]);
      if (SUPPORTED.indexOf(l) !== -1) return l;
      var p = l.split('-')[0];
      if (p in PREFIX) return PREFIX[p];
    }
    return FALLBACK;
  }

  function t(path, params) {
    var node = dict;
    var parts = path.split('.');
    for (var i = 0; i < parts.length; i++) {
      if (node && typeof node === 'object' && parts[i] in node) node = node[parts[i]];
      else return path; // missing key: expose the key itself
    }
    if (typeof node !== 'string') return path;
    if (params) {
      node = node.replace(/\{(\w+)\}/g, function (m, k) {
        return k in params ? String(params[k]) : m;
      });
    }
    return node;
  }

  function setLang(lang, cb) {
    if (SUPPORTED.indexOf(lang) === -1) lang = FALLBACK;
    fetch('locales/' + lang + '.json')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        dict = d;
        current = lang;
        try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
        document.documentElement.lang = lang;
        listeners.forEach(function (fn) { fn(lang); });
        if (cb) cb(lang);
      });
  }

  function onChange(fn) { listeners.push(fn); }

  window.I18N = {
    SUPPORTED: SUPPORTED,
    FALLBACK: FALLBACK,
    NATIVE: NATIVE,
    detect: detect,
    setLang: setLang,
    t: t,
    onChange: onChange,
    get lang() { return current; }
  };
})();
