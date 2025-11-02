// ==UserScript==
// @name         Bypass Menu with Linkvertise Bypass
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Bouton "bypass" en haut-droite avec un menu stylé de redirections (copie l'URL et redirige vers la cible choisie). Inclut un contournement automatique pour les liens Linkvertise.
// @author       FireMasterK & Anonymous
// @match        *://*/*
// @match        *://*.linkvertise.com/*
// @match        *://*.linkvertise.net/*
// @match        *://*.linkvertise.download/*
// @match        *://*.link-to.net/*
// @match        *://*.file-link.net/*
// @match        *://*.direct-link.net/*
// @match        *://*.up-to-down.net/*
// @grant        GM.xmlHttpRequest
// @updateURL    https://raw.githubusercontent.com/FireMasterK/BypassAdditions/master/script.user.js
// ==/UserScript==

(function () {
  'use strict';

  // --- Logique du contournement Linkvertise (premier script) ---
  const fake_user_agent = "Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1";

  function bypassLinkvertise() {
    // Vérifier si l'URL actuelle correspond à un domaine Linkvertise
    const linkvertiseDomains = [
      'linkvertise.com',
      'linkvertise.net',
      'linkvertise.download',
      'link-to.net',
      'file-link.net',
      'direct-link.net',
      'up-to-down.net'
    ];
    if (!linkvertiseDomains.some(domain => window.location.hostname.includes(domain))) {
      return; // Ne rien faire si ce n'est pas un domaine Linkvertise
    }

    let search_params = new URLSearchParams(window.location.search);

    if (search_params.get("r") !== null) {
      window.location = atob(decodeURIComponent(search_params.get("r")));
      return;
    }

    // Vérification iframe
    if (window.parent.location != window.location) {
      return;
    }

    // Vérifier si la page est une page de téléchargement
    let re_download = /^\/download(\/[0-9]+\/[^\/]+)\//;
    let is_download = re_download.exec(window.location.pathname);

    if (is_download !== null) {
      window.location.pathname = is_download[1];
      return;
    }

    let re_regular = /^(\/[0-9]+\/[^\/]+)/;
    let is_regular = re_regular.exec(window.location.pathname);
    if (is_regular === null) {
      return; // Type d'URL inconnu
    }

    let paths = [
      "/captcha",
      "/countdown_impression?trafficOrigin=network",
      "/todo_impression?mobile=true&trafficOrigin=network"
    ];

    paths.forEach(path => {
      GM.xmlHttpRequest({
        method: "GET",
        headers: {
          "User-Agent": fake_user_agent
        },
        url: `https://publisher.linkvertise.com/api/v1/redirect/link${is_regular[1]}${path}`
      });
    });

    let o = {
      timestamp: new Date().getTime(),
      random: "6548307"
    };
    let bypass_url = `https://publisher.linkvertise.com/api/v1/redirect/link/static${is_regular[1]}`;
    GM.xmlHttpRequest({
      method: "GET",
      headers: {
        "User-Agent": fake_user_agent
      },
      url: bypass_url,
      onload: function (response) {
        let json = JSON.parse(response.responseText);

        let link_target_type;
        if (json.data.link.target_type === "URL") {
          link_target_type = "target";
        } else if (json.data.link.target_type === "PASTE") {
          link_target_type = "paste";
        } else {
          console.warn(`Unexpected link target type: ${json.data.link.target_type}`);
          return;
        }

        o.link_id = json.data.link.id;
        o = { serial: btoa(JSON.stringify(o)) };
        bypass_url = `https://publisher.linkvertise.com/api/v1/redirect/link${is_regular[1]}/${link_target_type}?X-Linkvertise-UT=${localStorage.getItem("X-LINKVERTISE-UT")}`;

        GM.xmlHttpRequest({
          method: "POST",
          headers: {
            "User-Agent": fake_user_agent,
            "Content-Type": "application/json"
          },
          data: JSON.stringify(o),
          url: bypass_url,
          onload: function (response) {
            let json = JSON.parse(response.responseText);
            if (link_target_type === "target") {
              window.location = json.data.target;
            } else {
              let body = document.createElement("body");
              let pre = document.createElement("pre");
              pre.textContent = json.data.paste.trim();
              body.appendChild(pre);
              document.body = body;
            }
          }
        });
      }
    });
  }

  // --- Logique du menu de redirection (deuxième script) ---
  const TARGETS = [
    { label: 'bypass.vip', url: 'https://bypass.vip/' },
    { label: 'skipped.lol', url: 'https://skipped.lol/' },
    { label: 'voltar.lol', url: 'https://voltar.lol/' },
    { label: 'bypass.city', url: 'https://bypass.city/' },
    { label: 'eas.lol/bypass', url: 'https://eas.lol/bypass' },
    { label: 'ace-bypass.com', url: 'https://www.ace-bypass.com/' }
  ];

  function addStyles() {
    if (document.getElementById('gmBypassStyles')) return;
    const css = `
      #gmBypassRoot { font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
      #gmBypassButton {
        position: fixed;
        top: 12px;
        right: 12px;
        z-index: 2147483647;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border-radius: 12px;
        border: none;
        background: linear-gradient(135deg, rgba(23, 23, 23, 0.95), rgba(40,40,40,0.95));
        color: #fff;
        box-shadow: 0 6px 20px rgba(10,10,10,0.35);
        cursor: pointer;
        font-weight: 600;
        letter-spacing: 0.2px;
        backdrop-filter: blur(6px);
        transition: transform .12s ease, box-shadow .12s ease, opacity .12s ease;
        opacity: 0.98;
      }
      #gmBypassButton:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,0.45); opacity: 1; }
      #gmBypassButton:active { transform: translateY(0); }

      #gmBypassIcon {
        display:inline-block;
        width:18px; height:18px;
      }

      #gmBypassMenu {
        position: fixed;
        top: 56px;
        right: 12px;
        z-index: 2147483647;
        min-width: 220px;
        border-radius: 12px;
        overflow: hidden;
        background: linear-gradient(180deg, #ffffff, #fafafa);
        color: #111;
        box-shadow: 0 12px 40px rgba(10,10,10,0.25);
        transform-origin: top right;
        transform: scale(.95);
        opacity: 0;
        pointer-events: none;
        transition: transform .14s cubic-bezier(.2,.9,.3,1), opacity .12s ease;
        border: 1px solid rgba(15,15,15,0.04);
      }
      #gmBypassMenu.open { transform: scale(1); opacity: 1; pointer-events: auto; }

      .gmBypassHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap:8px;
        padding: 10px 12px;
        border-bottom: 1px solid rgba(15,15,15,0.04);
        background: linear-gradient(90deg, rgba(255,255,255,0.7), rgba(250,250,250,0.7));
      }
      .gmBypassTitle { font-size: 13px; font-weight: 700; color: #0f1720; }
      .gmBypassSubtitle { font-size: 11px; color: #556; margin-left: 6px; font-weight: 500; }

      .gmBypassList { padding: 8px; display: grid; gap:6px; }
      .gmBypassItem {
        display:flex;
        align-items:center;
        gap:10px;
        width:100%;
        padding: 8px 10px;
        border-radius: 8px;
        border: none;
        background: transparent;
        cursor: pointer;
        text-align: left;
        font-weight: 600;
        color: #0b1220;
        transition: background .12s ease, transform .08s ease;
      }
      .gmBypassItem:hover { background: rgba(10,10,10,0.04); transform: translateX(4px); }
      .gmBypassLabel { font-size: 13px; }
      .gmBypassHint { font-size: 11px; color: #6b7280; margin-left: auto; font-weight: 600; }

      .gmBypassFoot { padding: 8px 10px; font-size: 12px; color:#6b7280; border-top: 1px solid rgba(15,15,15,0.03); display:flex; justify-content:space-between; align-items:center; gap:8px; }
      .gmSmallBtn { padding:6px 8px; border-radius:8px; border:none; font-weight:700; cursor:pointer; background:transparent; color:#0b1220; }
      .gmSmallBtn:hover { background: rgba(10,10,10,0.03); }

      @media (max-width:420px){
        #gmBypassButton { padding:6px 8px; border-radius:10px; right:8px; top:8px; }
        #gmBypassMenu { right:8px; left:8px; min-width: auto; }
      }
    `;
    const style = document.createElement('style');
    style.id = 'gmBypassStyles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function createUI() {
    if (document.getElementById('gmBypassRoot')) return;

    addStyles();

    const root = document.createElement('div');
    root.id = 'gmBypassRoot';

    const btn = document.createElement('button');
    btn.id = 'gmBypassButton';
    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    btn.title = 'Bypass — afficher les options';

    btn.innerHTML = `
      <svg id="gmBypassIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M3 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span style="display:inline-block;">bypass</span>
    `;

    const menu = document.createElement('div');
    menu.id = 'gmBypassMenu';
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-hidden', 'true');

    const header = document.createElement('div');
    header.className = 'gmBypassHeader';
    const titleWrap = document.createElement('div');
    titleWrap.style.display = 'flex';
    titleWrap.style.alignItems = 'center';
    const title = document.createElement('div');
    title.className = 'gmBypassTitle';
    title.textContent = 'Bypass';
    const subtitle = document.createElement('div');
    subtitle.className = 'gmBypassSubtitle';
    subtitle.textContent = 'Choisis une cible';
    titleWrap.appendChild(title);
    titleWrap.appendChild(subtitle);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'gmSmallBtn';
    closeBtn.title = 'Fermer';
    closeBtn.innerHTML = '✕';
    closeBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(false); });

    header.appendChild(titleWrap);
    header.appendChild(closeBtn);
    menu.appendChild(header);

    const list = document.createElement('div');
    list.className = 'gmBypassList';

    TARGETS.forEach(t => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'gmBypassItem';
      item.dataset.target = t.url;
      item.innerHTML = `<span class="gmBypassLabel">${t.label}</span><span class="gmBypassHint">→</span>`;
      item.title = `Copier l'URL courante puis ouvrir ${t.label}`;

      item.addEventListener('click', async (e) => {
        e.stopPropagation();
        await copyCurrentUrlSafe();
        item.querySelector('.gmBypassHint').textContent = '✓';
        setTimeout(() => {
          if (!PARAMS.enabled) window.location.href = item.dataset.target;
        }, 250);
      });

      list.appendChild(item);
    });

    menu.appendChild(list);

    const foot = document.createElement('div');
    foot.className = 'gmBypassFoot';
    foot.innerHTML = `<div style="font-size:12px;color:#6b7280">URL copiée avant redirection</div>
                      <button class="gmSmallBtn" id="gmBypassParamBtn" title="Envoyer l'URL encodée en paramètre">?u=</button>`;

    foot.querySelector('#gmBypassParamBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      PARAMS.enabled = !PARAMS.enabled;
      e.target.style.fontWeight = PARAMS.enabled ? '900' : '700';
      e.target.style.color = PARAMS.enabled ? '#0b1220' : '#6b7280';
      e.target.textContent = PARAMS.enabled ? '?u= ON' : '?u=';
    });

    menu.appendChild(foot);

    root.appendChild(btn);
    root.appendChild(menu);
    document.body.appendChild(root);

    btn.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
    menu.addEventListener('click', (e) => e.stopPropagation());

    document.addEventListener('click', () => toggleMenu(false));
    document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') toggleMenu(false); });

    function toggleMenu(force) {
      const isOpen = menu.classList.contains('open');
      const open = (typeof force === 'boolean') ? force : !isOpen;
      if (open) {
        menu.classList.add('open');
        menu.setAttribute('aria-hidden', 'false');
        btn.setAttribute('aria-expanded', 'true');
      } else {
        menu.classList.remove('open');
        menu.setAttribute('aria-hidden', 'true');
        btn.setAttribute('aria-expanded', 'false');
      }
    }
  }

  const PARAMS = { enabled: false };

  async function copyCurrentUrlSafe() {
    const currentURL = location.href;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentURL);
      } else {
        throw new Error('clipboard not available');
      }
    } catch (err) {
      try {
        const ta = document.createElement('textarea');
        ta.value = currentURL;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      } catch (e) {
        // ignore—on continue quand même
      }
    }
  }

  document.addEventListener('click', function delegatedRedirect(e) {
    const el = e.target.closest && e.target.closest('.gmBypassItem');
    if (!el) return;
    if (PARAMS.enabled) {
      e.stopPropagation();
      e.preventDefault();
      const base = el.dataset.target;
      try {
        const encoded = encodeURIComponent(location.href);
        const sep = base.includes('?') ? '&' : '?';
        const dest = base + sep + 'u=' + encoded;
        setTimeout(() => { window.location.href = dest; }, 250);
      } catch (err) {
        setTimeout(() => { window.location.href = el.dataset.target; }, 250);
      }
    }
  }, true);

  function init() {
    // Exécuter le contournement Linkvertise en premier
    bypassLinkvertise();

    // Initialiser l'interface utilisateur
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', createUI);
    } else {
      createUI();
    }

    const observer = new MutationObserver(() => {
      if (!document.getElementById('gmBypassRoot')) createUI();
    });
    observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
  }

  init();

})();