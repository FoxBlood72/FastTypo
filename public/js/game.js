class BaseGame
{
  constructor()
  {
    this.timerGame = 0;
    this.gameStarted = false;
    this.textGame = "";
    this.end_position = 0;
    this.lengthTextGame = 0;
    this.timePassed = 0;
    this.mistakes = 0;
    this.nonCorectedMistakes = 0;
    this.correctLetters = 0;
    this.ctrlDown = false;
  }

  startGame()
  {
      var startDate = new Date().getTime();
      document.getElementById('timertext').classList.add('animated-timer');
      var self = this;
      this.timerGame = setInterval(() => {
        var now = new Date().getTime();
        self.timePassed = now - startDate;
        var formated = this.getFormattedTime(self.timePassed);

        document.getElementById('seconds').innerText = formated[0];
        document.getElementById('minutes').innerText = formated[1];
        document.getElementById('hours').innerText = formated[2];

        


      }, 1000);
  }

  getFormattedTime(timePassed)
  {
    var seconds = Math.floor((timePassed % (1000 * 60)) / 1000);
    if(seconds < 10)
      seconds = '0' + seconds;
    var minutes = Math.floor((timePassed % (1000 * 60 * 60) / (1000 * 60)));
    if(minutes < 10)
      minutes = '0' + minutes;
    var hours = Math.floor((timePassed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if(hours < 10)
      hours = '0' + hours;

    return [seconds, minutes, hours];
  }


 
  keyPressed(event)
  {
    if(event.keyCode === 17)
      this.ctrlDown = true;
    // let notAllowed = [8, 46, 37, 38, 39, 40, 16, 20, 9, 27, 17, 18];
    if((event.keyCode < 32 || event.keyCode > 96) && event.keyCode < 188 && event.keyCode != 8 || this.ctrlDown)
    {
      event.preventDefault();
      return false;
    }

    if(!this.gameStarted)
    {
      this.gameStarted = true;
      this.startGame();
    }
    
    this.advanceKey(event.key);
  }


  keyUp(event)
  {
    if(event == undefined)
    {
      this.ctrlDown = false;
      return;
    }
    if(event.keyCode === 17)
      this.ctrlDown = false;
  }

  preventClick(event)
  {
      var textarea = event.target;
      textarea.focus();
      textarea.setSelectionRange(this.end_position, this.end_position);
  }

  applyColor(color)
  {
    var charCol = document.getElementById('char' + (this.end_position -1));
    var lastCol = charCol.style.color;
    charCol.style.color = color;
    return lastCol;
  }

  advanceKey(keyValue)
  {
      if(keyValue === 'Backspace')
      {
        if(this.end_position !== 0)
        {
          var prevColor = this.applyColor('black');
          if(prevColor && prevColor === 'red')
            this.nonCorectedMistakes -= 1;
          this.end_position -= 1;
        }
        return;
      }

      this.end_position += 1;

      if(this.textGame[this.end_position - 1] === keyValue)
      {
        this.correctLetters += 1;
        this.applyColor('green');
      }
      else
      {
        this.mistakes += 1;
        this.nonCorectedMistakes += 1;
        this.applyColor('red');
      }
      console.log("Lenght of text is: " + this.lengthTextGame);
      this.checkEndGame();
  }

  checkEndGame()
  {
    if(this.end_position >= this.lengthTextGame)
    {
      this.endGame('endgame.html');
      return;
    }
  }

  clearGameContext()
  {
    clearInterval(this.timerGame);
    this.end_position = 0;
  }

  endGame(page_location)
  {
    this.clearGameContext();
    changePage(page_location, () => {
      var formatted = this.getFormattedTime(this.timePassed);
      var timeFormatted = "";
      for(var timeUnit in formatted)
        timeFormatted = formatted[timeUnit] + ":" + timeFormatted;
      
      timeFormatted = timeFormatted.slice(0, -1);
      var lpm = Math.floor((60 * this.lengthTextGame) / (this.timePassed / 1000)); // cross multiplication
      document.getElementById('mistakes').innerText = this.mistakes;
      document.getElementById('uncorrectedmistakes').innerText = this.nonCorectedMistakes;
      document.getElementById('timepassed').innerText = timeFormatted;
      document.getElementById('lpm').innerText = lpm + ' LPM';
      
    });

  }

  setRandomText()
  {
    var self = this;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var fileTexts = JSON.parse(this.responseText);
        self.textGame = fileTexts['texts'][Math.floor(Math.random() * fileTexts['texts'].length)];
        console.log("Game text is " + self.textGame);
        self.lengthTextGame = self.textGame.length;
        var formatedTextGame = document.createElement('p');
        for(var i = 0; i < self.textGame.length; i++)
        {
          var anchorLetter = document.createElement('a');
          anchorLetter.innerText = self.textGame[i];
          anchorLetter.setAttribute('id', 'char' + i);
          formatedTextGame.appendChild(anchorLetter);
        }
        document.querySelector('#text-game').appendChild(formatedTextGame);
      }
    };
    xhttp.open("GET", 'texts/normal.json', true);
    xhttp.send();
  }

}

class MistakeGame extends BaseGame{
  constructor(){
    super();
    this.fail = false;
  }
  
  checkEndGame()
  {
    if(this.mistakes > 0)
    {
      this.fail = true;
      this.endGame('failgame.html');
      return;
    }
    super.checkEndGame();
  }
}


class VisibilityGame extends BaseGame
{
    constructor()
    {
        super();
    }
    
    applyColor(color)
    {
        console.log('No color');
        return;
    }
}