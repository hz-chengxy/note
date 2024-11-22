export function resizeHome(){
    var obj = {
		width: 0,
		height: 0,
		xScale: 0,
		yScale: 0
	};

	function setHomeSize() {
//		debugger
		var realWidth = $(".main-container").width();
		var realHeight = $(".main-container").height();
		var width = 0
		var height = 0
		var transition = 0
		if(screen.width/screen.height == 6600/2792){
			width = 6600
			height = 2792
			transition = 50
		}else {
			width = 6600
			height = 2792
			transition = 50
		}
		// var width=
		obj.width = window.innerWidth;
		obj.height = window.innerHeight;
		obj.xScale = obj.width / width;
		obj.yScale = obj.height / height;
        obj.minScale = Math.min(obj.xScale,obj.yScale);
        window.minScale = obj.minScale;
//      obj.xScale =  obj.minScale;
//      obj.yScale =  obj.minScale;
		var jscss = [
			'.main-container {',
			'   transform: translate(' + (-transition * (1 - obj.xScale)) + '%,' + (-50 * (1 - obj.yScale)) + '%) scale(' + obj.minScale + ',' + obj.minScale + ');',
			'   -webkit-transform: translate(' + (-transition * (1 - obj.xScale)) + '%,' + (-50 * (1 - obj.yScale)) + '%) scale(' + obj.minScale + ',' + obj.minScale + ');',
			'}'
		].join('\n');

		var $style = $('#js-style');
		if ($style.length === 0) {
			$style = $('<style id="js-style" type="text/css"></style>');
			$style.appendTo('head');
		}
		$style.text(jscss);
	}
	setHomeSize();
	
	window.addEventListener('resize', setHomeSize, false);
	return obj;
}

export function resizeSmall(){
    var obj = {
		width: 0,
		height: 0,
		xScale: 0,
		yScale: 0
	};

	function setOhterSize() {
//		debugger
		var realWidth = $(".main-container").width();
		var realHeight = $(".main-container").height();
		var width = 0
		var height = 0
		var transition = 0		
		if(screen.width/screen.height == 6600/2792){
			width = 6600
			height = 2792
			transition = 50
		}else if(screen.width/screen.height == 3414/1440){
			width = 6600
			height = 2792
			transition = 50
		}else {
			if(Math.round(screen.width/screen.height*10)/10 == 2880/1800){
				// console.log(window.screen.width)
				// console.log(window.screen.height)
				// console.log(window.devicePixelRatio)
				// console.log(Math.round(screen.width/screen.height*10)/10)
                width = 4964
                height = 2792
				if(window.devicePixelRatio == 2) transition = 55
				else if(window.devicePixelRatio == 1.75) transition = 56.1
				else if(window.devicePixelRatio == 1.5) transition = 57.8
				else if(window.devicePixelRatio == 1.25) transition = 60.7
				else if(window.devicePixelRatio == 1) transition = 67
				else transition = 55
            }else{
                width = 4964
                height = 2792
				if(window.devicePixelRatio == 2) transition = 53
				else if(window.devicePixelRatio == 1.75) transition = 53.5
				else if(window.devicePixelRatio == 1.5) transition = 54.3
				else if(window.devicePixelRatio == 1.25) transition = 55.6
				else if(window.devicePixelRatio == 1) transition = 57.8
				else transition = 50

            }
		}
		// var width=
		obj.width = window.innerWidth;
		obj.height = window.innerHeight;
		obj.xScale = obj.width / width;
		obj.yScale = obj.height / height;
        obj.minScale = Math.min(obj.xScale,obj.yScale);
        window.minScale = obj.minScale;
//      obj.xScale =  obj.minScale;
//      obj.yScale =  obj.minScale;
		var jscss = [
			'.main-container {',
			'   transform: translate(' + (-transition * (1 - obj.xScale)) + '%,' + (-50 * (1 - obj.yScale)) + '%) scale(' + obj.minScale + ',' + obj.minScale + ');',
			'   -webkit-transform: translate(' + (-transition * (1 - obj.xScale)) + '%,' + (-50 * (1 - obj.yScale)) + '%) scale(' + obj.minScale + ',' + obj.minScale + ');',
			'}'
		].join('\n');

		var $style = $('#js-style');
		if ($style.length === 0) {
			$style = $('<style id="js-style" type="text/css"></style>');
			$style.appendTo('head');
		}
		$style.text(jscss);
	}
	setOhterSize();
	
	window.addEventListener('resize', setOhterSize, false);
	return obj;
}
