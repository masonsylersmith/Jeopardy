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
  chosenCategories = [];
  //Getting random index array
  categoryIndexList = randomIndexGenerator(
    activeCategoriesArray.length,
    numOfCategories
  );
  // Populating chosen categories array with random indecies and available categories
  for (categoryIndex of categoryIndexList) {
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
async function getClues(chosenCategories) {
  for (let i = 0; i < chosenCategories.length; i++) {
    chosenCategories[i].clues = await generateClues(chosenCategories[i].id);
  }
  return chosenCategories;
}

function populatePrices() {
  let price = 200;
  for (let i = 2; i < 7; i++) {
    let categoryPrices = document.querySelectorAll(
      `.categoryColumn .clue:nth-child(${i})`
    );
    categoryPrices.forEach((clue) => {
      clue.innerText = `\$${price}`;
    });
    price += 200;
  }
}

async function main() {
  //Initial category population
  let activeCategories = await generateAllCategories(14);
  //Randomly choosing 6 categories
  let chosenCategories = chooseCategories(activeCategories, 6);
  populateTitles(chosenCategories);
  populatePrices();
  getClues(chosenCategories);
  console.log(chosenCategories);
}

main();
