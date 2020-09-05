// state of a clock
let ms = 0
let seconds = 0;
let minutes = 0;
let hours = 0;
let clockRunning = false; 


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
		thread = window.setInterval(stopWatch,100);
		document.getElementById("start_btn").innerHTML = "PAUSE";
		document.getElementById("clock").style.color = "#FFFFFF";
		//document.getElementById("save_btn").style.display = "none";
	}
	else{
		window.clearInterval(thread);
		document.getElementById("clock").style.color = "#666666";
		document.getElementById("start_btn").innerHTML = "CONTINUE";
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
	}
	
	document.getElementById("clock").innerHTML = "0s:0";
	document.getElementById("clock").style.color = "#666666";
	document.getElementById("start_btn").innerHTML = "START";
}	

function deleteRow(r) {
  //console.log("delete pressed");
  var i = r.parentNode.parentNode.rowIndex;
  document.getElementById("records_table").deleteRow(i);
}


function addRow() {
  var table = document.getElementById("records_table");
  var activity = document.getElementById("question");
  
  var row = table.insertRow(1);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  
  // cel 3
  var clock_time = document.getElementById("clock").innerHTML;
  var time_input = document.createElement("input"); 
  time_input.className = 'record_entry';  
  time_input.style.type ='text';  
  time_input.value = clock_time;  
  cell3.appendChild(time_input);
  
  // cell 1
  var rowIndex = table.getElementsByTagName("tr").length;
  var activity_text = "";
  if(activity.value == ""){
	 activity_text = "Activity "+rowIndex; 
  }else{
	 activity_text = activity.value;
  }  
  var activity_input = time_input.cloneNode(true);  
  activity_input.value = activity_text;
  cell1.appendChild(activity_input);
  
  // cell 4
  var delete_btn = document.createElement("input"); 
  delete_btn.type ='button';  
  delete_btn.value = 'Delete';  
  delete_btn.onclick=function(){deleteRow(this)};
  cell4.appendChild(delete_btn);  

  // cell 2
  //<td><input class="record_entry" type="time" value="14:03"></td>
  var start_time = document.createElement("input"); 
  start_time.className = 'record_entry'; 
  start_time.type ='time';  

  // adding leading zeroes
  var h = today.getHours() < 10 ? h ="0"+today.getHours() : h = today.getHours();
  var m = today.getMinutes() < 10 ? m ="0"+today.getMinutes() : m = today.getMinutes();  
  start_time.value = h+':'+m;
  cell2.appendChild(start_time);  
}