	
	/**
	* DD_belatedPNG: Adds IE6 support: PNG images for CSS background-image and HTML <IMG/>.
	* Author: Drew Diller
	* Email: drew.diller@gmail.com
	* URL: http://www.dillerdesign.com/experiment/DD_belatedPNG/
	* Version: 0.0.8a
	* Licensed under the MIT License: http://dillerdesign.com/experiment/DD_belatedPNG/#license
	*
	* Example usage:
	* DD_belatedPNG.fix('.png_bg'); // argument is a CSS selector
	* DD_belatedPNG.fixPng( someNode ); // argument is an HTMLDomElement
	**/

	/*
	PLEASE READ:
	Absolutely everything in this script is SILLY.  I know this.  IE's rendering of certain pixels doesn't make sense, so neither does this code!
	*/
	var DD_belatedPNG = {
		ns: 'DD_belatedPNG',
		imgSize: {},
		delay: 10,
		nodesFixed: 0,
		createVmlNameSpace: function () { /* enable VML */
			if (document.namespaces && !document.namespaces[this.ns]) {
				document.namespaces.add(this.ns, 'urn:schemas-microsoft-com:vml');
			}
		},
		createVmlStyleSheet: function () { /* style VML, enable behaviors */
			/*
				Just in case lots of other developers have added
				lots of other stylesheets using document.createStyleSheet
				and hit the 31-limit mark, let's not use that method!
				further reading: http://msdn.microsoft.com/en-us/library/ms531194(VS.85).aspx
			*/
			
			var screenStyleSheet, printStyleSheet;
			screenStyleSheet = document.createElement('style');
			screenStyleSheet.setAttribute('media', 'screen');
			document.documentElement.firstChild.insertBefore(screenStyleSheet, document.documentElement.firstChild.firstChild);
			if (screenStyleSheet.styleSheet) {
				screenStyleSheet = screenStyleSheet.styleSheet;
				screenStyleSheet.addRule(this.ns + '\\:*', '{behavior:url(#default#VML)}');
				screenStyleSheet.addRule(this.ns + '\\:shape', 'position:absolute;');
				screenStyleSheet.addRule('img.' + this.ns + '_sizeFinder', 'behavior:none; border:none; position:absolute; z-index:-1; top:-10000px; visibility:hidden;'); /* large negative top value for avoiding vertical scrollbars for large images, suggested by James O'Brien, http://www.thanatopsic.org/hendrik/ */
				this.screenStyleSheet = screenStyleSheet;

				/* Add a print-media stylesheet, for preventing VML artifacts from showing up in print (including preview). */
				/* Thanks to Rémi Prévost for automating this! */
				printStyleSheet = document.createElement('style');
				printStyleSheet.setAttribute('media', 'print');
				document.documentElement.firstChild.insertBefore(printStyleSheet, document.documentElement.firstChild.firstChild);
				printStyleSheet = printStyleSheet.styleSheet;
				printStyleSheet.addRule(this.ns + '\\:*', '{display: none !important;}');
				printStyleSheet.addRule('img.' + this.ns + '_sizeFinder', '{display: none !important;}');
			}
		},
		readPropertyChange: function () {
			var el, display, v;
			el = event.srcElement;
			if (!el.vmlInitiated) {
				return;
			}
			if (event.propertyName.search('background') != -1 || event.propertyName.search('border') != -1) {
				DD_belatedPNG.applyVML(el);
			}
			if (event.propertyName == 'style.display') {
				display = (el.currentStyle.display == 'none') ? 'none' : 'block';
				for (v in el.vml) {
					if (el.vml.hasOwnProperty(v)) {
						el.vml[v].shape.style.display = display;
					}
				}
			}
			if (event.propertyName.search('filter') != -1) {
				DD_belatedPNG.vmlOpacity(el);
			}
		},
		vmlOpacity: function (el) {
			if (el.currentStyle.filter.search('lpha') != -1) {
				var trans = el.currentStyle.filter;
				trans = parseInt(trans.substring(trans.lastIndexOf('=')+1, trans.lastIndexOf(')')), 10)/100;
				el.vml.color.shape.style.filter = el.currentStyle.filter; /* complete guesswork */
				el.vml.image.fill.opacity = trans; /* complete guesswork */
			}
		},
		handlePseudoHover: function (el) {
			setTimeout(function () { /* wouldn't work as intended without setTimeout */
				DD_belatedPNG.applyVML(el);
			}, 1);
		},
		/**
		* This is the method to use in a document.
		* @param {String} selector - REQUIRED - a CSS selector, such as '#doc .container'
		**/
		fix: function (selector) {
			if (this.screenStyleSheet) {
				var selectors, i;
				selectors = selector.split(','); /* multiple selectors supported, no need for multiple calls to this anymore */
				for (i=0; i<selectors.length; i++) {
					this.screenStyleSheet.addRule(selectors[i], 'behavior:expression(DD_belatedPNG.fixPng(this))'); /* seems to execute the function without adding it to the stylesheet - interesting... */
				}
			}
		},
		applyVML: function (el) {
			el.runtimeStyle.cssText = '';
			this.vmlFill(el);
			this.vmlOffsets(el);
			this.vmlOpacity(el);
			if (el.isImg) {
				this.copyImageBorders(el);
			}
		},
		attachHandlers: function (el) {
			var self, handlers, handler, moreForAs, a, h;
			self = this;
			handlers = {resize: 'vmlOffsets', move: 'vmlOffsets'};
			if (el.nodeName == 'A') {
				moreForAs = {mouseleave: 'handlePseudoHover', mouseenter: 'handlePseudoHover', focus: 'handlePseudoHover', blur: 'handlePseudoHover'};
				for (a in moreForAs) {			
					if (moreForAs.hasOwnProperty(a)) {
						handlers[a] = moreForAs[a];
					}
				}
			}
			for (h in handlers) {
				if (handlers.hasOwnProperty(h)) {
					handler = function () {
						self[handlers[h]](el);
					};
					el.attachEvent('on' + h, handler);
				}
			}
			el.attachEvent('onpropertychange', this.readPropertyChange);
		},
		giveLayout: function (el) {
			el.style.zoom = 1;
			if (el.currentStyle.position == 'static') {
				el.style.position = 'relative';
			}
		},
		copyImageBorders: function (el) {
			var styles, s;
			styles = {'borderStyle':true, 'borderWidth':true, 'borderColor':true};
			for (s in styles) {
				if (styles.hasOwnProperty(s)) {
					el.vml.color.shape.style[s] = el.currentStyle[s];
				}
			}
		},
		vmlFill: function (el) {
			if (!el.currentStyle) {
				return;
			} else {
				var elStyle, noImg, lib, v, img, imgLoaded;
				elStyle = el.currentStyle;
			}
			for (v in el.vml) {
				if (el.vml.hasOwnProperty(v)) {
					el.vml[v].shape.style.zIndex = elStyle.zIndex;
				}
			}
			el.runtimeStyle.backgroundColor = '';
			el.runtimeStyle.backgroundImage = '';
			noImg = true;
			if (elStyle.backgroundImage != 'none' || el.isImg) {
				if (!el.isImg) {
					el.vmlBg = elStyle.backgroundImage;
					el.vmlBg = el.vmlBg.substr(5, el.vmlBg.lastIndexOf('")')-5);
				}
				else {
					el.vmlBg = el.src;
				}
				lib = this;
				if (!lib.imgSize[el.vmlBg]) { /* determine size of loaded image */
					img = document.createElement('img');
					lib.imgSize[el.vmlBg] = img;
					img.className = lib.ns + '_sizeFinder';
					img.runtimeStyle.cssText = 'behavior:none; position:absolute; left:-10000px; top:-10000px; border:none; margin:0; padding:0;'; /* make sure to set behavior to none to prevent accidental matching of the helper elements! */
					imgLoaded = function () {
						this.width = this.offsetWidth; /* weird cache-busting requirement! */
						this.height = this.offsetHeight;
						lib.vmlOffsets(el);
					};
					img.attachEvent('onload', imgLoaded);
					img.src = el.vmlBg;
					img.removeAttribute('width');
					img.removeAttribute('height');
					document.body.insertBefore(img, document.body.firstChild);
				}
				el.vml.image.fill.src = el.vmlBg;
				noImg = false;
			}
			el.vml.image.fill.on = !noImg;
			el.vml.image.fill.color = 'none';
			el.vml.color.shape.style.backgroundColor = elStyle.backgroundColor;
			el.runtimeStyle.backgroundImage = 'none';
			el.runtimeStyle.backgroundColor = 'transparent';
		},
		/* IE can't figure out what do when the offsetLeft and the clientLeft add up to 1, and the VML ends up getting fuzzy... so we have to push/enlarge things by 1 pixel and then clip off the excess */
		vmlOffsets: function (el) {
			var thisStyle, size, fudge, makeVisible, bg, bgR, dC, altC, b, c, v;
			thisStyle = el.currentStyle;
			size = {'W':el.clientWidth+1, 'H':el.clientHeight+1, 'w':this.imgSize[el.vmlBg].width, 'h':this.imgSize[el.vmlBg].height, 'L':el.offsetLeft, 'T':el.offsetTop, 'bLW':el.clientLeft, 'bTW':el.clientTop};
			fudge = (size.L + size.bLW == 1) ? 1 : 0;
			/* vml shape, left, top, width, height, origin */
			makeVisible = function (vml, l, t, w, h, o) {
				vml.coordsize = w+','+h;
				vml.coordorigin = o+','+o;
				vml.path = 'm0,0l'+w+',0l'+w+','+h+'l0,'+h+' xe';
				vml.style.width = w + 'px';
				vml.style.height = h + 'px';
				vml.style.left = l + 'px';
				vml.style.top = t + 'px';
			};
			makeVisible(el.vml.color.shape, (size.L + (el.isImg ? 0 : size.bLW)), (size.T + (el.isImg ? 0 : size.bTW)), (size.W-1), (size.H-1), 0);
			makeVisible(el.vml.image.shape, (size.L + size.bLW), (size.T + size.bTW), (size.W), (size.H), 1 );
			bg = {'X':0, 'Y':0};
			if (el.isImg) {
				bg.X = parseInt(thisStyle.paddingLeft, 10) + 1;
				bg.Y = parseInt(thisStyle.paddingTop, 10) + 1;
			}
			else {
				for (b in bg) {
					if (bg.hasOwnProperty(b)) {
						this.figurePercentage(bg, size, b, thisStyle['backgroundPosition'+b]);
					}
				}
			}
			el.vml.image.fill.position = (bg.X/size.W) + ',' + (bg.Y/size.H);
			bgR = thisStyle.backgroundRepeat;
			dC = {'T':1, 'R':size.W+fudge, 'B':size.H, 'L':1+fudge}; /* these are defaults for repeat of any kind */
			altC = { 'X': {'b1': 'L', 'b2': 'R', 'd': 'W'}, 'Y': {'b1': 'T', 'b2': 'B', 'd': 'H'} };
			if (bgR != 'repeat' || el.isImg) {
				c = {'T':(bg.Y), 'R':(bg.X+size.w), 'B':(bg.Y+size.h), 'L':(bg.X)}; /* these are defaults for no-repeat - clips down to the image location */
				if (bgR.search('repeat-') != -1) { /* now let's revert to dC for repeat-x or repeat-y */
					v = bgR.split('repeat-')[1].toUpperCase();
					c[altC[v].b1] = 1;
					c[altC[v].b2] = size[altC[v].d];
				}
				if (c.B > size.H) {
					c.B = size.H;
				}
				el.vml.image.shape.style.clip = 'rect('+c.T+'px '+(c.R+fudge)+'px '+c.B+'px '+(c.L+fudge)+'px)';
			}
			else {
				el.vml.image.shape.style.clip = 'rect('+dC.T+'px '+dC.R+'px '+dC.B+'px '+dC.L+'px)';
			}
		},
		figurePercentage: function (bg, size, axis, position) {
			var horizontal, fraction;
			fraction = true;
			horizontal = (axis == 'X');
			switch(position) {
				case 'left':
				case 'top':
					bg[axis] = 0;
					break;
				case 'center':
					bg[axis] = 0.5;
					break;
				case 'right':
				case 'bottom':
					bg[axis] = 1;
					break;
				default:
					if (position.search('%') != -1) {
						bg[axis] = parseInt(position, 10) / 100;
					}
					else {
						fraction = false;
					}
			}
			bg[axis] = Math.ceil(  fraction ? ( (size[horizontal?'W': 'H'] * bg[axis]) - (size[horizontal?'w': 'h'] * bg[axis]) ) : parseInt(position, 10)  );
			if (bg[axis] % 2 === 0) {
				bg[axis]++;
			}
			return bg[axis];
		},
		fixPng: function (el) {
			el.style.behavior = 'none';
			var lib, els, nodeStr, v, e;
			if (el.nodeName == 'BODY' || el.nodeName == 'TD' || el.nodeName == 'TR') { /* elements not supported yet */
				return;
			}
			el.isImg = false;
			if (el.nodeName == 'IMG') {
				if(el.src.toLowerCase().search(/\.png$/) != -1) {
					el.isImg = true;
					el.style.visibility = 'hidden';
				}
				else {
					return;
				}
			}
			else if (el.currentStyle.backgroundImage.toLowerCase().search('.png') == -1) {
				return;
			}
			lib = DD_belatedPNG;
			el.vml = {color: {}, image: {}};
			els = {shape: {}, fill: {}};
			for (v in el.vml) {
				if (el.vml.hasOwnProperty(v)) {
					for (e in els) {
						if (els.hasOwnProperty(e)) {
							nodeStr = lib.ns + ':' + e;
							el.vml[v][e] = document.createElement(nodeStr);
						}
					}
					el.vml[v].shape.stroked = false;
					el.vml[v].shape.appendChild(el.vml[v].fill);
					el.parentNode.insertBefore(el.vml[v].shape, el);
				}
			}
			el.vml.image.shape.fillcolor = 'none'; /* Don't show blank white shapeangle when waiting for image to load. */
			el.vml.image.fill.type = 'tile'; /* Makes image show up. */
			el.vml.color.fill.on = false; /* Actually going to apply vml element's style.backgroundColor, so hide the whiteness. */
			lib.attachHandlers(el);
			lib.giveLayout(el);
			lib.giveLayout(el.offsetParent);
			el.vmlInitiated = true;
			lib.applyVML(el); /* Render! */
		}
	};
	try {
		document.execCommand("BackgroundImageCache", false, true); /* TredoSoft Multiple IE doesn't like this, so try{} it */
	} catch(r) {}
	DD_belatedPNG.createVmlNameSpace();
	DD_belatedPNG.createVmlStyleSheet();	
	
	
	/**
	* Author: Bruno Marques - MKT VIRTUAL
	* Email: bruno@mktvirtual.com.br
	* URL: http://github.com/brunomarks/updatebrowser
	* Version: 1.0
	* Licensed under the MIT License
	* usage: include js - http://github.com/brunomarks/updatebrowser/raw/master/deprecated_browsers.js
	* call function deprecated to init, - deprecated('color'); where color = hexadecimal string;
	**/	
	
