
// ready function to ensure all HTML is loaded before running scripts
$(document).ready(function() {

	// global variables declared here:
	// set of words used in the game
	var wordSet = ["forrest", "leaving", "bramble", "dogwood", "hickory", "redwood", "sequoia", "palmyra", "almonds", "barking"];
	
	// array to capture words alrady used
	var wordsUsed = ["placeholder"];

	// array for the game word letters
	var wordArray = [];

	// variable for the input letter
	var letterChar; 

	// word used to guess against in the round of the game
	var gameWord;

	// variable to store the number of guesses remaining in a game round
	var guesses;

	// alphabet array
	var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

	// variable for managing the game state connected to the number of key presses and which keys
	var loop1 = 0;

	// array to capture the letters already tried
	var lettersTried = [123];

	// array for display of the letters already tried
	var lettersDisplay = [];

	selectWord(wordSet, wordsUsed);
	console.log("the gameWord is: " + gameWord);

	// event listener used to manage the functioning of the game based on key-presses
	window.addEventListener('keyup', function (entry) {
		if (entry.keyCode === 13 && loop1 < 1) {
			//when user hits "enter", change the text on the screen to the difficulty instructions
			$("#text1").html("First, let's decide just how hard we want to make this.  Choose the number of guesses you want per round of the game.<br>NOTE: 20 guesses is really easy, 5 would be really hard.");
			$("#text2").html(">PRESS 'ENTER' KEY TO CONTINUE<");
			loop1++;
			console.log("loop1: " + loop1);
		}

		else if (entry.keyCode === 13 && loop1 < 2) {
			//when user hits "enter", prompt for difficulty level and then change the text on the screen to the game instructions, show the number of guesses
			setDifficulty();
			console.log("guesses (loop): " + guesses);
			$("#text1").html("OK, here we go.  Press a key to choose a letter until you have found all of the hidden letters or you have run out of guesses.  <br>HINT: I think the words have something to do with trees, but I can't figure out why.");
			$("#text2").html(">PRESS A LETTER KEY<");
			loop1++;
			console.log("loop1: " + loop1);
			$("#remaining").html("GUESSES REMAINING: " + guesses);
			return guesses;
		}

		// check to determine if the game has been won
		// else if () {}

		// check to determine if the game has been lost.  If so, alert the user and show final image.
		else if (guesses == 0) {
			changeImage(guesses);
			alert("You didn't make it, sorry!");
			$("#text1").html("<h1>GAME OVER</h1>");
			$("#text2").html("");
		}

		// this is the start of the big tamale!!  here is where all of the action occurs on key presses for letters
		// start by confirming that it IS a letter and there are still guesses remaining
		else if (entry.keyCode > 64 && entry.keyCode < 91 && loop1 > 1 && guesses > 0) {
			var letter = entry.keyCode;
			console.log("letter code: " + letter);

			// determine if the letter selected has already been tried by checking vs. an array of tried letters
			var indexCheck = 0;
			for (var i=0; i<lettersTried.length; i++) {
				console.log("indexCheck (before): " + indexCheck);
				console.log("lettersTried (before):" + lettersTried);
				console.log("letter = " + letter + " | lettersTried[" + i + "] = " + lettersTried[i]);
				if (letter == lettersTried[i]) {
					indexCheck++;
				}
			}

			console.log("indexCheck: " + indexCheck);

			// if it is a new letter, gonna do a bunch of things...
			if (indexCheck == 0) {
				// update the array of letters tried with the new letter
				lettersTried.push(letter);
				console.log("lettersTried: " + lettersTried);
				// display the new list of tried letters on the page
				lettersDisplay.push(alphabet[letter - 65]);
				console.log("lettersDisplay: " + lettersDisplay);
				$("#guesses").html("<span>" + lettersDisplay + "</span>");

			}
			// if the letter was already tried, alert the user to try again
			else {
				alert("You have already tried this letter. Try again.");
			}

			// update the guesses, the display, and the game image
			guesses--;
			$("#remaining").html("GUESSES REMAINING: " + guesses);
			changeImage(guesses);

			// update the word display functionality here:
			// check if the letter is in the word
			var letterChar = alphabet[letter - 65].toLowerCase();
			console.log("letterChar: " + letterChar);
			console.log(typeof(letterChar));
			var wordArray = wordBreakup(gameWord);
			console.log("wordArray (outer): " + wordArray);
			console.log(wordArray);
			var test = letterChar.indexOf(wordArray);
			console.log("indexOf: " + test);

			if (letterChar.indexOf(wordBreakup(gameWord)) >= 0) {
				console.log("letter is in the word");
			}
			else {
				console.log("letter is NOT in the word");
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
			if (word.indexOf(wordsUsed) < 0) {
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
		guesses = prompt("How many guesses would you like?", "5 (hard) to 20 (easy)");
		console.log("guesses (inner): " + guesses);
		return guesses;
	}

});