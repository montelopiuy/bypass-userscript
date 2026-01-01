// ==UserScript==
// @name         Nytralis Bypass
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Auto bypass for link shorteners
// @author       Nytralis
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const SERVER_URL = 'https://browse-beaver-physically-mechanical.trycloudflare.com';
    let startTime = null;
    let timerInterval = null;
    let isProcessing = false;

    // Auto bypass domains
    const AUTO_BYPASS_DOMAINS = [
        'linkvertise.com',
        'lootlinks.com',
        'lootlinks.co',
        'lootdest.com',
        'lootdest.org',
        'loot-link.com',
        'loot-links.com'
    ];

    // Check if current URL matches auto bypass domains
    const currentUrl = window.location.href;
    const shouldAutoBypass = AUTO_BYPASS_DOMAINS.some(domain => currentUrl.includes(domain));

    if (shouldAutoBypass) {
        console.log('[Nytralis Bypass] Auto bypass domain detected...');
        setTimeout(() => {
            showFullscreenBypass(true);
        }, 1000);
    }

    function createBypassButton() {
        const btn = document.createElement('button');
        btn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
        `;
        btn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999998;
            width: 46px;
            height: 46px;
            padding: 0;
            background: rgba(24, 24, 27, 0.95);
            backdrop-filter: blur(8px);
            color: #fafafa;
            border: 1px solid rgba(39, 39, 42, 0.8);
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        btn.onmouseover = () => {
            btn.style.transform = 'scale(1.1)';
            btn.style.background = 'rgba(39, 39, 42, 0.95)';
            btn.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.25)';
        };

        btn.onmouseout = () => {
            btn.style.transform = 'scale(1)';
            btn.style.background = 'rgba(24, 24, 27, 0.95)';
            btn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        };

        btn.onclick = () => showFullscreenBypass(false);

        document.body.appendChild(btn);
    }

    function showFullscreenBypass(auto) {
        if (isProcessing) return;
        isProcessing = true;

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
            z-index: 999999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.4s ease;
        `;

        const container = document.createElement('div');
        container.style.cssText = `
            text-align: center;
            color: white;
            animation: slideUp 0.6s ease;
        `;

        const icon = document.createElement('div');
        icon.innerHTML = `
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
        `;
        icon.style.cssText = `
            margin-bottom: 30px;
            animation: pulse 2s infinite;
        `;

        const title = document.createElement('h1');
        title.textContent = auto ? 'Automatic Bypass' : 'Bypass in Progress';
        title.style.cssText = `
            font-size: 42px;
            font-weight: 700;
            margin: 0 0 15px 0;
            background: linear-gradient(to right, #fff, #a8a8a8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        `;

        const subtitle = document.createElement('p');
        subtitle.textContent = 'Processing your link...';
        subtitle.style.cssText = `
            font-size: 18px;
            color: rgba(255, 255, 255, 0.7);
            margin: 0 0 40px 0;
            font-weight: 400;
        `;

        const timer = document.createElement('div');
        timer.style.cssText = `
            font-size: 56px;
            font-weight: 700;
            color: #fff;
            font-variant-numeric: tabular-nums;
            margin-bottom: 30px;
            text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
        `;
        timer.textContent = '0.0';

        const timerLabel = document.createElement('div');
        timerLabel.textContent = 'seconds';
        timerLabel.style.cssText = `
            font-size: 14px;
            color: rgba(255, 255, 255, 0.5);
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 50px;
        `;

        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            width: 400px;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            overflow: hidden;
            position: relative;
        `;

        const progressFill = document.createElement('div');
        progressFill.style.cssText = `
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            border-radius: 2px;
            transition: width 0.3s ease;
            box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
        `;
        progressBar.appendChild(progressFill);

        const brandingContainer = document.createElement('div');
        brandingContainer.style.cssText = `
            position: absolute;
            bottom: 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        `;

        const brandingText = document.createElement('div');
        brandingText.textContent = 'Nytralis Bypass';
        brandingText.style.cssText = `
            font-size: 16px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.6);
            letter-spacing: 1px;
        `;

        const poweredBy = document.createElement('div');
        poweredBy.textContent = 'Powered by Discord Integration';
        poweredBy.style.cssText = `
            font-size: 12px;
            color: rgba(255, 255, 255, 0.4);
        `;

        brandingContainer.appendChild(brandingText);
        brandingContainer.appendChild(poweredBy);

        container.appendChild(icon);
        container.appendChild(title);
        container.appendChild(subtitle);
        container.appendChild(timer);
        container.appendChild(timerLabel);
        container.appendChild(progressBar);
        overlay.appendChild(container);
        overlay.appendChild(brandingContainer);

        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from {
                    transform: translateY(30px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.05); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);

        // Start timer
        startTime = Date.now();
        timerInterval = setInterval(() => {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            timer.textContent = elapsed;
            const progress = Math.min((elapsed / 30) * 100, 100);
            progressFill.style.width = `${progress}%`;
        }, 100);

        // Redirect
        setTimeout(() => {
            window.location.href = `${SERVER_URL}/bypass-redirect?url=${encodeURIComponent(window.location.href)}`;
        }, 800);
    }

    // Create button if not auto bypass domain
    if (!shouldAutoBypass) {
        if (document.body) {
            createBypassButton();
        } else {
            window.addEventListener('DOMContentLoaded', createBypassButton);
        }
    }

})();
