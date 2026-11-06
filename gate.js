/* Simple password gate for this static site. It keeps casual visitors out; it is not real security:
   the repo is public, files can still be opened by their direct URL, and the try limit lives in the browser.
   Change the password: printf '%s' 'aaa-wallet-viewer:NEWPASSWORD' | shasum -a 256  and paste the hash below. */
(function(){
  var HASH = '93156e97dcb9a6d0d3f437a05ebdc0e94ad82d5c02dd5ef07157b0eee248ceed', SALT = 'aaa-wallet-viewer:', KEY = 'viewerUnlocked', TRIES = 'viewerGateTries';
  var MAX_FAILURES = 3, BLOCK_MS = 24 * 60 * 60 * 1000;
  var root = document.documentElement;
  function ok(){ try { return localStorage.getItem(KEY) === HASH; } catch(e){ return false; } }
  if(ok()) return;
  root.style.visibility = 'hidden';
  function sha(t){ return crypto.subtle.digest('SHA-256', new TextEncoder().encode(t)).then(function(b){ return Array.from(new Uint8Array(b)).map(function(x){ return x.toString(16).padStart(2, '0'); }).join(''); }); }
  function readTries(){ try { return JSON.parse(localStorage.getItem(TRIES)) || {failures: 0, blockedUntil: 0}; } catch(e){ return {failures: 0, blockedUntil: 0}; } }
  function saveTries(t){ try { localStorage.setItem(TRIES, JSON.stringify(t)); } catch(e){} }
  function blockedText(until){ return 'too many tries. Try again in about ' + Math.ceil((until - Date.now()) / 3600000) + ' hours... or not 👀'; }
  var CSS = '#gate{--bg:#f4f6f9;--surface:#fff;--fg:#17202c;--line:#d7dde6;--accent:#0b4f9e;--on:#fff;--err:#9b2c1c;visibility:visible;position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:16px;box-sizing:border-box;background:var(--bg);color:var(--fg);font:16px/1.5 -apple-system,"Segoe UI",sans-serif}'
    + '@media (prefers-color-scheme:dark){#gate{--bg:#11161d;--surface:#19202a;--fg:#e8edf4;--line:#313b49;--accent:#7db4f5;--on:#11161d;--err:#f5a99c;color-scheme:dark}}'
    + '#gate *{box-sizing:border-box}'
    + '#gate form{width:100%;max-width:360px;background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:24px;display:grid;gap:12px}'
    + '#gate h1{font-size:20px;margin:0}'
    + '#gate label{font-weight:600;font-size:14px}'
    + '#gate input{width:100%;min-height:44px;padding:8px 10px;font:inherit;color:var(--fg);background:var(--bg);border:1px solid var(--line);border-radius:6px}'
    + '#gate button{min-height:44px;font:inherit;font-weight:600;color:var(--on);background:var(--accent);border:0;border-radius:6px;cursor:pointer}'
    + '#gate button:disabled{opacity:.6;cursor:default}'
    + '#gate input:focus-visible,#gate button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}'
    + '#gateMsg{margin:0;font-size:14px;color:var(--err);min-height:21px}'
    + '#gateNope{position:fixed;inset:0;display:flex;flex-direction:column;background:#000;z-index:1}'
    + '#gateNope[hidden]{display:none}'
    + '#gateFrame{flex:1;display:flex;min-height:0}'
    + '#gateNope iframe{flex:1;width:100%;min-height:0;border:0;background:#000}'
    + '#gateBar{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:center;padding:12px 16px calc(12px + env(safe-area-inset-bottom,0px));background:var(--surface);color:var(--fg);text-align:center}'
    + '#gateBar p{margin:0;font-weight:600}'
    + '#gateAgain{padding:8px 20px}';
  function show(){
    var pageTitle = document.title;
    var d = document.createElement('div');
    d.id = 'gate';
    d.innerHTML = '<style>' + CSS + '</style>'
      + '<form><h1>you need the password for this one</h1>'
      + '<label for="gatePw">password</label>'
      + '<input id="gatePw" type="password" autocomplete="off" autofocus required>'
      + '<button id="gateGo">lets go</button>'
      + '<p id="gateMsg"></p></form>'
      + '<div id="gateNope" hidden><div id="gateFrame"></div><div id="gateBar"><p id="gateNopeText" role="alert"></p><button type="button" id="gateAgain">try again</button></div></div>';
    document.body.appendChild(d);
    document.title = 'password please';
    var input = d.querySelector('#gatePw'), go = d.querySelector('#gateGo'), nope = d.querySelector('#gateNope'), frame = d.querySelector('#gateFrame'), again = d.querySelector('#gateAgain');
    function showNope(text, canRetry){
      var f = document.createElement('iframe');
      f.src = 'https://markhjorth.github.io/nedry/';
      f.title = 'ah ah ah, you didnt say the magic word';
      f.allow = 'autoplay';
      f.referrerPolicy = 'no-referrer';
      f.setAttribute('sandbox', 'allow-scripts');
      frame.replaceChildren(f);
      d.querySelector('#gateNopeText').textContent = text;
      again.hidden = !canRetry;
      nope.hidden = false;
      if(canRetry) again.focus();
    }
    function closeForm(){ input.disabled = true; go.disabled = true; }
    again.addEventListener('click', function(){ frame.replaceChildren(); nope.hidden = true; input.focus(); });
    var start = readTries();
    if(start.blockedUntil > Date.now()){ closeForm(); showNope(blockedText(start.blockedUntil), false); return; }
    if(start.blockedUntil) saveTries({failures: 0, blockedUntil: 0});
    input.focus();
    d.querySelector('form').addEventListener('submit', function(e){
      e.preventDefault();
      go.disabled = true; go.textContent = 'checking…';
      sha(SALT + input.value).then(function(h){
        go.disabled = false; go.textContent = 'lets go';
        if(h === HASH){
          try { localStorage.setItem(KEY, HASH); localStorage.removeItem(TRIES); } catch(err){}
          d.remove(); document.title = pageTitle; root.style.visibility = ''; if(window.openForHash) window.openForHash();
          return;
        }
        input.value = '';
        var failures = readTries().failures + 1;
        if(failures >= MAX_FAILURES){
          var until = Date.now() + BLOCK_MS;
          saveTries({failures: failures, blockedUntil: until});
          closeForm();
          showNope(blockedText(until), false);
          return;
        }
        saveTries({failures: failures, blockedUntil: 0});
        var left = MAX_FAILURES - failures;
        showNope('wrong password, ' + left + (left === 1 ? ' try' : ' tries') + ' left', true);
      });
    });
  }
  if(document.body) show(); else document.addEventListener('DOMContentLoaded', show);
})();
