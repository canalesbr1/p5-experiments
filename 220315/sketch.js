let graphics;

let img_grab;

let x = 0;
let y = 0;

let active_tool = 0;
let total_tools = 3;

let w = 600;
let h = 600;

function setup() {
	if(windowHeight<h){
		h = windowHeight - 80;
	}

	var canvas = createCanvas(w, h);
	graphics = createGraphics(width,height);
	graphics.clear();

	canvas.parent("canvas-container");
}

function draw() {

		background(245);

		if(active_tool ==0){
			let o = .05;
			let r = map(sin(frameCount*.1),-1,1,0,255);
			let g = map(sin(frameCount*.12+o),-1,1,0,255);
			let b = map(sin(frameCount*.13+o*2),-1,1,0,255);

			graphics.fill(r,g,b);
			graphics.noStroke();

			let s = sin(frameCount*.5)*8;
			let c = cos(frameCount*.5)*8;
			let a = map(sin(frameCount*.5),-1,1,10,25);

			if(mouseIsPressed && touches.length<2){
				x = lerp(x,mouseX,.025);
				y = lerp(y,mouseY,.025);
				graphics.ellipse(x+s,y+c,a,a);
			}

			else{
				x = mouseX;
				y = mouseY;
			}
		}

		else if(active_tool ==1){
			if(mouseIsPressed || touches.length > 0){
				x = lerp(x,mouseX,.025);
				y = lerp(y,mouseY,.025);
				graphics.image(image_grab,x-100,y-5,200,10);
			}

			else{
				x = mouseX;
				y = mouseY;
			}
		}

		else if(active_tool ==2){
			if(mouseIsPressed || touches.length > 0){
				x = lerp(x,mouseX,.025);
				y = lerp(y,mouseY,.025);
				graphics.image(image_grab,x-5,y-100,10,200);
			}

			else{
				x = mouseX;
				y = mouseY;
			}
		}

		image(graphics,0,0);

		// INDICATORS

		if(active_tool == 0){
			noFill();
			stroke(255,0,0);
			strokeWeight(1);
			ellipse(x,y,35,35);
		}
		else if(active_tool == 1){
			noFill();
			stroke(255,0,0);
			strokeWeight(1);
			line(x-100,y,x+100,y);
		}
		else if(active_tool == 2){
			noFill();
			stroke(255,0,0);
			strokeWeight(1);
			line(x,y-100,x,y+100);
		}
		line(x,y,mouseX,mouseY);

}

function keyPressed(){
	if(keyCode == RIGHT_ARROW){
		active_tool = (active_tool + 1) % total_tools;
	}
	if(keyCode == LEFT_ARROW){
		if(active_tool ==0){
			active_tool = total_tools-1;
		}
		else{
			active_tool = (active_tool - 1) % total_tools;
		}
	}
}


function mousePressed(){
	if(active_tool ==1){
		image_grab = graphics.get(mouseX-100,mouseY,200,1);
	}
	else if(active_tool ==2){
		image_grab = graphics.get(mouseX,mouseY-100,1,200);
	}
}

function touchStarted(){
    x = mouseX;
    y = mouseY;
    if(touches.length ==2){
        active_tool = (active_tool + 1) % total_tools;
        //print("changed tool");
    }
    if(active_tool==1){
        image_grab = graphics.get(mouseX-100,mouseY,200,1);
    }
    else if(active_tool==2){
        image_grab = graphics.get(mouseX,mouseY-100,1,200);
    }
}
