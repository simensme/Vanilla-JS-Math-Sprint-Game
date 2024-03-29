// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';

// Scroll
let valueY = 0;

// Refresh splash-page best scores
const bestScoresToDOM = () => {
  bestScores.forEach((bestScore, index) => {
    const bestScoreEl = bestScore;
    bestScoreEl.textContent = `${bestScoreArray[index].bestScore}s`;
  });
};

// Check Local Storage for best scores, set bestscore array
const getSavedBestScores = () => {
  if (localStorage.getItem('bestScores')){
    bestScoreArray = JSON.parse(localStorage.bestScores);
  } else {
    bestScoreArray = [
      {questions: 10, bestScore: finalTimeDisplay},
      {questions: 25, bestScore: finalTimeDisplay},
      {questions: 50, bestScore: finalTimeDisplay},
      {questions: 100, bestScore: finalTimeDisplay},
    ];
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
  }
  bestScoresToDOM();
};

// Update Best Score Array
const updateBestScore = () => {
  bestScoreArray.forEach((score, index) => {
    // Select correct best score to update
    if (questionAmount == score.questions){
      // return the best score as a number with one decimal
      const savedBestScore = Number(bestScoreArray[index].bestScore);
      // Update if the new final score is less or replacing zero
      if (savedBestScore === 0 || savedBestScore > finalTime){
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }
  });
  // Update our splash page
  bestScoresToDOM();
  // Save to local storage
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
};

// Reset Game, play again
const playAgain = () => {
  gamePage.addEventListener('click', startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;
};

// Show score page
const showScorePage = () => {
  // Show play again button after 1s
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 750);
  gamePage.hidden = true;
  scorePage.hidden = false;
};

// Format & Display time in DOM
const scoresToDOM = () => {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Base Time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  updateBestScore();
  // Scroll to Top, go to Score Page
  itemContainer.scrollTo({ top: 0, behavior: 'instant'});
  showScorePage();
};

// Stop timer and process results, go to score page
const checkTime = () => {
  console.log(timePlayed);
  if (playerGuessArray.length == questionAmount) {
    console.log('PlayerGuessArray: ', playerGuessArray);
    clearInterval(timer);
    // Check for wrong guesses, add penalty time
    equationsArray.forEach((equation, index) => {
      if (equation.evaluated === playerGuessArray[index]) {
        // Correct Guess, No Penalty
      } else {
        // Incorrect guess, add penalty
        penaltyTime += 0.5;
      }
    });
    finalTime = timePlayed + penaltyTime;
    console.log('Time', timePlayed, 'penalty', penaltyTime, 'final', finalTime);
    scoresToDOM();
  }
};

// Add a tenth of a second to timePlayed
const addTime = () => {
  timePlayed += 0.1;
  checkTime();
};

// Start of timer when the game page is clicked
const startTimer = () => {
  // Reset times
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener('click', startTimer);
};

// Scroll and store the user selection in the player guess array
const select = guessedTrue => {
  // Scroll 80 pixels to center it on the item
  valueY += 80;
  itemContainer.scroll(0, valueY);
  // Add player guess to the array
  return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false');
};


// Display game page
const showGamePage = () => {
  gamePage.hidden = false;
  countdownPage.hidden = true;
};

// Get random number up to a maximum number
const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  console.log('CorrectEquations:', correctEquations);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  console.log('WrongEquations:', wrongEquations);
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}

// Add the equations to the DOM
const equationsToDOM = () => {
  equationsArray.forEach(equation => {
    // item
    const item = document.createElement('div');
    item.classList.add('item');
    // equation text
    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;
    // Append to DOM
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
};

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}


// running the countdown
const countdownStart = () => {
  countdown.textContent = '3';
  const countdownValues = ['2', '1', 'GO!'];
  const countdownTimings = [1000, 2000, 3000];
  countdownValues.forEach((value, i) => {
    setTimeout(() => {
      countdown.textContent = value;
    }, countdownTimings[i]);
  });
};

// Navigate from splash page to countdown
const showCountdown = () => {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  countdownStart();
  populateGamePage();
  setTimeout(showGamePage, 4000);
};

// Get the value from our selected radio button
const getRadioValue = () => {
  let radioValue;
  radioInputs.forEach(el => {
    if (el.checked) {
      radioValue = el.value;
    }
  });
  return radioValue;
};

// Form that decides amount of questions
const selectQuestionAmount = e => {
  e.preventDefault();
  questionAmount = getRadioValue();
  console.log('Quesiton Amount:', questionAmount);
  if (questionAmount) {
    showCountdown();
  }
};

startForm.addEventListener('click', () => {
  radioContainers.forEach(el => {
    // Remove the selected label
    el.classList.remove('selected-label');
    // Add the selected-label back if the radio input is checked
    if (el.children[1].checked) {
      el.classList.add('selected-label');
    }
  });
});

// Event Listeners
startForm.addEventListener('submit', selectQuestionAmount);
gamePage.addEventListener('click', startTimer);

// On mount
getSavedBestScores();