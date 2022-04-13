let w = 600;
let h = 600;

let tex0,tex1;
let shader1;
let col;
let hue;

function preload(){
	shader1 = loadShader("shader1.vert","shader1.frag");
}

function setup() {

	constructCanvasDim(); //custom func to adapt to window size

	var canvas = createCanvas(w, h);
	pixelDensity(1);
	smooth();

	canvas.parent("canvas-container");

	tex0 = createGraphics(width,height);
	tex0.smooth();

	tex1 = createGraphics(width,height,WEBGL);

	tex0.noStroke();
	tex0.fill(random(255),random(255),random(255));
	noFill();
	strokeWeight(1);
	stroke(255,0,0);
	tex1.background(240);
	tex0.background(240);
	// tex0.colorMode(HSB);
}

function draw() {
	if(frameCount<15){
		tex1.background(240);
		tex0.background(240);
	}

	if (mouseIsPressed){
		tex0.ellipse(mouseX,mouseY,100,100);
	}

	shader1.setUniform("u_rez",[width,height]);
	shader1.setUniform("tex0",tex0);
	shader1.setUniform("time",frameCount)

	tex1.shader(shader1);
	tex1.rect(0,0,width,height);

	image(tex0,0,0);

	tex0.image(tex1,0,0,width,height);


	ellipse(mouseX,mouseY,100,100);

}

function mouseClicked(){
	tex0.fill(random(255),random(255),random(255));
}


function constructCanvasDim(){
	if(windowHeight<h){
		h = windowHeight - 80;
	}

	if(windowWidth<w){
		w = windowWidth;
	}
}
