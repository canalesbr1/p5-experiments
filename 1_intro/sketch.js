let v1;
let x, y;
let mouse;
let toggle;

function setup() {
    frameRate(30);
    const myCanvas = createCanvas(500, 500);
    myCanvas.parent("canvas");
    background(240);

    v1 = createVector(width / 2, height / 2);
    toggle = true;
}

function draw() {

    if (toggle) {
        strokeWeight(0);
        mouse = createVector(mouseX, mouseY);
        v1 = p5.Vector.lerp(v1, mouse, .02);
        fill(sin(frameCount * .05) * 126 + 126, sin(frameCount * .06) * 126 + 126, sin(frameCount * .04) * 126 + 126);

        circle(v1.x, v1.y, 30);
    }
}

function keyPressed() {
    if (key === " ") {
        background(240);
        v1.x = mouseX;
        v1.y = mouseY;
        toggle = true;
    }
}

function mouseClicked() {
    if ((mouseX > 0) && (mouseX < width) && (mouseY > 0) && (mouseY < height)) {
        toggle = !toggle;
        v1.x = mouseX;
        v1.y = mouseY;
        // print(`${mouseX} ${mouseY}`)
    }
}

function saveImage() {
    saveCanvas(myCanvas, 'canvas', 'jpg');
}