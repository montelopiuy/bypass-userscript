// ==UserScript==
// @name          Linkvertise Bypass - n0v4 Edition
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Bypass Linkvertise avec une interface sombre magnifique
// @author       n0v4 team
// @match        *://*.linkvertise.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;
    const apiUrl = 'http://ace-bypass.com/api/bypass';
    const apiKey = 'FREE_bJ2Ts-4u1pTAHavW7gy4kqIjSpGESr0H8tqHgDW-8pI';

    // Créer l'interface immédiatement
    function createBeautifulInterface() {
        // Style global
        const style = document.createElement('style');
        style.textContent = `
            @keyframes glitch {
                0% { text-shadow: 0.05em 0 0 #00ff00, -0.05em -0.025em 0 #0f0, 0.025em 0.05em 0 #0f0; }
                25% { text-shadow: -0.05em -0.025em 0 #00ff00, 0.025em 0.05em 0 #0f0, -0.05em -0.05em 0 #0f0; }
                50% { text-shadow: 0.025em 0.05em 0 #00ff00, -0.05em -0.025em 0 #0f0, 0.05em -0.025em 0 #0f0; }
                75% { text-shadow: -0.05em -0.025em 0 #00ff00, 0.025em 0.05em 0 #0f0, -0.05em -0.05em 0 #0f0; }
                100% { text-shadow: 0.05em 0 0 #00ff00, -0.05em -0.025em 0 #0f0, 0.025em 0.05em 0 #0f0; }
            }
            @keyframes matrix {
                0% { background-position: 0% 0%; }
                100% { background-position: 0% 100%; }
            }
            @keyframes pulse-green {
                0% { box-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 15px #00ff00; }
                50% { box-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00; }
                100% { box-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 15px #00ff00; }
            }
            @keyframes flicker {
                0% { opacity: 1; }
                50% { opacity: 0.8; }
                100% { opacity: 1; }
            }
            @keyframes scanline {
                0% { transform: translateY(-100%); }
                100% { transform: translateY(100%); }
            }
        `;
        document.head.appendChild(style);

        // Overlay principal - sombre
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #0a0a0a;
            background-image: 
                linear-gradient(rgba(0, 255, 0, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 0, 0.03) 1px, transparent 1px);
            background-size: 50px 50px;
            z-index: 999999;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Courier New', monospace;
            color: #00ff00;
            text-shadow: 0 0 5px #00ff00;
        `;

        // Effet scanline
        const scanline = document.createElement('div');
        scanline.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 10px;
            background: linear-gradient(to bottom, transparent, rgba(0, 255, 0, 0.2), transparent);
            animation: scanline 6s linear infinite;
            pointer-events: none;
            z-index: 1000001;
        `;
        overlay.appendChild(scanline);

        // Effet matrix en arrière-plan
        const matrixCanvas = document.createElement('canvas');
        matrixCanvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.1;
            pointer-events: none;
        `;
        
        // Matrix effect simple
        const ctx = matrixCanvas.getContext('2d');
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
        
        const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
        const drops = [];
        const columns = matrixCanvas.width / 20;
        
        for(let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
        
        function drawMatrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
            
            ctx.fillStyle = '#0f0';
            ctx.font = '15px monospace';
            
            for(let i = 0; i < drops.length; i++) {
                const text = matrix[Math.floor(Math.random() * matrix.length)];
                ctx.fillText(text, i * 20, drops[i] * 20);
                
                if(drops[i] * 20 > matrixCanvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        
        setInterval(drawMatrix, 50);

        // Conteneur principal
        const container = document.createElement('div');
        container.style.cssText = `
            position: relative;
            text-align: center;
            padding: 50px;
            background: rgba(10, 10, 10, 0.9);
            border: 2px solid #00ff00;
            border-radius: 10px;
            box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
            min-width: 500px;
            animation: pulse-green 2s infinite;
            backdrop-filter: blur(5px);
            z-index: 1000000;
        `;

        // ASCII Art
        const asciiArt = document.createElement('pre');
        asciiArt.style.cssText = `
            color: #00ff00;
            font-size: 12px;
            margin-bottom: 20px;
            line-height: 1.2;
            animation: flicker 3s infinite;
        `;
        asciiArt.textContent = `
    ╔══════════════════════════════════════╗
    ║     [ n0v4 team - linkvertise ]     ║
    ╚══════════════════════════════════════╝
        `;

        // Message principal
        const mainMessage = document.createElement('h1');
        mainMessage.textContent = '> THANKS FOR USING';
        mainMessage.style.cssText = `
            font-size: 36px;
            margin: 10px 0;
            font-weight: bold;
            letter-spacing: 2px;
            animation: glitch 2s infinite;
        `;

        // Sous-message
        const subMessage = document.createElement('p');
        subMessage.textContent = '>> n0v4 team <<';
        subMessage.style.cssText = `
            font-size: 18px;
            margin: 10px 0 20px;
            opacity: 0.8;
            border-bottom: 1px solid #00ff00;
            padding-bottom: 10px;
            display: inline-block;
        `;

        // Conteneur de la barre de progression
        const progressContainer = document.createElement('div');
        progressContainer.style.cssText = `
            margin: 30px 0;
            font-family: 'Courier New', monospace;
        `;

        // Label de progression
        const progressLabel = document.createElement('div');
        progressLabel.style.cssText = `
            font-size: 14px;
            margin-bottom: 10px;
            color: #00ff00;
            text-align: left;
        `;
        progressLabel.textContent = '$> Initializing bypass sequence...';

        // Barre de progression style Linux
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            font-size: 24px;
            letter-spacing: 2px;
            line-height: 1.5;
            background: #1a1a1a;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #00ff00;
            color: #00ff00;
            text-shadow: 0 0 5px #00ff00;
            margin-bottom: 10px;
        `;

        // Pourcentage
        const percentage = document.createElement('div');
        percentage.style.cssText = `
            font-size: 16px;
            color: #00ff00;
            text-align: right;
        `;

        // Message de statut
        const statusMessage = document.createElement('div');
        statusMessage.style.cssText = `
            font-size: 14px;
            margin-top: 20px;
            color: #00ff00;
            opacity: 0.7;
            border-top: 1px solid #00ff00;
            padding-top: 15px;
        `;

        // Assemblage
        container.appendChild(asciiArt);
        container.appendChild(mainMessage);
        container.appendChild(subMessage);
        container.appendChild(progressContainer);
        progressContainer.appendChild(progressLabel);
        progressContainer.appendChild(progressBar);
        progressContainer.appendChild(percentage);
        container.appendChild(statusMessage);
        
        overlay.appendChild(matrixCanvas);
        overlay.appendChild(container);
        document.documentElement.appendChild(overlay);

        return { progressBar, percentage, statusMessage, progressLabel, overlay, container };
    }

    // Animation de la barre de progression
    function animateProgress(elements) {
        const { progressBar, percentage, statusMessage, progressLabel, overlay } = elements;
        const totalSteps = 40; // 40 * 125ms = 5 secondes
        let currentStep = 0;
        
        const steps = [
            '█░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░', // 2.5%
            '██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░', // 5%
            '███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░', // 7.5%
            '████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░', // 10%
            '█████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░', // 12.5%
            '██████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░', // 15%
            '███████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░', // 17.5%
            '████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░', // 20%
            '█████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░', // 22.5%
            '██████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░', // 25%
            '███████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░', // 27.5%
            '████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░', // 30%
            '█████████████░░░░░░░░░░░░░░░░░░░░░░░░░░', // 32.5%
            '██████████████░░░░░░░░░░░░░░░░░░░░░░░░░', // 35%
            '███████████████░░░░░░░░░░░░░░░░░░░░░░░░', // 37.5%
            '████████████████░░░░░░░░░░░░░░░░░░░░░░░', // 40%
            '█████████████████░░░░░░░░░░░░░░░░░░░░░░', // 42.5%
            '██████████████████░░░░░░░░░░░░░░░░░░░░░', // 45%
            '███████████████████░░░░░░░░░░░░░░░░░░░░', // 47.5%
            '████████████████████░░░░░░░░░░░░░░░░░░░', // 50%
            '█████████████████████░░░░░░░░░░░░░░░░░░', // 52.5%
            '██████████████████████░░░░░░░░░░░░░░░░░', // 55%
            '███████████████████████░░░░░░░░░░░░░░░░', // 57.5%
            '████████████████████████░░░░░░░░░░░░░░░', // 60%
            '█████████████████████████░░░░░░░░░░░░░░', // 62.5%
            '██████████████████████████░░░░░░░░░░░░░', // 65%
            '███████████████████████████░░░░░░░░░░░░', // 67.5%
            '████████████████████████████░░░░░░░░░░░', // 70%
            '█████████████████████████████░░░░░░░░░░', // 72.5%
            '██████████████████████████████░░░░░░░░░', // 75%
            '███████████████████████████████░░░░░░░░', // 77.5%
            '████████████████████████████████░░░░░░░', // 80%
            '█████████████████████████████████░░░░░░', // 82.5%
            '██████████████████████████████████░░░░░', // 85%
            '███████████████████████████████████░░░░', // 87.5%
            '████████████████████████████████████░░░', // 90%
            '█████████████████████████████████████░░', // 92.5%
            '██████████████████████████████████████░', // 95%
            '███████████████████████████████████████', // 97.5%
            '████████████████████████████████████████'  // 100%
        ];

        const messages = [
            'Analyzing link structure...',
            'Bypassing security layer 1...',
            'Decrypting payload...',
            'Bypassing security layer 2...',
            'Spoofing referer...',
            'Bypassing security layer 3...',
            'Generating fake session...',
            'Circumventing anti-bot...',
            'Bypassing Cloudflare...',
            'Decoding parameters...',
            'Evading detection...',
            'Spoofing user-agent...',
            'Bypassing timeouts...',
            'Generating access token...',
            'Finalizing bypass...',
            'Almost there...',
            'Redirecting soon...'
        ];

        const interval = setInterval(() => {
            currentStep++;
            
            if (currentStep <= totalSteps) {
                // Mettre à jour la barre
                progressBar.textContent = `[${steps[currentStep - 1]}]`;
                
                // Mettre à jour le pourcentage
                const percent = Math.floor((currentStep / totalSteps) * 100);
                percentage.textContent = `${percent}%`;
                
                // Changer le message de statut
                if (currentStep % 3 === 0) {
                    const messageIndex = Math.floor(currentStep / 3) - 1;
                    if (messageIndex < messages.length && messageIndex >= 0) {
                        statusMessage.textContent = `$> ${messages[messageIndex]}`;
                    }
                }
                
                // Changer le label de progression
                if (currentStep === 10) {
                    progressLabel.textContent = '$> Bypass in progress...';
                } else if (currentStep === 20) {
                    progressLabel.textContent = '$> Halfway there...';
                } else if (currentStep === 30) {
                    progressLabel.textContent = '$> Almost done...';
                } else if (currentStep === 35) {
                    progressLabel.textContent = '$> Finalizing...';
                }
            }
            
            if (currentStep === totalSteps) {
                clearInterval(interval);
                
                // Animation finale - l'interface reste mais change de message
                progressBar.textContent = '[████████████████████████████████████████]';
                percentage.textContent = '100%';
                statusMessage.textContent = '$> Bypass complete! Redirecting...';
                progressLabel.textContent = '$> Contacting destination server...';
                
                // On garde l'interface visible pendant l'appel API
                setTimeout(() => {
                    // Appel API pour le bypass
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: apiUrl + '?url=' + encodeURIComponent(currentUrl) + '&apikey=' + encodeURIComponent(apiKey),
                        onload: function(response) {
                            if (response.status === 200) {
                                try {
                                    const data = JSON.parse(response.responseText);
                                    if (data.status === 'success' && data.result) {
                                        // Dernier message avant redirection
                                        statusMessage.textContent = '$> Redirecting to: ' + data.result.substring(0, 50) + '...';
                                        progressLabel.textContent = '$> See you space cowboy...';
                                        
                                        // Petite pause pour voir le message final
                                        setTimeout(() => {
                                            window.location.replace(data.result);
                                        }, 800);
                                    } else {
                                        statusMessage.textContent = '$> Error: Bypass failed';
                                        progressLabel.textContent = '$> Check console for details';
                                        console.error('Échec du bypass :', data);
                                    }
                                } catch (e) {
                                    statusMessage.textContent = '$> Error: Invalid response';
                                    console.error('Erreur de parsing JSON', e);
                                }
                            } else {
                                statusMessage.textContent = '$> Error: HTTP ' + response.status;
                                console.error('Erreur HTTP', response.status);
                            }
                        },
                        onerror: function(err) {
                            statusMessage.textContent = '$> Error: Network failure';
                            progressLabel.textContent = '$> Please check your connection';
                            console.error('Erreur réseau', err);
                        }
                    });
                }, 500); // Petite pause pour voir le message "Bypass complete"
            }
        }, 125); // 125ms * 40 = 5 secondes exactement
    }

    // Démarrer l'interface
    const elements = createBeautifulInterface();
    animateProgress(elements);

})();