let w = 600;
let h = 600;

let num = 400;

let particles = [];

let m = new p5.Vector(-100,-100);


let hangles = [38.36,46.35,70.52,34.53,88.59,44.22];
let rangles = [18.05,17.83,75.53,49.35,36.72,18.48];
let smags = [16.56,34.29,55.60,41.89,19.28,5.56];
let decays = [.0031,.0031,.0031,.0033,.0035,.0034];
let drags = [.706,.908,.879,.911,.772,.791];
let minvs = [3.72,1.96,3.49,4.098,2.92,4.85]
let maxvs = [5.68,1.68,6.93,10.79,10.95,14.99];
let wraps = [0,1,0,1,0,0];
let mousemags = [3,3,1,4,3,2];


//manual input
// let hangle1 = 64.32;
// let rangle1 = 73.74;
// let smag1 = 29.15;
// let decay= .0025;
// let drag = .98;
// let minv = 1;
// let maxv = 2;
// let wrap = 0;



//debugging
let totfr = 0;

let shader1;
let tex0,tex1;

let mid;

function preload(){
	shader1 = loadShader("shader1.vert","shader1.frag");
	shader2 = loadShader("shader2.vert","shader2.frag");
}

function setup() {

	hangle1 = random(1,90);
	rangle1 = random(1,90);
	smag1 = random(1,200);
	decay = random(.0025,.0035);
	drag = random(.98,.7);
	minv = random(1,5);
	maxv = random(1,15);
	wrap = random();

	let idx = int(random(-1,hangles.length));
	// idx = 2;
	//print("idx: " + idx);
	hangle1 = hangles[idx];
	rangle1 = rangles[idx];
	smag1 = smags[idx];
	decay= decays[idx];
	drag = drags[idx];
	minv = minvs[idx];
	maxv = maxvs[idx];
	wrap = wraps[idx];
	mousemag = mousemags[idx];


	// print("header angle 1: " +hangle1);
	// print("rotate angle 1: " +rangle1);
	// print("sensor magnitude 1: " +smag1);
	// print("decay: "+decay);
	// print("drag: " +drag);
	// print("minv: " +minv);
	// print("maxv: " +maxv);
	// print("wrap: " +wrap);

	constructCanvasDim();

	var canvas = createCanvas(w, h);
	pixelDensity(1);
	smooth();

	canvas.parent("canvas-container");
	background(0);
	fill(255,0,0);
	stroke(0,255,0);
	strokeWeight(1);

	tex1 = createGraphics(width,height,WEBGL);

	tex0 = createGraphics(width,height);
	tex0.stroke(245);
	tex0.strokeWeight(1);


	for(let i =0; i<num; i++){
		particles.push(new Particle());
	}

	hangle1 = radians(hangle1);
	rangle1 = radians(rangle1);


	mid = new p5.Vector(width*.5,height*.5);
}

function draw() {
	// debugging
	// totfr += frameRate();
	// print("avg FPS: " + totfr/frameCount);

	//update mouse
	m.x = constrain(mouseX,0,width);
	m.y = constrain(mouseY,0,height);

	tex0.loadPixels();
	for(let i =0; i<particles.length;i++){
		particles[i].update();
		particles[i].sense();
		particles[i].display();
	}

	//shader uniforms
	shader1.setUniform("u_rez",[width,height]); //send rez
	shader1.setUniform("tex0",tex0); //send tex0
	shader1.setUniform("decay",decay);
	shader2.setUniform("u_rez",[width,height]); //send rez
	shader2.setUniform("tex0",tex0); //send tex0

	//draw tex0
	tex1.shader(shader1);
	tex1.rect(0,0,width,height);

	//feedback
	tex0.image(tex1,0,0,width,height);

	tex1.shader(shader2);
	tex1.rect(0,0,width,height);
	image(tex1,0,0,width,height);

	//debug particles
	// for(let i =0; i<particles.length;i++){
	// 	particles[i].debug();
	// }

	//draw UI
	strokeWeight(1);
	noFill();
	stroke(255,0,0);
	ellipse(mouseX,mouseY,35,35);
}

function constructCanvasDim(){
	if(windowHeight<h){
		h = windowHeight - 80;
	}

	if(windowWidth<w){
		w = windowWidth;
	}
}

///////////////////////

class Particle {
	constructor(){
		this.pos = new p5.Vector(random(0,w),random(0,h));
		this.ppos = new p5.Vector(this.pos.x,this.pos.y);
		this.vel = new p5.Vector(random(-1,1),random(-1,1));
		this.acc = new p5.Vector(0,0);
		this.col = color(random(0,255),random(0,255),random(0,255));

		this.hangle = hangle1;
		this.rangle = rangle1;
		this.smag = smag1;
	}

