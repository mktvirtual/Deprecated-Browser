	function deprecated(target, color){
		if (document.createElement){ //Testando se é possível criar elementos pelo DOM
			var target = document.getElementById(target);
			//Aqui começa a criação do elemento
			// 
			target.style.backgroundColor = color;
			target.style.height = '40px';
			target.style.paddingTop = '10px';
			
			var middle = document.createElement('div');
			middle.setAttribute('id', 'deprecated_owner');
			middle.style.width = '778px';
			middle.style.margin = '0 auto';
			target.appendChild(middle);
						
			
			var leftSide = document.createElement('div');
			leftSide.setAttribute('id', 'left_deprecated');
			leftSide.style.width = '425px';			
			leftSide.style.cssFloat = 'left';
			var rightSide = document.createElement('div');
			rightSide.setAttribute('id', 'right_deprecated');
			rightSide.style.width = '250px';
			rightSide.style.cssFloat = 'right';
			middle.appendChild(leftSide);
			middle.appendChild(rightSide);
			
			
			rightSide.innerHTML = '<a href="http://br.mozdev.org" target="blank"><img src="http://github.com/brunomarks/updatebrowser/raw/master/images/firefox.png" alt="Firefox" /></a><a href="http://www.microsoft.com/brasil/windows/internet-explorer" target="blank"><img src="http://github.com/brunomarks/updatebrowser/raw/master/images/ie.png" alt="Internet Explorer" /></a><a href="http://www.google.com.br/chrome" target="blank"><img src="http://github.com/brunomarks/updatebrowser/raw/master/images/chrome.png" alt="Chrome" /></a><a href="http://www.apple.com/br/safari" target="blank"><img src="http://github.com/brunomarks/updatebrowser/raw/master/images/safari.png" alt="Safari" /></a>';
			
			var custom = rightSide.getElementsByTagName('a');
			custom.style.display = 'block';
					
			var info = document.createElement('p');
			info.setAttribute('id', 'info_deprecated');
			info.style.font = 'bold 14px "Tahoma", verdana, arial';
			var readMoore = document.createElement('p');
			readMoore.setAttribute('id', 'info_moore_deprecated');
			readMoore.style.font = 'normal 11px "Tahoma", verdana, arial';
			
			leftSide.appendChild(info);	
			leftSide.appendChild(readMoore);	
			
			info.innerHTML = 'Seu navegador é antigo e possui sérias falhas de segurança.';
			readMoore.innerHTML = 'Atualize-o gratuitamente por um dos navegadores ao lado. <a href="#">Saiba mais</a>';
			//Atualize-o gratuitamente por um dos navegadores ao lado. Saiba mais
			//Aqui termina a criação do elemento
			var texto = target.getElementsByTagName('div')[0];			
			}
		}
	
	window.onload = deprecated('deprecated', '#ffc440');
