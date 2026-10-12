/* Light / dark switch. Follows the system color scheme until the viewer flips the switch;
   that choice is remembered on this device. Loaded in <head> so the page never flashes the wrong theme. */
(function(){
  var KEY = 'aaaViewerTheme', root = document.documentElement, mq = window.matchMedia('(prefers-color-scheme: light)');
  function saved(){ try { return localStorage.getItem(KEY); } catch(e){ return null; } }
  function current(){ return saved() || (mq.matches ? 'light' : 'dark'); }
  var SUN = '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></g></svg>';
  var MOON = '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1z" fill="currentColor"/></svg>';
  function apply(){
    var t = current(); root.setAttribute('data-theme', t);
    var b = document.getElementById('themeSw'); if(!b) return;
    b.setAttribute('aria-checked', String(t === 'dark'));
    b.setAttribute('aria-label', t === 'dark' ? 'Dark mode on. Switch to light mode' : 'Light mode on. Switch to dark mode');
    b.title = (saved() ? 'Your choice' : 'Following your system') + ' · click to switch';
    b.querySelector('.ts-label').textContent = t === 'dark' ? 'Dark' : 'Light';
  }
  apply();
  if(mq.addEventListener) mq.addEventListener('change', function(){ if(!saved()) apply(); });
  function mount(){
    var css = document.createElement('style');
    css.textContent = '#themeSw{position:fixed;right:16px;bottom:16px;z-index:90;display:flex;align-items:center;gap:8px;padding:5px 12px 5px 5px;border-radius:999px;border:1px solid rgba(127,127,127,.35);background:rgba(40,41,46,.82);color:#f2f2f7;font:600 12.5px -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.25);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px)}'
      + '#themeSw .ts-track{position:relative;width:46px;height:26px;border-radius:13px;background:#3a3b40;transition:background .2s}'
      + '#themeSw .ts-knob{position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;color:#f5a623;display:grid;place-items:center;transition:transform .2s,color .2s;box-shadow:0 1px 3px rgba(0,0,0,.3)}'
      + 'html[data-theme="dark"] #themeSw .ts-knob{transform:translateX(20px);color:#3b4a6b}'
      + 'html[data-theme="dark"] #themeSw .ts-track{background:#0a84ff}'
      + 'html[data-theme="light"] #themeSw{background:rgba(255,255,255,.85);color:#1c1c1e;box-shadow:0 6px 20px rgba(0,0,0,.12)}'
      + 'html[data-theme="light"] #themeSw .ts-track{background:#d1d1d6}'
      + '#themeSw:focus-visible{outline:2px solid #0a84ff;outline-offset:2px}'
      + '@media (max-width:600px){#themeSw{right:12px;bottom:12px}}';
    document.head.appendChild(css);
    var b = document.createElement('button');
    b.id = 'themeSw'; b.type = 'button'; b.setAttribute('role', 'switch');
    b.innerHTML = '<span class="ts-track"><span class="ts-knob"></span></span><span class="ts-label"></span>';
    b.addEventListener('click', function(){
      var next = current() === 'dark' ? 'light' : 'dark', system = mq.matches ? 'light' : 'dark';
      try { if(next === system) localStorage.removeItem(KEY); else localStorage.setItem(KEY, next); } catch(e){}
      apply(); paintIcon();
    });
    document.body.appendChild(b);
    function paintIcon(){ b.querySelector('.ts-knob').innerHTML = current() === 'dark' ? MOON : SUN; }
    if(mq.addEventListener) mq.addEventListener('change', paintIcon);
    apply(); paintIcon();
  }
  if(document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
