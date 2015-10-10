
function myFunction() {
    document.getElementById("engine").style.visibility = "visible";
	
}

document.getElementById('engine').onkeydown= myfunction;

function myfunction(){
	var text = document.getElementById('engine').value
    window.location = "http://www.google.com/?q=" + text;
	
}

