// ==UserScript==
// @name         Power Erecters — Auto Bypass
// @namespace    https://powererecter.vercel.app
// @version      1.0.0
// @description  Bypass automatique des liens Linkvertise
// @author       Power Erecters
// @match        https://linkvertise.com/*
// @match        https://*.linkvertise.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      api.bypass.tools
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const API_KEY = 'bt_006463d6b4b510ea072332e4797b58e079160ce262e9f9f8';
  const currentUrl = window.location.href;

  // Évite de tourner en boucle si on a déjà bypassé
  if (sessionStorage.getItem('pe_bypassed') === currentUrl) return;

  GM_xmlhttpRequest({
    method: 'POST',
    url: 'https://api.bypass.tools/api/v1/bypass/direct',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0.0.0'
    },
    data: JSON.stringify({ url: currentUrl, refresh: false }),
    onload: function (response) {
      try {
        const data = JSON.parse(response.responseText);
        if (data.status === 'success' && data.result && data.result !== 'failed') {
          sessionStorage.setItem('pe_bypassed', currentUrl);
          window.location.replace(data.result);
        }
      } catch (e) {}
    }
  });
})();
