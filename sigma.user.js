// ==UserScript==
// @name         N0V4 TEAM - Premium Linkvertise Bypass
// @namespace    https://nov4.team/
// @version      3.1
// @description  Premium Linkvertise bypass by N0V4 TEAM
// @author       N0V4 OWNER
// @match        *://linkvertise.com/*
// @match        *://*.linkvertise.com/*
// @grant        GM_xmlhttpRequest
// @connect      ace-bypass.com
// ==/UserScript==

(function () {
    'use strict';

    const API_KEY = "FREE_bJ2Ts-4u1pTAHavW7gy4kqIjSpGESr0H8tqHgDW-8pI";
    const TARGET_URL = location.href;
    let startTime = Date.now();
    let timerInterval;
    
    // ===== N0V4 TEAM PREMIUM UI =====
    const ui = document.createElement("div");
    ui.style = `
        position: fixed;
        inset: 0;
        background: linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #111111 50%, #0a0a0a 75%, #000000 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        color: #ffffff;
        overflow: hidden;
    `;

    ui.innerHTML = `
        <div class="main-container" style="
            position: relative;
            width: 90%;
            max-width: 600px;
            padding: 40px;
            background: rgba(10, 10, 10, 0.9);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8),
                        0 0 0 1px rgba(255, 255, 255, 0.03) inset,
                        0 0 100px rgba(255, 20, 20, 0.1) inset;
            text-align: center;
            overflow: hidden;
        ">
            <!-- N0V4 Glowing Background -->
            <div class="nov4-glow" style="
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255, 20, 20, 0.15) 0%, transparent 70%);
                animation: rotate 20s linear infinite;
                z-index: -1;
            "></div>
            
            <!-- N0V4 TEAM Logo -->
            <div class="logo" style="
                margin-bottom: 25px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 15px;
            ">
                <div class="logo-icon" style="
                    width: 52px;
                    height: 52px;
                    background: linear-gradient(135deg, #ff1414, #ff3333);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 26px;
                    font-weight: 900;
                    color: #000;
                    box-shadow: 0 0 30px rgba(255, 20, 20, 0.5);
                    position: relative;
                    overflow: hidden;
                ">
                    <div style="
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
                        animation: shine 3s infinite;
                    "></div>
                    N0
                </div>
                <div style="text-align: left;">
                    <h1 style="
                        font-size: 38px;
                        font-weight: 900;
                        background: linear-gradient(135deg, #ff1414, #ff6666);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        margin: 0 0 5px 0;
                        letter-spacing: -1px;
                        text-shadow: 0 0 30px rgba(255, 20, 20, 0.3);
                    ">N0V4 TEAM</h1>
                    <div style="
                        font-size: 16px;
                        color: #999;
                        font-weight: 600;
                        letter-spacing: 2px;
                    ">BYPASS SYSTEM</div>
                </div>
            </div>
            
            <!-- Version & Status -->
            <div class="version" style="
                font-size: 14px;
                color: #666;
                margin-bottom: 30px;
                font-weight: 500;
                letter-spacing: 1px;
                display: flex;
                justify-content: center;
                gap: 15px;
            ">
                <span style="color: #ff1414;">●</span>
                <span>v3.1 ELITE EDITION</span>
                <span style="color: #ff1414;">●</span>
            </div>
            
            <!-- Creator Section -->
            <div class="creator" style="
                background: rgba(255, 20, 20, 0.1);
                border-radius: 12px;
                padding: 15px;
                margin-bottom: 40px;
                border: 1px solid rgba(255, 20, 20, 0.2);
                position: relative;
                overflow: hidden;
            ">
                <div style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, #ff1414, transparent);
                "></div>
                <div style="
                    font-size: 18px;
                    font-weight: 700;
                    color: #ff6666;
                    margin-bottom: 5px;
                ">SYSTEM BY N0V4 OWNER</div>
                <div style="
                    font-size: 12px;
                    color: #999;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 8px;
                ">
                    <span>Thanks to</span>
                    <span style="
                        background: rgba(255, 255, 255, 0.1);
                        padding: 3px 10px;
                        border-radius: 10px;
                        color: #ccc;
                        font-weight: 600;
                    ">bacon but pro</span>
                    <span>for HARD! contribution</span>
                </div>
                <div style="
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, #ff1414, transparent);
                "></div>
            </div>
            
            <!-- Processing Container -->
            <div class="processing-container" style="
                background: rgba(20, 20, 20, 0.8);
                border-radius: 16px;
                padding: 25px;
                margin-bottom: 30px;
                border: 1px solid rgba(255, 255, 255, 0.05);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
            ">
                <!-- Timer & Status Header -->
                <div class="processing-header" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                ">
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    ">
                        <div style="
                            width: 10px;
                            height: 10px;
                            background: #ff1414;
                            border-radius: 50%;
                            animation: pulse 1.5s infinite;
                        "></div>
                        <span style="
                            font-size: 16px;
                            font-weight: 600;
                            color: #fff;
                        ">Processing Link</span>
                    </div>
                    <div class="timer-display" style="
                        font-size: 28px;
                        font-weight: 900;
                        font-family: 'Courier New', monospace;
                        color: #ff1414;
                        text-shadow: 0 0 10px rgba(255, 20, 20, 0.5);
                        background: rgba(0, 0, 0, 0.5);
                        padding: 5px 15px;
                        border-radius: 8px;
                        border: 1px solid rgba(255, 20, 20, 0.3);
                    ">00:00</div>
                </div>
                
                <!-- Animated Progress Bar -->
                <div class="progress-section" style="margin-bottom: 15px;">
                    <div class="progress-labels" style="
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 8px;
                        font-size: 12px;
                        color: #999;
                    ">
                        <span>INITIALIZING</span>
                        <span>100%</span>
                    </div>
                    <div class="progress-bar" style="
                        height: 8px;
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 4px;
                        overflow: hidden;
                        position: relative;
                    ">
                        <div class="progress-fill" style="
                            position: absolute;
                            top: 0;
                            left: 0;
                            height: 100%;
                            width: 0%;
                            background: linear-gradient(90deg, #ff1414, #ff3333);
                            border-radius: 4px;
                            transition: width 0.3s ease;
                        "></div>
                        <div class="progress-shine" style="
                            position: absolute;
                            top: 0;
                            left: 0;
                            height: 100%;
                            width: 30px;
                            background: linear-gradient(90deg, 
                                transparent 0%, 
                                rgba(255, 255, 255, 0.9) 50%, 
                                transparent 100%);
                            animation: shimmer 2s infinite;
                            filter: blur(1px);
                        "></div>
                    </div>
                </div>
                
                <!-- Status Messages -->
                <div class="status-container" style="
                    display: flex;
                    justify-content: space-between;
                    font-size: 13px;
                ">
                    <div style="color: #999;">
                        Status: <span class="status-text" style="color: #ff6666;">Initializing...</span>
                    </div>
                    <div style="color: #666;">
                        API: <span style="color: #ccc;">ace-bypass.com</span>
                    </div>
                </div>
            </div>
            
            <!-- Live Status Display -->
            <div class="live-status" style="
                font-size: 15px;
                color: #ff6666;
                margin-bottom: 25px;
                min-height: 22px;
                font-weight: 600;
                text-shadow: 0 0 10px rgba(255, 20, 20, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            ">
                <div class="status-dot" style="
                    width: 6px;
                    height: 6px;
                    background: #ff1414;
                    border-radius: 50%;
                    animation: pulse 1s infinite;
                "></div>
                <span class="status-message">Loading N0V4 bypass system...</span>
            </div>
            
            <!-- N0V4 Signature -->
            <div class="signature" style="
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.05);
                font-size: 11px;
                color: #444;
                letter-spacing: 1px;
            ">
                <div style="margin-bottom: 5px;">N0V4 TEAM SECURITY BYPASS PROTOCOL • ACTIVE</div>
                <div>Auto-redirect in <span class="countdown" style="color: #ff1414; font-weight: 700;">3</span>s • v3.1 Elite</div>
            </div>
            
            <!-- Decorative Elements -->
            <div class="decoration-corner top-left" style="
                position: absolute;
                top: 20px;
                left: 20px;
                width: 20px;
                height: 20px;
                border-top: 2px solid #ff1414;
                border-left: 2px solid #ff1414;
            "></div>
            <div class="decoration-corner top-right" style="
                position: absolute;
                top: 20px;
                right: 20px;
                width: 20px;
                height: 20px;
                border-top: 2px solid #ff1414;
                border-right: 2px solid #ff1414;
            "></div>
            <div class="decoration-corner bottom-left" style="
                position: absolute;
                bottom: 20px;
                left: 20px;
                width: 20px;
                height: 20px;
                border-bottom: 2px solid #ff1414;
                border-left: 2px solid #ff1414;
            "></div>
            <div class="decoration-corner bottom-right" style="
                position: absolute;
                bottom: 20px;
                right: 20px;
                width: 20px;
                height: 20px;
                border-bottom: 2px solid #ff1414;
                border-right: 2px solid #ff1414;
            "></div>
        </div>

        <style>
            @keyframes rotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 0.5; transform: scale(0.95); }
                50% { opacity: 1; transform: scale(1.05); }
            }
            
            @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(400%); }
            }
            
            @keyframes shine {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            
            .main-container::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 1px;
                background: linear-gradient(90deg, 
                    transparent, 
                    rgba(255, 20, 20, 0.5), 
                    transparent);
            }
        </style>
    `;

    document.documentElement.appendChild(ui);

    // ===== TIMER FUNCTIONS =====
    function updateTimer() {
        const elapsed = Date.now() - startTime;
        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const displaySeconds = seconds % 60;
        
        const timerElement = ui.querySelector('.timer-display');
        if (timerElement) {
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
        }
        
        // Update progress bar
        const progressFill = ui.querySelector('.progress-fill');
        if (progressFill) {
            // Simulate progress up to 85% while waiting
            const progress = Math.min(85, (seconds * 4));
            progressFill.style.width = `${progress}%`;
        }
    }

    function startTimer() {
        timerInterval = setInterval(updateTimer, 1000);
        updateTimer(); // Initial call
    }

    function updateStatus(message, type = 'loading') {
        const statusElement = ui.querySelector('.status-message');
        const statusText = ui.querySelector('.status-text');
        
        if (statusElement) {
            statusElement.textContent = message;
            
            switch(type) {
                case 'success':
                    statusElement.style.color = '#00ff00';
                    statusElement.style.textShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
                    break;
                case 'error':
                    statusElement.style.color = '#ff1414';
                    statusElement.style.textShadow = '0 0 10px rgba(255, 20, 20, 0.5)';
                    break;
                case 'warning':
                    statusElement.style.color = '#ffaa00';
                    statusElement.style.textShadow = '0 0 10px rgba(255, 170, 0, 0.3)';
                    break;
                default:
                    statusElement.style.color = '#ff6666';
                    statusElement.style.textShadow = '0 0 10px rgba(255, 20, 20, 0.3)';
            }
        }
        
        if (statusText) {
            statusText.textContent = message.split(':')[0] || message;
            statusText.style.color = statusElement.style.color;
        }
    }

    function countdownRedirect(seconds, url) {
        const countdownElement = ui.querySelector('.countdown');
        let count = seconds;
        
        const countdownInterval = setInterval(() => {
            if (countdownElement) {
                countdownElement.textContent = count;
                
                // Flash effect on last second
                if (count <= 1) {
                    countdownElement.style.animation = 'pulse 0.5s infinite';
                }
            }
            
            if (count <= 0) {
                clearInterval(countdownInterval);
                
                // Final animation before redirect
                const progressFill = ui.querySelector('.progress-fill');
                if (progressFill) {
                    progressFill.style.width = '100%';
                    progressFill.style.background = 'linear-gradient(90deg, #00ff00, #00cc00)';
                }
                
                setTimeout(() => {
                    location.replace(url);
                }, 300);
            }
            count--;
        }, 1000);
    }

    // Start the timer
    startTimer();

    // ===== N0V4 TEAM API REQUEST =====
    const apiURL = `http://ace-bypass.com/api/bypass?url=${encodeURIComponent(TARGET_URL)}&apikey=${API_KEY}`;

    updateStatus('Initializing N0V4 bypass protocol...');
    
    // Simulate steps for better UX
    setTimeout(() => {
        updateStatus('Analyzing target URL...');
    }, 1000);
    
    setTimeout(() => {
        updateStatus('Connecting to secure API...');
    }, 2000);

    GM_xmlhttpRequest({
        method: "GET",
        url: apiURL,
        timeout: 30000,
        onload(res) {
            try {
                const data = JSON.parse(res.responseText);
                updateStatus('API response received', 'success');
                
                // Complete progress bar
                const progressFill = ui.querySelector('.progress-fill');
                if (progressFill) {
                    progressFill.style.width = '100%';
                    progressFill.style.background = 'linear-gradient(90deg, #00ff00, #00cc00)';
                }
                
                if (data.status === "success" && data.result) {
                    updateStatus('✅ N0V4 bypass successful! Redirecting...', 'success');
                    
                    // Update timer for final display
                    clearInterval(timerInterval);
                    updateTimer();
                    
                    // Start N0V4 countdown
                    countdownRedirect(3, data.result);
                } else {
                    updateStatus('❌ Bypass failed - Invalid response', 'error');
                    clearInterval(timerInterval);
                    
                    // Show error in progress bar
                    if (progressFill) {
                        progressFill.style.background = 'linear-gradient(90deg, #ff1414, #ff3333)';
                    }
                }
            } catch (error) {
                updateStatus('❌ System error - Parsing failed', 'error');
                clearInterval(timerInterval);
            }
        },
        onerror() {
            updateStatus('❌ Network failure - Check connection', 'error');
            clearInterval(timerInterval);
        },
        ontimeout() {
            updateStatus('⏱️ Timeout - Server busy, retrying...', 'warning');
            clearInterval(timerInterval);
        }
    });

    // ===== N0V4 BACKGROUND EFFECTS =====
    function createN0V4Effects() {
        const container = ui.querySelector('.main-container');
        if (!container) return;
        
        // Add floating N0V4 particles
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: ${Math.random() > 0.5 ? 'rgba(255, 20, 20, 0.4)' : 'rgba(255, 100, 100, 0.3)'};
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                pointer-events: none;
                z-index: -1;
                filter: blur(0.5px);
            `;
            container.appendChild(particle);
            
            // Animate with random movement
            const duration = Math.random() * 3000 + 2000;
            const delay = Math.random() * 1000;
            
            particle.animate([
                { transform: 'translate(0, 0)' },
                { transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)` }
            ], {
                duration: duration,
                delay: delay,
                direction: 'alternate',
                iterations: Infinity,
                easing: 'ease-in-out'
            });
        }
        
        // Add N0V4 text glow effect
        const logo = ui.querySelector('.logo h1');
        if (logo) {
            setInterval(() => {
                const intensity = 20 + Math.random() * 15;
                logo.style.textShadow = `0 0 ${intensity}px rgba(255, 20, 20, 0.7)`;
            }, 2000);
        }
    }

    // Initialize effects
    setTimeout(createN0V4Effects, 500);
})();