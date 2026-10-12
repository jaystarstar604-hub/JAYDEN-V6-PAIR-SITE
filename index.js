const express = require('express');
const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
  <html><head><title>JAYDEN V6 PAIR</title><meta name="viewport" content="width=device-width,initial-scale=1">
  <style>body{background:#000;color:#fff;font-family:sans-serif;text-align:center;padding:30px}input{padding:15px;width:80%;max-width:300px;border-radius:10px;border:2px solid #0ff;font-size:18px}button{padding:15px 30px;background:linear-gradient(90deg,#00f,#f00);color:#fff;border:none;border-radius:10px;font-size:18px;margin-top:15px} .box{background:#111;padding:20px;border-radius:15px;border:1px solid #333;margin-top:20px}</style>
  </head><body>
  <h1>💀 JAYDEN ULTRA V6</h1><h2>PAIR CODE GENERATOR</h2>
  <div class="box"><p>Weka Namba yako na Code ya Nchi<br>MF: 255722080765</p>
  <input id="num" placeholder="255722080765"/><br><button onclick="getCode()">PATA PAIR CODE</button>
  <h2 id="code" style="color:#0ff;margin-top:20px"></h2><p id="info"></p></div>
  <script>
  async function getCode(){
    let n=document.getElementById('num').value;
    if(!n){alert('Weka namba!');return}
    document.getElementById('code').innerText='⏳ Inatengeneza...';
    let res=await fetch('/code?number='+n);
    let data=await res.json();
    if(data.code){document.getElementById('code').innerText=data.code;document.getElementById('info').innerText='Nenda WhatsApp > Linked Devices > Link with phone number > Weka hii code';}
    else{document.getElementById('code').innerText='Error: '+data.error}
  }
  </script></body></html>`);
});

app.get('/code', async (req, res) => {
  let num = req.query.number.replace(/[^0-9]/g,'');
  if(!num) return res.json({error:'Namba si sahihi'});
  const { state, saveCreds } = await useMultiFileAuthState('./auth_'+num);
  const sock = makeWASocket({ auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys) }, logger: pino({level:'silent'}), printQRInTerminal:false, browser:['JAYDEN V6','Chrome','1.0'] });
  sock.ev.on('creds.update', saveCreds);
  if(!sock.authState.creds.registered){
    setTimeout(async()=>{
      try{ let code = await sock.requestPairingCode(num); res.json({code:code}); }catch(e){ res.json({error:e.message}) }
    },3000);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log('Pair running on '+PORT));
