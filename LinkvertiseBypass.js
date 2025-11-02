// ==UserScript==
// @name         BypassAdditions
// @namespace    http://tampermonkey.net/
// @version      0.6.2
// @updateURL    https://raw.githubusercontent.com/FireMasterK/BypassAdditions/master/script.user.js
// @description  Bypass links that cannot be bypassed by Universal Bypass (activable via bouton)
// @author       FireMasterK
// @match        *://*.linkvertise.com/*
// @match        *://*.linkvertise.net/*
// @match        *://*.linkvertise.download/*
// @match        *://*.link-to.net/*
// @match        *://*.file-link.net/*
// @match        *://*.direct-link.net/*
// @match        *://*.up-to-down.net/*
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // === Création du bouton en haut à gauche ===
    const button = document.createElement('button');
    button.textContent = 'Bypass';
    button.style.cssText = `
        position: fixed !important;
        top: 10px !important;
        left: 10px !important;
        z-index: 999999 !important;
        padding: 10px 15px !important;
        background: #ff4444 !important;
        color: white !important;
        border: none !important;
        border-radius: 8px !important;
        font-weight: bold !important;
        cursor: pointer !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
        font-size: 14px !important;
        transition: all 0.2s !important;
    `;

    button.onmouseover = () => button.style.background = '#ff6666';
    button.onmouseout = () => button.style.background = '#ff4444';

    // Désactiver le scroll du body tant que le bouton n'est pas cliqué
    document.body.style.overflow = 'hidden';

    // Ajouter le bouton au body
    document.body.appendChild(button);

    // Fonction principale du bypass
    function runBypass() {
        // Supprimer le bouton après activation
        button.remove();
        document.body.style.overflow = '';

        const fake_user_agent = "Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1";
        let search_params = new URLSearchParams(window.location.search);

        if (search_params.get("r") !== null) {
            window.location = atob(decodeURIComponent(search_params.get("r")));
            return;
        }

        if (window.parent.location !== window.location) return;

        let re_download = /^\/download(\/[0-9]+\/[^\/]+)\//;
        let is_download = re_download.exec(window.location.pathname);
        if (is_download !== null) {
            window.location.pathname = is_download[1];
            return;
        }

        let re_regular = /^(\/[0-9]+\/[^\/]+)/;
        let is_regular = re_regular.exec(window.location.pathname);
        if (is_regular === null) return;

        let paths = ["/captcha", "/countdown_impression?trafficOrigin=network", "/todo_impression?mobile=true&trafficOrigin=network"];
        paths.forEach(path => {
            GM.xmlHttpRequest({
                method: "GET",
                headers: { "User-Agent": fake_user_agent },
                url: `https://publisher.linkvertise.com/api/v1/redirect/link${is_regular[1]}${path}`
            });
        });

        let o = { timestamp: new Date().getTime(), random: "6548307" };
        let bypass_url = `https://publisher.linkvertise.com/api/v1/redirect/link/static${is_regular[1]}`;

        GM.xmlHttpRequest({
            method: "GET",
            headers: { "User-Agent": fake_user_agent },
            url: bypass_url,
            onload: function (response) {
                let json = JSON.parse(response.responseText);
                let link_target_type = json.data.link.target_type === "URL" ? "target" : json.data.link.target_type === "PASTE" ? "paste" : null;
                if (!link_target_type) {
                    console.warn(`Type de lien inconnu: ${json.data.link.target_type}`);
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

    // === Activer le bypass uniquement au clic ===
    button.addEventListener('click', function() {
        button.textContent = 'Bypass en cours...';
        button.disabled = true;
        runBypass();
    });

    // Empêcher tout exécution automatique
    // Le script ne fait RIEN tant que le bouton n'est pas cliqué

})();