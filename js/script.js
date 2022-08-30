import ancientsData from "../data/ancients.js";
import cardsData from "../data/mythicCards/index.js";
import difficulties from "../data/difficulties.js";

const ancients_block = document.querySelector(".ancients");
const difficulties_block = document.querySelector(".difficulties");
const button_shuffle = document.querySelector("#button_shuffle");
const counter_block = document.querySelector(".counter_block");
const stages_block = document.querySelector(".stages_block");
const deck_block = document.querySelector(".deck_block");
const cards_back_block = document.querySelector(".cards_back");
const cards_face_block = document.querySelector(".cards_face");

let card_selected = {};
let difficulty_selected = {};
let deck_firstStage = [];
let deck_secondStage = [];
let deck_thirdStage = [];
let colors = ["green", "brown", "blue"];
let stages = ["firstStage", "secondStage", "thirdStage"];

ancientsData.forEach((el) => {
  const li = document.createElement("li");
  li.classList.add("ancient_card");
  li.innerHTML = `<img id="${el.id}" class="ancient_card_img" src="${el.cardFace}" alt="card ${el.id}">
                  <p>${el.name}</p>`;
  ancients_block.append(li);
  li.addEventListener("click", selectCard);
});

function selectCard(el) {
  card_selected =
    ancientsData[
      Array.from(el.target.parentElement.parentElement.children).indexOf(
        el.target.parentElement
      )
    ];
  hide_items();
  Array.from(el.target.parentElement.parentElement.children).forEach((value) =>
    value.classList.remove("selected")
  );
  el.target.parentElement.classList.add("selected");
  setTimeout(show_difficulties, 200);
}

function hide_items() {
  button_shuffle.parentElement.classList.add("hidden");
  counter_block.classList.add("hidden");
  deck_block.classList.add("hidden");
}

function show_difficulties() {
  difficulties_block.innerHTML = "";
  difficulties_block.parentElement.classList.remove("hidden");
  difficulties.forEach((el) => {
    const li = document.createElement("li");
    li.classList.add("difficulty_card");
    li.innerHTML = `${el.name}`;
    difficulties_block.append(li);
    li.addEventListener("click", selectDifficulty);
  });
}

function selectDifficulty(el) {
  counter_block.classList.add("hidden");
  deck_block.classList.add("hidden");
  button_shuffle.parentElement.classList.remove("hidden");
  difficulty_selected =
    difficulties[
      Array.from(el.target.parentElement.children).indexOf(el.target)
    ];
  Array.from(el.target.parentElement.children).forEach((value) =>
    value.classList.remove("selected")
  );
  el.target.classList.add("selected");
  button_shuffle.addEventListener("click", shuffle);
}

function shuffle() {
  deck_block.classList.remove("hidden");
  counter_block.classList.remove("hidden");
  let deck_full_green = [...cardsData.greenCards];
  let deck_full_brown = [...cardsData.brownCards];
  let deck_full_blue = [...cardsData.blueCards];

  if (difficulty_selected.id === "easy") {
    colors.forEach((color) => {
      eval(
        `deck_full_${color} = deck_full_${color}.filter(item => item.difficulty === 'easy' || item.difficulty === 'normal')`
      );
    });
  }
  if (difficulty_selected.id === "hard") {
    colors.forEach((color) => {
      eval(
        `deck_full_${color} = deck_full_${color}.filter(item => item.difficulty === 'hard' || item.difficulty === 'normal')`
      );
    });
  }
  if (difficulty_selected.id === "very easy") {
    colors.forEach((color) => {
      eval(
        `deck_full_${color} = deck_full_${color}.filter(item => item.difficulty === 'easy')`
      );
      addCards(color);
    });
  }
  if (difficulty_selected.id === "very hard") {
    colors.forEach((color) => {
      eval(
        `deck_full_${color} = deck_full_${color}.filter(item => item.difficulty === 'hard')`
      );
      addCards(color);
    });
  }

  function addCards(color) {
    let additional_cards = [];
    eval(`additional_cards = [ ...cardsData.${color}Cards]`);
    eval(
      `additional_cards = additional_cards.filter(item => item.difficulty === 'normal')`
    );
    let cards_needed;
    eval(
      `cards_needed = card_selected.firstStage.${color}Cards + card_selected.secondStage.${color}Cards + card_selected.thirdStage.${color}Cards`
    );
    eval(`while (deck_full_${color}.length < cards_needed) {
            let randomCard;
            randomCard = getRandomInt(0, additional_cards.length - 1);            
            deck_full_${color}.push(additional_cards[randomCard]);          
            additional_cards.splice(randomCard, 1);  
          }`);
  }

  function createDeck() {
    stages.forEach((stage) => {
      eval(`deck_${stage} = []`);
      colors.forEach((color) => {
        for (let i = 0; i < eval(`card_selected.${stage}.${color}Cards`); i++) {
          let randomCard;
          eval(`randomCard = getRandomInt(0, deck_full_${color}.length - 1)`);
          eval(`deck_${stage}.push(deck_full_${color}[randomCard].cardFace)`);
          eval(`deck_full_${color}.splice(randomCard, 1)`);
        }
      });
      eval(`shuffleArray(deck_${stage})`);
    });
  }

  createDeck();
  updateCounter();
  drawCards();
  cards_face_block.innerHTML = "";
}

