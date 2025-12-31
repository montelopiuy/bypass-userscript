// ==UserScript==
// @name         Bypass + Camper
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Bypass integration
// @author       You
// @match        https://lootdest.org/*
// @match        https://linkvertise.com/*
// @match        https://work.ink/*
// @match        *://*/*
// @require      https://github.com/montelopiuy/bypass-userscript/raw/refs/heads/main/camper-bypass.user.js
// @grant        GM_xmlhttpRequest
// @connect      trycloudflare.com
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const SERVER_URL = 'https://rhythm-lean-four-options.trycloudflare.com';
    let startTime = null;
    let timerInterval = null;

    function createBypassUI() {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        `;

        const button = document.createElement('button');
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            <span>Bypass</span>
        `;
        button.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 18px;
            background: #18181b;
            color: #fafafa;
            border: 1px solid #27272a;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        `;

        const timer = document.createElement('div');
        timer.style.cssText = `
            margin-top: 8px;
            padding: 6px 12px;
            background: #09090b;
            border: 1px solid #27272a;
            border-radius: 6px;
            font-size: 12px;
            color: #a1a1aa;
            text-align: center;
            display: none;
            font-variant-numeric: tabular-nums;
        `;

        button.onmouseover = () => {
            if (!button.disabled) {
                button.style.background = '#27272a';
                button.style.borderColor = '#3f3f46';
                button.style.transform = 'translateY(-1px)';
                button.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
            }
        };

        button.onmouseout = () => {
            if (!button.disabled) {
                button.style.background = '#18181b';
                button.style.borderColor = '#27272a';
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
            }
        };

        button.onclick = () => bypass(button, timer);

        container.appendChild(button);
        container.appendChild(timer);
        document.body.appendChild(container);
    }

    async function bypass(btn, timer) {
        const url = window.location.href;
        
        startTime = Date.now();
        timer.style.display = 'block';
        timer.textContent = '0.0s';

        timerInterval = setInterval(() => {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            timer.textContent = `${elapsed}s`;
        }, 100);

        btn.disabled = true;
        btn.style.cursor = 'wait';
        btn.style.opacity = '0.6';
        btn.querySelector('span').textContent = 'Processing...';

        try {
            window.location.href = `${SERVER_URL}/bypass-redirect?url=${encodeURIComponent(url)}`;
        } catch (e) {
            clearInterval(timerInterval);
            btn.querySelector('span').textContent = 'Error';
            btn.style.background = '#7f1d1d';
            
            setTimeout(() => {
                btn.disabled = false;
                btn.style.cursor = 'pointer';
                btn.style.opacity = '1';
                btn.style.background = '#18181b';
                btn.querySelector('span').textContent = 'Bypass';
                timer.style.display = 'none';
            }, 2000);
        }
    }

    if (document.body) {
        createBypassUI();
    } else {
        window.addEventListener('DOMContentLoaded', createBypassUI);
    }

})();