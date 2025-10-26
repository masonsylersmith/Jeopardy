//Generates a set of random numbers, ensuring no numbers are repeated
function randomIndexGenerator(upperLimit, indexAmount) {
  const numberIndex = [];
  let randomIndex;
  let indexAmountTracker = 0;
  while (indexAmountTracker < indexAmount) {
    randomIndex = Math.floor(Math.random() * upperLimit);
    //If statement to prevent duplicate indices
    if (!numberIndex.includes(randomIndex)) {
      numberIndex.push(randomIndex);
      //Tracker only increases if a new number is added to the array
      indexAmountTracker++;
    }
  }
  return numberIndex;
}

//Generate an array with all the categories... for the purpose of deleting already chosen categories for rounds two and three
async function generateAllCategories(count) {
  //Pulling data from api
  let res = await axios.get(
    `https://rithm-jeopardy.herokuapp.com/api/categories?count=${count}`
  );
  //Populating an array with the available categories
  let allCategoriesArray = [];
  res.data.forEach(({ id, title }) => {
    allCategoriesArray.push({ id, title });
  });
  //Returning an array of objects containing categories id and title
  return allCategoriesArray;
}

//Pulls number of categories specified in parameter
function chooseCategories(activeCategoriesArray, numOfCategories) {
  let chosenCategories = [];
  //Getting random index array
  let categoryIndexList = randomIndexGenerator(
    activeCategoriesArray.length,
    numOfCategories
  );
  // Populating chosen categories array with random indecies and available categories
  for (let categoryIndex of categoryIndexList) {
    chosenCategories.push(activeCategoriesArray[categoryIndex]);
  }
  return chosenCategories;
}

//Returning the clue data in an array with a givin clue id
async function generateClues(clueId) {
  let res = await axios.get(`https://rithm-jeopardy.herokuapp.com/api/category?
id=${clueId}`);
  let categoryClues = [];
  res.data.clues.forEach(({ answer, question, value }) => {
    categoryClues.push({ answer, question, value });
  });
  return categoryClues;
}

//Selecting the category title of each column and populating them with chosen category titles
function populateTitles(chosenCategories) {
  for (let i = 0; i < 6; i++) {
    let categoryTitle = document.querySelector(
      `#gameBoardContainer .categoryColumn:nth-child(${i + 1}) .categoryTitle`
    );
    categoryTitle.innerText = chosenCategories[i].title;
  }
}

//Adding the clues into the array of chosen categories
async function addClues(chosenCategories) {
  for (let i = 0; i < 6; i++) {
    chosenCategories[i].clues = await generateClues(chosenCategories[i].id);
  }
  return chosenCategories;
}

//Populates the prices onto the board
//Also sets class as active for each card
function populatePrices() {
  let price = 200;
  for (let i = 2; i < 7; i++) {
    let categoryPrices = document.querySelectorAll(
      `.categoryColumn .clue:nth-child(${i})`
    );
    categoryPrices.forEach((clue) => {
      clue.innerText = `\$${price}`;
      clue.classList.add("activeClue");
    });
    price += 200;
  }
}

//Function that sets values of popup, then displays the popup
function showPopUp(question, answer) {
  const popup = document.querySelector("#popupBackdrop");
  const popupQuestion = document.querySelector("#popupClue");
  const popupAnswer = document.querySelector("#popupAnswer");
  popupQuestion.textContent = question;
  popupAnswer.textContent = answer;
  popup.style.display = "block";
}

async function generateBoard() {
  //Initial category population
  let activeCategories = await generateAllCategories(14);
  //Randomly choosing 6 categories
  chosenCategories = chooseCategories(activeCategories, 6);
  //Adds clues to chosen categories array
  await addClues(chosenCategories);
  //Populates the category titles
  console.log(chosenCategories);
  populateTitles(chosenCategories);
  populatePrices();
}

//Set chosen categories array to be global in order to keep it persistent across different games
let chosenCategories = [];
//Populating the board on "start game" button press
const startButton = document.querySelector("#gameStartButton");
startButton.addEventListener("click", function () {
  startButton.innerText = "Restart Game";
  startButton.style.border = "4px solid rgb(250, 161, 63)";
  generateBoard();
});

//Selecting all the elements needing to be worked with
const gameBoard = document.querySelector("#gameBoardContainer");
const popup = document.querySelector("#popupBackdrop");
const seeAnswer = document.querySelector("#popupAnswerButton");
const popupAnswer = document.querySelector("#popupAnswer");
const closePopup = document.querySelector("#closePopup");
const categoryColumnList = document.querySelectorAll(".categoryColumn");

//Main gameplay event listener
gameBoard.addEventListener("click", function (event) {
  let clicked = event.target;
  let parentColumn = clicked.parentElement;
  let clueList = parentColumn.querySelectorAll(".clue");
  let clickedCategory;
  //Getting the column number of what was clicked
  for (let i = 0; i < categoryColumnList.length; i++) {
    if (categoryColumnList[i] === parentColumn) {
      clickedCategory = i;
    }
  }
  //Getting the row number of what was clicked
  //Shows popup for that specified clue card
  //Also removes card from future play
  for (let i = 0; i < clueList.length; i++) {
    if (clueList[i] === clicked && clicked.classList.contains("activeClue")) {
      clicked.innerText = "";
      clicked.classList.remove("activeClue");
      showPopUp(
        chosenCategories[clickedCategory].clues[i].question,
        chosenCategories[clickedCategory].clues[i].answer
      );
      console.log(chosenCategories);
    }
  }
  //Events for button clicks in popup
  if (clicked === seeAnswer) {
    seeAnswer.style.display = "none";
    popupAnswer.style.display = "block";
    closePopup.style.display = "block";
  }
  if (clicked === closePopup) {
    seeAnswer.style.display = "block";
    popupAnswer.style.display = "none";
    closePopup.style.display = "none";
    popup.style.display = "none";
  }
});