	sense(){
		let fl = getRed(int(this.pos.x+this.vel.copy().rotate(-hangle1).setMag(smag1).x),int(this.pos.y+this.vel.copy().rotate(-hangle1).setMag(smag1).y));
		let f = getRed(int(this.pos.x+this.vel.copy().setMag(smag1).x),int(this.pos.y+this.vel.copy().setMag(smag1).y));
		let fr = getRed(int(this.pos.x+this.vel.copy().rotate(hangle1).setMag(smag1).x),int(this.pos.y+this.vel.copy().rotate(hangle1).setMag(smag1).y));
		if(fl > f && fl > fr){
			this.vel.rotate(this.rangle);
			this.acc.mult(0);
		}

		else if(fr>fl){
			this.vel.rotate(-this.rangle);
			this.acc.mult(0);
		}

		else{
			this.acc.mult(.8);
		}
	}

	update(){
		if(mouseIsPressed){
			let d = dist(m.x,m.y,this.pos.x,this.pos.y);
			d = map(d,0,200,1,0);
			d = constrain(d,0,1);
			if(d>0){
				this.acc.add(p5.Vector.sub(this.pos,m).setMag(d*mousemag));
			}
		}

		let d = dist(width*.5,height*.5,this.pos.x,this.pos.y);
		d = map(d,width*.5,width*.5+50,0,1);
		d = constrain(d,0,1);

		this.acc.add(p5.Vector.sub(mid,this.pos).setMag(.05*d));


		this.ppos = this.pos.copy()
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		let mag = this.vel.mag();
		mag = constrain(mag,minv,maxv);
		this.vel.setMag(mag);
		this.vel.mult(drag);
		// this.vel.setMag(1.0);

		if(wrap<.5){
			if(this.pos.x < 0){
				this.pos.x = w;
				this.ppos.x = w;
			} else if (this.pos.x > w){
				this.pos.x = 0;
				this.ppos.x = 0;
			}

			if(this.pos.y < 0){
				this.pos.y = h;
				this.ppos.y = h;
			} else if (this.pos.y > h){
				this.pos.y = 0;
				this.ppos.y = 0;
			}
		}

	}

	display(){
		stroke(this.col);
		tex0.line(this.ppos.x,this.ppos.y,this.pos.x,this.pos.y);
	}

	debug(px){
		noStroke();
		fill(255,0,0);
		ellipse(this.pos.x,this.pos.y,5,5);

		let fl = getRed(int(this.pos.x+this.vel.copy().rotate(-this.hangle).setMag(this.smag).x),int(this.pos.y+this.vel.copy().rotate(-this.hangle).setMag(this.smag).y));
		let f = getRed(int(this.pos.x+this.vel.copy().setMag(this.smag).x),int(this.pos.y+this.vel.copy().setMag(this.smag).y));
		let fr = getRed(int(this.pos.x+this.vel.copy().rotate(this.hangle).setMag(this.smag).x),int(this.pos.y+this.vel.copy().rotate(this.hangle).setMag(this.smag).y));

		stroke(100);
		strokeWeight(1);
		line(this.pos.x,this.pos.y,this.pos.x+this.vel.copy().setMag(this.smag).x,this.pos.y+this.vel.copy().setMag(this.smag).y);
		line(this.pos.x,this.pos.y,this.pos.x+this.vel.copy().rotate(this.hangle).setMag(this.smag).x,this.pos.y+this.vel.copy().rotate(this.hangle).setMag(this.smag).y);
		line(this.pos.x,this.pos.y,this.pos.x+this.vel.copy().rotate(-this.hangle).setMag(this.smag).x,this.pos.y+this.vel.copy().rotate(-this.hangle).setMag(this.smag).y);

		stroke(0,255,0);
		if(fl > f && fl > fr){
			line(this.pos.x,this.pos.y,this.pos.x+this.vel.copy().setMag(this.smag).x,this.pos.y+this.vel.copy().setMag(this.smag).y);
		}

		else if(f < fr){
			line(this.pos.x,this.pos.y,this.pos.x+this.vel.copy().rotate(this.hangle).setMag(this.smag).x,this.pos.y+this.vel.copy().rotate(this.hangle).setMag(this.smag).y);
		}

		else{
			line(this.pos.x,this.pos.y,this.pos.x+this.vel.copy().setMag(this.smag).x,this.pos.y+this.vel.copy().setMag(this.smag).y);
		}
	}
}

function getRed(x,y){
	if(x>width || x<0 || y>height || y<0){
		return 0;
	}
	let off = (y * width + x) * 1.0 * 4;
	return tex0.pixels[off];
}

function doubleClicked(){
	//upcoming feature
	// hangle1 = random(1,90);
	// rangle1 = random(1,90);
	// smag1 = random(1,200);
	// decay = random(.0025,.0035);
	// drag = random(.98,.7);
	// minv = random(1,5);
	// maxv = random(1,15);
	// wrap = random();


	// print("///////////////////////////////");
	// // print("idx: " + idx);
	// print("header angle 1: " +hangle1);
	// print("rotate angle 1: " +rangle1);
	// print("sensor magnitude 1: " +smag1);
	// print("decay: "+decay);
	// print("drag: " +drag);
	// print("minv: " +minv);
	// print("maxv: " +maxv);
	// print("wrap: " +wrap);
}
