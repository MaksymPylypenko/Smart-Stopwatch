// Clock

var ms = 0
var seconds = 0;
var minutes = 0;
var hours = 0;
var clockRunning = false; 
var today = new Date();

function timeToSeconds(hhmmss){
	var time = hhmmss.split(':');
	var seconds = (time[0]) * 60 * 60 + (time[1]) * 60 + (time[2]);  // minutes are worth 60 seconds. Hours are worth 60 minutes.
	return seconds;
}

function currentTime(){ // hh:mm:ss format
	var time = "";
	if(hours == 0) {time = time +'00:';}
	else if(hours<10) {	time = time +'0'+hours+":";}
	else{time = time+hours+":";}



	if(minutes == 0) {time = time +'00:';}
	else if(minutes<10) {time = time +'0'+minutes+":";}
	else{time = time+minutes+":";}

	if(seconds == 0) {time = time +'00';}
	else if(seconds<10) {time = time +'0'+seconds;}
	else{time = time+seconds;}

	return time;
}
  
function stopWatch(){
	ms++;
	
	if( ms == 10){
		ms = 0; 
		seconds++;
		if(seconds > 59){
			seconds = 0;
			minutes++;
			if(minutes > 59){
				minutes = 0;
				hours++;
			}
		}
	}
		
	value = "";
	if(hours>0){
		value = value+hours+"h:";
	}
	
	if(minutes>0){
		value= value+minutes+"m:";
	}
	 
	value = value+seconds+"s:";	
	document.getElementById("clock").innerHTML = value+ms;
}


function startClock(){
	if(!clockRunning){
		thread = window.setInterval(stopWatch,100);
		document.getElementById("start_btn").innerHTML = "PAUSE";
		document.getElementById("clock").style.color = "#FFFFFF";
		document.getElementById("reset_btn").classList.add("disabled");
		document.getElementById("save_btn").classList.add("disabled");		
	}
	else{
		window.clearInterval(thread);
		document.getElementById("clock").style.color = "#666666";
		document.getElementById("start_btn").innerHTML = "CONTINUE";
		document.getElementById("reset_btn").classList.remove("disabled");
		document.getElementById("save_btn").classList.remove("disabled");	
	}	
	clockRunning = !clockRunning;
}	

function resetClock(){
	if(clockRunning){
		window.clearInterval(thread);
		clockRunning = false;
		ms = 0
		seconds = 0;
		minutes = 0;
		hours = 0;
		today = new Date();
	}
	document.getElementById("clock").innerHTML = "0s:0";
	document.getElementById("clock").style.color = "#666666";
	document.getElementById("start_btn").innerHTML = "START";
	document.getElementById("reset_btn").classList.add("disabled");
	document.getElementById("save_btn").classList.add("disabled");	
}	

function deleteRow(r) {
  //console.log("delete pressed");

  var records_table = document.getElementById("records_table");
  var i = r.parentNode.parentNode.rowIndex;
  records_table.deleteRow(i);
  if(records_table.rows.length==1){
	records_table.style.visibility = "hidden";
  }
}


function createRow() {

  var duration_time = currentTime();

  var h = today.getHours() < 10 ? h ="0"+today.getHours() : h = today.getHours();
  var m = today.getMinutes() < 10 ? m ="0"+today.getMinutes() : m = today.getMinutes();  
  var start_time  = h+':'+m;

  var table = document.getElementById("records_table");
  var activity = document.getElementById("question");
  var rowIndex = table.rows.length;
  var activity_name = "";
  if(activity.value == ""){
	activity_name = "Activity "+(rowIndex-1); 
  }else{
	activity_name = activity.value;
  }  
  
  var seconds = timeToSeconds(duration_time);
  if(seconds<longestTime){
	addRow(activity_name, start_time, duration_time, seconds/longestTime);
  }
  resetClock();
}


function addRow(activity_name, start_time, duration, progress_percentage) {
	var table = document.getElementById("records_table");
	
	if(table.rows.length==1){
	  records_table.style.visibility = "visible";
	}
  
	var row = table.insertRow(1);
  
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	var cell5 = row.insertCell(4);
  
	// Duration
	var duration_input = document.createElement("input"); 
	duration_input.className = 'record_entry';  
	duration_input.style.type ='text';  
	duration_input.value = duration;  
	cell3.appendChild(duration_input);
	
	// Activity name
	var activity_input = duration_input.cloneNode(true);  
	activity_input.value = activity_name;
	cell1.appendChild(activity_input);
	
	// Delete button
	var delete_btn = document.createElement("input"); 
	delete_btn.type ='button';  
	delete_btn.value = 'X';  
	delete_btn.onclick=function(){deleteRow(this)};
	cell5.appendChild(delete_btn);  
  
	// Start time
	var start_input = document.createElement("input"); 
	start_input.className = 'record_entry'; 
	start_input.type ='time';  
	start_input.value = start_time;
	cell2.appendChild(start_input);  
  
	// Progress bar
	var svg = d3.create("svg");
  
	svg
	.attr("width", 100)
	.attr("height", 12);
  
	setProgress(svg, progress_percentage);
	d3.select(cell4).append(() => svg.node());
  }




/// Progress bar

function setProgress(svg, value){

  var w = svg.attr("width");
  var h = svg.attr("height");

  var background = svg.selectAll(null)
	.data([value*w])
	.enter()
	.append("rect")
	.attr("height", h)
	.attr("width", w)
	.style("fill", "#222222");
  
  var progress = svg.selectAll(null)
	.data([w])
	.enter()
	.append("rect")
	.attr("height", h)
	.attr("width", value*w)
	.style("fill", "#5A6BFF");
}

// var svg = d3.select("svg");
// setProgress(svg, 12, 100)
  


/////

var response = '{ "records" : [' +
'{ "activity":"Programming" , "start":"13:30", "duration":"00:00:20" },' +
'{ "activity":"Gym" , "start":"10:00", "duration":"00:00:40" }]}';

var obj = JSON.parse(response);
var records = obj.records;
var durations = [];


// find longest time
var longestTime = 0;

records.forEach(function (item) {
	var curr = timeToSeconds(item.duration);
	//console.log(curr);
	durations.push(curr);
	if(longestTime < curr){
		longestTime = curr;
	}
  });
//console.log(longestTime);

// add rows to the table
records.forEach(function (item, index) {
	var progress = durations[index]/longestTime;
	addRow(item.activity,item.start,item.duration, progress);
  });