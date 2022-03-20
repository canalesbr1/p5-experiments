let w = 600;
let h = 600;

let tex0,tex1;
let shader1;

let hue = 0;
let sat = 0;
let bri = 0;
let stw = 8;

let ppos =[];
let click1,click2,click3;

let lock = false;
let lock1 = false;
let clicks = 0;

function preload(){
	shader1 = loadShader("shader1.vert","shader1.frag");
}

function setup() {

	constructCanvasDim();

	var canvas = createCanvas(w, h);
	pixelDensity(1);
	smooth();

	canvas.parent("canvas-container");
	//background(245);

	tex0 = createGraphics(width,height);
	tex0.colorMode(HSB,255);

	tex1 = createGraphics(width,height,WEBGL);
	//tex1.clear();
	//tex1.background(245);

	stroke(0,255,255);
	strokeWeight(1);
	noFill();
	colorMode(HSB,255);

}

function draw() {
	//set background on tex0 — don't know why shader doesn't catch background() if i dont do this.
	if(frameCount < 15){
		tex0.background(245);
	}

	//color generation
	let o = 0.0;
	let o1 = 0.15;
	let init = .1;

	let hue = map(sin(frameCount*init),-1,1,0,255);
	let sat = map(sin(frameCount*(init+o1)+o),-1,1,0,255);
	let bri = map(sin(frameCount*(init+o1*2)+o*2),-1,1,0,255);
	tex0.stroke(hue,sat,bri);

	//set touch stroke weight
	if(touches[2]){
		let a = createVector(touches[0].x,touches[0].y);
		let b = createVector(touches[1].x,touches[1].y);
		let p = createVector(touches[2].x,touches[2].y);

		let pp = projectPoint2Line(a,b,p);

		let d = dist(pp.x,pp.y,touches[2].x,touches[2].y);
		stw = map(d,0,150,8,120);
		stw = constrain(stw,8,120);
	}

	//set non touch stroke weight

	//touch draw to tex0
	if(lock && touches.length < 2){
		tex0.strokeWeight(stw);
	  tex0.line(ppos[0].x,ppos[0].y,ppos[1].x,ppos[1].y);
		lock = false;
		//print('printed');
	}

	//non-touch draw to tex0
	if(lock1 && clicks == 0 ){
		tex0.strokeWeight(stw);
	  tex0.line(ppos[0].x,ppos[0].y,ppos[1].x,ppos[1].y);
		lock1 = false;
	}

	//shader uniforms
	shader1.setUniform("u_rez",[width,height]);
	shader1.setUniform("tex0",tex0);
	shader1.setUniform("mytime",frameCount);

	tex1.shader(shader1);
	tex1.rect(0,0,width,height);

	image(tex1,0,0,width,height);

	//if we have more than 1 touch save 1st and 2nd and draw visualizer
	if(touches.length>1){
		lock = true;
		ppos[0] = createVector(touches[0].x,touches[0].y);
		ppos[1] = createVector(touches[1].x,touches[1].y);

		line(touches[0].x,touches[0].y,touches[1].x,touches[1].y);
		let mid = createVector((touches[0].x+touches[1].x)*.5,(touches[0].y+touches[1].y)*.5);
		let tan = createVector(touches[0].x-touches[1].x,touches[0].y-touches[1].y,0.0);
		tan.normalize();
		let up = createVector(0,0,1);
		let out = tan.cross(up);
		out.setMag(stw*.5);

		line(mid.x+out.x,mid.y+out.y,mid.x - out.x,mid.y-out.y);

		point(mid.x,mid.y);
	}

	//touch UI — draw up to 3 touches
	stroke(0,255,255);
	strokeWeight(1);
	for(let i = 0; i<constrain(touches.length,0,3); i++){
		ellipse(touches[i].x,touches[i].y,55,55);
	}

	//non-touch UI — clicks
	if(clicks == 0){
		ellipse(mouseX,mouseY,55,55);
	}

	if(clicks==1){
		line(click1.x*2-mouseX,click1.y*2-mouseY,mouseX,mouseY);
		ellipse(click1.x*2-mouseX,click1.y*2-mouseY,55,55);
		ellipse(mouseX,mouseY,55,55);
	}

	if(clicks==2){
		let b = createVector(click1.x*2-click2.x,click1.y*2-click2.y);
		let p = createVector(mouseX,mouseY);

		let pp = projectPoint2Line(click2,b,p);

		let d = dist(pp.x,pp.y,mouseX,mouseY);
		stw = map(d,0,400,8,120);
		stw = constrain(stw,8,120);
		//stw = map()
		line(click1.x*2-click2.x,click1.y*2-click2.y,click2.x,click2.y);

		ppos[0] = createVector(click1.x*2-click2.x,click1.y*2-click2.y);
		ppos[1] = createVector(click2.x,click2.y);
		ellipse(click1.x*2-click2.x,click1.y*2-click2.y,55,55);
		ellipse(click2.x,click2.y,55,55);

		let tan = createVector(click1.x-click2.x,click1.y-click2.y,0.0);
		tan.normalize();
		let up = createVector(0,0,1);
		let out = tan.cross(up);
		out.setMag(stw*.5);
		line(click1.x+out.x,click1.y+out.y,click1.x - out.x,click1.y-out.y);
	}

	//grab tex1 and feed it back into tex0
	tex0.image(tex1,0,0,width,height);

}

function mousePressed(){
	if(touches.length ===0){
		clicks = (clicks+1)%3;
	}
	if(clicks ==0){

	}
	else if(clicks==1){
		click1 = createVector(mouseX,mouseY);
	}
	else{
		click2 = createVector(mouseX,mouseY);
		lock1 = true;
	}
}

function constructCanvasDim(){
	if(windowHeight<h){
		h = windowHeight - 80;
	}

	if(windowWidth<w){
		w = windowWidth;
	}
}

function projectPoint2Line(a,b,p){
	d1 = p5.Vector.sub(a,b).normalize();
	d2 = p5.Vector.sub(p,a);

	d3 = d1.mult(d2.dot(d1));

	return p5.Vector.add(a,d3);

}
