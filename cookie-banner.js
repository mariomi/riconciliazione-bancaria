// Reusable cookie consent banner — GDPR-style
// Include on every public page: <script defer src="cookie-banner.js"></script>
// Stores choice in localStorage under 'reconcilia.cookie-consent'
// Value: { necessary:true, analytics:bool, marketing:bool, ts:'<iso>' }
(function(){
  const STORAGE_KEY='reconcilia.cookie-consent';

  function getConsent(){
    try{return JSON.parse(localStorage.getItem(STORAGE_KEY))}catch(e){return null}
  }
  function setConsent(obj){
    localStorage.setItem(STORAGE_KEY,JSON.stringify({...obj,ts:new Date().toISOString()}));
  }

  // Expose API for other scripts (e.g. analytics) to check before loading trackers
  window.CookieConsent={
    get:getConsent,
    has:k=>{const c=getConsent();return c&&c[k]===true},
    accepted:()=>!!getConsent()
  };

  if(getConsent())return; // Already chose, do not show again

  function injectStyles(){
    if(document.getElementById('cb-styles'))return;
    const s=document.createElement('style');
    s.id='cb-styles';
    s.textContent=`
.cb-banner{position:fixed;bottom:16px;left:16px;right:16px;max-width:560px;margin:0 auto;
  background:#fff;color:#0a0a0a;border:1px solid #ebe9e2;border-radius:12px;
  box-shadow:0 12px 40px rgba(0,0,0,.12);padding:20px 22px;z-index:9999;
  font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;font-size:13.5px;line-height:1.55;
  animation:cb-slide .25s ease-out}
@keyframes cb-slide{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
.cb-banner h3{font-size:14.5px;font-weight:600;margin-bottom:6px;letter-spacing:-.2px}
.cb-banner p{color:#7a7770;margin-bottom:14px}
.cb-banner a{color:#0a0a0a;text-decoration:underline;font-weight:500}
.cb-actions{display:flex;flex-wrap:wrap;gap:8px}
.cb-btn{padding:9px 16px;border-radius:7px;font-size:13px;font-weight:500;cursor:pointer;
  border:1px solid #dcd9cf;background:transparent;color:#0a0a0a;font-family:inherit;transition:all .15s}
.cb-btn:hover{background:#f1f0eb}
.cb-btn.primary{background:#0a0a0a;color:#fff;border-color:#0a0a0a}
.cb-btn.primary:hover{background:#1a1a1a}

.cb-modal-back{position:fixed;inset:0;background:rgba(10,10,10,.4);z-index:10000;display:flex;align-items:center;justify-content:center;padding:24px;animation:cb-fade .2s ease-out}
@keyframes cb-fade{from{opacity:0}to{opacity:1}}
.cb-modal{background:#fff;border-radius:12px;max-width:520px;width:100%;max-height:88vh;overflow:auto;
  font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;color:#0a0a0a}
.cb-modal-head{padding:22px 24px 14px;border-bottom:1px solid #ebe9e2}
.cb-modal-head h3{font-size:18px;font-weight:600;letter-spacing:-.3px}
.cb-modal-body{padding:18px 24px}
.cb-modal-foot{padding:14px 24px 22px;display:flex;justify-content:flex-end;gap:8px}
.cb-cat{padding:14px 0;border-bottom:1px solid #ebe9e2}
.cb-cat:last-child{border-bottom:0}
.cb-cat-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;gap:14px}
.cb-cat-head strong{font-size:13.5px;font-weight:600}
.cb-cat-head .cb-tag{font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;padding:2px 8px;border-radius:980px;background:#f1f0eb;color:#7a7770}
.cb-cat-head .cb-tag.req{background:#e7f5ec;color:#0f7a3a}
.cb-cat p{font-size:12.5px;color:#7a7770;line-height:1.55}
.cb-toggle{position:relative;width:36px;height:20px;flex-shrink:0}
.cb-toggle input{opacity:0;width:0;height:0}
.cb-toggle .cb-slider{position:absolute;inset:0;background:#dcd9cf;border-radius:980px;cursor:pointer;transition:.2s}
.cb-toggle .cb-slider:before{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;background:#fff;border-radius:50%;transition:.2s}
.cb-toggle input:checked+.cb-slider{background:#0a0a0a}
.cb-toggle input:checked+.cb-slider:before{transform:translateX(16px)}
.cb-toggle input:disabled+.cb-slider{opacity:.5;cursor:not-allowed}
@media(max-width:560px){.cb-banner{left:8px;right:8px;bottom:8px;padding:18px}}
`;
    document.head.appendChild(s);
  }

  function showBanner(){
    injectStyles();
    const div=document.createElement('div');
    div.className='cb-banner';
    div.setAttribute('role','dialog');
    div.setAttribute('aria-label','Cookie consent');
    div.innerHTML=`
      <h3>Usiamo i cookie</h3>
      <p>Reconcilia usa solo cookie tecnici necessari per il login e per memorizzare le tue preferenze (tema, lingua). Non usiamo cookie di profilazione né di terze parti. Maggiori dettagli nella <a href="cookie.html">Cookie Policy</a> e <a href="privacy.html">Privacy Policy</a>.</p>
      <div class="cb-actions">
        <button class="cb-btn primary" id="cb-accept-all">Accetta tutti</button>
        <button class="cb-btn" id="cb-reject">Solo necessari</button>
        <button class="cb-btn" id="cb-customize">Personalizza</button>
      </div>`;
    document.body.appendChild(div);

    document.getElementById('cb-accept-all').onclick=()=>{
      setConsent({necessary:true,analytics:true,marketing:true});
      div.remove();
    };
    document.getElementById('cb-reject').onclick=()=>{
      setConsent({necessary:true,analytics:false,marketing:false});
      div.remove();
    };
    document.getElementById('cb-customize').onclick=()=>{
      div.remove();
      showCustomize();
    };
  }

  function showCustomize(){
    injectStyles();
    const back=document.createElement('div');
    back.className='cb-modal-back';
    back.innerHTML=`
      <div class="cb-modal" role="dialog" aria-label="Preferenze cookie">
        <div class="cb-modal-head"><h3>Preferenze cookie</h3></div>
        <div class="cb-modal-body">
          <div class="cb-cat">
            <div class="cb-cat-head"><strong>Necessari</strong>
              <span style="display:flex;align-items:center;gap:10px"><span class="cb-tag req">Sempre attivi</span><label class="cb-toggle"><input type="checkbox" checked disabled><span class="cb-slider"></span></label></span></div>
            <p>Cookie indispensabili per il login (sessione di autenticazione) e per memorizzare le tue preferenze locali (tema chiaro/scuro). Senza questi cookie il sito non può funzionare.</p>
          </div>
          <div class="cb-cat">
            <div class="cb-cat-head"><strong>Analitici</strong>
              <label class="cb-toggle"><input type="checkbox" id="cb-analytics"><span class="cb-slider"></span></label></div>
            <p>Cookie aggregati e anonimi per capire come gli utenti usano l'app e migliorarla. Non profilano l'utente individualmente.</p>
          </div>
          <div class="cb-cat">
            <div class="cb-cat-head"><strong>Marketing</strong>
              <label class="cb-toggle"><input type="checkbox" id="cb-marketing"><span class="cb-slider"></span></label></div>
            <p>Cookie di terze parti per remarketing e annunci personalizzati. Disattivati di default — al momento non li usiamo.</p>
          </div>
        </div>
        <div class="cb-modal-foot">
          <button class="cb-btn" id="cb-cancel">Annulla</button>
          <button class="cb-btn primary" id="cb-save">Salva preferenze</button>
        </div>
      </div>`;
    document.body.appendChild(back);

    document.getElementById('cb-cancel').onclick=()=>{back.remove();showBanner()};
    document.getElementById('cb-save').onclick=()=>{
      setConsent({
        necessary:true,
        analytics:document.getElementById('cb-analytics').checked,
        marketing:document.getElementById('cb-marketing').checked
      });
      back.remove();
    };
    back.addEventListener('click',e=>{if(e.target===back){back.remove();showBanner()}});
  }

  // Public helper to reopen preferences from a "Cookie settings" link
  window.CookieConsent.openPrefs=function(){
    const ex=document.querySelector('.cb-banner');if(ex)ex.remove();
    const exm=document.querySelector('.cb-modal-back');if(exm)exm.remove();
    showCustomize();
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',showBanner);
  else showBanner();
})();
