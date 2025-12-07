// ==UserScript==
// @name         forge fucked up
// @namespace    http://tampermonkey.net/
// @version      6.1
// @description  Bypass ultra léger
// @author       Universal
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @connect      pythonanywhere.com
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const API = "https://montelopiuy.pythonanywhere.com";  // Remplace par ton username !

    // Le script apparaît sur tous les sites maintenant

    let mode = null, start, timer, check;

    GM_addStyle(`
        #menu{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#222;color:#fff;padding:30px;border-radius:20px;z-index:9999999;font-family:Arial}
        #menu h2{margin:0 0 20px;font-size:24px}
        .opt{display:grid;grid-template-columns:1fr 1fr;gap:15px}
        .opt button{padding:20px;border:none;border-radius:15px;cursor:pointer;font-size:16px;font-weight:600;transition:.3s}
        #forge{background:linear-gradient(135deg,#ff6b6b,#ee5a6f);color:#fff}
        #luarmor{background:linear-gradient(135deg,#8b5cf6,#ec4899);color:#fff}
        #rtao{background:linear-gradient(135deg,#4ade80,#22c55e);color:#fff}  /* Ajout couleur pour rtao */
        .opt button:hover{transform:translateY(-5px)}
        #ui{position:fixed;top:20px;right:20px;color:#fff;padding:25px;border-radius:20px;z-index:9999998;min-width:300px;font-family:Arial}
        #ui.forge{background:linear-gradient(135deg,#ff6b6b,#ee5a6f)}
        #ui.luarmor{background:linear-gradient(135deg,#8b5cf6,#ec4899)}
        #ui.rtao{background:linear-gradient(135deg,#4ade80,#22c55e)}
        #hdr{display:flex;justify-content:space-between;margin-bottom:15px}
        #cls{background:rgba(255,255,255,.2);border:none;color:#fff;width:30px;height:30px;border-radius:50%;cursor:pointer}
        #stat{background:rgba(255,255,255,.15);padding:15px;border-radius:12px;text-align:center;margin-bottom:15px}
        #prog{width:100%;height:6px;background:rgba(255,255,255,.2);border-radius:10px;overflow:hidden;margin:10px 0}
        #fill{height:100%;background:#fff;width:0;transition:.3s}
        .load{border:4px solid rgba(255,255,255,.2);border-top:4px solid #fff;border-radius:50%;width:40px;height:40px;animation:spin .8s linear infinite;margin:15px auto}
        @keyframes spin{to{transform:rotate(360deg)}}
        #key{display:none;background:#fff;color:#000;padding:15px;border-radius:12px;margin-bottom:10px;word-break:break-all;font-family:monospace}
        #copy{width:100%;padding:12px;background:rgba(0,0,0,.3);border:none;color:#fff;border-radius:10px;cursor:pointer;font-weight:600}
        #btn{position:fixed;bottom:20px;right:20px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:50%;width:60px;height:60px;cursor:pointer;z-index:9999997;font-size:30px;box-shadow:0 5px 20px rgba(102,126,234,.4)}
    `);

    function ui() {
        const div = document.createElement('div');
        div.id = 'ui';
        div.className = mode;
        const titles = {forge: '🔨 Forge', luarmor: '🔓 Luarmor', rtao: '⚡ RTAO'};
        div.innerHTML = `
            <div id="hdr">
                <div>${titles[mode]}</div>
                <button id="cls">×</button>
            </div>
            <div id="stat">Init...</div>
            <div id="prog"><div id="fill"></div></div>
            <div class="load"></div>
            <div id="key"></div>
            <button id="copy">📋 Copier</button>
        `;
        document.body.appendChild(div);
        document.getElementById('cls').onclick = () => div.remove();
        document.getElementById('copy').onclick = copy;
    }

    function stat(t) {
        const s = document.getElementById('stat');
        if (s) s.textContent = t;
    }

    function prog(p) {
        const f = document.getElementById('fill');
        if (f) f.style.width = p + '%';
    }

    function show(k) {
        const box = document.getElementById('key');
        const btn = document.getElementById('copy');
        const load = document.querySelector('.load');
        if (box) { box.textContent = k; box.style.display = 'block'; }
        if (load) load.style.display = 'none';
        stat('✅ OK!');
        prog(100);
        if (timer) clearInterval(timer);
        try { GM_setClipboard(k); } catch(e) { navigator.clipboard.writeText(k); }
        setTimeout(() => window.location.href = k, 1500);
    }

    function copy() {
        const k = document.getElementById('key').textContent;
        try { GM_setClipboard(k); } catch(e) { navigator.clipboard.writeText(k); }
        const b = document.getElementById('copy');
        b.textContent = '✅ Copié!';
        setTimeout(() => b.textContent = '📋 Copier', 2000);
    }

    async function checkStat(link) {
        return new Promise(r => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: API + '/status',
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify({link}),
                timeout: 5000,
                onload: res => {
                    try { r(JSON.parse(res.responseText)); }
                    catch(e) { r(null); }
                },
                onerror: () => r(null),
                ontimeout: () => r(null)
            });
        });
    }

    async function send(link) {
        // Toujours envoyer à l'API /bypass, pour tous les modes
        return new Promise(r => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: API + '/bypass',
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify({link: link, mode: mode}),
                timeout: 5000,
                onload: res => {
                    try {
                        const data = JSON.parse(res.responseText);
                        r(data.status === 'ok');
                    } catch(e) {
                        r(false);
                    }
                },
                onerror: () => r(false),
                ontimeout: () => r(false)
            });
        });
    }

    async function bypass() {
        const link = window.location.href;
        ui();
        stat('📤 Envoi...');
        prog(10);
        
        start = Date.now();
        timer = setInterval(() => {
            const t = Math.floor((Date.now() - start) / 1000);
            prog(Math.min((t / 120) * 100, 95));
        }, 1000);

        if (!await send(link)) {
            stat('❌ Erreur envoi');
            clearInterval(timer);
            return;
        }

        stat('⏳ En cours...');
        prog(30);

        let n = 0;
        check = setInterval(async () => {
            if (++n > 40) {
                clearInterval(check);
                stat('⏰ Timeout');
                clearInterval(timer);
                return;
            }

            const d = await checkStat(link);
            if (d) {
                if (d.status === 'success' && d.result) {
                    clearInterval(check);
                    show(d.result);
                } else if (d.status === 'timeout' || d.status === 'failed') {
                    clearInterval(check);
                    stat('❌ Échec');
                    clearInterval(timer);
                }
            }
        }, 3000);
    }

    function menu() {
        const m = document.createElement('div');
        m.id = 'menu';
        m.innerHTML = `
            <h2>🔓 Choisir le bypass</h2>
            <div class="opt">
                <button id="forge">🔨<br>Forge</button>
                <button id="luarmor">🔓<br>Luarmor</button>
                <button id="rtao">⚡<br>RTAO</button>
            </div>
        `;
        document.body.appendChild(m);
        document.getElementById('forge').onclick = () => { mode = 'forge'; m.remove(); bypass(); };
        document.getElementById('luarmor').onclick = () => { mode = 'luarmor'; m.remove(); bypass(); };
        document.getElementById('rtao').onclick = () => { mode = 'rtao'; m.remove(); bypass(); };
    }

    const btn = document.createElement('button');
    btn.id = 'btn';
    btn.textContent = '🔓';
    document.body.appendChild(btn);
    btn.onclick = menu;

})();
