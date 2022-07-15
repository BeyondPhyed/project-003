//필요한 변수들 설정 및 선언 
let rad;  //입자 반지름
let x, y, vx, vy, ax, ay, t, H;  //그 밖의 필요한 변수들
let x2, y2, vx2, vy2, ax2, ay2;
let x_0, y_0, vx_0, vy_0, x2_0, y2_0, vx2_0, vy2_0;  //initial values 
let myWidth, myHeight;
let color = [];
let color2 = [];
let writer;
let timeInput = [];
let dateTime = '22'; //2022
let buttonLocate = [];


//초기 셋팅 부분
function setup() {
	initial_setup(60);  //input Hubble's constant.
	graph_setup(0.55, 0.5); //setting for graph origin. should be < 1 each.
	setupCSV();
}

//반복적 작동 부분
function draw() {
	t += 1/60;
	vy = H*y; 
	y += vy;
	
	vy2 += ay2;
	y2 += vy2;
	
	strokeWeight(1);
	
	redShift();
	ellipse(x, y, rad, rad);
	fill(255,255,255);
	ellipse(x2, y2, rad, rad);
	fill(0);
	
	graph();
	consoleData();
	saveData();
}



function initial_setup(_H) { 
	frameRate(20);
	myWidth = windowWidth*0.5;
	myHeight = windowHeight*0.8;
	createCanvas(myWidth, myHeight);  //화면 크기
	
	background(100);  //배경 색(위치를 어디에 둘지 고민해 보기)
	ellipseMode(RADIUS);  //반지름을 기준으로 타원그리기
	
	// set relative particle radius
	rad = myWidth*0.014;  
	if (rad > 14) {
		rad = 14;
	} else if (rad < 7) {
		rad = 7;
	}
	
	t = 0;
	// particle1_initial info
	x_0 = myWidth*0.15; y_0 = myHeight*0.08;  // set x, y initial value
	x = x_0; y = y_0;  // input x, y initial value
	H = _H*0.001;  // Hubble's constant (for your own Universe)
	vy_0 = H * y;	 // set vy initial value
	vy = vy_0;  // input vy initial value
	ay = 0; //0.5;	 //y방향 초기 가속도
		
	// particle2_initial info
	x2_0 = myWidth*0.3; y2_0 = y_0;  // set x2, y2 initial value
	x2 = x2_0; y2 = y2_0;  // input x2, y2 initial value
  ay2 = 0.5;	 //y방향 초기 가속도
	vy2_0 = vy_0;	 // set vy initial value
	vy2 = vy2_0;  // input vy initial value
		
	redShift();
	ellipse(x, y, rad, rad);
	fill(255,255,255);
	ellipse(x2, y2, rad, rad);
	
	console.log('t, vy, vy2'); 
	console.log(round(t, 2) + ',' + round(vy, 2) + ',' + round(vy2, 2));
		
	//create mousePressed_Button
	buttonLocate[0] = myWidth*0.85;
	buttonLocate[1] = myHeight*0.9;
	rect(buttonLocate[0], buttonLocate[1], 90, 30);
	fill(0);
	text('Data output', buttonLocate[0]+myWidth*0.02, buttonLocate[1]+myHeight*0.01, 70, 80);
}


function consoleData() {
	console.log(round(t, 2) + ',' + round(vy, 2) + ',' + round(vy2, 2));
}

function setupCSV() {
	// set current time
	timeInput[0] = month();
	timeInput[1] = day();
	timeInput[2] = hour();
	timeInput[3] = minute();
	timeInput[4] = second(); // not used
		
	for (let i = 0; i < 4; i++) {
    if (timeInput[i] < 10) {
      timeInput[i] = '0' + timeInput[i]; 
    } 
		if (i == 2) {
      dateTime += '_'
    }
		dateTime += timeInput[i]
  }
	
	writer = createWriter('Data_' + dateTime + '.csv');
	writer.print('t, vy, vy2');
	writer.print(round(t,2) + ',' + round(vy,2) + ',' + round(vy2,2));
}

function saveData() {
	writer.print(round(t,2) + ',' + round(vy,2) + ',' + round(vy2,2));
}


function redShift() {
	color[0] = 50 + 5*vy;
	color[2] = 50 - 5*vy;
	if (color[0] >= 255) {
		color[0] = 255;
	}
	if (color[2] >= 0) {
		color[2] = 0;
	}
	fill(color[0],0,color[2]);
}

/*
for (let i = 0; i < 4; i++) {
	if (time[i] < 10) {
		  time[i] = "0" + time[i]; 
		} else {
			time[i] = "" + time[i];
		}
	}
	*/


