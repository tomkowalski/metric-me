/*
doMove(percent, initialValue, totalTime)
  percent is the percentage area of the red square that should be green (between 0 and 1)
  initialValue is the length and width of the green square in the first instant (between .5 and 5) (small # means slow start, quick accel, large # means faster start, slower accel)
  totalTime is the amount of time in seconds it takes to finish moving (between .1 and 10)
*/
function box(context, percent) {
	console.log(percent);
	doMove(context, percent, 5, 4);
}
function doMove(context, percent, initialValue, totalTime) {
	redraw(percent, initialValue, totalTime, Math.pow(100/initialValue, .01), context);
}
 
function redraw(percent, counter, totalTime, multiplier, context) {
	context.fillStyle = "red";
	context.fillRect(0,0,context.canvas.clientWidth*counter/100,context.canvas.clientHeight);
	 
	context.fillStyle = "green";
	context.fillRect(0,context.canvas.clientHeight-Math.sqrt(percent)*counter*context.canvas.clientHeight/100,
					context.canvas.clientWidth*counter/100*Math.sqrt(percent),
					Math.sqrt(percent)*context.canvas.clientHeight);
	 
	counter = counter * multiplier;
	 
	if(counter <= 100) {
	    setTimeout(function() {
	  		redraw(percent, counter, totalTime, multiplier, context);
	  	},totalTime*10);
	}
}
 
///doMove(.7, 5, 4);