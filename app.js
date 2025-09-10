//Generates a set of random numbers, ensuring no numbers are repeated
function randomIndexGenerator(upperLimit, indexAmount) {
  const numberIndex = [];
  let randomIndex;
  let indexAmountTracker = 0;
  while (indexAmountTracker < indexAmount) {
    randomIndex = Math.floor(Math.random() * upperLimit);
    //Tracker only increases if a new number is added to the array
    if (!numberIndex.includes(randomIndex)) {
      numberIndex.push(randomIndex);
      indexAmountTracker++;
    }
  }
  return numberIndex;
}

//Pulls number of categories specified in parameter
async function chooseCategories(count, numOfCategories) {
  let res = await axios.get(
    `https://rithm-jeopardy.herokuapp.com/api/categories`,
    { params: { count } }
  );
  //Getting random number array
  const categoryIndex = randomIndexGenerator(count, numOfCategories);
  //Creates array of categories for specified number of categories
  const categoryArray = [];
  for (index of categoryIndex) {
    ({ id, title } = res.data[index]);
    categoryArray.push({ id, title });
  }
  console.log(categoryArray);
}

chooseCategories(14, 6);
