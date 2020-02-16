const React = require('react')
const { useEffect } = React

function EnvelopeVisualiser ({ attack, decay, sustain, release }) {
  useEffect(() => {
    let canvas = document.getElementById("envelope-visualiser");
    var ctx = canvas.getContext("2d");
    draw({ attack, decay, sustain, release }, canvas, ctx)
  }, [attack, decay, sustain, release])

  return (<canvas id='envelope-visualiser' height='300' width='500'></canvas>)
}

function drawAxis(ctx) {
	ctx.save();
	ctx.beginPath();
	ctx.lineWidth = 3;
	ctx.moveTo(60, 25);
	ctx.lineTo(60, 250);
	ctx.lineTo(480, 250);
	//total height = 200px
	//total width = 400px
	ctx.strokeStyle = "black";
	ctx.stroke();
	ctx.closePath();
	drawArrowhead(ctx, 490, 250, Math.PI / 2, 7);
	drawArrowhead(ctx, 60, 15, 0, 7);

	// Max Amplitude Dotted Line
	ctx.beginPath();
	ctx.moveTo(48, 44);
	ctx.lineTo(480, 44);
	ctx.setLineDash([2, 2]);
	ctx.lineWidth = 2;
	ctx.strokeStyle = "grey";
	ctx.stroke();
	ctx.closePath();
	ctx.restore();

	// Amp max
	ctx.font = "italic 18px serif";
	ctx.fillStyle = "grey";
	ctx.fillText("Amp", 25, 48);
	ctx.font = "italic 12px serif";
	ctx.fillText("max", 46, 56);

	// Amplitude
	ctx.save();
	ctx.translate(50, 145);
	ctx.rotate(-Math.PI / 2);
	ctx.font = "bold 22px serif";
	ctx.fillText("Amplitude", 0, 0);
	ctx.restore();

	// 0
	ctx.font = "italic bold 30px serif";
	ctx.fillStyle = "black";
	ctx.fillText("0", 32, 274);

	// t
	ctx.font = "italic bold 30px serif";
	ctx.fillText("t", 484, 273);

	// key pressed
	ctx.beginPath();
	ctx.moveTo(60, 268);
	ctx.lineTo(60, 260);
	ctx.lineWidth = 3;
	ctx.strokeStyle = "black";
	ctx.stroke();
	drawArrowhead(ctx, 60, 252, 0, 5);
	ctx.font = "italic 12px serif";
	ctx.fillStyle = "black";
	ctx.textAlign = "center";
	ctx.fillText("key", 59, 278);
	ctx.fillText("pressed", 59, 290);
	ctx.closePath();
}

function drawArrowhead(ctx, x, y, radians, size) {
	ctx.save();
	ctx.beginPath();
	ctx.translate(x, y);
	ctx.rotate(radians);
	ctx.moveTo(0, 0);
	ctx.lineTo(size, size * 1.7);
	ctx.lineTo(-size, size * 1.7);
	ctx.fillStyle = "black";
	ctx.fill();
	ctx.closePath();
	ctx.restore();
}

