type Card = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A' | 'A1' | 'A11';

type HandsTypes = {
  playerHand: Card[];
  dealerHand: Card[];
};

type GameObjectProps = {
  playDeck: Card[];
  hands: HandsTypes;
  playerHandValue: number;
  dealerHandValue: number;
  dealerFirstCard: Card;
}

export type {
  Card,
  HandsTypes,
  GameObjectProps,
}