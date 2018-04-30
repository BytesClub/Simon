var on = false, strict = false, start = false, u_mode = false, wrong = false, i, timeId = [];
var u_moves = [], gen_moves = [], colors = [["" ,"#ff0000","#007bff","#ffff00","#00e832"],["" ,"#b22e2e","#2e50a0","#a0a310","#058922"]];
$(document).ready(function() {
	$("#controls").on("click", function() {
		if(!on) {
			$("#on").css("float", "right");
			on = true;
			$("#display").css("color", "#e00404");
		}
		else {
			$("#on").css("float", "left");
			reset();
		}
	});

	$("#start").on("click", function() {
		if(on) {
			restart();
			i = 1;
			start = true;
			sleep(100);
			userInput(5);
		}
	});

	$("#strict").on("click", function() {
		if (on) {
			if (strict) {
				strict = false;
				$("#light").css("background-color", "black");
			}
			else {
				strict = true;
				$("#light").css("background-color", "red");	
			}
		}
	});

	$.each([1,2,3,4], function(index, val) {
		$("#"+val).on("mousedown", function() {
			if (u_mode && start) {
				$("#"+val).css("background-color", colors[0][val]);
				u_moves.push(val);
				if (u_moves[u_moves.length - 1] !== gen_moves[u_moves.length - 1]) {
					u_moves = [];
					wrong = true;
					u_mode = false;
					if (strict) {
						i = 1;
						restart();
					}
					userInput(5);
				}
				console.log("wrong: "+wrong + ", strict: " + strict + ", i: " + i);
				console.log(u_moves);
			}
		});
		$("#"+val).on("mouseup mouseleave", function() {
			$("#"+val).css("background-color", colors[1][val]);
		});
	});

	$.each([1,2,3,4], function(i,val) {
		var timeId = 0;
		$("#"+val).on("mousedown", function() {
			var audio = $("#audio"+val)[0];
			audio.load();
			audio.loop = true;
			audio.play();	
		}).on("mouseup mouseleave", function() {
			//$("#audio"+val)[0].pause();
			clearTimeout(timeId);
		});
	});
});

function reset() {
	restart();
	$("#light").css("background-color", "black");
	$("#display").css("color", "#750b0b");
	on = false;
	strict = false;
	start = false;
}

function restart() {
	u_moves = [];
	gen_moves = [];
	$.each(timeId, function(index) {	clearTimeout(timeId[index]);	});
	$("#display").text("--");
	$.each([1,2,3,4], function(i,val) {
		$("#"+val).css("background-color", colors[1][val]);
	});
}


function play(move) {
	timeId[0] = setTimeout(function() {
		u_moves = [];
		if (!wrong) {
			var choice = Math.floor(Math.random() * 4 + 1);
			gen_moves.push(choice);
		}
		$("#display").text(move <= 9 ? "0"+ move : move);
		$.each(gen_moves, function(index) {
			var color = $("#"+gen_moves[index]).css("background-color");
			timeId[1] = setTimeout(function() {
				$("#"+gen_moves[index]).css("background-color", colors[0][gen_moves[index]]);
			}, 2000 + 1000 * index);
			timeId[2] = setTimeout(function() {
				$("#"+gen_moves[index]).css("background-color", colors[1][gen_moves[index]]);
			}, 2000 + 1000 * (index + 1));
			sleep(200);
		});
		console.log(gen_moves + " " + move + " " + $.now() + " " + u_mode);
		return {"1":1};
	}, 1000 + 1000 * move);
}

function userInput(limit) {
	timeId[3] = setTimeout(function() {
		u_mode = false;
		play(i);
		u_mode = true;
		setTimeout(function() {
			sleep(150 * i);	
			console.log("i: "+i);
			i++;
			if (i <= limit) userInput(limit);
		}, 5000 + 1000 * i);
		//validate(limit);
	}, 2000 * i);
}

/*function validate(limit) {
	timeId[4] = setTimeout(function() {
		console.log("Validating...");
		if (u_moves.length !== i) {
			if (strict) i = 1;
			userInput(limit);
			wrong = false;
		}
		else i++;
		return {"1":1};
	}, 5000 * i); 
}*/

function sleep(milliseconds) { // busy loop
  var start = new Date().getTime();
  for (var j = 0; j < 1e7; j++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}