function mousePressed() { //buttonLocate[0], buttonLocate[1]
  if (mouseX > buttonLocate[0] && mouseX < myWidth*0.9 + 90 && 
			mouseY > buttonLocate[1] && mouseY < buttonLocate[1] + 30) {
    writer.print(',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,' + dateTime);
		writer.close();
    writer.clear();
		
		/* create Dictionary
		createStringDict({
      john: 1940,
      paul: 1942,
      george: 1943,
      ringo: 1940
    }).saveTable('HubbleData_');
		*/
  }
}


// stop when pressed any keyboard
function keyPressed() {	
	if (keyCode === DOWN_ARROW) {
		writer.print(',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,' + dateTime);
    writer.close();
    writer.clear();
  } else if (keyCode === 32) { // Stop, when a spacebar is pressed.
    noLoop();
  }	
}





//graph values
let Zero = []; // coordinate origin

let gph = []; // x, y for graph 
let gph2 = []; // x, y for graph2 
let x_ratio, y_ratio; // x, y ratio for graph
let x2_ratio, y2_ratio ; // x2, y2 ratio for graph

let pgph = []; // previous x, y for graph line
let pgph2 = []; // previous x, y for graph line

let myTextsize;


function graph_setup(_graph_x, _graph_y) {
	// set origin value
	Zero[0] = myWidth*(_graph_x);
  Zero[1] = myHeight*(_graph_y);
	gph[0] = 0; gph[1] = 0;
	gph2[0] = 0; gph2[1] = 0;
  pgph[0] = 0; pgph[1] = - y_0;
	pgph2[0] = 0; pgph2[1] = - y_0;
	x_ratio = myWidth*0.25; y_ratio = myHeight*0.0002;
	
	// set relative text size
	myTextsize = myWidth*0.1*(1 - _graph_x);  //print('TextSize =' + myTextsize);
	if (myTextsize > 25) {
		myTextsize = 25;
	} else if (myTextsize < 15) {
		myTextsize = 15;
	}
	
	// x, y coordinates;
	strokeWeight(2);
	line(Zero[0], Zero[1]*1.5, Zero[0], myTextsize);  // y-coordiante
	line(Zero[0] - myTextsize, Zero[1], myWidth - myTextsize, Zero[1]);  // x-coordiante
		
	// axis texts
	textSize(myTextsize); //textStyle(BOLD);
	fill(0);
	text('t', myWidth - myTextsize*1.5, Zero[1] + myTextsize);
	text('r', Zero[0] - myTextsize, myTextsize*1.5);
	text('0', Zero[0] - myTextsize, Zero[1] + myTextsize);
		
	textSize(myTextsize*0.7);
	text('r0', Zero[0] - 1.5*myTextsize, y_ratio * pgph[1] + Zero[1]);
	line(Zero[0] - 0.5*myTextsize, y_ratio * pgph[1] + Zero[1], Zero[0] + 0.5* myTextsize, y_ratio * pgph[1] + Zero[1]);  // x-coordiante
}


function graph() {
	// set coordinate origin
		
	gph[0] = t; // x-value, t
	gph[1] = - y; // Hubble's law y = r(t)
	gph2[0] = t; 
	gph2[1] = - y2; // y2 = a * t^2
	
	

	
	// Hubble's law graph line
	strokeWeight(3); stroke(255, 0, 0); // setting for graph line
	line(x_ratio * pgph[0] + Zero[0], y_ratio * pgph[1] + Zero[1], x_ratio * gph[0] + Zero[0],  y_ratio * gph[1] + Zero[1]); 
	
	// y = x^2. to compare
	strokeWeight(3); stroke(0, 0, 0); // setting for graph line
	line(x_ratio * pgph2[0] + Zero[0],  y_ratio * pgph2[1] + Zero[1], x_ratio * gph2[0] + Zero[0],  y_ratio * gph2[1] + Zero[1]);
		
	strokeWeight(1); stroke(0); // restore stroke setting
	
	checkInversion();
	
	// save previous values
	pgph[0] = gph[0];
	pgph[1] = gph[1];
	pgph2[0] = gph2[0];
	pgph2[1] = gph2[1];
}

let checkTime = 0;
function checkInversion() {
	if (y >= y2 && checkTime == 0) {
		textSize(myTextsize*0.6);
		text('t=' + round(t,2), x_ratio * gph[0] + Zero[0] + myTextsize*0.2, Zero[1] + myTextsize);
		line(x_ratio * gph[0] + Zero[0], Zero[1]*1.5, x_ratio * gph[0] + Zero[0], myTextsize);  // mark on the graph
		
		line(myWidth*0.12, y, myWidth*0.33, y);  // mark on the background
		checkTime = 1;
	}
}
