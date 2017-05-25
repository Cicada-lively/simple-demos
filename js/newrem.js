!function() {
	var a = "@charset \"utf-8\";*{box-sizing: border-box;}html{overflow-y:scroll;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}html *{outline:0;-webkit-text-size-adjust:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}html,body{font-family:sans-serif}body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,textarea,p,blockquote,th,td,hr,button,article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{margin:0;padding:0}input,button,textarea{-webkit-appearance: none;}input,select,textarea{font-size:100%}table{border-collapse:collapse;border-spacing:0}fieldset,img{border:0}abbr,acronym{border:0;font-variant:normal}del{text-decoration:line-through}address,caption,cite,code,dfn,em,th,var{font-style:normal;font-weight:500}ol,ul{list-style:none}caption,th{text-align:left}h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:500}q:before,q:after{content:''}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}a:hover{text-decoration:underline}ins,a{text-decoration:none}table{ border-collapse: collapse;border-spacing: 0;margin: 0;padding: 0;}.clearfix:after{content: '.';display: block;height: 0;clear: both;visibility: hidden;}",//这个是css中的一些默认样式
	b = document.createElement("style");   //创建样式
	if (document.getElementsByTagName("head")[0].appendChild(b), b.styleSheet) b.styleSheet.disabled || (b.styleSheet.cssText = a);
	else try {
		b.innerHTML = a
	} catch(c) {
		b.innerText = a
	}
} (); 
!function(a, b) {
	function c() {
		var b = f.getBoundingClientRect().width;
		b / i > 750 && (b = 750 * i);
		var c = b / 10;
		f.style.fontSize = c + "px",
		k.rem = a.rem = c
	}
	var d, e = a.document,
	f = e.documentElement,
	g = e.querySelector('meta[name="viewport"]'),
	h = e.querySelector('meta[name="flexible"]'),
	i = 0,
	j = 0,
	k = b.flexible || (b.flexible = {});
	if (g) {
		console.warn("将根据已有的meta标签来设置缩放比例");
		var l = g.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
		l && (j = parseFloat(l[1]), i = parseInt(1 / j))
	} else if (h) {
		var m = h.getAttribute("content");
		if (m) {
			var n = m.match(/initial\-dpr=([\d\.]+)/),
			o = m.match(/maximum\-dpr=([\d\.]+)/);
			n && (i = parseFloat(n[1]), j = parseFloat((1 / i).toFixed(2))),
			o && (i = parseFloat(o[1]), j = parseFloat((1 / i).toFixed(2)))
		}
	}
	if (!i && !j) {
		var p = (a.navigator.appVersion.match(/android/gi), a.navigator.appVersion.match(/iphone/gi)),
		q = a.devicePixelRatio;
		i = p ? q >= 3 && (!i || i >= 3) ? 3 : q >= 2 && (!i || i >= 2) ? 2 : 1 : 1,
		j = 1 / i
	}
	if (f.setAttribute("data-dpr", i), !g) if (g = e.createElement("meta"), g.setAttribute("name", "viewport"), g.setAttribute("content", "initial-scale=" + j + ", maximum-scale=" + j + ", minimum-scale=" + j + ", user-scalable=no"), f.firstElementChild) f.firstElementChild.appendChild(g);
	else {
		var r = e.createElement("div");
		r.appendChild(g),
		e.write(r.innerHTML)
	}
	a.addEventListener("resize",
	function() {
		clearTimeout(d),
		d = setTimeout(c, 300)
	},!1),
	a.addEventListener("pageshow",
	function(a) {
		a.persisted && (clearTimeout(d), d = setTimeout(c, 300))
	},!1),
	"complete" === e.readyState ? e.body.style.fontSize = 12 * i + "px": e.addEventListener("DOMContentLoaded",
	function() {
		e.body.style.fontSize = 12 * i + "px"
	},!1),
	c(),
	k.dpr = a.dpr = i,
	k.refreshRem = c,
	k.rem2px = function(a) {
		var b = parseFloat(a) * this.rem;
		return "string" == typeof a && a.match(/rem$/) && (b += "px"),
		b
	},
	k.px2rem = function(a) {
		var b = parseFloat(a) / this.rem;
		return "string" == typeof a && a.match(/px$/) && (b += "rem"),
		b
	}
} (window, window.lib || (window.lib = {}));



// function(e, t, i) {
// 	"use strict";

// 	function n() {
// 		var e = c.getBoundingClientRect().width,
// 			t = 375,
// 			i = 37.5,
// 			n = e / (t / i);
// 		c.style.fontSize = n + "px", p.rem = a.rem = n
// 	}
// 	function r() {
// 		l.body && (l.body.style.fontSize = 12 * h + "px")
// 	}
// 	i(98);
// 	var o, a = window,
// 		s = {},
// 		l = a.document,
// 		c = l.documentElement,
// 		u = l.querySelector('meta[name="viewport"]'),
// 		d = l.querySelector('meta[name="flexible"]'),
// 		h = 0,
// 		f = 0,
// 		p = s.flexible || (s.flexible = {});
// 	if (u) {
// 		console.warn("将根据已有的meta标签来设置缩放比例");
// 		var m = u.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
// 		m && (f = parseFloat(m[1]), h = parseInt(1 / f))
// 	} else if (d) {
// 		var v = d.getAttribute("content");
// 		if (v) {
// 			var g = v.match(/initial\-dpr=([\d\.]+)/),
// 				y = v.match(/maximum\-dpr=([\d\.]+)/);
// 			g && (h = parseFloat(g[1]), f = parseFloat((1 / h).toFixed(2))), y && (h = parseFloat(y[1]), f = parseFloat((1 / h).toFixed(2)))
// 		}
// 	}
// 	if (!h && !f) {
// 		var b = (a.navigator.appVersion.match(/android/gi), a.navigator.appVersion.match(/iphone/gi)),
// 			w = a.devicePixelRatio;
// 		h = b ? w >= 3 && (!h || h >= 3) ? 3 : w >= 2 && (!h || h >= 2) ? 2 : 1 : 1, f = 1 / h
// 	}
// 	if (c.setAttribute("data-dpr", h), !u) if (u = l.createElement("meta"), u.setAttribute("name", "viewport"), u.setAttribute("content", "initial-scale=" + f + ", maximum-scale=" + f + ", minimum-scale=" + f + ", user-scalable=no"), c.firstElementChild) c.firstElementChild.appendChild(u);
// 	else {
// 		var x = l.createElement("div");
// 		x.appendChild(u), l.write(x.innerHTML)
// 	}
// 	a.addEventListener("resize", function() {
// 		clearTimeout(o), o = setTimeout(n, 300)
// 	}, !1), a.addEventListener("pageshow", function(e) {
// 		e.persisted && (clearTimeout(o), o = setTimeout(n, 300))
// 	}, !1), "complete" === l.readyState ? r() : l.addEventListener("DOMContentLoaded", r, !1), n(), r(), p.init = r, p.dpr = a.dpr = h, p.refreshRem = n, p.rem2px = function(e) {
// 		var t = parseFloat(e) * this.rem;
// 		return "string" == typeof e && e.match(/rem$/) && (t += "px"), t
// 	}, p.px2rem = function(e) {
// 		var t = parseFloat(e) / this.rem;
// 		return "string" == typeof e && e.match(/px$/) && (t += "rem"), t
// 	}, e.exports = p
// }
