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

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time

// Scroll

// Get random number up to a maximum number
const getRandomInt = max => {
  return Math.floor(Math.random()*Math.floor(max));
};

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
 const correctEquations = getRandomInt(questionAmount);
 console.log('CorrectEquations:' ,correctEquations);
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
  console.log('EquationsArray:', equationsArray);
}

// Dynamically adding correct/incorrect equations
// function populateGamePage() {
//   // Reset DOM, Set Blank Space Above
//   itemContainer.textContent = '';
//   // Spacer
//   const topSpacer = document.createElement('div');
//   topSpacer.classList.add('height-240');
//   // Selected Item
//   const selectedItem = document.createElement('div');
//   selectedItem.classList.add('selected-item');
//   // Append
//   itemContainer.append(topSpacer, selectedItem);

//   // Create Equations, Build Elements in DOM

//   // Set Blank Space Below
//   const bottomSpacer = document.createElement('div');
//   bottomSpacer.classList.add('height-500');
//   itemContainer.appendChild(bottomSpacer);



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
  createEquations();
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