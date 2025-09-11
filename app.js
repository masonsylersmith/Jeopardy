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
  // Populating chosen categories array with random indecies and available categories
  for (categoryIndex of categoryIndexList) {
    chosenCategories.push(activeCategoriesArray[categoryIndex]);
  }
  return chosenCategories;
}

function removeFromActiveCategories(activeCategoriesArray, chosenCategories) {
  activeCategoriesIndex = [];
  newActiveCategories = [];
  //Destructure activeCategories array to be an array with id values
  for (category of activeCategoriesArray) {
    activeCategoriesIndex.push(category.id);
  }
  //Splice the values from the active category index to hold the id values for the new set of active category ids... removing the chosen category ids from the index array
  let categorySpliceIndex;
  for (category of chosenCategories) {
    categorySpliceIndex = activeCategoriesIndex.indexOf(category.id);
    activeCategoriesIndex.splice(categorySpliceIndex, 1);
  }
  //Creating a new array with the new active categories
  for (category of activeCategoriesArray) {
    if (activeCategoriesIndex.includes(category.id)) {
      newActiveCategories.push(category);
    }
  }
  return newActiveCategories;
}

async function main() {
  //Initial category population
  let activeCategories = await generateAllCategories(14);
  console.log(activeCategories);
  //Randomly choosing 6 categories for round one
  const chosenCategories = chooseCategories(activeCategories, 6);
  console.log(chosenCategories);
  //Removing the chosen categories from the active categories
  activeCategories = removeFromActiveCategories(
    activeCategories,
    chosenCategories
  );
  console.log(activeCategories);
}

main();
