function Game(el){
	var grid = 3, 
		size = 100, 
		intelligence = 6, 
			
		doc = document,
		body = doc.body,
		canvas = doc.createElement('canvas'),
		context = canvas.getContext('2d'),
		die = alert,
		combos = [],
		board = [],
		undef;
	
	for (i in context)
		context[i[0] + (i[4] || '')] = context[i];		
	
		
	canvas.height = canvas.width = grid * size;
	
	with(context){
		strokeStyle = '#666';
		bn(); 
		for (i = 1, h = grid - 1; i <= h * 2; i++){
			j = k = 0, l = m = grid * size;
			i <= h ? j = l = i * size 
			 	: k = m = i * size - h * size; 
			mT(j, k), lT(l, m); 
		}
		stroke();
	}
	(el || body).appendChild(canvas);
	
	
	for (i = 0, c = [], d = []; i < grid; i++){
		for (j = 0, a = [], b = []; j < grid; j++){
			a.push(i * grid + j);
			b.push(j * grid + i);
		}
		combos.push(a, b);
		c.push(i * grid + i);
		d.push((grid - i - 1) * grid + i);
	}
	combos.push(c, d);

	
	canvas.onclick = function(e){
		var rect = canvas.getBoundingClientRect(), 
			move = ~~((e.pageY - rect.top + body.scrollTop) / size) * grid + ~~((e.pageX - rect.left + body.scrollLeft) / size), 
			next;		
		if (!board[move]){
			draw(move, -1); 
			if (chk(0) < 0) return die('won');
			next = search(0, 1, -size, size);
			if (next === undef) return die('tie');		
			draw(next);
			if (chk(0) > 0) return die('lost')
		}		
	};

	function chk(depth){
		for (z in combos){
			j = x = o = grid;
			while(j--){
				k = combos[z][j];
				board[k] > 0 && x--;
				board[k] < 0 && o--;
			}
			if (!x) return size - depth; 
			if (!o) return depth - size; 
		}
	}

	function draw(i, o){
		with(context){
			x = i % grid * size, y = ~~(i / grid) * size, c = size / 2, d = size / 3, e = d * 2, lineWidth = 4;
			bn(); 
			o ? a(x + c, y + c, d / 2, 0, Math.PI * 2, !1) 
				: (mT(x + d, y + d), lT(x + e, y + e), mT(x + d, y + e), lT(x + e, y + d)); 
			stroke();
			board[i] = o || 1;
		}
	}
	
	function search(depth, player, alpha, beta){
		var i = grid * grid, min = -size, max, value, next;
		if (value = chk(depth)) 
			return value * player;
		if (intelligence > depth){
			while(i--){
				if (!board[i]){
					board[i] = player;
					value = -search(depth + 1, -player, -beta, -alpha);
					board[i] = undef;
					if (max === undef || value > max) max = value;
					if (value > alpha) alpha = value;
					if (alpha >= beta) return alpha; 
					if (max > min){ min = max; next = i; } 
				}
			}		
		} 
		return depth ? max || 0 : next; 
	}
}