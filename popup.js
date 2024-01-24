const toggles = document.querySelectorAll(".section-toggle");

toggles.forEach((toggle) => {
	toggle.addEventListener("change", () => {
		if (toggle.checked) {
			toggle.parentNode.parentNode.parentNode.classList.add("active");
		}
		else {
			toggle.parentNode.parentNode.parentNode.classList.remove("active");
		}
	});
});

var session = {
	'DyslexicFont': {
		'status': false,
		'family': 'opendyslexic-regular',
		'size': 14
	},
	'Ruler': {
		'status': false,
		'height': 24
	},
	'Read':{
		'status': false,
		'text': 'example'
	  }
}

var font_toggle = document.getElementById('FontToggle');
var ruler_toggle= document.getElementById('RulerToggle');
var read_toggle= document.getElementById('ReadAloud');

window.onload = function () {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { begin: "Send Session" }, function (response) {
			session=response.session;
			console.log("updated");
			console.log(session);

		    //font
			document.querySelector(`option[value="${session['DyslexicFont']['family']}"]`).selected = true;
			document.querySelector('#fontsize-num').value = session['DyslexicFont']['size'];
			document.querySelector('#fontsize-slider').value = session['DyslexicFont']['size'];
			if (session['DyslexicFont']['status']) {
				font_toggle.checked = true;
				font_toggle.parentNode.parentNode.parentNode.classList.add("active");
			}
            
			//Ruler
			document.querySelector('#ruler-height-num').value = session['Ruler']['height'];
			document.querySelector('#ruler-height-slider').value = session['Ruler']['height'];
			if (session['Ruler']['status']) {
				ruler_toggle.checked = true;
				ruler_toggle.parentNode.parentNode.parentNode.classList.add("active");
			}

			//ReadAloud
			if(session['Read']['status']){
				read_toggle.checked=true;
			
			}
        });
    });
}


font_toggle.addEventListener('change', function (event) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		session['DyslexicFont']['status'] = font_toggle.checked;
		chrome.tabs.sendMessage(tabs[0].id, { session: session }); //send message to content.js to modify fonts.
	});
});

document.querySelector('select[name=fonttype]').addEventListener('change', event => {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		session['DyslexicFont']['family'] = event.target.value;
		chrome.tabs.sendMessage(tabs[0].id, { session: session });
	});
})

document.querySelector('#fontsize-num').addEventListener('input', function (event) {
	document.querySelector('#fontsize-slider').value = event.target.value;
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		session['DyslexicFont']['size'] = event.target.value;
		chrome.tabs.sendMessage(tabs[0].id, { session: session });
	});
});

document.querySelector('#fontsize-slider').addEventListener('input', function (event) {
	document.querySelector('#fontsize-num').value = event.target.value;
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		session['DyslexicFont']['size'] = event.target.value;
		chrome.tabs.sendMessage(tabs[0].id, { session: session });
	});
});

ruler_toggle.addEventListener('change',function (event) {
	chrome.tabs.query({ active: true, currentWindow: true}, function (tabs){
        session['Ruler']['status'] = ruler_toggle.checked;
		chrome.tabs.sendMessage(tabs[0].id,{session: session});
	});
});

document.querySelector('#ruler-height-num').addEventListener('input',function(event){
	document.querySelector('#ruler-height-slider').value= event.target.value;
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		session['Ruler']['height'] = event.target.value;
		chrome.tabs.sendMessage(tabs[0].id, { session: session });
	});
});

document.querySelector('#ruler-height-slider').addEventListener('input',function(event){
	document.querySelector('#ruler-height-num').value= event.target.value;
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		session['Ruler']['height'] = event.target.value;
		chrome.tabs.sendMessage(tabs[0].id, { session: session });
	});
});

read_toggle.addEventListener('change',function (event){
      chrome.tabs.query({active: true , currentWindow: true}, function(tabs){
		session['Read']['status'] = read_toggle.checked;
		chrome.tabs.sendMessage(tabs[0].id, { session: session });
	  });
})