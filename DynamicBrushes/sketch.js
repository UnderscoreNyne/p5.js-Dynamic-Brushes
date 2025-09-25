/**
 * DATT 2400 Dynamic Brushes Project
 * Description:  Description: Drawing software with multiple brushes: Watercolour brush, curved line brush, splatter brush.
 * Author: Joseph Indovina (joeind23@my.yorku.ca)
 * Date Created: 2025/09/18
 * Last Modified: 2025/09/24
 *
 * Instructions: Run the program.
 * 
 * Mouse and Key Mapping
 *
 * MOUSE
 * drag                : draw
 *
 * KEYS
 * 1-3                 : switch brush
 * =                   : increase the radius
 * -                   : decrease the radius
 * ]                   : increase opacity
 * [                   : decrease opacity
 * '                   : increase amount of shapes per tick
 * ;                   : decrease amount of shapes per tick
 * f                   : toggle fill
 * del, backspace      : erase
 * s                   : save png
 */

// shape/brush settings
let x = [];
let y = [];

let shapeRadius = 50;
let shapeResolution = 30;
let stepSize = 1;
let shapeType = 0;
let filled = true;

let timer = 0;
let prevX;
let prevY;

let speed;

// colour customization variables
let colourPicker;
let strokeColor;
let backgroundColor;

let r = 0;
let g = 0;
let b = 0;
let a = 220;

// input boxes as temp gui
let radiusInput;
let stepInput;
let opacityInput;
let brushTypeInput;

function setup() {
  createCanvas(windowWidth, windowHeight);

  backgroundColor = 255;
  strokeWeight(0.75);
  background(backgroundColor);

  // create colour picker and initialize GUI.
  colourPicker = createColorPicker('#000000');
  colourPicker.position(10,90);
  updateGui();
  
  setShape1(shapeRadius, shapeResolution);
}

function setShape1(radius, resolution) {
  let unitAngle = radians(360/resolution);
  
  for(let i = 0; i < resolution; i++) {
    if(random(shapeResolution*0.3)<=shapeResolution*0.3-1){ // normal circular points
      x[i] = cos(unitAngle * i) * radius;
      y[i] = sin(unitAngle * i) * radius;
    } else { // extended points if random chance hits
      x[i] = cos(unitAngle * i) * (radius*1.3);
      y[i] = sin(unitAngle * i) * (radius*1.3);
    }
  }  
}

function draw() {
  // set strokeColor based on colour picker settings/opacity
  strokeColor = colourPicker.color();
  strokeColor.setAlpha(a);
  stroke(strokeColor);

  if (mouseIsPressed && mouseButton == LEFT) {
    for(let i = 0; i<stepSize; i++){
      push();
      switch(shapeType) {
        case 0: {
          translate(mouseX, mouseY);
          drawShape1();
          break;
        }
        case 1: {
          // no translate here, the line is determined using the previous mouse position rather than moving a fixed shape.
          drawShape2();
          break;
        }
        case 2: {
          translate(mouseX, mouseY);
          drawShape3();2
          break;
        }
        default:
      }
      pop();
    }
  } else {
    // reset timer and previous mouse location when mouse is unpressed
    prevX = mouseX;
    prevY = mouseY;
    timer = 0;
    speed = 0;
  }
}

