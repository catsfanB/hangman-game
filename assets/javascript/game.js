
// ready function to ensure all HTML is loaded before running scripts
$(document).ready(function() {

	// global variables declared here:
	// set of words used in the game
	var wordSet = ["nesting", "leaving", "bramble", "dogwood", "hickory", "redwood", "sequoia", "palmyra", "almonds", "barking"];
	
	// array to capture words alrady used
	var wordsUsed = ["placeholder"];

	// array for the game word letters
	var wordArray = [];

	// the letter tried by the user in numeric form
	var letter;

	// array for letter box element IDs 
	var lettersId = ["lt0", "lt1", "lt2", "lt3", "lt4", "lt5", "lt6"];

	// variable for the input letter
	var letterChar; 

	// word used to guess against in the round of the game
	var gameWord;

	// variable to adjust the number of guesses remaining in a game round
	var guesses;

	// variable to store the user selected difficulty level as number of guesses
	var setGuesses;

	// audio file variable
	var audio;

	// round tracker variable
	var round = 1;

	// rounds won tracker variable
	var roundsWon = 0;

	// alphabet array
	var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

	// variable for managing the game state connected to the number of key presses and which keys
	var loop1 = 0;

	// array to capture the letters already tried
	var lettersTried = [];

	// array for display of the letters already tried
	var lettersDisplay = [];

	// variable to track correct letters guessed
	var correctLetters = 0;

	// variable for the length of the word
	var arrayLength;

	// variable to determine game is over
	var gameOver = 0;

	// set the initial gameWord
	selectWord(wordSet, wordsUsed);
	console.log("the gameWord is: " + gameWord);

	// event listener used to manage the functioning of the game based on key-presses
	window.addEventListener('keyup', function (entry) {
		//when user hits "enter", change the text on the screen to the difficulty instructions
		if (entry.keyCode === 13 && loop1 < 1) {
			$("#text1").html("First, let's decide just how hard we want to make this.  Choose the number of wrong guesses you are allowed per round of the game.<br>NOTE: 15 guesses is really easy, 5 would be really hard. Remember, my neck is on the line here.");
			$("#text2").html(">PRESS 'ENTER' KEY TO CHOOSE<");
			loop1++;
			console.log("loop1: " + loop1);
		}

		//when user hits "enter", prompt for difficulty level and then change the text on the screen to the game instructions, show the number of guesses
		else if (entry.keyCode === 13 && loop1 < 2) {
			setDifficulty();
			console.log("guesses (loop): " + guesses);
			$("#text1").html("OK, here we go.  Please be good!  Press a key to choose a letter until you have found all of the hidden letters or you have run out of guesses.  <br>HINT: I think the words have something to do with trees, but I can't figure out why.");
			$("#text2").html(">PRESS A LETTER KEY<");
			loop1++;
			console.log("loop1: " + loop1);
			$("#remaining").html("REMAINING WRONG GUESSES ALLOWED: " + guesses);
			//play funky game track
			audio1 = new Audio("assets/sounds/Funkorama.mp3");
			audio1.play();
			changeImage(guesses);
		}

		// this is the start of the big tamale!!  here is where all of the action occurs on key presses for letters
		// start by confirming that it IS a letter and there are still guesses remaining
		else if (entry.keyCode > 64 && entry.keyCode < 91 && loop1 > 1 && guesses >= 0 && gameOver < 1) {
			letter = entry.keyCode;
			console.log("letter code: " + letter);
			// update the game image
			changeImage(guesses);
			// update the game text to show the round number
			$("#text1").html("<h1>ROUND " + round + " of 5</h1>");
			$("#text2").html("Keep choosing letters to get me out of this mess!");

			// if it is a new letter, gonna do a bunch of things...
			if (lettersTried.indexOf(letter) < 0) {
				// update the array of letters tried with the new letter
				lettersTried.push(letter);
				console.log("lettersTried: " + lettersTried);
				// display the new list of tried letters on the page
				lettersDisplay.push(alphabet[letter - 65]);
				console.log("lettersDisplay: " + lettersDisplay);
				$("#guesses").html("<span>" + lettersDisplay + "</span>");

				// update the word display functionality here:
				// check if the letter is in the word
				letterChar = alphabet[letter - 65].toLowerCase();
				console.log("letterChar: " + letterChar);
				wordArray = wordBreakup(gameWord);
				console.log("wordArray (outer): " + wordArray);

				// if letter is in word, change the display of the word boxes corresponding to the letter
				if (wordArray.indexOf(letterChar) >= 0) {
					changeImage(guesses);
					arrayLength = wordArray.length;
					// sound effect for correct entry
					audio2 = new Audio("assets/sounds/Bell-tone.mp3");
					audio2.play();

					console.log("length: " + arrayLength + " | type: " + typeof(arrayLength));
					for (var j=0; j < arrayLength; j++) {
						console.log("letterChar: " + letterChar + " | wordArray[j]: " + wordArray[j]);
						if (letterChar === wordArray[j]) {
							console.log("it happened");
							document.getElementById(lettersId[j]).innerHTML = `${letterChar.toUpperCase()}`;
							correctLetters++;
						}
					}
					checkWin();
				}
				// if the letter is not in the word, check for a loss.  If not a loss, remove one guess and update the guess count
				else {
					// play a wrong entry sound effect
					audio3 = new Audio("assets/sounds/Game-show-buzzer-sound.mp3");
					audio3.play();
					checkLoss();
					if (gameOver < 1) {
						guesses--;
						$("#remaining").html("REMAINING WRONG GUESSES ALLOWED: " + guesses);
					}
				}
			}
			// if the letter was already tried, alert the user to try again
			else {
				alert("You have already tried this letter. Try again.");
			}
		}

	}, false);
	

	// change the game image based on the number of guesses remaining
	// start with happy
	function changeImage(guesses) {
		if(guesses > 10){
			$("#gameImage").attr("src", "assets/images/hangman_backdrop_happy.jpg");
		}
		else if(guesses <= 10 && guesses > 5) {
			$("#gameImage").attr("src", "assets/images/hangman_backdrop_concerned.jpg");
		}
		else if(guesses <= 5 && guesses > 2) {
			$("#gameImage").attr("src", "assets/images/hangman_backdrop_unhappy.jpg");
		}
		else if(guesses <= 2 && guesses > 0) {
			$("#gameImage").attr("src", "assets/images/hangman_backdrop_angry.jpg");
		}
		else if(guesses == 0) {
			$("#gameImage").attr("src", "assets/images/hangman_backdrop_dead.jpg");
		}
	};

	// select the game word from the set defined in wordSet, ensuring it hasn't already been used
	function selectWord(wordSet) {
		for (var i = 0; i<10; i++) {
			var rng = Math.floor(Math.random() * 10);
			var word = wordSet[rng];
			if (wordsUsed.indexOf(word) < 0) {
				gameWord = word;
				wordsUsed.push(gameWord);
				return wordsUsed;
				return gameWord;
				break;
			}
		}
	}

	// create an array from the gameWord
	function wordBreakup(gameWord) {
		wordArray = gameWord.split("");
		console.log("wordArray: " + wordArray);
		return wordArray;
	}

	// prompt the user to select the difficulty level and store the number of guesses to use
	function setDifficulty() {
		setGuesses = prompt("How many guesses would you like?", "5 (hard) to 15 (easy)");
		guesses = setGuesses;
		console.log("guesses (inner): " + guesses);
	}

	// function to determine if the game has been won and follow-on actions
	function checkWin() {
		// check to determine if the round has been won, update counter and take action
		if (correctLetters == arrayLength) {
			roundsWon++;
			console.log("round won");

			// update the WINS counter element
			$("#headerRight").html("ROUND WINS: " + roundsWon);

			// determine if the game has been won and take action
			if (roundsWon == 5) {
				alert("YOU WIN!  Sticky is free to go.");
				$("#text1").html("<h1>YOU WIN!</h1>");
				$("#text2").html("Sticky has been set free.");
				//change game image
				$("#gameImage").attr("src", "assets/images/hangman_backdrop_win.jpg");
				audio1.pause();
				audio5 = new Audio("assets/sounds/Game-over-yeah.mp3");
				audio5.play();	
				gameOver = 1;
			}
			
			else if (roundsWon < 5) {
				alert("ROUND WON!  The word was: "+gameWord + ". On to the next round.")
				round++;
				// change the round text on the screen
				$("#text1").html("<h1>ROUND " + round + " of 5</h1>");
				$("#text2").html("Keep choosing letters to get me out of this mess!");

				// set a new gameWord
				selectWord(wordSet);

				// update wordArray with new gameWord
				wordBreakup(gameWord);

				// reset the number of guesses and update the display
				guesses = setGuesses;
				$("#remaining").html("REMAINING WRONG GUESSES ALLOWED: " + guesses);

				// reset the letters tried and displayed
				lettersTried = [];
				lettersDisplay = [];
				$("#guesses").html("<span>" + lettersDisplay + "</span>");

				// reset the correct guesses
				correctLetters = 0;

				// clear the game board
				arrayLength = wordArray.length;
				for (var k=0; k<arrayLength; k++) {
					document.getElementById(lettersId[k]).innerHTML = "?";
				}

				// restart the funky game track
				audio1.pause();
				audio1 = new Audio("assets/sounds/Funkorama.mp3");
				audio1.play();	
			}
		}
	}

	// check to determine if the game has been lost.  If so, alert the user and show final image.
	function checkLoss() {
		if (guesses == 0) {
			changeImage(guesses);
			alert("Sticky didn't make it this time, sorry!");
			$("#text1").html("<h1>GAME OVER</h1>");
			$("#text2").html("");
			// stop game traack and play death audio track from Pac-Man
			audio1.pause();
			audio4 = new Audio("assets/sounds/Pacman-death-sound.mp3");
			audio4.play();
			gameOver = 1;
		}
	}


});