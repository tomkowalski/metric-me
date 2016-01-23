var a_canvas = document.getElementById("a");
var context = a_canvas.getContext("2d");
var counter = 0;
var percent = .25;

function doMove() {
// Red Rectangle
context.fillStyle = "red";
context.fillRect(0,0,a_canvas.width*counter/100,a_canvas.height);

// Green Rectangle
context.fillStyle = "green";
context.fillRect(0,a_canvas.height-Math.sqrt(percent)*counter*a_canvas.height/100,a_canvas.width*counter/100*Math.sqrt(percent),Math.sqrt(percent)*a_canvas.height);

counter = counter + 1;

if(counter <= 100) {
	setTimeout(doMove,20); // call doMove() in 20 msec
}
}

doMove();