function drawCards() {
  let total =
    deck_firstStage.length + deck_secondStage.length + deck_thirdStage.length;
  if (total > 0) {
    cards_back_block.innerHTML = `<img id="" class="" src="./assets/mythicCardBackground.png" alt="cards_back">                                  
                                  <p>Осталось карт: ${total}</p>`;
  } else {
    cards_back_block.innerHTML = `<img id="" class="" src="./assets/mythicCardBackground_no.png" alt="cards_back">
    <p>Больше карт нет!</p>`;
  }
}

function updateCounter() {
  stages_block.innerHTML = `<div class="stage_row stage1_cards_counter">
                              <div>1й этап:</div>
                              <div class="circle green">${updater(
                                "firstStage",
                                "green"
                              )}</div>
                              <div class="circle brown">${updater(
                                "firstStage",
                                "brown"
                              )}</div>
                              <div class="circle blue">${updater(
                                "firstStage",
                                "blue"
                              )}</div>
                            </div>
                            <div class="stage_row stage2_cards_counter">
                              <div>2й этап:</div>
                              <div class="circle green">${updater(
                                "secondStage",
                                "green"
                              )}</div>
                              <div class="circle brown">${updater(
                                "secondStage",
                                "brown"
                              )}</div>
                              <div class="circle blue">${updater(
                                "secondStage",
                                "blue"
                              )}</div>
                            </div>
                            <div class="stage_row stage3_cards_counter">
                              <div>3й этап:</div>
                              <div class="circle green">${updater(
                                "thirdStage",
                                "green"
                              )}</div>
                              <div class="circle brown">${updater(
                                "thirdStage",
                                "brown"
                              )}</div>
                              <div class="circle blue">${updater(
                                "thirdStage",
                                "blue"
                              )}</div>
                            </div>`;
}

function updater(stage, color) {
  return eval(`deck_${stage}.filter(item => item.includes('${color}')).length`);
}

cards_back_block.addEventListener("click", nextCard);

function nextCard() {
  if (deck_firstStage.length > 0) {
    cards_face_block.innerHTML = `<img id="" class="" src="${deck_firstStage[0]}" alt="cards_back">`;
    deck_firstStage.splice(0, 1);
  } else if (deck_secondStage.length > 0) {
    cards_face_block.innerHTML = `<img id="" class="" src="${deck_secondStage[0]}" alt="cards_back">`;
    deck_secondStage.splice(0, 1);
  } else if (deck_thirdStage.length > 0) {
    cards_face_block.innerHTML = `<img id="" class="" src="${deck_thirdStage[0]}" alt="cards_back">`;
    deck_thirdStage.splice(0, 1);
  }
  updateCounter();
  drawCards();
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]];
  }
}
