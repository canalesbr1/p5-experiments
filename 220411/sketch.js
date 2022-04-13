let w = 600;
let h = 600;

let tex0,tex1,tex2,img;
let shader1;
let col;
let hue;
let rad,off,f;
let input;
let setimg = false;
let cnt = 0;
let imgdims;

function preload(){
	shader1 = loadShader("shader1.vert","shader1.frag");
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


	// input = createFileInput(handleFile);
	// input.parent("upload");
	canvas.parent("canvas-container");

	imageMode(CENTER);
	tex0.imageMode(CENTER);

	imgdims = imgWH(img,w,h);
	tex0.background(240);
	tex2.image(img,0,0,imgdims[0],imgdims[1]);

	tex0.noStroke();
	tex0.fill(random(255),random(255),random(255));
	noFill();
	strokeWeight(1);
	stroke(255,0,0);
	rad = 50.0;
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


	// if (mouseIsPressed){
	// 	//tex0.ellipse(mouseX,mouseY,rad,rad);
	// 	let o = 6;
	// 	for(let i = 0; i<width+o;i+=o){
	// 		// tex0.fill(random(255),random(255),random(255));
	// 		for(let j = 0; j<height+o;j+=o){
	// 			// tex0.fill(random(255),random(255),random(255));
	// 			tex0.ellipse(i,j,3,3);
	// 		}
	// 	}
	// }

	if (mouseIsPressed){
		tex0.ellipse(mouseX,mouseY,rad,rad);
	}

	// if (mouseIsPressed){
	// 	for(let i = 0; i<10 ; i++){
	// 		tex0.fill(random(255),random(255),random(255));
	// 		tex0.ellipse(mouseX+random(-20,20),mouseY+random(-20,20),15,15);
	// 	}
	// }

	shader1.setUniform("u_rez",[width,height]);
	shader1.setUniform("tex0",tex0);
	shader1.setUniform("tex2",tex2);
	shader1.setUniform("time",frameCount);
	shader1.setUniform("mouse",[mouseX,mouseY]);
	shader1.setUniform("off",off);
	shader1.setUniform("f",f);

	tex1.shader(shader1);
	tex1.rect(0,0,width,height);


	image(tex0,width/2,height/2);
	// image(tex2,width/2,height/2);

	//feedback
	tex0.image(tex1,width/2,height/2,width,height);


	ellipse(mouseX,mouseY,rad,rad);

}

function mouseClicked(){
	tex0.fill(random(255),random(255),random(255));
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    rad /= 2;
  } else if (keyCode === RIGHT_ARROW) {
    rad *= 2;
  }
	rad = constrain(rad,25,200);
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
