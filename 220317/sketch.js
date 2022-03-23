let input;
let img;

let tex0, tex1;
let shader1;

let setimg = false;
let cnt = 0;
let strength = 0;

let lx = 300;
let ly = 300;
let x = 300;
let y = 300;


let ldirx =0;
let ldiry =0;
let dirx = 0;
let diry = 0;

let w = 600;
let h = 600;

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

	var canvas = createCanvas(w, h);
	pixelDensity(1);

	tex1 = createGraphics(width,height,WEBGL);

	tex0 = createGraphics(width,height);
	tex0.background(255);

	input = createFileInput(handleFile);
	input.parent("upload");
	canvas.parent("canvas-container");

	//center and scale image according to canvas size and display size
	let cnva = width/height;
	let imga = img.width/img.height;
	let imgw,imgh
	let offx = 0;
	let offy = 0;

	if(imga > cnva){
		imgh = height;
		imgw = imgh*imga;
		offx = (imgw-width)*-.5;
	}

	else if (imga < cnva){
		imgw = width;
		imgh = imgw/imga;
		offy = (imgh-height)*-.5;
	}

	else{
		imgw = width;
		imgh = height;
	}

	// if(windowWidth<width){
	// 	offx += (width-windowWidth)*-.5;
	// }

	tex0.image(img,offx,offy,imgw,imgh);

	stroke(255,0,0);
	strokeWeight(1);
	noFill();
}

function draw() {
	//weird it doesn't work with a for loop... needs two draw loops?
	if(setimg){
		let cnva = width/height;
		let imga = img.width/img.height;
		let imgw,imgh
		let offx = 0;
		let offy = 0;


		if(imga > cnva){
			imgh = height;
			imgw = imgh*imga;
			offx = (imgw-width)*-.5;
		}

		else if (imga < cnva){
			imgw = width;
			imgh = imgw/imga;
			offy = (imgh-height)*-.5;
		}

		else{
			imgw = width;
			imgh = height;
		}

		// if(windowWidth<width){
		// 	offx += (width-windowWidth)*-.5;
		// }

		tex0.image(img,offx,offy,imgw,imgh);
		cnt ++;
		if (cnt==3){
			setimg = false;
			cnt = 0;
		}
	}

	//update strength
	lx = x;
	ly = y;
	ldirx = dirx;
	ldiry = diry;

	if(mouseIsPressed ===true){
		strength += .2;
		// if(width < 600){
		// 	strength = constrain(strength,0,1.25);
		// }
		strength = constrain(strength,0,1);

		// else{
		//
		// }
		x = lerp(x,mouseX,.075);
		y = lerp(y,mouseY,.075);
	}
	else{
		strength = 0;
		x = mouseX;
		y = mouseY;
	}

	dirx = (lx-x)*30;
	diry = (ly-y)*30;
	dirx = lerp(ldirx,dirx,.35);
	diry = lerp(ldiry,diry,.35);
	//strokeWeight(4);
	//line(x,y,lx+dirx,ly+diry);

	shader1.setUniform("u_rez",[width,height]);
	shader1.setUniform("tex0",tex0);
	shader1.setUniform("mouse",[x,y]);
	shader1.setUniform("dir",[dirx,diry]);
	shader1.setUniform("strength",strength);

	tex1.shader(shader1);
	tex1.rect(0,0,width,height);
	image(tex1,0,0,width,height);

	//interface
	ellipse(x,y,45,45);
	line(x,y,mouseX,mouseY);

	//grab canvas and feed it back into tex0
	tex0.image(tex1,0,0,width,height);
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

function touchStarted(){
	x = mouseX;
	y = mouseY;
}
