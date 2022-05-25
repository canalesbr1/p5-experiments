let w = 600;
let h = 600;

let tex0,tex1,tex2,img;
let shader1,shader2;
let col;
let hue;
let rad,off,f;
let area;
let input;
let setimg = false;
let cnt = 0;
let imgdims;
let press = 1;
let sign = 1;
let strength = .4;

function preload(){
	shader1 = loadShader("shader1.vert","shader1.frag");
	shader2 = loadShader("shader2.vert","shader2.frag");
	img = loadImage('defaultimg.jpg');
}

function setup() {

	if(windowHeight<h){
		h = windowHeight - 80;
	}

	if(windowWidth<w){
		w = windowWidth;
	}

	constructCanvasDim(); //custom func to adapt to window size

	var canvas = createCanvas(w, h);
	pixelDensity(1);
	smooth();

	tex1 = createGraphics(width,height,WEBGL);

	tex0 = createGraphics(width,height);
	tex2 = createGraphics(width,height);
	tex0.smooth();


	input = createFileInput(handleFile);
	input.parent("upload");
	canvas.parent("canvas-container");

	imageMode(CENTER);
	tex0.imageMode(CENTER);

	imgdims = imgWH(img,w,h);
	//tex0.background(240);
	tex0.image(img,width/2,height/2,imgdims[0],imgdims[1]);
	tex2.image(img,0,0,imgdims[0],imgdims[1]);

	tex0.noStroke();
	tex0.fill(random(255),random(255),random(255));
	noFill();
	strokeWeight(1);
	stroke(255,0,0);
	rad = 0.4;
	area = 0.2;
	off = random(0.1,.4);
	f = random(12.0,30.0);
	// tex0.colorMode(HSB);
}

function draw() {

	if(setimg){
		imgdims = imgWH(img,w,h);
		tex0.background(240);
		tex0.image(img,width/2,height/2,imgdims[0],imgdims[1]);
		cnt ++;
		if (cnt==5){
			setimg = false;
			cnt = 0;
		}
	}

	if (mouseIsPressed === true){
		press = sign;
	}

	else{
		press = 0.0;
	}

	shader1.setUniform("u_rez",[width,height]);
	shader1.setUniform("tex0",tex0);
	shader1.setUniform("tex2",tex2);
	shader1.setUniform("time",frameCount);
	shader1.setUniform("mouse",[mouseX,mouseY]);
	shader1.setUniform("off",off);
	shader1.setUniform("f",f);
	shader1.setUniform("press",press);
	shader1.setUniform("rad",rad);
	shader1.setUniform("area",area);
	shader1.setUniform("strength",strength);

	tex1.shader(shader1);
	tex1.rect(0,0,width,height);

	tex0.image(tex1,width/2,height/2,width,height);

	shader2.setUniform("u_rez",[width,height]);
	shader2.setUniform("tex0",tex0);

	//BLUR
	// tex1.shader(shader2);
	// tex1.rect(0,0,width,height);

	tex0.image(tex1,width/2,height/2,width,height);


	image(tex0,width/2,height/2);
	// image(tex2,width/2,height/2);

	//feedback


	let r = area*250+50;
	ellipse(mouseX,mouseY,r,r);
	arc(mouseX,mouseY,r+7,r+7,0,TWO_PI*(rad*.8+.2),OPEN);
	arc(mouseX,mouseY,r+14,r+14,0,TWO_PI*(strength*.8+.2),OPEN);

}

function mouseClicked(){
	tex0.fill(random(255),random(255),random(255));
}

function keyPressed() {

  if (keyCode === LEFT_ARROW) {
    rad -= .2;
  } else if (keyCode === RIGHT_ARROW) {
    rad += .2;
  }

	if (keyCode === UP_ARROW) {

		strength += .2;
  } else if (keyCode === DOWN_ARROW) {

		strength -= .2;
  }

	if (key === "z") {
    area -= .2;
  } else if (key === "x") {
    area += .2;
  }

	if (keyCode === SHIFT) {
    sign*=-1;
  }

	rad = constrain(rad,0.0,1.0);
	area = constrain(area,0.0,1.0);
	strength = constrain(strength,0.0,1.0);
}


function constructCanvasDim(){
	if(windowHeight<h){
		h = windowHeight - 80;
	}

	if(windowWidth<w){
		w = windowWidth;
	}
}

function handleFile(file) {
  print(file);
  if (file.type === 'image') {

		tex0.background(245);
    img = createImg(file.data, '');
		img.hide();
		setimg = true;
  }
	else {
    img = null;
  }
}

function imgWH(img,w,h){
	let dims = [];
	let ir = img.width/img.height;
	let cr = h/w;

	if(ir<cr){
		dims[0] = w;
		dims[1] = dims[0] / ir;
		return dims;
	}

	dims[1] = h;
	dims[0] = dims[1] * ir;

	return dims;
}
