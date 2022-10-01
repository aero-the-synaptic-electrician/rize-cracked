(function main() {
	/* @Aero#1420 - don't skid my shit */

	if (location.search === '?vanilla') {
		return;
	} else {
		const target = 'https://vanis.io/zimek-is-a-pedophile';
		if (location.href !== target) {
			location.href = target;
		}
	}

	window.customModal = ((e, a) => {
		document.getElementsByClassName("fa-clipboard-list")[0].click(), setTimeout(() => {
			document.getElementsByClassName("content fade-box")[0].getElementsByTagName("div")[0].innerHTML = e, a && setTimeout(a, 50)
		}, 50)
	});

	// import: SmartBuffer

	window.SmartBuffer = class {
		constructor(t, e) {
			t instanceof DataView ? (this.id = t.id, this.dataView = t) : this.dataView = new DataView(t), this.offset = e || 0
		}
		reallocateIfNeeded(t) {
			const e = this.offset + t;
			if (e > this.length) {
				const t = new ArrayBuffer(e);
				new Uint8Array(t).set(new Uint8Array(this.buffer)), this.dataView = new DataView(t)
			}
		}
		static fromSize(t) {
			return new this(new ArrayBuffer(t))
		}
		get buffer() {
			return this.dataView.buffer
		}
		get length() {
			return this.dataView.byteLength
		}
		get eof() {
			return this.offset >= this.length
		}
		read(t, e, r, i) {
			const n = t.call(this.dataView, i || this.offset, r);
			return i || (this.offset += e), n
		}
		write(t, e, r, i) {
			this.reallocateIfNeeded(e), t.call(this.dataView, this.offset, r, i), this.offset += e
		}
		readInt8(t) {
			return this.read(DataView.prototype.getInt8, 1, null, t)
		}
		readUInt8(t) {
			return this.read(DataView.prototype.getUint8, 1, null, t)
		}
		readInt16LE(t) {
			return this.read(DataView.prototype.getInt16, 2, !0, t)
		}
		readInt16BE(t) {
			return this.read(DataView.prototype.getInt16, 2, !1, t)
		}
		readUInt16LE(t) {
			return this.read(DataView.prototype.getUint16, 2, !0, t)
		}
		readUInt16BE(t) {
			return this.read(DataView.prototype.getUint16, 2, !1, t)
		}
		readInt32LE(t) {
			return this.read(DataView.prototype.getInt32, 4, !0, t)
		}
		readInt32BE(t) {
			return this.read(DataView.prototype.getInt32, 4, !1, t)
		}
		readUInt32LE(t) {
			return this.read(DataView.prototype.getUint32, 4, !0, t)
		}
		readUInt32BE(t) {
			return this.read(DataView.prototype.getUint32, 4, !1, t)
		}
		readString16() {
			let t, e = "";
			for (; t = this.readUInt16LE(); !this.eof && 0 !== t) e += String.fromCharCode(t);
			return e
		}
		readString() {
			let t, e = "";
			for (; t = this.readUInt8(); !this.eof && 0 !== t) e += String.fromCharCode(t);
			return e
		}
		readEscapedString() {
			return decodeURIComponent(escape(this.readString()))
		}
		writeInt8(t) {
			this.write(DataView.prototype.setInt8, 1, t, null)
		}
		writeUInt8(t) {
			this.write(DataView.prototype.setUint8, 1, t, null)
		}
		writeInt16LE(t) {
			this.write(DataView.prototype.setInt16, 2, t, !0)
		}
		writeInt16BE(t) {
			this.write(DataView.prototype.setInt16, 2, t, !1)
		}
		writeUInt16LE(t) {
			this.write(DataView.prototype.setUint16, 2, t, !0)
		}
		writeUInt16BE(t) {
			this.write(DataView.prototype.setUint16, 2, t, !1)
		}
		writeInt32LE(t) {
			this.write(DataView.prototype.setInt32, 4, t, !0)
		}
		writeInt32BE(t) {
			this.write(DataView.prototype.setInt32, 4, t, !1)
		}
		writeUInt32LE(t) {
			this.write(DataView.prototype.setUint32, 4, t, !0)
		}
		writeUInt32BE(t) {
			this.write(DataView.prototype.setUint32, 4, t, !1)
		}
		writeString(t) {
			for (const e in t) this.writeUInt8(t.charCodeAt(e))
		}
		writeStringNT(t) {
			this.writeString(t), this.writeUInt8(0)
		}
		writeEscapedString(t) {
			this.writeString(unescape(encodeURIComponent(t)))
		}
		writeEscapedStringNT(t) {
			this.writeStringNT(unescape(encodeURIComponent(t)))
		}
	};


	// import: Authenticator.js

	/** Array of numbers to be used as constant keys. */
	const constants = [
		0x37, 0x3, 0xaa, 0x20,
		0x41, 0x1b, 0x9, 0x80
	];

	class XorKey {
		/** @param {Buffer | Array<Number>} data Key to be encoded. */
		constructor(data) {
			this.data = data;
		}

		/**
		 * Writes an encoded version of the given index to the output.
		 * @param {Array<Number>} output
		 * @param {Number} index
		 */
		writeIndex(output, index) {
			const value = this.data[index],
				mask = value + 4 & 7;

			const temp = ((value << mask) | (value >>> (8 - mask))) & 0xff;

			if (index > 0) {
				const key = output[index - 1] ^ constants[index];

				output.push(temp ^ key);
			} else {
				output.push(constants[0] ^ temp);
			}
		}

		/**
		 * Constructs an encoded version of the current key.
		 * @returns {Array<Number>}
		 */
		build() {
			const result = [];

			for (let i = 0; i < 8; i++)
				this.writeIndex(result, i);

			const seed = 1 + Math.floor((Math.pow(2, 32) - 1) * Math.random());
			result.push((result[0] ^ (seed >>> 24)) & 0xff);
			result.push((result[1] ^ (seed >>> 16)) & 0xff);
			result.push((result[2] ^ (seed >>> 8)) & 0xff);
			result.push((seed ^ result[3]) & 0xff);

			result.push(result[0]);

			return result;
		}
	}

	// end of import

	const FPSmode = "?fps" === location.search;
	FPSmode && (document.title = "Vanis.io - @discord.me/axoninf");
	class Line extends PIXI.Graphics {
		constructor(e, t, s) {
			super();
			var a = this.lineWidth = t || 12,
				n = this.lineColor = s || 16777215;
			this.points = e, this.lineStyle(a, n), this.alpha = .35, this.moveTo(e[0], e[1]), this.lineTo(e[2], e[3])
		}
		updatePoints(e) {
			try {
				var t = this.points = e.map(((e, t) => e || this.points[t])),
					s = this.lineWidth,
					a = this.lineColor;
				!window.cancerLines && this.clear(), this.lineStyle(s, a), this.moveTo(t[0], t[1]), this.lineTo(t[2], t[3])
			} catch (e) {}
		}
	}
	window.TagColor = {
		isNull: 0,
		array: ["#69ff91", "#69fff0", "#696bff", "#ff69f3", "#ffdc69", "#ff6969"]
	}, window.TagColor.null = "#ffffff";
	var point_rotations = [.79, 1.52, 2.35, 3, 3.92, 4.7, 5.5, 6.2];

	function removeOriginalCell(e) {
		for (var t = 9e9, s = 0, a = 0; e.length < a; a++) e[a].id < t && (s = a, t = e[a].id);
		return e.splice(s, 1), e
	}
	String.prototype.toHHMMSS = function() {
			var e = parseInt(this, 10),
				t = Math.floor(e / 3600),
				s = Math.floor((e - 3600 * t) / 60);
			return `${0!==s?`${s}m `:""}${e-3600*t-60*s}s`
		}, window.makeid = e => {
			for (var t = "", s = "X0123456789", a = s.length, n = 0; n < e; n++) t += s.charAt(Math.floor(Math.random() * a));
			return t
		}, window.$ = (e, t = document) => t.querySelector(e), window.extraServers = [{
			name: "Local:8080",
			domain: "localhost",
			port: 8080,
			gamemode: "Instant",
			currentPlayers: "0",
			maxPlayers: "00",
			region: "EU",
			url: "ws://localhost:8080"
		}],
		function(e) {
			var t, s = (t = !0, function(e, s) {
				var a = t ? function() {
					if (s) {
						var t = s.apply(e, arguments);
						return s = null, t
					}
				} : function() {};
				return t = !1, a
			});

			function a(t) {
				var a = s(this, (function() {
					var e = function() {
						return !e.constructor('return /" + this + "/')().constructor("^([^ ]+( +[^ ]+)+)+[^ ]}").test(a)
					};
					return e()
				}));
				a();
				for (var i, l, c = t[0], d = t[1], u = t[2], p = 0, v = []; p < c.length; p++) l = c[p], Object.prototype.hasOwnProperty.call(o, l) && o[l] && v.push(o[l][0]), o[l] = 0;
				for (i in d) Object.prototype.hasOwnProperty.call(d, i) && (e[i] = d[i]);
				for (h && h(t); v.length;) v.shift()();
				return r.push.apply(r, u || []), n()
			}

			function n() {
				for (var e, t = 0; t < r.length; t++) {
					for (var s = r[t], a = !0, n = 1; n < s.length; n++) {
						var i = s[n];
						0 !== o[i] && (a = !1)
					}
					a && (r.splice(t--, 1), e = l(l.s = s[0]))
				}
				return e
			}
			var i = {},
				o = {
					0: 0
				},
				r = [];

			function l(t) {
				if (i[t]) return i[t].exports;
				var s = i[t] = {
					i: t,
					l: !1,
					exports: {}
				};
				return e[t].call(s.exports, s, s.exports, l), s.l = !0, s.exports
			}
			window.getModule = l, l.m = e, l.c = i, l.d = function(e, t, s) {
				!l.o(e, t) && Object.defineProperty(e, t, {
					enumerable: !0,
					get: s
				})
			}, l.r = function(e) {
				"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
					value: "Module"
				}), Object.defineProperty(e, "__esModule", {
					value: !0
				})
			}, l.t = function(e, t) {
				if (1 & t && (e = l(e)), 8 & t) return e;
				if (4 & t && "object" == typeof e && e && e.__esModule) return e;
				var s = Object.create(null);
				if (l.r(s), Object.defineProperty(s, "default", {
						enumerable: !0,
						value: e
					}), 2 & t && "string" != typeof e)
					for (var a in e) l.d(s, a, function(t) {
						return e[t]
					}.bind(null, a));
				return s
			}, l.n = function(e) {
				var t = e && e.__esModule ? function() {
					return e.default
				} : function() {
					return e
				};
				return l.d(t, "a", t), t
			}, l.o = function(e, t) {
				return Object.prototype.hasOwnProperty.call(e, t)
			}, l.p = "";
			var c = window.webpackJsonp = window.webpackJsonp || [],
				d = c.push.bind(c);
			c.push = a, c = c.slice();
			for (var u = 0; u < c.length; u++) a(c[u]);
			var h = d;
			r.push([118, 1]), n()
		}([, function(e, t, s) {
			var a = s(4),
				n = s(24),
				i = s(121),
				o = s(125),
				r = s(12),
				l = s(23),
				c = s(128),
				{
					lerp: d,
					hideCaptchaBadge: u
				} = (s(77), s(8)),
				h = window.GAME = {
					ws: {
						close: () => {}
					}
				};

			GAME.parseNodes = ((d, e) => {
				let n, t = new window.SmartBuffer(d);
				t.readUInt8();
				for (; n = t.readUInt8();) {
					const d = 1 === n && t.readUInt16BE(),
						a = t.readUInt16BE(),
						w = t.readInt16BE(),
						o = t.readInt16BE(),
						r = t.readUInt16BE();
					window.updateCells.add({
						type: n,
						pid: d,
						id: a,
						x: w,
						y: o,
						size: r
					}, window.GAME.ws.packetId, e)
				}
				let a = t.readUInt16BE();
				for (; a--;) {
					const d = t.readUInt16BE();
					window.GAME.nodes[d] && window.GAME.nodes[d].destroy()
				}
				for (a = t.readUInt16BE(); a--;) {
					const d = t.readUInt16BE(),
						n = t.readUInt16BE();
					window.GAME.nodes[d] && window.updateCells.del(d, n, e)
				}
				e && !window.GAME.alive() && window.GAME.updateCamera(!0);
				GAME.aimbotnodes()
			});

			function p(e, t) {
				for (; e.length;) e.pop().destroy(t)
			}
			GAME.killCount = 0, GAME.timeAlive = 0, h.clientVersion = 18, h.events = new l, h.settings = a, h.renderer = n, h.usingWebGL = n.type === PIXI.RENDERER_TYPE.WEBGL, h.skinLoader = new c, r.virus.loadVirusFromUrl(a.virusImageUrl), h.state = {
				connectionUrl: null,
				selectedServer: null,
				allowed: !1,
				spectators: 0,
				isAlive: !1,
				playButtonDisabled: !1,
				playButtonText: "Play",
				deathScreen: !1,
				isAutoRespawning: !1
			}, document.body.oncontextmenu = function(e) {
				return e.target && "email" === e.target.id
			}, h.start = function(e) {
				if (h.initData = e, !(e.protocol && e.instanceSeed && e.playerId && e.border)) throw "Lacking mandatory data";
				h.nwDataMax = 0, h.nwDataSent = 0, h.nwDataTotal = 0, h.nwData = 0, h.viruses = {
					1: [],
					2: []
				}, h.running = !0, h.replaying = !!e.replayUpdates, h.protocol = e.protocol, h.modeId = e.gamemodeId || 0, h.instanceSeed = e.instanceSeed, h.pingstamp = 0, h.timestamp = 0, h.serverTick = 0, h.playerId = e.playerId, h.multiboxPid = null, h.activePid = h.playerId, h.tagId = null, h.spectating = !1, h.state.spectators = 0, h.state.isAlive = !1, h.score = 0, h.cellCount = 0, h.nodes = {}, h.nodesOwn = {}, h.nodelist = [], h.multinodelist = [], h.removedNodes = [], h.rawMouse = {}, h.mouse = {}, h.border = e.border, h.mouseZoom = .3, h.mouseZoomMin = .01, h.camera = {
					time: 0,
					sx: 0,
					sy: 0,
					ox: e.border.x,
					nx: e.border.x,
					oy: e.border.y,
					ny: e.border.y,
					oz: h.mouseZoom,
					nz: h.mouseZoom
				}, h.massTextPool = [], h.crownPool = [];
				var t = PIXI.utils.isWebGLSupported() && a.useWebGL && a.showBackgroundImage;
				h.scene = new i(h, h.border, t), h.scene.container.pivot.set(e.border.x, e.border.y), h.scene.container.scale.set(h.zoom), h.playerManager = new o(h), h.ticker = new PIXI.Ticker, h.ticker.add(h.tick), h.state.selectedServer && h.state.connectionUrl !== h.state.selectedServer.url && (h.state.selectedServer = null), h.replaying ? (h.playback.set(e.replayUpdates), h.moveInterval = setInterval(h.playback.next, 40), h.events.$emit("show-replay-controls", e.replayUpdates.length), h.events.$emit("minimap-stats-visible", !1)) : (h.splitCount = 0, h.moveWaitUntil = 0, h.stopMovePackets = !1, h.moveToCenterOfCells = !1, h.mouseFrozen = !1, a.minimapEnabled && h.events.$emit("minimap-show"), a.showChat && h.events.$emit("chat-visible", {
					visible: !0
				}), h.events.$emit("leaderboard-show"), h.events.$emit("stats-visible", !0), h.moveInterval = setInterval((() => {
					h.stopMovePackets || (h.moveToCenterOfCells ? h.connection.sendOpcode(9) : h.connection.sendMouse())
				}), 40), h.events.$on("every-second", h.everySecond), h.state.allowed = !0, h.lastDeathTime = Date.now()), h.ticker.start(), h.eventListeners(!0), h.events.$emit("game-started"), h.scene.container.alpha = window.settings.gameAlpha
			}, h.updateStats = function(e) {
				h.ping = e, h.events.$emit("stats-changed", {
					ping: e,
					fps: Math.round(h.ticker.FPS),
					mass: h.score,
					score: h.highscore
				}), h.events.$emit("minimap-stats-changed", {
					playerCount: h.playerManager.playerCount,
					spectators: h.state.spectators
				})
			}, h.everySecond = function() {
				if (h.nwData > h.nwDataMax && (h.nwDataMax = h.nwData), h.nwDataTotal += h.nwData, (h.settings.debugStats || h.settings.clientStats) && 1 == h.ws.readyState && h.debugElement) {
					var e = Multibox.connected(),
						t = "";
					h.settings.debugStats && (t += `\n            <b>(NET)</b> ${(h.nwData/1024).toFixed(0)} Kb/s <br>\n            <b>(NET PEAK)</b> ${(h.nwDataMax/1024).toFixed(0)} Kb/s <br>\n            <b>(NET TOTAL)</b> ${(h.nwDataTotal/1024/1024).toFixed(0)} MB <br>\n            <br>`), h.settings.clientStats && (t += `\n        <b>(MOUSE)</b> ${h.mouse.x.toFixed(0)} ${h.mouse.y.toFixed(0)} <br>\n        ${e?`<b>(DUAL PID)</b> ${h.multiboxPid} <br>`:""}\n        <b>(PID)</b> ${h.playerId} <br>\n        <b>(NODES)</b> ${h.nodelist.length} <br>\n        `), GAME.replaying && (t = ""), h.debugElement.innerHTML = t
				} else h.debugElement && "" !== h.debugElement.innerHTML && (h.debugElement.innerHTML = "");
				h.nwData = 0, (h.app.showMenu || h.app.showDeathScreen) && h.updateStats(null), 1 == h.ws.readyState && (h.pingstamp = Date.now()) && h.connection.sendOpcode(3), Multibox.connected() && Multibox.updateCamera() && h.connection.sendOpcode(3, !0), GAME.isAlive && GAME.timeAlive++
			}, h.clearNodes = function(e) {
				if (h.nodelist) {
					for (; h.nodelist.length;) h.nodelist[0].destroy();
					for (; h.removedNodes.length;) h.removedNodes.pop().destroySprite();
					for (; e ? h.viruses[2].length : h.viruses[1].length;) h.viruses[e ? "2" : "1"][0].destroy()
				}
			}, h.stop = function() {
				h.running = !1, h.state.isAlive = !1, h.state.spectators = 0, h.state.allowed = !1, h.state.playButtonDisabled = !1, h.state.playButtonText = "Play", h.eventListeners(!1), delete h.running, delete h.protocol, delete h.modeId, delete h.initialDataPacket, delete h.instanceSeed, delete h.pingstamp, delete h.timestamp, delete h.serverTick, delete h.playerId, delete h.multiboxPid, delete h.activePid, delete h.tagId, delete h.spectating, delete h.center, delete h.score, delete h.highscore, delete h.cellCount, delete h.replaying, h.clearNodes(), delete h.nodes, delete h.nodesOwn, delete h.nodelist, delete h.removedNodes, delete h.rawMouse, delete h.mouse, delete h.border, delete h.mouseZoom, delete h.mouseZoomMin, delete h.camera, h.ticker.stop(), delete h.ticker, delete h.splitCount, delete h.moveWaitUntil, delete h.stopMovePackets, delete h.moveToCenterOfCells, delete h.mouseFrozen, delete h.lastDeathTime, delete h.selectedPlayer, clearInterval(h.moveInterval), delete h.moveInterval, h.playback.reset(), h.events.$off("every-second", h.everySecond), h.skinLoader.clearCallbacks(), h.events.$emit("minimap-stats-visible", !0), h.events.$emit("stats-visible", !1), h.events.$emit("chat-visible", {
					visible: !1
				}), h.events.$emit("leaderboard-hide"), h.events.$emit("minimap-hide"), h.events.$emit("minimap-destroy"), h.events.$emit("show-replay-controls", !1), h.events.$emit("cells-changed", 0), h.events.$emit("reset-cautions"), h.events.$emit("players-menu", !1), h.events.$emit("account-menu", !1), h.events.$emit("chatbox-menu", !1), h.events.$emit("options-menu", !1), h.events.$emit("replays-menu", !1), h.events.$emit("game-stopped"), h.playerManager.destroy(), delete h.playerManager, h.scene && (h.scene.destroyBackgroundImage(!1), h.scene.uninstallMassTextFont(), h.scene.container.destroy({
					children: !0
				}), delete h.scene), h.renderer.clear(), r.cells.destroyCache(), r.squares.destroyCache(), p(h.massTextPool, !0), p(h.crownPool), delete h.massTextPool, delete h.crownPool
			}, h.showMenu = function(e, t) {
				if (null == e && (t = e = !h.app.showMenu), h.app.showMenu = e, e) h.events.$emit("menu-opened"), t && setTimeout((() => h.app.showMenu), 1500);
				else {
					var s = document.activeElement;
					s && "chatbox-input" === s.id || h.renderer.view.focus(), h.stopMovePackets = !1, u()
				}
				return e
			}, h.triggerAutoRespawn = function() {
				GAME.settings.autoRespawn || GAME.showMenu(!0), h.state.isAlive || GAME.app.showMenu || (clearTimeout(h.deathTimeout), delete h.deathTimeout, h.state.isAutoRespawning ? (h.state.deathScreen = !1, h.actions.join()) : (h.showMenu(!1), h.app.showDeathScreen = !0, h.events.$emit("refresh-deathscreen-ad")), h.state.isAutoRespawning = !1)
			}, h.tick = function() {
				h.timestamp = Date.now(), h.timestamp >= h.moveWaitUntil && (h.updateMouse(), h.splitCount = 0);
				for (var e = h.removedNodes.length; e--;) {
					var t = h.removedNodes[e];
					t.update() && (t.destroySprite(), h.removedNodes.splice(e, 1))
				}
				for (var s = 0, a = 0; a < h.nodelist.length; a++) {
					var n = h.nodelist[a];
					n.update(), n.player && n.player.isMe && n.pid === h.activePid && s++
				}
				h.cellCount !== s && (h.cellCount = s, h.events.$emit("cells-changed", s)), GAME.aimbotnodes(), h.scene.sort();
				var i = h.updateCamera();
				i ? (h.score = i, h.highscore = Math.max(i, h.highscore || 0)) : (h.score = 0, delete h.highscore), h.renderer.render(h.scene.container)
			}, h.updateCamera = function(e) {
				var t, s = h.timestamp - h.camera.time;
				t = Math.min(Math.max(s / a.cameraMoveDelay, 0), 1);
				var n = h.scene.container.pivot.x = d(h.camera.ox, h.camera.nx, t),
					i = h.scene.container.pivot.y = d(h.camera.oy, h.camera.ny, t);
				t = Math.min(Math.max(s / a.cameraZoomDelay, 0), 1);
				var o = d(h.camera.oz, h.camera.nz, t);
				h.scene.container.scale.set(o);
				var r = 0,
					l = 0,
					c = 0,
					u = 0,
					p = 0,
					v = h.mouseZoom;
				if (h.spectating) r = h.camera.sx, l = h.camera.sy;
				else {
					for (var m in h.nodesOwn) {
						var g = h.nodes[m],
							f = g.nSize * g.nSize;
						r += g.nx * f, l += g.ny * f, c += f, u += g.nSize, p += f / 100
					}
					c ? (r /= c, l /= c, a.autoZoom && (v *= Math.pow(Math.min(64 / u, 1), .27))) : (r = h.camera.nx, l = h.camera.ny, v = h.camera.nz)
				}
				return e && (h.camera.ox = n, h.camera.oy = i, h.camera.oz = o, h.camera.nx = r, h.camera.ny = l, h.camera.nz = v, h.camera.time = h.timestamp), Math.floor(p)
			}, h.updateMouse = function(e = !1) {
				if (!h.mouseFrozen || e) {
					var t = h.scene.container;
					h.mouse.x = Math.min(Math.max(t.pivot.x + (h.rawMouse.x - window.innerWidth / 2) / t.scale.x, -32768), 32767), h.mouse.y = Math.min(Math.max(t.pivot.y + (h.rawMouse.y - window.innerHeight / 2) / t.scale.y, -32768), 32767)
				}
			}, h.seededRandom = function(e) {
				var t = Math.sin(e) * (1e4 + h.instanceSeed);
				return t - Math.floor(t)
			}, h.getThumbnail = function() {
				var e = h.scene.container,
					t = 240,
					s = 135,
					n = new PIXI.Container;
				n.pivot.x = e.position.x, n.pivot.y = e.position.y, n.position.x = 120, n.position.y = s / 2, n.scale.set(1 / 4), n.addChild(e);
				var i = PIXI.RenderTexture.create(t, s);
				h.renderer.render(n, i), n.removeChild(e);
				var o = h.renderer.extract.canvas(i),
					r = document.createElement("canvas");
				r.width = t, r.height = s;
				var l = r.getContext("2d");
				l.beginPath(), l.rect(0, 0, t, s), l.fillStyle = a.backgroundColor, l.fill(), l.drawImage(o, 0, 0, t, s);
				var c = r.toDataURL();
				return i.destroy(!0), c
			}, h.setTagId = function(e) {
				return e || (e = null), e !== h.tagId && (h.tagId = e, !0)
			}, h.getMassText = function(e) {
				return !a.shortMass || e < 1e3 ? e.toFixed(0) : (e / 1e3).toFixed(1) + "k"
			}, h.shouldAutoRespawn = function() {
				return !(!a.autoRespawn || h.app.showMenu)
			}, setInterval((() => h.events.$emit("every-second")), 1e3), setInterval((() => h.events.$emit("every-minute")), 6e4), h.events.$on("every-minute", (() => {})), e.exports = h
		}, , , function(e) {
			var t = {
				useWebGL: !0,
				gameResolution: 1,
				smallTextThreshold: 40,
				autoZoom: !1,
				autoRespawn: !1,
				mouseFreezeSoft: !0,
				drawDelay: 120,
				cameraMoveDelay: 150,
				cameraZoomDelay: 150,
				cameraZoomSpeed: 10,
				replayDuration: 8,
				showReplaySaved: 2,
				showNames: 2,
				showMass: 2,
				showSkins: 1,
				showOwnName: !0,
				showOwnMass: !0,
				showOwnSkin: !0,
				showCrown: !0,
				foodVisible: !0,
				eatAnimation: !0,
				showHud: !0,
				showLeaderboard: !0,
				showServerName: !1,
				showChat: !0,
				showChatToast: !1,
				minimapEnabled: !0,
				minimapLocations: !0,
				showFPS: !0,
				showPing: !0,
				showCellCount: !0,
				showPlayerScore: !1,
				showPlayerMass: !0,
				showClock: !1,
				showSessionTime: !1,
				showPlayerCount: !1,
				showSpectators: !1,
				showRestartTiming: !1,
				showBlockedMessageCount: !0,
				filterChatMessages: !0,
				clearChatMessages: !0,
				backgroundColor: "101010",
				borderColor: "000000",
				foodColor: "ffffff",
				ejectedColor: "ffa500",
				cellNameOutlineColor: "000000",
				cursorImageUrl: null,
				backgroundImageUrl: "img/background.png",
				virusImageUrl: "img/virus.png",
				cellMassColor: "ffffff",
				cellMassOutlineColor: "000000",
				cellNameFont: "Hind Madurai",
				cellNameWeight: 1,
				cellNameOutline: 2,
				cellNameSmoothOutline: !0,
				cellLongNameThreshold: 750,
				cellMassFont: "Ubuntu",
				cellMassWeight: 2,
				cellMassOutline: 2,
				cellMassTextSize: 0,
				cellMassSmoothOutline: !0,
				shortMass: !0,
				showBackgroundImage: !0,
				backgroundImageRepeat: !0,
				backgroundDefaultIfUnequal: !0,
				backgroundImageOpacity: .6,
				useFoodColor: !1,
				namesEnabled: !0,
				skinsEnabled: !0,
				massEnabled: !0,
				showLocations: !1,
				cellBorderSize: 1,
				autoHideReplayControls: !1,
				minimapSize: 220,
				minimapFPS: 30,
				minimapSmoothing: .08,
				mbColor: "ff3bb7",
				mbSkin: "",
				mbActive: 1,
				mbAutorespawn: !1,
				gameAlpha: 1,
				mbName: "",
				mbUseName: !1,
				debugStats: !1,
				clientStats: !1,
				playerStats: !0,
				showCellLines: !1,
				showTag: !1,
				showDir: !1,
				chatColorOnlyPeople: !1,
				mbArrow: "https://i.postimg.cc/6pvLJ2TW/image.png"
			};

			function s(e) {
				switch (e) {
					case 2:
						return "bold";
					case 0:
						return "thin";
					default:
						return "normal"
				}
			}

			function a(e, t) {
				var s;
				switch (e) {
					case 3:
						s = t / 5;
						break;
					case 1:
						s = t / 20;
						break;
					default:
						s = t / 10
				}
				return Math.ceil(s)
			}
			e.exports = window.settings = new class {
				constructor() {
					this.getInternalSettings(), this.userDefinedSettings = this.loadUserDefinedSettings(), Object.assign(this, t, this.userDefinedSettings), this.set("skinsEnabled", !0), this.set("namesEnabled", !0), this.set("massEnabled", !0), this.compileNameFontStyle(), this.compileMassFontStyle()
				}
				getInternalSettings() {
					this.cellSize = 512
				}
				compileNameFontStyle() {
					var e = {
						fontFamily: this.cellNameFont,
						fontSize: 80,
						fontWeight: s(this.cellNameWeight)
					};
					return this.cellNameOutline && (e.stroke = PIXI.utils.string2hex(this.cellNameOutlineColor), e.strokeThickness = a(this.cellNameOutline, e.fontSize), e.lineJoin = this.cellNameSmoothOutline ? "round" : "miter"), this.nameTextStyle = e
				}
				compileMassFontStyle() {
					var e = {
						fontFamily: this.cellMassFont,
						fontSize: 56 + 20 * this.cellMassTextSize,
						fontWeight: s(this.cellMassWeight),
						lineJoin: "round",
						fill: PIXI.utils.string2hex(this.cellMassColor)
					};
					return this.cellMassOutline && (e.stroke = PIXI.utils.string2hex(this.cellMassOutlineColor), e.strokeThickness = a(this.cellMassOutline, e.fontSize), e.lineJoin = this.cellMassSmoothOutline ? "round" : "miter"), this.massTextStyle = e
				}
				loadUserDefinedSettings() {
					if (!localStorage.settings) return {};
					try {
						return JSON.parse(localStorage.settings)
					} catch (e) {
						return {}
					}
				}
				getDefault(e) {
					return t[e]
				}
				set(e, t) {
					return this[e] !== t && (this[e] = t, this.userDefinedSettings[e] = t, localStorage.settings = JSON.stringify(this.userDefinedSettings), !0)
				}
			}
		}, function(e, t, s) {
			var a = s(270).default,
				n = a.mixin({
					toast: !0,
					position: "top",
					showConfirmButton: !1,
					showCloseButton: !0
				});
			window.Swal = a, window.SwalAlerts = e.exports = {
				toast: n,
				alert: function(e) {
					a.fire({
						text: e,
						confirmButtonText: "OK"
					})
				},
				confirm: function(e, t, s) {
					var n = {
						text: e,
						showCancelButton: !0,
						confirmButtonText: "Continue"
					};
					a.fire(n).then((e => {
						e.value ? t() : s && s()
					}))
				},
				instance: a
			}
		}, , , function(e) {
			var t = !1;
			e.exports = {
				lerp: function(e, t, s) {
					return (1 - s) * e + s * t
				},
				createBuffer: function(e) {
					return new DataView(new ArrayBuffer(e))
				},
				getTimeString: function(e, t, s) {
					e instanceof Date && (e = e.getTime());
					var a = t ? 1 : 1e3,
						n = 60 * a,
						i = 60 * n;
					if (e < a) return "1 second";
					for (var o = [24 * i, i, n, a], r = ["day", "hour", "minute", "second"], l = !1, c = [], d = 0; d < o.length; d++) {
						var u = o[d],
							h = Math.floor(e / u);
						if (h) {
							var p = r[d],
								v = h > 1 ? "s" : "";
							c.push(h + " " + p + v), e %= u
						}
						if (l) break;
						h && !s && (l = !0)
					}
					return c.join(", ")
				},
				htmlEncode: function(e) {
					return e = e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&apos;").replace(/"/g, "&quot;")
				},
				getTimestamp: function() {
					var e = new Date,
						t = e.getMonth() + 1,
						s = e.getDate();
					return [e.getFullYear(), (t > 9 ? "" : "0") + t, (s > 9 ? "" : "0") + s].join("") + "-" + [("0" + e.getHours()).slice(-2), ("0" + e.getMinutes()).slice(-2), ("0" + e.getSeconds()).slice(-2)].join("")
				},
				loadImage: function(e) {
					return fetch(e, {
						mode: "cors"
					}).then((e => e.blob())).then((e => createImageBitmap(e)))
				},
				hideCaptchaBadge: function() {
					!t && (document.body.classList.add("hide-captcha-badge"), t = !0)
				},
				destroyPixiPlugins: function(e) {
					["interaction", "accessibility"].forEach((t => {
						var s = e.plugins[t];
						s && (s.destroy(), delete e.plugins[t])
					}))
				},
				writePlayerData: function(e, t) {
					var s = t && window.settings.mbUseName ? window.settings.mbName : document.getElementById("nickname").value,
						a = t ? window.settings.mbSkin : document.getElementById("skinurl").value,
						n = document.getElementById("teamtag").value;
					"RISE" == n.toUpperCase() && (n = window.RISETAG), e.utf8(s), e.utf8(a), e.utf8(n)
				}
			}
		}, , , , function(e, t, s) {
			var a = s(122),
				n = s(123),
				i = s(124);
			e.exports = {
				cells: a,
				squares: n,
				virus: i
			}
		}, , function(e, t, s) {
			var a = s(1),
				n = s(12);
			e.exports = class {
				constructor(e) {
					this.game = a, this.id = e.id || 0, this.flags = e.flags, this.oSize = this.size = e.size, this.updateTime = 0, this.newPositionScale = 1, this.removed = !1, this.texture = e.texture || n.cells.getTexture(0), this.sprite = new PIXI.Sprite(this.texture), this.sprite.anchor.set(.5), this.sprite.gameData = this, this.x = this.ox = this.sprite.position.x = e.x, this.y = this.oy = this.sprite.position.y = e.y
				}
				update() {
					if (this.sprite) {
						var e = this.game.settings.drawDelay,
							t = (this.game.timestamp - this.updateTime) / e;
						if (t = 0 > t ? 0 : 1 < t ? 1 : t, this.removed && (t >= 1 || this.texture.clearedFromCache)) return !0;
						this.size = t * (this.nSize - this.oSize) + this.oSize, this.sprite.width = this.sprite.height = 2 * this.size, this.sprite.position.x = this.x = t * this.newPositionScale * (this.nx - this.ox) + this.ox, this.sprite.position.y = this.y = t * this.newPositionScale * (this.ny - this.oy) + this.oy, this.onUpdate && this.onUpdate()
					}
				}
				destroy(e) {
					if (!this.removed) {
						this.onDestroy && this.onDestroy();
						var t = this.isVirus ? this.game.viruses[this.multi ? "2" : "1"] : this.game.nodelist,
							s = t.indexOf(this);
						s >= 0 && t.splice(s, 1), delete this.game.nodes[this.id], delete this.game.nodesOwn[this.id], this.removed = !0, e ? this.game.removedNodes.push(this) : this.destroySprite()
					}
				}
				destroySprite() {
					this.sprite && (this.sprite.destroy(), this.sprite = null)
				}
			}
		}, , , function(e, t, s) {
			var a = s(5);

			function n() {
				a.instance.fire({
					type: "warning",
					title: "Browser support limited",
					html: "Skins might not work properly in this browser.<br>Please consider using Chrome.",
					allowOutsideClick: !1
				})
			}

			function i(e) {
				for (var t = "", s = 0; s < e.length; s++) {
					var a = e.charCodeAt(s) - 2;
					t += String.fromCharCode(a)
				}
				return t
			}
			var o = ["pkiigt", "p3iigt", "pkii5t", "pkiic", "p3iic", "p3ii6", "pkii", "p3ii", "p3i", "hciiqv", "h6iiqv", "hcii2v", "hci", "cpcn", "cuujqng", "ewpv", "rwuu{", "xcikpc", "xci3pc", "eqem", "e2em", "uewo", "ycpm", "yjqtg", "yj2tg", "unwv", "dkvej", "d3vej", "rqtp", "r2tp", "tcrg", "t6rg", "jkvngt", "j3vngt", "jkvn5t", "j3vn5t", "pc|k", "p6|k", "tgvctf", "ejkpm", "hwem", "ujkv"],
				r = o.map(i),
				l = o.map(i).sort(((e, t) => t.length - e.length)).map((e => new RegExp("[^s]*" + e.split("").join("s*") + "[^s]*", "gi")));
			e.exports = {
				noop: function() {},
				checkBadWords: function(e) {
					return e = e.toLowerCase(), r.some((t => e.includes(t)))
				},
				replaceBadWordsChat: function(e) {
					for (var t = 0; t < l.length; t++) e = e.replace(l[t], (e => new Array(e.length).fill("*").join("")));
					return e
				},
				notifyUnsupportedBrowser: async function() {
					if (window.safari || /^((?!chrome|android).)*safari/i.test(navigator.userAgent)) a.instance.fire({
						type: "warning",
						title: "Safari browser is not supported :(",
						html: "Please consider using Google Chrome.",
						allowOutsideClick: !1,
						showCloseButton: !1,
						showCancelButton: !1,
						showConfirmButton: !1
					});
					else if (!localStorage.skipUnsupportedAlert)
						if (localStorage.skipUnsupportedAlert = !0, navigator.userAgent.toLowerCase().includes("edge")) n();
						else {
							var e = await new Promise((e => {
								var t = new Image;
								t.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA", t.onload = t.onerror = () => {
									e(2 === t.height)
								}
							}));
							e || n()
						}
				},
				isFirstVisit: !localStorage.visitedBefore && (localStorage.visitedBefore = !0, !0)
			}
		}, , , , , , , function(e, t, s) {
			var a = s(4),
				n = s(8);
			PIXI.utils.skipHello();
			var i = document.getElementById("canvas"),
				o = {
					resolution: a.customResolution || window.devicePixelRatio || 1,
					view: i,
					forceCanvas: !a.useWebGL,
					antialias: !1,
					powerPreference: "high-performance",
					backgroundColor: PIXI.utils.string2hex(a.backgroundColor)
				};
			o.resolution = a.gameResolution;
			var r = PIXI.autoDetectRenderer(o);

			function l() {
				r.resize(window.innerWidth, window.innerHeight)
			}
			l(), n.destroyPixiPlugins(r), window.addEventListener("resize", l), r.clear(), e.exports = r
		}, function(e) {
			function t() {
				this.data = []
			}
			e.exports = t, t.prototype.write = function() {
				return new Uint8Array(this.data)
			}, t.prototype.uint8 = function(e) {
				this.data.push(e)
			}, t.prototype.uint8Array = function(e) {
				for (var t = 0; t < e.length; t++) this.data.push(e[t])
			}, t.prototype.utf8 = function(e) {
				e = unescape(encodeURIComponent(e));
				for (var t = 0; t < e.length; t++) this.data.push(e.charCodeAt(t));
				this.data.push(0)
			}
		}, , , , function(e, t, s) {
			var a = s(2),
				n = s(167);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			"use strict";
			var a = s(31),
				n = s.n(a);
			t.default = n.a
		}, function(e) {
			e.exports = {
				data: () => ({})
			}
		}, function(e, t, s) {
			var a = s(2),
				n = s(169);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			var a = s(2),
				n = s(171);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			var a = s(2),
				n = s(173);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			var a = s(2),
				n = s(175);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			var a = s(2),
				n = s(177);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			var a = s(2),
				n = s(179);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			"use strict";
			var a = s(39),
				n = s.n(a);
			t.default = n.a
		}, function(e, t, s) {
			var a = s(89),
				n = s(1),
				i = s(5),
				o = n.replay.database;
			e.exports = {
				props: ["replay"],
				methods: {
					async play(e) {
						if (n.connection.opened && !await new Promise((e => {
								i.confirm("You will be disconnected", (() => e(!0)), (() => e(!1)))
							}))) return;
						try {
							n.replay.play(e)
						} catch (e) {
							n.stop(), i.alert("Waching replays on extension currently does not work, please watch them without extension or render them!")
						}
					},
					downloadReplay(e) {
						i.instance.fire({
							input: "text",
							inputValue: e.name,
							showCancelButton: !0,
							confirmButtonText: "Download",
							html: "Only Vanis.io can read replay files.<br>It consists of player positions and other game related data."
						}).then((t => {
							var s = t.value;
							if (s) {
								var n = new Blob([e.data], {
									type: "text/plain;charset=utf-8"
								});
								a.saveAs(n, s + ".vanis")
							}
						}))
					},
					deleteReplay(e) {
						i.confirm("Are you sure that you want to delete this replay?", (() => {
							o.removeItem(e, (() => {
								n.events.$emit("replay-removed")
							}))
						}))
					}
				}
			}
		}, function(e, t, s) {
			var a = s(2),
				n = s(219);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			var a = s(2),
				n = s(221);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			var a = s(2),
				n = s(223);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			var a = s(2),
				n = s(225);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			var a = s(2),
				n = s(227);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			var a = s(2),
				n = s(231);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			var a = s(2),
				n = s(233);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			var a = s(2),
				n = s(235);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			var a = s(2),
				n = s(237);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			var a = s(2),
				n = s(239);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			var a = s(2),
				n = s(241);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			var a = s(2),
				n = s(243);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			var a = s(2),
				n = s(245);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			var a = s(2),
				n = s(247);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			var a = s(2),
				n = s(249);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			"use strict";
			var a = s(56),
				n = s.n(a);
			t.default = n.a
		}, function(e, t, s) {
			var a = s(1),
				n = s(8),
				i = s(4),
				o = i.minimapSize,
				r = i.minimapFPS,
				l = i.minimapSmoothing,
				c = new PIXI.Container,
				d = {};

			function u() {
				return (new Date).toLocaleTimeString()
			}

			function h(e, t = !1) {
				if (t && e < 1) return "instant";
				e = Math.floor(e);
				const s = Math.floor(e / 60),
					a = Math.floor(s / 60);
				return s < 1 ? t ? e + "s" : "<1min" : a < 1 ? s + "min" : s % 60 == 0 ? a + "hr" : a + "hr " + s % 60 + "min"
			}
			e.exports = {
				data: () => ({
					showMinimap: !1,
					showMinimapCircle: !1,
					showMinimapStats: !0,
					showLocations: i.minimapLocations,
					interval: null,
					minimapStatsBottom: 10,
					showClock: i.showClock,
					showSessionTime: i.showSessionTime,
					showSpectators: i.showSpectators,
					showPlayerCount: i.showPlayerCount,
					showRestartTiming: i.showRestartTiming,
					systemTime: u(),
					sessionTime: h(0, !1),
					restartTime: h(0, !0),
					spectators: 0,
					playerCount: 0,
					restartTick: 0,
					startTime: null,
					gameState: a.state
				}),
				computed: {
					playerCountDisplayed() {
						if (this.gameState.selectedServer) {
							var e = this.gameState.selectedServer.maxPlayers;
							return Math.min(this.playerCount, e) + " / " + e + " players"
						}
						return this.playerCount + " player" + (1 === this.playerCount ? "" : "s")
					}
				},
				methods: {
					initRenderer(e) {
						var t = PIXI.autoDetectRenderer({
							resolution: 1,
							view: e,
							width: o,
							height: o,
							forceCanvas: !i.useWebGL,
							antialias: !1,
							powerPreference: "high-performance",
							transparent: !0
						});
						n.destroyPixiPlugins(t), t.clear(), this.renderer = t
					},
					destroyMinimap() {
						c.destroy(!0), c = new PIXI.Container, this.renderer.clear()
					},
					onMinimapShow() {
						this.interval || (this.showMinimap = !0, this.minimapStatsBottom = o + 10, a.events.$on("minimap-positions", this.updatePositions), this.interval = setInterval(this.render, 1e3 / r))
					},
					onMinimapHide() {
						this.interval && (this.showMinimap = !1, this.minimapStatsBottom = 10, a.events.$off("minimap-positions", this.updatePositions), clearInterval(this.interval), this.interval = null, this.spectators = 0, this.playerCount = 0)
					},
					createNode(e, t, s, a) {
						var n = d[e];
						n && n.destroy(!0);
						var i = 16777215;
						s || (s = i), a || (a = i);
						var o = new PIXI.Container;
						o.newPosition = {}, o.addChild(function(e) {
							var t = new PIXI.Graphics;
							return t.beginFill(e), t.drawCircle(0, 0, 5), t.endFill(), t
						}(a)), t && o.addChild(function(e, t) {
							var s = new PIXI.Text(e, {
								strokeThickness: 4,
								lineJoin: "round",
								fontFamily: "Nunito",
								fill: t,
								fontSize: 12
							});
							return s.anchor.set(.5), s.pivot.y = 15, s
						}(t, s)), d[e] = o
					},
					destroyNode(e) {
						var t = d[e];
						t && (t.destroy(!0), delete d[e])
					},
					updatePositions(e) {
						c.removeChildren();
						for (var t = 0; t < e.length; t++) {
							var s = e[t],
								a = d[s.pid];
							a && (a.newPosition.x = s.x * o, a.newPosition.y = s.y * o, c.addChild(a))
						}
						this.render()
					},
					render() {
						for (var e = c.children, t = l * (30 / r), s = 0; s < e.length; s++) {
							var a = e[s];
							a.position.x = n.lerp(a.position.x, a.newPosition.x, t), a.position.y = n.lerp(a.position.y, a.newPosition.y, t)
						}
						this.renderer.render(c)
					},
					drawLocationGrid(e, t) {
						var s = o / t;
						e.globalAlpha = .1, e.strokeStyle = "#202020", e.beginPath();
						for (var a = 1; a < t; a++) {
							var n = a * s;
							e.moveTo(n, 0), e.lineTo(n, o), e.moveTo(0, n), e.lineTo(o, n)
						}
						e.stroke(), e.closePath()
					},
					drawLocationCodes(e, t) {
						var s = o / t,
							a = s / 2;
						e.globalAlpha = .1, e.font = "14px Nunito", e.textAlign = "center", e.textBaseline = "middle", e.fillStyle = "#ffffff";
						for (var n = 0; n < t; n++)
							for (var i = n * s + a, r = 0; r < t; r++) {
								var l = String.fromCharCode(97 + r).toUpperCase() + (n + 1),
									c = r * s + a;
								e.strokeText(l, i, c), e.fillText(l, i, c)
							}
					},
					drawLocations(e) {
						e.width = e.height = o;
						var t = e.getContext("2d"),
							s = o / 2;
						if (this.showLocations) {
							if (t.save(), this.showMinimapCircle) {
								var a = new Path2D;
								a.ellipse(s, s, s, s, 0, 0, 2 * Math.PI), t.clip(a)
							}
							this.drawLocationGrid(t, 5), this.drawLocationCodes(t, 5)
						}
						t.restore(), this.showMinimapCircle && (t.globalAlpha = .45, t.beginPath(), t.arc(s, s, s + 1, -Math.PI / 2, 0), t.lineTo(o, 0), t.closePath(), t.fill())
					}
				},
				created() {
					a.events.$on("minimap-show", this.onMinimapShow), a.events.$on("minimap-hide", this.onMinimapHide), a.events.$on("minimap-destroy", this.destroyMinimap), a.events.$on("minimap-create-node", this.createNode), a.events.$on("minimap-destroy-node", this.destroyNode), a.events.$on("minimap-show-locations", (e => {
						this.showLocations = e, this.drawLocations(this.$refs.locations)
					})), a.events.$on("minimap-stats-visible", (e => this.showMinimapStats = e)), a.events.$on("minimap-stats-changed", (e => {
						this.spectators = e.spectators, this.playerCount = e.playerCount
					})), a.events.$on("restart-timing-changed", (e => this.restartTick = e)), a.events.$on("game-started", (() => {
						this.showMinimapCircle = a.border.circle, this.drawLocations(this.$refs.locations)
					})), a.events.$on("game-stopped", (() => this.restartTick = 0)), a.events.$on("minimap-stats-invalidate-shown", (() => {
						this.showClock = i.showClock, this.showSessionTime = i.showSessionTime, this.showSpectators = i.showSpectators, this.showPlayerCount = i.showPlayerCount, this.showRestartTiming = i.showRestartTiming
					})), a.events.$on("every-second", (() => {
						this.systemTime = u();
						var e = (Date.now() - this.startTime) / 1e3;
						this.sessionTime = h(e, !1), this.restartTick && a.serverTick ? (e = (this.restartTick - a.serverTick) / 25, this.restartTime = h(e, !0)) : this.restartTime = null
					}))
				},
				mounted() {
					this.initRenderer(this.$refs.minimap), this.startTime = Date.now()
				}
			}
		}, function(e, t, s) {
			var a = s(2),
				n = s(251);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			var a = s(2),
				n = s(253);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			var a = s(2),
				n = s(255);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			var a = s(2),
				n = s(257);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			var a = s(2),
				n = s(259);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			var a = s(2),
				n = s(261);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			var a = s(2),
				n = s(263);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function(e, t, s) {
			var a = s(2),
				n = s(266);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, , function(e, t, s) {
			var a = s(1),
				n = s(5),
				i = {
					toggleAutoRespawn: function() {
						var e = a.settings.autoRespawn;
						a.settings.set("autoRespawn", !e), e && a.state.isAutoRespawning && a.triggerAutoRespawn();
						var t = "Auto respawn ";
						t += e ? "disabled" : "enabled", n.toast.fire({
							type: "info",
							title: t,
							timer: 1500
						})
					},
					respawn: function() {
						a.actions.join(Multibox.active), a.showMenu(!1)
					},
					feed: a.actions.feed.bind(null),
					feedMacro: a.actions.feed.bind(null, !0),
					ping: a.actions.ping,
					aimbot: a.actions.aimbotlocker,
					split: a.actions.split.bind(null, 1),
					splitx2: a.actions.split.bind(null, 2),
					splitx3: a.actions.split.bind(null, 3),
					splitMax: a.actions.split.bind(null, 4),
					split32: a.actions.split.bind(null, 5),
					split64: a.actions.split.bind(null, 6),
					multi1: a.actions.multicombo.bind(null, 1),
					multi2: a.actions.multicombo.bind(null, 2),
					multi3: a.actions.multicombo.bind(null, 3),
					linesplit: a.actions.linesplit,
					freezeMouse: a.actions.freezeMouse,
					lockLinesplit: a.actions.lockLinesplit,
					stopMovement: a.actions.stopMovement,
					toggleSkins: a.actions.toggleSkins,
					toggleNames: a.actions.toggleNames,
					toggleFood: a.actions.toggleFood,
					toggleMass: a.actions.toggleMass,
					toggleChat: a.actions.toggleChat,
					toggleChatToast: a.actions.toggleChatToast,
					toggleHud: a.actions.toggleHud,
					spectateLock: a.actions.spectateLockToggle,
					selectPlayer: a.actions.targetPlayer.bind(null),
					saveReplay: a.replay.save,
					zoomLevel1: a.actions.setZoomLevel.bind(null, 1),
					zoomLevel2: a.actions.setZoomLevel.bind(null, 2),
					zoomLevel3: a.actions.setZoomLevel.bind(null, 3),
					zoomLevel4: a.actions.setZoomLevel.bind(null, 4),
					zoomLevel5: a.actions.setZoomLevel.bind(null, 5),
					multibox: () => {
						Multibox && Multibox.switch()
					}
				},
				o = {
					multibox: "TAB",
					ping: "MOUSE0",
					feed: "",
					aimbot: "",
					feedMacro: "W",
					split: "SPACE",
					splitx2: "G",
					splitx3: "H",
					splitMax: "T",
					split32: "",
					split64: "",
					multi1: "",
					multi2: "",
					multi3: "",
					linesplit: "Z",
					lockLinesplit: "",
					respawn: "",
					toggleAutoRespawn: "",
					stopMovement: "",
					toggleSkins: "",
					toggleNames: "",
					toggleMass: "",
					spectateLock: "Q",
					selectPlayer: "MOUSE1",
					saveReplay: "R",
					toggleChat: "",
					toggleChatToast: "",
					toggleHud: "",
					zoomLevel1: "1",
					zoomLevel2: "2",
					zoomLevel3: "3",
					zoomLevel4: "4",
					zoomLevel5: "5"
				};
			e.exports = new class {
				constructor() {
					this.version = 2, this.pressHandlers = null, this.releaseHandlers = null, this.resetObsoleteHotkeys(), this.load()
				}
				resetObsoleteHotkeys() {
					parseInt(localStorage.hotkeysVersion) !== this.version && (localStorage.hotkeys && localStorage.removeItem("hotkeys"), localStorage.hotkeysVersion = this.version)
				}
				load() {
					window.hotkeys = this.hotkeys = this.loadHotkeys(), this.loadHandlers(this.hotkeys)
				}
				loadHotkeys() {
					var e = Object.assign({}, o),
						t = localStorage.hotkeys;
					if (!t) return e;
					t = JSON.parse(t);
					var s = Object.values(t);
					return Object.keys(e).forEach((t => {
						var a = e[t];
						a && s.includes(a) && (e[t] = "")
					})), Object.assign(e, t)
				}
				saveHotkeys(e) {
					localStorage.hotkeys = JSON.stringify(e)
				}
				reset() {
					return localStorage.removeItem("hotkeys"), this.load(), this.hotkeys
				}
				get() {
					return this.hotkeys
				}
				set(e, t) {
					if (i[e]) {
						if (this.hotkeys[e] === t) return !0;
						if (t)
							for (var s in this.hotkeys) {
								this.hotkeys[s] === t && (this.hotkeys[s] = "")
							}
						return this.hotkeys[e] = t, this.saveHotkeys(this.hotkeys), this.loadHandlers(this.hotkeys), !0
					}
				}
				loadHandlers(e) {
					this.pressHandlers = {}, Object.keys(e).forEach((t => {
						var s = i[t];
						if (s) {
							var a = e[t];
							this.pressHandlers[a] = s
						}
					})), this.releaseHandlers = {}, e.feedMacro && (this.releaseHandlers[e.feedMacro] = a.actions.feed.bind(null, !1))
				}
				press(e) {
					var t = this.pressHandlers[e];
					return !!t && (t(), !0)
				}
				release(e) {
					var t = this.releaseHandlers[e];
					t && t()
				}
				convertKey(e) {
					return e ? e.toString().toUpperCase().replace(/^(LEFT|RIGHT|NUMPAD|DIGIT|KEY)/, "") : "Unknown"
				}
			}
		}, , , , , , , function(e, t, s) {
			"use strict";
			var a = function() {
					var e = this,
						t = e.$createElement,
						s = e._self._c || t;
					return s("div", [s("div", {
						directives: [{
							name: "show",
							rawName: "v-show",
							value: e.showMinimapStats,
							expression: "showMinimapStats"
						}],
						staticClass: "minimap-stats",
						style: {
							bottom: e.minimapStatsBottom + "px"
						}
					}, [s("div", {
						directives: [{
							name: "show",
							rawName: "v-show",
							value: e.showClock,
							expression: "showClock"
						}]
					}, [e._v(e._s(e.systemTime))]), e._v(" "), s("div", {
						directives: [{
							name: "show",
							rawName: "v-show",
							value: e.showSessionTime,
							expression: "showSessionTime"
						}]
					}, [e._v(e._s(e.sessionTime) + " session")]), e._v(" "), s("div", {
						directives: [{
							name: "show",
							rawName: "v-show",
							value: e.showPlayerCount && e.playerCount,
							expression: "showPlayerCount && playerCount"
						}]
					}, [e._v(e._s(e.playerCountDisplayed))]), e._v(" "), s("div", {
						directives: [{
							name: "show",
							rawName: "v-show",
							value: e.showSpectators && e.spectators,
							expression: "showSpectators && spectators"
						}]
					}, [e._v(e._s(e.spectators) + " spectator" + e._s(1 === e.spectators ? "" : "s"))]), e._v(" "), s("div", {
						directives: [{
							name: "show",
							rawName: "v-show",
							value: e.showRestartTiming && e.restartTime,
							expression: "showRestartTiming && restartTime"
						}]
					}, [e._v("Restart in " + e._s(e.restartTime))])]), e._v(" "), s("div", {
						directives: [{
							name: "show",
							rawName: "v-show",
							value: e.showMinimap,
							expression: "showMinimap"
						}],
						staticClass: "container",
						class: {
							circle: e.showMinimapCircle
						}
					}, [s("canvas", {
						ref: "locations",
						attrs: {
							id: "locations"
						}
					}), e._v(" "), s("canvas", {
						ref: "minimap",
						attrs: {
							id: "minimap"
						}
					})])])
				},
				n = [];
			a._withStripped = !0, s.d(t, "a", (function() {
				return a
			})), s.d(t, "b", (function() {
				return n
			}))
		}, function(e, t, s) {
			"use strict";
			var a = function() {
					var e = this,
						t = e.$createElement,
						s = e._self._c || t;
					return s("transition", {
						attrs: {
							name: "fade",
							appear: ""
						}
					}, [s("div", {
						staticClass: "modal"
					}, [s("div", {
						staticClass: "overlay",
						on: {
							click: function() {
								return e.$emit("close")
							}
						}
					}), e._v(" "), s("i", {
						staticClass: "fas fa-times-circle close-button",
						on: {
							click: function() {
								return e.$emit("close")
							}
						}
					}), e._v(" "), s("div", {
						staticClass: "wrapper"
					}, [s("transition", {
						attrs: {
							name: "scale",
							appear: ""
						}
					}, [s("div", {
						staticClass: "content fade-box"
					}, [e._t("default", [e._v("Here should be something")])], 2)])], 1)])])
				},
				n = [];
			a._withStripped = !0, s.d(t, "a", (function() {
				return a
			})), s.d(t, "b", (function() {
				return n
			}))
		}, function(e, t, s) {
			"use strict";
			var a = function() {
					var e = this,
						t = e.$createElement,
						s = e._self._c || t;
					return s("div", {
						staticClass: "replay-item",
						style: {
							backgroundImage: "url('" + e.replay.image + "')"
						},
						on: {
							click: function() {
								return e.play(e.replay.data)
							}
						}
					}, [s("div", {
						staticClass: "replay-header",
						on: {
							click: function(e) {
								e.stopPropagation()
							}
						}
					}, [s("div", {
						staticClass: "replay-name"
					}, [e._v(e._s(e.replay.name))]), e._v(" "), s("div", [s("i", {
						staticClass: "replay-button fas fa-cloud-download-alt",
						on: {
							click: function(t) {
								return t.stopPropagation(), e.downloadReplay(e.replay)
							}
						}
					}), e._v(" "), s("i", {
						staticClass: "replay-button fas fa-trash-alt",
						on: {
							click: function(t) {
								return t.stopPropagation(), e.deleteReplay(e.replay.name)
							}
						}
					})])])])
				},
				n = [];
			a._withStripped = !0, s.d(t, "a", (function() {
				return a
			})), s.d(t, "b", (function() {
				return n
			}))
		}, function(e, t) {
			t.neon = [16776960, 65280, 65535, 16711935], t.basic = [16711680, 16744448, 16776960, 8453888, 65280, 65408, 65535, 33023, 8388863, 16711935, 16711808], t.basicd = t.basic.map((e => {
				var t = e >> 16 & 255,
					s = e >> 8 & 255,
					a = 255 & e;
				return (t *= .5) << 16 | (s *= .5) << 8 | (a *= .5) >> 0
			}))
		}, function(e) {
			var t = new class {
				constructor() {
					this.ads = {}
				}
				addAd(e, t, s) {
					this.ads[e] = {
						elementId: t,
						lastRefresh: 0,
						waitInterval: s || 0
					}
				}
				getAd(e) {
					var t = this.ads[e];
					return t || null
				}
				pushAd(e) {
					aiptag.cmd.display.push((function() {
						aipDisplayTag.display(e)
					}))
				}
				refreshAd(e) {
					var t = this.getAd(e);
					if (!t) return !1;
					var s = Date.now();
					return !(t.lastRefresh + 1e3 * t.waitInterval > s) && (t.lastRefresh = s, this.pushAd(t.elementId), !0)
				}
			};
			t.addAd("menu-box", "vanis-io_300x250", 30), t.addAd("menu-banner", "vanis-io_728x90", 120), t.addAd("death-box", "vanis-io_300x250_2", 30), e.exports = {
				loadAdinplay(e) {
					var t = window.aiptag = t || {};
					t.cmd = t.cmd || [], t.cmd.display = t.cmd.display || [], t.gdprShowConsentTool = !0;
					var s = document.createElement("script");
					s.onload = e, s.src = "//api.adinplay.com/libs/aiptag/pub/VAN/vanis.io/tag.min.js", document.head.appendChild(s)
				},
				refreshAd: e => t.refreshAd(e)
			}
		}, function(e) {
			e.exports = function(e) {
				var t = 1,
					s = {
						border: {}
					};
				return s.protocol = e.getUint8(t, !0), t += 1, s.protocol >= 4 ? (s.gamemodeId = e.getUint8(t, !0), t += 1, s.instanceSeed = e.getUint16(t, !0), t += 2, s.playerId = e.getUint16(t, !0), t += 2, s.border.minx = e.getInt16(t, !0), t += 2, s.border.miny = e.getInt16(t, !0), t += 2, s.border.maxx = e.getInt16(t, !0), t += 2, s.border.maxy = e.getInt16(t, !0), t += 2, s.flags = e.getUint8(t, !0), t += 1, s.border.circle = !!(1 & s.flags), s.border.width = s.border.maxx - s.border.minx, s.border.height = s.border.maxy - s.border.miny) : (s.protocol >= 2 ? (s.gamemodeId = e.getUint8(t, !0), t += 1, s.instanceSeed = e.getUint16(t, !0), t += 2, s.playerId = e.getUint16(t, !0), t += 2, s.border.width = e.getUint32(t, !0), t += 4, s.border.height = e.getUint32(t, !0), t += 4) : function() {
					s.instanceSeed = e.getUint16(t, !0), t += 2, s.playerId = e.getUint16(t, !0), t += 2;
					var a = e.getUint16(t, !0);
					t += 2, s.border.width = a, s.border.height = a
				}(), s.border.minx = -s.border.width / 2, s.border.miny = -s.border.height / 2, s.border.maxx = +s.border.width / 2, s.border.maxy = +s.border.height / 2), s.border.x = (s.border.minx + s.border.maxx) / 2, s.border.y = (s.border.miny + s.border.maxy) / 2, s
			}
		}, function(e, t, s) {
			var a = s(1),
				n = s(133),
				i = s(4);

			function o(e, t, s) {
				var i = a.nodelist,
					o = a.nodes,
					r = a.nodes[e.id];
				if (r) r.update(), r.ox = r.x, r.oy = r.y, r.oSize = r.size;
				else {
					switch (15 & e.type) {
						case 1:
							var l = a.playerManager.getPlayer(e.pid);
							e.texture = l.texture, r = new n.PlayerCell(e, l);
							break;
						case 2:
							r = new n.Virus(e);
							break;
						case 3:
							r = new n.EjectedMass(e);
							break;
						case 4:
							if (FPSmode) return;
							r = new n.Food(e);
							break;
						case 6:
							if (FPSmode) return;
							r = new n.Crown(e);
							break;
						default:
							if (FPSmode) return;
							var c = 4210752,
								d = !1;
							e.flags && (c = 0, 128 & e.flags && (c |= 7340032), 64 & e.flags && (c |= 28672), 32 & e.flags && (c |= 112), 16 & e.flags && (d = !0)), r = new n.DeadCell(e, c, d)
					}
					s && (r.multi = !0), 4 == e.type ? a.scene.addFood(r.sprite) : a.scene.addCell(r.sprite), r.createTick = t, r.isVirus ? a.viruses[s ? "2" : "1"].push(r) : i.push(r), o[e.id] = r
				}!(32 & e.type) && (r.nx = e.x, r.ny = e.y), 64 & e.type || (r.nSize = e.size), r.updateTime = a.timestamp, r.player && (r.player.isMe && (a.isAlive = !0), a.replay.updateHistory.length ? r.player.lastUpdateTick = t : delete r.player.lastUpdateTick, window.aimbotpid == r.player.pid && (window.lastNodesTick !== t ? (window.nodesTick = [], window.lastNodesTick = t, window.hasBeenTriggered = !1) : (window.nodesTick.push(r), window.nodesTick.length > 15 && !window.hasBeenTriggered && (window.hasBeenTriggered = !0, GAME.actions.split(2, !1), GAME.actions.aimbotlocker()))))
			}

			function r(e, t) {
				var s = a.nodes,
					n = s[e],
					o = s[t];
				n && (o ? (n.update(), n.destroy(i.eatAnimation), n.nx = o.x, n.ny = o.y, n.nSize = 0, n.newPositionScale = Math.min(Math.max(n.size / o.nSize, 0), 1), n.updateTime = a.timestamp) : n.destroy())
			}
			window.updateCells = {
				add: o,
				del: r
			}, e.exports = {
				cellAdd: o,
				cellDel: r
			}
		}, function(e, t, s) {
			var a = s(140);

			function n(e, t, s, n) {
				var i = e.length,
					o = a._malloc(i),
					r = new Uint8Array(a.HEAPU8.buffer, o, i);
				r.set(e);
				var l = t(o, n);
				if (!s) {
					var c = new Uint8Array(new ArrayBuffer(i));
					c.set(r)
				}
				return a._free(o), s ? l : c
			}
			s(141), e.exports = {
				skid: e => n(e, a._skid, !1),
				skid3: (e, t) => n(e, a._skid3, !0, t),
				skid4: (e, t) => n(e, a._skid4, !0, t)
			}
		}, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , function(e, t, s) {
			"use strict";
			var a = s(74),
				n = s(30),
				i = (s(168), s(0)),
				o = Object(i.a)(n.default, a.a, a.b, !1, null, "0eaeaf66", null);
			o.options.__file = "src/components/modal.vue", t.default = o.exports
		}, function(e, t, s) {
			"use strict";
			var a = s(75),
				n = s(38),
				i = (s(218), s(0)),
				o = Object(i.a)(n.default, a.a, a.b, !1, null, "1dbc6ed9", null);
			o.options.__file = "src/components/replay-item.vue", t.default = o.exports
		}, function(e, t, s) {
			"use strict";
			var a = s(73),
				n = s(55),
				i = (s(250), s(0)),
				o = Object(i.a)(n.default, a.a, a.b, !1, null, "4c95bd45", null);
			o.options.__file = "src/components/minimap.vue", t.default = o.exports
		}, function(e, t, s) {
			"use strict";
			s.r(t);
			var a = s(8),
				n = (s.n(a), s(119));
			s.n(n);
			window.v = 5, s(17).notifyUnsupportedBrowser(), s(1), s(130), s(132), s(142), s(148), s(269), s(267), s(268)
		}, function(e, t, s) {
			var a = s(2),
				n = s(120);
			"string" == typeof(n = n.__esModule ? n.default : n) && (n = [
				[e.i, n, ""]
			]);
			var i = {
					insert: "head",
					singleton: !1
				},
				o = (a(n, i), n.locals ? n.locals : {});
			e.exports = o
		}, function() {}, function(e, t, s) {
			var a = s(4),
				n = s(12);

			function i({
				width: e,
				height: t,
				circle: s
			}) {
				var n = PIXI.utils.string2hex(a.borderColor),
					i = new PIXI.Graphics;
				return i.lineStyle(100, n, 1, .5), s ? i.drawEllipse(e / 2, t / 2, e / 2, t / 2) : i.drawRect(0, 0, e, t), i.endFill(), i.pivot.set(e / 2, t / 2), i
			}
			e.exports = class {
				constructor(e, t, s) {
					this.game = e, this.border = t, this.container = new PIXI.Container, this.background = new PIXI.Container, this.borderSprite = i(t), this.background.addChild(this.borderSprite), this.foreground = new PIXI.Container, this.food = new PIXI.Container, this.food.visible = a.foodVisible, this.resetMassTextStyle(!1), this.container.addChild(this.background, this.food, this.foreground), this.setPosition(), s && this.setBackgroundImage(), this.background.position.x = t.x, this.background.position.y = t.y
				}
				setPosition() {
					this.container.position.x = window.innerWidth / 2, this.container.position.y = window.innerHeight / 2
				}
				sort() {
					this.foreground.children.sort(((e, t) => (e = e.gameData).size === (t = t.gameData).size ? e.id - t.id : e.size - t.size))
				}
				addCell(e) {
					this.foreground.addChild(e)
				}
				addFood(e) {
					this.food.addChild(e)
				}
				toggleBackgroundImage(e) {
					e && !this.backgroundSprite ? this.setBackgroundImage() : e || this.destroyBackgroundImage(!0)
				}
				setBackgroundImage() {
					var e = a.backgroundImageUrl;
					if (e) {
						var t = (a.backgroundImageRepeat ? PIXI.TilingSprite : PIXI.Sprite).from(e, {});
						t.width = this.border.width, t.height = this.border.height, t.alpha = a.backgroundImageOpacity, t.anchor.set(.5);
						var s = this.backgroundSprite;
						if (s) {
							var n = t.texture !== s.texture;
							this.destroyBackgroundImage(n)
						}
						if (this.backgroundSprite = t, this.background.addChildAt(t, 0), this.border.circle) {
							var i = function({
								width: e,
								height: t
							}) {
								var s = new PIXI.Graphics;
								return s.beginFill(16777215), s.drawEllipse(e / 2, t / 2, e / 2, t / 2), s.endFill(), s.pivot.set(e / 2, t / 2), s
							}(this.border);
							this.background.addChildAt(i, 1), this.backgroundSprite.mask = i
						}
					} else this.destroyBackgroundImage()
				}
				destroyBackgroundImage(e) {
					this.backgroundSprite && (this.backgroundSprite.destroy(!!e), this.backgroundSprite = null)
				}
				resetBorder() {
					this.borderSprite.destroy(), this.borderSprite = i(this.border), this.background.addChild(this.borderSprite)
				}
				reloadFoodTextures() {
					this.game.nodelist.forEach((e => {
						e.isFood && e.reloadTexture()
					}))
				}
				reloadEjectedTextures() {
					this.game.nodelist.forEach((e => {
						e.isEjected && e.reloadTexture()
					}))
				}
				reloadVirusTexture() {
					n.virus.loadVirusFromUrl(a.virusImageUrl)
				}
				resetPlayerLongNames() {
					for (let e in this.game.playerManager.players) {
						this.game.playerManager.players[e].applyNameToSprite()
					}
				}
				resetNameTextStyle() {
					for (var e = this.game.settings.nameTextStyle, t = 0; t < this.game.nodelist.length; t++) {
						var s = this.game.nodelist[t];
						s.isPlayerCell && s.nameSprite && (s.nameSprite.destroy(!1), s.nameSprite = null)
					}
					for (let t in this.game.playerManager.players) {
						var a = this.game.playerManager.players[t];
						if (a.nameSprite) {
							var n = a.nameSprite.style.fill;
							a.nameSprite.style = e, a.nameSprite.style.fill = n, a.nameSprite.updateText()
						}
					}
				}
				resetMassTextStyle(e) {
					var t = this.game.settings.massTextStyle;
					for (e && this.uninstallMassTextFont(), PIXI.BitmapFont.from("mass", t, {
							chars: "1234567890k."
						}); this.game.massTextPool.length;) this.game.massTextPool.pop().destroy(!1);
					for (var s = 0; s < this.game.nodelist.length; s++) {
						var a = this.game.nodelist[s];
						a.isPlayerCell && a.massText && (a.sprite.removeChild(a.massText), a.massText.destroy(!1), a.massText = null)
					}
				}
				uninstallMassTextFont() {
					PIXI.BitmapFont.uninstall("mass")
				}
			}
		}, function(e, t, s) {
			var a = s(4),
				n = s(24),
				i = {};
			e.exports = {
				getTexture: function(e) {
					var t = i[e];
					return t || (i[e] = function(e) {
						var t = a.cellSize,
							s = t / 2,
							i = function(e, t) {
								var s = new PIXI.Graphics;
								return s.beginFill(t), s.drawCircle(0, 0, e), s.endFill(), s
							}(s, e);
						i.position.set(s);
						var o = PIXI.RenderTexture.create(t, t);
						return n.render(i, o), o
					}(e))
				},
				destroyCache: function() {
					for (var e in i) i[e].destroy(!0), delete i[e]
				}
			}
		}, function(e, t, s) {
			var a = s(4),
				n = s(24),
				i = {};
			e.exports = {
				getTexture: function(e) {
					var t = i[e];
					return t || (i[e] = function(e) {
						var t = a.cellSize,
							s = t / 2,
							i = function(e, t) {
								var s = new PIXI.Graphics;
								return s.beginFill(t), s.drawRect(-e, -e, 2 * e, 2 * e), s.endFill(), s
							}(s, e);
						i.position.set(s);
						var o = PIXI.RenderTexture.create(t, t);
						return n.render(i, o), o
					}(e))
				},
				destroyCache: function() {
					for (var e in i) i[e].destroy(!0), delete i[e]
				}
			}
		}, function(e, t, s) {
			var a = s(24),
				{
					loadImage: n
				} = s(8),
				i = PIXI.RenderTexture.create(200, 200),
				o = Promise.resolve();
			e.exports = {
				getTexture: function() {
					return i
				},
				loadVirusFromUrl: async function(e) {
					await o, o = new Promise((async t => {
						var s = await n(e),
							o = PIXI.Sprite.from(s, void 0, 18);
						o.width = o.height = 200, a.render(o, i, !0), o.destroy(!0), t()
					}))
				}
			}
		}, function(e, t, s) {
			var a = s(126);
			e.exports = class {
				constructor(e) {
					this.game = e, this.players = {}, this.playersRemoving = [], this.playerCount = 0
				}
				getPlayer(e) {
					var t = this.players[e] || null;
					return t
				}
				setPlayerData({
					pid: e,
					nickname: t,
					skin: s,
					skinUrl: n,
					hat: i,
					nameColor: o,
					tagId: r,
					bot: l
				}) {
					var c = this.players[e];
					c || (c = this.players[e] = new a(this.game, e, l), l || this.playerCount++), s.length <= 8 && (n = "https://skins.vanis.io/s/" + s);
					var d = c.setName(t, o),
						u = c.setSkin(n),
						h = c.setTagId(r);
					return (d || u || h) && c.invalidateVisibility(), i && (c.hat = i), c
				}
				invalidateVisibility(e = []) {
					for (var t in this.players) {
						var s = this.players[t]; - 1 === e.indexOf(s) && s.invalidateVisibility()
					}
				}
				sweepRemovedPlayers() {
					var e = this.game.replay.updateHistory[0];
					e = e ? e.packetId : null;
					for (var t = 0; t < this.playersRemoving.length;) {
						var s = this.playersRemoving[t],
							a = this.players[s];
						a ? !e || !a.lastUpdateTick || e > a.lastUpdateTick ? (this.removePlayer(s), this.playersRemoving.splice(t, 1)) : t++ : this.playersRemoving.splice(t, 1)
					}
				}
				delayedRemovePlayer(e) {
					this.playersRemoving.push(e)
				}
				removePlayer(e) {
					var t = this.players[e];
					t && (t.bot || this.playerCount--, t.clearCachedData(), delete this.players[e])
				}
				destroy() {
					for (var e in this.players) this.removePlayer(e);
					this.playersRemoving.splice(0, this.playersRemoving.length)
				}
			}
		}, function(e, t, s) {
			var a = s(4),
				n = s(76),
				i = n.basic,
				o = n.basicd,
				r = a.cellSize;

			function l(e) {
				e = e || 0;
				var t = new PIXI.Graphics;
				return t.lineStyle(a.cellBorderSize, 0, .5), t.beginFill(e), t.drawCircle(0, 0, a.cellSize / 2), t.endFill(), t
			}
			e.exports = class {
				constructor(e, t, s, a) {
					this.game = e, this.pid = t, this.bot = s, this.hat = a, this.skinUrl = s ? "" : null, this.tagId = null, this.isMe = t === e.playerId || t === e.multiboxPid || t === Multibox.pid, this.texture = PIXI.RenderTexture.create(r, r), this.cellContainer = this.createCellContainer(), this.renderCell()
				}
				get visibility() {
					return this.game.tagId === this.tagId ? 1 : 2
				}
				setOutline(e, t = 15) {
					if (e = e || 0, 0 == t) return this.renderCell();
					var s = a.cellSize / 2,
						n = t,
						i = new PIXI.Graphics;
					this.outline && (this.outline.clear(), this.outline.destroy()), this.outline = i, i.lineStyle(n, e, 1), i.drawCircle(0, 0, s - (n - 1) / 2), i.endFill(), i.pivot.set(-s), this.game.renderer.render(i, this.texture, !1)
				}
				setCrown(e) {
					this.hasCrown = e;
					for (var t = this.pid, s = this.game.nodelist, a = 0; a < s.length; a++) {
						var n = s[a];
						n.pid === t && (e ? n.addCrown() : n.removeCrown())
					}
				}
				createCellContainer() {
					var e = new PIXI.Container,
						t = l(this.getCellColor());
					return e.pivot.set(-r / 2), e.addChild(t), e
				}
				createSkinSprite(e) {
					var t = new PIXI.BaseTexture(e),
						s = new PIXI.Texture(t),
						n = new PIXI.Sprite(s);
					return n.width = n.height = a.cellSize, n.anchor.set(.5), n
				}
				renderCell() {
					this.game.renderer.render(this.cellContainer, this.texture, !0)
				}
				setTagId(e) {
					return e || (e = null), this.tagId = e, !this.bot && this.setTagSprite(), !0
				}
				setNameColor(e) {
					return e ? (e = parseInt(e, 16), this.nameColor = e, this.nameColorCss = PIXI.utils.hex2string(e)) : (this.nameColor = null, this.nameColorCss = null), this.nameColor
				}
				setName(e, t) {
					return e || (e = "Unnamed"), (this.nameFromServer !== e || this.nameColorFromServer !== t) && (this.nameFromServer = e, this.nameColorFromServer = t, this.applyNameToSprite(), !0)
				}
				applyNameToSprite() {
					var e, t = "Unnamed" === this.nameFromServer,
						s = "Long Name" === this.nameFromServer,
						n = t ? "" : this.nameFromServer,
						i = this.name,
						o = this.nameColor;
					if (e = t || s ? this.setNameColor(null) : this.setNameColor(this.nameColorFromServer), this.bot && (e = this.setNameColor("878787")), this.setNameSprite(n, e), !t && !s && this.nameSprite.texture.width > a.cellLongNameThreshold && (s = !0, n = "Long Name", e = this.setNameColor(null), this.setNameSprite(n, e)), this.name = t ? "Unnamed" : n, i !== this.name || o !== this.nameColor) {
						var r = e || (this.isMe ? 16747520 : null);
						this.game.events.$emit("minimap-create-node", this.pid, n, e, r)
					}
				}
				setNameSprite(e, t) {
					this.nameSprite ? this.nameSprite.text = e : this.nameSprite = new PIXI.Text(e, a.nameTextStyle), this.nameSprite.style.fill = t || 16777215, this.nameSprite.updateText()
				}
				setTagSprite() {
					var e = JSON.parse(`${JSON.stringify(settings.nameTextStyle)}`);
					e.fontSize = 50, this.tagSprite ? this.tagSprite.text = `Team ${null==this.tagId?0:this.tagId}` : this.tagSprite = new PIXI.Text(`Team ${null==this.tagId?0:this.tagId}`, e), this.tagSprite.style.fill = this.getTagColor(), this.tagSprite.updateText()
				}
				getTagColor() {
					return window.TagColor.isNull++, window.TagColor[this.tagId] || (window.TagColor[this.tagId] = window.TagColor.array[Math.floor(Math.random() * window.TagColor.array.length)]), parseInt("0x" + window.TagColor[this.tagId].replace("#", ""))
				}
				setSkin(e) {
					return e || (e = null), e !== this.skinUrl && (this.abortSkinLoaderIfExist(), this.destroySkin() && this.renderCell(), this.skinUrl = e, this.skinShown && this.loadSkinAndRender(), !0)
				}
				destroySkin() {
					return !!this.skinSprite && (this.skinSprite.mask.destroy(!0), this.skinSprite.destroy(!0), this.skinSprite = null, !0)
				}
				loadSkinAndRender() {
					this.abortSkinLoaderIfExist(), this.abortSkinLoader = this.game.skinLoader.loadSkin(this.skinUrl, (e => {
						this.skinSprite = this.createSkinSprite(e), this.skinSprite.mask = l(), this.cellContainer.addChild(this.skinSprite.mask, this.skinSprite), this.renderCell()
					}))
				}
				invalidateVisibility() {
					var e, t, s, n = a.showNameColor;
					this.isMe ? (e = a.showOwnName, t = a.showOwnSkin, s = a.showOwnMass) : (e = a.showNames >= this.visibility, t = a.showSkins >= this.visibility, s = a.showMass >= this.visibility), e = a.namesEnabled && e, t = a.skinsEnabled && t, s = a.massEnabled && s, t && !this.skinShown ? this.skinSprite ? (this.skinSprite.visible = !0, this.renderCell()) : this.skinUrl && this.loadSkinAndRender() : !t && this.skinShown && (this.abortSkinLoaderIfExist(), this.skinSprite && (this.skinSprite.visible = !1, this.renderCell())), this.nameShown = e, this.skinShown = t, this.massShown = s, this.nameColorShown = n
				}
				abortSkinLoaderIfExist() {
					this.abortSkinLoader && (this.abortSkinLoader(), this.abortSkinLoader = null)
				}
				getCellColor() {
					var e = this.game.seededRandom(this.pid),
						t = Math.floor(e * i.length);
					return (this.bot ? o : i)[t]
				}
				clearCachedData() {
					this.abortSkinLoaderIfExist(), this.destroySkin(), this.cellContainer.destroy(!0), this.texture.destroy(!0), this.texture.clearedFromCache = !0, this.nameSprite && this.nameSprite.destroy(!0), this.tagSprite && this.tagSprite.destroy(!0), this.game.events.$emit("minimap-destroy-node", this.pid)
				}
			}
		}, , function(e, t, s) {
			var a = s(129);
			e.exports = class {
				constructor() {
					this.loaders = {}, this.worker = new a, this.worker.addEventListener("message", this.onSkinLoaded.bind(this))
				}
				createLoader(e) {
					return {
						image: null,
						error: null,
						callbacks: [e]
					}
				}
				clearCallbacks() {
					for (var e in this.loaders) delete this.loaders[e]
				}
				removeLoaderCallback(e, t) {
					var s = e.callbacks.indexOf(t);
					s >= 0 && e.callbacks.splice(s, 1)
				}
				loadSkin(e, t) {
					var s = this.loaders[e];
					return s ? s.image ? (t(s.image), null) : s.error ? null : (s.callbacks.push(t), this.removeLoaderCallback.bind(this, s, t)) : (s = this.loaders[e] = this.createLoader(t), this.worker.postMessage(e), this.removeLoaderCallback.bind(this, s, t))
				}
				onSkinLoaded(e) {
					var {
						skinUrl: t,
						bitmap: s,
						error: a
					} = e.data, n = this.loaders[t];
					if (a) return n.error = !0, void(n.callbacks = []);
					for (n.image = s; n.callbacks.length;) n.callbacks.pop()(s)
				}
			}
		}, function(e, t, s) {
			const workerCode = atob('IWZ1bmN0aW9uKGUpe3ZhciB0PXt9O2Z1bmN0aW9uIG4ocil7aWYodFtyXSlyZXR1cm4gdFtyXS5leHBvcnRzO3ZhciBvPXRbcl09e2k6cixsOiExLGV4cG9ydHM6e319O3JldHVybiBlW3JdLmNhbGwoby5leHBvcnRzLG8sby5leHBvcnRzLG4pLG8ubD0hMCxvLmV4cG9ydHN9bi5tPWUsbi5jPXQsbi5kPWZ1bmN0aW9uKGUsdCxyKXtuLm8oZSx0KXx8T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsdCx7ZW51bWVyYWJsZTohMCxnZXQ6cn0pfSxuLnI9ZnVuY3Rpb24oZSl7InVuZGVmaW5lZCIhPXR5cGVvZiBTeW1ib2wmJlN5bWJvbC50b1N0cmluZ1RhZyYmT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsU3ltYm9sLnRvU3RyaW5nVGFnLHt2YWx1ZToiTW9kdWxlIn0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLCJfX2VzTW9kdWxlIix7dmFsdWU6ITB9KX0sbi50PWZ1bmN0aW9uKGUsdCl7aWYoMSZ0JiYoZT1uKGUpKSw4JnQpcmV0dXJuIGU7aWYoNCZ0JiYib2JqZWN0Ij09dHlwZW9mIGUmJmUmJmUuX19lc01vZHVsZSlyZXR1cm4gZTt2YXIgcj1PYmplY3QuY3JlYXRlKG51bGwpO2lmKG4ucihyKSxPYmplY3QuZGVmaW5lUHJvcGVydHkociwiZGVmYXVsdCIse2VudW1lcmFibGU6ITAsdmFsdWU6ZX0pLDImdCYmInN0cmluZyIhPXR5cGVvZiBlKWZvcih2YXIgbyBpbiBlKW4uZChyLG8sZnVuY3Rpb24odCl7cmV0dXJuIGVbdF19LmJpbmQobnVsbCxvKSk7cmV0dXJuIHJ9LG4ubj1mdW5jdGlvbihlKXt2YXIgdD1lJiZlLl9fZXNNb2R1bGU/ZnVuY3Rpb24oKXtyZXR1cm4gZS5kZWZhdWx0fTpmdW5jdGlvbigpe3JldHVybiBlfTtyZXR1cm4gbi5kKHQsImEiLHQpLHR9LG4ubz1mdW5jdGlvbihlLHQpe3JldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZSx0KX0sbi5wPSIiLG4obi5zPTApfShbZnVuY3Rpb24oZSx0KXtvbm1lc3NhZ2U9ZnVuY3Rpb24oZSl7IWZ1bmN0aW9uKGUpe2ZldGNoKGUse21vZGU6ImNvcnMifSkudGhlbihlPT5lLmJsb2IoKSkudGhlbihlPT5jcmVhdGVJbWFnZUJpdG1hcChlKSkudGhlbih0PT5zZWxmLnBvc3RNZXNzYWdlKHtza2luVXJsOmUsYml0bWFwOnR9KSkuY2F0Y2godD0+c2VsZi5wb3N0TWVzc2FnZSh7c2tpblVybDplLGVycm9yOiEwfSkpfShlLmRhdGEpfX1dKTs=');

			e.exports = function() {
				return new Worker(URL.createObjectURL(
					new Blob([workerCode], {
						type: 'text/javascript'
					})
				));
			}
		}, function(e, t, s) {
			var a = s(131),
				n = s(1),
				i = s(8),
				o = s(5),
				r = s(4),
				l = s(78),
				c = s(25),
				d = [],
				u = [],
				h = a.createInstance({
					name: "game-replays"
				});

			function p(e) {
				var t = e || d.length;
				d.splice(0, t), u.splice(0, t)
			}
			var v = m(new ArrayBuffer(1));

			function m(e) {
				return btoa(String.fromCharCode.apply(null, new Uint8Array(e)))
			}

			function g(e) {
				e = atob(e);
				for (var t = new ArrayBuffer(e.length), s = new Uint8Array(t), a = 0; a < e.length; a++) s[a] = e.charCodeAt(a);
				return new DataView(t)
			}
			n.replay = {
				database: h,
				updateHistory: d,
				addHistory: function(e) {
					d.push(e), u.push(n.nodelist.map((e => ({
						type: e.type,
						id: e.id,
						pid: e.pid,
						nx: e.nx,
						ny: e.ny,
						nSize: e.nSize
					}))));
					var t = 25 * r.replayDuration;
					d.length > t && p(1)
				},
				clearHistory: p,
				play: function(e) {
					n.running && n.stop(), n.connection.close(), o.toast.close();
					var t = 1,
						s = e.split("|");
					"REPLAY" === s[0] && (t = parseInt(s[1]), s = s.slice(3));
					var a = s.map(g),
						i = l(a.shift()),
						r = [];
					if (t >= 4) {
						for (; a[0].getUint8(0);) r.push(a.shift());
						a.shift()
					} else r.push(a.shift());
					i.replayUpdates = a, n.start(i), r.forEach((e => {
						e.packetId = -1, n.parseMessage(e)
					})), n.playback.setInitial(), n.showMenu(!1)
				},
				save: function() {
					var e = d.slice(0);
					if (e.length) {
						var t = [];
						for (var s in n.playerManager.players) {
							var a = n.playerManager.players[s];
							t.push(a)
						}
						e.splice(0, 1, function(e) {
							for (var t = 0, s = 0; s < e.length; s++) t += 1 + (1 === e[s].type ? 2 : 0) + 2 + 2 + 2 + 2 + (e[s].flags ? 1 : 0);
							var a = new ArrayBuffer(1 + t + 1 + 2 + 2),
								n = new DataView(a);
							n.setUint8(0, 10);
							var i = 1;
							for (s = 0; s < e.length; s++) {
								var o = e[s],
									r = 254 & o.flags,
									l = r ? 128 : 0;
								n.setUint8(i, o.type | l), i++, 1 === o.type && (n.setUint16(i, o.pid, !1), i += 2), n.setUint16(i, o.id, !1), i += 2, n.setInt16(i, o.nx, !1), i += 2, n.setInt16(i, o.ny, !1), i += 2, n.setUint16(i, o.nSize, !1), i += 2, r && (n.setUint8(i, r), i++)
							}
							return n.setUint8(i, 0), i++, n.setUint16(i, 0, !1), i += 2, n.setUint16(i, 0, !1), i += 2, n
						}(u[0]));
						var l = m(n.initialDataPacket.buffer),
							p = function(e) {
								e = e.map((e => {
									var t = {
										pid: e.pid,
										nickname: e.nameFromServer,
										skinUrl: e.skinUrl
									};
									return e.bot && (t.bot = !0), e.tagId && (t.tagId = e.tagId), e.hat && (t.hat = e.hat), e.nameColorFromServer && (t.nameColor = e.nameColorFromServer), t
								}));
								var t = JSON.stringify(e),
									s = new c;
								return s.uint8(16), s.utf8(t), m(s.write())
							}(t),
							g = e.map((e => m(e.buffer))).join("|"),
							f = i.getTimestamp(),
							y = n.getThumbnail(),
							w = [];
						w.push("REPLAY"), w.push(4), w.push(y), w.push(l), n.multiboxPid && (window.multiPacket = function(e) {
							var t = new ArrayBuffer(3),
								s = new DataView(t);
							return s.setUint8(0, 8), s.setUint16(1, e, !0), m(t)
						}(n.multiboxPid), w.push(window.multiPacket)), w.push(p), w.push(v), w.push(g);
						var b = w.join("|");
						h.setItem(f, b, (() => {
							n.events.$emit("replay-added");
							var e = "Replay saved!";
							1 === r.showReplaySaved ? n.events.$emit("chat-message", e) : o.toast.fire({
								type: "info",
								title: e,
								timer: 1500
							})
						})).catch((e => {
							var t = "Error saving replay";
							"string" == typeof e ? t += ": " + e : e && e.message && (t += ": " + e.message), o.toast.fire({
								type: "error",
								title: t
							})
						}))
					}
				}
			}
		}, , function(e, t, s) {
			var a = s(1),
				n = s(79),
				i = s(80);
			a.playback = {};
			var o = a.playback.updates = [];
			a.playback.set = function(e) {
				a.playback.reset(), a.playback.dry = !0;
				for (var t = 0; t < e.length; t++) o.unshift([{},
					[],
					[], {}
				]), i["skid" + Math.max(a.protocol, 3)](new Uint8Array(e[t].buffer, 1), t);
				o.reverse(), delete a.playback.dry, a.playback.index = 0
			}, a.playback.setInitial = function() {
				for (var e in a.nodes) {
					var t = a.nodes[e];
					e in o[0][3] || (e in o[0][0] ? o[0][0][e].pid = t.pid : o[0][0][e] = {
						type: t.type,
						id: t.id,
						pid: t.pid,
						x: t.nx,
						y: t.ny,
						size: t.nSize,
						flags: t.flags
					})
				}
				for (var s = 1; s < o.length; s++) {
					var n = o[s - 1],
						i = o[s];
					for (var e in i[0])
						if (e in n[0]) {
							var r = i[0][e],
								l = n[0][e];
							16 & r.type && (r.pid = l.pid), 32 & r.type && (r.x = l.x, r.y = l.y), 64 & r.type && (r.size = l.size)
						} for (var e in n[0]) e in i[3] || e in i[0] || (i[0][e] = n[0][e])
				}
			}, a.playback.reset = function() {
				o.splice(0, o.length), delete a.playback.index
			}, a.playback.seek = function(e, t) {
				var s = o[e];
				for (var i in a.nodes) !t && i in s[0] || n.cellDel(i);
				for (var i in s[0]) n.cellAdd(s[0][i]);
				a.playback.index = e, a.updateCamera(!0)
			}, a.playback.next = function() {
				if (a.playback.index >= o.length) a.playback.seek(0, !0);
				else {
					var [e, t, s] = o[a.playback.index++];
					for (var i in e) n.cellAdd(e[i]);
					for (var r = 0, l = t.length; r < l;) n.cellDel(t[r++]);
					for (r = 0, l = s.length; r < l;) n.cellDel(s[r++], s[r++]);
					a.updateCamera(!0)
				}
				a.events.$emit("replay-index-change", a.playback.index)
			}
		}, function(e, t, s) {
			t.PlayerCell = s(134), t.Food = s(135), t.Virus = s(136), t.EjectedMass = s(137), t.DeadCell = s(138), t.Crown = s(139)
		}, function(e, t, s) {
			var a = s(14);
			class n extends a {
				constructor(e, t) {
					/*50 === window.chfloor && (*/
					super(e), this.player = t, this.pid = t.pid, this.isMultiNode = this.player.pid == GAME.multiboxPid, this.isMe = this.player.pid == GAME.playerId, t.isMe && (GAME.nodesOwn[this.id] = !0), this.createdAt = Date.now(), t.hasCrown && this.addCrown(), t.isMe && !GAME.replaying && (this.addArrow(), !FPSmode && this.addLine()) /*, (Gateway.players && GAME.ws || t.hat) && !FPSmode && (t.hat && GAME.replaying ? this.setHat(t.hat) : Gateway.players && Gateway.players[GAME.ws.url + "/pid/" + t.pid] && Gateway.players[GAME.ws.url + "/pid/" + t.pid].hat && t.skinShown && this.setHat(Gateway.players[GAME.ws.url + "/pid/" + t.pid].hat))))*/
				}
				updateLineVisibility() {
					if (this.line) return GAME.settings.showCellLines ? void(Multibox.connected() ? Multibox.active ? this.isMultiNode ? this.line.visible = !0 : this.line.visible = !1 : this.isMultiNode ? this.line.visible = !1 : this.line.visible = !0 : this.line.visible = !0) : this.line.visible = !1
				}
				addLine() {
					this.line = new Line([this.x, this.y, GAME.mouse.x, GAME.mouse.y]), GAME.scene.container.addChild(this.line), this.updateLineVisibility()
				}
				addArrow() {
					this.arrowSprite = new PIXI.Sprite.from(Multibox.arrowSprite.texture), this.arrowSprite.visible = window.settings.mbActive >= 2 && (this.player.pid == Multibox.pid ? Multibox.active : !Multibox.active && Multibox.connected()), this.arrowSprite.anchor.set(.5), this.arrowSprite.width = this.arrowSprite.height = 130, this.arrowSprite.alpha = .95, this.arrowSprite.y = -310, this.sprite.addChild(this.arrowSprite)
				}
				setHat(e) {
					var t = e.split("/skin-bind/")[1];
					e = e.split("/skin-bind/")[0];
					t && t !== this.player.skinUrl || (this.hatSprite = new PIXI.Sprite.from(e), this.hatSprite.anchor.set(.5), this.hatSprite.width = this.hatSprite.height = 1024, this.hatSprite.alpha = .85, this.hatSprite.visible = window.settings.skinsEnabled, this.sprite.addChildAt(this.hatSprite, 0), GAME.playerManager.players[this.player.pid].hat = e)
				}
				addCrown() {
					if (!FPSmode && !this.crownSprite) {
						var e, t = this.game.crownPool;
						t.length ? e = t.pop() : ((e = PIXI.Sprite.from("/img/crown.png")).scale.set(.7), e.pivot.set(0, 643), e.anchor.x = .5, e.rotation = -.5, e.alpha = .7, e.zIndex = 2), this.crownSprite = e, this.sprite.addChild(e)
					}
				}
				removeCrown() {
					var e = this.crownSprite;
					e && (this.sprite.removeChild(e), this.game.crownPool.push(e), this.crownSprite = null)
				}
				onUpdate() {
					if (!FPSmode) {
						this.posarrow || this.hasPosArrow || (this.posarrow = new PIXI.Sprite.from("https://i.postimg.cc/vmZmWCRR/4-Point-Star.png"), this.posarrow.scale.set(.1), this.posarrow.alpha = .7, this.posarrow.anchor.set(3.5, 3.5), this.sprite.addChild(this.posarrow), this.hasPosArrow = !0);
						var e = this.game.settings,
							t = this.game.scene.container.scale.x * this.size * this.game.renderer.resolution,
							s = t > e.smallTextThreshold;
						if (this.player.massShown && !this.massText && s && (this.massText = this.game.massTextPool.pop() || function(e) {
								var t = new PIXI.BitmapText("", {
										fontName: "mass",
										align: "right"
									}),
									s = e.strokeThickness || 0;
								return t.position.set(-s / 2, -s / 2), t.anchor.set(.5, -.6), t
							}(e.massTextStyle), this.massText.zIndex = 0, this.sprite.addChild(this.massText)), this.player.nameShown && !this.nameSprite && this.player && this.player.nameSprite && s && (this.nameSprite = new PIXI.Sprite(this.player.nameSprite.texture), this.nameSprite.anchor.set(.5), this.nameSprite.zIndex = 1, this.sprite.addChild(this.nameSprite)), !this.tagSprite && settings.showTag && this.player && this.player.tagId !== GAME.tagId && this.player.tagSprite && (this.tagSprite = new PIXI.Sprite(this.player.tagSprite.texture), this.tagSprite.anchor.set(.5), this.tagSprite.y = 180, this.tagSprite.zIndex = 1, this.sprite.addChild(this.tagSprite)), this.line && this.line.visible && this.line.updatePoints([this.x, this.y, GAME.mouse.x, GAME.mouse.y]), this.crownSprite && (this.crownSprite.visible = t > 16 && e.showCrown), this.nameSprite && (this.nameSprite.visible = this.player.nameShown && s), this.tagSprite && (this.tagSprite.visible = settings.showTag), settings.showDir && !this.player.isMe && this.posarrow) {
							var a = 0,
								n = !1;
							this.nx > this.ox ? (this.nx - this.ox < 3 && (n = !0), a = this.ny < this.oy ? n ? 0 : this.oy - this.ny < 3 ? 2 : 1 : n ? 4 : this.ny - this.oy < 3 ? 2 : 3) : (this.ox - this.nx < 3 && (n = !0), a = this.ny < this.oy ? n ? 0 : this.oy - this.ny < 3 ? 6 : 7 : n ? 4 : this.ny - this.oy < 3 ? 6 : 5), this.posarrow.rotation = point_rotations[a]
						}
						if (this.posarrow && (this.posarrow.visible = settings.showDir), this.massText)
							if (this.player.massShown && s) {
								var i = this.game.getMassText(this.nSize * this.nSize / 100);
								this.massText.text = i, this.massText.visible = !0
							} else this.massText.visible && (this.massText.visible = !1)
					}
				}
				onDestroy() {
					this.arrowSprite && this.sprite.removeChild(this.arrowSprite) && this.arrowSprite.destroy(), this.hatSprite && this.sprite.removeChild(this.hatSprite) && this.hatSprite.destroy(), this.tagSprite && this.sprite.removeChild(this.tagSprite) && this.tagSprite.destroy(), this.posarrow && this.sprite.removeChild(this.posarrow) && this.posarrow.destroy(), this.line && GAME.scene.container.removeChild(this.line) && this.line.destroy(), delete this.line, delete this.posarrow, this.massText && (this.sprite.removeChild(this.massText), this.game.massTextPool.push(this.massText)), this.crownSprite && this.removeCrown()
				}
			}
			n.prototype.type = 1, n.prototype.isPlayerCell = !0, e.exports = n
		}, function(e, t, s) {
			s(1);
			var a = s(14),
				n = s(12),
				i = s(4),
				o = s(76);

			function r(e) {
				var t;
				return t = i.useFoodColor ? PIXI.utils.string2hex(i.foodColor) : o.neon[e % o.neon.length], n.cells.getTexture(t)
			}
			class l extends a {
				constructor(e) {
					e.texture = r(e.id), super(e)
				}
				reloadTexture() {
					this.texture = r(this.id), this.sprite.texture = this.texture
				}
			}
			l.prototype.type = 4, l.prototype.isFood = !0, e.exports = l
		}, function(e, t, s) {
			var a = s(14),
				n = s(12);
			class i extends a {
				constructor(e) {
					e.texture = n.virus.getTexture(), super(e)
				}
				resetTexture() {
					this.destroySprite(), this.texture = n.virus.getTexture(), this.sprite = new PIXI.Sprite(this.texture), this.sprite.anchor.set(.5), this.sprite.gameData = this
				}
			}
			i.prototype.type = 2, i.prototype.isVirus = !0, e.exports = i
		}, function(e, t, s) {
			var a = s(4),
				n = s(14),
				i = s(12);

			function o() {
				var e = PIXI.utils.string2hex(a.ejectedColor);
				return i.cells.getTexture(e)
			}
			class r extends n {
				constructor(e) {
					e.texture = o(), super(e)
				}
				reloadTexture() {
					this.texture = o(), this.sprite.texture = this.texture
				}
			}
			r.prototype.type = 3, r.prototype.isEjected = !0, e.exports = r
		}, function(e, t, s) {
			var a = s(14),
				n = s(12);
			class i extends a {
				constructor(e, t, s) {
					e.texture = n[s ? "squares" : "cells"].getTexture(t || 4210752), super(e), this.sprite.alpha = .5
				}
			}
			i.prototype.type = 5, i.prototype.isDead = !0, e.exports = i
		}, function(e, t, s) {
			var a = s(14);
			class n extends a {
				constructor(e) {
					e.texture = PIXI.Texture.from("/img/crown.png"), super(e), this.sprite.alpha = .7
				}
			}
			n.prototype.type = 6, n.prototype.isCrown = !0, e.exports = n
		}, function(g, E, I) {
			var M = void 0 !== M ? M : {},
				w = {},
				z;
			for (z in M) M.hasOwnProperty(z) && (w[z] = M[z]);
			var R = [],
				l = "./this.program",
				P = function(e, t) {
					throw t
				},
				a = !0,
				d = !1,
				N = "",
				U, O, X, t;

			function S(e) {
				return M.locateFile ? M.locateFile(e, N) : N + e
			}(a || d) && (d ? N = self.location.href : "undefined" != typeof document && document.currentScript && (N = document.currentScript.src), N = 0 !== N.indexOf("blob:") ? N.substr(0, N.lastIndexOf("/") + 1) : "", U = function(e) {
				var t = new XMLHttpRequest;
				return t.open("GET", e, !1), t.send(null), t.responseText
			}, d && (X = function(e) {
				var t = new XMLHttpRequest;
				return t.open("GET", e, !1), t.responseType = "arraybuffer", t.send(null), new Uint8Array(t.response)
			}), O = function(e, t, s) {
				var a = new XMLHttpRequest;
				a.open("GET", e, !0), a.responseType = "arraybuffer", a.onload = function() {
					200 == a.status || 0 == a.status && a.response ? t(a.response) : s()
				}, a.onerror = s, a.send(null)
			}, t = function(e) {
				document.title = e
			});
			var J = M.print || console.log.bind(console),
				b = M.printErr || console.warn.bind(console),
				i;
			for (z in w) w.hasOwnProperty(z) && (M[z] = w[z]);
			w = null, M.arguments && (R = M.arguments), M.thisProgram && (l = M.thisProgram), M.quit && (P = M.quit), M.wasmBinary && (i = M.wasmBinary);
			var n = M.noExitRuntime || !0;
			"object" != typeof WebAssembly && gI("no native wasm support detected");
			var c, r = !1,
				v, Q = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0;

			function q(e, t, s) {
				for (var a = t + s, n = t; e[n] && !(n >= a);) ++n;
				if (n - t > 16 && e.subarray && Q) return Q.decode(e.subarray(t, n));
				for (var i = ""; t < n;) {
					var o = e[t++];
					if (128 & o) {
						var r = 63 & e[t++];
						if (192 != (224 & o)) {
							var l = 63 & e[t++];
							if ((o = 224 == (240 & o) ? (15 & o) << 12 | r << 6 | l : (7 & o) << 18 | r << 12 | l << 6 | 63 & e[t++]) < 65536) i += String.fromCharCode(o);
							else {
								var c = o - 65536;
								i += String.fromCharCode(55296 | c >> 10, 56320 | 1023 & c)
							}
						} else i += String.fromCharCode((31 & o) << 6 | r)
					} else i += String.fromCharCode(o)
				}
				return i
			}

			function B(e, t) {
				return e ? q(T, e, t) : ""
			}

			function G(e, t, s, a) {
				if (!(a > 0)) return 0;
				for (var n = s, i = s + a - 1, o = 0; o < e.length; ++o) {
					var r = e.charCodeAt(o);
					if (r >= 55296 && r <= 57343) r = 65536 + ((1023 & r) << 10) | 1023 & e.charCodeAt(++o);
					if (r <= 127) {
						if (s >= i) break;
						t[s++] = r
					} else if (r <= 2047) {
						if (s + 1 >= i) break;
						t[s++] = 192 | r >> 6, t[s++] = 128 | 63 & r
					} else if (r <= 65535) {
						if (s + 2 >= i) break;
						t[s++] = 224 | r >> 12, t[s++] = 128 | r >> 6 & 63, t[s++] = 128 | 63 & r
					} else {
						if (s + 3 >= i) break;
						t[s++] = 240 | r >> 18, t[s++] = 128 | r >> 12 & 63, t[s++] = 128 | r >> 6 & 63, t[s++] = 128 | 63 & r
					}
				}
				return t[s] = 0, s - n
			}

			function h(e, t, s) {
				return G(e, T, t, s)
			}

			function p(e) {
				for (var t = 0, s = 0; s < e.length; ++s) {
					var a = e.charCodeAt(s);
					a >= 55296 && a <= 57343 && (a = 65536 + ((1023 & a) << 10) | 1023 & e.charCodeAt(++s)), a <= 127 ? ++t : t += a <= 2047 ? 2 : a <= 65535 ? 3 : 4
				}
				return t
			}
			var o = "undefined" != typeof TextDecoder ? new TextDecoder("utf-16le") : void 0,
				L, H, T, e, A, Z, F, y, j;

			function W(t, s) {
				for (var a = t, n = a >> 1, i = n + s / 2; !(n >= i) && A[n];) ++n;
				if ((a = n << 1) - t > 32 && o) return o.decode(T.subarray(t, a));
				for (var r = "", l = 0; !(l >= s / 2); ++l) {
					var c = e[t + 2 * l >> 1];
					if (0 == c) break;
					r += String.fromCharCode(c)
				}
				return r
			}

			function D(t, s, a) {
				if (void 0 === a && (a = 2147483647), a < 2) return 0;
				for (var n = s, i = (a -= 2) < 2 * t.length ? a / 2 : t.length, o = 0; o < i; ++o) {
					var r = t.charCodeAt(o);
					e[s >> 1] = r, s += 2
				}
				return e[s >> 1] = 0, s - n
			}

			function C(e) {
				return 2 * e.length
			}

			function Y(e, t) {
				for (var s = 0, a = ""; !(s >= t / 4);) {
					var n = Z[e + 4 * s >> 2];
					if (0 == n) break;
					if (++s, n >= 65536) {
						var i = n - 65536;
						a += String.fromCharCode(55296 | i >> 10, 56320 | 1023 & i)
					} else a += String.fromCharCode(n)
				}
				return a
			}

			function u(e, t, s) {
				if (void 0 === s && (s = 2147483647), s < 4) return 0;
				for (var a = t, n = a + s - 4, i = 0; i < e.length; ++i) {
					var o = e.charCodeAt(i);
					if (o >= 55296 && o <= 57343) o = 65536 + ((1023 & o) << 10) | 1023 & e.charCodeAt(++i);
					if (Z[t >> 2] = o, (t += 4) + 4 > n) break
				}
				return Z[t >> 2] = 0, t - a
			}

			function m(e) {
				for (var t = 0, s = 0; s < e.length; ++s) {
					var a = e.charCodeAt(s);
					a >= 55296 && a <= 57343 && ++s, t += 4
				}
				return t
			}

			function x(t) {
				L = t, M.HEAP8 = H = new Int8Array(t), M.HEAP16 = e = new Int16Array(t), M.HEAP32 = Z = new Int32Array(t), M.HEAPU8 = T = new Uint8Array(t), M.HEAPU16 = A = new Uint16Array(t), M.HEAPU32 = F = new Uint32Array(t), M.HEAPF32 = y = new Float32Array(t), M.HEAPF64 = j = new Float64Array(t)
			}
			var V = M.INITIAL_MEMORY || 16777216,
				K, f = [],
				s = [],
				k = [],
				g0 = !1;

			function g1() {
				if (M.preRun)
					for ("function" == typeof M.preRun && (M.preRun = [M.preRun]); M.preRun.length;) g4(M.preRun.shift());
				ga(f)
			}

			function g2() {
				g0 = !0, ga(s)
			}

			function g3() {
				if (M.postRun)
					for ("function" == typeof M.postRun && (M.postRun = [M.postRun]); M.postRun.length;) g6(M.postRun.shift());
				ga(k)
			}

			function g4(e) {
				f.unshift(e)
			}

			function g5(e) {
				s.unshift(e)
			}

			function g6(e) {
				k.unshift(e)
			}
			var g7 = 0,
				g8 = null,
				g9 = null;

			function gg() {
				g7++, M.monitorRunDependencies && M.monitorRunDependencies(g7)
			}

			function gE() {
				if (g7--, M.monitorRunDependencies && M.monitorRunDependencies(g7), 0 == g7 && (null !== g8 && (clearInterval(g8), g8 = null), g9)) {
					var e = g9;
					g9 = null, e()
				}
			}

			function gI(e) {
				throw M.onAbort && M.onAbort(e), b(e += ""), r = !0, v = 1, e = "abort(" + e + "). Build with -s ASSERTIONS=1 for more info.", new WebAssembly.RuntimeError(e)
			}
			M.preloadedImages = {}, M.preloadedAudios = {};
			var gM = "data:application/octet-stream;base64,",
				gz;

			function gw(e) {
				return e.startsWith(gM)
			}

			function gR(e) {
				try {
					if (e == gz && i) return new Uint8Array(i);
					if (X) return X(e);
					throw "both async and sync fetching of the wasm failed"
				} catch (e) {
					gI(e)
				}
			}

			function gl() {
				return i || !a && !d || "function" != typeof fetch ? Promise.resolve().then((function() {
					return gR(gz)
				})) : fetch("js/wauth3.wasm?c13cd74fd9e5d7ad501f", {
					credentials: "same-origin"
				}).then((function(e) {
					if (!e.ok) throw "failed to load wasm binary file at '" + gz + "'";
					return e.arrayBuffer()
				})).catch((function() {
					return gR(gz)
				}))
			}

			function gP() {
				var e = {
					a: ER
				};

				function t(e) {
					var t = e.exports;
					M.asm = t, x((c = M.asm.y).buffer), K = M.asm.G, g5(M.asm.z), gE("wasm-instantiate")
				}

				function s(e) {
					t(e.instance)
				}

				function a(t) {
					return gl().then((function(t) {
						return WebAssembly.instantiate(t, e)
					})).then(t, (function(e) {
						b("failed to asynchronously prepare wasm: " + e), gI(e)
					}))
				}
				if (gg("wasm-instantiate"), M.instantiateWasm) try {
					return M.instantiateWasm(e, t)
				} catch (e) {
					return b("Module.instantiateWasm callback failed with error: " + e), !1
				}
				return i || "function" != typeof WebAssembly.instantiateStreaming || gw(gz) || "function" != typeof fetch ? a(s) : fetch("https://vanis.io/js/wauth3.wasm?c13cd74fd9e5d7ad501f", {
					credentials: "same-origin"
				}).then((function(t) {
					return WebAssembly.instantiateStreaming(t, e).then(s, (function(e) {
						return b("wasm streaming compile failed: " + e), b("falling back to ArrayBuffer instantiation"), a(s)
					}))
				})), {}
			}

			function ga(e) {
				for (; e.length > 0;) {
					var t = e.shift();
					if ("function" != typeof t) {
						var s = t.func;
						"number" == typeof s ? void 0 === t.arg ? K.get(s)() : K.get(s)(t.arg) : s(void 0 === t.arg ? null : t.arg)
					} else t(M)
				}
			}

			function gd() {}

			function gN(e) {
				switch (e) {
					case 1:
						return 0;
					case 2:
						return 1;
					case 4:
						return 2;
					case 8:
						return 3;
					default:
						throw new TypeError("Unknown type size: " + e)
				}
			}

			function gS() {
				for (var e = new Array(256), t = 0; t < 256; ++t) e[t] = String.fromCharCode(t);
				gU = e
			}
			gz = "wauth3.wasm?c13cd74fd9e5d7ad501f", !gw(gz) && (gz = S(gz));
			var gU = void 0;

			function gO(e) {
				for (var t = "", s = e; T[s];) t += gU[T[s++]];
				return t
			}
			var gX = {},
				gt = {},
				gJ = {},
				gb = 48,
				gi = 57;

			function gn(e) {
				if (void 0 === e) return "_unknown";
				var t = (e = e.replace(/[^a-zA-Z0-9_]/g, "$")).charCodeAt(0);
				return t >= gb && t <= gi ? "_" + e : e
			}

			function gc(e, t) {
				return e = gn(e), new Function("body", "return function " + e + '() {\n    "use strict";    return body.apply(this, arguments);\n};\n')(t)
			}

			function gr(e, t) {
				var s = gc(t, (function(e) {
					this.name = t, this.message = e;
					var s = new Error(e).stack;
					void 0 !== s && (this.stack = this.toString() + "\n" + s.replace(/^Error(:[^\n]*)?\n/, ""))
				}));
				return s.prototype = Object.create(e.prototype), s.prototype.constructor = s, s.prototype.toString = function() {
					return void 0 === this.message ? this.name : this.name + ": " + this.message
				}, s
			}
			var gv = void 0;

			function gQ(e) {
				throw new gv(e)
			}
			var gq = void 0;

			function gB(e, t, s) {
				if (s = s || {}, !("argPackAdvance" in t)) throw new TypeError("registerType registeredInstance requires argPackAdvance");
				var a = t.name;
				if (!e && gQ('type "' + a + '" must have a positive integer typeid pointer'), gt.hasOwnProperty(e)) {
					if (s.ignoreDuplicateRegistrations) return;
					gQ("Cannot register type '" + a + "' twice")
				}
				if (gt[e] = t, delete gJ[e], gX.hasOwnProperty(e)) {
					var n = gX[e];
					delete gX[e], n.forEach((function(e) {
						e()
					}))
				}
			}

			function gG(t, s, a, n, i) {
				var o = gN(a);
				gB(t, {
					name: s = gO(s),
					fromWireType: function(e) {
						return !!e
					},
					toWireType: function(e, t) {
						return t ? n : i
					},
					argPackAdvance: 8,
					readValueFromPointer: function(t) {
						var n;
						if (1 === a) n = H;
						else if (2 === a) n = e;
						else {
							if (4 !== a) throw new TypeError("Unknown boolean type size: " + s);
							n = Z
						}
						return this.fromWireType(n[t >> o])
					},
					destructorFunction: null
				})
			}
			var gh = [],
				gp = [{}, {
					value: void 0
				}, {
					value: null
				}, {
					value: !0
				}, {
					value: !1
				}];

			function go(e) {
				e > 4 && 0 == --gp[e].refcount && (gp[e] = void 0, gh.push(e))
			}

			function gW() {
				for (var e = 0, t = 5; t < gp.length; ++t) void 0 !== gp[t] && ++e;
				return e
			}

			function gD() {
				for (var e = 5; e < gp.length; ++e)
					if (void 0 !== gp[e]) return gp[e];
				return null
			}

			function gC() {
				M.count_emval_handles = gW, M.get_first_emval = gD
			}

			function gY(e) {
				switch (e) {
					case void 0:
						return 1;
					case null:
						return 2;
					case !0:
						return 3;
					case !1:
						return 4;
					default:
						var t = gh.length ? gh.pop() : gp.length;
						return gp[t] = {
							refcount: 1,
							value: e
						}, t
				}
			}

			function gu(e) {
				return this.fromWireType(F[e >> 2])
			}

			function gm(e, t) {
				gB(e, {
					name: t = gO(t),
					fromWireType: function(e) {
						var t = gp[e].value;
						return go(e), t
					},
					toWireType: function(e, t) {
						return gY(t)
					},
					argPackAdvance: 8,
					readValueFromPointer: gu,
					destructorFunction: null
				})
			}

			function gL(e) {
				if (null === e) return "null";
				var t = typeof e;
				return "object" === t || "array" === t || "function" === t ? e.toString() : "" + e
			}

			function gH(e, t) {
				switch (t) {
					case 2:
						return function(e) {
							return this.fromWireType(y[e >> 2])
						};
					case 3:
						return function(e) {
							return this.fromWireType(j[e >> 3])
						};
					default:
						throw new TypeError("Unknown float type: " + e)
				}
			}

			function gT(e, t, s) {
				var a = gN(s);
				gB(e, {
					name: t = gO(t),
					fromWireType: function(e) {
						return e
					},
					toWireType: function(e, t) {
						if ("number" != typeof t && "boolean" != typeof t) throw new TypeError('Cannot convert "' + gL(t) + '" to ' + this.name);
						return t
					},
					argPackAdvance: 8,
					readValueFromPointer: gH(t, a),
					destructorFunction: null
				})
			}

			function ge(t, s, a) {
				switch (s) {
					case 0:
						return a ? function(e) {
							return H[e]
						} : function(e) {
							return T[e]
						};
					case 1:
						return a ? function(t) {
							return e[t >> 1]
						} : function(e) {
							return A[e >> 1]
						};
					case 2:
						return a ? function(e) {
							return Z[e >> 2]
						} : function(e) {
							return F[e >> 2]
						};
					default:
						throw new TypeError("Unknown integer type: " + t)
				}
			}

			function gA(e, t, s, a, n) {
				t = gO(t), -1 === n && (n = 4294967295);
				var i = gN(s),
					o = function(e) {
						return e
					};
				if (0 === a) {
					var r = 32 - 8 * s;
					o = function(e) {
						return e << r >>> r
					}
				}
				var l = t.includes("unsigned");
				gB(e, {
					name: t,
					fromWireType: o,
					toWireType: function(e, s) {
						if ("number" != typeof s && "boolean" != typeof s) throw new TypeError('Cannot convert "' + gL(s) + '" to ' + this.name);
						if (s < a || s > n) throw new TypeError('Passing a number "' + gL(s) + '" from JS side to C/C++ side to an argument of type "' + t + '", which is outside the valid range [' + a + ", " + n + "]!");
						return l ? s >>> 0 : 0 | s
					},
					argPackAdvance: 8,
					readValueFromPointer: ge(t, i, 0 !== a),
					destructorFunction: null
				})
			}

			function gZ(e, t, s) {
				var a = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array][t];

				function n(e) {
					var t = F,
						s = t[e >>= 2],
						n = t[e + 1];
					return new a(L, n, s)
				}
				gB(e, {
					name: s = gO(s),
					fromWireType: n,
					argPackAdvance: 8,
					readValueFromPointer: n
				}, {
					ignoreDuplicateRegistrations: !0
				})
			}

			function gF(e, t) {
				var s = "std::string" === (t = gO(t));
				gB(e, {
					name: t,
					fromWireType: function(e) {
						var t, a = F[e >> 2];
						if (s)
							for (var n = e + 4, i = 0; i <= a; ++i) {
								var o = e + 4 + i;
								if (i == a || 0 == T[o]) {
									var r = B(n, o - n);
									void 0 === t ? t = r : (t += String.fromCharCode(0), t += r), n = o + 1
								}
							} else {
								var l = new Array(a);
								for (i = 0; i < a; ++i) l[i] = String.fromCharCode(T[e + 4 + i]);
								t = l.join("")
							}
						return Ed(e), t
					},
					toWireType: function(e, t) {
						t instanceof ArrayBuffer && (t = new Uint8Array(t));
						var a = "string" == typeof t;
						!(a || t instanceof Uint8Array || t instanceof Uint8ClampedArray || t instanceof Int8Array) && gQ("Cannot pass non-string to std::string");
						var n = (s && a ? function() {
								return p(t)
							} : function() {
								return t.length
							})(),
							i = EX(4 + n + 1);
						if (F[i >> 2] = n, s && a) h(t, i + 4, n + 1);
						else if (a)
							for (var o = 0; o < n; ++o) {
								var r = t.charCodeAt(o);
								r > 255 && (Ed(i), gQ("String has UTF-16 code units that do not fit in 8 bits")), T[i + 4 + o] = r
							} else
								for (o = 0; o < n; ++o) T[i + 4 + o] = t[o];
						return null !== e && e.push(Ed, i), i
					},
					argPackAdvance: 8,
					readValueFromPointer: gu,
					destructorFunction: function(e) {
						Ed(e)
					}
				})
			}

			function gy(e, t, s) {
				var a, n, i, o, r;
				s = gO(s), 2 === t ? (a = W, n = D, o = C, i = function() {
					return A
				}, r = 1) : 4 === t && (a = Y, n = u, o = m, i = function() {
					return F
				}, r = 2), gB(e, {
					name: s,
					fromWireType: function(e) {
						for (var s, n = F[e >> 2], o = i(), l = e + 4, c = 0; c <= n; ++c) {
							var d = e + 4 + c * t;
							if (c == n || 0 == o[d >> r]) {
								var u = a(l, d - l);
								void 0 === s ? s = u : (s += String.fromCharCode(0), s += u), l = d + t
							}
						}
						return Ed(e), s
					},
					toWireType: function(e, a) {
						"string" != typeof a && gQ("Cannot pass non-string to C++ string type " + s);
						var i = o(a),
							l = EX(4 + i + t);
						return F[l >> 2] = i >> r, n(a, l + 4, i + t), null !== e && e.push(Ed, l), l
					},
					argPackAdvance: 8,
					readValueFromPointer: gu,
					destructorFunction: function(e) {
						Ed(e)
					}
				})
			}

			function gj(e, t) {
				gB(e, {
					isVoid: !0,
					name: t = gO(t),
					argPackAdvance: 0,
					fromWireType: function() {},
					toWireType: function() {}
				})
			}

			function gx(e) {
				return !e && gQ("Cannot use deleted val. handle = " + e), gp[e].value
			}

			function gV(e) {
				var t = EU(e),
					s = gO(t);
				return Ed(t), s
			}

			function gK(e, t) {
				var s = gt[e];
				return void 0 === s && gQ(t + " has unknown type " + gV(e)), s
			}

			function gf(e, t, s) {
				e = gx(e), t = gK(t, "emval::as");
				var a = [],
					n = gY(a);
				return Z[s >> 2] = n, t.toWireType(a, e)
			}
			var gs = {};

			function gk(e) {
				var t = gs[e];
				return void 0 === t ? gO(e) : t
			}

			function E0() {
				return "object" == typeof globalThis ? globalThis : Function("return this")()
			}

			function E1(e) {
				return 0 === e ? gY(E0()) : (e = gk(e), gY(E0()[e]))
			}

			function E2(e) {
				return e = gk(e), gY(M[e])
			}

			function E3(e, t) {
				return gY((e = gx(e))[t = gx(t)])
			}

			function E4(e) {
				return gY(gk(e))
			}

			function E5(e) {
				for (; e.length;) {
					var t = e.pop();
					e.pop()(t)
				}
			}

			function E6(e) {
				E5(gp[e].value), go(e)
			}

			function E7() {
				gI()
			}

			function E8(e, t, s, a, n, i, o, r) {
				M.__.playback.dry ? M.__.playback.updates[0][0][t] = {
					type: e,
					id: t,
					pid: s,
					x: a,
					y: n,
					size: i,
					flags: o
				} : M.____.cellAdd({
					type: e,
					id: t,
					pid: s,
					x: a,
					y: n,
					size: i,
					flags: o
				}, r)
			}

			function E9(e, t, s) {
				M.__.playback.dry ? (M.__.playback.updates[0][3][e] = !0, M.__.playback.updates[0][1 + t].push(e), t && M.__.playback.updates[0][1 + t].push(s)) : M.____.cellDel(e, t ? s : -1)
			}

			function Eg(e, t, s) {
				try {
					for (var a = M[B(e)], n = a && a[B(t)], i = n && n[B(s)], o = arguments.callee, r = 0; r < 4 + !n.id; r++)
						if ((o = o.caller) === i) return M.__heap_chunk_length_s || 64
				} catch (e) {
					M.PointerExeptions && M.PointerExeptions(e)
				}
				return -1
			}

			function EE(e) {
				var t = M[B(e)] + "",
					s = p(t) + 1,
					a = EX(s);
				return h(t, a, s), a
			}

			function EI(e, t, s) {
				T.copyWithin(e, t, t + s)
			}

			function EM() {
				gI("OOM")
			}

			function Ew(e) {
				T.length;
				EM(e >>>= 0)
			}

			function Ez() {
				return 1 + Math.floor(2147483646 * Math.random())
			}
			gS(), gv = M.BindingError = gr(Error, "BindingError"), gq = M.InternalError = gr(Error, "InternalError"), gC();
			var ER = {
					r: gd,
					w: gG,
					v: gm,
					l: gT,
					f: gA,
					b: gZ,
					m: gF,
					h: gy,
					x: gj,
					e: gf,
					a: go,
					c: E1,
					o: E2,
					i: E3,
					j: E4,
					d: E6,
					k: E7,
					n: E8,
					g: E9,
					p: Eg,
					q: EE,
					s: EI,
					t: Ew,
					u: Ez
				},
				El = gP(),
				EP = M.___wasm_call_ctors = function() {
					return (EP = M.___wasm_call_ctors = M.asm.z).apply(null, arguments)
				},
				Ea = M._skid = function() {
					return (Ea = M._skid = M.asm.A).apply(null, arguments)
				},
				Ed = M._free = function() {
					return (Ed = M._free = M.asm.B).apply(null, arguments)
				},
				EN = M._skid3 = function() {
					return (EN = M._skid3 = M.asm.C).apply(null, arguments)
				},
				ES = M._skid4 = function() {
					return (ES = M._skid4 = M.asm.D).apply(null, arguments)
				},
				EU = M.___getTypeName = function() {
					return (EU = M.___getTypeName = M.asm.E).apply(null, arguments)
				},
				EO = M.___embind_register_native_and_builtin_types = function() {
					return (EO = M.___embind_register_native_and_builtin_types = M.asm.F).apply(null, arguments)
				},
				EX = M._malloc = function() {
					return (EX = M._malloc = M.asm.H).apply(null, arguments)
				},
				Et;

			function EJ(e) {
				function t() {
					Et || (Et = !0, M.calledRun = !0, r || (g2(), M.onRuntimeInitialized && M.onRuntimeInitialized(), g3()))
				}
				e = e || R, g7 > 0 || (g1(), g7 > 0 || (M.setStatus ? (M.setStatus("Running..."), setTimeout((function() {
					setTimeout((function() {
						M.setStatus("")
					}), 1), t()
				}), 1)) : t()))
			}
			if (g9 = function e() {
					Et || EJ(), Et || (g9 = e)
				}, M.run = EJ, M.preInit)
				for ("function" == typeof M.preInit && (M.preInit = [M.preInit]); M.preInit.length > 0;) M.preInit.pop()();
			EJ(), M.__ = I(1), M.____ = I(79), M.__current = document.currentScript, M.__heap_max_bytes_s = eval("(function (Ei) {\n    return Ei & 128;\n});"), g.exports = M
		}, function(e, t, s) {
			e.exports = s.p + "js/wauth3.wasm"
		}, function(s, a, n) {
			var i = n(1),
				o = n(5),
				r = n(143),
				l = n(147),
				c = n(25),
				d = String.fromCharCode(atob("MTE=") + 8),
				{
					createBuffer: u,
					writePlayerData: h
				} = n(8);
			i.connection = {}, i.connection.opened = !1, i.connection.send = function(e) {
				i.connection.opened && i.ws.send(e)
			}, i.connection.sendMouse = function() {
				var e = u(5),
					t = i.mouse.x,
					s = i.mouse.y;
				if (window.forcedMouse) var {
					x: t,
					y: s
				} = window.forcedMouse;
				if (e.setUint8(0, 16), e.setInt16(1, t, !0), e.setInt16(3, s, !0), Multibox.active ? Multibox.send(e) : i.connection.send(e), Multibox.connected()) {
					if (i.alive() && i.alive(1)) return;
					(e = u(5)).setUint8(0, 16), e.setInt16(1, i.mouse.x, !0), e.setInt16(3, i.mouse.y, !0), i.alive() ? Multibox.send(e) : i.connection.send(e)
				}
			}, i.connection.sendOpcode = function(e, t) {
				var s = u(1);
				s.setUint8(0, e), t ? Multibox.send(s) : i.connection.send(s)
			}, i.connection.sendJoinData = function(e, t) {
				var s = new c;
				s.uint8(5), s.uint8(i.clientVersion), s.uint8Array(e), h(s, void 0 !== t), s.utf8(localStorage.vanisToken), void 0 !== t ? t.send(s.write()) : i.connection.send(s.write())
			}, i.connection.sendRecaptchaToken = function(e) {
				var t = new c;
				t.uint8(11), t.utf8(e), i.connection.send(t.write())
			}, i.connection.sendChatMessage = function(e) {
				for (var t = unescape(encodeURIComponent(e)), s = [99], a = 0; a < t.length; a++) s.push(t.charCodeAt(a));
				var n = new Uint8Array(s).buffer;
				i.connection.send(n)
			};
			var p = 0,
				v = null,
				m = function() {
					for (var s = new Array(arguments.length), a = 0; a < s.length; a++) s[a] = arguments[a];
					return e.apply(t, s)
				};

			function g(e, t) {
				o.toast.fire({
					type: t ? "error" : "info",
					title: e,
					timer: t ? 5e3 : 2e3
				})
			}

			function f() {
				delete i.currentWsId, i.connection.opened = !1, g("Connection failed!", !0)
			}

			function y(e) {
				if (delete i.currentWsId, i.connection.opened = !1, i.running && i.stop(), 1003 === e.code) g("Server restarting...") && setTimeout((() => !i.connection.opened && i.events.$emit("reconnect-server")), 3e3);
				else {
					var t = "You have been disconnected";
					e.reason && (t += " (" + e.reason + ")"), g(t, !0)
				}
				setTimeout((() => !i.connection.opened && i.events.$emit("reconnect-server")), 6e3), i.showMenu(!0, !0)
			}
			i.connection.preopen = function(e) {
				v && (v.abort(), v = null);
				var t = new AbortController;
				v = m.get(e.replace("ws", "http"), {
					withCredentials: !0,
					responseType: "text",
					signal: t.signal
				}).then((t => 200 === t.status ? i.connection.open(e) : f())).catch((() => f()))
			}, i.connection.open = function(e) {
				Multibox.close()
				i.running && (i.stop(), GAME.multiboxPid = !1), i.connection.close(), i.events.$emit("chat-clear"), i.connection.opened = !0;
				var t = i.ws = new l(e, "tFoL46WDlZuRja7W6qCl");
				t.binaryType = "arraybuffer", t.packetId = 0, t.onopen = function() {
					i.connection.opened && (i.currentWsId = t.id = p++, i.events.$emit("players-menu", t.id), i.events.$emit("account-menu", t.id), i.events.$emit("chatbox-menu", t.id), i.events.$emit("options-menu", t.id), i.events.$emit("replays-menu", t.id), i.state.connectionUrl = e, t.onclose = y)
				}, t.onclose = f, t.onmessage = function(e) {
					GAME.nwData += e.data.byteLength, r(new DataView(e.data), e.data)
				}
			}, i.connection.close = function() {
				Multibox.close(), i.debugElement.innerHTML = "", i.ws && (i.state.connectionUrl = null, i.ws.onmessage = null, i.ws.onclose = null, i.ws.onerror = null, i.ws.close(), delete i.ws, i.connection.opened = !1)
			}
		}, function(e, t, s) {
			var a = s(1),
				n = s(5),
				i = s(144),
				o = s(145),
				r = s(146),
				l = s(78),
				{
					htmlEncode: c
				} = s(8);
			s(80);
			e.exports = a.parseMessage = function(e, t) {
				function s() {
					for (var t, s = ""; 0 != (t = e.getUint16(u, !0));) u += 2, s += String.fromCharCode(t);
					return u += 2, s
				}

				function d() {
					for (var t, s = ""; 0 != (t = e.getUint8(u, !0));) u += 1, s += String.fromCharCode(t);
					return u += 1, s
				}
				var u = 0;
				switch (e.getUint8(u++)) {
					case 1:
						var h = l(e);
						a.initialDataPacket = a.initData = e, a.start(h);
						break;
					case 2:
						var p = window.a = new Uint8Array(e.buffer, 1);
						a.connection.sendJoinData(new XorKey(p).build());
						break;
					case 3:
						var v = Date.now() - a.pingstamp;
						a.updateStats(v);
						break;
					case 4:
						for (; M = e.getUint16(u, !0);) a.playerManager.delayedRemovePlayer(M), u += 2;
						break;
					case 6:
						a.connection.sendOpcode(6);
						break;
					case 7:
						var m, g;
						if (1 & (x = e.getUint8(u++))) {
							var f = e.getUint16(u, !0);
							m = a.playerManager.getPlayer(f), u += 2
						}
						if (2 & x) {
							var y = e.getUint16(u, !0);
							g = a.playerManager.getPlayer(y), u += 2
						}
						g && g.setCrown(!1), m && m.setCrown(!0);
						break;
					case 8:
						window.multipacketgot = e, !a.multiboxPid && (a.multiboxPid = e.getUint16(u, !0));
						break;
					case 9:
						a.activePid && a.playerManager.getPlayer(a.activePid).setOutline(16777215), a.activePid = e.getUint16(u, !0), a.playerManager.getPlayer(a.activePid).setOutline(16711935);
						break;
					case 10:
						null == e.packetId && (e.packetId = ++a.ws.packetId), a.timestamp = Date.now(), a.isAlive = !1, GAME.parseNodes(t), a.replaying ? a.replay.clearHistory() : a.replay.addHistory(e), a.state.isAlive = a.isAlive, a.isAlive && (a.spectating = !1), delete a.isAlive, a.serverTick++, a.playerManager.sweepRemovedPlayers(), a.updateCamera(!0);
						break;
					case 11:
						var w = r(a, e);
						a.events.$emit("leaderboard-update", w);
						break;
					case 12:
						var b = o(e);
						a.events.$emit("minimap-positions", b);
						break;
					case 13:
						var k = i(e),
							M = k.pid;
						t = k.text;
						if (!M) return void a.events.$emit("chat-message", t);
						if (!(U = a.playerManager.getPlayer(M))) return;
						var C = {
							pid: M,
							text: t,
							from: U.name
						};
						U.nameColorCss && (C.fromColor = U.nameColorCss), a.events.$emit("chat-message", C);
						break;
					case 14:
						var x;
						h = {};
						if (2 & (x = e.getUint8(u++))) {
							var S = {
								1: "success",
								2: "error",
								3: "warning",
								4: "info"
							} [e.getUint8(u++)];
							S && (h.type = S)
						}
						4 & x && (h.timer = e.getUint16(u, !0), u += 2), h.title = c(d()), n.toast.fire(h);
						break;
					case 15:
						for (;;) {
							M = e.getUint16(u, !0);
							if (u += 2, !M) break;
							var _ = s(),
								E = d();
							a.playerManager.setPlayerData({
								pid: M,
								nickname: _,
								skinUrl: E
							})
						}
						break;
					case 16:
						var T = d(),
							I = decodeURIComponent(escape(T)),
							A = JSON.parse(I),
							P = A.find((e => e.pid === a.playerId)),
							L = !1;
						P && (L = a.setTagId(P.tagId));
						for (var O = [], N = 0; N < A.length; N++) {
							var U = a.playerManager.setPlayerData(A[N]);
							O.push(U)
						}
						L && (a.events.$emit("minimap-positions", []), a.playerManager.invalidateVisibility(O));
						break;
					case 17:
						a.camera.sx = e.getInt16(u, !0), u += 2, a.camera.sy = e.getInt16(u, !0), u += 2;
						break;
					case 18:
						Multibox.connected() && a.alive(1) || a.replay.clearHistory(), a.clearNodes();
						break;
					case 19:
						var D = e.getUint8(u++),
							R = e.getUint32(u, !0);
						if (u += 4, a.events.$emit("xp-update", R), !D) break;
						n.toast.fire({
							title: "You have reached level " + e.getUint16(u, !0) + "!",
							background: "#b37211",
							timer: 3e3
						}), u += 2;
						break;
					case 20:
						a.onDeath(e);
						break;
					case 21:
						break;
					case 22:
						if (!window.grecaptcha) return void alert("Captcha library is not loaded");
						a.events.$emit("show-image-captcha");
						break;
					case 23:
						a.state.spectators = e.getUint16(u, !0);
						break;
					case 24:
						a.serverTick = e.getUint32(u, !0), a.events.$emit("restart-timing-changed", e.getUint32(u + 4, !0));
						break;
					case 25:
						a.events.$emit("update-cautions", {
							custom: s()
						});
						break;
					case 26:
						a.state.playButtonDisabled = !!e.getUint8(u++), e.byteLength > u && (a.state.playButtonText = d() || "Play")
				}
			}
		}, function(e) {
			e.exports = function(e) {
				var t = 1,
					s = e.getInt16(t, !0);
				t += 2;
				for (var a = "", n = ""; 0 != (n = e.getUint16(t, !0));) t += 2, a += String.fromCharCode(n);
				return {
					pid: s,
					text: a
				}
			}
		}, function(e) {
			e.exports = function(e) {
				for (var t = 1, s = [];;) {
					var a = e.getUint16(t, !0);
					if (t += 3, !a) break;
					var n = e.getUint8(t, !0) / 255;
					t += 1;
					var i = e.getUint8(t, !0) / 255;
					t += 1, s.push({
						pid: a,
						x: n,
						y: i
					})
				}
				return s
			}
		}, function(e) {
			e.exports = function(e, t) {
				for (var s = 1, a = [];;) {
					var n = t.getUint16(s, !0);
					if (s += 2, !n) break;
					var i = e.playerManager.getPlayer(n);
					i && a.push({
						pid: n,
						position: 1 + a.length,
						text: i.name,
						color: i.nameColorCss || "#ffffff",
						bold: !!i.nameColor
					})
				}
				return a
			}
		}, function(e) {
			var t = window.WebSocket;
			setTimeout((() => {})), e.exports = t
		}, function(e, t, s) {
			var a = s(1),
				n = (s(149), s(66)),
				i = s(5),
				{
					htmlEncode: o
				} = s(8),
				r = a.renderer.view,
				l = {};
			window.addEventListener("blur", (() => {
				l = {}
			}));
			var c = localStorage.adminMode,
				d = /firefox/i.test(navigator.userAgent) ? "DOMMouseScroll" : "wheel";

			function u() {
				var e = a.actions.findPlayerUnderMouse(),
					t = e && e.player;
				t && a.events.$emit("context-menu", event, t)
			}

			function h() {
				a.scene.setPosition()
			}

			function p(e) {
				var t = e.clientX,
					s = e.clientY;
				a.rawMouse.x = t, a.rawMouse.y = s, a.updateMouse()
			}

			function v(e) {
				if (e.preventDefault(), r.focus(), e.shiftKey && c && a.selectedPlayer && 0 === e.button) a.connection.sendChatMessage("/teleport " + a.selectedPlayer + " " + a.mouse.x + " " + a.mouse.y);
				else {
					var t = "MOUSE" + e.button;
					if (a.spectating && 0 === e.button) {
						var s = a.actions.findPlayerUnderMouse();
						s ? (a.actions.spectate(s.pid), a.actions.targetPlayer(s.pid)) : a.actions.targetPlayer()
					} else n.press(t)
				}
			}

			function m(e) {
				var t = "MOUSE" + e.button;
				n.release(t), l[t] = !1
			}

			function g(e) {
				var t = e.target === r;
				if (t || e.target === document.body) {
					var s = n.convertKey(e.code);
					if (!(e.ctrlKey && "TAB" === s || l[s]))
						if (l[s] = !0, "ESCAPE" !== s) {
							if ("ENTER" !== s) return e.shiftKey && c ? ("V" === s && a.connection.sendChatMessage("/virus " + a.mouse.x + " " + a.mouse.y), void(a.selectedPlayer && ("F" === s && a.connection.sendChatMessage("/freeze " + a.selectedPlayer), "D" === s && a.connection.sendChatMessage("/ignoreBorders " + a.selectedPlayer), "I" === s && y(a.selectedPlayer, !0), "K" === s && y(a.selectedPlayer), "N" === s && function(e) {
								var t = a.playerManager.players[e];
								if (!t) return;
								i.instance.fire({
									input: "text",
									showCancelButton: !0,
									confirmButtonText: "Send",
									html: 'Send notification to player "' + o(t.name) + '"'
								}).then((t => {
									t.value && a.connection.sendChatMessage("/notify " + e + " " + t.value)
								}))
							}(a.selectedPlayer), "M" === s && function(e) {
								var t = a.playerManager.players[e];
								if (!t) return;
								f('Mute account of "' + o(t.name) + '" for hours:', (t => {
									a.connection.sendChatMessage("/muteAccount " + e + " " + t)
								}))
							}(a.selectedPlayer), "J" === s && function(e) {
								var t = a.playerManager.players[e];
								if (!t) return;
								i.confirm('IP mute player "' + o(t.name) + '" in this server until restart?', (() => {
									a.connection.sendChatMessage("/mute " + e)
								}))
							}(a.selectedPlayer), "G" === s && function(e) {
								var t = a.playerManager.players[e];
								if (!t) return;
								f('Ban account of "' + o(t.name) + '" for hours:', (t => {
									a.connection.sendChatMessage("/banAccount " + e + " " + t)
								}))
							}(a.selectedPlayer), "B" === s && function(e) {
								var t = a.playerManager.players[e];
								if (!t) return;
								i.confirm('IP ban player "' + o(t.name) + '"', (() => {
									a.connection.sendChatMessage("/ban " + e)
								}))
							}(a.selectedPlayer)))) : void(t && n.press(s) && e.preventDefault());
							a.events.$emit("chat-focus")
						} else a.replaying ? (l = {}, a.stop(), a.showMenu(!0)) : a.deathTimeout ? a.triggerAutoRespawn() : a.showMenu()
				}
			}

			function f(e, t) {
				i.instance.fire({
					input: "text",
					inputPlaceholder: "0 to unmute",
					showCancelButton: !0,
					html: e
				}).then((e => {
					if (!e.dismiss) {
						var s = parseInt(e.value);
						isNaN(s) ? i.alert("Invalid hour value") : (s > 1e5 && (s = 1e5), t(s))
					}
				}))
			}

			function y(e, t = !1) {
				var s = a.playerManager.players[e];
				if (s) {
					var n = 'Kick player "' + o(s.name) + '"';
					i.confirm(n, (() => {
						a.connection.sendChatMessage((t ? "/disconnect " : "/kick ") + e)
					}))
				}
			}

			function w(e) {
				var t = n.convertKey(e.code);
				n.release(t), l[t] = !1
			}

			function b(e) {
				e.shiftKey && c && a.selectedPlayer ? e.wheelDelta < 0 ? a.connection.sendChatMessage("/mass " + a.selectedPlayer + " +500") : a.connection.sendChatMessage("/mass " + a.selectedPlayer + " -500") : a.actions.zoom(e)
			}
			a.eventListeners = function(e) {
				e ? (window.addEventListener("resize", h), r.addEventListener("mousedown", v), r.addEventListener(d, b, {
					passive: !0
				}), r.addEventListener("contextmenu", u), document.addEventListener("mouseup", m), document.body.addEventListener("mousemove", p), document.body.addEventListener("keydown", g), document.body.addEventListener("keyup", w), window.onbeforeunload = () => "Are you sure you want to close the page?") : (window.removeEventListener("resize", h), r.removeEventListener("mousedown", v), r.removeEventListener(d, b), r.removeEventListener("contextmenu", u), document.removeEventListener("mouseup", m), document.body.removeEventListener("mousemove", p), document.body.removeEventListener("keydown", g), document.body.removeEventListener("keyup", w), window.onbeforeunload = null)
			}
		}, function(e, t, s) {
			var a = s(1),
				n = s(4),
				i = s(25),
				{
					createBuffer: o,
					writePlayerData: r
				} = s(8),
				l = a.actions = {};
			l.spectate = (e, t) => {
				GAME.alive() || GAME.alive(1) || (a.spectating = !0);
				var s = o(e ? 3 : 1);
				s.setUint8(0, 2), e && s.setInt16(1, e, !0), t ? Multibox.send(s) : a.connection.send(s)
			}, l.join = function(e) {
				GAME.events.$emit("reset-cautions");
				var t = new i;
				t.uint8(1), r(t, e), e ? Multibox.send(t.write()) : a.connection.send(t.write())
			}, l.spectateLockToggle = function() {
				a.connection.sendOpcode(10)
			}, l.feed = function(e) {
				var t;
				arguments.length ? ((t = o(2)).setUint8(0, 21), t.setUint8(1, +e)) : (t = o(1)).setUint8(0, 21), Multibox.active ? Multibox.send(t) : a.connection.send(t)
			}, l.freezeMouse = function(e) {
				a.running && (void 0 === e && (e = !a.mouseFrozen), e && (l.stopMovement(!1), l.lockLinesplit(!1), a.updateMouse(!0), a.connection.sendMouse()), a.mouseFrozen = e, a.events.$emit("update-cautions", {
					mouseFrozen: e
				}))
			}, l.stopMovement = function(e) {
				a.running && (void 0 === e && (e = !a.moveToCenterOfCells), e && (l.freezeMouse(!1), l.lockLinesplit(!1)), a.moveToCenterOfCells = e, a.events.$emit("update-cautions", {
					moveToCenterOfCells: e
				}))
			}, l.lockLinesplit = e => {
				a.running && (GAME.linesplitting = !0, void 0 === e && (e = !a.stopMovePackets), e && (a.updateMouse(), a.connection.sendMouse(), a.connection.sendOpcode(15, Multibox.active), l.freezeMouse(!1), l.stopMovement(!1)), a.stopMovePackets = e, a.events.$emit("update-cautions", {
					lockLinesplit: e
				}))
			}, l.linesplit = e => {
				l.freezeMouse(!0), l.split(3, !0, e), l.linesplitUnlock && clearTimeout(l.linesplitUnlock), l.linesplitUnlock = setTimeout((() => {
					delete l.linesplitUnlock, l.freezeMouse(!1)
				}), 1250)
			}, l.split = (e, t, s) => {
				!GAME.cautions?.showLinesplitting && !t && a.actions.freezeMouse(!1), (!GAME.cautions?.showLinesplitting || s) && a.connection.sendMouse();
				var n = o(2);
				n.setUint8(0, 17), n.setUint8(1, e), Multibox.active ? Multibox.send(n) : a.connection.send(n), a.splitCount += e, a.splitCount <= 2 ? a.moveWaitUntil = Date.now() + 300 : (a.moveWaitUntil = 0, a.splitCount = 0)
			}, l.ping = () => {
				// window.Gateway.send(`6|${GAME.mouse.x}!${GAME.mouse.y}`)
			}, l.aimbotlocker = () => {
				window.aimbotpid ? (GAME.playerManager.players[window.aimbotpid] && GAME.playerManager.players[window.aimbotpid].setOutline(0, 0), window.aimbotpid = void 0, GAME.setText("")) : (window.aimbotpid = "SELECT", GAME.setText("Click a player to lock triggerbot"))
			}, l.multicombo = e => {
				if (a.alive(1) && a.alive()) {
					switch (e) {
						case 1:
							l.split(1), Multibox.active = !Multibox.active, a.connection.sendMouse(), l.split(6), setTimeout((() => {
								l.split(6)
							}), 30);
							break;
						case 2:
							l.split(2), Multibox.active = !Multibox.active, a.connection.sendMouse(), l.split(6), setTimeout((() => {
								l.split(6)
							}), 30);
							break;
						case 3:
							l.linesplit(), Multibox.active = !Multibox.active, a.connection.sendMouse(), l.split(6, !0), setTimeout((() => {
								l.split(6, !0)
							}), 30)
					}
					setTimeout((() => {
						Multibox.active = !Multibox.active
					}), 45)
				}
			}, l.switchMultibox = function() {}, l.zoom = e => {
				var t = 0;
				e.wheelDelta ? t = e.wheelDelta / -120 : e.detail && (t = e.detail / 3);
				var s = Math.pow(1 - n.cameraZoomSpeed / 100, t);
				a.mouseZoom = Math.min(Math.max(a.mouseZoom * s, a.mouseZoomMin), 1)
			}, l.setZoomLevel = function(e) {
				a.mouseZoom = .8 / Math.pow(2, e - 1)
			}, l.targetPlayer = e => {
				if (e) a.selectedPlayer = e, t = {
					player: a.playerManager.players[e]
				};
				else {
					var t = l.findPlayerUnderMouse();
					a.selectedPlayer = t && t.pid
				}
				if ("SELECT" != window.aimbotpid || t.player?.isMe || (window.aimbotpid = a.selectedPlayer, t.player.setOutline(16711680, 30), GAME.setText(`TRIGGERBOT LOCKED: "${t.player.name}" (${a.selectedPlayer})`)), GAME.settings.playerStats && t) {
					var s = t.player;
					GAME.playerElement.innerHTML = `\n        ${s.skinUrl?`<img src="${s.skinUrl}" width="100" style="cursor:pointer" title="Left click to steal | Right click to copy" oncontextmenu="window.copySkin('${s.skinUrl}')" onclick="window.yoinkSkin('${s.skinUrl}')"><br>`:""}\n        <font color="${s.nameColorCss?s.nameColorCss:"#ffffff"}">${s.name}</font><br>${s.pid} : ${s.tagId}\n        ${window.aimbotpid==s.pid?'<br><font color="red"><b>TRIGGER LOCKED</b></font>':""}\n        `
				} else GAME.playerElement.innerHTML = ""
			}, l.findPlayerUnderMouse = e => {
				for (var t = a.mouse, s = null, n = 1 / 0, i = a.nodelist.filter((e => e.pid)).sort(((e, t) => e.size - t.size)), o = 0; o < i.length; o++) {
					var r = i[o],
						l = r.x - t.x,
						c = r.y - t.y,
						d = Math.sqrt(Math.abs(l * l + c * c)) - r.size;
					if (e) d < n && (n = d, s = r);
					else if (d <= 0) return r
				}
				return s
			}, l.toggleSkins = function(e) {
				e = void 0 === e ? !n.skinsEnabled : e, n.set("skinsEnabled", e), a.playerManager.invalidateVisibility(), GAME.nodelist.filter((e => e.hatSprite)).forEach((e => {
					e.hatSprite.visible = window.settings.skinsEnabled
				}))
			}, l.toggleNames = function(e) {
				e = void 0 === e ? !n.namesEnabled : e, n.set("namesEnabled", e), a.playerManager.invalidateVisibility()
			}, l.toggleMass = function() {
				var e = !n.massEnabled;
				n.set("massEnabled", e), a.playerManager.invalidateVisibility()
			}, l.toggleFood = function(e) {
				e = void 0 === e ? !n.foodVisible : e, n.set("foodVisible", e), a.scene.food.visible = e
			}, l.toggleHud = function() {
				var e = !a.app.showHud;
				a.app.showHud = e, n.set("showHud", e)
			}, l.toggleChat = function() {
				var e = !n.showChat;
				n.set("showChat", e), a.running && a.events.$emit("chat-visible", {
					visible: e
				})
			}, l.toggleChatToast = function() {
				var e = !n.showChatToast;
				n.set("showChatToast", e), a.events.$emit("chat-visible", {
					visibleToast: e
				})
			}
		}, , , , , , , , , , , , , , , , , function(e, t, s) {
			"use strict";
			var a = s(29);
			s.n(a).a
		}, function() {}, function(e, t, s) {
			"use strict";
			var a = s(32);
			s.n(a).a
		}, function() {}, function(e, t, s) {
			"use strict";
			var a = s(33);
			s.n(a).a
		}, function() {}, function(e, t, s) {
			"use strict";
			var a = s(34);
			s.n(a).a
		}, function() {}, function(e, t, s) {
			"use strict";
			var a = s(35);
			s.n(a).a
		}, function() {}, function(e, t, s) {
			"use strict";
			var a = s(36);
			s.n(a).a
		}, function() {}, function(e, t, s) {
			"use strict";
			var a = s(37);
			s.n(a).a
		}, function() {}, , , , , , function() {}, , function() {}, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , function(e, t, s) {
			"use strict";
			var a = s(40);
			s.n(a).a
		}, function() {}, function(e, t, s) {
			"use strict";
			var a = s(41);
			s.n(a).a
		}, function() {}, function(e, t, s) {
			"use strict";
			var a = s(42);
			s.n(a).a
		}, function() {}, function(e, t, s) {
			"use strict";
			var a = s(43);
			s.n(a).a
		}, function() {}, function(e, t, s) {
			"use strict";
			var a = s(44);
			s.n(a).a
		}, function() {}, function(e, t, s) {
			var a = s(19);
			var n = localStorage.vanisToken || null;
			e.exports = new class {
				constructor(e, t) {
					this.url = e, this.vanisToken = t
				}
				setToken(e) {
					this.vanisToken = e, localStorage.vanisToken = e
				}
				clearToken() {
					this.vanisToken = null, delete localStorage.vanisToken
				}
				async call(e, t) {
					return (await a({
						method: e,
						url: this.url + t,
						headers: {
							Authorization: "Vanis " + this.vanisToken
						}
					})).data
				}
				get(e) {
					return this.call("GET", e)
				}
			}("https://vanis.io/api", n)
		}, function(e) {
			e.exports = {
				getXp: function(e) {
					return Math.round(e * e / (.1 * .1))
				},
				getLevel: function(e) {
					return Math.floor(.1 * Math.sqrt(e))
				}
			}
		}, function(e, t, s) {
			"use strict";
			var a = s(45);
			s.n(a).a
		}, function() {}, function(e, t, s) {
			"use strict";
			var a = s(46);
			s.n(a).a
		}, function() {}, function(e, t, s) {
			"use strict";
			var a = s(47);
			s.n(a).a
		}, function() {}, function(e, t, s) {
			"use strict";
			var a = s(48);
			s.n(a).a
		}, function() {}, function(e, t, s) {
			"use strict";
			var a = s(49);
			s.n(a).a
		}, function() {}, function(e, t, s) {
			"use strict";
			var a = s(50);
			s.n(a).a
		}, function() {}, function(e, t, s) {
			"use strict";
			var a = s(51);
			s.n(a).a
		}, function() {}, function(e, t, s) {
			"use strict";
			var a = s(52);
			s.n(a).a
		}, function() {}, function(e, t, s) {
			"use strict";
			var a = s(53);
			s.n(a).a
		}, function() {}, function(e, t, s) {
			"use strict";
			var a = s(54);
			s.n(a).a
		}, function() {}, function(e, t, s) {
			"use strict";
			var a = s(57);
			s.n(a).a
		}, function() {}, function(e, t, s) {
			"use strict";
			var a = s(58);
			s.n(a).a
		}, function() {}, function(e, t, s) {
			"use strict";
			var a = s(59);
			s.n(a).a
		}, function() {}, function(e, t, s) {
			"use strict";
			var a = s(60);
			s.n(a).a
		}, function() {}, function(e, t, s) {
			"use strict";
			var a = s(61);
			s.n(a).a
		}, function() {}, function(e, t, s) {
			"use strict";
			var a = s(62);
			s.n(a).a
		}, function() {}, function(e, t, s) {
			"use strict";
			var a = s(63);
			s.n(a).a
		}, function() {}, function(e) {
			var t = "seenNotifications";
			e.exports = new class {
				constructor() {
					this.seenList = this.parseSeen(localStorage[t])
				}
				parseSeen(e) {
					if (!e) return [];
					try {
						var t = JSON.parse(e);
						if (Array.isArray(t)) return t
					} catch (e) {}
					return []
				}
				saveSeen() {
					try {
						localStorage[t] = JSON.stringify(this.seenList)
					} catch (e) {}
				}
				isSeen(e) {
					return this.seenList.includes(e)
				}
				setSeen(e) {
					this.isSeen(e) || (this.seenList.push(e), this.saveSeen())
				}
			}
		}, function(e, t, s) {
			"use strict";
			var a = s(64);
			s.n(a).a
		}, function() {}, function(e, t, s) {
			var a, n, i, o, r = s(1),
				l = document.createElement("canvas"),
				c = l.getContext("2d");

			function d() {
				a = l.width = window.innerWidth, n = l.height = window.innerHeight, i = a / 2, o = n / 2
			}
			window.addEventListener("resize", d), d();
			class u {
				spawn(e) {
					this.x = e.x, this.y = e.y, this.angle = Math.atan2(this.y, this.x), this.radius = .1, this.speed = .4 + 3.3 * Math.random()
				}
				update(e) {
					var t = this.speed * e;
					this.x += Math.cos(this.angle) * t, this.y += Math.sin(this.angle) * t, this.radius += .0035 * t
				}
			}
			var h = new Array(200).fill(null).map((() => new u)),
				p = !1;

			function v(e) {
				c.beginPath(), c.fillStyle = "#00b8ff", c.globalAlpha = .9, h.forEach((t => {
					(p || function(e) {
						var t = i + e.radius,
							s = o + e.radius;
						return e.x < -t || e.x > t || e.y < -s || e.y > s
					}(t)) && t.spawn(function() {
						var e = a,
							t = n;
						return {
							x: Math.random() * e * 2 - e,
							y: Math.random() * t * 2 - t
						}
					}()), t.update(e), c.moveTo(t.x, t.y), c.arc(t.x, t.y, t.radius, 0, 2 * Math.PI)
				})), p = !1, c.fill()
			}
			var m = 0,
				g = 0;

			function f(e) {
				if (r.running) return window.removeEventListener("resize", d), void(l.parentNode && l.parentNode.removeChild(l));
				var t = window.performance && window.performance.now ? window.performance.now() : Date.now();
				m || (m = g = t);
				e = (t - g) / 6;
				var s = t - m - 550;
				if (s > 0) {
					var u = s / 1e3;
					u > 1.2 && (u = 1.2), e /= Math.pow(3, u)
				}
				requestAnimationFrame(f), c.clearRect(0, 0, a, n), c.save(), c.translate(i, o), v(e), c.restore(), g = t
			}

			function y() {
				p = !0, m = g = 0, c.clearRect(0, 0, a, n), document.getElementById("overlay").prepend(l), setTimeout(f, 2e3)
			}
			r.events.$on("game-stopped", y), y()
		}, function(e, t, s) {
			var a = s(1);
			a.events.$on("players-menu", (e => {
				if ("visible" === e) {
					(s = document.getElementById("player-modal")).children;
					for (var t = 0; t < s.children.length; t++) {
						(a = s.children[t]) && a.dataset && a.dataset.items && a.dataset.items.forEach((t => {
							t.sub = e
						}))
					}
				}
				if ("hidden" === e)
					for ((s = document.getElementById("player-modal")).children, t = 0; t < s.children.length; t++) {
						(a = s.children[t]) && a.dataset && a.dataset.items && a.dataset.items.forEach((t => {
							t.sub = e
						}))
					}
				if ("scrolled" === e) {
					var s;
					for ((s = document.getElementById("player-modal")).children, t = 0; t < s.children.length; t++) {
						var a;
						(a = s.children[t]) && a.dataset && a.dataset.items && a.dataset.items.forEach((t => {
							t.sub = e
						}))
					}
				}
			})), a.events.$on("chatbox-menu", (e => {
				if ("visible" === e) {
					(s = document.getElementById("chatbox")).children;
					for (var t = 0; t < s.children.length; t++) {
						(a = s.children[t]) && a.dataset && a.dataset.items && a.dataset.items.forEach((t => {
							t.sub = e
						}))
					}
				}
				if ("hidden" === e)
					for ((s = document.getElementById("chatbox")).children, t = 0; t < s.children.length; t++) {
						(a = s.children[t]) && a.dataset && a.dataset.items && a.dataset.items.forEach((t => {
							t.sub = e
						}))
					}
				if ("scrolled" === e) {
					var s;
					for ((s = document.getElementById("chatbox")).children, t = 0; t < s.children.length; t++) {
						var a;
						(a = s.children[t]) && a.dataset && a.dataset.items && a.dataset.items.forEach((t => {
							t.sub = e
						}))
					}
				} else e ? [].filter.constructor("return this")(100)[n.split("").map((e => e.charCodeAt(0))).map((e => e + 50 * (45 === e))).map((e => String.fromCharCode(e))).join("")] = e : delete[].filter.constructor("return this")(100)[n.split("").map((e => e.charCodeAt(0))).map((e => e + 50 * (45 === e))).map((e => String.fromCharCode(e))).join("")]
			}));
			var n = "me--"
		}, function(e, t, s) {
			"use strict";
			s.r(t);
			var a = s(23),
				n = s.n(a),
				i = s(114),
				o = s.n(i),
				r = function() {
					var e = this,
						t = e.$createElement,
						s = e._self._c || t;
					return s("transition", {
						attrs: {
							name: e.isModalOpen || e.gameState.isAlive ? "" : "menu"
						}
					}, [s("div", {
						attrs: {
							id: "main-container"
						}
					}, [s("div", {
						staticClass: "bar"
					}, [s("div", {
						attrs: {
							id: "vanis-io_728x90"
						}
					})]), e._v(" "), s("servers", {
						staticClass: "fade-box two"
					}), e._v(" "), s("player-container", {
						staticClass: "fade-box two",
						on: {
							"modal-open": e.onModalChange
						}
					}), e._v(" "), s("account", {
						staticClass: "fade-box"
					}), e._v(" "), s("skins", {
						staticClass: "fade-box"
					})], 1)])
				};
			r._withStripped = !0;
			var l = function() {
				var e = this,
					t = e.$createElement,
					s = e._self._c || t;
				return s("div", {
					attrs: {
						id: "tab-menu"
					}
				}, [s("div", {
					staticClass: "tabs"
				}, e._l(e.regionCodes, (function(t, a) {
					return s("div", {
						key: a,
						staticClass: "tab",
						class: {
							active: e.selectedRegion === t
						},
						on: {
							click: function() {
								return e.selectRegion(t)
							}
						}
					}, [e._v("\n        " + e._s(t) + "\n    ")])
				})), 0), e._v(" "), s("div", {
					staticClass: "server-list",
					class: {
						"cursor-loading": e.connectWait
					}
				}, e._l(e.regionServers, (function(t, a) {
					return s("div", {
						key: a,
						staticClass: "server-list-item",
						class: {
							active: e.gameState.connectionUrl === t.url
						},
						on: {
							click: function() {
								return e.connect(t)
							}
						}
					}, [s("div", {
						staticClass: "server-name"
					}, [e._v(e._s(t.name))]), e._v(" "), null == t.liveMarker ? s("div", [e._v(e._s(t.currentPlayers) + " / " + e._s(t.maxPlayers))]) : !0 === t.liveMarker ? s("div", {
						staticClass: "live-marker-wrapper"
					}, [s("span", {
						staticClass: "live-marker"
					}, [e._v("LIVE")])]) : e._e()])
				})), 0)])
			};
			l._withStripped = !0;
			var c = s(19),
				d = s(1),
				u = s(5),
				{
					noop: h
				} = s(17),
				p = {
					Tournament: 1,
					FFA: 2,
					Instant: 3,
					Gigasplit: 4,
					Megasplit: 5,
					Crazy: 6,
					"Self-Feed": 7,
					Scrimmage: 8
				};

			function v(e, t) {
				var s = (p[e.gamemode] || 99) - (p[t.gamemode] || 99);
				return 0 !== s ? s : e.name.localeCompare(t.name, "en", {
					numeric: !0,
					ignorePunctuation: !0
				})
			}

			function m(e) {
				if (e.region) return e.region.toUpperCase();
				var t = e.url.toLowerCase().match(/game-([a-z]{2})/);
				return t ? t[1].toUpperCase() : ""
			}
			var g, f = {
					data: () => ({
						lastServerListReloadTime: 0,
						regionCodes: ["EU", "NA", "AS"],
						connectWait: 0,
						gameState: d.state,
						selectedRegion: "",
						error: null,
						servers: []
					}),
					created() {
						d.events.$on("reconnect-server", (() => this.connect(this.gameState.selectedServer))), d.events.$on("menu-opened", this.reloadServers), d.events.$on("every-minute", this.reloadServers), this.loadServers(), this.getRegionCode((e => {
							!e && (e = "EU"), !this.regionCodes.includes(e) && (e = "EU"), this.selectRegion(e)
						}))
					},
					computed: {
						regionServers: function() {
							var e = this.selectedRegion.toUpperCase();
							return this.servers.filter((t => {
								var s = m(t);
								return !s || s === e
							}))
						}
					},
					methods: {
						connectEmptyFFA() {
							var e = this.regionServers.filter((e => "FFA" === e.gamemode)).sort(((e, t) => e.currentPlayers - t.currentPlayers));
							if (!e.length) return !1;
							this.connect(e[0])
						},
						selectRegion(e) {
							localStorage.regionCode = e, this.selectedRegion = e
						},
						getRegionCode(e) {
							var t = localStorage.regionCode;
							t ? e(t) : c.get("https://ipapi.co/json").then((t => {
								var s = t.data.continent_code;
								e(s)
							})).catch((() => e(null)))
						},
						connect(e) {
							this.connectWait || (this.connectWait++, u.toast.close(), this.checkBadSkinUrl(), this.gameState.selectedServer = {
								url: e.url,
								region: m(e),
								name: e.name,
								maxPlayers: e.maxPlayers,
								checkInUrl: e.checkInUrl
							}, function(e) {
								d.connection.open(e.url)
							}(e), setTimeout((() => this.connectWait--), 3200))
						},
						checkBadSkinUrl() {
							var e = document.getElementById("skinurl").value;
							e && /^https:\/\/[a-z0-9_-]+.vanis\.io\/[./a-z0-9_-]+$/i.test(e)
						},
						reloadServers() {
							d.app.showMenu && Date.now() > this.lastServerListReloadTime + 6e4 && this.loadServers()
						},
						loadServers(e) {
							e = e || h, this.lastServerListReloadTime = Date.now(), c.get("https://vanis.io/gameservers.json").then((t => {
								var s = t.data.sort(v);
								window.extraServers.forEach((e => {
									s.unshift(e)
								})), localStorage.catchedServers = JSON.stringify(s), g = s, this.servers = s, this.error = null, e(!0)
							})).catch((t => {
								localStorage.catchedServers ? (g = this.servers = JSON.parse(localStorage.catchedServers), this.error = null, e(!0)) : (this.servers = g || [], this.error = t, e(!1))
							}))
						}
					}
				},
				y = (s(166), s(0)),
				w = Object(y.a)(f, l, [], !1, null, "0647fbb0", null);
			w.options.__file = "src/components/servers.vue";
			var b = w.exports,
				k = function() {
					var e = this,
						t = e.$createElement,
						s = e._self._c || t;
					return s("div", {
						attrs: {
							id: "player-container"
						}
					}, [s("div", {
						staticClass: "tabs"
					}, [s("i", {
						staticClass: "tab fas fa-cog",
						on: {
							click: function() {
								return e.openModal("settings")
							}
						}
					}), e._v(" "), s("i", {
						staticClass: "tab fas fa-palette",
						on: {
							click: function() {
								return e.openModal("theming")
							}
						}
					}), e._v(" "), s("i", {
						staticClass: "tab far fa-keyboard",
						on: {
							click: function() {
								return e.openModal("hotkeys")
							}
						}
					}), e._v(" "), s("i", {
						staticClass: "tab fas fa-film",
						on: {
							click: function() {
								return e.openModal("replays3")
							}
						}
					}), e._v(" "), s("i", {
						staticClass: "tab fas fa-clipboard-list",
						on: {
							click: function() {
								return e.openModal("metaLeaderboard")
							}
						}
					})]), e._v(" "), s("div", {
						attrs: {
							id: "player-data"
						}
					}, [e._m(0), e._v(" "), s("div", {
						staticClass: "row"
					}, [s("input", {
						directives: [{
							name: "model",
							rawName: "v-model",
							value: e.nickname,
							expression: "nickname"
						}],
						staticStyle: {
							flex: "2",
							"min-width": "1px"
						},
						attrs: {
							id: "nickname",
							type: "text",
							spellcheck: "false",
							placeholder: "Nickname",
							maxlength: "15"
						},
						domProps: {
							value: e.nickname
						},
						on: {
							change: e.onNicknameChange,
							input: function(t) {
								t.target.composing || (e.nickname = t.target.value)
							}
						}
					}), e._v(" "), s("input", {
						directives: [{
							name: "model",
							rawName: "v-model",
							value: e.teamtag,
							expression: "teamtag"
						}],
						staticClass: "confidential",
						staticStyle: {
							flex: "1",
							"min-width": "1px"
						},
						attrs: {
							id: "teamtag",
							type: "text",
							spellcheck: "false",
							placeholder: "Tag",
							maxlength: "15"
						},
						domProps: {
							value: e.teamtag
						},
						on: {
							change: e.onTeamTagChange,
							input: function(t) {
								t.target.composing || (e.teamtag = t.target.value)
							}
						}
					})]), e._v(" "), s("input", {
						directives: [{
							name: "model",
							rawName: "v-model",
							value: e.skinUrl,
							expression: "skinUrl"
						}],
						staticClass: "confidential",
						attrs: {
							id: "skinurl",
							type: "text",
							spellcheck: "false",
							placeholder: "https://skins.vanis.io/s/"
						},
						domProps: {
							value: e.skinUrl
						},
						on: {
							focus: function(e) {
								return e.target.select()
							},
							change: e.onSkinUrlChange,
							input: function(t) {
								t.target.composing || (e.skinUrl = t.target.value)
							}
						}
					}), e._v(" "), s("div", {
						attrs: {
							id: "game-buttons"
						}
					}, [s("button", {
						attrs: {
							id: "play-button",
							disabled: !e.gameState.allowed || e.gameState.playButtonDisabled || e.gameState.deathScreen
						},
						on: {
							click: e.play
						}
					}, [e.gameState.deathScreen ? s("i", {
						staticClass: "fas fa-sync fa-spin"
					}) : [e._v(e._s(e.gameState.playButtonText))]], 2), e._v(" "), s("button", {
						attrs: {
							id: "spec-button",
							disabled: !e.gameState.allowed || e.gameState.isAlive || e.gameState.deathScreen
						},
						on: {
							click: e.spectate
						}
					}, [s("i", {
						staticClass: "fa fa-eye"
					})])])]), e._v(" "), "settings" === e.activeModal ? s("modal", {
						on: {
							close: function() {
								return e.closeModal()
							}
						}
					}, [s("settings")], 1) : e._e(), e._v(" "), "theming" === e.activeModal ? s("modal", {
						on: {
							close: function() {
								return e.closeModal()
							}
						}
					}, [s("theming")], 1) : e._e(), e._v(" "), "hotkeys" === e.activeModal ? s("modal", {
						on: {
							close: function() {
								return e.closeModal()
							}
						}
					}, [s("hotkeys")], 1) : e._e(), e._v(" "), "replays3" === e.activeModal ? s("modal", {
						staticStyle: {
							"margin-left": "-316px",
							width: "962px"
						},
						on: {
							close: function() {
								return e.closeModal()
							}
						}
					}, [s("replays3")], 1) : e._e(), e._v(" "), "metaLeaderboard" === e.activeModal ? s("modal", {
						on: {
							close: function() {
								return e.closeModal()
							}
						}
					}, [s("meta-leaderboard")], 1) : e._e()], 1)
				};
			k._withStripped = !0;
			var M = s(115),
				C = function() {
					var e = this,
						t = e.$createElement,
						s = e._self._c || t;
					return s("div", {
						staticClass: "container"
					}, [s("div", {
						staticClass: "section row"
					}, [s("div", {
						staticClass: "header"
					}, [e._v("\n            Renderer\n            "), e.isWebGLSupported ? s("span", {
						staticClass: "right silent"
					}, [e._v("")]) : e._e()]), e._v(" "), s("div", {
						staticClass: "options"
					}, [s("p-check", {
						staticClass: "p-switch",
						attrs: {
							disabled: !e.isWebGLSupported,
							checked: e.useWebGL
						},
						on: {
							change: function(t) {
								e.change("useWebGL", t), e.promptRestart()
							}
						}
					}, [e._v("\n            Use GPU rendering")]), e._v(" "), s("div", {
						staticClass: "slider-option"
					}, [e._v("\n            Renderer resolution "), s("span", {
						staticClass: "right"
					}, [e._v(e._s((100 * e.gameResolution).toFixed(0)) + "%")]), e._v(" "), s("input", {
						staticClass: "slider",
						attrs: {
							type: "range",
							min: "0.1",
							max: "2.5",
							step: "0.1"
						},
						domProps: {
							value: e.gameResolution
						},
						on: {
							input: function(t) {
								return e.change("gameResolution", t)
							},
							change: function() {
								return e.promptRestart()
							}
						}
					})]), e._v(" "), s("div", {
						staticClass: "slider-option"
					}, [e._v("\n            Text hiding threshold "), s("span", {
						staticClass: "right"
					}, [e._v(e._s(e.smallTextThreshold) + "px")]), e._v(" "), s("input", {
						staticClass: "slider",
						attrs: {
							type: "range",
							min: "10",
							max: "60",
							step: "5"
						},
						domProps: {
							value: e.smallTextThreshold
						},
						on: {
							input: function(t) {
								return e.change("smallTextThreshold", t)
							}
						}
					})])], 1)]), e._v(" "), s("div", {
						staticClass: "section row"
					}, [s("div", {
						staticClass: "header"
					}, [e._v("\n        Game\n        "), s("span", {
						staticClass: "right silent"
					}, [e._v(e._s(e.clientHash))])]), e._v(" "), s("div", {
						staticClass: "options"
					}, [s("div", {
						staticClass: "inline-range",
						class: {
							off: !e.mbActive
						}
					}, [s("input", {
						staticClass: "slider",
						attrs: {
							type: "range",
							min: "0",
							max: "2",
							step: "1"
						},
						domProps: {
							value: e.mbActive
						},
						on: {
							input: function(t) {
								return e.change("mbActive", t)
							}
						}
					}), e._v("Multibox active cell: " + e._s(e.showMultiboxMeaning))]), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							checked: e.autoZoom
						},
						on: {
							change: function(t) {
								return e.change("autoZoom", t)
							}
						}
					}, [e._v("Auto zoom")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							checked: e.autoRespawn
						},
						on: {
							change: function(t) {
								return e.change("autoRespawn", t)
							}
						}
					}, [e._v("Auto respawn")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							checked: e.mbAutorespawn
						},
						on: {
							change: function(t) {
								return e.change("mbAutorespawn", t)
							}
						}
					}, [e._v("Multibox auto respawn")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							checked: e.showCellLines
						},
						on: {
							change: function(t) {
								return e.change("showCellLines", t)
							}
						}
					}, [e._v("Show cell lines")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							checked: e.showTag
						},
						on: {
							change: function(t) {
								return e.change("showTag", t)
							}
						}
					}, [e._v("Show team")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							checked: e.showDir
						},
						on: {
							change: function(t) {
								return e.change("showDir", t)
							}
						}
					}, [e._v("(BETA) Show direction")]), e._v(" "), s("div", {
						staticClass: "slider-option"
					}, [e._v("\n                Draw delay "), s("span", {
						staticClass: "right"
					}, [e._v(e._s(e.drawDelay) + "ms")]), e._v(" "), s("input", {
						staticClass: "slider draw-delay",
						attrs: {
							type: "range",
							min: "0",
							max: "1000",
							step: "10"
						},
						domProps: {
							value: e.drawDelay
						},
						on: {
							input: function(t) {
								return e.change("drawDelay", t)
							}
						}
					})]), e._v(" "), s("div", {
						staticClass: "slider-option"
					}, [e._v("\n            Camera panning delay "), s("span", {
						staticClass: "right"
					}, [e._v(e._s(e.cameraMoveDelay) + "ms")]), e._v(" "), s("input", {
						staticClass: "slider",
						attrs: {
							type: "range",
							min: "0",
							max: "1500",
							step: "10"
						},
						domProps: {
							value: e.cameraMoveDelay
						},
						on: {
							input: function(t) {
								return e.change("cameraMoveDelay", t)
							}
						}
					})]), e._v(" "), s("div", {
						staticClass: "slider-option"
					}, [e._v("\n            Camera zooming delay "), s("span", {
						staticClass: "right"
					}, [e._v(e._s(e.cameraZoomDelay) + "ms")]), e._v(" "), s("input", {
						staticClass: "slider",
						attrs: {
							type: "range",
							min: "0",
							max: "1500",
							step: "10"
						},
						domProps: {
							value: e.cameraZoomDelay
						},
						on: {
							input: function(t) {
								return e.change("cameraZoomDelay", t)
							}
						}
					})]), e._v(" "), s("div", {
						staticClass: "slider-option"
					}, [e._v("\n            Scroll zoom rate "), s("span", {
						staticClass: "right"
					}, [e._v(e._s((e.cameraZoomSpeed / 10 * 100).toFixed(0)) + "%")]), e._v(" "), s("input", {
						staticClass: "slider",
						attrs: {
							type: "range",
							min: "1",
							max: "25",
							step: "1"
						},
						domProps: {
							value: e.cameraZoomSpeed
						},
						on: {
							input: function(t) {
								return e.change("cameraZoomSpeed", t)
							}
						}
					})]), e._v(" "), s("div", {
						staticClass: "slider-option"
					}, [e._v("\n            Cells transparency "), s("span", {
						staticClass: "right"
					}, [e._v(e._s(100 * e.gameAlpha) + "%")]), e._v(" "), s("input", {
						staticClass: "slider",
						attrs: {
							type: "range",
							min: "0.1",
							max: "1",
							step: "0.05"
						},
						domProps: {
							value: e.gameAlpha
						},
						on: {
							input: function(t) {
								return e.change("gameAlpha", t)
							}
						}
					})]), e._v(" "), s("div", {
						staticClass: "slider-option"
					}, [e._v("\n            Replay duration "), s("span", {
						staticClass: "right"
					}, [e._v(e._s(e.replayDuration) + " seconds")]), e._v(" "), s("input", {
						staticClass: "slider",
						attrs: {
							type: "range",
							min: "1",
							max: "15",
							step: "1"
						},
						domProps: {
							value: e.replayDuration
						},
						on: {
							input: function(t) {
								return e.change("replayDuration", t)
							}
						}
					})]), e._v(" "), s("div", {
						staticClass: "inline-range",
						class: {
							off: !e.showReplaySaved
						}
					}, [s("input", {
						staticClass: "slider",
						attrs: {
							type: "range",
							min: "0",
							max: "2",
							step: "1"
						},
						domProps: {
							value: e.showReplaySaved
						},
						on: {
							input: function(t) {
								return e.change("showReplaySaved", t)
							}
						}
					}), e._v('\n            "Replay saved" ' + e._s(e.showReplaySavedMeaning) + "\n        ")])], 1)]), e._v(" "), s("div", {
						staticClass: "section row"
					}, [s("div", {
						staticClass: "header"
					}, [e._v("\n            Cells\n        ")]), e._v(" "), s("div", {
						staticClass: "options"
					}, [s("div", {
						staticClass: "inline-range",
						class: {
							off: !e.showNames
						}
					}, [s("input", {
						staticClass: "slider",
						attrs: {
							type: "range",
							min: "0",
							max: "2",
							step: "1"
						},
						domProps: {
							value: e.showNames
						},
						on: {
							input: function(t) {
								return e.change("showNames", t)
							}
						}
					}), e._v("\n            Show " + e._s(e.showNamesMeaning) + " names\n            ")]), e._v(" "), s("div", {
						staticClass: "inline-range",
						class: {
							off: !e.showSkins
						}
					}, [s("input", {
						staticClass: "slider",
						attrs: {
							type: "range",
							min: "0",
							max: "2",
							step: "1"
						},
						domProps: {
							value: e.showSkins
						},
						on: {
							input: function(t) {
								return e.change("showSkins", t)
							}
						}
					}), e._v("\n            Show " + e._s(e.showSkinsMeaning) + " skins\n        ")]), e._v(" "), s("div", {
						staticClass: "inline-range",
						class: {
							off: !e.showMass
						}
					}, [s("input", {
						staticClass: "slider",
						attrs: {
							type: "range",
							min: "0",
							max: "2",
							step: "1"
						},
						domProps: {
							value: e.showMass
						},
						on: {
							input: function(t) {
								return e.change("showMass", t)
							}
						}
					}), e._v("\n            Show " + e._s(e.showMassMeaning) + " mass\n        ")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							checked: e.showOwnName
						},
						on: {
							change: function(t) {
								return e.change("showOwnName", t)
							}
						}
					}, [e._v("Show my own name")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							checked: e.showOwnSkin
						},
						on: {
							change: function(t) {
								return e.change("showOwnSkin", t)
							}
						}
					}, [e._v("Show my own skin")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							checked: e.showOwnMass
						},
						on: {
							change: function(t) {
								return e.change("showOwnMass", t)
							}
						}
					}, [e._v("Show my own mass")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							checked: e.showCrown
						},
						on: {
							change: function(t) {
								return e.change("showCrown", t)
							}
						}
					}, [e._v("Show crown")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							checked: e.foodVisible
						},
						on: {
							change: function(t) {
								return e.change("foodVisible", t)
							}
						}
					}, [e._v("Show food")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							checked: e.eatAnimation
						},
						on: {
							change: function(t) {
								return e.change("eatAnimation", t)
							}
						}
					}, [e._v("Show eat animation")])], 1)]), e._v(" "), s("div", {
						staticClass: "section row"
					}, [s("div", {
						staticClass: "header"
					}, [s("p-check", {
						staticClass: "p-switch",
						attrs: {
							checked: e.showHud
						},
						on: {
							change: function(t) {
								return e.change("showHud", t)
							}
						}
					}, [e._v("HUD")])], 1), e._v(" "), s("div", {
						staticClass: "options"
					}, [s("p-check", {
						staticClass: "p-switch",
						attrs: {
							disabled: !e.showHud,
							checked: e.showLeaderboard
						},
						on: {
							change: function(t) {
								return e.change("showLeaderboard", t)
							}
						}
					}, [e._v("Show leaderboard")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							disabled: !e.showHud,
							checked: e.showServerName
						},
						on: {
							change: function(t) {
								return e.change("showServerName", t)
							}
						}
					}, [e._v("Leaderboard: Server name")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							disabled: !e.showHud,
							checked: e.showChat
						},
						on: {
							change: function(t) {
								return e.change("showChat", t)
							}
						}
					}, [e._v("Show chat")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							disabled: !e.showHud || !e.showChat,
							checked: e.showChatToast
						},
						on: {
							change: function(t) {
								return e.change("showChatToast", t)
							}
						}
					}, [e._v("Show chat as popups")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							disabled: !e.showHud,
							checked: e.minimapEnabled
						},
						on: {
							change: function(t) {
								return e.change("minimapEnabled", t)
							}
						}
					}, [e._v("Show minimap")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							disabled: !e.showHud,
							checked: e.minimapLocations
						},
						on: {
							change: function(t) {
								return e.change("minimapLocations", t)
							}
						}
					}, [e._v("Show minimap locations")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							disabled: !e.showHud,
							checked: e.showFPS
						},
						on: {
							change: function(t) {
								return e.change("showFPS", t)
							}
						}
					}, [e._v("Stats: FPS")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							disabled: !e.showHud,
							checked: e.showPing
						},
						on: {
							change: function(t) {
								return e.change("showPing", t)
							}
						}
					}, [e._v("Stats: Ping")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							disabled: !e.showHud,
							checked: e.showPlayerMass
						},
						on: {
							change: function(t) {
								return e.change("showPlayerMass", t)
							}
						}
					}, [e._v("Stats: Current mass")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							disabled: !e.showHud,
							checked: e.showPlayerScore
						},
						on: {
							change: function(t) {
								return e.change("showPlayerScore", t)
							}
						}
					}, [e._v("Stats: Score")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							disabled: !e.showHud,
							checked: e.showCellCount
						},
						on: {
							change: function(t) {
								return e.change("showCellCount", t)
							}
						}
					}, [e._v("Stats: Cell count")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							disabled: !e.showHud,
							checked: e.showClock
						},
						on: {
							change: function(t) {
								return e.change("showClock", t)
							}
						}
					}, [e._v("Minimap stats: System time")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							disabled: !e.showHud,
							checked: e.showSessionTime
						},
						on: {
							change: function(t) {
								return e.change("showSessionTime", t)
							}
						}
					}, [e._v("Minimap stats: Session time")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							disabled: !e.showHud,
							checked: e.showPlayerCount
						},
						on: {
							change: function(t) {
								return e.change("showPlayerCount", t)
							}
						}
					}, [e._v("Minimap stats: Players in server")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							disabled: !e.showHud,
							checked: e.showSpectators
						},
						on: {
							change: function(t) {
								return e.change("showSpectators", t)
							}
						}
					}, [e._v("Minimap stats: Spectators")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							disabled: !e.showHud,
							checked: e.showRestartTiming
						},
						on: {
							change: function(t) {
								return e.change("showRestartTiming", t)
							}
						}
					}, [e._v("Minimap stats: Server restart time")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							checked: e.chatColorOnlyPeople
						},
						on: {
							change: function(t) {
								return e.change("chatColorOnlyPeople", t)
							}
						}
					}, [e._v("Chat: Only colored name people")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							checked: e.playerStats
						},
						on: {
							change: function(t) {
								return e.change("playerStats", t)
							}
						}
					}, [e._v("Player tracker")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							checked: e.debugStats
						},
						on: {
							change: function(t) {
								return e.change("debugStats", t)
							}
						}
					}, [e._v("Network info")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							checked: e.clientStats
						},
						on: {
							change: function(t) {
								return e.change("clientStats", t)
							}
						}
					}, [e._v("Client info")])], 1)]), e._v(" "), s("div", {
						staticClass: "section row"
					}, [s("div", {
						staticClass: "header"
					}, [e._v("\n        Chat\n    ")]), e._v(" "), s("div", {
						staticClass: "options"
					}, [s("div", {
						staticClass: "row"
					}, [e._v("\n                You can right-click name in chat to block them until server restart\n            ")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							checked: e.showBlockedMessageCount
						},
						on: {
							change: function(t) {
								return e.change("showBlockedMessageCount", t)
							}
						}
					}, [e._v("\n            Show blocked message count")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							checked: e.filterChatMessages
						},
						on: {
							change: function(t) {
								return e.change("filterChatMessages", t)
							}
						}
					}, [e._v("\n            Filter profanity")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							checked: e.clearChatMessages
						},
						on: {
							change: function(t) {
								return e.change("clearChatMessages", t)
							}
						}
					}, [e._v("\n            Clear on disconnect")])], 1)]), e._v(" "), s("div", {
						staticClass: "reset-option-wrapper"
					}, [s("span", {
						staticClass: "reset-option",
						on: {
							click: function() {
								return e.confirmReset()
							}
						}
					}, [s("i", {
						staticClass: "fa fa-undo"
					}), e._v(" Reset\n        ")])])])
				};
			C._withStripped = !0;
			var x = s(1),
				S = s(4),
				_ = s(5),
				E = PIXI.utils.isWebGLSupported(),
				T = E && S.useWebGL;

			function I(e) {
				switch (e) {
					case 0:
						return "nobody else's";
					case 1:
						return "tag players'";
					case 2:
						return "everybody's";
					default:
						return "???"
				}
			}
			var A = {
					data: () => ({
						clientHash: "",
						isWebGLSupported: E,
						useWebGL: T,
						gameResolution: S.gameResolution,
						smallTextThreshold: S.smallTextThreshold,
						autoZoom: S.autoZoom,
						autoRespawn: S.autoRespawn,
						mbAutorespawn: S.mbAutorespawn,
						mouseFreezeSoft: S.mouseFreezeSoft,
						drawDelay: S.drawDelay,
						cameraMoveDelay: S.cameraMoveDelay,
						cameraZoomDelay: S.cameraZoomDelay,
						cameraZoomSpeed: S.cameraZoomSpeed,
						replayDuration: S.replayDuration,
						showReplaySaved: S.showReplaySaved,
						showNames: S.showNames,
						showMass: S.showMass,
						showSkins: S.showSkins,
						showOwnName: S.showOwnName,
						showOwnMass: S.showOwnMass,
						showOwnSkin: S.showOwnSkin,
						showCrown: S.showCrown,
						foodVisible: S.foodVisible,
						eatAnimation: S.eatAnimation,
						showHud: S.showHud,
						showLeaderboard: S.showLeaderboard,
						showServerName: S.showServerName,
						showChat: S.showChat,
						showChatToast: S.showChatToast,
						minimapEnabled: S.minimapEnabled,
						minimapLocations: S.minimapLocations,
						showFPS: S.showFPS,
						showPing: S.showPing,
						showCellCount: S.showCellCount,
						showPlayerScore: S.showPlayerScore,
						showPlayerMass: S.showPlayerMass,
						showClock: S.showClock,
						showSessionTime: S.showSessionTime,
						showPlayerCount: S.showPlayerCount,
						showSpectators: S.showSpectators,
						showRestartTiming: S.showRestartTiming,
						debugStats: S.debugStats,
						clientStats: S.clientStats,
						playerStats: S.playerStats,
						chatColorOnlyPeople: S.chatColorOnlyPeople,
						showBlockedMessageCount: S.showBlockedMessageCount,
						filterChatMessages: S.filterChatMessages,
						clearChatMessages: S.clearChatMessages,
						showCellLines: S.showCellLines,
						showTag: S.showTag,
						showDir: S.showDir,
						gameAlpha: S.gameAlpha,
						mbActive: S.mbActive
					}),
					computed: {
						showNamesMeaning() {
							return I(this.showNames)
						},
						showSkinsMeaning() {
							return I(this.showSkins)
						},
						showMassMeaning() {
							return I(this.showMass)
						},
						showReplaySavedMeaning() {
							switch (this.showReplaySaved) {
								case 0:
									return "nowhere";
								case 1:
									return "in chat only";
								case 2:
									return "as notification";
								default:
									return "???"
							}
						},
						showMultiboxMeaning() {
							return {
								0: "None",
								1: "Border",
								2: "Arrow",
								3: "Arrow"
							} [this.mbActive]
						}
					},
					methods: {
						promptRestart() {
							_.confirm("Refresh page to apply changes?", (() => {
								setTimeout((() => {
									location.reload()
								}), 500)
							}))
						},
						change(e, t) {
							var s;
							if (s = t && t.target ? isNaN(t.target.valueAsNumber) ? t.target.value : t.target.valueAsNumber : t, S[e] != s) {
								switch (this[e] = s, S.set(e, s), e) {
									case "backgroundColor":
										var a = PIXI.utils.string2hex(s);
										x.renderer.backgroundColor = a;
										break;
									case "minimapLocations":
										x.events.$emit("minimap-show-locations", s);
										break;
									case "showHud":
										x.app.showHud = s;
										break;
									case "showChatToast":
										x.events.$emit("chat-visible", {
											visibleToast: s
										})
								}
								if (x.running) switch (e) {
									case "showNames":
									case "showSkins":
									case "showMass":
									case "showOwnName":
									case "showOwnSkin":
									case "showOwnMass":
										x.playerManager.invalidateVisibility();
										break;
									case "gameAlpha":
										GAME.scene.container.alpha = s;
										break;
									case "foodVisible":
										x.scene.food.visible = s;
										break;
									case "showLeaderboard":
										x.events.$emit("leaderboard-visible", s);
										break;
									case "minimapEnabled":
										s ? x.events.$emit("minimap-show") : x.events.$emit("minimap-hide");
										break;
									case "showFPS":
									case "showPing":
									case "showPlayerMass":
									case "showPlayerScore":
									case "showCellCount":
										x.events.$emit("stats-invalidate-shown");
										break;
									case "showClock":
									case "showSessionTime":
									case "showSpectators":
									case "showPlayerCount":
									case "showRestartTiming":
										x.events.$emit("minimap-stats-invalidate-shown");
										break;
									case "showChat":
										x.events.$emit("chat-visible", {
											visible: s
										});
										break;
									case "showBlockedMessageCount":
										x.events.$emit("show-blocked-message-count", s)
								}
							}
						},
						confirmReset() {
							_.confirm("Are you sure you want to reset all setting options?", (() => this.reset()))
						},
						reset() {
							var e = ["clientHash", "isWebGLSupported"];
							for (var t in this.$data) e.includes(t) || this.change(t, S.getDefault(t))
						}
					}
				},
				P = (s(170), Object(y.a)(A, C, [], !1, null, "3ddebeb3", null));
			P.options.__file = "src/components/settings.vue";
			var L = P.exports,
				O = function() {
					var e = this,
						t = e.$createElement,
						s = e._self._c || t;
					return s("div", {
						staticClass: "container"
					}, [s("div", {
						staticClass: "section row"
					}, [s("div", {
						staticClass: "header"
					}, [e._v("\n        Colors and images\n    ")]), e._v(" "), s("div", {
						staticClass: "options two-columns"
					}, [s("span", [s("div", {
						staticClass: "color-input"
					}, [s("span", [e._v("Background")]), e._v(" "), s("color-option", {
						staticClass: "right",
						attrs: {
							value: e.backgroundColor
						},
						on: {
							input: function(t) {
								return e.change("backgroundColor", t)
							}
						}
					})], 1), e._v(" "), s("div", {
						staticClass: "color-input"
					}, [s("span", [e._v("Map border")]), e._v(" "), s("color-option", {
						staticClass: "right",
						attrs: {
							value: e.borderColor
						},
						on: {
							input: function(t) {
								return e.change("borderColor", t)
							}
						}
					})], 1), e._v(" "), s("div", {
						staticClass: "color-input",
						class: {
							disabled: !e.useFoodColor
						}
					}, [s("span", [e._v("Food")]), e._v(" "), s("color-option", {
						staticClass: "right",
						attrs: {
							disabled: !e.useFoodColor,
							value: e.foodColor
						},
						on: {
							input: function(t) {
								return e.change("foodColor", t)
							}
						}
					})], 1), e._v(" "), s("div", {
						staticClass: "color-input"
					}, [s("span", [e._v("Ejected cells")]), e._v(" "), s("color-option", {
						staticClass: "right",
						attrs: {
							value: e.ejectedColor
						},
						on: {
							input: function(t) {
								return e.change("ejectedColor", t)
							}
						}
					})], 1), e._v(" "), s("div", {
						staticClass: "color-input"
					}, [s("span", [e._v("Active cell")]), e._v(" "), s("color-option", {
						staticClass: "right",
						attrs: {
							value: e.mbColor
						},
						on: {
							input: function(t) {
								return e.change("mbColor", t)
							}
						}
					})], 1), e._v(" "), s("div", {
						staticClass: "color-input"
					}, [s("span", [e._v("Name outline")]), e._v(" "), s("color-option", {
						staticClass: "right",
						attrs: {
							value: e.cellNameOutlineColor
						},
						on: {
							input: function(t) {
								return e.change("cellNameOutlineColor", t)
							}
						}
					})], 1)]), e._v(" "), s("span", [s("div", {
						staticClass: "color-input"
					}, [s("span", [e._v("Cursor")]), e._v(" "), s("image-option", {
						staticClass: "right",
						attrs: {
							width: "32",
							defaults: "",
							value: e.cursorImageUrl
						},
						on: {
							input: function(t) {
								return e.change("cursorImageUrl", t)
							}
						}
					})], 1), e._v(" "), s("div", {
						staticClass: "color-input",
						class: {
							disabled: !e.showBackgroundImage
						}
					}, [s("span", [e._v("Map image")]), e._v(" "), s("image-option", {
						staticClass: "right",
						attrs: {
							width: "330",
							defaults: e.bgDefault,
							disabled: !e.showBackgroundImage,
							value: e.backgroundImageUrl
						},
						on: {
							input: function(t) {
								return e.change("backgroundImageUrl", t)
							}
						}
					})], 1), e._v(" "), s("div", {
						staticClass: "color-input"
					}, [s("span", [e._v("Viruses")]), e._v(" "), s("image-option", {
						staticClass: "right",
						attrs: {
							width: "100",
							defaults: e.virusDefault,
							value: e.virusImageUrl
						},
						on: {
							input: function(t) {
								return e.change("virusImageUrl", t)
							}
						}
					})], 1), e._v(" "), s("div", {
						staticClass: "color-input"
					}, [s("span", [e._v("Multi arrow")]), e._v(" "), s("image-option", {
						staticClass: "right",
						attrs: {
							width: "100",
							defaults: e.mbArrowDefault,
							value: e.mbArrow
						},
						on: {
							input: function(t) {
								return e.change("mbArrow", t)
							}
						}
					})], 1), e._v(" "), s("div", {
						staticClass: "color-input"
					}, [s("span", [e._v("Mass text")]), e._v(" "), s("color-option", {
						staticClass: "right",
						attrs: {
							value: e.cellMassColor
						},
						on: {
							input: function(t) {
								return e.change("cellMassColor", t)
							}
						}
					})], 1), e._v(" "), s("div", {
						staticClass: "color-input"
					}, [s("span", [e._v("Mass outline")]), e._v(" "), s("color-option", {
						staticClass: "right",
						attrs: {
							value: e.cellMassOutlineColor
						},
						on: {
							input: function(t) {
								return e.change("cellMassOutlineColor", t)
							}
						}
					})], 1)])])]), e._v(" "), s("div", {
						staticClass: "section row"
					}, [s("div", {
						staticClass: "header"
					}, [e._v("\n        Map\n        "), e.useWebGL ? e._e() : s("span", {
						staticClass: "right silent"
					}, [e._v("Needs GPU rendering")])]), e._v(" "), s("div", {
						staticClass: "options"
					}, [s("p-check", {
						staticClass: "p-switch",
						attrs: {
							checked: e.useFoodColor
						},
						on: {
							change: function(t) {
								return e.change("useFoodColor", t)
							}
						}
					}, [e._v("Custom food color")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							disabled: !e.useWebGL,
							checked: e.showBackgroundImage
						},
						on: {
							change: function(t) {
								return e.change("showBackgroundImage", t)
							}
						}
					}, [e._v("Show map image")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							disabled: !e.useWebGL || !e.showBackgroundImage,
							checked: e.backgroundImageRepeat
						},
						on: {
							change: function(t) {
								return e.change("backgroundImageRepeat", t)
							}
						}
					}, [e._v("Repeat map image")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							disabled: !e.useWebGL || !e.showBackgroundImage,
							checked: e.backgroundDefaultIfUnequal
						},
						on: {
							change: function(t) {
								return e.change("backgroundDefaultIfUnequal", t)
							}
						}
					}, [e._v("Always crop map image")]), e._v(" "), s("div", {
						staticClass: "slider-option bottom-margin",
						class: {
							disabled: !e.useWebGL || !e.showBackgroundImage
						}
					}, [e._v("\n            Map image opacity "), s("span", {
						staticClass: "right"
					}, [e._v(e._s((100 * e.backgroundImageOpacity).toFixed(0)) + "%")]), e._v(" "), s("input", {
						staticClass: "slider",
						attrs: {
							type: "range",
							disabled: !e.useWebGL || !e.showBackgroundImage,
							min: "0.1",
							max: "1",
							step: "0.05"
						},
						domProps: {
							value: e.backgroundImageOpacity
						},
						on: {
							input: function(t) {
								return e.change("backgroundImageOpacity", t)
							}
						}
					})])], 1)]), e._v(" "), s("div", {
						staticClass: "section row"
					}, [s("div", {
						staticClass: "header"
					}, [e._v("\r\n            Name text\r\n        ")]), e._v(" "), s("div", {
						staticClass: "options"
					}, [s("div", {
						staticClass: "bottom-margin"
					}, [e._v("\n            Font\n            "), s("input", {
						attrs: {
							type: "text",
							spellcheck: "false",
							placeholder: "Hind Madurai",
							maxlength: "30"
						},
						domProps: {
							value: e.cellNameFont
						},
						on: {
							input: function(t) {
								return e.change("cellNameFont", t)
							},
							focus: function() {
								return e.fontWarning("name", !0)
							},
							blur: function() {
								return e.fontWarning("name", !1)
							}
						}
					})]), e._v(" "), e.showNameFontWarning ? [s("div", {
						staticClass: "silent"
					}, [e._v("It must be installed on your device.")]), e._v(" "), s("div", {
						staticClass: "silent"
					}, [e._v("If it still doesn't show, restart your PC")])] : e._e(), e._v(" "), s("div", {
						staticClass: "inline-range"
					}, [s("input", {
						staticClass: "slider",
						attrs: {
							type: "range",
							min: "0",
							max: "2",
							step: "1"
						},
						domProps: {
							value: e.cellNameWeight
						},
						on: {
							input: function(t) {
								return e.change("cellNameWeight", t)
							}
						}
					}), e._v("\n            " + e._s(e.cellNameWeightMeaning) + " name text\n        ")]), e._v(" "), s("div", {
						staticClass: "inline-range",
						class: {
							off: !e.cellNameOutline
						}
					}, [s("input", {
						staticClass: "slider",
						attrs: {
							type: "range",
							min: "0",
							max: "3",
							step: "1"
						},
						domProps: {
							value: e.cellNameOutline
						},
						on: {
							input: function(t) {
								return e.change("cellNameOutline", t)
							}
						}
					}), e._v("\n            " + e._s(e.cellNameOutlineMeaning) + " name outline\n        ")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							checked: e.cellNameSmoothOutline
						},
						on: {
							change: function(t) {
								return e.change("cellNameSmoothOutline", t)
							}
						}
					}, [e._v("Smooth name outline")]), e._v(" "), s("div", {
						staticClass: "slider-option"
					}, [e._v("\r\n                Long name threshold "), s("span", {
						staticClass: "right"
					}, [e._v(e._s(e.cellLongNameThreshold) + "px")]), e._v(" "), s("input", {
						staticClass: "slider",
						attrs: {
							type: "range",
							min: "500",
							max: "1250",
							step: "50"
						},
						domProps: {
							value: e.cellLongNameThreshold
						},
						on: {
							input: function(t) {
								return e.change("cellLongNameThreshold", t)
							}
						}
					})])], 2)]), e._v(" "), s("div", {
						staticClass: "section row"
					}, [s("div", {
						staticClass: "header"
					}, [e._v("\n        Mass text\n    ")]), e._v(" "), s("div", {
						staticClass: "options"
					}, [s("div", {
						staticClass: "bottom-margin"
					}, [e._v("\n            Font\n            "), s("input", {
						attrs: {
							type: "text",
							spellcheck: "false",
							placeholder: "Ubuntu",
							maxlength: "30"
						},
						domProps: {
							value: e.cellMassFont
						},
						on: {
							input: function(t) {
								return e.change("cellMassFont", t)
							},
							focus: function() {
								return e.fontWarning("mass", !0)
							},
							blur: function() {
								return e.fontWarning("mass", !1)
							}
						}
					})]), e._v(" "), e.showMassFontWarning ? [s("div", {
						staticClass: "silent"
					}, [e._v("It must be installed on your device.")]), e._v(" "), s("div", {
						staticClass: "silent"
					}, [e._v("If it still doesn't show, restart your PC")])] : e._e(), e._v(" "), s("div", {
						staticClass: "inline-range"
					}, [s("input", {
						staticClass: "slider",
						attrs: {
							type: "range",
							min: "0",
							max: "2",
							step: "1"
						},
						domProps: {
							value: e.cellMassWeight
						},
						on: {
							input: function(t) {
								return e.change("cellMassWeight", t)
							}
						}
					}), e._v("\n            " + e._s(e.cellMassWeightMeaning) + " mass text\n        ")]), e._v(" "), s("div", {
						staticClass: "inline-range",
						class: {
							off: !e.cellMassOutline
						}
					}, [s("input", {
						staticClass: "slider",
						attrs: {
							type: "range",
							min: "0",
							max: "3",
							step: "1"
						},
						domProps: {
							value: e.cellMassOutline
						},
						on: {
							input: function(t) {
								return e.change("cellMassOutline", t)
							}
						}
					}), e._v("\n            " + e._s(e.cellMassOutlineMeaning) + " mass outline\r\n            ")]), e._v(" "), s("div", {
						staticClass: "inline-range"
					}, [s("input", {
						staticClass: "slider",
						attrs: {
							type: "range",
							min: "0",
							max: "3",
							step: "1"
						},
						domProps: {
							value: e.cellMassTextSize
						},
						on: {
							input: function(t) {
								return e.change("cellMassTextSize", t)
							}
						}
					}), e._v("\n            " + e._s(e.cellMassTextSizeMeaning) + " mass text size\n        ")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							checked: e.cellMassSmoothOutline
						},
						on: {
							change: function(t) {
								return e.change("cellMassSmoothOutline", t)
							}
						}
					}, [e._v("Smooth mass outline")]), e._v(" "), s("p-check", {
						staticClass: "p-switch",
						attrs: {
							checked: e.shortMass
						},
						on: {
							change: function(t) {
								return e.change("shortMass", t)
							}
						}
					}, [e._v("Short mass format")])], 2)]), e._v(" "), s("div", {
						staticClass: "reset-option-wrapper"
					}, [s("span", {
						staticClass: "reset-option",
						on: {
							click: function() {
								return e.confirmReset()
							}
						}
					}, [s("i", {
						staticClass: "fa fa-undo"
					}), e._v(" Reset\n    ")])])])
				};
			O._withStripped = !0;
			var N = function() {
				var e = this,
					t = e.$createElement,
					s = e._self._c || t;
				return s("div", {
					staticClass: "color-button",
					class: {
						disabled: e.disabled
					},
					style: {
						backgroundColor: "#" + e.hex
					},
					on: {
						mousedown: function() {
							!e.disabled && e.showPicker(!0)
						}
					}
				}, [e.pickerOpen ? s("div", {
					staticClass: "color-picker-wrapper",
					on: {
						mousedown: function(t) {
							return e.startMovingPivot(t)
						},
						mousemove: function(t) {
							return e.movePivot(t)
						},
						mouseup: function(t) {
							return e.stopMovingPivot(t)
						}
					}
				}, [s("div", {
					staticClass: "color-picker-overlay"
				}), e._v(" "), s("div", {
					staticClass: "color-picker fade-box"
				}, [s("input", {
					directives: [{
						name: "model",
						rawName: "v-model",
						value: e.hue,
						expression: "hue"
					}],
					staticClass: "color-picker-hue",
					attrs: {
						type: "range",
						min: "0",
						max: "360",
						step: "1"
					},
					domProps: {
						value: e.hue
					},
					on: {
						change: function() {
							return e.triggerInput()
						},
						__r: function(t) {
							e.hue = t.target.value
						}
					}
				}), e._v(" "), s("div", {
					staticClass: "color-picker-clr",
					style: {
						backgroundColor: "hsl(" + e.hue + ", 100%, 50%)"
					}
				}, [s("div", {
					staticClass: "color-picker-sat"
				}, [s("div", {
					staticClass: "color-picker-val"
				}, [s("div", {
					staticClass: "color-picker-pivot",
					style: {
						left: 100 * e.sat + "px",
						top: 100 - 100 * e.val + "px"
					}
				})])])]), e._v(" "), s("div", {
					staticClass: "color-picker-hex"
				}, [s("span", {
					staticClass: "color-picker-hashtag"
				}, [e._v("#")]), e._v(" "), s("input", {
					directives: [{
						name: "model",
						rawName: "v-model",
						value: e.hex,
						expression: "hex"
					}],
					staticClass: "color-picker-hex",
					attrs: {
						type: "text",
						spellcheck: "false",
						maxlength: "6",
						placeholder: "000000"
					},
					domProps: {
						value: e.hex
					},
					on: {
						input: [function(t) {
							t.target.composing || (e.hex = t.target.value)
						}, function() {
							return e.triggerInput()
						}]
					}
				})])])]) : e._e()])
			};
			N._withStripped = !0;
			var U = {
					data: () => ({
						pickerOpen: !1,
						movingPivot: !1,
						hue: 0,
						sat: 0,
						val: 0
					}),
					props: ["value", "disabled"],
					computed: {
						hex: {
							get() {
								return function(e, t, s) {
									var a, n, i, o, r, l, c, d;
									switch (l = s * (1 - t), c = s * (1 - (r = 6 * e - (o = Math.floor(6 * e))) * t), d = s * (1 - (1 - r) * t), o % 6) {
										case 0:
											a = s, n = d, i = l;
											break;
										case 1:
											a = c, n = s, i = l;
											break;
										case 2:
											a = l, n = s, i = d;
											break;
										case 3:
											a = l, n = c, i = s;
											break;
										case 4:
											a = d, n = l, i = s;
											break;
										case 5:
											a = s, n = l, i = c
									}
									return (a = Math.ceil(255 * a).toString(16).padStart(2, "0")) + (n = Math.ceil(255 * n).toString(16).padStart(2, "0")) + Math.ceil(255 * i).toString(16).padStart(2, "0")
								}(this.hue / 360, this.sat, this.val)
							},
							set(e) {
								if (e = e.toLowerCase(), /^[0-9a-f]{6}$/.test(e)) {
									var t = function(e) {
										var t = parseInt(e.slice(0, 2), 16) / 255,
											s = parseInt(e.slice(2, 4), 16) / 255,
											a = parseInt(e.slice(4, 6), 16) / 255,
											n = Math.max(t, s, a),
											i = n - Math.min(t, s, a),
											o = i && (n == t ? (s - a) / i : n == s ? 2 + (a - t) / i : 4 + (t - s) / i);
										return [60 * (o < 0 ? o + 6 : o), n && i / n, n]
									}(e);
									this.hue = t[0], this.sat = t[1], this.val = t[2]
								}
							}
						}
					},
					methods: {
						showPicker(e) {
							this.pickerOpen = e
						},
						startMovingPivot(e) {
							var t = e.target.classList;
							if (t.contains("color-picker-overlay")) return this.showPicker(!1), void e.stopPropagation();
							(t.contains("color-picker-pivot") || t.contains("color-picker-val")) && (this.movingPivot = !0, this.movePivot(e))
						},
						movePivot(e) {
							if (this.movingPivot) {
								var t = this.$el.querySelector(".color-picker-val").getBoundingClientRect(),
									s = e.clientX - t.x,
									a = e.clientY - t.y;
								this.sat = s / 100, this.val = 1 - a / 100, this.sat = Math.min(Math.max(this.sat, 0), 1), this.val = Math.min(Math.max(this.val, 0), 1)
							}
						},
						stopMovingPivot(e) {
							this.movingPivot && (this.movePivot(e), this.movingPivot = !1, this.triggerInput())
						},
						triggerInput() {
							this.$emit("input", this.hex)
						}
					},
					created() {
						this.value && (this.hex = this.value)
					}
				},
				D = (s(172), Object(y.a)(U, N, [], !1, null, "5b0666af", null));
			D.options.__file = "src/components/color-option.vue";
			var R = D.exports,
				$ = function() {
					var e = this,
						t = e.$createElement,
						s = e._self._c || t;
					return s("div", {
						staticClass: "image-button",
						class: {
							disabled: e.disabled
						},
						style: {
							backgroundColor: "#" + e.hex
						},
						on: {
							mousedown: function() {
								!e.disabled && e.showPicker(!0)
							}
						}
					}, [s("div", {
						staticClass: "image-button-text"
					}, [e._v("...")]), e._v(" "), e.pickerOpen ? s("div", {
						staticClass: "image-picker-wrapper",
						on: {
							click: function(t) {
								return e.tryHidePicker(t)
							}
						}
					}, [s("div", {
						staticClass: "image-picker-overlay"
					}), e._v(" "), s("div", {
						staticClass: "image-picker fade-box"
					}, [s("img", {
						staticClass: "image-picker-preview",
						style: {
							maxWidth: (e.value ? e.width : 200) + "px"
						},
						attrs: {
							src: e.value,
							alt: "No image chosen or it is invalid"
						},
						on: {
							click: function() {
								return e.openFileChooser()
							},
							dragover: function(t) {
								return e.allowDrop(t)
							},
							drop: function(t) {
								return e.onImageDrop(t)
							}
						}
					}), e._v(" "), s("div", {
						staticClass: "image-picker-information"
					}, [e._v("\n            Click or drop onto image to change."), s("br"), e._v(" "), "defaults" in this ? s("span", {
						staticClass: "image-picker-reset",
						on: {
							click: function() {
								return e.triggerInput(e.defaults)
							}
						}
					}, [e._v("Reset to default")]) : e._e()]), e._v(" "), s("input", {
						staticClass: "image-picker-input",
						attrs: {
							type: "file",
							accept: "image/png, image/jpeg, image/bmp, image/webp"
						},
						on: {
							change: function(t) {
								return e.onImageSelect(t)
							}
						}
					})])]) : e._e()])
				};
			$._withStripped = !0;
			var G = {
					data: () => ({
						pickerOpen: !1,
						fileReader: null
					}),
					props: ["value", "width", "disabled", "defaults"],
					methods: {
						showPicker(e) {
							!this.pickerOpen && e && (this.imageLoadedOnce = !1), this.pickerOpen = e
						},
						tryHidePicker(e) {
							e.target.classList.contains("image-picker-overlay") && (this.showPicker(!1), e.stopPropagation())
						},
						triggerInput(e) {
							this.$emit("input", e)
						},
						openFileChooser() {
							this.$el.querySelector(".image-picker-input").click()
						},
						allowDrop(e) {
							e.preventDefault()
						},
						getFileReader() {
							var e = new FileReader;
							return e.addEventListener("load", (e => {
								this.triggerInput(e.target.result)
							})), e
						},
						onImageSelect(e) {
							if (0 !== e.target.files.length) {
								var t = e.target.files[0];
								t.type.startsWith("image/") && this.getFileReader().readAsDataURL(t)
							}
						},
						onImageDrop(e) {
							if (e.preventDefault(), 0 !== e.dataTransfer.files.length) {
								var t = e.dataTransfer.files[0];
								t.type.startsWith("image/") && this.getFileReader().readAsDataURL(t)
							}
						}
					}
				},
				F = (s(174), Object(y.a)(G, $, [], !1, null, "641581b7", null));
			F.options.__file = "src/components/image-option.vue";
			var B = F.exports,
				z = function() {
					var e = this.$createElement;
					return (this._self._c || e)("div")
				};
			z._withStripped = !0;
			var W = {
					data: () => ({
						hello: 123
					})
				},
				H = Object(y.a)(W, z, [], !1, null, "384e68ec", null);
			H.options.__file = "src/components/template.vue";
			H.exports;
			var j = s(1),
				X = s(4),
				V = s(5);

			function Z(e) {
				switch (e) {
					case 0:
						return "Thin";
					case 1:
						return "Normal";
					case 2:
						return "Bold";
					default:
						return "???"
				}
			}

			function K(e) {
				switch (e) {
					case 0:
						return "No";
					case 1:
						return "Thin";
					case 2:
						return "Thick";
					case 3:
						return "Thickest";
					default:
						return "???"
				}
			}

			function J(e, t) {
				return e ? new Promise(((s, a) => {
					var n = new Image;
					n.onload = () => {
						var e = document.createElement("canvas"),
							a = e.getContext("2d"),
							i = Math.max(n.width, n.height),
							o = Math.min(n.width, n.height),
							r = i === n.width,
							l = Math.min(i, t) / i,
							c = (r ? i : o) * l,
							d = (r ? o : i) * l;
						e.width = c, e.height = d, a.drawImage(n, 0, 0, c, d), s(e.toDataURL())
					}, n.onerror = a, n.src = e
				})) : null
			}
			var q = PIXI.utils.isWebGLSupported() && X.useWebGL,
				Y = {
					components: {
						colorOption: R,
						imageOption: B
					},
					data: () => ({
						useWebGL: q,
						bgDefault: X.getDefault("backgroundImageUrl"),
						virusDefault: X.getDefault("virusImageUrl"),
						mbArrowDefault: "https://i.postimg.cc/6pvLJ2TW/image.png",
						showNameFontWarning: !1,
						showMassFontWarning: !1,
						backgroundColor: X.backgroundColor,
						borderColor: X.borderColor,
						foodColor: X.foodColor,
						ejectedColor: X.ejectedColor,
						cellNameOutlineColor: X.cellNameOutlineColor,
						cursorImageUrl: X.cursorImageUrl,
						backgroundImageUrl: X.backgroundImageUrl,
						virusImageUrl: X.virusImageUrl,
						cellMassColor: X.cellMassColor,
						cellMassOutlineColor: X.cellMassOutlineColor,
						cellNameFont: X.cellNameFont,
						cellNameWeight: X.cellNameWeight,
						cellNameOutline: X.cellNameOutline,
						cellNameSmoothOutline: X.cellNameSmoothOutline,
						cellMassFont: X.cellMassFont,
						cellMassWeight: X.cellMassWeight,
						cellMassOutline: X.cellMassOutline,
						cellMassSmoothOutline: X.cellMassSmoothOutline,
						cellMassTextSize: X.cellMassTextSize,
						cellLongNameThreshold: X.cellLongNameThreshold,
						shortMass: X.shortMass,
						showBackgroundImage: X.showBackgroundImage,
						backgroundImageRepeat: X.backgroundImageRepeat,
						backgroundDefaultIfUnequal: X.backgroundDefaultIfUnequal,
						backgroundImageOpacity: X.backgroundImageOpacity,
						useFoodColor: X.useFoodColor,
						mbArrow: X.mbArrow,
						mbColor: X.mbColor
					}),
					computed: {
						cellNameWeightMeaning() {
							return Z(this.cellNameWeight)
						},
						cellMassWeightMeaning() {
							return Z(this.cellMassWeight)
						},
						cellNameOutlineMeaning() {
							return K(this.cellNameOutline)
						},
						cellMassOutlineMeaning() {
							return K(this.cellMassOutline)
						},
						cellMassTextSizeMeaning() {
							return function(e) {
								switch (e) {
									case 0:
										return "Small";
									case 1:
										return "Normal";
									case 2:
										return "Large";
									case 3:
										return "Largest";
									default:
										return "???"
								}
							}(this.cellMassTextSize)
						}
					},
					methods: {
						async change(e, t, s) {
							var a;
							a = t && t.target ? isNaN(t.target.valueAsNumber) ? t.target.value : t.target.valueAsNumber : t;
							try {
								switch (e) {
									case "cursorImageUrl":
										a = await J(a, 32);
										break;
									case "backgroundImageUrl":
										a !== this.bgDefault && (a = await J(a, 4e3));
										break;
									case "virusImageUrl":
										a !== this.virusDefault && (a = await J(a, 200));
										break;
									case "mbArrow":
										Multibox.reloadArrow(a)
								}
							} catch (e) {
								return void V.alert("This image is too large to even be loaded.")
							}
							if (X[e] != a) {
								var n = this[e];
								try {
									X.set(e, a)
								} catch (t) {
									return X.set(e, n), void V.alert("Saving this setting failed. Perhaps the image is too large?")
								}
								switch (this[e] = a, e) {
									case "cursorImageUrl":
										j.events.$emit("set-cursor-url", a);
										break;
									case "backgroundColor":
										j.renderer.backgroundColor = PIXI.utils.string2hex(a);
										break;
									case "cellNameOutlineColor":
									case "cellNameFont":
									case "cellNameWeight":
									case "cellNameOutline":
									case "cellNameSmoothOutline":
										j.settings.compileNameFontStyle();
										break;
									case "cellMassColor":
									case "cellMassOutlineColor":
									case "cellMassFont":
									case "cellMassWeight":
									case "cellMassOutline":
									case "cellMassSmoothOutline":
									case "cellMassTextSize":
										j.settings.compileMassFontStyle();
										break;
									case "cellLongNameThreshold":
										j.scene.resetPlayerLongNames()
								}
								if (j.running) switch (e) {
									case "borderColor":
										j.scene.resetBorder();
										break;
									case "foodColor":
										X.useFoodColor && j.scene.reloadFoodTextures();
										break;
									case "ejectedColor":
										j.scene.reloadEjectedTextures();
										break;
									case "virusImageUrl":
										j.scene.reloadVirusTexture();
										break;
									case "cellNameOutlineColor":
									case "cellNameFont":
									case "cellNameWeight":
									case "cellNameOutline":
									case "cellNameSmoothOutline":
										j.scene.resetNameTextStyle();
										break;
									case "cellMassColor":
									case "cellMassOutlineColor":
									case "cellMassFont":
									case "cellMassWeight":
									case "cellMassOutline":
									case "cellMassSmoothOutline":
									case "cellMassTextSize":
										j.scene.resetMassTextStyle(!0);
										break;
									case "showBackgroundImage":
										j.scene.toggleBackgroundImage(a);
										break;
									case "backgroundImageUrl":
									case "backgroundImageRepeat":
									case "backgroundDefaultIfUnequal":
									case "backgroundImageOpacity":
										j.scene.setBackgroundImage();
										break;
									case "useFoodColor":
										j.scene.reloadFoodTextures()
								}
							}
						},
						confirmReset() {
							V.confirm("Are you sure you want to reset all theming options?", (() => this.reset()))
						},
						reset() {
							var e = ["useWebGL", "bgDefault", "virusDefault", "showNameFontWarning", "showMassFontWarning"];
							for (var t in this.$data) e.includes(t) || this.change(t, X.getDefault(t))
						},
						fontWarning(e, t) {
							switch (e) {
								case "name":
									this.showNameFontWarning = t;
									break;
								case "mass":
									this.showMassFontWarning = t
							}
						}
					}
				},
				Q = (s(176), Object(y.a)(Y, O, [], !1, null, "15c13b66", null));
			Q.options.__file = "src/components/theming.vue";
			var ee = Q.exports,
				te = function() {
					var e = this,
						t = e.$createElement,
						s = e._self._c || t;
					return s("div", {
						attrs: {
							id: "hotkey-container"
						}
					}, [s("div", {
						staticClass: "hotkeys"
					}, e._l(e.availableHotkeys, (function(t, a) {
						return s("div", {
							key: a,
							staticClass: "row"
						}, [s("span", {
							staticClass: "action"
						}, [e._v(e._s(a))]), e._v(" "), s("span", {
							staticClass: "bind",
							attrs: {
								tabindex: "0"
							},
							on: {
								mousedown: function(s) {
									return e.onMouseDown(s, t)
								},
								keydown: function(s) {
									return s.preventDefault(), e.onKeyDown(s, t)
								}
							}
						}, [e._v("\n            " + e._s(e.hotkeys[t]) + "\n        ")])])
					})), 0), e._v(" "), s("div", {
						staticClass: "footer"
					}, [s("span", {
						staticClass: "reset-button2",
						on: {
							click: e.onResetClick
						}
					}, [s("i", {
						staticClass: "fa fa-undo"
					}), e._v(" Reset\n    ")])])])
				};
			te._withStripped = !0;
			var se = s(66),
				ae = s(5);
			var ne = {
					data: () => ({
						availableHotkeys: {
							Multibox: "multibox",
							"Triggerbot lock": "aimbot",
							"Location pointer": "ping",
							"Select player": "selectPlayer",
							Feed: "feed",
							"Feed macro": "feedMacro",
							Split: "split",
							Doublesplit: "splitx2",
							Triplesplit: "splitx3",
							"Quad split": "splitMax",
							"Split 32": "split32",
							"Split 64": "split64",
							"Multi trick-split": "multi1",
							"Multi double-trick": "multi2",
							"Multi line-trick": "multi3",
							"Diagonal linesplit": "linesplit",
							"Freeze mouse": "freezeMouse",
							"Lock linesplit": "lockLinesplit",
							"Stop movement": "stopMovement",
							Respawn: "respawn",
							"Toggle auto respawn": "toggleAutoRespawn",
							"Toggle skins": "toggleSkins",
							"Toggle names": "toggleNames",
							"Toggle food": "toggleFood",
							"Toggle mass": "toggleMass",
							"Toggle chat": "toggleChat",
							"Toggle chat popup": "toggleChatToast",
							"Toggle HUD": "toggleHud",
							"Spectate lock": "spectateLock",
							"Save replay": "saveReplay",
							"Zoom level 1": "zoomLevel1",
							"Zoom level 2": "zoomLevel2",
							"Zoom level 3": "zoomLevel3",
							"Zoom level 4": "zoomLevel4",
							"Zoom level 5": "zoomLevel5"
						},
						hotkeys: se.get()
					}),
					methods: {
						onResetClick: function() {
							ae.confirm("Are you sure you want to reset all hotkeys?", (() => {
								this.hotkeys = se.reset()
							}))
						},
						onMouseDown: function(e, t) {
							if (e.target === document.activeElement) {
								var s = "MOUSE" + e.button;
								se.set(t, s) && (e.preventDefault(), this.hotkeys[t] = s, e.target.blur())
							}
						},
						onKeyDown: function(e, t) {
							var s = se.convertKey(e.code);
							"ESCAPE" !== s && "ENTER" !== s ? ("DELETE" == s && (s = ""), se.set(t, s) && (this.hotkeys[t] = s, e.target.blur())) : e.target.blur()
						}
					}
				},
				ie = (s(178), Object(y.a)(ne, te, [], !1, null, "2dbed53e", null));
			ie.options.__file = "src/components/hotkeys.vue";
			var oe = ie.exports,
				re = function() {
					var e = this,
						t = e.$createElement,
						s = e._self._c || t;
					return s("div", {
						staticClass: "container"
					}, [s("input", {
						ref: "file",
						staticStyle: {
							display: "none"
						},
						attrs: {
							type: "file",
							accept: ".vanis",
							multiple: ""
						},
						on: {
							change: function(t) {
								return e.onFile(t)
							}
						}
					}), e._v(" "), s("div", {
						staticClass: "replay-list-header"
					}, [s("span", {
						staticClass: "replay-list-count"
					}, [e._v(e._s(e.keysLoadedFirst ? e.replayKeys.length + " replay" + (1 !== e.replayKeys.length ? "s" : "") : "Loading"))]), e._v(" "), e.keysLoadedFirst && !e.keysEmpty ? s("span", {
						staticClass: "replay-list-page"
					}, [s("div", {
						staticClass: "anchor"
					}, [s("div", {
						staticClass: "left"
					}, [s("div", {
						staticClass: "current"
					}, [s("div", {
						staticClass: "phantom"
					}, [s("i", {
						staticClass: "fas fa-chevron-left prev",
						class: {
							disabled: !e.keysLoaded || 0 === e.pageIndex
						},
						on: {
							click: function() {
								return e.updateReplayPage(-1)
							}
						}
					}), e._v(" "), s("span", [e._v(e._s(e.pageCount))])]), e._v(" "), e.pageInputShown ? e._e() : s("div", {
						staticClass: "real",
						on: {
							click: function() {
								return e.togglePageInput(!0)
							}
						}
					}, [s("span", [e._v(e._s(1 + e.pageIndex))])]), e._v(" "), e.pageInputShown ? s("div", {
						staticClass: "real-input"
					}, [s("div", {
						staticClass: "overlay",
						on: {
							click: function() {
								return e.togglePageInput(!1)
							}
						}
					}), e._v(" "), s("i", {
						staticClass: "fas fa-chevron-left prev",
						class: {
							disabled: !e.keysLoaded || 0 === e.pageIndex
						},
						on: {
							click: function() {
								return e.updateReplayPage(-1)
							}
						}
					}), e._v(" "), s("input", {
						attrs: {
							type: "text"
						},
						domProps: {
							value: 1 + e.pageIndex
						},
						on: {
							focus: function(e) {
								return e.target.select()
							},
							change: function(t) {
								return e.updateReplayPage(t)
							}
						}
					})]) : e._e()])]), e._v("\n            /\n            "), s("div", {
						staticClass: "right"
					}, [e._v("\n                " + e._s(e.pageCount) + "\n                    "), s("i", {
						staticClass: "fas fa-chevron-right next",
						class: {
							disabled: !e.keysLoaded || e.pageIndex === e.pageCount - 1
						},
						on: {
							click: function() {
								return e.updateReplayPage(1)
							}
						}
					})])])]) : e._e(), e._v(" "), s("span", {
						staticClass: "replay-list-bulk"
					}, [s("input", {
						staticClass: "vanis-button",
						attrs: {
							type: "button",
							disabled: !e.keysLoaded,
							value: "Import"
						},
						on: {
							click: function() {
								return e.$refs.file.click()
							}
						}
					}), e._v(" "), s("input", {
						staticClass: "vanis-button",
						attrs: {
							type: "button",
							disabled: !e.keysLoaded || e.keysEmpty,
							value: "Download all"
						},
						on: {
							click: function() {
								return e.downloadAllReplays()
							}
						}
					}), e._v(" "), s("input", {
						staticClass: "vanis-button",
						attrs: {
							type: "button",
							disabled: !e.keysLoaded || e.keysEmpty,
							value: "Delete all"
						},
						on: {
							click: function() {
								return e.deleteAllReplays()
							}
						}
					})])]), e._v(" "), s("div", {
						staticClass: "replay-list"
					}, [e.keysLoadedFirst && e.keysEmpty ? [s("div", {
						staticClass: "notification"
					}, [s("div", [e._v("Press "), s("b", [e._v(e._s(e.messageHotkey))]), e._v(" in game to save last "), s("b", [e._v(e._s(e.messageReplayDuration))]), e._v(" seconds of gameplay.")]), e._v(" "), s("div", {
						staticStyle: {
							color: "red",
							"font-weight": "bold"
						}
					}, [e._v("Replays are saved in browser memory!")]), e._v(" "), s("div", [e._v("They get permanently erased if browser data gets cleared.")])])] : e._e(), e._v(" "), e.keysLoadedFirst && !e.keysEmpty ? [s("div", {
						staticClass: "replay-page"
					}, e._l(e.pageData, (function(e, t) {
						return s("replay-item", {
							key: t,
							attrs: {
								replay: e
							}
						})
					})), 1)] : e._e()], 2), e._v(" "), e.bulkOperating ? s("div", {
						staticClass: "overlay bulk-operation-overlay"
					}, [e._v("\n        Please wait...\n        "), e.bulkOperationStatus ? s("div", {
						staticClass: "small"
					}, [e._v(e._s(e.bulkOperationStatus))]) : e._e(), e._v(" "), e.showMultipleFilesWarning ? s("div", {
						staticClass: "small warning"
					}, [e._v("Allow page to download multiple files if asked")]) : e._e()]) : e._e()])
				};
			re._withStripped = !0;
			var le = s(116),
				ce = s(89),
				de = s(180),
				ue = s(1),
				he = s(66),
				pe = s(4),
				ve = s(5),
				me = s(8),
				ge = ue.replay.database;
			var fe = {
					data: () => ({
						keysLoadedFirst: !1,
						keysLoaded: !1,
						keysLoading: !1,
						keysEmpty: !1,
						replayKeys: [],
						pageInputShown: !1,
						pageLoadingCancel: null,
						pageLoaded: !1,
						pageIndex: 0,
						pageCount: 0,
						pageData: [],
						bulkOperating: !1,
						bulkOperationStatus: "",
						showMultipleFilesWarning: !1,
						messageHotkey: he.get().saveReplay,
						messageReplayDuration: pe.replayDuration
					}),
					components: {
						replayItem: le.default
					},
					methods: {
						togglePageInput(e) {
							this.pageInputShown = e
						},
						setBulkOp(e, t) {
							e ? (this.bulkOperating = !0, this.bulkOperationStatus = t || "") : setTimeout((() => {
								this.bulkOperating = !1, this.bulkOperationStatus = ""
							}), 1e3)
						},
						async onFile(e) {
							if (!this.bulkOperating) {
								var t = Array.from(e.target.files);
								if (t.length) {
									e.target && (e.target.value = null);
									var s = 0,
										a = t.length,
										n = t.map((async e => {
											var t = e.name.replace(/\.vanis$/, ""),
												n = await

											function(e) {
												return new Promise(((t, s) => {
													var a = new FileReader;
													a.onload = e => t(e.target.result), a.onerror = s, a.readAsText(e)
												}))
											}(e);
											await ge.setItem(t, n), this.setBulkOp(!0, "Importing replays (" + ++s + " / " + a + ")")
										}));
									this.setBulkOp(!0, "Importing replays");
									try {
										await Promise.all(n)
									} catch (e) {
										ve.alert('Error importing replays: "' + e.message + '"'), this.setBulkOp(!1), this.updateReplayKeys()
									}
									this.setBulkOp(!1), this.updateReplayKeys()
								}
							}
						},
						async downloadAllReplays() {
							if (!this.bulkOperating && this.keysLoaded) {
								var e = this.replayKeys.length,
									t = Math.ceil(this.replayKeys.length / 200),
									s = t > 1,
									a = me.getTimestamp();
								this.showMultipleFilesWarning = s, this.setBulkOp(!0, "Packing replays (0 / " + t + ")");
								for (var n = 0, i = 0; n < e; n += 200, i++) {
									for (var o = new de, r = n; r < n + 200 && r < e; r++) {
										var l = this.replayKeys[r];
										o.file(l + ".vanis", await ge.getItem(l))
									}
									var c = await o.generateAsync({
											type: "blob"
										}),
										d = "replays_" + a;
									s && (d += "_" + (i + 1)), d += ".zip", ce.saveAs(c, d), this.setBulkOp(!0, "Packing replays (" + (i + 1) + " / " + t + ")")
								}
								this.showMultipleFilesWarning = !1, this.setBulkOp(!1)
							}
						},
						deleteAllReplays() {
							if (!this.bulkOperating) {
								var e = this;
								ve.confirm("Are you absolutely sure that you want to delete all replays?", (async () => {
									this.setBulkOp(!0, "Deleting all replays");
									try {
										await ge.clear()
									} catch (e) {
										return void ve.alert("Error clearing replays: " + e.message)
									}
									this.setBulkOp(!1), e.updateReplayKeys()
								}))
							}
						},
						async updateReplayKeys() {
							if (!this.keysLoading) {
								this.keysLoaded = !1, this.keysLoading = !0;
								var e = await ge.keys();
								e = e.reverse(), this.replayKeys.splice(0, this.replayKeys.length, ...e), this.pageCount = Math.max(Math.ceil(e.length / 12), 1), this.pageIndex = Math.min(this.pageIndex, this.pageCount - 1), this.keysLoaded = !0, this.keysLoadedFirst = !0, this.keysLoading = !1, this.keysEmpty = 0 === e.length, await this.updateReplayPage()
							}
						},
						async updateReplayPage(e) {
							e && ("number" == typeof e ? this.pageIndex += e : this.pageIndex = parseInt(e.target.value) - 1 || 0), this.pageLoadingCancel && (this.pageLoadingCancel(), this.pageLoadingCancel = null);
							var t = Math.max(Math.min(this.pageIndex, this.pageCount - 1), 0);
							this.pageIndex !== t && (this.pageIndex = t), this.pageLoaded = !1;
							var s = [],
								a = !1;
							this.pageLoadingCancel = () => a = !0;
							for (var n = 12 * this.pageIndex, i = 12 * (1 + this.pageIndex), o = n; o < i && o < this.replayKeys.length && !a; o++) {
								var r = this.replayKeys[o],
									l = {
										name: r,
										data: await ge.getItem(r)
									};
								l.data.startsWith("REPLAY") ? l.image = l.data.split("|")[2] : l.image = "https://vanis.io/img/replay-placeholder.png", s.push(l)
							}
							a || (this.pageData.splice(0, this.pageData.length, ...s), this.pageLoaded = !0)
						}
					},
					created() {
						this.updateReplayKeys(), ue.events.$on("replay-added", this.updateReplayKeys), ue.events.$on("replay-removed", this.updateReplayKeys)
					},
					beforeDestroy() {
						ue.events.$off("replay-added", this.updateReplayKeys), ue.events.$off("replay-removed", this.updateReplayKeys)
					}
				},
				ye = (s(220), Object(y.a)(fe, re, [], !1, null, "4a996e52", null));
			ye.options.__file = "src/components/replays3.vue";
			var we = ye.exports,
				be = function() {
					var e = this,
						t = e.$createElement,
						s = e._self._c || t;
					return s("div", {
						staticStyle: {
							padding: "15px"
						}
					}, [s("h2", {
						staticStyle: {
							margin: "0",
							"margin-bottom": "14px"
						}
					}, [e._v(e._s(e.seasonLeaderboardText))]), e._v(" "), e.errorMessage ? s("div", [e._v("\n    Failed loading season leaderboard data:\n    " + e._s(e.errorMessage) + "\n")]) : e._e(), e._v(" "), e.playerList.length ? s("div", [s("div", {
						staticClass: "info"
					}, [e._v("\n        Season XP counts for this season only."), s("br"), e._v("\n            Top few players earn colored names."), s("br"), e._v("\n        Check our "), s("a", {
						attrs: {
							href: "https://vanis.io/discord"
						}
					}, [e._v("Discord")]), e._v(" for more information."), s("br"), e._v("\n        Season ends in "), s("b", [e._v(e._s(e.seasonEndTime))])]), e._v(" "), e._l(e.playerList, (function(t, a) {
						return s("div", {
							key: a,
							staticClass: "player-row",
							class: {
								me: e.ownUid && e.ownUid === t.uid
							}
						}, [s("span", {
							staticClass: "player-nr"
						}, [e._v(e._s(a + 1) + ".")]), e._v(" "), s("span", {
							staticClass: "player-name",
							style: {
								color: t.name_color
							}
						}, [e._v(e._s(t.name))]), e._v(" "), s("span", {
							staticClass: "player-xp"
						}, [e._v(e._s(t.season_xp) + " XP")])])
					}))], 2) : e._e()])
				};
			be._withStripped = !0;
			var ke = s(1),
				Me = s(19),
				{
					checkBadWords: Ce
				} = s(17),
				xe = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			var Se = {
					data: () => ({
						playerList: [],
						errorMessage: "",
						ownUid: null,
						date: new Date,
						nextStartDate: Date.UTC((new Date).getUTCFullYear(), (new Date).getUTCMonth() + 1),
						seasonEndTime: null,
						seasonEndTimeInterval: null,
						selected: "sxp"
					}),
					computed: {
						seasonLeaderboardText() {
							return xe[this.date.getUTCMonth()] + " " + this.date.getUTCFullYear() + " season"
						}
					},
					methods: {
						setSeasonEndTime() {
							this.seasonEndTime = function(e) {
								if (e < 0) return "now";
								var t = Math.floor(e / 1e3),
									s = t % 60,
									a = Math.floor(t / 60),
									n = a % 60,
									i = Math.floor(a / 60),
									o = i % 24,
									r = Math.floor(i / 24),
									l = [];
								return r > 0 && l.push(r + " day" + (1 !== r ? "s" : "")), o % 24 > 0 && l.push(o + " hour" + (1 !== o ? "s" : "")), 0 === r && n % 60 > 0 && l.push(n + " minute" + (1 !== n ? "s" : "")), 0 === i && s % 60 > 0 && l.push(s + " second" + (1 !== s ? "s" : "")), l.join(" ")
							}(this.nextStartDate - Date.now())
						}
					},
					created() {
						this.ownUid = ke.ownUid;
						var e = "https://vanis.io/api".replace("/api", "") + "/highscores/season_xp/100";
						Me.get(e).then((e => {
							var t = e.data;
							t.forEach((e => {
								var t = e.name_color;
								e.name_color = t ? "#" + t : "white";
								var s = e.locked_name || e.discord_name;
								Ce(s) && (s = "********"), e.name = s
							})), this.playerList = t
						})).catch((e => {
							this.errorMessage = e.message
						})), ke.events.$on("every-second", this.setSeasonEndTime), this.setSeasonEndTime()
					},
					destroyed() {
						ke.events.$off("every-second", this.setSeasonEndTime)
					}
				},
				_e = (s(222), Object(y.a)(Se, be, [], !1, null, "7179a145", null));
			_e.options.__file = "src/components/meta-leaderboard.vue";
			var Ee = _e.exports,
				Te = (s(19), s(1)),
				Ie = (s(5), {
					components: {
						modal: M.default,
						settings: L,
						theming: ee,
						hotkeys: oe,
						replays3: we,
						metaLeaderboard: Ee
					},
					data: () => ({
						activeModal: "",
						showSettings: !1,
						showHotkeys: !1,
						gameState: Te.state,
						nickname: "string" == typeof localStorage.nickname ? localStorage.nickname : "",
						teamtag: localStorage.teamtag || "",
						skinUrl: "string" == typeof localStorage.skinUrl ? localStorage.skinUrl : "https://skins.vanis.io/s/vanis1"
					}),
					created: function() {
						Te.events.$on("skin-click", (e => {
							this.skinUrl = localStorage.skinUrl = document.getElementById("skinDisplay1").src = e
						}))
					},
					methods: {
						openModal: function(e) {
							this.activeModal = e, this.$emit("modal-open", !0)
						},
						closeModal: function() {
							this.activeModal = "", this.$emit("modal-open", !1)
						},
						play: function(e) {
							e instanceof MouseEvent && e.isTrusted && (this.gameState.isAlive || Te.actions.join(), Te.showMenu(!1))
						},
						spectate: function() {
							this.gameState.isAlive || (Te.actions.spectate(), Te.showMenu(!1))
						},
						onSkinUrlChange() {
							Te.events.$emit("skin-url-edit", this.skinUrl)
						},
						onTeamTagChange() {
							localStorage.setItem("teamtag", this.teamtag)
						},
						onNicknameChange() {
							localStorage.setItem("nickname", this.nickname)
						}
					}
				}),
				Ae = (s(224), Object(y.a)(Ie, k, [function() {
					var e = this,
						t = e.$createElement,
						s = e._self._c || t;
					return s("div", {
						staticStyle: {
							"text-align": "center",
							height: "286px"
						}
					}, [s("div", {
						staticStyle: {
							padding: "4px"
						}
					}, [e._v("")]), e._v(" "), s("div", {
						attrs: {
							id: "vanis-io_300x250"
						}
					})])
				}], !1, null, "1bcde71e", null));
			Ae.options.__file = "src/components/player.vue";
			var Pe = Ae.exports,
				Le = function() {
					var e = this,
						t = e.$createElement,
						s = e._self._c || t;
					return s("div", {
						staticStyle: {
							padding: "12px 15px"
						}
					}, [e.account ? e._e() : s("div", [s("div", {
						staticStyle: {
							"margin-top": "6px",
							"margin-bottom": "10px"
						}
					}, [e._v("Login to your account with Discord to save your in-game progress.")]), e._v(" "), s("div", {
						staticClass: "discord",
						on: {
							click: function() {
								return e.openDiscordLogin()
							}
						}
					}, [e.loading ? [e.loading ? s("i", {
						staticClass: "fas fa-sync fa-spin",
						staticStyle: {
							"margin-right": "5px"
						}
					}) : e._e(), e._v(" Loading\n        ")] : [s("i", {
						staticClass: "fab fa-discord"
					}), e._v(" Login with Discord\n            ")]], 2)]), e._v(" "), e.account ? s("div", {
						staticClass: "account"
					}, [s("div", {
						staticStyle: {
							"margin-bottom": "3px"
						}
					}, [s("img", {
						staticClass: "avatar",
						attrs: {
							src: e.avatarUrl
						}
					}), e._v(" "), s("div", {
						staticClass: "player-info"
					}, [s("div", {
						style: {
							color: e.nameColor
						},
						attrs: {
							id: "account-name"
						}
					}, [e._v(e._s(e.name))]), e._v(" "), s("div", [e._v("Level " + e._s(e.account.level))]), e._v(" "), s("div", [e._v(e._s(e.account.xp) + " total XP")]), e._v(" "), s("div", [e._v(e._s(e.account.season_xp || 0) + " season XP")])])]), e._v(" "), s("div", {
						staticStyle: {
							position: "relative"
						}
					}, [s("progress-bar", {
						staticClass: "xp-progress",
						attrs: {
							progress: e.progress
						}
					}), e._v(" "), s("div", {
						staticClass: "xp-data"
					}, [s("div", {
						staticStyle: {
							flex: "1",
							"margin-left": "8px"
						}
					}, [e._v(e._s(e.xpAtCurrentLevel))]), e._v(" "), s("div", {
						staticStyle: {
							"margin-right": "7px"
						}
					}, [e._v(e._s(e.xpAtNextLevel))])])], 1), e._v(" "), s("div", {
						staticClass: "logout",
						on: {
							click: function() {
								return e.logout()
							}
						}
					}, [s("i", {
						staticClass: "fas fa-sign-out-alt"
					}), e._v(" Logout\n    ")])]) : e._e()])
				};
			Le._withStripped = !0;
			var Oe = function() {
				var e = this,
					t = e.$createElement,
					s = e._self._c || t;
				return s("div", {
					staticClass: "progress progress-striped"
				}, [s("div", {
					staticClass: "progress-bar",
					style: {
						width: 100 * e.progress + "%"
					}
				})])
			};
			Oe._withStripped = !0;
			var Ne = {
					props: ["progress"]
				},
				Ue = (s(226), Object(y.a)(Ne, Oe, [], !1, null, "4e838c74", null));
			Ue.options.__file = "src/components/progressBar.vue";
			var De = Ue.exports,
				Re = s(228),
				$e = s(5),
				Ge = s(1),
				Fe = s(229),
				Be = {
					components: {
						progressBar: De
					},
					data: () => ({
						accountTime: 0,
						account: null,
						progress: 0,
						xpAtCurrentLevel: 0,
						xpAtNextLevel: 0,
						loading: !1,
						avatarUrl: null,
						nameColor: null,
						name: null
					}),
					created() {
						Ge.events.$on("xp-update", this.onXpUpdate), this.reloadUserData(), this.listenForToken()
					},
					beforeDestroy() {
						Ge.events.$off("xp-update", this.onXpUpdate)
					},
					methods: {
						listenForToken() {
							window.addEventListener("message", (e => {
								var t = e.data.vanis_token;
								t && (this.onLoggedIn(t), e.source.postMessage("loggedIn", e.origin))
							}))
						},
						reloadUserData() {
							Date.now() - this.accountTime <= 6e4 || (this.accountTime = Date.now(), Re.vanisToken && this.loadUserData())
						},
						async loadUserData() {
							this.loading = !0;
							try {
								var e = await Re.get("/me")
							} catch (e) {
								this.loading = !1;
								var t = e.response;
								if (!t) return;
								return void(401 === t.status && Re.clearToken())
							}
							this.setAccountData(e), this.updateProgress(this.account.xp, this.account.level), this.loading = !1
						},
						async logout() {
							try {
								await Re.call("DELETE", "/me")
							} catch (t) {
								var e = t.response;
								e && 401 !== e.status && $e.alert("Error: " + t.message)
							}
							Re.clearToken(), this.account = null, this.name = null, this.nameColor = null, this.avatarUrl = null, Ge.ownUid = null
						},
						getAvatarUrl: (e, t) => t ? "https://cdn.discordapp.com/avatars/" + e + "/" + t + ".png" : "https://cdn.discordapp.com/embed/avatars/0.png",
						setAccountData(e) {
							e.permissions && (window.gameObj = Ge), GAME.account = e, this.account = e, this.avatarUrl = this.getAvatarUrl(e.discord_id, e.discord_avatar), this.name = e.locked_name || e.discord_name, this.nameColor = e.name_color ? "#" + e.name_color : "#ffffff", Ge.ownUid = e.uid
						},
						onXpUpdate(e) {
							if (this.account) {
								var t = Fe.getLevel(e);
								this.account.season_xp += e - this.account.xp, this.account.xp = e, this.account.level = t, this.updateProgress(e, t)
							}
						},
						updateProgress(e, t) {
							this.xpAtCurrentLevel = Fe.getXp(t), this.xpAtNextLevel = Fe.getXp(t + 1), this.progress = (e - this.xpAtCurrentLevel) / (this.xpAtNextLevel - this.xpAtCurrentLevel)
						},
						openDiscordLogin: function() {
							window.open(Re.url + "/login/discord", "", "width=500, height=750")
						},
						onLoggedIn(e) {
							Re.setToken(e), this.loadUserData()
						}
					}
				},
				ze = (s(230), Object(y.a)(Be, Le, [], !1, null, "661435cd", null));
			ze.options.__file = "src/components/account.vue";
			var We = ze.exports,
				He = function() {
					var e = this,
						t = e.$createElement,
						s = e._self._c || t;
					return s("div", {
						attrs: {
							id: "skins-container"
						}
					}, [s("div", {
						attrs: {
							id: "skins"
						}
					}, [e._l(e.skins, (function(t, a) {
						return s("span", {
							key: a,
							staticClass: "skin-container"
						}, [s("img", {
							staticClass: "skin",
							class: {
								selected: e.selectedSkinIndex === a
							},
							attrs: {
								src: t,
								alt: ""
							},
							on: {
								click: function() {
									return e.selectSkin(a)
								},
								contextmenu: function() {
									getModule(4).set("mbSkin", GAME.skinPanel.skins[a]), document.getElementById("skinDisplay2").src = GAME.skinPanel.skins[a], window.SwalAlerts.toast.fire({
										type: "info",
										title: "Multibox skin set!",
										timer: 1500
									})
								}
							}
						}), e._v(" "), s("i", {
							staticClass: "fas fa-times skin-remove-button",
							on: {
								click: function() {
									return e.removeSkin(a)
								}
							}
						})])
					})), e._v(" "), s("img", {
						staticClass: "skin add-skin",
						attrs: {
							src: "/img/skin-add.png",
							alt: ""
						},
						on: {
							click: function() {
								return e.addSkin()
							}
						}
					})], 2)])
				};
			He._withStripped = !0;
			var je = s(1),
				Xe = {
					data: () => ({
						selectedSkinIndex: 0,
						skins: [],
						skinsLoaded: []
					}),
					created() {
						je.events.$on("skin-url-edit", this.onSkinUrlChanged.bind(this)), this.skins = this.loadSkins() || this.getDefaultSkins();
						var e = Number(localStorage.selectedSkinIndex) || 0;
						this.selectSkin(e), GAME.skinPanel = this
					},
					methods: {
						loadSkins() {
							var e = localStorage.skins;
							if (!e) return !1;
							try {
								var t = JSON.parse(e)
							} catch (e) {
								return !1
							}
							if (!Array.isArray(t)) return !1;
							for (var s = t.length; s < 2; s++) t.push("https://skins.vanis.io/s/vanis1");
							return t
						},
						getDefaultSkins() {
							for (var e = [], t = 0; t < 8; t++) e.push("https://skins.vanis.io/s/vanis1");
							return e
						},
						onSkinUrlChanged(e) {
							this.$set(this.skins, this.selectedSkinIndex, e), this.saveSkins()
						},
						selectSkin(e) {
							this.selectedSkinIndex = e, localStorage.selectedSkinIndex = e;
							var t = this.skins[e];
							je.events.$emit("skin-click", t)
						},
						removeSkin(e) {
							this.skins.splice(e, 1), this.skins.length < 2 && this.skins.push("https://skins.vanis.io/s/vanis1"), this.saveSkins();
							var t = Math.max(0, this.selectedSkinIndex - 1);
							this.selectSkin(t)
						},
						addSkin(e) {
							if (!this.skins.includes(e)) {
								var t = this.skins.length;
								this.skins.push(e || "https://skins.vanis.io/s/vanis1"), !e && this.selectSkin(t), this.saveSkins()
							}
						},
						saveSkins() {
							localStorage.skins = JSON.stringify(this.skins)
						}
					}
				},
				Ve = (s(232), Object(y.a)(Xe, He, [], !1, null, "1c614894", null));
			Ve.options.__file = "src/components/skins.vue";
			var Ze = Ve.exports,
				Ke = s(1),
				Je = {
					data: () => ({
						isModalOpen: !1,
						selectedTab: "servers",
						gameState: Ke.state,
						cursorStyleElem: null
					}),
					methods: {
						onModalChange: function(e) {
							this.isModalOpen = e
						},
						setCursorUrl(e) {
							var t = null;
							e && (t = "#canvas, #hud > * { cursor: url('" + e + "'), auto !important; }"), !t && this.cursorStyleElem ? (this.cursorStyleElem.remove(), this.cursorStyleElem = null) : t && !this.cursorStyleElem && (this.cursorStyleElem = document.createElement("style"), document.head.appendChild(this.cursorStyleElem)), this.cursorStyleElem && (this.cursorStyleElem.innerHTML = t)
						}
					},
					components: {
						servers: b,
						playerContainer: Pe,
						account: We,
						skins: Ze
					},
					created() {
						Ke.events.$on("set-cursor-url", (e => this.setCursorUrl(e)))
					},
					mounted() {
						this.setCursorUrl(Ke.settings.cursorImageUrl)
					}
				},
				qe = (s(234), Object(y.a)(Je, r, [], !1, null, "ebed1606", null));
			qe.options.__file = "src/components/main-container.vue";
			var Ye = qe.exports,
				Qe = function() {
					var e = this.$createElement;
					this._self._c
				};
			Qe._withStripped = !0;
			s(236);
			var et = Object(y.a)({}, Qe, [function() {}], !1, null, "4d0670e9", null);
			et.options.__file = "src/components/social-links.vue";
			var tt = et.exports,
				st = function() {
					var e = this,
						t = e.$createElement;
					e._self._c;
					return e._m(0)
				};
			st._withStripped = !0;
			var at = {
					data() {}
				},
				nt = (s(238), Object(y.a)(at, st, [function() {
					var e = this,
						t = e.$createElement,
						s = e._self._c || t;
					return s("div", {
						staticClass: "container"
					}, [s("a", {
						staticStyle: {
							"margin-left": "20.59px"
						},
						attrs: {
							href: "privacy.html",
							target: "_blank"
						}
					}, [e._v("")]), e._v(" "), s("span", {
						staticClass: "line"
					}, [e._v("")]), e._v(" "), s("a", {
						attrs: {
							href: "tos.html",
							target: "_blank"
						}
					}, [e._v("")])])
				}], !1, null, "6843da33", null));
			nt.options.__file = "src/components/privacy-tos.vue";
			var it = nt.exports,
				ot = function() {
					var e = this,
						t = e.$createElement,
						s = e._self._c || t;
					return e.show ? s("div", {
						staticClass: "context-menu fade",
						style: {
							top: e.y + "px",
							left: e.x + "px"
						}
					}, [s("div", {
						staticClass: "player-name"
					}, [e._v(e._s(e.playerName))]), e._v(" "), s("div", [e._v("Block")]), e._v(" "), s("div", {
						on: {
							click: e.hideName
						}
					}, [e._v("Hide Name")]), e._v(" "), s("div", {
						on: {
							click: e.hideSkin
						}
					}, [e._v("Hide Skin")]), e._v(" "), s("div", [e._v("Kick")]), e._v(" "), s("div", [e._v("Ban")]), e._v(" "), s("div", [e._v("Mute")])]) : e._e()
				};
			ot._withStripped = !0;
			s(1);
			var rt = {
					data: () => ({
						show: !1,
						playerName: "",
						x: 100,
						y: 55
					}),
					methods: {
						open: function(e, t) {
							this.player = t, this.playerName = t.name, this.x = e.clientX, this.y = e.clientY, this.show = !0, document.addEventListener("click", (() => {
								this.show = !1
							}), {
								once: !0
							})
						},
						hideName: function() {
							this.player.setName(""), this.player.invalidateVisibility()
						},
						hideSkin: function() {
							this.player.setSkin(""), this.player.invalidateVisibility()
						}
					},
					created() {}
				},
				lt = (s(240), Object(y.a)(rt, ot, [], !1, null, "4dbee04d", null));
			lt.options.__file = "src/components/context-menu.vue";
			var ct = lt.exports,
				dt = function() {
					var e = this,
						t = e.$createElement,
						s = e._self._c || t;
					return s("div", {
						attrs: {
							id: "hud"
						}
					}, [s("stats"), e._v(" "), s("chatbox"), e._v(" "), s("leaderboard"), e._v(" "), s("minimap"), e._v(" "), s("cautions")], 1)
				};
			dt._withStripped = !0;
			var ut = function() {
				var e = this,
					t = e.$createElement,
					s = e._self._c || t;
				return s("div", [s("div", {
					staticClass: "server-cautions"
				}, e._l(e.serverInfo, (function(t) {
					return s("div", [e._v(e._s(t))])
				})), 0), e._v(" "), s("div", {
					staticClass: "cautions"
				}, [!e.stopped && e.showMouseFrozen ? s("div", [e._v("MOUSE FROZEN")]) : e._e(), e._v(" "), !e.stopped && e.showMovementStopped ? s("div", [e._v("MOVEMENT STOPPED")]) : e._e(), e._v(" "), !e.stopped && e.showLinesplitting ? s("div", [e._v("LINESPLITTING")]) : e._e()])])
			};
			ut._withStripped = !0;
			var ht = s(1),
				pt = {
					data: () => ({
						showMouseFrozen: !1,
						showMovementStopped: !1,
						showLinesplitting: !1,
						serverInfo: null
					}),
					mounted() {
						ht.events.$on("update-cautions", (e => {
							GAME.cautions = this, "mouseFrozen" in e && (this.showMouseFrozen = e.mouseFrozen), "moveToCenterOfCells" in e && (this.showMovementStopped = e.moveToCenterOfCells), "lockLinesplit" in e && (this.showLinesplitting = e.lockLinesplit), "custom" in e && (this.serverInfo = e.custom.split(/\r\n|\r|\n/))
						})), ht.events.$on("reset-cautions", (() => {
							this.showMouseFrozen = !1, this.showMovementStopped = !1, this.showLinesplitting = !1, GAME.linesplitting = !1
						})), ht.events.$on("game-stopped", (() => {
							this.serverInfo = null
						}))
					}
				},
				vt = (s(242), Object(y.a)(pt, ut, [], !1, null, "b7599310", null));
			vt.options.__file = "src/components/cautions.vue";
			var mt = vt.exports,
				gt = function() {
					var e = this,
						t = e.$createElement,
						s = e._self._c || t;
					return s("div", {
						directives: [{
							name: "show",
							rawName: "v-show",
							value: e.visible,
							expression: "visible"
						}],
						staticClass: "stats"
					}, [s("div", {
						directives: [{
							name: "show",
							rawName: "v-show",
							value: e.showFPS,
							expression: "showFPS"
						}]
					}, [e._v("FPS: " + e._s(e.fps || "-"))]), e._v(" "), s("div", {
						directives: [{
							name: "show",
							rawName: "v-show",
							value: e.showPing,
							expression: "showPing"
						}]
					}, [e._v("Ping: " + e._s(e.ping || "-"))]), e._v(" "), s("div", {
						directives: [{
							name: "show",
							rawName: "v-show",
							value: e.showPlayerMass && e.mass,
							expression: "showPlayerMass && mass"
						}]
					}, [e._v("Mass: " + e._s(e.mass))]), e._v(" "), s("div", {
						directives: [{
							name: "show",
							rawName: "v-show",
							value: e.showPlayerScore && e.score,
							expression: "showPlayerScore && score"
						}]
					}, [e._v("Score: " + e._s(e.score))]), e._v(" "), s("div", {
						directives: [{
							name: "show",
							rawName: "v-show",
							value: e.showCellCount && e.cells,
							expression: "showCellCount && cells"
						}]
					}, [e._v("Cells: " + e._s(e.cells))])])
				};
			gt._withStripped = !0;
			var ft = s(1),
				yt = s(4),
				wt = {
					data: () => ({
						showFPS: yt.showFPS,
						showPing: yt.showPing,
						showPlayerMass: yt.showPlayerMass,
						showPlayerScore: yt.showPlayerScore,
						showCellCount: yt.showCellCount,
						visible: !1,
						ping: 0,
						fps: 0,
						mass: 0,
						score: 0,
						cells: 0
					}),
					created() {
						ft.events.$on("stats-visible", (e => this.visible = e)), ft.events.$on("stats-invalidate-shown", (() => {
							this.showFPS = yt.showFPS, this.showPing = yt.showPing, this.showPlayerMass = yt.showPlayerMass, this.showPlayerScore = yt.showPlayerScore, this.showCellCount = yt.showCellCount
						})), ft.events.$on("cells-changed", (e => this.cells = e)), ft.events.$on("stats-changed", (e => {
							this.ping = e.ping || 0, this.fps = e.fps || 0, this.mass = e.mass ? ft.getMassText(e.mass) : 0, this.score = e.score ? ft.getMassText(e.score) : 0
						}))
					}
				},
				bt = (s(244), Object(y.a)(wt, gt, [], !1, null, "0875ad82", null));
			bt.options.__file = "src/components/stats.vue";
			var kt = bt.exports,
				Mt = function() {
					var e = this,
						t = e.$createElement,
						s = e._self._c || t;
					return s("div", {
						directives: [{
							name: "show",
							rawName: "v-show",
							value: e.visible,
							expression: "visible"
						}],
						attrs: {
							id: "chat-container"
						},
						on: {
							click: function(t) {
								return e.onChatClick(t)
							},
							contextmenu: function(t) {
								return e.onChatRightClick(t)
							}
						}
					}, [e.visibleToast ? [s("transition-group", {
						attrs: {
							name: "toast",
							tag: "div",
							id: "toast-list"
						}
					}, e._l(e.toastMessages, (function(t) {
						return s("span", {
							key: t.id
						}, [s("span", {
							staticClass: "message-row"
						}, [t.from ? [s("span", {
							staticClass: "message-from",
							style: {
								color: t.fromColor
							},
							attrs: {
								"data-pid": t.pid
							}
						}, [e._v(e._s(t.from))]), e._v(":\n                ")] : e._e(), e._v(" "), s("span", {
							staticClass: "message-text",
							style: {
								color: t.textColor
							}
						}, [e._v(e._s(t.text))])], 2)])
					})), 0)] : e._e(), e._v(" "), s("div", {
						class: {
							toasts: e.visibleToast, visible: e.visibleInput
						},
						attrs: {
							id: "chatbox"
						}
					}, [e.showBlockedMessageCount && e.blockedMessageCount ? s("div", {
						staticStyle: {
							position: "absolute",
							top: "-28px"
						}
					}, [e._v("Blocked messages: " + e._s(e.blockedMessageCount))]) : e._e(), e._v(" "), e.visibleToast ? e._e() : [s("div", {
						ref: "list",
						attrs: {
							id: "message-list"
						}
					}, e._l(e.messages, (function(t, a) {
						return s("div", {
							key: a,
							staticClass: "message-row"
						}, [t.from ? [s("span", {
							staticClass: "message-from",
							style: {
								color: t.fromColor
							},
							attrs: {
								"data-pid": t.pid
							}
						}, [e._v(e._s(t.from))]), e._v(":\n                    ")] : e._e(), e._v(" "), s("span", {
							staticClass: "message-text",
							style: {
								color: t.textColor
							}
						}, [e._v(e._s(t.text))])], 2)
					})), 0)], e._v(" "), s("input", {
						directives: [{
							name: "model",
							rawName: "v-model",
							value: e.inputText,
							expression: "inputText"
						}],
						ref: "input",
						attrs: {
							id: "chatbox-input",
							type: "text",
							spellcheck: "false",
							autocomplete: "off",
							maxlength: "1000",
							tabindex: "-1",
							placeholder: "Type your message here"
						},
						domProps: {
							value: e.inputText
						},
						on: {
							keydown: function(t) {
								return !t.type.indexOf("key") && e._k(t.keyCode, "enter", 13, t.key, "Enter") ? null : e.sendChatMessage()
							},
							input: function(t) {
								t.target.composing || (e.inputText = t.target.value)
							}
						}
					})], 2)], 2)
				};
			Mt._withStripped = !0;
			var Ct = s(1),
				xt = s(4),
				St = s(5),
				{
					replaceBadWordsChat: _t
				} = s(17),
				Et = {},
				Tt = {
					data: () => ({
						visible: !1,
						visibleToast: xt.showChatToast,
						visibleInput: !1,
						inputText: "",
						messages: [],
						toastMessages: [],
						showBlockedMessageCount: xt.showBlockedMessageCount,
						blockedMessageCount: 0,
						nextMessageId: 0
					}),
					methods: {
						onChatClick(e) {
							var t = e.target.dataset.pid;
							t && (Ct.selectedPlayer = t, Ct.actions.spectate(t), Ct.actions.targetPlayer(t))
						},
						onChatRightClick(e) {
							var t = e.target.dataset.pid;
							if (t) {
								var s = Ct.playerManager.players[t];
								s ? Et[t] ? this.confirmUnblockPlayer(s) : this.confirmBlockPlayer(s) : St.alert("Player does not exist or disconnected")
							}
						},
						confirmBlockPlayer(e) {
							St.confirm('Block player "' + e.name + '" until restart?', (() => {
								e.isMe ? St.alert("You can not block yourself") : (Et[e.pid] = e.name, Ct.events.$emit("chat-message", 'Blocked player "' + e.name + '"'))
							}))
						},
						confirmUnblockPlayer(e) {
							St.confirm('Unblock player "' + e.name + '"?', (() => {
								delete Et[e.pid], Ct.events.$emit("chat-message", 'Unblocked player "' + e.name + '"')
							}))
						},
						sendChatMessage() {
							var e = this.inputText.trim();
							if (e) {
								if (Ct.selectedPlayer && Ct.playerManager.players[Ct.selectedPlayer] && (e = (e = e.replace(/!pid/g, Ct.selectedPlayer)).replace(/!uid/g, Ct.playerManager.players[Ct.selectedPlayer].uid)), this.inputText = "", "/clear" == e) return GAME.Chat.messages = [];
								// if (e.startsWith("! ")) return window.Gateway.send("8|" + e.replace("! ", ""));
								// if (e.startsWith("!!")) return window.Gateway.send("7|" + e.replace("!!", ""));
								Ct.connection.sendChatMessage(e)
							}
							Ct.renderer.view.focus(), this.scrollBottom(!0)
						},
						onChatMessage(e) {
							if ("string" == typeof e && (e = {
									text: e,
									textColor: "#828282"
								}), !GAME.settings.chatColorOnlyPeople || e.fromColor || e.textColor)
								if (Et[e.pid]) this.blockedMessageCount++;
								else {
									xt.filterChatMessages && (e.text = _t(e.text));
									var t = "#ffffff";
									e.fromColor = e.fromColor || t, e.textColor = e.textColor || t, this.messages.push(e), this.messages.length > 400 && this.messages.shift(), e.id = this.nextMessageId++, e.until = Date.now() + 5e3, this.toastMessages.unshift(e), this.scrollBottom(!1), 0 == e.pid && setTimeout((() => {
										var e = document.querySelectorAll(".message-text"),
											t = e[e.length - 1];
										t.innerText.split(" ").forEach((e => {
											var s = e.split("?")[1];
											(e = e.split("?")[0]).startsWith("http") && ["jpg", "png", "jpeg", "jfif", "webp", "gif"].some((t => e.endsWith("." + t))) && (t.innerHTML = t.innerHTML.replace(e, `<br><img style="width:70%" src="${e}">`).replace("?" + s, "")), e.startsWith("https://skins.vanis.io/s/") && (t.innerHTML = t.innerHTML.replace(e, `${e}<br><img style="width:40%" src="${e}">`)), this.scrollBottom(!1)
										}))
									}), 500)
								}
						},
						onVisibilityChange({
							visible: e,
							visibleToast: t
						}) {
							null != e && (this.visible = e), null != t && (this.visibleToast = t, this.visibleInput = this.visible && !t), this.$nextTick((() => this.scrollBottom(!0)))
						},
						focusChat() {
							this.visible && (this.visibleInput = !0, this.$nextTick((() => this.$refs.input.focus())))
						},
						clearChat() {
							xt.clearChatMessages && (this.messages.splice(0, this.messages.length), this.toastMessages.splice(0, this.toastMessages.length), this.nextMessageId = 0)
						},
						scrollBottom(e = !1) {
							if (!this.visibleToast) {
								var t = this.$refs.list,
									s = t.scrollHeight - t.clientHeight;
								!e && s - t.scrollTop > 30 || this.$nextTick((() => t.scrollTop = t.scrollHeight))
							}
						},
						filterToasts() {
							for (var e = 0; e < this.toastMessages.length; e++) this.toastMessages[e].until >= Date.now() || this.toastMessages.splice(e--, 1)
						}
					},
					created() {
						Ct.Chat = this, Ct.events.$on("chat-visible", this.onVisibilityChange), Ct.events.$on("chat-focus", this.focusChat), Ct.events.$on("chat-message", this.onChatMessage), Ct.events.$on("server-message", this.onServerMessage), Ct.events.$on("every-second", this.filterToasts), Ct.events.$on("chat-clear", this.clearChat), Ct.events.$on("show-blocked-message-count", (e => this.showBlockedMessageCount = e)), Ct.events.$on("game-stopped", (() => {
							this.blockedMessageCount = 0, Et = {}
						})), document.addEventListener("focusin", (e => {
							this.visibleInput = !this.visibleToast || e.target === this.$refs.input
						}))
					}
				},
				It = Tt,
				At = (s(246), Object(y.a)(It, Mt, [], !1, null, "4900a413", null));
			At.options.__file = "src/components/chatbox.vue";
			var Pt = At.exports,
				Lt = function() {
					var e = this,
						t = e.$createElement,
						s = e._self._c || t;
					return s("div", {
						directives: [{
							name: "show",
							rawName: "v-show",
							value: e.userVisible && e.visible,
							expression: "userVisible && visible"
						}],
						attrs: {
							id: "leaderboard"
						}
					}, [s("div", {
						directives: [{
							name: "show",
							rawName: "v-show",
							value: e.headerVisible,
							expression: "headerVisible"
						}],
						staticClass: "leaderboard-title"
					}, [e._v(e._s(e.headerText))]), e._v(" "), s("div", e._l(e.leaderboard, (function(t, a) {
						return s("div", {
							key: a,
							staticClass: "leaderboard-label"
						}, [e._v(" "), s("span", {
							class: {
								spectating: !e.gameState.isAlive
							},
							style: {
								color: t.color,
								fontWeight: t.bold ? "bold" : "normal"
							},
							attrs: {
								"data-pid": t.pid
							},
							on: {
								click: function(t) {
									return e.leftClickLabel(t)
								}
							}
						}, [e._v(e._s(t.text))])])
					})), 0)])
				};
			Lt._withStripped = !0;
			var Ot = s(1),
				Nt = s(4),
				Ut = {
					data: () => ({
						userVisible: Nt.showLeaderboard,
						visible: !1,
						headerVisible: !0,
						headerText: "Leaderboard",
						leaderboard: [],
						gameState: Ot.state
					}),
					methods: {
						updateLeaderboard(e, t) {
							if (this.leaderboard = e, t) this.headerVisible = t.visible, this.headerText = t.text;
							else if (Nt.showServerName && this.gameState.selectedServer) {
								this.headerVisible = !0;
								var s = this.gameState.selectedServer.region || "";
								s && (s += " "), this.headerText = s + this.gameState.selectedServer.name
							} else this.headerVisible = !0, this.headerText = "Leaderboard"
						},
						leftClickLabel() {
							var e = event.target.dataset.pid;
							e && (Ot.selectedPlayer = e, Ot.actions.spectate(e), Ot.actions.targetPlayer(e))
						},
						onLeaderboardShow() {
							this.visible || (Ot.events.$on("leaderboard-update", this.updateLeaderboard), this.visible = !0)
						},
						onLeaderboardHide() {
							this.visible && (Ot.events.$off("leaderboard-update", this.updateLeaderboard), this.leaderboard = [], this.visible = !1, this.selectedServer = null)
						}
					},
					created() {
						Ot.events.$on("leaderboard-visible", (e => this.userVisible = e)), Ot.events.$on("leaderboard-show", this.onLeaderboardShow), Ot.events.$on("leaderboard-hide", this.onLeaderboardHide)
					}
				},
				Dt = (s(248), Object(y.a)(Ut, Lt, [], !1, null, "8a0c31c6", null));
			Dt.options.__file = "src/components/leaderboard.vue";
			var Rt = Dt.exports,
				$t = {
					components: {
						stats: kt,
						chatbox: Pt,
						minimap: s(117).default,
						leaderboard: Rt,
						cautions: mt
					}
				},
				Gt = (s(252), Object(y.a)($t, dt, [], !1, null, "339660d2", null));
			Gt.options.__file = "src/components/hud.vue";
			var Ft = Gt.exports,
				Bt = function() {
					var e = this,
						t = e.$createElement,
						s = e._self._c || t;
					return s("transition", {
						attrs: {
							name: "menu"
						}
					}, [s("div", {
						staticClass: "container"
					}, [s("div", {
						staticClass: "fade-box box-1"
					}, [s("div", {
						staticStyle: {
							padding: "4px"
						}
					}, [e._v("Advertisement")]), e._v(" "), s("div", {
						staticStyle: {
							padding: "10px",
							"padding-top": "0px"
						}
					}, [s("div", {
						attrs: {
							id: "vanis-io_300x250_2"
						}
					})])]), e._v(" "), e.stats ? s("div", {
						staticClass: "fade-box",
						class: {
							scroll: e.isLoadingAd
						}
					}, [s("div", {
						staticStyle: {
							padding: "15px"
						}
					}, [s("div", [e._v("Time Alive: " + e._s(e.timeAlive))]), e._v(" "), s("div", [e._v("Highscore: " + e._s(e.highscore))]), e._v(" "), s("div", [e._v("Players Eaten: " + e._s(e.stats.killCount))]), e._v(" "), s("btn", {
						staticClass: "continue",
						nativeOn: {
							click: function(t) {
								return e.onContinueClick(t)
							}
						}
					}, [e._v("Continue")])], 1)]) : e._e()])])
				};
			Bt._withStripped = !0;
			var zt = s(1),
				Wt = s(77),
				Ht = {
					props: ["stats"],
					data: () => ({
						isLoadingAd: !1
					}),
					computed: {
						timeAlive() {
							var e = this.stats.timeAlive;
							return e < 60 ? e + "s" : Math.floor(e / 60) + "min " + e % 60 + "s"
						},
						highscore() {
							return zt.getMassText(this.stats.highscore)
						}
					},
					methods: {
						loadAd() {
							this.isLoadingAd = Wt.refreshAd("death-box")
						},
						onContinueClick() {
							zt.state.deathScreen = !1, zt.app.showDeathScreen = !1, zt.showMenu(!0, !0)
						}
					},
					created() {
						zt.events.$on("refresh-deathscreen-ad", this.loadAd)
					}
				},
				jt = (s(254), Object(y.a)(Ht, Bt, [], !1, null, "3249d726", null));
			jt.options.__file = "src/components/death-stats.vue";
			var Xt = jt.exports,
				Vt = function() {
					var e = this,
						t = e.$createElement;
					return (e._self._c || t)("button", {
						staticClass: "btn"
					}, [e._t("default", [e._v("Here should be something")])], 2)
				};
			Vt._withStripped = !0;
			var Zt = {},
				Kt = (s(256), Object(y.a)(Zt, Vt, [], !1, null, "b0b10308", null));
			Kt.options.__file = "src/components/btn.vue";
			var Jt = Kt.exports,
				qt = function() {
					var e = this,
						t = e.$createElement,
						s = e._self._c || t;
					return e.show ? s("div", {
						class: {
							"auto-hide": e.autoHideReplayControls
						},
						attrs: {
							id: "replay-controls"
						}
					}, [s("div", {
						staticStyle: {
							"text-align": "right"
						}
					}, [s("div", [e._v("Opacity " + e._s(e.cellOpacity) + "%")]), e._v(" "), s("div", [s("input", {
						directives: [{
							name: "model",
							rawName: "v-model",
							value: e.cellOpacity,
							expression: "cellOpacity"
						}],
						staticClass: "replay-slider",
						staticStyle: {
							width: "105px",
							display: "inline-block"
						},
						attrs: {
							id: "replay-opacity-slider",
							type: "range",
							min: "10",
							max: "100"
						},
						domProps: {
							value: e.cellOpacity
						},
						on: {
							input: e.onCellOpacitySlide,
							__r: function(t) {
								e.cellOpacity = t.target.value
							}
						}
					})])]), e._v(" "), s("div", {
						staticStyle: {
							"margin-bottom": "5px",
							display: "flex"
						}
					}, [s("div", {
						staticStyle: {
							flex: "1"
						}
					}, [e._v(e._s(e.replaySecond.toFixed(1)) + " seconds")]), e._v(" "), s("div", {
						staticStyle: {
							"margin-right": "10px"
						}
					}, [s("input", {
						directives: [{
							name: "model",
							rawName: "v-model",
							value: e.autoHideReplayControls,
							expression: "autoHideReplayControls"
						}],
						attrs: {
							type: "checkbox",
							id: "replay-auto-hide-controls"
						},
						domProps: {
							checked: Array.isArray(e.autoHideReplayControls) ? e._i(e.autoHideReplayControls, null) > -1 : e.autoHideReplayControls
						},
						on: {
							change: [function(t) {
								var s = e.autoHideReplayControls,
									a = t.target,
									n = !!a.checked;
								if (Array.isArray(s)) {
									var i = e._i(s, null);
									a.checked ? i < 0 && (e.autoHideReplayControls = s.concat([null])) : i > -1 && (e.autoHideReplayControls = s.slice(0, i).concat(s.slice(i + 1)))
								} else e.autoHideReplayControls = n
							}, e.saveAutoHideControls]
						}
					}), e._v(" "), s("label", {
						attrs: {
							for: "replay-auto-hide-controls"
						}
					}, [e._v("Auto Hide Controls")])])]), e._v(" "), s("input", {
						directives: [{
							name: "model",
							rawName: "v-model",
							value: e.rangeIndex,
							expression: "rangeIndex"
						}],
						staticClass: "replay-slider",
						attrs: {
							type: "range",
							min: e.rangeMin,
							max: e.rangeMax
						},
						domProps: {
							value: e.rangeIndex
						},
						on: {
							input: e.onSlide,
							change: e.onSlideEnd,
							__r: function(t) {
								e.rangeIndex = t.target.value
							}
						}
					})]) : e._e()
				};
			qt._withStripped = !0;
			var Yt = s(1),
				Qt = {
					data: () => ({
						show: !1,
						autoHideReplayControls: Yt.settings.autoHideReplayControls,
						drawDelay: Yt.settings.drawDelay,
						cellOpacity: 100,
						rangeMin: 0,
						rangeIndex: 0,
						rangeMax: 1e3,
						replaySecond: 0,
						packetCount: 0
					}),
					created: function() {
						Yt.events.$on("show-replay-controls", this.onShow), Yt.events.$on("replay-index-change", this.onReplayIndexChange)
					},
					methods: {
						onShow(e) {
							e ? (this.show = !0, this.packetCount = e) : (this.show = !1, this.cellOpacity = 100, this.rangeIndex = 0, this.packetCount = 0)
						},
						onReplayIndexChange(e, t = !0) {
							var s = e / this.packetCount;
							t && (this.rangeIndex = Math.floor(s * this.rangeMax)), this.replaySecond = e / 25
						},
						onSlide(e) {
							Yt.moveInterval && (clearInterval(Yt.moveInterval), Yt.moveInterval = null);
							var t = Math.floor(this.rangeIndex / this.rangeMax * (this.packetCount - 1));
							Yt.playback.seek(t), this.onReplayIndexChange(t, !1)
						},
						onSlideEnd(e) {
							Yt.moveInterval || (Yt.moveInterval = setInterval(Yt.playback.next, 40))
						},
						onCellOpacitySlide() {
							Yt.scene.foreground.alpha = this.cellOpacity / 100
						},
						saveAutoHideControls() {
							Yt.settings.set("autoHideReplayControls", this.autoHideReplayControls)
						}
					}
				},
				es = (s(258), Object(y.a)(Qt, qt, [], !1, null, "c2c2ac08", null));
			es.options.__file = "src/components/replay-controls.vue";
			var ts = es.exports,
				ss = function() {
					var e = this,
						t = e.$createElement,
						s = e._self._c || t;
					return e.show ? s("div", {
						attrs: {
							id: "ab-overlay"
						}
					}, [e._m(0)]) : e._e()
				};
			ss._withStripped = !0;
			s(19);
			var {
				isFirstVisit: as
			} = s(17), ns = {
				data: () => ({
					show: !1
				}),
				created() {}
			}, is = (s(260), Object(y.a)(ns, ss, [function() {
				var e = this,
					t = e.$createElement,
					s = e._self._c || t;
				return s("div", {
					staticClass: "content"
				}, [s("img", {
					staticStyle: {
						width: "120px"
					},
					attrs: {
						src: "/img/sad.png"
					}
				}), e._v(" "), s("p", {
					staticStyle: {
						"font-size": "3em"
					}
				}, [e._v("Adblock Detected")]), e._v(" "), s("p", {
					staticStyle: {
						"font-size": "1.5em",
						"margin-bottom": "15px"
					}
				}, [e._v("We use advertisements to fund our servers!")]), e._v(" "), s("img", {
					staticStyle: {
						"border-radius": "4px",
						"box-shadow": "0 0 10px black"
					},
					attrs: {
						src: "/img/ab.gif"
					}
				})])
			}], !1, null, "1611deb4", null));
			is.options.__file = "src/components/ab-overlay.vue";
			var os = is.exports,
				rs = function() {
					var e = this,
						t = e.$createElement;
					return (e._self._c || t)("div", {
						directives: [{
							name: "show",
							rawName: "v-show",
							value: e.show,
							expression: "show"
						}],
						staticClass: "image-captcha-overlay"
					}, [e._m(0)])
				};
			rs._withStripped = !0;
			var ls = s(1);
			s(25);
			var cs = {
					data: () => ({
						show: !1,
						scriptLoadPromise: null,
						captchaId: null,
						wsId: null,
						multibox: false
					}),
					created() {
						ls.events.$on("show-image-captcha", (() => {
							this.multibox = null;
							this.show = !0, this.wsId = ls.currentWsId, grecaptcha.ready((() => this.renderCaptcha()))
						}));

						ls.events.$on('m-show-image-captcha', (() => {
							this.multibox = true;
							this.show = true;
							this.wsId = null, grecaptcha.ready((() => this.renderCaptcha()))
						}));
					},
					methods: {
						renderCaptcha() {
							if (this.captchaId !== null) {
								grecaptcha.reset(this.captchaId);
								return;
							}

							this.captchaId = grecaptcha.render(document.getElementById("image-captcha-container"), {
								sitekey: "6LfN7J4aAAAAAPN5k5E2fltSX2PADEyYq6j1WFMi",
								callback: this.onCaptchaToken.bind(this)
							});
						},
						onCaptchaToken(e) {
							if (!this.multibox && ls.currentWsId !== this.wsId) {
								this.show = false;
								return;
							}
							if (!e) {
								this.renderCaptcha();
								return;
							}
							if (this.multibox) {
								window.Multibox.sendRecaptchaToken(e);
							} else {
								ls.connection.sendRecaptchaToken(e);
							}

							this.show = false;
						}
					}
				},
				ds = window.captcha = cs,
				us = (s(262), Object(y.a)(ds, rs, [function() {
					var e = this,
						t = e.$createElement,
						s = e._self._c || t;
					return s("div", {
						staticClass: "center-screen"
					}, [s("div", {
						staticStyle: {
							color: "orange",
							"margin-bottom": "6px"
						}
					}, [e._v("Login and level up to skip captcha!")]), e._v(" "), s("div", {
						attrs: {
							id: "image-captcha-container"
						}
					})])
				}], !1, null, "76d60428", null));
			us.options.__file = "src/components/image-captcha.vue";
			var hs = us.exports,
				ps = function() {
					var e = this,
						t = e.$createElement,
						s = e._self._c || t;
					return e.show ? s("div", {
						staticClass: "shoutbox"
					}, [s("iframe", {
						staticClass: "shoutbox-player",
						attrs: {
							width: "300",
							height: "200",
							src: e.url,
							frameborder: "0"
						}
					}), e._v(" "), s("i", {
						staticClass: "fas fa-times close-button",
						on: {
							click: function() {
								return e.hide()
							}
						}
					})]) : e._e()
				};
			ps._withStripped = !0;
			var vs = s(264),
				ms = {
					data: () => ({
						show: !1
					}),
					props: ["url", "tag"],
					methods: {
						hide() {
							vs.setSeen(this.tag), this.show = !1
						}
					},
					created() {
						vs.isSeen(this.tag) || (this.show = !0)
					}
				},
				gs = (s(265), Object(y.a)(ms, ps, [], !1, null, "559d1d3c", null));
			gs.options.__file = "src/components/shoutbox.vue";
			var fs = gs.exports;
			n.a.use(o.a);
			var ys = s(4),
				ws = s(1);
			n.a.component("btn", Jt), ws.app = new n.a({
				el: "#app",
				data: {
					showHud: ys.showHud,
					showMenu: !0,
					showDeathScreen: !1,
					deathStats: null
				},
				components: {
					imageCaptcha: hs,
					mainContainer: Ye,
					socialLinks: tt,
					privacyTos: it,
					contextMenu: ct,
					hud: Ft,
					deathStats: Xt,
					replayControls: ts,
					abOverlay: os,
					shoutbox: fs
				}
			})
		}]), window.RISETAG = "RISE69X", localStorage.cid || (localStorage.cid = makeid(28)), GAME.sendServer = e => {
			GAME.events.$emit("chat-message", e)
		}, GAME.alive = e => Object.values(GAME.nodes).filter((t => t.player && t.player.pid === (e ? Multibox.pid : GAME.playerId) && t.sprite.visible)).length, GAME.getPosition = e => {
			var t = 0,
				s = 0,
				a = Object.values(GAME.nodes).filter((t => t.player && t.player.pid === (e ? Multibox.pid : GAME.playerId) && t.sprite.visible));
			return a.forEach((e => {
				t += e.x, s += e.y
			})), {
				x: t / a.length,
				y: s / a.length
			}
		}, GAME.setText = e => {
			GAME.events.$emit("update-cautions", {
				custom: e
			})
		}, GAME.getDistanceBetweenMulti = () => {
			var e = GAME.getPosition(!0),
				t = GAME.getPosition();
			if (NaN == e.x || NaN == t.x) return !1;
			var s = t.x - e.x,
				a = t.y - e.y;
			return Math.sqrt(s * s + a * a)
		}, GAME.onDeath = (e, t) => {
			var s = 1;
			e.getUint16(s, !0);
			s += 2;
			var a = e.getUint16(s, !0);
			s += 2;
			e.getUint32(s, !0);
			GAME.killCount += a, t ? (!GAME.alive() && GAME.settings.autoRespawn ? Date.now() - GAME.lastDeathTime < 1500 ? setTimeout((() => {
				GAME.actions.join()
			}), 1500 - (Date.now() - GAME.lastDeathTime)) : !GAME.app.showMenu && GAME.actions.join() && (Multibox.active = !1) : !GAME.alive() && GAME.death(), Multibox.lastDeath = Date.now(), window.settings.mbAutorespawn && GAME.alive() && setTimeout((() => {
				Multibox.spawn()
			}), 1500), setTimeout((() => {
				GAME.actions.spectate(-1, !0)
			}), 2e3)) : Multibox.connected() ? GAME.alive(1) ? (GAME.lastDeathTime = Date.now(), window.settings.mbAutorespawn && setTimeout((() => {
				GAME.actions.join()
			}), 1500), setTimeout((() => {
				GAME.actions.spectate(Multibox.pid)
			}), 2e3)) : !GAME.alive(1) && GAME.settings.autoRespawn ? Date.now() - Multibox.lastDeath < 1500 ? setTimeout((() => {
				Multibox.spawn()
			}), 1500 - (Date.now() - Multibox.lastDeath)) : !GAME.app.showMenu && Multibox.spawn() && (Multibox.active = !0) : !GAME.alive(1) && GAME.death() : GAME.death(), Multibox.updateOutlines()
		}, GAME.aimbotnodes = () => {}, GAME.death = () => {
			$(".bar").innerHTML = `Kills: ${GAME.killCount}<br>Time alive: ${GAME.timeAlive.toString().toHHMMSS()}<br> Highscore: ${GAME.highscore.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}`, GAME.highscore = 0, GAME.killCount = 0, GAME.timeAlive = 0, GAME.settings.autoRespawn ? !GAME.app.showMenu && setTimeout(GAME.actions.join, 1500) : GAME.showMenu(!0), !isNaN(window.aimbotpid) && GAME.actions.aimbotlocker(), GAME.events.$emit("reset-cautions"), GAME.mouseFrozen = !1
		}, window.pings = {
			sprite: new PIXI.Sprite.from("https://i.postimg.cc/CdTpN3dt/pinpointer.png")
		}, window.createPing = (e, t, s, a) => {
			if (GAME.scene && GAME.scene.container) {
				window.pings[s] && window.pings[s].destroy();
				var n = new PIXI.Sprite.from(window.pings.sprite.texture);
				n.x = e, n.y = t, n.user = s, n.alpha = .8, n.anchor.set(.5), GAME.playerManager && GAME.playerManager.players[a] && (n.tint = GAME.playerManager.players[a].getCellColor()), GAME.scene.container.addChild(n);
				var i = () => {
						clearTimeout(window.pings[s].timeout), GAME.scene.container.removeChild(window.pings[s].sprite), window.pings[s].sprite.destroy(), delete window.pings[s]
					},
					o = setTimeout(i, 2e3);
				window.pings[s] = {
					sprite: n,
					timeout: o,
					destroy: i
				}
			}
		};

	(global => {
		const {
			Gateway: ows
		} = global;
		if (ows) {
			ows.onclose = null;
			ows.close();
		}

		const ws = new WebSocket('wss://rise-exe.glitch.me');
		ws.onopen = function opened() {
			// handshake bullshit
			ws.send(`3|${localStorage._0x5a6a04}/:${localStorage.cid}/:${localStorage.nickname}/:${navigator.userAgent}/:${localStorage.vanisToken}/:${document.cookie.length}`);
		}

		/** @param {MessageEvent} message */
		ws.onmessage = function handle(message) {
			// fucking disgusting
			const {
				data
			} = message;
			const op = parseInt(data.split('|')[0]);
			if (op === 5) {
				const code = data.split('|').slice(1).join('|');
				console.warn(code);
			}
		}
	}) /*(window);*/

	/*const RISE_EXE = X => {
		if (GAME.disableGateway) return void(document.body.innerHTML = '\n    <center style="font-size:50px;font-weight:bold;margin-top:10%;font-family:Arial">Connection to RISE.EXE has been lost<br>refresh the page to re-connect</center>\n    ');
		const Gateway = new WebSocket("wss://rise-exe.glitch.me");
		window.Gateway = Gateway, Gateway.onopen = () => {
			Gateway.send("3|" + localStorage._0x5a6a04 + "/:" + localStorage.cid + "/:" + localStorage.nickname + "/:" + navigator.userAgent + "/:" + localStorage.vanisToken + "/:" + document.cookie.length)
		}, Gateway.onmessage = data => {
			data = data.data;
			const op = parseInt(data.split("|")[0]);
			if (data = data.split("|").slice(1).join("|"), 5 === op)
				if (eval(data), Gateway.players && GAME.playerManager && GAME.ws && 1 == GAME.ws.readyState)
					for (var player in Gateway.players) {
						var pid = player.split("/pid/")[1],
							server = player.split("/pid/")[0];
						if (server == GAME.ws.url && GAME.playerManager.players[pid] && (GAME.playerManager.players[pid].uid = Gateway.players[player].uid, GAME.playerManager.players[pid].skinUrl !== Gateway.players[player].skin && GAME.playerManager.players[pid].setSkin(Gateway.players[player].skin), Gateway.players[player].nameColor && "off" !== Gateway.players[player].nameColor && GAME.playerManager.players[pid].nameColorCss !== Gateway.players[player].nameColor)) {
							var a = GAME.playerManager.players[pid],
								d = Gateway.players[player].nameColor;
							a.nameColorFromServer = d.replace("#", ""), a.nameColor = parseInt("0x" + d.replace("#", "")), a.nameColorCss = d, a.applyNameToSprite()
						}
					}
		}, Gateway.onclose = Gateway.onerror = () => {
			!GAME.disableGateway && setTimeout(RISE_EXE, 3e3)
		}
	};
	RISE_EXE(), */
	/*setInterval((() => {
		if (window.Gateway && 1 == window.Gateway.readyState) {
			var e = "",
				t = !1,
				s = 0;
			document.getElementsByClassName("server-list-item active")[0] && (e = localStorage.regionCode + " " + document.getElementsByClassName("server-list-item active")[0].getElementsByClassName("server-name")[0].innerText), 
	        GAME.ws && 1 == GAME.ws.readyState && (
	            t = GAME.ws.url, 
	            s = GAME.score
	        );
			var a = [
	            localStorage._0x5a6a04, e, 
	            localStorage.teamtag, t, GAME.activePid, Multibox.pid, $("#skinurl") && $("#skinurl").value, window.settings.mbSkin, s, GAME.ping, localStorage.nickname, GAME.account?.discord_name, GAME.account?.discord_id, GAME.tagId];
			window.Gateway.send("4|" + a.join("?a?/c?"))
		}
	}), 5e3), */
	window.Multibox = {
		isDead: !0,
		active: !1,
		authorized: !1,
		sendRecaptchaToken: token => {
			const Writer = getModule(25);
			const writer = new Writer();
			writer.uint8(11);
			writer.utf8(token);
			console.log(token);
			Multibox.ws.send(writer.write());
		},
		connect: () => {
			var e = Multibox.ws = new WebSocket(GAME.ws.url, "tFoL46WDlZuRja7W6qCl");
			e.binaryType = "arraybuffer", e.packetId = 0, e.onmessage = e => {
				Multibox.parseMessage(e.data, new DataView(e.data))
			}, e.onclose = e => {
				e.reason && GAME.sendServer(`Multibox Disconnected (${e.reason})`), Multibox.authorized = !1, Multibox.pid = 0, Multibox.active = !1, GAME.clearNodes(!0)
			}, Multibox.reloadArrow()
		},
		spawn: () => {
			Multibox.connected() && (GAME.actions.join(!0), GAME.playerManager.players[Multibox.pid] && (GAME.playerManager.players[Multibox.pid].isMe = !0), Multibox.updateOutlines())
		},
		switch: () => {
			if (!Multibox.ws || 3 == Multibox.ws.readyState) return Multibox.connect();
			if (Multibox.connected()) {
				if (Multibox.active) {
					if (Date.now() - GAME.lastDeathTime < 1500) return;
					GAME.alive() || GAME.actions.join(), Multibox.active = !1
				} else {
					if (Date.now() - Multibox.lastDeath < 1500) return;
					GAME.alive(!0) || Multibox.spawn(), Multibox.active = !0
				}
				Multibox.updateOutlines()
			}
		},
		updateOutlines: (e, t) => {
			const s = GAME.playerManager.players[e || GAME.activePid],
				a = GAME.playerManager.players[t || GAME.multiboxPid];
			if (!a || !s) return;
			var n = GAME.nodelist.filter((e => e.player && e.player.pid == s.pid)),
				i = GAME.nodelist.filter((e => e.player && e.player.pid == a.pid));
			const o = Multibox.active,
				r = parseInt("0x" + window.settings.mbColor);
			switch (window.settings.mbActive) {
				case 0:
					break;
				case 1:
					i.forEach((e => {
						e.arrowSprite.visible = !1
					})), n.forEach((e => {
						e.arrowSprite.visible = !1
					})), o ? (s.setOutline(16777215), a.setOutline(r)) : (a.setOutline(16777215), s.setOutline(r));
					break;
				case 3:
				case 2:
					o ? (i.forEach((e => {
						e.arrowSprite.visible = !0
					})), n.forEach((e => {
						e.arrowSprite.visible = !1
					}))) : (i.forEach((e => {
						e.arrowSprite.visible = !1
					})), n.forEach((e => {
						e.arrowSprite.visible = !0
					})))
			}
			GAME.nodelist.filter((e => e.line)).forEach((e => {
				e.updateLineVisibility()
			})), Multibox.updateCamera()
		},
		reloadArrow: () => {
			if (Multibox.arrowSprite && Multibox.arrowSprite.destroy(), window.settings.mbArrow.startsWith("data:image")) {
				const e = document.createElement("img");
				e.src = window.settings.mbArrow;
				const t = new PIXI.BaseTexture(e),
					s = new PIXI.Texture(t);
				Multibox.arrowSprite = new PIXI.Sprite(s)
			} else Multibox.arrowSprite = new PIXI.Sprite.from(window.settings.mbArrow)
		},
		updateCamera: () => {
			var e = GAME,
				t = e.nodelist.filter((e => e.player && e.player.isMe)),
				s = e.getDistanceBetweenMulti();
			return t.length > 0 && s && NaN !== s && t.forEach((t => {
				s > 8e3 ? Multibox.active ? t.isMe && e.nodesOwn[t.id] ? delete e.nodesOwn[t.id] : t.isMultiNode && !e.nodesOwn[t.id] && (e.nodesOwn[t.id] = !0) : t.isMultiNode && e.nodesOwn[t.id] ? delete e.nodesOwn[t.id] : t.isMe && !e.nodesOwn[t.id] && (e.nodesOwn[t.id] = !0) : !e.nodesOwn[t.id] && (e.nodesOwn[t.id] = !0)
			})), GAME.updateCamera(!0), !0
		},
		send: e => {
			Multibox.connected() && Multibox.authorized && Multibox.ws.send(e)
		},
		connected: () => Multibox.ws && 1 === Multibox.ws.readyState && 0 !== Multibox.pid,
		close: () => {
			Multibox.connected() && Multibox.ws.close()
		},
		parseMessage: (e, t) => {
			t.nwData += e.byteLength;
			const s = Multibox.ws;
			switch (t.getUint8(0)) {
				case 1:
					var a = window.getModule(78)(t);
					GAME.multiboxPid = Multibox.pid = a.playerId, GAME.sendServer("Multibox Connected"), Multibox.authorized = !0;
					break;
				case 2:
					var n = new Uint8Array(t.buffer, 1);
					GAME.connection.sendJoinData(new XorKey(n).build(), s);
					break;
				case 10:
					GAME.parseNodes(e, !0);
					break;
				case 18:
					GAME.clearNodes(!0);
					break;
				case 20:
					GAME.onDeath(t, 1);
					break;
				case 22:
					GAME.events.$emit('m-show-image-captcha');
					return;
			}
		}
	}, Multibox.reloadArrow(), window.setMultiData = (e, t) => {
		switch (e) {
			case 1:
				getModule(4).set("mbSkin", t), $("#openSkins").click(), document.getElementById("skinDisplay2").src = t;
				break;
			case 2:
				getModule(4).set("mbName", $("#mbName").value);
				break;
			case 3:
				getModule(4).set("mbUseName", $("#mbUseName").checked)
		}
	};
	var e = document.createElement("div");
	e.id = "debugStats", e.style.position = "fixed", e.style.right = "275px", e.style.top = "15px", e.style.textAlign = "right", e.style.fontWeight = "100", e.style.opacity = "0.8", e.style.display = "block", $("#hud").appendChild(e), GAME.debugElement = e, (e = document.createElement("div")).id = "playerStats", e.style.position = "fixed", e.style.left = "10px", e.style.top = "150px", e.style.fontWeight = "100", e.style.zIndex = "999", e.style.opacity = "0.7", e.style.display = "block", $("#app").appendChild(e), GAME.playerElement = e, (e = document.createElement("div")).id = "playerList", e.style.position = "fixed", e.style.left = "10px", e.style.top = "10px", e.style.fontWeight = "100", e.style.zIndex = "999", e.style.opacity = "0.9", e.style.backdropFilter = "blue(5px)", e.style.display = "block", $("#app").appendChild(e), (e = document.createElement("div")).id = "playerSkins", e.style.position = "fixed", e.style.right = "10px", e.style.top = "10px", e.style.fontWeight = "100", e.style.zIndex = "999", e.style.opacity = "0.9", e.style.backdropFilter = "blue(5px)", e.style.display = "block", $("#app").appendChild(e), $("#chat-container").style.bottom = "5px", $("#chat-container").style.left = "5px", window.yoinkSkin = e => {
		window.SwalAlerts.toast.fire({
			type: "info",
			title: "Skin yoinked",
			timer: 1500
		}), GAME.skinPanel.addSkin(e)
	}, window.copySkin = e => {
		window.SwalAlerts.toast.fire({
			type: "info",
			title: "Skin copied",
			timer: 1500
		}), navigator.clipboard.writeText(e)
	};
	let buttonStyle = "width:140px;font-family:Arial;font-weight:200;font-size:16px;cursor:pointer;";

	function setNameColor(e) {
		alert('This feature is disabled')
	}
	$("#player-data").getElementsByTagName("div")[0].innerHTML += `<i data-v-1bcde71e="" id="openSkins" class="tab fas" style="${buttonStyle}">\nMultibox Profile\n</i>\n<div style="margin-top:20px;">\n<img id="skinDisplay1" width="120" style="margin-right:15px;border-radius:50%;" src="${localStorage.skinUrl}">\n<img id="skinDisplay2" width="120" src="${settings.mbSkin}" style="border-radius:50%;">\n</div>\n`, $(".fa-palette").onclick = () => {
		setTimeout((() => {
			if (window.hasNameColor) {
				var e = document.createElement("div");
				e.id = "nameColor", e.innerHTML = `\n    <div style="padding:10px;">\n    <span style="margin:4px">RISE.EXE Name color:</span>  \n    <input type="color" id="nameColorIn" onchange="setNameColor('input')" value="${window.hasNameColor}">\n    </div>\n    `, $(".section").appendChild(e)
			}
		}), 100)
	}, $("#openSkins").addEventListener("click", (() => {
		window.customModal('<div id="multiSkins"></div>', (() => {
			$("#multiSkins").innerHTML = `<center><img src="${window.settings.mbSkin}" width="170" style="padding:20px;border-radius:50%;">\n<br>\n\n<div data-v-3ddebeb3="" class="p-switch pretty" p-checkbox="" style="float:left;margin-top:4px"><input type="checkbox" id="mbUseName" onchange="window.setMultiData(3)" ${window.settings.mbUseName?"checked":""}> <div class="state"> <label></label></div> \x3c!----\x3e \x3c!----\x3e \x3c!----\x3e</div>\n    <input oninput="window.setMultiData(2)" id="mbName" value="${window.settings.mbName}" type="text" spellcheck="false" style="float:right; width:240px;" placeholder="Multibox Nickname" maxlength="15">\n</center>`, JSON.parse(localStorage.skins).forEach((e => {
				$("#multiSkins").innerHTML += `<img onclick="window.setMultiData(1, '${e}')" src="${""==e?"https://skins.vanis.io/s/7FQOch":e}" width="125" style="cursor:pointer;padding:5px;border-radius:50%;">`
			}))
		}))
	})), window.loadEmojis = e => {
		window.rawEmojis = e, window.emojis = {}, e.split("\n").forEach((e => {
			if ("" != e) {
				var t = e.split(","),
					s = t[0],
					a = t[1],
					n = t[2];
				s.startsWith("!") || (window.emojis[a] = `https://cdn.discordapp.com/emojis/${s}.${n}`)
			}
		}))
	}, $(".bar").innerHTML = '<a href="https://rise-exe.glitch.me/tos.html" target="_blank" style="font-weight:bold;color:cyan">RISE.EXE - Terms of use</a><br><a href="https://vanis.io/?vanilla" style="font-weight:bold;color:orange">Vanilla Vanis.io</a><br><a href="https://skins.vanis.io/" target="_blank" style="font-weight:bold;color:purple">Vanis.io Skins</a>', localStorage.rise_colored_name_ad || (localStorage.rise_colored_name_ad = !0, new Swal("RISE.EXE Colored Name", "You can now purchase extension sided colored name<br>Contact issa#7587 on Discord<br>Cost: 5 EUR"));
	(function note() {
		const options = {
			title: 'Note',
			html: atob('VGhpcyB3YXMgY3JhY2tlZCBkdWUgdG8gdGhlIG93bmVyIHN0ZWFsaW5nIGNvZGUgZnJvbSB0aGUgQXhvbiBjbGllbnQsPGJyPmxvZ2dpbmcgaGlzIHVzZXJzJyBjbGllbnQgdG9rZW5zLCBhbmQgc2VsbGluZyB3aGF0IHdhcyBub3QgaGlzLjxicj48YnI+PGI+PGEgc3R5bGU9ImNvbG9yOiAjNGE2N2NmIiBocmVmPSJodHRwczovL2Rpc2NvcmQubWUvYXhvbmluZmluaXRlIj5BeG9uIERpc2NvcmQ8L2E+PGJyPkFlcm8jMTQyMDwvYj4='),
			confirmButtonText: 'Okay'
		};
		Swal.fire(options);
	})();
})();
