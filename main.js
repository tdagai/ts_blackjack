var readline = require('readline');
var _a = require('process'), input = _a.stdin, output = _a.stdout;
var rl = readline.createInterface({
    input: input,
    output: output,
    prompt: 'What will be your next move?\n ====================\n  [stand] | [hit me] \n ====================\n- '
});
var deck = [
    'A', 'A', 'A', 'A',
    '2', '2', '2', '2',
    '3', '3', '3', '3',
    '4', '4', '4', '4',
    '5', '5', '5', '5',
    '6', '6', '6', '6',
    '7', '7', '7', '7',
    '8', '8', '8', '8',
    '9', '9', '9', '9',
    '10', '10', '10', '10',
    'J', 'J', 'J', 'J',
    'Q', 'Q', 'Q', 'Q',
    'K', 'K', 'K', 'K'
];
var hands = {
    playerHand: [],
    dealerHand: [],
};
var shuffleDeck = function (deck) {
    var _a;
    var curr = deck.length;
    var randomIndex = 0;
    //while there's still cards to shuffle
    while (curr > 0) {
        //pick a remaining card
        randomIndex = Math.floor(Math.random() * curr);
        curr--;
        //swap with current card
        _a = [deck[randomIndex], deck[curr]], deck[curr] = _a[0], deck[randomIndex] = _a[1];
    }
    return deck;
};
var drawCard = function (deck) {
    return deck.shift();
};
var addCardToHand = function (receiver, card) {
    hands[receiver].push(card);
    return;
};
var showPlayerHand = function () {
    return hands['playerHand'];
};
var showDealerHand = function () {
    return hands['dealerHand'];
};
// const convertCardToPoints = (card: string) => {
//   switch (card) {
//     case '1': {
//     }
//     default: {
//       break ;
//     }
//   }
// }
console.log("I wanna play blackjack!");
shuffleDeck(deck);
rl.prompt();
rl.on('line', function (answer) {
    switch (answer) {
        case 'stand': {
            console.log('You chose to stand!');
            console.log('Your hand is', showPlayerHand());
            rl.close();
            break;
        }
        case 'hit me': {
            var newCard = drawCard(deck);
            addCardToHand('playerHand', newCard);
            console.log('Here\'s your card:', newCard);
            console.log('Here\'s your current hand:', showPlayerHand());
            break;
        }
        case 'close': {
            rl.close();
            break;
        }
        default:
            {
                console.log('Please select a valid menu option.');
            }
            rl.prompt();
    }
}).on('close', function () { console.log('have a great day!'); process.exit(0); });
