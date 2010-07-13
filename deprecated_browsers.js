/**
* Author: Bruno Marques - MKT VIRTUAL
* Email: bruno@mktvirtual.com.br
* URL: http://github.com/brunomarks/updatebrowser
* Version: 1.0
* Licensed under the MIT License
* usage: include js - http://github.com/mktvirtual/Deprecated-Browser/raw/multi-language/deprecated_browsers.js
* call function deprecated to init, - deprecated('color'); where color = hexadecimal string;
**/	
var language;
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
		var arrLanguage = this.language(language);

		var about_deprecated_browser  = document.createElement('div');	
		about_deprecated_browser.style.backgroundColor = colorBg;
		document.body.prependChild = function(newChild) {
			this.insertBefore(newChild, this.firstChild);
		};

		//arr.push({title_intro:title_intro, desc_intro:desc_intro, mooreinfo:mooreinfo, title_splash:title_splash, description_splash:description_splash, invite_splash:invite_splash});	
		document.body.prependChild(about_deprecated_browser);	
		about_deprecated_browser.setAttribute('id', 'about_deprecated_browser');
		about_deprecated_browser.innerHTML = "<div id='content_deprecated_browser'><a href='#' onClick='deprecated_browser.closeFancy()' id='close_about_deprecated_browser'><img src='http://github.com/mktvirtual/Deprecated-Browser/raw/multi-language/images/xis.png' alt='Fechar' /></a><p class='tit_deprecated_browser'>" + arrLanguage[0].title_splash + "</p><p id='description_deprecated_browser'>"+ arrLanguage[0].description_splash +"</p><p class='tit_deprecated_browser'>"+ arrLanguage[0].invite_splash +"</p><ul><li><a target='blank' href='http://br.mozdev.org'><img src='http://github.com/mktvirtual/Deprecated-Browser/raw/multi-language/images/firefox_b.png' alt='Download Firefox' /></a></li><li><a target='blank' href='http://www.microsoft.com/brasil/windows/internet-explorer'><img src='http://github.com/mktvirtual/Deprecated-Browser/raw/multi-language/images/ie_b.png' alt='Download Internet Explorer' /></a></li><li><a target='blank' href='http://www.google.com.br/chrome'><img src='http://github.com/mktvirtual/Deprecated-Browser/raw/multi-language/images/chrome_b.png' alt='Download Chrome' /></a></li>						<li><a target='blank' href='http://www.apple.com/br/safari'><img src='http://github.com/mktvirtual/Deprecated-Browser/raw/multi-language/images/safari_b.png' alt='Download Safari' /></a></li></ul></div>"

		document.getElementById("about_deprecated_browser").style.backgroundColor = colorBg;
		var box_deprecated_browser = document.getElementById("content_deprecated_browser").getElementsByTagName('p');				
		for (var i = 0; i <= box_deprecated_browser.length; i++){
			var k = document.getElementById("content_deprecated_browser").childNodes[i];
			k.style.color = colorText;
		};
		var img = document.getElementById("content_deprecated_browser").getElementsByTagName('img');
		this.fix(img);
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
	fix : function(imagens){				
		var arVersion = navigator.appVersion.split("MSIE");
		var version = parseFloat(arVersion[1]);			
		if ((version >= 5.5) && (document.body.filters)) 
		{
			for(var i=0; i<imagens.length; i++)
			{
				var img = imagens[i];
				var imgName = img.src.toUpperCase()
				if (imgName.substring(imgName.length-3, imgName.length) == "PNG")
				{
					var imgID = (img.id) ? "id='" + img.id + "' " : ""
					var imgClass = (img.className) ? "class='" + img.className + "' " : ""
					var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' "
					var imgStyle = "display:inline-block;" + img.style.cssText 
					if (img.align == "left") imgStyle = "float:left;" + imgStyle
					if (img.align == "right") imgStyle = "float:right;" + imgStyle
					if (img.parentElement.href) imgStyle = "cursor:hand;" + imgStyle
					var strNewHTML = "<span " + imgID + imgClass + imgTitle
					+ " style=\"" + "width:" + img.width + "px; height:" + img.height + "px;" + imgStyle + ";"
					+ "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader"
					+ "(src=\'" + img.src + "\', sizingMethod='scale');\"></span>" 
					img.outerHTML = strNewHTML
					i = i-1
				}
			}
		}
	},		
	language : function(language){
		arr = new Array();
		var title_intro, desc_intro, mooreinfo, title_splash, description_splash, invite_splash;
		switch(language){
			case 'pt':
			title_intro = 'Seu navegador é antigo e possui sérias falhas de segurança.';
			desc_intro = 'Atualize-o gratuitamente por um dos navegadores ao lado.';
			mooreinfo = 'Saiba mais';
			title_splash = 'Por que devo atualizar?';
			description_splash = 'Os navegadores antigos, como o <strong>Internet Explorer 6</strong>, possuem sérios problemas de segurança e não são compatíveis com muitas funcionalidades dos sites atuais. Por isso, para ter uma melhor experiência de navegação e evitar riscos com vírus e programas espiões, baixe gratuitamente e instale no seu computador um dos navegadores modernos disponíveis.';
			invite_splash = 'Atualize-o gratuitamente já!'
			arr.push({title_intro:title_intro, desc_intro:desc_intro, mooreinfo:mooreinfo, title_splash:title_splash, description_splash:description_splash, invite_splash:invite_splash});
			break;
			case 'es':
			title_intro = 'Su navegador es una versión vieja y tiene graves fallas de seguridad.';
			desc_intro = 'Actualícelo gratuitamente con uno de los navegadores al lado.';
			mooreinfo = 'Saber mas';
			title_splash = '¿Por qué actualizar?';
			description_splash = 'Las versiones anteriores de navegadores, como el <strong>Internet Explorer 6</strong>, presentan graves problemas de seguridad y son incompatibles con muchas funcionalidades de los sitios actuales. Por eso, para tener una experiencia de navegación mejor y evitar riesgos de virus y programas espías, descargue gratuitamente e instale en su computadora uno de los navegadores modernos disponibles.';
			invite_splash = '¡Actualícelo ya gratuitamente!';
			arr.push({title_intro:title_intro, desc_intro:desc_intro, mooreinfo:mooreinfo, title_splash:title_splash, description_splash:description_splash, invite_splash:invite_splash});
			break;
			case 'en':
			title_intro = 'Your browser is old and has serious security flaws.';
			desc_intro = 'Please upgrade it at no cost by using one of the browsers at the side.';
			mooreinfo = 'More info';
			title_splash = 'Why upgrade?';
			description_splash = 'Old browsers such as <strong>Internet Explorer 6</strong> have serious security problems and are not compatible with many features of current websites. Therefore, to have a better browsing experience and to avoid risks with viruses and spyware, download and install on your computer at no cost one of these new browsers available.';
			invite_splash = 'Upgrade for free now!';
			arr.push({title_intro:title_intro, desc_intro:desc_intro, mooreinfo:mooreinfo, title_splash:title_splash, description_splash:description_splash, invite_splash:invite_splash});
			break;
		}
		return arr;
	},

	init : function(colorBg, colorText, lg) {

		if (this.getCookie('deprecated_browser').length > 0) 
		return false;

		var arrLanguage = this.language(lg);
		language = lg;
		var headID = document.getElementsByTagName("head")[0];         
		var cssNode = document.createElement('link');
		cssNode.type = 'text/css';
		cssNode.rel = 'stylesheet';
		cssNode.href = 'http://github.com/mktvirtual/Deprecated-Browser/raw/multi-language/deprecated_browsers_min.css';
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
			rightSide.innerHTML = '<a href="http://br.mozdev.org" class="deprecated_icon" deprecated_browser="blank"><img src="http://github.com/mktvirtual/Deprecated-Browser/raw/multi-language/images/firefox.png" alt="Firefox" /></a><a href="http://www.microsoft.com/brasil/windows/internet-explorer" class="deprecated_icon" deprecated_browser="blank"><img src="http://github.com/mktvirtual/Deprecated-Browser/raw/multi-language/images/ie.png" alt="Internet Explorer" /></a><a href="http://www.google.com.br/chrome" class="deprecated_icon" deprecated_browser="blank"><img src="http://github.com/mktvirtual/Deprecated-Browser/raw/multi-language/images/chrome.png" alt="Chrome" /></a><a href="http://www.apple.com/br/safari" class="deprecated_icon" deprecated_browser="blank"><img src="http://github.com/mktvirtual/Deprecated-Browser/raw/multi-language/images/safari.png" alt="Safari" /></a><a href="#" onClick="deprecated_browser.closeDeprecated()" id="close_deprecated"><img src="http://github.com/mktvirtual/Deprecated-Browser/raw/multi-language/images/xis.png" alt="Fechar" /></a>';
			middle.appendChild(rightSide);			
			middle.appendChild(leftSide);

			var logos = rightSide.getElementsByTagName('a');
			for (var i = logos.length - 1; i >= 0; i--){
				var k = rightSide.getElementsByTagName('a')[i];
				var imageAlpha = k.firstChild;
				imageAlpha.setAttribute('class', 'deprecated_browser_icob');
			};
			var closeButton = document.getElementById('close_deprecated');
			var img = document.getElementById("right_deprecated").getElementsByTagName('img');
			this.fix(img);
			var info = document.createElement('p');
			var readMoore = document.createElement('p');

			info.setAttribute('id', 'info_deprecated');
			info.style.color = readMoore.style.color = colorText;			
			readMoore.setAttribute('id', 'info_moore_deprecated');
			info.innerHTML = arrLanguage[0].title_intro;
			readMoore.innerHTML = arrLanguage[0].desc_intro + ' <a id="read_moore_link" href="#" onClick="deprecated_browser.aboutDeprecated();">' + arrLanguage[0].mooreinfo +'</a>';
			leftSide.appendChild(info);	
			leftSide.appendChild(readMoore);			
			document.getElementById('read_moore_link').style.color = colorText;
		}
	}
}