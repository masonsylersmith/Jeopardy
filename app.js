function randomIndexGenerator(upperLimit, indexAmount) {
  const numberIndex = [];
  let randomIndex;
  let indexAmountTracker = 0;
  while (indexAmountTracker < indexAmount) {
    randomIndex = Math.floor(Math.random() * upperLimit);
    if (!numberIndex.includes(randomIndex)) {
      numberIndex.push(randomIndex);
      indexAmountTracker++;
    }
  }
  return numberIndex;
}

async function chooseCategories(count, numOfCategories) {
  let res = await axios.get(
    `https://rithm-jeopardy.herokuapp.com/api/categories`,
    { params: { count } }
  );
  const categoryIndex = randomIndexGenerator(count, numOfCategories);
  console.log(categoryIndex);
  const categoryArray = [];
}

chooseCategories(14, 6);