function draw(env, canvas, ctx) {
	// reset variables
	let total = env.attack + env.decay + env.release;
	let current = 60;
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Attack
	ctx.beginPath();
	ctx.moveTo(60, 250);
	ctx.lineTo(env.attack / total * 300 + current, 50);
	current += env.attack / total * 300;

	// Decay
	ctx.lineTo(env.decay / total * 300 + current, 250 - env.sustain * 200);
	current += env.decay / total * 300;

	// Sustain
	ctx.lineTo(current + 100, 250 - env.sustain * 200);
	current += 100;

	// Release
	ctx.lineTo(env.release / total * 300 + current, 250);
	current += env.release / total * 300;

	// stroke
	ctx.lineWidth = 6;
	ctx.strokeStyle = "lightgrey";
	ctx.stroke();
	ctx.closePath();

	// RELEASE LINES
	if (env.release != 0) {
		// vertical release
		ctx.beginPath();
		ctx.moveTo(current, 250);
		ctx.lineTo(current, 25);
		ctx.lineWidth = 4;
		ctx.strokeStyle = "purple";
		if(env.release / total > .1){
			// horizontal release
			ctx.moveTo(current - 10, 30);
			current -= env.release / total * 300;
			ctx.lineTo(current + 10, 30);
			ctx.stroke();
			ctx.closePath();
			// arrowhead
			drawArrowhead(ctx, current + env.release / total * 300 - 4, 30, Math.PI / 2, 9);
			if(env.release / total > .16){
				// R
				ctx.font = "italic 20px serif";
				ctx.fillStyle = "purple";
				ctx.textAlign = "center";
				ctx.fillText("R", current + env.release / total * 150 - 2, 26);
			}
		} else{
			ctx.stroke();
			ctx.closePath();
			current -= env.release / total * 300;
		}
	}

	// key released
	ctx.beginPath();
	ctx.moveTo(current, 268);
	ctx.lineTo(current, 260);
	ctx.lineWidth = 3;
	ctx.strokeStyle = "black";
	ctx.stroke();
	drawArrowhead(ctx, current, 252, 0, 5);
	ctx.font = "italic 12px serif";
	ctx.fillStyle = "black";
	ctx.textAlign = "center";
	ctx.fillText("key", current, 278);
	ctx.fillText("released", current, 290);
	ctx.closePath();

	// SUSTAIN LINES
	// vertical sustain black
	ctx.beginPath();
	ctx.moveTo(current, 250);
	ctx.lineTo(current, 25);
	ctx.stroke();
	ctx.closePath();
	if (env.sustain != 0) {
		ctx.beginPath();
		if(env.sustain > 0.1){
			// vertical sustain blue
			ctx.moveTo(current - 50, 250);
			ctx.lineTo(current - 50, 260 - env.sustain * 200);
		}
		// horizontal sustain
		ctx.moveTo(current - 10, 250 - env.sustain * 200);
		current -= 100;
		ctx.lineTo(current + 10, 250 - env.sustain * 200);
		ctx.lineWidth = 4;
		ctx.strokeStyle = "blue";
		ctx.stroke();
		ctx.closePath();
		if(env.sustain > 0.1){
			// arrowhead
			drawArrowhead(ctx, current + 50, 254 - env.sustain * 200, 0, 9);
			// S
			ctx.font = "italic 20px serif";
			ctx.fillStyle = "blue";
			ctx.textAlign = "center";
			ctx.fillText("S", current + 40, 264 - env.sustain * 100);
		}
	} else {
		current -= 100;
	}

	// DECAY LINES
	if (env.decay != 0) {
		// vertical decay
		ctx.beginPath();
		ctx.moveTo(current, 250);
		ctx.lineTo(current, 25);
		ctx.lineWidth = 4;
		ctx.strokeStyle = "#f60";
		if(env.decay / total > .1){
			// horizontal decay
			ctx.moveTo(current - 10, 30);
			current -= env.decay / total * 300;
			ctx.lineTo(current + 10, 30);
			ctx.stroke();
			ctx.closePath();
			// arrowhead
			drawArrowhead(ctx, current + env.decay / total * 300 - 4, 30, Math.PI / 2, 9);
			if(env.decay / total > .16){
				// D
				ctx.font = "italic 20px serif";
				ctx.fillStyle = "#f60";
				ctx.textAlign = "center";
				ctx.fillText("D", current + env.decay / total * 150 - 2, 26);
			}
		} else{
			ctx.stroke();
			ctx.closePath();
			current -= env.decay / total * 300;
		}
	}

	// ATTACK LINES
	if (env.attack != 0) {
		// vertical attack
		ctx.beginPath();
		ctx.moveTo(current, 250);
		ctx.lineTo(current, 25);
		ctx.lineWidth = 4;
		ctx.strokeStyle = "green";
		if(env.attack / total > .1){
			// horizontal attack
			ctx.moveTo(current - 10, 30);
			current -= env.attack / total * 300;
			ctx.lineTo(current + 10, 30);
			ctx.stroke();
			ctx.closePath();
			// arrowhead
			drawArrowhead(ctx, current + env.attack / total * 300 - 4, 30, Math.PI / 2, 9);
			if(env.attack / total > .16){
				// A
				ctx.font = "italic 20px serif";
				ctx.fillStyle = "green";
				ctx.textAlign = "center";
				ctx.fillText("A", current + env.attack / total * 150 - 2, 26);
			}
		} else{
			ctx.stroke();
			ctx.closePath();
			current -= env.attack / total * 300;
		}
	}

	drawAxis(ctx);
}

module.exports = EnvelopeVisualiser






