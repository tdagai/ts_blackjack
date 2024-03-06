import type { Card, GameObjectProps } from './types';
import { PROMPTS, originalDeck } from './constants';
import {
  rl,
  question,
  drawCard,
  addCardToHand,
  showPlayerHand,
  calculateHandTotal,
  setAceValue,
  initiateGame,
  askPlayAgain,
  dealTheDealer,
  checkVictoryConditions,
} from './helpers';

const playGame = async (playDeck: Card[]) => {

  let gameObject: GameObjectProps = await initiateGame(playDeck);

  let userAnswer;
  while (userAnswer != 'quit' && userAnswer != 'q') {
    if (userAnswer) { console.log('the user answer is:', userAnswer); }
    userAnswer = await question(PROMPTS.NEXT_MOVE);
    switch ((userAnswer as string).toLowerCase()) {
      case 's':
      case 'stand': {
        console.log('Your hand is', showPlayerHand(gameObject.hands), 'which totals to', calculateHandTotal(showPlayerHand(gameObject.hands)));
        dealTheDealer(gameObject);
        checkVictoryConditions(gameObject);
        const playAgainResponse = await askPlayAgain(gameObject);
        userAnswer = playAgainResponse?.userAnswer;
        if (playAgainResponse?.gameObj) { gameObject = playAgainResponse.gameObj; }
        break;
      }
      case 'h':
      case 'hit me': {
        let newCard: Card | undefined;
        if (gameObject.playDeck.length) { newCard = drawCard(gameObject.playDeck); }
        console.log('Here\'s your card:', newCard);
        if (newCard === 'A') { newCard = await setAceValue(); }
        let currentHand = showPlayerHand(gameObject.hands);
        addCardToHand(gameObject.hands, 'playerHand', newCard);
        const handTotal = calculateHandTotal(currentHand);
        console.log('Here\'s your current hand:', currentHand, 'which totals to', handTotal);
        if (handTotal > 21) {
          console.log(PROMPTS.YOU_LOSE);
          const playAgainResponse = await askPlayAgain(gameObject);
          userAnswer = playAgainResponse?.userAnswer;
          if (playAgainResponse?.gameObj) { gameObject = playAgainResponse.gameObj; }
        }
        break;
      }
      case 'p':
      case 'play again': {
        break;
      }
      case 'q':
      case 'quit': {
        rl.close();
        break;
      }
      default: {
        console.log('Please select a valid menu option.');
        break;
      }
    }
  }
}

playGame(originalDeck);