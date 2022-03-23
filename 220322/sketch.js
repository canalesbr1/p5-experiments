let w = 600;
let h = 600;

let tex0;
let shader0;


function preload(){
	shader0 = loadShader("shader0.vert","shader0.frag");
}

function setup() {

	constructCanvasDim();

	var canvas = createCanvas(w, h,WEBGL);
	pixelDensity(1);
	smooth();

	tex0 = createGraphics(width,height);
	tex0.clear();
	tex0.background(255);
	tex0.noStroke();

	canvas.parent("canvas-container");
}

function draw() {
	//print(frameRate());
	if(mouseIsPressed){
		tex0.fill(0);
		tex0.ellipse(mouseX,mouseY,40,40);
	}

	shader0.setUniform("u_rez",[width,height]);
	shader0.setUniform("tex0",tex0);

	shader(shader0);
	rect(0,0,-width*.5,-height*.5);

}

function constructCanvasDim(){
	if(windowHeight<h){
		h = windowHeight - 80;
	}

	if(windowWidth<w){
		w = windowWidth;
	}
}

// function mousePressed(){
// 	tex0.fill(255,0,0);
// 	tex0.ellipse(mouseX,mouseY,150,150);
// }
