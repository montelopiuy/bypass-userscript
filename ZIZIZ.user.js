// ==UserScript==
// @name         n0v4 Bypass Assistant
// @namespace    https://n0v4.team/
// @version      2.5
// @description  Bypass multiple link shorteners and unlockers automatically
// @author       Nytrális
// @match        *://*.1pt.co/*
// @match        *://*.adf.ly/*
// @match        *://*.adfoc.us/*
// @match        *://auth.platoboost/*
// @match        *://auth.platorelay.com/*
// @match        *://*.bit.do/*
// @match        *://*.bit.ly/*
// @match        *://*.blink.link/*
// @match        *://*.blox-script.com/*
// @match        *://*.bly.to/*
// @match        *://*.boost.ink/*
// @match        *://*.bst.gg/*
// @match        *://*.bstshrt.com/*
// @match        *://*.cleanuri.org/*
// @match        *://*.cl.gy/*
// @match        *://*.codex.lol/*
// @match        *://mobile.codex.lol/*
// @match        *://*.cuty.io/*
// @match        *://*.cuttlinks.com/*
// @match        *://*.dub.co/*
// @match        *://*.gem-pixel.com/*
// @match        *://*.getpolsec.com/*
// @match        *://*.getkey.xyz/*
// @match        *://*.goo.gl/*
// @match        *://*.is.gd/*
// @match        *://*.joturl.com/*
// @match        *://*.krnl.cat/*
// @match        *://*.tpi.li/*
// @match        *://key.valex.io/*
// @match        *://*.keyguardian.net/*
// @match        *://*.keyguardian.org/*
// @match        *://*.keyrblx.com/*
// @match        *://*.ldnesfs.com/*
// @match        *://*.link-hub.net/*
// @match        *://*.link-center.net/*
// @match        *://*.link-target.net/*
// @match        *://*.link-to.net/*
// @match        *://*.link4m.com/*
// @match        *://*.link4sub.com/*
// @match        *://*.linkbucks.com/*
// @match        *://*.link-unlock.com/*
// @match        *://*.linkunlocker.com/*
// @match        *://*.linkvertise.com/*
// @match        *://*.linkify.ru/*
// @match        *://*.links-loot.com/*
// @match        *://*.linksloot.net/*
// @match        *://*.linkshrink.com/*
// @match        *://*.lockr.xyz/*
// @match        *://*.loot-link.com/*
// @match        *://*.loot-links.com/*
// @match        *://*.lootlink.org/*
// @match        *://*.lootlinks.co/*
// @match        *://*.lootdest.info/*
// @match        *://*.lootdest.org/*
// @match        *://*.lootdest.com/*
// @match        *://*.mboost.me/*
// @match        *://*.mediafire.com/*
// @match        *://*.nimblelinks.com/*
// @match        *://*.nicuse.com/*
// @match        *://*.ouo.io/*
// @match        *://*.overdrivehub.com/*
// @match        *://*.paster.so/*
// @match        *://*.pastebin.com/*
// @match        *://*.pastes.io/*
// @match        *://*.pandadevelopment.net/*
// @match        *://*.qrco.de/*
// @match        *://*.quartyz.com/*
// @match        *://*.rebrand.ly/*
// @match        *://*.rekonise.com/*
// @match        *://*.replug.io/*
// @match        *://*.rentry.org/*
// @match        *://*.rinku.pro/*
// @match        *://*.rkns.link/*
// @match        *://*.shorte.st/*
// @match        *://*.short.cm/*
// @match        *://*.shorter.me/*
// @match        *://*.show.co/*
// @match        *://*.simpleurl.co/*
// @match        *://*.snipit.link/*
// @match        *://*.sniply.io/*
// @match        *://*.socialwolvez.com/*
// @match        *://*.sor.bz/*
// @match        *://*.sub2get.com/*
// @match        *://*.sub2tech.net/*
// @match        *://*.sub2unlock.com/*
// @match        *://*.sub4unlock.com/*
// @match        *://*.sub4unlock.io/*
// @match        *://*.subfinal.com/*
// @match        *://*.t.co/*
// @match        *://*.t.ly/*
// @match        *://*.tiny.cc/*
// @match        *://*.tinylink.onl/*
// @match        *://*.tinyurl.com/*
// @match        *://*.v.gd/*
// @match        *://*.work.ink/*
// @match        *://*.ytsubme.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-start
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        apis: [
            'https://nigga-jet.vercel.app/bypass?url=',
            'https://private-api-beta.vercel.app/api/Bypass?url=',
            'http://ace-bypass.com/api/bypass?url=URL&apikey=FREE_bJ2Ts-4u1pTAHavW7gy4kqIjSpGESr0H8tqHgDW-8pI',
            'https://rtao.lol/free/bypass?url='
        ],
        errorKeywords: [
            'already', 'being', 'failed', 'error', 'limit', 'wait', 'try again', 
            'rate limit', 'too many', 'busy', 'queue', 'processing', 'unsupported',
            'not supported', 'unsupported_url', 'invalid', 'cannot', 'unable',
            'not found', 'not available', 'denied', 'rejected', 'blocked'
        ]
    };

    const isSupported = () => {
        const host = window.location.hostname.replace('www.', '');
        const services = [
            "1pt.co", "adf.ly", "adfoc.us", "auth.platoboost", "auth.platorelay.com",
            "bit.do", "bit.ly", "blink.link", "blox-script.com", "bly.to", "boost.ink",
            "bst.gg", "bstshrt.com", "cleanuri.org", "cl.gy", "codex.lol",
            "mobile.codex.lol", "cuty.io", "cuttlinks.com", "dub.co", "gem-pixel.com",
            "getpolsec.com", "getkey.xyz", "goo.gl", "is.gd", "joturl.com", "krnl.cat",
            "tpi.li", "key.valex.io", "keyguardian.net", "keyguardian.org", "keyrblx.com",
            "ldnesfs.com", "link-hub.net", "link-center.net", "link-target.net",
            "link-to.net", "link4m.com", "link4sub.com", "linkbucks.com",
            "link-unlock.com", "linkunlocker.com", "linkvertise.com", "linkify.ru",
            "links-loot.com", "linksloot.net", "linkshrink.com", "lockr.xyz",
            "loot-link.com", "loot-links.com", "lootlink.org", "lootlinks.co",
            "lootdest.info", "lootdest.org", "lootdest.com", "mboost.me",
            "mediafire.com", "nimblelinks.com", "nicuse.com", "ouo.io",
            "overdrivehub.com", "paster.so", "pastebin.com", "pastes.io",
            "pandadevelopment.net", "qrco.de", "quartyz.com", "rebrand.ly",
            "rekonise.com", "replug.io", "rentry.org", "rinku.pro", "rkns.link",
            "shorte.st", "short.cm", "shorter.me", "show.co", "simpleurl.co",
            "snipit.link", "sniply.io", "socialwolvez.com", "sor.bz", "sub2get.com",
            "sub2tech.net", "sub2unlock.com", "sub4unlock.com", "sub4unlock.io",
            "subfinal.com", "t.co", "t.ly", "tiny.cc", "tinylink.onl", "tinyurl.com",
            "v.gd", "work.ink", "ytsubme.com"
        ];
        return services.some(s => host === s || host.endsWith('.' + s));
    };

    if (!isSupported()) return;

    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes n0v4-fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes n0v4-shimmer{0%{background-position:-1000px 0}100%{background-position:1000px 0}}
        @keyframes n0v4-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes n0v4-pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        @keyframes n0v4-slideUp{from{transform:translateY(10px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes n0v4-glow{0%,100%{box-shadow:0 0 20px rgba(239,68,68,0.3)}50%{box-shadow:0 0 40px rgba(239,68,68,0.6)}}
        .n0v4-container *{box-sizing:border-box;margin:0;padding:0}
        
        .n0v4-close-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: rgba(239,68,68,0.1);
            border: 1px solid rgba(239,68,68,0.3);
            border-radius: 50%;
            color: rgba(255,255,255,0.7);
            font-size: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 10000;
        }
        
        .n0v4-close-btn:hover {
            background: rgba(239,68,68,0.2);
            color: white;
            transform: rotate(90deg);
            box-shadow: 0 0 20px rgba(239,68,68,0.3);
        }
        
        .n0v4-api-status {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(0,0,0,0.3);
            border-radius: 10px;
            padding: 8px 12px;
            margin-bottom: 8px;
            font-size: 12px;
            transition: all 0.3s ease;
        }
        
        .n0v4-api-status-success {
            color: #10b981;
            font-weight: 600;
        }
        
        .n0v4-api-status-error {
            color: #ef4444;
            font-weight: 600;
        }
        
        .n0v4-api-status-pending {
            color: #f59e0b;
            font-weight: 600;
        }
        
        .n0v4-api-status-skipped {
            color: #6b7280;
            font-weight: 600;
        }
        
        .n0v4-api-status-warning {
            color: #f59e0b;
            font-weight: 600;
        }
        
        .n0v4-api-status-cancelled {
            color: #6b7280;
            font-weight: 600;
            text-decoration: line-through;
        }
    `;

    const createUI = () => {
        GM_addStyle(styles);

        const ui = document.createElement('div');
        ui.className = 'n0v4-container';
        ui.innerHTML = `
            <div style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:linear-gradient(135deg,#0a0a0a 0%,#1a1a1a 50%,#0a0a0a 100%);z-index:2147483647;display:flex;align-items:center;justify-content:center;font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;padding:10px;">
                <div style="background:linear-gradient(145deg,#1f1f1f,#0f0f0f);border:1px solid rgba(239,68,68,0.4);border-radius:24px;box-shadow:0 0 80px rgba(239,68,68,0.2),0 30px 80px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.1);padding:clamp(24px,4vw,36px);max-width:min(800px,95vw);width:100%;position:relative;overflow:hidden;animation:n0v4-fadeIn 0.6s cubic-bezier(0.34,1.56,0.64,1);">
                    
                    <button class="n0v4-close-btn" title="Close">×</button>
                    
                    <div style="position:absolute;top:-100%;left:-100%;width:300%;height:300%;background:radial-gradient(circle,rgba(239,68,68,0.15) 0%,transparent 60%);pointer-events:none;animation:n0v4-pulse 4s ease-in-out infinite"></div>
                    
                    <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#ef4444,transparent)"></div>
                    
                    <div style="text-align:center;margin-bottom:clamp(16px,3vw,24px);position:relative">
                        <div style="display:inline-flex;align-items:center;justify-content:center;width:clamp(56px,10vw,72px);height:clamp(56px,10vw,72px);background:linear-gradient(135deg,#ef4444 0%,#dc2626 50%,#b91c1c 100%);border-radius:20px;margin-bottom:16px;box-shadow:0 10px 30px rgba(239,68,68,0.5),inset 0 2px 0 rgba(255,255,255,0.25),inset 0 -2px 0 rgba(0,0,0,0.25);position:relative;animation:n0v4-glow 3s ease-in-out infinite">
                            <div style="position:absolute;inset:3px;background:linear-gradient(135deg,rgba(255,255,255,0.1),transparent);border-radius:17px;pointer-events:none"></div>
                            <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                                <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                                <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                            </svg>
                        </div>
                        
                        <h1 style="margin:0 0 8px 0;font-size:clamp(22px,5vw,32px);font-weight:800;background:linear-gradient(135deg,#ffffff 0%,#ef4444 50%,#ffffff 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:-0.5px">n0v4 Bypass</h1>
                        
                        <div style="display:inline-flex;align-items:center;gap:6px;padding:5px 14px;background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);border-radius:18px;margin-bottom:6px">
                            <div style="width:6px;height:6px;background:#ef4444;border-radius:50%;box-shadow:0 0 8px #ef4444;animation:n0v4-pulse 2s ease-in-out infinite"></div>
                            <span style="font-size:clamp(10px,2.2vw,12px);color:rgba(255,255,255,0.9);font-weight:600;letter-spacing:0.3px">AUTO BYPASS</span>
                        </div>
                        
                        <p style="margin:0;font-size:clamp(10px,2.2vw,12px);color:rgba(255,255,255,0.4);font-weight:500">Testing ${config.apis.length} engines in parallel</p>
                    </div>
                    
                    <div style="background:linear-gradient(135deg,rgba(239,68,68,0.12) 0%,rgba(185,28,28,0.08) 100%);border:1px solid rgba(239,68,68,0.25);border-radius:18px;padding:clamp(16px,3vw,20px);margin-bottom:clamp(16px,3vw,20px);position:relative;overflow:hidden">
                        <div style="position:absolute;top:0;left:0;right:0;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.03),transparent);animation:n0v4-shimmer 3s linear infinite;pointer-events:none"></div>
                        
                        <div id="n0v4-status" style="min-height:clamp(60px,12vw,80px);display:flex;align-items:center;justify-content:center;text-align:center;position:relative">
                            <div id="n0v4-loader" style="width:clamp(18px,4vw,24px);height:clamp(18px,4vw,24px);border:3px solid rgba(239,68,68,0.2);border-top-color:#ef4444;border-radius:50%;animation:n0v4-spin 0.7s linear infinite;margin-right:14px;box-shadow:0 0 10px rgba(239,68,68,0.3)"></div>
                            <div style="flex:1">
                                <div id="n0v4-status-text" style="color:rgba(255,255,255,0.95);font-size:clamp(14px,3vw,16px);font-weight:600;line-height:1.5;animation:n0v4-slideUp 0.5s ease-out">Initializing bypass...</div>
                                <div id="n0v4-status-sub" style="color:rgba(255,255,255,0.4);font-size:clamp(11px,2.5vw,12px);font-weight:500;margin-top:4px;display:none"></div>
                                <div id="n0v4-api-count" style="color:rgba(255,255,255,0.3);font-size:clamp(10px,2vw,11px);font-weight:500;margin-top:2px;display:block">
                                    <span id="n0v4-success-count">0</span> successful • <span id="n0v4-error-count">0</span> errors • <span id="n0v4-pending-count">${config.apis.length}</span> pending
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="n0v4-api-status-container" style="margin-bottom:clamp(16px,3vw,20px);max-height:150px;overflow-y:auto;padding-right:5px;display:none">
                        <!-- API status will be inserted here -->
                    </div>
                    
                    <div style="width:100%;height:5px;background:rgba(255,255,255,0.06);border-radius:10px;overflow:hidden;margin-bottom:clamp(16px,3vw,20px);box-shadow:inset 0 2px 4px rgba(0,0,0,0.3)">
                        <div id="n0v4-progress" style="width:0%;height:100%;background:linear-gradient(90deg,#ef4444 0%,#dc2626 50%,#ef4444 100%);background-size:200% 100%;animation:n0v4-shimmer 2s linear infinite;border-radius:10px;transition:width 0.4s cubic-bezier(0.34,1.56,0.64,1);box-shadow:0 0 10px rgba(239,68,68,0.6)"></div>
                    </div>
                    
                    <div id="n0v4-timer" style="text-align:center;color:rgba(255,255,255,0.5);font-size:clamp(11px,2.5vw,12px);margin-bottom:10px;display:none">
                        <span id="n0v4-time-remaining">300</span> seconds remaining
                    </div>
                    
                    <div id="n0v4-result" style="background:rgba(10,10,10,0.8);border:1px solid rgba(239,68,68,0.3);border-radius:14px;padding:clamp(14px,2.5vw,18px);font-size:clamp(12px,2.5vw,14px);color:rgba(255,255,255,0.8);word-break:break-all;display:none;line-height:1.6;margin-bottom:clamp(16px,3vw,20px);animation:n0v4-slideUp 0.4s ease-out;max-height:200px;overflow-y:auto;">
                        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
                            <div style="width:8px;height:8px;background:#ef4444;border-radius:50%;box-shadow:0 0 10px #ef4444"></div>
                            <strong style="color:#ef4444;font-size:clamp(13px,2.8vw,15px)">BYPASS RESULT</strong>
                        </div>
                        <div id="n0v4-result-content"></div>
                    </div>
                    
                    <div id="n0v4-buttons" style="display:none;gap:10px;">
                        <button id="n0v4-retry-btn" style="flex:1;padding:clamp(14px,2.5vw,16px);background:linear-gradient(135deg,#3b82f6 0%,#1d4ed8 50%,#1e40af 100%);border:none;border-radius:14px;color:white;font-weight:700;font-size:clamp(14px,2.8vw,15px);cursor:pointer;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);box-shadow:0 6px 20px rgba(59,130,246,0.4);font-family:'Inter',sans-serif">
                            🔄 RETRY
                        </button>
                        <button id="n0v4-copy-btn" style="flex:1;padding:clamp(14px,2.5vw,16px);background:linear-gradient(135deg,#10b981 0%,#059669 50%,#047857 100%);border:none;border-radius:14px;color:white;font-weight:700;font-size:clamp(14px,2.8vw,15px);cursor:pointer;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);box-shadow:0 6px 20px rgba(16,185,129,0.4);font-family:'Inter',sans-serif">
                            📋 COPY
                        </button>
                    </div>
                    
                    <div style="text-align:center;margin-top:clamp(16px,3vw,24px);padding-top:clamp(14px,3vw,20px);border-top:1px solid rgba(255,255,255,0.08)">
                        <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:8px">
                            <div style="width:20px;height:1px;background:linear-gradient(90deg,transparent,rgba(239,68,68,0.5))"></div>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(239,68,68,0.6)" stroke-width="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                                <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                            </svg>
                            <div style="width:20px;height:1px;background:linear-gradient(90deg,rgba(239,68,68,0.5),transparent)"></div>
                        </div>
                        <p style="margin:0;font-size:clamp(10px,2vw,11px);color:rgba(255,255,255,0.3);font-weight:600">POWERED BY N0V4 TEAM</p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(ui);

        // Close button functionality
        const closeBtn = ui.querySelector('.n0v4-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                ui.remove();
            });
        }

        // Button hover effects
        const retryBtn = document.getElementById('n0v4-retry-btn');
        const copyBtn = document.getElementById('n0v4-copy-btn');
        
        if (retryBtn) {
            retryBtn.addEventListener('mouseover', () => {
                retryBtn.style.transform = 'translateY(-3px) scale(1.02)';
                retryBtn.style.boxShadow = '0 8px 25px rgba(59,130,246,0.5)';
            });
            retryBtn.addEventListener('mouseout', () => {
                retryBtn.style.transform = 'translateY(0) scale(1)';
                retryBtn.style.boxShadow = '0 6px 20px rgba(59,130,246,0.4)';
            });
        }

        if (copyBtn) {
            copyBtn.addEventListener('mouseover', () => {
                copyBtn.style.transform = 'translateY(-3px) scale(1.02)';
                copyBtn.style.boxShadow = '0 8px 25px rgba(16,185,129,0.5)';
            });
            copyBtn.addEventListener('mouseout', () => {
                copyBtn.style.transform = 'translateY(0) scale(1)';
                copyBtn.style.boxShadow = '0 6px 20px rgba(16,185,129,0.4)';
            });
        }
    };

    const updateProgress = (percent) => {
        const bar = document.getElementById('n0v4-progress');
        if (bar) bar.style.width = percent + '%';
    };

    const updateApiCounters = (successCount, errorCount, pendingCount) => {
        const successEl = document.getElementById('n0v4-success-count');
        const errorEl = document.getElementById('n0v4-error-count');
        const pendingEl = document.getElementById('n0v4-pending-count');
        
        if (successEl) successEl.textContent = successCount;
        if (errorEl) errorEl.textContent = errorCount;
        if (pendingEl) pendingEl.textContent = pendingCount;
    };

    const addApiStatus = (engineName, status, message = '') => {
        const container = document.getElementById('n0v4-api-status-container');
        if (!container) return;
        
        container.style.display = 'block';
        
        const statusEl = document.createElement('div');
        statusEl.className = 'n0v4-api-status';
        
        let statusClass = '';
        let statusText = '';
        
        switch(status) {
            case 'success':
                statusClass = 'n0v4-api-status-success';
                statusText = '✓';
                break;
            case 'error':
                statusClass = 'n0v4-api-status-error';
                statusText = '✗';
                break;
            case 'warning':
                statusClass = 'n0v4-api-status-warning';
                statusText = '⚠';
                break;
            case 'pending':
                statusClass = 'n0v4-api-status-pending';
                statusText = '⟳';
                break;
            case 'cancelled':
                statusClass = 'n0v4-api-status-cancelled';
                statusText = '↷';
                break;
        }
        
        statusEl.innerHTML = `
            <span style="color:rgba(255,255,255,0.7)">${engineName}</span>
            <div>
                <span class="${statusClass}" style="margin-right:8px">${statusText} ${status.toUpperCase()}</span>
                ${message ? `<span style="color:rgba(255,255,255,0.5);font-size:11px">${message}</span>` : ''}
            </div>
        `;
        
        // Add at the top of the container
        container.insertBefore(statusEl, container.firstChild);
    };

    const updateStatus = (msg, subMsg, showButtons, hideLoader) => {
        const text = document.getElementById('n0v4-status-text');
        const subText = document.getElementById('n0v4-status-sub');
        const loader = document.getElementById('n0v4-loader');
        const buttons = document.getElementById('n0v4-buttons');
        
        if (text) {
            text.innerHTML = msg;
            text.style.animation = 'none';
            setTimeout(() => text.style.animation = 'n0v4-slideUp 0.5s ease-out', 10);
        }
        if (subText) {
            if (subMsg) {
                subText.innerHTML = subMsg;
                subText.style.display = 'block';
            } else {
                subText.style.display = 'none';
            }
        }
        if (loader) loader.style.display = hideLoader ? 'none' : 'block';
        if (buttons) buttons.style.display = showButtons ? 'flex' : 'none';
    };

    const showResult = (result) => {
        const div = document.getElementById('n0v4-result');
        const content = document.getElementById('n0v4-result-content');
        const buttons = document.getElementById('n0v4-buttons');
        const copyBtn = document.getElementById('n0v4-copy-btn');
        
        if (div && content) {
            div.style.display = 'block';
            content.textContent = result;
        }
        
        if (buttons) {
            buttons.style.display = 'flex';
        }
        
        if (copyBtn) {
            copyBtn.onclick = () => {
                GM_setClipboard(result);
                copyBtn.innerHTML = '✓ COPIED';
                copyBtn.style.background = 'linear-gradient(135deg,#059669 0%,#047857 50%,#065f46 100%)';
                setTimeout(() => {
                    copyBtn.innerHTML = '📋 COPY';
                    copyBtn.style.background = 'linear-gradient(135deg,#10b981 0%,#059669 50%,#047857 100%)';
                }, 2000);
            };
        }
    };

    const showRetryButton = () => {
        const retryBtn = document.getElementById('n0v4-retry-btn');
        const buttons = document.getElementById('n0v4-buttons');
        
        if (retryBtn && buttons) {
            buttons.style.display = 'flex';
            retryBtn.onclick = () => {
                buttons.style.display = 'none';
                const resultDiv = document.getElementById('n0v4-result');
                if (resultDiv) resultDiv.style.display = 'none';
                const apiContainer = document.getElementById('n0v4-api-status-container');
                if (apiContainer) {
                    apiContainer.innerHTML = '';
                    apiContainer.style.display = 'none';
                }
                bypass();
            };
        }
    };

    const startTimer = (seconds) => {
        const timerEl = document.getElementById('n0v4-timer');
        const timeEl = document.getElementById('n0v4-time-remaining');
        
        if (timerEl) timerEl.style.display = 'block';
        
        let remaining = seconds;
        const interval = setInterval(() => {
            remaining--;
            if (timeEl) timeEl.textContent = remaining;
            
            if (remaining <= 0) {
                clearInterval(interval);
                if (timerEl) timerEl.style.display = 'none';
            }
        }, 1000);
        
        return interval;
    };

    const isValidUrl = (str) => {
        try {
            new URL(str);
            return true;
        } catch (e) {
            return false;
        }
    };

    const parseResponse = (data) => {
        if (data.status === 'success' && data.result) {
            return data.result;
        }
        if (data.success && data.data && data.data.result) {
            return data.data.result;
        }
        if (data.result) {
            return data.result;
        }
        return null;
    };

    const hasErrorKeywords = (data) => {
        if (!data) return false;
        
        // Convert the entire response to a string for searching
        const jsonString = JSON.stringify(data).toLowerCase();
        
        // Check each keyword
        return config.errorKeywords.some(keyword => {
            if (jsonString.includes(keyword.toLowerCase())) {
                console.log(`Detected error keyword "${keyword}" in API response`);
                return true;
            }
            return false;
        });
    };

    // Abort controllers to cancel pending requests
    const abortControllers = new Map();

    const makeRequest = (url, engineName) => {
        return new Promise((resolve, reject) => {
            addApiStatus(engineName, 'pending', 'Testing...');
            
            const controller = new AbortController();
            abortControllers.set(engineName, controller);
            
            // Create a timeout promise
            const timeoutPromise = new Promise((_, timeoutReject) => {
                setTimeout(() => {
                    timeoutReject(new Error('Request timeout'));
                }, 30000);
            });
            
            // Create the fetch promise
            const fetchPromise = fetch(url, { signal: controller.signal })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    // Special case: Check if the API says the URL is not supported
                    if (data.message && data.message.toLowerCase().includes('unsupported')) {
                        throw new Error('URL not supported by this engine');
                    }
                    
                    // Check for error keywords in the response
                    if (hasErrorKeywords(data)) {
                        const errorMsg = JSON.stringify(data).substring(0, 100) + '...';
                        throw new Error(`Engine returned error: ${errorMsg}`);
                    }
                    
                    // Check if status indicates failure
                    if (data.status && data.status.toLowerCase() === 'error') {
                        throw new Error(data.message || 'Engine error');
                    }
                    
                    return data;
                });
            
            // Race between fetch and timeout
            Promise.race([fetchPromise, timeoutPromise])
                .then(data => {
                    resolve({ success: true, data: data, engineName });
                })
                .catch(err => {
                    reject(err);
                });
        });
    };

    const cancelAllRequests = () => {
        abortControllers.forEach((controller, engineName) => {
            controller.abort();
            addApiStatus(engineName, 'cancelled', 'Cancelled');
        });
        abortControllers.clear();
    };

    let currentBypassResult = null;
    const bypass = () => {
        const currentUrl = window.location.href;
        
        // Clear previous abort controllers
        abortControllers.clear();
        
        // Prepare URLs
        const apiUrls = config.apis.map((api, index) => {
            let url = api;
            if (api.includes('ace-bypass.com')) {
                url = api.replace('URL', encodeURIComponent(currentUrl));
            } else if (api.includes('rtao.lol')) {
                url = api + encodeURIComponent(currentUrl);
            } else {
                url = api + encodeURIComponent(currentUrl);
            }
            
            // Use generic engine names
            const engineName = `Engine ${index + 1}`;
            
            return { url, engineName };
        });

        updateStatus('Starting bypass...', `Testing ${apiUrls.length} engines in parallel`, false, false);
        updateProgress(10);
        
        // Reset counters
        updateApiCounters(0, 0, apiUrls.length);
        
        // Start timer (300 seconds)
        const timerInterval = startTimer(300);

        const timeout = 300000; // 300 seconds = 300000 milliseconds
        
        // Create promises for each engine
        const enginePromises = apiUrls.map(({ url, engineName }) => 
            makeRequest(url, engineName)
                .then(result => {
                    // Update counters
                    const successEl = document.getElementById('n0v4-success-count');
                    const errorEl = document.getElementById('n0v4-error-count');
                    const pendingEl = document.getElementById('n0v4-pending-count');
                    
                    if (successEl && errorEl && pendingEl) {
                        const successCount = parseInt(successEl.textContent) + 1;
                        const pendingCount = parseInt(pendingEl.textContent) - 1;
                        
                        updateApiCounters(successCount, parseInt(errorEl.textContent), pendingCount);
                    }
                    
                    addApiStatus(engineName, 'success', 'Success!');
                    return { success: true, data: result.data, engineName };
                })
                .catch(err => {
                    // Update counters
                    const successEl = document.getElementById('n0v4-success-count');
                    const errorEl = document.getElementById('n0v4-error-count');
                    const pendingEl = document.getElementById('n0v4-pending-count');
                    
                    if (successEl && errorEl && pendingEl) {
                        const errorCount = parseInt(errorEl.textContent) + 1;
                        const pendingCount = parseInt(pendingEl.textContent) - 1;
                        
                        updateApiCounters(parseInt(successEl.textContent), errorCount, pendingCount);
                    }
                    
                    addApiStatus(engineName, 'error', err.message.substring(0, 50));
                    throw err; // Re-throw so Promise.any can handle it
                })
        );

        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('Global timeout of 300 seconds exceeded'));
            }, timeout);
        });

        // Use Promise.any to get the first successful result
        // Add timeoutPromise to the array to also race against timeout
        Promise.any([...enginePromises, timeoutPromise])
            .then(result => {
                // Clear timer and cancel all pending requests
                clearInterval(timerInterval);
                cancelAllRequests();
                const timerEl = document.getElementById('n0v4-timer');
                if (timerEl) timerEl.style.display = 'none';
                
                updateProgress(100);
                
                // If result is from timeout promise (shouldn't happen with Promise.any)
                if (result && result.success) {
                    const parsedResult = parseResponse(result.data);
                    
                    if (parsedResult) {
                        updateStatus('Bypass successful!', `Success from ${result.engineName}`, true, true);
                        showResult(parsedResult);
                        currentBypassResult = parsedResult;
                        
                        if (isValidUrl(parsedResult)) {
                            let cd = 3;
                            updateStatus('Bypass successful!', `Redirecting in ${cd} seconds...`, true, true);
                            
                            const interval = setInterval(() => {
                                cd--;
                                if (cd > 0) {
                                    updateStatus('Bypass successful!', `Redirecting in ${cd} seconds...`, true, true);
                                } else {
                                    clearInterval(interval);
                                    updateStatus('Redirecting...', null, true, true);
                                    window.location.href = parsedResult;
                                }
                            }, 1000);
                        }
                    } else {
                        updateStatus('No valid result found', 'Parsing failed', true, true);
                        showRetryButton();
                    }
                }
            })
            .catch(err => {
                // All promises rejected (or timeout)
                clearInterval(timerInterval);
                cancelAllRequests();
                const timerEl = document.getElementById('n0v4-timer');
                if (timerEl) timerEl.style.display = 'none';
                
                updateProgress(100);
                updateStatus('Bypass failed', err.message || 'All engines failed', true, true);
                showRetryButton();
            });
    };

    const init = () => {
        createUI();
        updateStatus('Detected supported site', 'Starting automatic bypass...', false, false);
        updateProgress(20);

        // Start bypass automatically after 1 second
        setTimeout(() => {
            bypass();
        }, 1000);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();