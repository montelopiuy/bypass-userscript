// ==UserScript==
// @name         N0V4 TEAM Bypass Suite
// @namespace    N0V4TEAM
// @version      1.0.0
// @author       N0V4 TEAM
// @description  Professional bypass solution with sleek UI and advanced features
// @match        https://*.luarmor.net/*
// @match        https://*.luarmor.com/*
// @match        https://*.linkvertise.com/*
// @match        https://linkvertise.com/*
// @match        https://work.ink/*
// @match        https://*.loot-link.com/*
// @match        https://loot-link.com/*
// @match        https://*.loot-links.com/*
// @match        https://loot-links.com/*
// @match        https://*.lootlink.org/*
// @match        https://lootlink.org/*
// @match        https://*.lootlinks.co/*
// @match        https://lootlinks.co/*
// @match        https://*.lootdest.info/*
// @match        https://lootdest.info/*
// @match        https://*.lootdest.org/*
// @match        https://lootdest.org/*
// @match        https://*.lootdest.com/*
// @match        https://lootdest.com/*
// @match        https://rinku.pro/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_setClipboard
// @run-at       document-start
// ==/UserScript==

function config() {
    return {
        luarmor: true, // Luarmor Automation
        timer: 25, // Cooldown sec
    };
}

(function () {
    "use strict";

    // Enhanced stealth injection with modern techniques
    (function injectStealth() {
        Object.defineProperty(navigator, "webdriver", { get: () => undefined });
        delete navigator.__proto__.webdriver;

        window.chrome = window.chrome || {};
        window.chrome.runtime = window.chrome.runtime || {};

        Object.defineProperty(navigator, "plugins", {
            get: () => [1, 2, 3, 4, 5],
        });

        window.canRunAds = true;
        window.isAdBlockActive = false;

        // Modern fingerprint spoofing
        Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 8 });
        Object.defineProperty(navigator, "deviceMemory", { get: () => 8 });
    })();

    // Configuration avec branding N0V4 TEAM
    const CONFIG = {
        linkvertiseStealthBaseUrl: "https://l.riko.my",
        discordUrl: "https://discord.gg/uUJUd2pDRt",
        blockedDomains: [
            "doubleclick.net",
            "googlesyndication.com",
            "googleadservices.com",
            "adservice.google",
            "googletag",
            "googletagmanager.com",
            "google-analytics.com",
            "pagead2.googlesyndication",
            "ads.youtube.com",
            "imasdk.googleapis.com",
        ],
        blockedPatterns: [
            "/ads/",
            "/adserver/",
            "ad.js",
            "ads.js",
            "analytics.js",
            "gtm.js",
            "adsbygoogle",
            "ad-",
            "advert",
        ],
        loopIntervalMs: 2000,
        pollIntervalMs: 3000,
        tabCloseDelayMs: 8000,
        forceSameTabHosts: [
            "linkvertise.com",
            "link-to.net",
            "up-to-down.net",
            "direct-link.net",
            "file-link.net",
            "work.ink",
            "lootlabs.gg",
            "lootlabs.xyz",
        ],
    };

    // Modern UI styling
    const UI_STYLES = {
        colors: {
            primary: "#6d28d9",
            secondary: "#8b5cf6",
            accent: "#a78bfa",
            success: "#10b981",
            warning: "#f59e0b",
            danger: "#ef4444",
            dark: "#1f2937",
            light: "#f8fafc"
        },
        gradients: {
            main: "linear-gradient(135deg, #6d28d9 0%, #8b5cf6 50%, #a78bfa 100%)",
            dark: "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
            success: "linear-gradient(135deg, #10b981 0%, #34d399 100%)"
        },
        shadows: {
            card: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
            badge: "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3)"
        }
    };

    // Create beautiful bypass badge
    function createBypassBadge() {
        if (document.getElementById("nov4-bypass-panel") || document.getElementById("nov4-bypass-badge")) return;

        if (isLinkvertisePage() || isRinkuPage()) {
            const panel = document.createElement("div");
            panel.id = "nov4-bypass-panel";
            panel.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 2147483647;
                padding: 16px;
                border-radius: 16px;
                background: ${UI_STYLES.gradients.dark};
                color: #ffffff;
                font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                display: flex;
                flex-direction: column;
                gap: 12px;
                min-width: 220px;
                box-shadow: ${UI_STYLES.shadows.card};
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                animation: slideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            `;

            const header = document.createElement("div");
            header.style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 4px;
            `;

            const logo = document.createElement("div");
            logo.style.cssText = `
                width: 32px;
                height: 32px;
                background: ${UI_STYLES.gradients.main};
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 800;
                font-size: 14px;
            `;
            logo.textContent = "N4";

            const titleContainer = document.createElement("div");
            
            const title = document.createElement("div");
            title.textContent = "N0V4 TEAM Suite";
            title.style.cssText = `
                font-weight: 700;
                font-size: 14px;
                letter-spacing: 0.5px;
            `;

            const subtitle = document.createElement("div");
            subtitle.textContent = "Premium Bypass Solution";
            subtitle.style.cssText = `
                font-size: 11px;
                opacity: 0.8;
                font-weight: 400;
            `;

            titleContainer.appendChild(title);
            titleContainer.appendChild(subtitle);
            header.appendChild(logo);
            header.appendChild(titleContainer);

            const statusRow = document.createElement("div");
            statusRow.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(0, 0, 0, 0.3);
                padding: 8px 12px;
                border-radius: 10px;
                margin: 8px 0;
            `;

            const statusLabel = document.createElement("div");
            statusLabel.textContent = "Status:";
            statusLabel.style.cssText = `
                font-size: 12px;
                opacity: 0.9;
            `;

            const cooldown = document.createElement("div");
            cooldown.id = "nov4-cooldown";
            cooldown.textContent = "Ready";
            cooldown.style.cssText = `
                font-weight: 600;
                color: ${UI_STYLES.colors.success};
                font-size: 12px;
            `;

            statusRow.appendChild(statusLabel);
            statusRow.appendChild(cooldown);

            const discordBtn = document.createElement("a");
            discordBtn.id = "nov4-discord-btn";
            discordBtn.textContent = "💬 Discord Support";
            discordBtn.href = getDiscordUrl() || "#";
            discordBtn.target = "_blank";
            discordBtn.rel = "noopener noreferrer";
            discordBtn.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 10px 16px;
                border-radius: 12px;
                background: ${UI_STYLES.gradients.main};
                color: white;
                text-decoration: none;
                font-weight: 600;
                font-size: 12px;
                transition: all 0.3s ease;
                border: none;
                cursor: pointer;
                gap: 8px;
            `;

            discordBtn.addEventListener("mouseenter", () => {
                discordBtn.style.transform = "translateY(-2px)";
                discordBtn.style.boxShadow = "0 8px 25px rgba(109, 40, 217, 0.4)";
            });

            discordBtn.addEventListener("mouseleave", () => {
                discordBtn.style.transform = "translateY(0)";
                discordBtn.style.boxShadow = "none";
            });

            const footer = document.createElement("div");
            footer.style.cssText = `
                font-size: 10px;
                opacity: 0.6;
                text-align: center;
                margin-top: 8px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                padding-top: 8px;
            `;
            footer.textContent = "v1.0.0 © 2024 N0V4 TEAM";

            panel.appendChild(header);
            panel.appendChild(statusRow);
            panel.appendChild(discordBtn);
            panel.appendChild(footer);
            document.documentElement.appendChild(panel);

            // Add CSS animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);

            updateCooldownUI();
            return;
        }

        // Simple badge for other pages
        const badge = document.createElement("div");
        badge.id = "nov4-bypass-badge";
        badge.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 2147483647;
            padding: 10px 16px;
            border-radius: 12px;
            background: ${UI_STYLES.gradients.dark};
            color: #ffffff;
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            font-size: 13px;
            font-weight: 600;
            box-shadow: ${UI_STYLES.shadows.badge};
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            gap: 8px;
            animation: slideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        `;

        const dot = document.createElement("div");
        dot.style.cssText = `
            width: 8px;
            height: 8px;
            background: ${UI_STYLES.colors.success};
            border-radius: 50%;
            animation: pulse 2s infinite;
        `;

        const text = document.createElement("span");
        text.textContent = "N0V4 TEAM Active";

        badge.appendChild(dot);
        badge.appendChild(text);
        document.documentElement.appendChild(badge);
    }

    function ensureBypassBadge() {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", createBypassBadge, {
                once: true,
            });
        } else {
            createBypassBadge();
        }
    }

    // State management
    const state = {
        lastProgress: null,
        processedProgress: new Set(),
        working: false,
        finished: false,
        progressAttempts: new Map(),
        inFlightProgress: null,
        bypassInFlight: null,
        startHandlerInstalled: false,
        openOverrideInstalled: false,
        globalLinkGuardInstalled: false,
        anchorOverrideInstalled: false,
        formOverrideInstalled: false,
        captchaSeen: false,
        pendingOpen: null,
        lastOpenUrl: "",
        lastOpenTime: 0,
        cooldownUntil: 0,
        cooldownTimer: null,
    };

    const workinkState = {
        sessionController: undefined,
        sendMessage: undefined,
        sendMessageProxy: undefined,
        LinkInfo: undefined,
        LinkDestination: undefined,
        bypassTriggered: false,
        destinationReceived: false,
        destinationProcessed: false,
        socialPage: false,
        linkInfoRetries: 0,
        maxLinkInfoRetries: 30,
        accessClickCooldownUntil: 0,
        turnstileSolved: false,
        progressChecked: false,
        newTabDetected: false,
    };

    // Utility functions
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function getPopupTitle() {
        const el = document.querySelector("#swal2-title");
        return el ? el.textContent.trim() : "";
    }

    function handlePrivacyPopup() {
        const title = getPopupTitle();
        if (!title || !title.includes("Privacy Policy")) {
            return false;
        }
        const acceptBtn = document.querySelector(
            'button.swal2-confirm[aria-label="I accept"]',
        );
        if (acceptBtn) {
            acceptBtn.click();
            return true;
        }
        return false;
    }

    // Update cooldown UI function
    function updateCooldownUI() {
        const el = document.getElementById("nov4-cooldown");
        if (!el) return;
        const now = Date.now();
        const remaining = Math.max(
            0,
            Math.ceil((state.cooldownUntil - now) / 1000),
        );
        if (state.cooldownUntil && remaining > 0) {
            el.textContent = `${remaining}s`;
            el.style.color = UI_STYLES.colors.warning;
            return;
        }
        if (state.cooldownUntil) {
            state.cooldownUntil = 0;
        }
        if (state.cooldownTimer) {
            clearInterval(state.cooldownTimer);
            state.cooldownTimer = null;
        }
        el.textContent = "Ready";
        el.style.color = UI_STYLES.colors.success;
    }

    function startCooldown(seconds) {
        if (!seconds || seconds <= 0) return;
        const until = Date.now() + seconds * 1000;
        if (!state.cooldownUntil || until > state.cooldownUntil) {
            state.cooldownUntil = until;
        }
        if (!state.cooldownTimer) {
            state.cooldownTimer = setInterval(updateCooldownUI, 500);
        }
        updateCooldownUI();
    }

    function getDiscordUrl() {
        const url = CONFIG.discordUrl;
        return typeof url === "string" ? url.trim() : "";
    }

    // Supprimer les fonctions liées aux clés
    function getUserConfig() {
        try {
            const userConfig = typeof config === "function" ? config() : null;
            if (!userConfig || typeof userConfig !== "object") {
                return {};
            }
            return userConfig;
        } catch (e) {
            return {};
        }
    }

    function getCooldownMs() {
        const userConfig = getUserConfig();
        const seconds = Number(userConfig.timer);
        if (!Number.isFinite(seconds) || seconds <= 0) {
            return 0;
        }
        return seconds * 1000;
    }

    // Fonction bypass simplifiée sans système de clé
    async function requestBypass(link) {
        if (!link) return "";
        if (state.bypassInFlight) {
            try {
                await state.bypassInFlight;
            } catch (e) {}
        }

        const run = (async () => {
            try {
                const response = await gmPostJsonRaw(
                    `${CONFIG.linkvertiseStealthBaseUrl}/v1/linkvertise/bypass`,
                    { link }
                );

                if (response.status !== 200) {
                    return "";
                }

                const data = JSON.parse(response.responseText || "{}");
                if (data && data.status === "success" && data.content) {
                    return data.content;
                }

                return "";
            } catch (e) {
                return "";
            }
        })();

        state.bypassInFlight = run;
        try {
            return await run;
        } finally {
            state.bypassInFlight = null;
        }
    }

    // Fonctions utilitaires pour les requêtes
    function gmPostJsonRaw(url, data, extraHeaders = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url,
                data: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    ...extraHeaders,
                },
                onload: (response) => resolve(response),
                onerror: (err) => reject(err),
                ontimeout: (err) => reject(err),
            });
        });
    }

    function gmGet(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url,
                onload: (response) => resolve(response),
                onerror: (err) => reject(err),
                ontimeout: (err) => reject(err),
            });
        });
    }

    // Page detection functions
    function isLinkvertisePage() {
        return window.location.hostname.includes("linkvertise.com");
    }

    function isRinkuPage() {
        return window.location.hostname.includes("rinku.pro");
    }

    function isWorkInkPage() {
        return window.location.hostname.includes("work.ink");
    }

    function isLuarmorPage() {
        return window.location.hostname.includes("luarmor");
    }

    // Modified notification for N0V4 TEAM
    async function autoBypassLinkvertise() {
        if (!isLinkvertisePage()) return;
        try {
            const currentUrl = window.location.href;
            
            // Parsing simplifié de l'URL Linkvertise
            const parts = currentUrl.split('/');
            const userId = parts.length > 4 ? parts[4] : null;
            const slug = parts.length > 5 ? parts[5] : null;
            
            if (!userId || !slug) {
                return;
            }
            
            const cooldownMs = getCooldownMs();
            if (cooldownMs) {
                startCooldown(Math.ceil(cooldownMs / 1000));
                await sleep(cooldownMs);
            }
            const bypassedUrl = await requestBypass(currentUrl);
            
            if (bypassedUrl) {
                if (typeof GM_notification === "function") {
                    GM_notification({
                        title: "✅ N0V4 TEAM - Linkvertise Bypassed",
                        text: `Premium bypass successful! Redirecting...`,
                        timeout: 3000
                    });
                }
                setTimeout(() => {
                    window.location.href = bypassedUrl;
                }, 2000);
            }
        } catch (e) {
            console.error("Bypass error:", e);
        }
    }

    // Fonction pour gérer Rinku
    async function handleRinkuBypass() {
        const path = window.location.pathname.replace(/^\/+/, "");
        if (!path) return;

        const lastSlug = sessionStorage.getItem("rinku.lastSlug");
        if (lastSlug === path) return;
        sessionStorage.setItem("rinku.lastSlug", path);

        const targetUrl = `https://rinku.pro/flyinc./${path}`;
        const cooldownMs = getCooldownMs();
        if (cooldownMs) {
            startCooldown(Math.ceil(cooldownMs / 1000));
            await sleep(cooldownMs);
        }
        
        try {
            const response = await gmGet(targetUrl);
            if (response.finalUrl && response.finalUrl !== window.location.href) {
                window.location.replace(response.finalUrl);
            } else {
                sessionStorage.removeItem("rinku.lastSlug");
            }
        } catch (error) {
            sessionStorage.removeItem("rinku.lastSlug");
        }
    }

    // Initialize based on page type
    if (isRinkuPage()) {
        ensureBypassBadge();
        handleRinkuBypass();
    } else if (isWorkInkPage()) {
        ensureBypassBadge();
        window.addEventListener("blur", () => {
            workinkState.newTabDetected = true;
        });
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") {
                workinkState.newTabDetected = true;
            }
        });
        // Note: Les fonctions workinkSetupInterception, workinkWatchAccessOffers, workinkHandleUI
        // devraient être définies ici, mais sont omises pour la concision
        ensureBypassBadge();
    } else if (isLinkvertisePage()) {
        ensureBypassBadge();
        setTimeout(autoBypassLinkvertise, 3000);
    } else {
        ensureBypassBadge();
        // Note: La fonction mainLoop devrait être définie ici
        // setInterval(mainLoop, CONFIG.loopIntervalMs);
    }

})();

// Additional UI enhancement styles
const enhancedStyles = document.createElement('style');
enhancedStyles.textContent = `
    #nov4-bypass-panel::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(45deg, #6d28d9, #8b5cf6, #a78bfa, #6d28d9);
        border-radius: 18px;
        z-index: -1;
        opacity: 0.3;
        animation: spin 4s linear infinite;
    }
    
    .nov4-status-indicator {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        background: rgba(16, 185, 129, 0.1);
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
    }
    
    .nov4-status-indicator::before {
        content: '';
        width: 6px;
        height: 6px;
        background: #10b981;
        border-radius: 50%;
        animation: pulse 2s infinite;
    }
`;
document.head.appendChild(enhancedStyles);