function drawShape1() {
  // determine mouse speed
  if(speed<dist(mouseX,mouseY, pmouseX,pmouseY) && (speed*(shapeRadius*0.01))<shapeRadius){
    speed = dist(mouseX,mouseY, pmouseX,pmouseY);
  }

  let dia = speed*(shapeRadius*0.01); // determine diameter based on speed.
  let opacity = (a*0.2)+timer; // determine opacity based on how long the mouse has been held.

  push();
  strokeColor.setAlpha(opacity);

  if(filled){
    fill(strokeColor);
    noStroke();
  } else {
    stroke(strokeColor);
    noFill();
  }

  setShape1(dia, shapeResolution); // determine coordinates

  rotate(random(360)); // randomly rotate shape

  // create shape
  beginShape();
  
  curveVertex(x[shapeResolution - 1], y[shapeResolution - 1]);

  for (let i = 0; i < shapeResolution; i++) {
    curveVertex(x[i], y[i]); // create/connect points
  }
  
  curveVertex(x[0], y[0]);
  curveVertex(x[1], y[1]);
  endShape();
  pop();

  push();
  for(let i = 0; i<dia*0.2; i++){ // add dots onto brush
    if(filled) noStroke(); else noFill(); 
    if(filled) fill(backgroundColor); // fill dots with background colour
    circle(random(-dia,dia),random(-dia,dia), random(-dia*0.05,dia*0.1));
    if(filled) fill(strokeColor); // fill outside dots with stroke colour
    circle(random(-dia,dia),random(-dia,dia), random(-dia*0.1,dia*0.4));
  }
  pop();

  if(timer < a){
    timer+=5;
  }
}

function drawShape2() {
  strokeWeight(2);
  // start timer to determine time between each set of lines.
  if(timer == shapeRadius*0.4){
    prevX = pmouseX;
    prevY = pmouseY;
    timer = 0;
  }

  noFill();
  
  // create curve
  beginShape();
  curveVertex(mouseX, (mouseY+((mouseY-prevY)*(shapeRadius*0.1)))); 
  
  // curve goes from current mouse position to previous mouse position
  curveVertex(mouseX, mouseY);  
  curveVertex(prevX, prevY);
  
  curveVertex(prevX, prevY);
  endShape();

  // increment timer
  timer+=1
}

function drawShape3() {
  strokeColor.setAlpha(a);
  
  if(filled){
    fill(strokeColor);
    noStroke();
  } else {
    stroke(strokeColor);
    noFill();
  }

  if(random(2)<=1){
    circle(random(-shapeRadius*0.4,shapeRadius*0.4), random(-shapeRadius*0.4,shapeRadius*0.4), random(shapeRadius*0.5)); // place inner circles
  } else {
    circle(random(-shapeRadius,shapeRadius), random(-shapeRadius,shapeRadius), random(shapeRadius*0.2)); // place outer circles
  } 
}

function updateGui(){
  // create gui boxes.
  radiusInput = createInput("Radius: "+shapeRadius);
  radiusInput.position(10,10);
  radiusInput.size(AUTO, 10);

  stepInput = createInput("Density: "+stepSize);
  stepInput.position(10,30);
  stepInput.size(AUTO, 10);

  opacityInput = createInput("Opacity: "+a);
  opacityInput.position(10,50);
  opacityInput.size(AUTO, 10);

  brushTypeInput = createInput("Brush Type: "+(shapeType+1));
  brushTypeInput.position(10,70);
  brushTypeInput.size(AUTO, 10);
  
}

function keyReleased() {
  if (keyCode == DELETE || keyCode == BACKSPACE) {
    background(backgroundColor);
  }
  
  if (key == 's' || key == 'S') {
    let fileName = 'image_' + year() + month() + day() + hour() + minute() + second();
    saveCanvas(fileName, 'png');
  }
  
  if (key == '=') {
    shapeRadius += 5;
    setShape1(shapeRadius, shapeResolution);
  }
  
  if (key == '-') {
    shapeRadius -= 5;
    if(shapeRadius < 5) shapeRadius = 5;
    setShape1(shapeRadius, shapeResolution);
  }
  
  if (key == 'f' || key == 'F') filled = !filled;
  
  if (key == '1') shapeType = 0
  if (key == '2') shapeType = 1;
  if (key == '3') shapeType = 2;

  if(key == '[' && a>=10) a -= 5;
  if(key == ']' && a<=250) a += 5;

  if(key == ';' && stepSize>=2) stepSize -= 1;
  if(key == '\'') stepSize += 1;
  
  updateGui(); // update gui to show new information updated by keystroke.
}
