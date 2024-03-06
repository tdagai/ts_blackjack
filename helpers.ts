const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
import { PROMPTS, originalDeck } from "./constants";
import type { Card, HandsTypes, GameObjectProps } from "./types";

const shuffleDeck = (deck: Card[]) => {
  let curr = deck.length;
  let randomIndex = 0;

  //while there's still cards to shuffle
  while (curr > 0) {
    //pick a remaining card
    randomIndex = Math.floor(Math.random() * curr);
    curr--;
    //swap with current card
    [deck[curr], deck[randomIndex]] = [deck[randomIndex], deck[curr]];
  }

  return deck;
}

const drawCard = (deck: Card[]) => {
  return deck.shift();
}

const addCardToHand = (hands: HandsTypes, receiver: keyof HandsTypes, card: Card | undefined) => {
  if (card)
    hands[receiver].push(card);
  return;
};

const showPlayerHand = (hands: HandsTypes) => {
  return hands['playerHand'];
};

const showDealerHand = (hands: HandsTypes) => {
  return hands['dealerHand'];
};

const convertCardToPoints = (card: string) => {
  let cardValue = 0;
  switch (card) {
    case '1': {
      cardValue = 1;
      break;
    };
    case '2': {
      cardValue = 2;
      break;
    };
    case '3': {
      cardValue = 3;
      break;
    };
    case '4': {
      cardValue = 4;
      break;
    };
    case '5': {
      cardValue = 5;
      break;
    };
    case '6': {
      cardValue = 6;
      break;
    };
    case '7': {
      cardValue = 7;
      break;
    };
    case '8': {
      cardValue = 8;
      break;
    };
    case '9': {
      cardValue = 9;
      break;
    };
    case '10':
    case 'J':
    case 'Q':
    case 'K': {
      cardValue = 10;
      break;
    };
    case 'A1': {
      cardValue = 1;
      break;
    };
    case 'A11': {
      cardValue = 11;
      break;
    }
    default: {
      break;
    };
  }
  return cardValue;
};

const calculateHandTotal = (deck: Card[]) => {
  let total = 0;
  deck.forEach((curr) => {
    total += convertCardToPoints(curr);
  });
  return total;
};

const rl = readline.createInterface({
  input,
  output,
});

const question = (answer: string) => new Promise(resolve => rl.question(answer, resolve));

const setAceValue = async () => {
  let aceValue: Card | undefined;

  while (aceValue !== 'A1' && aceValue !== 'A11') {
    let userAnswer = await question(PROMPTS.ACES);
    switch (userAnswer) {
      case '1': {
        aceValue = 'A1';
        break;
      }
      case '11': {
        aceValue = 'A11';
        break;
      }
      default: {
        console.log('This is not a valid Ace value.');
        break;
      }
    }
  }
  return aceValue;
}

const initiateGame = async (playDeck: Card[]) => {

  const hands: HandsTypes = {
    playerHand: [],
    dealerHand: [],
  };

  console.log(PROMPTS.LETS_PLAY);

  shuffleDeck(playDeck);

  let newCard: Card | undefined;
  //Draw player hand
  for (let i = 0; i < 2; i++) {
    newCard = drawCard(playDeck);
    if (newCard === 'A') { newCard = await setAceValue(); }
    addCardToHand(hands, 'playerHand', newCard);
  }
  const playerHandValue = calculateHandTotal(showPlayerHand(hands));

  //Draw dealer hand and reveal the first card
  for (let i = 0; i < 2; i++) {
    newCard = drawCard(playDeck);
    if (newCard === 'A') { newCard = Math.random() % 2 === 0 ? ('A1' as Card) : ('A11' as Card) }
    addCardToHand(hands, 'dealerHand', newCard);
  }
  const dealerFirstCard = hands.dealerHand[0];
  const dealerHandValue = calculateHandTotal(showDealerHand(hands));

  console.log('The Dealer\'s revealed card is: ', [dealerFirstCard]);
  console.log('Your opening hand is:', hands.playerHand, 'which totals to:', playerHandValue);
  return {
    playDeck,
    hands,
    playerHandValue: playerHandValue,
    dealerHandValue: dealerHandValue,
    dealerFirstCard: dealerFirstCard,
  }
}

const restartGame = async (gameObj: GameObjectProps) => {
  console.log('Restarting the game!');
  gameObj.playDeck = originalDeck;
  gameObj.hands.playerHand = ([] as Card[]);
  gameObj.hands.dealerHand = ([] as Card[]);
  gameObj.playerHandValue = 0;
  gameObj.dealerHandValue = 0;
  gameObj.dealerFirstCard = ('' as Card);

  return await initiateGame(gameObj.playDeck);
}

const askPlayAgain = async (gameObj: GameObjectProps) => {
  let userAnswer;
  while (userAnswer !== 'play again' && userAnswer !== 'p' && userAnswer != 'quit' && userAnswer != 'q') {
    userAnswer = await question(`\n${PROMPTS.PLAY_AGAIN_QUESTION}${PROMPTS.PLAY_AGAIN_MENU}`);
    switch (userAnswer) {
      case 'p':
      case 'play again': {
        gameObj = await restartGame(gameObj);
        return { userAnswer: 'play again', gameObj };
      }
      case 'q':
      case 'quit': {
        rl.close();
        return { userAnswer: 'quit', gameObj }
      }
      default: {
        console.log('this was not a valid option');
      }
    }
  }
}

const dealTheDealer = (gameObject: GameObjectProps) => {
  let dealerHandValue = gameObject.dealerHandValue;
  while (dealerHandValue <= 17) {
    let newCard: Card | undefined;
    if (gameObject.playDeck.length) { newCard = drawCard(gameObject.playDeck); }
    if (newCard === 'A') {
      newCard = gameObject.dealerHandValue + 11 > 21 ? ('A1' as Card) : ('A11' as Card);
    }
    console.log(gameObject.hands.dealerHand);
    addCardToHand(gameObject.hands, 'dealerHand', newCard);
    console.log(gameObject.hands.dealerHand);
    let currentHand = showDealerHand(gameObject.hands);
    dealerHandValue = calculateHandTotal(currentHand);
  };
  gameObject.dealerHandValue = dealerHandValue;
  console.log(
    'dealer\'s current hand:', gameObject.hands.dealerHand,
    'which totals to:', gameObject.dealerHandValue
  )
  return gameObject;
}

const checkVictoryConditions = ({ dealerHandValue, playerHandValue }: GameObjectProps) => {
  if (dealerHandValue > 21 || playerHandValue > dealerHandValue) {
    console.log(PROMPTS.YOU_WIN);
  } else {
    console.log(PROMPTS.YOU_LOSE);
  }
}

export {
  rl,
  question,
  drawCard,
  addCardToHand,
  showPlayerHand,
  showDealerHand,
  calculateHandTotal,
  setAceValue,
  initiateGame,
  askPlayAgain,
  dealTheDealer,
  checkVictoryConditions,
};