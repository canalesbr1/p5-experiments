let w = 600;
let h = 600;

let num = 200;

let particles = [];

let m = new p5.Vector(-100,-100);

//settings
let hangle = 15; // header angle
let rangle = 5; // rotate angle
let smag = 5; // sensor mag

//debugging
let totfr = 0;

let shader1;
let tex0,tex1;

function preload(){
	shader1 = loadShader("shader1.vert","shader1.frag");
	shader2 = loadShader("shader2.vert","shader2.frag");
}

function setup() {

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

	hangle = radians(hangle);
	rangle = radians(rangle);
}

function draw() {
	//tex0.background(0);

	// debugging
	totfr += frameRate();
	print("avg FPS: " + totfr/frameCount);


	//update mouse
	m.x = constrain(mouseX,0,width);
	m.y = constrain(mouseY,0,height);

	loadPixels();
	for(let i =0; i<particles.length;i++){
		particles[i].update();
		particles[i].sense();
		particles[i].display();
	}

	//shader uniforms
	shader1.setUniform("u_rez",[width,height]); //send rez
	shader1.setUniform("tex0",tex0); //send tex0
	shader2.setUniform("u_rez",[width,height]); //send rez
	shader2.setUniform("tex0",tex0); //send tex0

	//draw tex0
	tex1.shader(shader1);
	tex1.rect(0,0,width,height);

	//feedback
	tex0.image(tex1,0,0,width,height);

	//tex1.shader(shader2);
	//tex1.rect(0,0,width,height);
	image(tex1,0,0,width,height);


	// for(let i =0; i<particles.length;i++){
	// 	particles[i].debug();
	// }

	//draw UI
	strokeWeight(1);
	// fill(getRed(m.x,m.y,pixels));
	noFill();
	stroke(255,0,0);
	ellipse(m.x,m.y,35,35);
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
	}

	sense(){
		let fl = getRed(int(this.pos.x+this.vel.copy().rotate(-hangle).setMag(smag).x),int(this.pos.y+this.vel.copy().rotate(-hangle).setMag(smag).y));
		let f = getRed(int(this.pos.x+this.vel.copy().setMag(smag).x),int(this.pos.y+this.vel.copy().setMag(smag).y));
		let fr = getRed(int(this.pos.x+this.vel.copy().rotate(hangle).setMag(smag).x),int(this.pos.y+this.vel.copy().rotate(hangle).setMag(smag).y));
		if(fl > f && fl > fr){
			this.vel.rotate(-rangle);
		}

		else if(fr>fl){
			this.vel.rotate(rangle);
		}
	}

	update(){
		if(mouseIsPressed){
			let d = dist(m.x,m.y,this.pos.x,this.pos.y);
			d = map(d,0,200,1,0);
			d = constrain(d,0,1);
			if(d>0){
				this.acc = p5.Vector.sub(this.pos,m).setMag(d*1.0);
			}
		}
		this.ppos = this.pos.copy()
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		//this.vel.mult(.98);
		this.vel.setMag(1.0);

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

		this.acc.mult(0);
	}

	display(){
		tex0.line(this.ppos.x,this.ppos.y,this.pos.x,this.pos.y);
	}

	debug(px){
		noStroke();
		fill(255,0,0);
		ellipse(this.pos.x,this.pos.y,5,5);

		let fl = getRed(int(this.pos.x+this.vel.copy().rotate(-hangle).setMag(smag).x),int(this.pos.y+this.vel.copy().rotate(-hangle).setMag(smag).y));
		let f = getRed(int(this.pos.x+this.vel.copy().setMag(smag).x),int(this.pos.y+this.vel.copy().setMag(smag).y));
		let fr = getRed(int(this.pos.x+this.vel.copy().rotate(hangle).setMag(smag).x),int(this.pos.y+this.vel.copy().rotate(hangle).setMag(smag).y));

		stroke(100);
		strokeWeight(1);
		line(this.pos.x,this.pos.y,this.pos.x+this.vel.copy().setMag(smag).x,this.pos.y+this.vel.copy().setMag(smag).y);
		line(this.pos.x,this.pos.y,this.pos.x+this.vel.copy().rotate(hangle).setMag(smag).x,this.pos.y+this.vel.copy().rotate(hangle).setMag(smag).y);
		line(this.pos.x,this.pos.y,this.pos.x+this.vel.copy().rotate(-hangle).setMag(smag).x,this.pos.y+this.vel.copy().rotate(-hangle).setMag(smag).y);

		stroke(0,255,0);
		if(fl > f && fl > fr){
			line(this.pos.x,this.pos.y,this.pos.x+this.vel.copy().setMag(smag).x,this.pos.y+this.vel.copy().setMag(smag).y);
		}

		else if(f < fr){
			line(this.pos.x,this.pos.y,this.pos.x+this.vel.copy().rotate(hangle).setMag(smag).x,this.pos.y+this.vel.copy().rotate(hangle).setMag(smag).y);
		}

		else{
			line(this.pos.x,this.pos.y,this.pos.x+this.vel.copy().setMag(smag).x,this.pos.y+this.vel.copy().setMag(smag).y);
		}


	}
}

function getRed(x,y){
	if(x>width || x<0 || y>height || y<0){
		return 0;
	}
	let off = (y * width + x) * 1.0 * 4;
	return pixels[off];
}
