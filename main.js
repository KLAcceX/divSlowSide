const delay = 80;
var interval, contador = 0, jump = false;
const jumpMax = 4;
const divChar = 'z';
const LEFT = 0, UP = 1, RIGHT = 2, DOWN = 3;
var lKey = false, rKey = false;

$(document).on('click', '#main', function(event){
	if($('#file').val() == null || $('#file').val() == ''){
		$('#file').click();
	}
});

$(document).on('change', '#file', function(event){
    var reader = new FileReader();
  	reader.onload = (function(reader) {
    	return function()
      	{
        	var json = JSON.parse(reader.result);
        	$('#main').append(generateMap(json));
        	interval = setInterval(function() {
        		movements();
        	}, delay);
        }
  	})(reader);

  reader.readAsText($('#file').prop('files')[0]);
});

$(document).on('keydown', function(event){
	switch(event.which){
		case 37:
			if(!lKey){
				lKey = true;
			}
			event.preventDefault();
			break;
		case 38:
			if(!jump && contador == 0){
				jump = true;
			}
			event.preventDefault();
			break;
		case 39:
			if(!rKey){
				rKey = true;
			}
			event.preventDefault();
			break;
		case 40:
			jump = false;
			event.preventDefault();
			break;
	}
});

$(document).on('keyup', function(event){
	switch(event.which){
		case 37:
			lKey = false;
			event.preventDefault();
			break;
		case 38:
			event.preventDefault();
			break;
		case 39:
			rKey = false;
			event.preventDefault();
			break;
		case 40:
			event.preventDefault();
			break;
	}
});

function generateMap(json){
	var elements = $();
	var i = 0,
		j = 0;
	for(var arr of json){
		for(var num of arr){
			var div = $('<div/>');
			if((num & 1) != 0){
				div.addClass('left');
			}
			if((num & 2) != 0){
				div.addClass('top');
			}
			if((num & 4) != 0){
				div.addClass('right');
			}
			if((num & 8) != 0){
				div.addClass('bottom');
			}
			if((num & 16) != 0){
				div.addClass('ground');
			}
			if((num & 32) != 0){
				div.addClass('rod');
				var flag = elements.filter('div#' + (parseInt(i) - 1) + divChar + j);
				for(var k = 0; k < 50; k++){
					var square = $('<div/>', {
						class: 'flag'
					});
					flag.append(square);
				}
			}
			if((num & 64) != 0){
				div.addClass('bottom');

				for(var k = 0; k < 6; k++){
					var space = $('<div/>', {
						class: 'space'
					});
					div.append(space);
				}
				for(var k = 0; k < 3; k++){
					var spike = $('<div/>', {
						class: 'spike'
					});
					div.append(spike);
				}
			}
			if((num & 128) != 0){
				div.addClass('player');
			}
			div.attr('id', i + divChar + j);
			elements = elements.add(div);
			j++;
		}
		elements = elements.add($('<br/>'));
		i++;
		j = 0;
	}
	return elements;
}

function movements(){
	if(lKey){
		move(LEFT);
	}else if(rKey){
		move(RIGHT);
	}

	if(jump){
		move(UP)
	}else{
		move(DOWN);
	}
}

function move(direction){
	var player = $('.player').first();
	if(player.length > 0){

		var id = player.attr('id');
		var local = id.split(divChar);

		switch(direction){
			case LEFT:
				if(!player.hasClass('left')){
					$('#' + id).removeClass('player');
					$('#' + local[0] + divChar + (parseInt(local[1]) - 1)).addClass('player');
				};
				break;
			case UP:
				if(!player.hasClass('top')){
					if((player.hasClass('bottom') && contador == 0) || (contador < jumpMax && contador > 0)){
						contador++;
					}else{
						jump = false;
					}

					if(jump){
						$('#' + id).removeClass('player');
						$('#' + (parseInt(local[0]) - 1) + divChar + local[1]).addClass('player');
					}
				}else{
					jump = false;
				}
				break;
			case RIGHT:
				if(!player.hasClass('right')){
					$('#' + id).removeClass('player');
					$('#' + local[0] + divChar + (parseInt(local[1]) + 1)).addClass('player');
				}
				break;
			case DOWN:
				if(player.hasClass('bottom')){
					contador = 0;
				}else if(contador > 0){
					contador--;
				}
				if(!player.hasClass('bottom')){
					$('#' + id).removeClass('player');
					$('#' + (parseInt(local[0]) + 1) + divChar + local[1]).addClass('player');
				}
				break;
		}
	}

	return false;
}