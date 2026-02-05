// ==UserScript==
// @name         Nytralis - luarmor bypass
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Bypass luarmor
// @author       nytralis
// @match        *://*.linkvertise.com/*
// @match        *://linkvertise.com/*
// @match        *://*.work.ink/*
// @match        *://work.ink/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // API Configuration
    const API_BASE_URL = 'https://n0v4-api.onrender.com/bypass?url=';
    const CURRENT_URL = encodeURIComponent(window.location.href);
    const API_TIMEOUT = 200000; // 200 seconds

    // Create elegant interface
    GM_addStyle(`
        #nytralis-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%);
            z-index: 999999;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            color: #ffffff;
            text-align: center;
            padding: 40px;
            box-sizing: border-box;
        }
        
        #nytralis-container {
            max-width: 500px;
            width: 100%;
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 40px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        
        #nytralis-logo {
            font-size: 3.2em;
            font-weight: 800;
            margin-bottom: 30px;
            letter-spacing: 3px;
            background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            position: relative;
        }
        
        #nytralis-logo::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 35%;
            width: 30%;
            height: 2px;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
        }
        
        #nytralis-status {
            font-size: 1.2em;
            margin-bottom: 40px;
            line-height: 1.8;
            color: #e0e0e0;
            font-weight: 400;
            min-height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .nytralis-loader {
            width: 60px;
            height: 60px;
            margin: 0 auto 30px;
            position: relative;
        }
        
        .nytralis-loader-inner {
            width: 100%;
            height: 100%;
            border: 3px solid transparent;
            border-top: 3px solid rgba(255, 255, 255, 0.3);
            border-right: 3px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            animation: spin 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .nytralis-success {
            color: #4ade80;
            font-weight: 600;
        }
        
        .nytralis-error {
            color: #ff6b6b;
            font-weight: 500;
        }
        
        #nytralis-error-box {
            background: rgba(255, 107, 107, 0.1);
            border: 1px solid rgba(255, 107, 107, 0.2);
            border-radius: 10px;
            padding: 20px;
            margin-top: 25px;
            color: #ff9b9b;
            font-size: 0.95em;
            line-height: 1.6;
        }
        
        #nytralis-retry-btn {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
            padding: 14px 40px;
            font-size: 1em;
            border-radius: 10px;
            cursor: pointer;
            margin-top: 30px;
            font-weight: 600;
            transition: all 0.3s ease;
            letter-spacing: 0.5px;
            width: 100%;
            backdrop-filter: blur(5px);
        }
        
        #nytralis-retry-btn:hover {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%);
            border-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        #nytralis-progress {
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 2px;
            margin: 30px 0 20px;
            overflow: hidden;
            display: none;
        }
        
        #nytralis-progress-bar {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.8));
            border-radius: 2px;
            transition: width 0.5s ease;
        }
        
        #nytralis-timer {
            font-size: 0.9em;
            color: #888888;
            font-family: 'SF Mono', Monaco, 'Courier New', monospace;
            margin-top: 15px;
        }
        
        .nytralis-success-icon {
            font-size: 3em;
            margin: 20px 0;
            color: #4ade80;
        }
        
        .nytralis-redirecting {
            color: #a0a0a0;
            font-size: 0.9em;
            margin-top: 20px;
            font-style: italic;
        }
    `);

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'nytralis-overlay';
    overlay.innerHTML = `
        <div id="nytralis-container">
            <div id="nytralis-logo">NYTRALIS</div>
            <div class="nytralis-loader">
                <div class="nytralis-loader-inner"></div>
            </div>
            <div id="nytralis-status">Initializing bypass system...</div>
            <div id="nytralis-progress">
                <div id="nytralis-progress-bar"></div>
            </div>
            <div id="nytralis-timer"></div>
        </div>
    `;
    
    document.body.appendChild(overlay);

    // Variables for timing
    let apiStartTime;
    let progressInterval;

    // Function to start progress timer
    function startProgressTimer() {
        apiStartTime = Date.now();
        document.getElementById('nytralis-progress').style.display = 'block';
        
        progressInterval = setInterval(() => {
            const elapsed = Date.now() - apiStartTime;
            const seconds = Math.floor(elapsed / 1000);
            const progress = Math.min(100, (elapsed / API_TIMEOUT) * 100);
            
            document.getElementById('nytralis-progress-bar').style.width = `${progress}%`;
            document.getElementById('nytralis-timer').textContent = `Request time: ${seconds}s`;
            
            if (seconds >= API_TIMEOUT/1000) {
                clearInterval(progressInterval);
            }
        }, 1000);
    }

    // Function to stop progress timer
    function stopProgressTimer() {
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
        document.getElementById('nytralis-progress').style.display = 'none';
        document.getElementById('nytralis-timer').textContent = '';
    }

    // Function to update status
    function updateStatus(message, isSuccess = false, isError = false) {
        const statusEl = document.getElementById('nytralis-status');
        
        if (isSuccess) {
            statusEl.innerHTML = `<span class="nytralis-success">${message}</span>`;
            // Add success icon
            const successIcon = document.createElement('div');
            successIcon.className = 'nytralis-success-icon';
            successIcon.innerHTML = '✓';
            statusEl.parentNode.insertBefore(successIcon, statusEl.nextSibling);
        } else if (isError) {
            statusEl.innerHTML = `<span class="nytralis-error">${message}</span>`;
        } else {
            statusEl.innerHTML = message;
        }
    }

    // Function to show success and redirect
    function showSuccessAndRedirect(resultUrl) {
        updateStatus('Bypass successful!', true);
        
        // Add redirecting message
        const redirectMsg = document.createElement('div');
        redirectMsg.className = 'nytralis-redirecting';
        redirectMsg.textContent = 'Redirecting to content...';
        document.getElementById('nytralis-container').appendChild(redirectMsg);
        
        // Redirect immediately
        setTimeout(() => {
            window.location.href = resultUrl;
        }, 800);
    }

    // Function to show error
    function showError(message, canRetry = true) {
        stopProgressTimer();
        
        updateStatus('An error occurred', false, true);
        
        // Remove existing error box and retry button
        const oldError = document.getElementById('nytralis-error-box');
        if (oldError) oldError.remove();
        
        const oldBtn = document.getElementById('nytralis-retry-btn');
        if (oldBtn) oldBtn.remove();
        
        // Create error box
        const errorBox = document.createElement('div');
        errorBox.id = 'nytralis-error-box';
        errorBox.textContent = message;
        document.getElementById('nytralis-container').appendChild(errorBox);
        
        // Add retry button if applicable
        if (canRetry) {
            const retryBtn = document.createElement('button');
            retryBtn.id = 'nytralis-retry-btn';
            retryBtn.textContent = 'Retry Bypass';
            retryBtn.addEventListener('click', callBypassAPI);
            document.getElementById('nytralis-container').appendChild(retryBtn);
        }
    }

    // Function to call bypass API
    function callBypassAPI() {
        updateStatus('Contacting bypass service...');
        startProgressTimer();
        
        // Remove previous error elements
        const errorEl = document.getElementById('nytralis-error-box');
        if (errorEl) errorEl.remove();
        
        const retryBtn = document.getElementById('nytralis-retry-btn');
        if (retryBtn) retryBtn.remove();
        
        // Remove success icon if exists
        const successIcon = document.querySelector('.nytralis-success-icon');
        if (successIcon) successIcon.remove();
        
        // Remove redirecting message if exists
        const redirectMsg = document.querySelector('.nytralis-redirecting');
        if (redirectMsg) redirectMsg.remove();
        
        GM_xmlhttpRequest({
            method: 'GET',
            url: API_BASE_URL + CURRENT_URL,
            timeout: API_TIMEOUT,
            onload: function(response) {
                stopProgressTimer();
                try {
                    const data = JSON.parse(response.responseText);
                    
                    if (response.status === 200 && data.success) {
                        showSuccessAndRedirect(data.result);
                        
                    } else if (data.error) {
                        // Handle specific errors
                        if (data.error.includes('Rate limit exceeded')) {
                            const waitMatch = data.error.match(/wait (\d+\.?\d*) seconds/);
                            const waitTime = waitMatch ? parseFloat(waitMatch[1]) : 10;
                            
                            showError(`Rate limit exceeded. Please wait ${waitTime} seconds before retrying.`, true);
                            
                            // Auto-retry after delay
                            setTimeout(() => {
                                updateStatus('Retrying after cooldown...');
                                callBypassAPI();
                            }, (waitTime + 1) * 1000);
                            
                        } else if (data.error.includes('All engines failed')) {
                            showError('All bypass engines failed after multiple retries.', true);
                        } else {
                            showError(`API Error: ${data.error}`, true);
                        }
                    } else {
                        showError('Unexpected API response format', true);
                    }
                    
                } catch (e) {
                    showError('Failed to parse API response: ' + e.message, true);
                }
            },
            onerror: function(error) {
                stopProgressTimer();
                showError('Failed to connect to API. Check your internet connection.', true);
            },
            ontimeout: function() {
                stopProgressTimer();
                showError(`API request timed out after ${API_TIMEOUT/1000} seconds. The API might be experiencing high load.`, true);
            }
        });
    }

    // Start the process
    updateStatus('Detecting linkvertise/work.ink page...');
    
    // Wait for page to fully load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callBypassAPI);
    } else {
        // Page already loaded
        setTimeout(callBypassAPI, 1000);
    }

})();
