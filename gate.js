/* Simple password gate for this static site. It keeps casual visitors out; it is not real security:
   the repo is public and files can still be opened by their direct URL.
   Change the password: printf '%s' 'aaa-wallet-viewer:NEWPASSWORD' | shasum -a 256  and paste the hash below. */
(function(){
  var HASH = '93156e97dcb9a6d0d3f437a05ebdc0e94ad82d5c02dd5ef07157b0eee248ceed', SALT = 'aaa-wallet-viewer:', KEY = 'aaaViewerUnlocked';
  var root = document.documentElement;
  function ok(){ try { return localStorage.getItem(KEY) === HASH; } catch(e){ return false; } }
  if(ok()) return;
  root.style.visibility = 'hidden';
  function sha(t){ return crypto.subtle.digest('SHA-256', new TextEncoder().encode(t)).then(function(b){ return Array.from(new Uint8Array(b)).map(function(x){ return x.toString(16).padStart(2, '0'); }).join(''); }); }
  function show(){
    var d = document.createElement('div');
    d.id = 'gate';
    d.setAttribute('style', 'position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:16px;background:#121317;color:#ececf0;font:15px -apple-system,BlinkMacSystemFont,Roboto,sans-serif;visibility:visible');
    d.innerHTML = '<form style="width:100%;max-width:340px;background:#1d1e23;border:1px solid #2f3038;border-radius:16px;padding:22px">'
      + '<h1 style="margin:0 0 6px;font-size:19px">AAA Wallet Pass Viewer</h1>'
      + '<p style="margin:0 0 16px;color:#a1a2ab;font-size:13px;line-height:1.45">Internal design review. Enter the password to continue.</p>'
      + '<label for="gatePw" style="display:block;font-size:12px;color:#a1a2ab;margin-bottom:6px">Password</label>'
      + '<input id="gatePw" type="password" autocomplete="current-password" required style="box-sizing:border-box;width:100%;padding:11px 12px;border-radius:10px;border:1px solid #3a3b42;background:#121317;color:#fff;font-size:16px">'
      + '<p id="gateErr" role="alert" style="min-height:18px;margin:8px 0 0;color:#ff8a80;font-size:12.5px"></p>'
      + '<button type="submit" style="margin-top:8px;width:100%;padding:11px;border:0;border-radius:10px;background:#0c72df;color:#fff;font-size:15px;font-weight:600;cursor:pointer">Unlock</button>'
      + '</form>';
    document.body.appendChild(d);
    var input = d.querySelector('input'); input.focus();
    d.querySelector('form').addEventListener('submit', function(e){
      e.preventDefault();
      sha(SALT + input.value).then(function(h){
        if(h !== HASH){ d.querySelector('#gateErr').textContent = 'Wrong password. Try again.'; input.select(); return; }
        try { localStorage.setItem(KEY, HASH); } catch(err){}
        d.remove(); root.style.visibility = '';
      });
    });
  }
  if(document.body) show(); else document.addEventListener('DOMContentLoaded', show);
})();
