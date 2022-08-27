import ancients from "./data/ancients.js";
import blueCards from "./data/mythicCards/blue/index.js";
import brownCards from "./data/mythicCards/brown/index.js";
import greenCards from "./data/mythicCards/green/index.js";

const ancientImage = document.querySelector(".ancient__image");
const ancientLeft = document.querySelector(".ancient__controls-left");
const ancientRight = document.querySelector(".ancient__controls-right");

let currentAncient = 0;

ancientRight.onclick = () => {
  if (currentAncient < ancients.length - 1) currentAncient++;
  else currentAncient = 0;
  ancientImage.src = ancients[currentAncient].cardFace;
};

ancientLeft.onclick = () => {
  if (currentAncient > 0) currentAncient--;
  else currentAncient = ancients.length - 1;
  ancientImage.src = ancients[currentAncient].cardFace;
};

const buttons = document.querySelectorAll(".button");
const veryEasy = document.querySelector(".difficulty__button-veryeasy");
const easy = document.querySelector(".difficulty__button-easy");
const normal = document.querySelector(".difficulty__button-normal");
const hard = document.querySelector(".difficulty__button-hard");
const veryHard = document.querySelector(".difficulty__button-veryhard");

let difficult = 2;

veryEasy.onclick = () => {
  buttons.forEach((button) => {
    button.classList.remove("marked");
  });
  veryEasy.classList.add("marked");
  difficult = 0;
};

easy.onclick = () => {
  buttons.forEach((button) => {
    button.classList.remove("marked");
  });
  easy.classList.add("marked");
  difficult = 1;
};

normal.onclick = () => {
  buttons.forEach((button) => {
    button.classList.remove("marked");
  });
  normal.classList.add("marked");
  difficult = 2;
};

hard.onclick = () => {
  buttons.forEach((button) => {
    button.classList.remove("marked");
  });
  hard.classList.add("marked");
  difficult = 3;
};

veryHard.onclick = () => {
  buttons.forEach((button) => {
    button.classList.remove("marked");
  });
  veryHard.classList.add("marked");
  difficult = 4;
};

const deckButton = document.querySelector(".deck__button");
const deckOverlay = document.querySelector(".deck__overlay");

deckButton.onclick = startGame;

let firstStageCards = [];
let secondStageCards = [];
let thirdStageCards = [];
let currentStage = 1;

const deck = document.querySelector(".deck__hidden");
const shown = document.querySelector(".shown__image");
const firstGreen = document.querySelector(".first__green");
const firstBrown = document.querySelector(".first__brown");
const firstBlue = document.querySelector(".first__blue");
const secondGreen = document.querySelector(".second__green");
const secondBrown = document.querySelector(".second__brown");
const secondBlue = document.querySelector(".second__blue");
const thirdGreen = document.querySelector(".third__green");
const thirdBrown = document.querySelector(".third__brown");
const thirdBlue = document.querySelector(".third__blue");

deck.onclick = () => {
  if (currentStage == 1) {
    shown.src = firstStageCards[firstStageCards.length - 1].cardFace;
    firstStageCards.pop();
    if (firstStageCards.length == 0) currentStage = 2;
  } else if (currentStage == 2) {
    shown.src = secondStageCards[secondStageCards.length - 1].cardFace;
    secondStageCards.pop();
    if (secondStageCards.length == 0) currentStage = 3;
  } else if (currentStage == 3) {
    shown.src = thirdStageCards[thirdStageCards.length - 1].cardFace;
    thirdStageCards.pop();
    if (thirdStageCards.length == 0) deck.classList.add("hidden");
  }
  updateCounter();
};

