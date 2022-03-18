let input;
let img;

function setup() {
	var canvas = createCanvas(600, 600,WEBGL);
	pixelDensity(1);
	noStroke();
	background(240);

	input = createFileInput(handleFile);
	input.parent("upload-container");
	canvas.parent("canvas-container");
}

function draw() {

}

function handleFile(file) {
  print(file);
  if (file.type === 'image') {
    img = createImg(file.data, '');
    img.hide();
  } else {
    img = null;
  }
}
