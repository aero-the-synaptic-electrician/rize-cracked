// ==UserScript==
// @name         RISE.EXE - Cracked
// @version      1.0
// @description  Highly skidded Vanis.io Multibox Extension - @discord.me/axoninfinite
// @match        *://vanis.io/*
// @author       Stack Overflow
// @run-at       document-end
// ==/UserScript==

(async a=>{"use strict";async function b(){for(let b of["vendor.js","main.js"])await fetch(`${a}/js/${b}`).then(a=>a.text()).then(b=>{let a=document.createElement("script");a.type="text/javascript",a.textContent=b,document.head.appendChild(a)})}document.open(),await fetch(`${a}/index.html`).then(a=>a.text()).then(a=>document.write(a)),document.close(),b()})("https://raw.githubusercontent.com/aero-the-synaptic-electrician/rize-cracked/main")
