// ==UserScript==
// @name         luarmor bypass
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Bypass for luarmor linkvertise ( no lootlabs )
// @author       Nytralis Bypass
// @match        *://*.linkvertise.com/*
// @match        *://ads.luarmor.net/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_openInTab
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Styles globaux
    GM_addStyle(`
        /* Overlay principal */
        #nytralis-bypass-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%) !important;
            color: white !important;
            z-index: 999999999 !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif !important;
            backdrop-filter: blur(10px) !important;
        }
        
        /* Logo/En-tête */
        .bypass-header {
            text-align: center;
            margin-bottom: 40px;
            animation: fadeInDown 0.8s ease-out;
        }
        
        .logo {
            font-size: 48px;
            font-weight: 800;
            background: linear-gradient(45deg, #3b82f6, #8b5cf6);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            margin-bottom: 10px;
            letter-spacing: 2px;
        }
        
        .tagline {
            color: #94a3b8;
            font-size: 16px;
            font-weight: 300;
        }
        
        /* Carte principale */
        .bypass-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 40px;
            width: 90%;
            max-width: 500px;
            border: 1px solid rgba(59, 130, 246, 0.2);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
            animation: fadeInUp 0.8s ease-out 0.2s both;
            text-align: center;
        }
        
        /* Loader moderne */
        .nytralis-loader {
            width: 60px;
            height: 60px;
            margin: 0 auto 30px;
            position: relative;
        }
        
        .loader-circle {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 4px solid transparent;
            border-top: 4px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        .loader-circle:nth-child(2) {
            border-top: 4px solid #8b5cf6;
            animation-delay: 0.3s;
        }
        
        .loader-circle:nth-child(3) {
            border-top: 4px solid #10b981;
            animation-delay: 0.6s;
        }
        
        /* Statut */
        .status-container {
            margin-bottom: 30px;
        }
        
        .status-title {
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 10px;
            color: #f1f5f9;
        }
        
        .status-subtitle {
            color: #cbd5e1;
            font-size: 14px;
            margin-bottom: 20px;
        }
        
        /* Barre de progression */
        .progress-container {
            width: 100%;
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            overflow: hidden;
            margin: 20px 0;
        }
        
        .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #3b82f6, #10b981);
            border-radius: 3px;
            width: 0%;
            transition: width 0.3s ease;
        }
        
        /* Timer */
        .timer-display {
            font-size: 28px;
            font-weight: 700;
            font-family: 'Courier New', monospace;
            color: #3b82f6;
            margin: 20px 0;
            text-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
        }
        
        /* Boutons */
        .button-container {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 30px;
            flex-wrap: wrap;
        }
        
        .discord-btn {
            background: linear-gradient(45deg, #5865F2, #4752c4);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
            text-decoration: none;
        }
        
        .discord-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(88, 101, 242, 0.3);
        }
        
        .retry-btn {
            background: linear-gradient(45deg, #ef4444, #dc2626);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
        }
        
        .retry-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(239, 68, 68, 0.3);
        }
        
        /* Messages */
        .info-box {
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 10px;
            padding: 15px;
            margin: 20px 0;
            font-size: 13px;
            color: #60a5fa;
        }
        
        /* Animation pour ads.luarmor.net */
        .luarmor-notice {
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            background: rgba(15, 23, 42, 0.95) !important;
            backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(59, 130, 246, 0.3) !important;
            border-radius: 10px !important;
            padding: 10px 15px !important;
            font-size: 11px !important;
            color: #60a5fa !important;
            z-index: 2147483646 !important;
            max-width: 250px !important;
            animation: slideInRight 0.5s ease-out !important;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3) !important;
        }
        
        /* Bouton Click Me pour luarmor */
        .nytralis-click-me {
            background: linear-gradient(45deg, #10b981, #059669) !important;
            color: white !important;
            border: none !important;
            border-radius: 8px !important;
            font-weight: bold !important;
            font-size: 12px !important;
            text-align: center !important;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4) !important;
            transition: all 0.3s ease !important;
            animation: pulse 2s infinite !important;
            padding: 8px 16px !important;
            min-width: 80px !important;
            min-height: 35px !important;
            cursor: pointer !important;
            z-index: 2147483647 !important;
        }
        
        .nytralis-click-me:hover {
            transform: scale(1.1) !important;
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6) !important;
            background: linear-gradient(45deg, #34d399, #10b981) !important;
        }
        
        /* Animations */
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        /* État succès */
        .success-icon {
            font-size: 60px;
            color: #10b981;
            margin-bottom: 20px;
            animation: bounce 1s ease;
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
            40% {transform: translateY(-20px);}
            60% {transform: translateY(-10px);}
        }
        
        /* Mode mobile */
        @media (max-width: 600px) {
            .bypass-card {
                padding: 20px;
                width: 95%;
            }
            
            .logo {
                font-size: 36px;
            }
            
            .timer-display {
                font-size: 24px;
            }
            
            .button-container {
                flex-direction: column;
                align-items: center;
            }
            
            .discord-btn, .retry-btn {
                width: 100%;
                justify-content: center;
            }
        }
    `);

    // Fonction principale
    function main() {
        const isLuarmor = window.location.hostname.includes('luarmor.net');
        
        if (isLuarmor) {
            handleLuarmorPage();
        } else {
            handleLinkvertisePage();
        }
    }
    
    // Gestion de la page luarmor.net
    function handleLuarmorPage() {
        // Ajouter la notification discrète
        const notice = document.createElement('div');
        notice.className = 'luarmor-notice';
        notice.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="color: #10b981;">✓</span>
                <span><strong>Nytralis Bypass:</strong> Click any "Click Me" button to continue</span>
            </div>
        `;
        document.body.appendChild(notice);
        
        // Fonction pour détecter si une couleur est verte ou bleue
        function isGreenOrBlueColor(color) {
            if (!color) return false;
            
            // Convertir les différentes formes de couleur
            let r, g, b;
            
            if (color.startsWith('rgb')) {
                const match = color.match(/(\d+),\s*(\d+),\s*(\d+)/);
                if (match) {
                    r = parseInt(match[1]);
                    g = parseInt(match[2]);
                    b = parseInt(match[3]);
                }
            } else if (color.startsWith('#')) {
                const hex = color.substring(1);
                if (hex.length === 3) {
                    r = parseInt(hex[0] + hex[0], 16);
                    g = parseInt(hex[1] + hex[1], 16);
                    b = parseInt(hex[2] + hex[2], 16);
                } else if (hex.length === 6) {
                    r = parseInt(hex.substring(0, 2), 16);
                    g = parseInt(hex.substring(2, 4), 16);
                    b = parseInt(hex.substring(4, 6), 16);
                }
            }
            
            if (r === undefined || g === undefined || b === undefined) return false;
            
            // Détecter les verts (g est plus élevé que r et b)
            const isGreen = g > r && g > b && g > 100;
            
            // Détecter les bleus (b est plus élevé que r et g)
            const isBlue = b > r && b > g && b > 100;
            
            // Détecter les teintes cyan/vert-bleu
            const isCyan = g > 150 && b > 150 && r < 150;
            
            // Couleurs vertes spécifiques
            const greenColors = ['#10b981', '#059669', '#34d399', '#22c55e', '#16a34a', '#15803d', '#166534', '#22d3ee'];
            const isNamedGreen = greenColors.some(green => color.toLowerCase().includes(green.replace('#', '')));
            
            // Couleurs bleues spécifiques
            const blueColors = ['#3b82f6', '#2563eb', '#1d4ed8', '#60a5fa', '#93c5fd', '#6366f1', '#8b5cf6'];
            const isNamedBlue = blueColors.some(blue => color.toLowerCase().includes(blue.replace('#', '')));
            
            return isGreen || isBlue || isCyan || isNamedGreen || isNamedBlue;
        }
        
        // Fonction pour transformer les boutons verts/bleus
        function transformButtons() {
            // Chercher tous les éléments qui pourraient être des boutons
            const elements = document.querySelectorAll('button, input[type="button"], input[type="submit"], a, div[role="button"], [onclick]');
            
            elements.forEach(element => {
                try {
                    // Ignorer les éléments déjà transformés
                    if (element.classList.contains('nytralis-click-me')) return;
                    
                    // Vérifier si l'élément est visible
                    const style = window.getComputedStyle(element);
                    if (style.display === 'none' || style.visibility === 'hidden') return;
                    
                    // Vérifier la taille minimale
                    if (element.offsetWidth < 30 || element.offsetHeight < 20) return;
                    
                    // Obtenir la couleur de fond
                    const bgColor = style.backgroundColor;
                    const bgImage = style.backgroundImage;
                    
                    // Vérifier si l'élément a une couleur de fond verte/bleue
                    const hasGreenBlueBg = isGreenOrBlueColor(bgColor) || 
                                          (bgImage && (bgImage.includes('green') || bgImage.includes('blue')));
                    
                    // Vérifier la couleur de bordure
                    const borderColor = style.borderColor;
                    const hasGreenBlueBorder = isGreenOrBlueColor(borderColor);
                    
                    // Vérifier la couleur du texte
                    const textColor = style.color;
                    const hasGreenBlueText = isGreenOrBlueColor(textColor);
                    
                    // Vérifier les classes CSS
                    const classList = element.className.toLowerCase();
                    const hasGreenBlueClass = classList.includes('green') || 
                                             classList.includes('blue') || 
                                             classList.includes('success') ||
                                             classList.includes('primary') ||
                                             classList.includes('btn-success') ||
                                             classList.includes('btn-primary') ||
                                             classList.includes('button-green') ||
                                             classList.includes('button-blue');
                    
                    // Vérifier l'ID
                    const id = element.id.toLowerCase();
                    const hasGreenBlueId = id.includes('green') || id.includes('blue');
                    
                    // Vérifier le texte
                    const text = element.textContent.toLowerCase();
                    const hasActionText = text.includes('start') || 
                                         text.includes('next') || 
                                         text.includes('continue') || 
                                         text.includes('open') || 
                                         text.includes('go') || 
                                         text.includes('click') || 
                                         text.includes('allow') ||
                                         text.includes('verify') ||
                                         text.includes('accept');
                    
                    // Si c'est un bouton vert/bleu ou d'action, le transformer
                    if (hasGreenBlueBg || hasGreenBlueBorder || hasGreenBlueClass || hasGreenBlueId || hasActionText) {
                        // Sauvegarder les propriétés originales
                        const originalOnClick = element.onclick;
                        const originalStyle = element.getAttribute('style');
                        
                        // Appliquer le style "Click Me"
                        element.classList.add('nytralis-click-me');
                        
                        // Garder le texte original s'il est court, sinon mettre "Click Me"
                        if (text.length > 20 || hasActionText) {
                            element.textContent = 'Click Me';
                        }
                        
                        // Réappliquer les événements originaux
                        if (originalOnClick) {
                            element.onclick = originalOnClick;
                        }
                        
                        // Sauvegarder le style original
                        if (originalStyle) {
                            element.dataset.originalStyle = originalStyle;
                        }
                    }
                } catch (e) {
                    console.log('Nytralis Bypass: Error transforming element', e);
                }
            });
        }
        
        // Observer les changements du DOM
        const observer = new MutationObserver(function(mutations) {
            transformButtons();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class', 'id']
        });
        
        // Transformer les boutons existants
        transformButtons();
        
        // Transformer périodiquement (au cas où certains boutons apparaissent après)
        setInterval(transformButtons, 1000);
    }
    
    // Gestion de la page linkvertise.com
    function handleLinkvertisePage() {
        // Créer l'overlay principal
        const overlay = document.createElement('div');
        overlay.id = 'nytralis-bypass-overlay';
        
        // Bloquer toute interaction avec la page
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        
        let currentUrl = window.location.href;
        let countdown = 60;
        let countdownInterval;
        let apiCalled = false;
        let startTime = Date.now();
        
        // Mise à jour de l'interface
        function updateInterface() {
            const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
            const progressPercent = Math.min(100, (elapsedSeconds / 60) * 100);
            
            overlay.innerHTML = `
                <div class="bypass-header">
                    <div class="logo">NYTRALIS BYPASS</div>
                    <div class="tagline">Advanced Linkvertise Bypass System</div>
                </div>
                
                <div class="bypass-card">
                    <div class="nytralis-loader">
                        <div class="loader-circle"></div>
                        <div class="loader-circle"></div>
                        <div class="loader-circle"></div>
                    </div>
                    
                    <div class="status-container">
                        <div class="status-title">Bypassing Linkvertise...</div>
                        <div class="status-subtitle">Please wait while we process your request</div>
                    </div>
                    
                    <div class="progress-container">
                        <div class="progress-bar" id="progress-bar" style="width: ${progressPercent}%"></div>
                    </div>
                    
                    <div class="timer-display" id="timer">${Math.floor(countdown/60).toString().padStart(2, '0')}:${(countdown%60).toString().padStart(2, '0')}</div>
                    
                    <div class="info-box">
                        <strong>Average Time:</strong> 12 seconds<br>
                        <strong>Max Timeout:</strong> 60 seconds<br>
                        <strong>Status:</strong> Bypassing...
                    </div>
                    
                    <div class="button-container">
                        <button class="discord-btn" id="discord-btn">
                            <span>💬</span>
                            Join Discord Server
                        </button>
                    </div>
                </div>
            `;
            
            // Ajouter l'overlay au body
            document.body.prepend(overlay);
            
            // Gestion du bouton Discord
            document.getElementById('discord-btn').addEventListener('click', function(e) {
                e.preventDefault();
                GM_openInTab('https://discord.gg/dfjBsduPsF', { active: true });
            });
        }
        
        function updateTimer() {
            const timerEl = document.getElementById('timer');
            if (timerEl) {
                timerEl.textContent = `${Math.floor(countdown/60).toString().padStart(2, '0')}:${(countdown%60).toString().padStart(2, '0')}`;
            }
        }
        
        function updateProgressBar() {
            const progressBar = document.getElementById('progress-bar');
            if (progressBar) {
                const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
                const progressPercent = Math.min(100, (elapsedSeconds / 60) * 100);
                progressBar.style.width = `${progressPercent}%`;
            }
        }
        
        function startCountdown() {
            countdownInterval = setInterval(() => {
                countdown--;
                updateTimer();
                updateProgressBar();
                
                if (countdown <= 0) {
                    clearInterval(countdownInterval);
                    if (!apiCalled) {
                        showError("Maximum time exceeded (60s). Please try again.");
                    }
                }
            }, 1000);
        }
        
        function showError(message) {
            clearInterval(countdownInterval);
            overlay.innerHTML = `
                <div class="bypass-header">
                    <div class="logo">NYTRALIS BYPASS</div>
                    <div class="tagline">Advanced Linkvertise Bypass System</div>
                </div>
                
                <div class="bypass-card">
                    <div style="color: #ef4444; font-size: 60px; margin-bottom: 20px;">⚠️</div>
                    
                    <div class="status-container">
                        <div class="status-title" style="color: #ef4444;">Error Occurred</div>
                        <div class="status-subtitle">${message}</div>
                    </div>
                    
                    <div class="button-container">
                        <button class="retry-btn" id="retry-btn">
                            <span>🔄</span>
                            Retry Bypass
                        </button>
                        <button class="discord-btn" id="discord-btn-error">
                            <span>💬</span>
                            Get Help on Discord
                        </button>
                    </div>
                </div>
            `;
            
            document.getElementById('retry-btn').addEventListener('click', initiateBypass);
            document.getElementById('discord-btn-error').addEventListener('click', function(e) {
                e.preventDefault();
                GM_openInTab('https://discord.gg/dfjBsduPsF', { active: true });
            });
        }
        
        function showSuccess() {
            overlay.innerHTML = `
                <div class="bypass-header">
                    <div class="logo">NYTRALIS BYPASS</div>
                    <div class="tagline">Advanced Linkvertise Bypass System</div>
                </div>
                
                <div class="bypass-card">
                    <div class="success-icon">✓</div>
                    
                    <div class="status-container">
                        <div class="status-title" style="color: #10b981;">Bypass Successful!</div>
                        <div class="status-subtitle">Redirecting you to the destination...</div>
                    </div>
                    
                    <div class="info-box">
                        You will be redirected in <span id="redirect-countdown">2</span> seconds
                    </div>
                    
                    <div class="button-container">
                        <button class="discord-btn" id="discord-btn-success">
                            <span>💬</span>
                            Join Our Discord
                        </button>
                    </div>
                </div>
            `;
            
            let redirectCount = 2;
            const countdownEl = document.getElementById('redirect-countdown');
            const redirectInterval = setInterval(() => {
                redirectCount--;
                countdownEl.textContent = redirectCount;
                
                if (redirectCount <= 0) {
                    clearInterval(redirectInterval);
                }
            }, 1000);
            
            document.getElementById('discord-btn-success').addEventListener('click', function(e) {
                e.preventDefault();
                GM_openInTab('https://discord.gg/dfjBsduPsF', { active: true });
            });
        }
        
        function initiateBypass() {
            updateInterface();
            countdown = 60;
            apiCalled = false;
            startTime = Date.now();
            startCountdown();
            
            // Appeler l'API de bypass Nytralis
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://nytralis-linkvertise.onrender.com/bypass?url=${encodeURIComponent(currentUrl)}`,
                timeout: 65000,
                onload: function(response) {
                    apiCalled = true;
                    clearInterval(countdownInterval);
                    
                    try {
                        const data = JSON.parse(response.responseText);
                        
                        if (data && data.result) {
                            // Construire l'URL de redirection
                            const redirectUrl = `https://montelopiuy.pythonanywhere.com/redirect?to=${encodeURIComponent(data.result)}`;
                            
                            // Afficher le succès
                            showSuccess();
                            
                            // Rediriger après 2 secondes
                            setTimeout(() => {
                                window.location.href = redirectUrl;
                            }, 2000);
                        } else {
                            showError("API did not return a valid link. Please try again.");
                        }
                    } catch (e) {
                        showError("Failed to parse API response. Please try again.");
                    }
                },
                onerror: function() {
                    showError("Connection error. Please check your internet and try again.");
                },
                ontimeout: function() {
                    showError("API timeout (65s). The service might be busy. Please try again.");
                }
            });
        }
        
        // Empêcher les interactions
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' || e.key === 'F5') {
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);
        
        document.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
        }, true);
        
        // Empêcher le menu contextuel
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        }, true);
        
        // Démarrer le processus
        initiateBypass();
    }
    
    // Exécuter le script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();