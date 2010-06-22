function deprecated(target, color){
	if (document.createElement){ //Testando se é possível criar elementos pelo DOM
		var target = document.getElementById(target);
		//Aqui começa a criação do elemento
		// 
		target.style.backgroundColor = color;
		target.style.height = '43px';
		target.style.paddingTop = '7px';
		
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
		rightSide.style.overflow = 'hidden';
		rightSide.style.backgroundColor = '#e92e09';
		middle.appendChild(leftSide);
		middle.appendChild(rightSide);
		
		//inserindo logos dos browsers
		rightSide.innerHTML = '<a href="http://br.mozdev.org" class="deprecated_icon" target="blank"><img src="http://github.com/brunomarks/updatebrowser/raw/master/images/firefox.png" alt="Firefox" /></a><a href="http://www.microsoft.com/brasil/windows/internet-explorer" class="deprecated_icon" target="blank"><img src="http://github.com/brunomarks/updatebrowser/raw/master/images/ie.png" alt="Internet Explorer" /></a><a href="http://www.google.com.br/chrome" class="deprecated_icon" target="blank"><img src="http://github.com/brunomarks/updatebrowser/raw/master/images/chrome.png" alt="Chrome" /></a><a href="http://www.apple.com/br/safari" class="deprecated_icon" target="blank"><img src="http://github.com/brunomarks/updatebrowser/raw/master/images/safari.png" alt="Safari" /></a><a href="#" id="close_deprecated"><img src="http://github.com/brunomarks/updatebrowser/raw/master/images/xis.png" alt="Fechar" /></a>';
		
		var logos = rightSide.getElementsByTagName('a');
		for (var i = logos.length - 1; i >= 0; i--){
			var k = rightSide.getElementsByTagName('a')[i];
			k.style.display = 'block';
			k.style.cssFloat = 'left';
			k.style.marginRight = '10px';
			k.style.width = k.style.height = '38px';
			};
		var closeButton = document.getElementById('close_deprecated');
		closeButton.style.width = closeButton.style.height = '15px';
		closeButton.style.marginTop = '10px';
		
		var info = document.createElement('p');
		info.setAttribute('id', 'info_deprecated');
		info.style.font = 'bold 14px "Tahoma", verdana, arial';
		var readMoore = document.createElement('p');
		readMoore.setAttribute('id', 'info_moore_deprecated');
		readMoore.style.font = 'normal 11px "Tahoma", verdana, arial';		
			
		info.innerHTML = 'Seu navegador é antigo e possui sérias falhas de segurança.';
		readMoore.innerHTML = 'Atualize-o gratuitamente por um dos navegadores ao lado. <a href="#">Saiba mais</a>';
		leftSide.appendChild(info);	
		leftSide.appendChild(readMoore);
	}
}

