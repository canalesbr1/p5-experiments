let x,y;

function setup() {
    createCanvas(500,500);
    print("setup function!");
    background(240);
    x =  width/2;
    y = height/2;
}



function draw() {
    fill(0,0,250);
    //float x = sin(frameCount);
    noStroke();
    x = lerp(x,mouseX,.025);
    y = lerp(y,mouseY,.025)
    ellipse(x,y,15,15);
}

function mouseClicked(){
    background(240,100);
}