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
    `https://rithm-jeopardy.herokuapp.com/api/categories`,
    { params: { count } }
  );
  //Populating an array with the available categories
  allCategoriesArray = [];
  res.data.forEach((category) => {
    ({ id, title } = category);
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
  for (categoryIndex of categoryIndexList) {
    chosenCategories.push(activeCategoriesArray[categoryIndex]);
  }
  return chosenCategories;
}

async function main() {
  const activeCategories = await generateAllCategories(14);
  const chosenCategories = chooseCategories(activeCategories, 6);
  console.log(chosenCategories);
}

main();
