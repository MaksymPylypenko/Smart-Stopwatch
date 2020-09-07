fetchRecords(); // load user's data first


/// Stopwatch

var ms = 0
var seconds = 0;
var minutes = 0;
var hours = 0;
var clockRunning = false; 
var startTimeSet = false;
var today = new Date();


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
		if(!startTimeSet){
			today = new Date();
			startTimeSet = true;
		}
		
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
	window.clearInterval(thread);
	clockRunning = false;
	startTimeSet = false;
	ms = 0
	seconds = 0;
	minutes = 0;
	hours = 0;
	
	
	document.getElementById("clock").innerHTML = "0s:0";
	document.getElementById("clock").style.color = "#666666";
	document.getElementById("start_btn").innerHTML = "START";
	document.getElementById("reset_btn").classList.add("disabled");
	document.getElementById("save_btn").classList.add("disabled");	
	document.getElementById("question").value="";
}	


/// Table actions

var local_records = [];
var maxDuration = 0;
var table = document.getElementById("records_table");

function deleteRow(r) {
  //console.log("delete pressed")
	var i = r.parentNode.parentNode.rowIndex;
	table.deleteRow(i);

	var n = table.rows.length;
	if(n==1){
		table.style.visibility = "hidden";
	}

	// No need to fetch all records again, can simply remove the recod in a local copy 
	// and rebuild the table using the current longest time..	
	
	for (var i=n-1; i>0; i--) {
		table.deleteRow(i);
	}
	local_records.splice(n-1, 1);	
	buildTable(local_records);
}


function appendRow(activity_name, start_time, duration_hhmmss, progress_percentage) {
	
	if(table.rows.length==1){ // show up, if inserting the first element
	  records_table.style.visibility = "visible";
	}
  
	var row = table.insertRow(1); // always insert from the top  
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	var cell5 = row.insertCell(4);
  
	// Duration
	var duration_input = document.createElement("input"); 
	duration_input.className = 'record_entry';  
	duration_input.style.type ='text';  
	duration_input.value = duration_hhmmss;  
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


function buildTable(records){
	// find the longest 
	maxDuration = 0;
	records.forEach(function (item) {		
		if(maxDuration < item.duration){
			maxDuration = item.duration;
		}
	});
	
	// build the table
	records.forEach(function (item) {
		var progress = item.duration/maxDuration;
		var duration = secondsToHHMMSS(item.duration);
		var start, n = item.start.length;
		n>5 ? start = item.start.substring(0,n-3) : start = item.start;  // remove seconds '00' and ':'	
		appendRow(item.activity,start,duration,progress);
	});
}


function updateTable(){
	var n = table.getElementsByTagName('tr').length;
	for (var i=n-1; i>0; i--) {
		table.deleteRow(i);
	}
	buildTable(local_records);	  	
}	



/// Client-server communication

function fetchRecords() {
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {  
			var obj = JSON.parse(this.responseText);	
			console.log(this.responseText);
			local_records = obj.records;	
			buildTable(local_records);	  		
		}
		
	};
	req.open("GET","records/", true);
	req.send();  
  }


function makeRecord() {  
	var activity_name = currActivity();
	var start_time = currStartTime();
	var duration_time = clockTime();
	var seconds = clockSeconds();
			
	// Need to send a POST request here...
	// TODO
	// If 200, then
	var new_record = {activity:activity_name, start:start_time, duration:seconds};
	

  	// // send post 
  	var req = new XMLHttpRequest();
	req.open("POST", "records/create/", true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.setRequestHeader("X-CSRFToken", csrftoken);
	req.send(JSON.stringify(new_record));

	req.onreadystatechange = function() { 
	// If the request completed, close the extension popup
	if (req.readyState == 4)
		if (req.status == 200){
			var obj = JSON.parse(req.responseText);			
			new_record.id = obj.id;
			console.log(new_record);
			local_records.push(new_record);
		}
		else{
			alert("Your new Time Record did not reach the server!");
		}
	};

	// We only want to rebuild the table if the longest time was changed
	seconds<maxDuration ? appendRow(activity_name, start_time, duration_time, seconds/maxDuration) : updateTable();
	resetClock(); 
}


/// Converters

function secondsToHHMMSS(seconds){
	var date = new Date(null);
	date.setSeconds(seconds); // specify value for SECONDS here
	return date.toISOString().substr(11, 8);
}

function timeToSeconds(hhmmss){
	var time = hhmmss.split(':');
	var seconds = (time[0]) * 60 * 60 + (time[1]) * 60 + (time[2]);  // minutes are worth 60 seconds. Hours are worth 60 minutes.
	return seconds;
}

function clockTime(){ // hh:mm:ss format
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

function clockSeconds(){
	return hours*60*60 + minutes*60 + seconds;
}



/// Utility 

function currActivity(){
	var activity = document.getElementById("question");
	var rowIndex = table.rows.length;
	var activity_name = "";
	activity.value == "" ? activity_name = "Activity "+(rowIndex-1) : activity_name = activity.value;
	return activity_name;
}

function currStartTime(){
	var h = today.getHours() < 10 ? h ="0"+today.getHours() : h = today.getHours();
	var m = today.getMinutes() < 10 ? m ="0"+today.getMinutes() : m = today.getMinutes();  
	return h+':'+m;
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
	
	if(value>0){
	  var progress = svg.selectAll(null)
	  .data([w])
	  .enter()
	  .append("rect")
	  .attr("height", h)
	  .attr("width", value*w)
	  .style("fill", "#5A6BFF");
	}  
  }