var deprecated_browser = {
	
	closeDeprecated: function(){
		document.getElementById("deprecated_browser").style.display = 'none';
		deprecated_browser.setCookie('deprecated_browser','jabulani',2);
		if(document.getElementById("about_deprecated_browser"))deprecated_browser.closeFancy();
	},
	closeFancy:function(){
		document.getElementById("about_deprecated_browser").style.display = 'none';
	},
	aboutDeprecated:function(){
		colorBg = document.getElementById("deprecated_browser").style.backgroundColor;
		colorText = document.getElementById("deprecated_browser").style.color;

		var about_deprecated_browser  = document.createElement('div');	
		about_deprecated_browser.style.backgroundColor = colorBg;
			document.body.prependChild = function(newChild) {
				this.insertBefore(newChild, this.firstChild);
				};
			document.body.prependChild(about_deprecated_browser);	
			about_deprecated_browser.setAttribute('id', 'about_deprecated_browser');
			about_deprecated_browser.innerHTML = "<div id='content_deprecated_browser'><a href='#' onClick='deprecated_browser.closeFancy()' id='close_about_deprecated_browser'><img src='http://github.com/brunomarks/updatebrowser/raw/master/images/xis.png' alt='Fechar' /></a><p class='tit_deprecated_browser'>Por que devo atualizar?</p><p id='description_deprecated_browser'>Os navegadores antigos, como o <strong>Internet Explorer 6</strong>, possuem sérios problemas de segurança e não são compatíveis com muitas funcionalidades dos sites atuais. Por isso, para ter uma melhor experiência de navegação e evitar riscos com vírus e programas espiões, baixe gratuitamente e instale no seu computador um dos navegadores modernos disponíveis.</p><p class='tit_deprecated_browser'>Atualize-o gratuitamente já!</p><ul><li><a target='blank' href='http://br.mozdev.org'><img src='http://github.com/brunomarks/updatebrowser/raw/master/images/firefox_b.png' alt='Download Firefox' /></a></li><li><a target='blank' href='http://www.microsoft.com/brasil/windows/internet-explorer'><img src='http://github.com/brunomarks/updatebrowser/raw/master/images/ie_b.png' alt='Download Internet Explorer' /></a></li><li><a target='blank' href='http://www.google.com.br/chrome'><img src='http://github.com/brunomarks/updatebrowser/raw/master/images/chrome_b.png' alt='Download Chrome' /></a></li>						<li><a target='blank' href='http://www.apple.com/br/safari'><img src='http://github.com/brunomarks/updatebrowser/raw/master/images/safari_b.png' alt='Download Safari' /></a></li></ul></div>"
							
			document.getElementById("about_deprecated_browser").style.backgroundColor = colorBg;
			var box_deprecated_browser = document.getElementById("content_deprecated_browser").getElementsByTagName('p');				
			for (var i = 0; i <= box_deprecated_browser.length; i++){
				var k = document.getElementById("content_deprecated_browser").childNodes[i];
				k.style.color = colorText;
			};
	},
	getCookie:function(c_name){
		if (document.cookie.length>0){
			c_start=document.cookie.indexOf(c_name + "=");
			if (c_start!=-1){ 
				c_start=c_start + c_name.length+1 ;
				c_end=document.cookie.indexOf(";",c_start);
				if (c_end==-1) c_end=document.cookie.length
				return unescape(document.cookie.substring(c_start,c_end));
			} 
		}
		return false;
	},
	setCookie:function(c_name,value,expiredays){
		var exdate=new Date();
		exdate.setDate(exdate.getDate()+expiredays);
		document.cookie=c_name+ "=" +escape(value)+((expiredays==null) ? "" : "; expires="+exdate.toUTCString());
	},
	checkCookie:function() {
		var cookie_deprecated = deprecated_browser.getCookie('deprecated_browser');
		if (cookie_deprecated!=null && cookie_deprecated!="") {
			return true;
		}
		else {
			cookie_deprecated='jabulani';
			if (cookie_deprecated!=null && cookie_deprecated!=""){
				deprecated_browser.setCookie('deprecated_browser',cookie_deprecated,2);
			}
			return false;
		}
	},
	
	init : function(colorBg, colorText) {
		
		var lg = 'pt'
		switch(lg){
			case 'pt':
			console.log('pttttt');
		}
		
		if (this.getCookie('deprecated_browser').length > 0) 
			return false;
				
		var headID = document.getElementsByTagName("head")[0];         
		var cssNode = document.createElement('link');
		cssNode.type = 'text/css';
		cssNode.rel = 'stylesheet';
		cssNode.href = 'http://github.com/brunomarks/updatebrowser/raw/master/deprecated_browsers.css';
		cssNode.media = 'screen';
		headID.appendChild(cssNode);
		
		if (document.createElement){
			document.body.prependChild = function(newChild) {
				this.insertBefore(newChild, this.firstChild);
				};		
			var deprecated_browser = document.createElement('div');
			deprecated_browser.setAttribute('id', 'deprecated_browser');
			document.body.prependChild(deprecated_browser);	
			deprecated_browser.style.backgroundColor = colorBg;
			deprecated_browser.style.color = colorText;
			var middle = document.createElement('div');
			middle.setAttribute('id', 'deprecated_owner');
			middle.style.margin = '0 auto';
			middle.style.position = 'relative';
			middle.style.width = '778px';
		
			deprecated_browser.appendChild(middle);

			var leftSide = document.createElement('div');
			var rightSide = document.createElement('div');
			leftSide.setAttribute('id', 'left_deprecated');
			rightSide.setAttribute('id', 'right_deprecated');
			rightSide.innerHTML = '<a href="http://br.mozdev.org" class="deprecated_icon" deprecated_browser="blank"><img src="http://github.com/brunomarks/updatebrowser/raw/master/images/firefox.png" alt="Firefox" /></a><a href="http://www.microsoft.com/brasil/windows/internet-explorer" class="deprecated_icon" deprecated_browser="blank"><img src="http://github.com/brunomarks/updatebrowser/raw/master/images/ie.png" alt="Internet Explorer" /></a><a href="http://www.google.com.br/chrome" class="deprecated_icon" deprecated_browser="blank"><img src="http://github.com/brunomarks/updatebrowser/raw/master/images/chrome.png" alt="Chrome" /></a><a href="http://www.apple.com/br/safari" class="deprecated_icon" deprecated_browser="blank"><img src="http://github.com/brunomarks/updatebrowser/raw/master/images/safari.png" alt="Safari" /></a><a href="#" onClick="deprecated_browser.closeDeprecated()" id="close_deprecated"><img src="http://github.com/brunomarks/updatebrowser/raw/master/images/xis.png" alt="Fechar" /></a>';
			middle.appendChild(rightSide);			
			middle.appendChild(leftSide);

			var logos = rightSide.getElementsByTagName('a');
			for (var i = logos.length - 1; i >= 0; i--){
				var k = rightSide.getElementsByTagName('a')[i];
				var imageAlpha = k.firstChild;
				imageAlpha.setAttribute('class', 'deprecated_browser_icob');
				};
			var closeButton = document.getElementById('close_deprecated');
			DD_belatedPNG.fix('img');
			var info = document.createElement('p');
			var readMoore = document.createElement('p');

			info.setAttribute('id', 'info_deprecated');
			info.style.color = readMoore.style.color = colorText;			
			readMoore.setAttribute('id', 'info_moore_deprecated');
			info.innerHTML = 'Seu navegador é antigo e possui sérias falhas de segurança.';
			readMoore.innerHTML = 'Atualize-o gratuitamente por um dos navegadores ao lado. <a id="read_moore_link" href="#" onClick="deprecated_browser.aboutDeprecated();">Saiba mais</a>';
			leftSide.appendChild(info);	
			leftSide.appendChild(readMoore);			
			document.getElementById('read_moore_link').style.color = colorText;
			
		}
	}
}
