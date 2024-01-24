console.log("Lex-Warp extension started !!");



var currentIndexWord = 0
var spans;
let errorStrings = ["", "\n", '"', ".", ","]
let paras;
let talkAloud = false;
let currentIndexWordLocation = 0;



let session = {
    'DyslexicFont': {
      'status': false,
      'family': "opendyslexic-regular",
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

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.begin) {
  
        sendResponse({ session: session });
      }
      else {
        console.log(request.session);
        var req = request.session;
  
        session['DyslexicFont'] = req.DyslexicFont;
        session['Ruler']= req.Ruler;
        session['Read']=req.Read;

        console.log(session);

      // Font
        if (session['DyslexicFont']['status']) {
           applyFont("font-family", `${session['DyslexicFont']['family']}`);
           applyFont("font-size", `${session['DyslexicFont']['size']}`);
        } else {
           revertFont("font-family");
           revertFont("font-size");
      }
      // Ruler
      createRuler(session['Ruler']['status'],session['Ruler']['height']);
      
      //Read Aloud
      if(session['Read']['status']){
        talkAloud=true;
      }
      else{
        talkAloud=false;
      }

      //follow text
      createSpans()

      }
    });

//highlight word 
   function createSpans(){
    paras = document.querySelectorAll("p")
  paras.forEach((para, index) => {
    para.classList.add(`p-${index}`)
    words = para.textContent.split(" ")
    words = words.filter(word => {
      if(!errorStrings.includes(word))
        return word
    })
    para.innerHTML = words.map((word, index) => `<span id=${index}>${word}</span>`).join(" ")
    spans = para.querySelectorAll("p span")
    if(spans[currentIndexWord]!== undefined){
    spans[currentIndexWord].style.color = "red"
    }
   })
  }
  window.addEventListener('click', (e) => {
    currentIndexWord = e.target.id
    spans = document.querySelectorAll(`.${e.target.parentElement.className} span`)
    spans.forEach(span => span.style.color = "black")
    spans[currentIndexWord].style.color = "red"
  })
  
  window.addEventListener('keydown', (e)=>{
    spans[currentIndexWord].style.color = "black"
    if(e.key === 'ArrowLeft'){
      currentIndexWord = Math.max(0, currentIndexWord - 1)
    } else if(e.key === 'ArrowRight') {
      currentIndexWord = parseInt(currentIndexWord) + 1
      console.log(talkAloud)
    } else if(e.ctrlKey && talkAloud) {
      console.log('speak')
      speak(spans[currentIndexWord].innerHTML.toString())
    }
    try {
      spans[currentIndexWord].style.color = "red"
    } catch (err) {
      spans = document.querySelectorAll(`.p-${parseInt(spans[0].parentElement.className.split('-')[1]) + 1} span`)
      currentIndexWord = 0
      spans[currentIndexWord].style.color = "red"
    }
    currentIndexWordLocation = spans[currentIndexWord].getBoundingClientRect().top
  })
  


/* Font */

    function applyFont(attr, input) {
        if (attr == "font-size")
          input = `${input}px`;
        const elements = document.querySelectorAll('body *:not(script):not(style):not(head)');
      
        for (let i = 0; i < elements.length; i++)
          elements[i].style.cssText += `${attr}: ${input} !important;
          font-style: normal;
          text-decoration: none;
          text-transform: lowercase;`;
      
      
      };

      function revertFont(attr) {
        const elements = document.querySelectorAll('body *:not(script):not(style):not(head)');
      
        for (let i = 0; i < elements.length; i++)
          elements[i].style.removeProperty(attr);
      }

// Ruler Function
    let ruler;
    function createRuler(active,height){
      ruler=document.querySelector('#readingRuler')
      if(!ruler){
        ruler=document.createElement('div');
        ruler.id='readingRuler';
        document.querySelector('body').appendChild(ruler);
      }
      if(active){
        ruler.style.setProperty('--height', `${height}px`);
        document.addEventListener('mousemove', e => {
            ruler.style.setProperty('--mouse-y', `${e.clientY - (height * 0.66)}px`);
        });
        ruler.style.setProperty('--hue', 'hsl(60, 100%, 50%)');
        ruler.style.setProperty('--opacity', 0.2);
      }
      else{
        ruler.style.setProperty('--opacity',0);
      }
    }


//Read Aloud
function speak(selectedText) {
	// Create a new instance of the SpeechSynthesisUtterance object
  console.log(selectedText);
	const utterance = new SpeechSynthesisUtterance(selectedText);

	// Set the voice and other properties of the utterance as desired
	utterance.voice = speechSynthesis.getVoices()[0];
	utterance.pitch = 1;
	utterance.rate = 1;
	utterance.volume = 1;

	// Call the speech synthesis API to speak the selected text
	window.speechSynthesis.speak(utterance);
}
