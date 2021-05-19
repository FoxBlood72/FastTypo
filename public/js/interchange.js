var game = new BaseGame();
function restartEventListener()
{
  var idPageListener = {
    'normal-mode': 'normal.html',
    'normal-mode-topbar' : 'normal.html',
    'homebtn': 'home.html',
    'contactpg' : 'contact.html',
    'mistake' : 'mistake.html',
    'mistake-mode-topbar' : 'mistake.html',
    'visibility' : 'visibility.html',
    'visibility-mode-topbar' : 'visibility.html',
    'admin' : 'login.html'
  };

  for(var id in idPageListener)
  {
    var btn = document.getElementById(id);
    if(btn)
    {
      btn.parentNode.replaceChild(btn.cloneNode(true), btn); // restart event listeners by doing a copy of element
      btn = document.getElementById(id);
      btn.addEventListener('click', (event) => {
        changePage(event.currentTarget.page);
      });
      btn.page = idPageListener[id];
    }
  }

  
}


function restartTitleAnimation(){
  var letters = document.getElementsByClassName('title-letter');
  for(let letter of letters)
  {
    letter.style.animation = 'none';
    letter.offsetHeight;            // reflow
    letter.style.animation = null;  // how??
  }
}


// the function returns true if it's a game page
function changePage(page_location, callback) 
{
  var gamePages = ['normal.html', 'mistake.html', 'visibility.html', 'endgame.html'];
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementsByClassName("info")[0].innerHTML = this.responseText;
      restartTitleAnimation();
      restartEventListener();    
      if(gamePages.includes(page_location))
        {
            console.log(page_location);
            if(page_location === 'mistake.html')
                game = new MistakeGame();
            if(page_location === 'visibility.html')
                game = new VisibilityGame();
            game.setRandomText();
        }
        
      if(callback)
        callback();
    }
  };
  xhttp.open("GET", 'challenges/' + page_location, true);
  xhttp.send();
  game.clearGameContext();
  game = new BaseGame();
}


function initGame()
{
  restartEventListener();
  var hash = window.location.hash.substr(1);
  if(!hash)
    hash = 'home';
  var game = changePage(hash + '.html');
  
}


initGame();