function startGame() {
  let counts = getCardsCount(currentAncient);
  let blue = getCardPool(counts.blue, difficult, blueCards);
  let brown = getCardPool(counts.brown, difficult, brownCards);
  let green = getCardPool(counts.green, difficult, greenCards);

  veryEasy.onclick = null;
  easy.onclick = null;
  normal.onclick = null;
  hard.onclick = null;
  veryHard.onclick = null;
  ancientRight.onclick = null;
  ancientLeft.onclick = null;

  firstStageCards = firstStageCards.concat(
    blue.splice(0, ancients[currentAncient].firstStage.blueCards),
    brown.splice(0, ancients[currentAncient].firstStage.brownCards),
    green.splice(0, ancients[currentAncient].firstStage.greenCards)
  );
  secondStageCards = secondStageCards.concat(
    blue.splice(0, ancients[currentAncient].secondStage.blueCards),
    brown.splice(0, ancients[currentAncient].secondStage.brownCards),
    green.splice(0, ancients[currentAncient].secondStage.greenCards)
  );
  thirdStageCards = thirdStageCards.concat(
    blue.splice(0, ancients[currentAncient].thirdStage.blueCards),
    brown.splice(0, ancients[currentAncient].thirdStage.brownCards),
    green.splice(0, ancients[currentAncient].thirdStage.greenCards)
  );
  shuffle(firstStageCards);
  shuffle(secondStageCards);
  shuffle(thirdStageCards);

  updateCounter();

  deckOverlay.classList.add("hidden");
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getCardsCount(ancient) {
  const data = ancients[ancient];
  return {
    green:
      data.firstStage.greenCards +
      data.secondStage.greenCards +
      data.thirdStage.greenCards,
    brown:
      data.firstStage.brownCards +
      data.secondStage.brownCards +
      data.thirdStage.brownCards,
    blue:
      data.firstStage.blueCards +
      data.secondStage.blueCards +
      data.thirdStage.blueCards,
  };
}

function getCardPool(count, difficult, source) {
  let cardPool;
  let mainBuffer;
  let secondBuffer;

  if (difficult == 0) {
    mainBuffer = source.filter((card) => card.difficulty == "easy");
    secondBuffer = source.filter((card) => card.difficulty == "normal");
    shuffle(mainBuffer);
    shuffle(secondBuffer);
    if (mainBuffer.length < count) {
      cardPool = mainBuffer.concat(
        secondBuffer.splice(0, count - mainBuffer.length)
      );
    } else if (mainBuffer.length == count) {
      cardPool = mainBuffer;
    } else if (mainBuffer.length > count) {
      cardPool = mainBuffer.splice(0, count);
    }
  }

  if (difficult == 1) {
    mainBuffer = source.filter((card) => card.difficulty != "hard");
    shuffle(mainBuffer);
    cardPool = mainBuffer.splice(0, count);
  }

  if (difficult == 2) {
    mainBuffer = source;
    shuffle(mainBuffer);
    cardPool = mainBuffer.splice(0, count);
  }

  if (difficult == 3) {
    mainBuffer = source.filter((card) => card.difficulty != "easy");
    shuffle(mainBuffer);
    cardPool = mainBuffer.splice(0, count);
  }

  if (difficult == 4) {
    mainBuffer = source.filter((card) => card.difficulty == "hard");
    secondBuffer = source.filter((card) => card.difficulty == "normal");
    shuffle(mainBuffer);
    shuffle(secondBuffer);
    if (mainBuffer.length < count) {
      cardPool = mainBuffer.concat(
        secondBuffer.splice(0, count - mainBuffer.length)
      );
    } else if (mainBuffer.length == count) {
      cardPool = mainBuffer;
    } else if (mainBuffer.length > count) {
      cardPool = mainBuffer.splice(0, count);
    }
  }

  shuffle(cardPool);
  return cardPool;
}

function updateCounter() {
  firstGreen.textContent = firstStageCards.filter(
    (card) => card.color == "green"
  ).length;
  firstBrown.textContent = firstStageCards.filter(
    (card) => card.color == "brown"
  ).length;
  firstBlue.textContent = firstStageCards.filter(
    (card) => card.color == "blue"
  ).length;

  secondGreen.textContent = secondStageCards.filter(
    (card) => card.color == "green"
  ).length;
  secondBrown.textContent = secondStageCards.filter(
    (card) => card.color == "brown"
  ).length;
  secondBlue.textContent = secondStageCards.filter(
    (card) => card.color == "blue"
  ).length;

  thirdGreen.textContent = thirdStageCards.filter(
    (card) => card.color == "green"
  ).length;
  thirdBrown.textContent = thirdStageCards.filter(
    (card) => card.color == "brown"
  ).length;
  thirdBlue.textContent = thirdStageCards.filter(
    (card) => card.color == "blue"
  ).length;
}
