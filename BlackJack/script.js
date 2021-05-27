let credits = 10000,alreadyBet = false,alreadyStand = false,inputValue = 0,gameOver = false,winChecked = false,resseted = false,myTimer = 0,alreadyDD = false,dealerPlaying = false;

// curency object
const currency = {
    credits: document.querySelector(`.credits-value`),
    currentBet: document.querySelector(`.current-bet`),
};
// buttons object
const buttons = {
    doubleDown: document.querySelector(`.double-down`),
    stand: document.querySelector(`.stand`),
    addCard: document.querySelector(`.add-card`),
    bet: document.querySelector(`.btn-bet`),
};
// player object
const player = {
    card1: document.querySelector(`.card1player`),
    card2: document.querySelector(`.card2player`),
    newCard: document.querySelector(`.new-card-player`),
    cardSumText: document.querySelector(`.sum-player`),
    cardsSum: 0,
    cardsArray: [],
    GenerateCard() {
        const randomNumber = Math.trunc(Math.random() * 10)+2;
        this.cardsArray.push(randomNumber);
        if (randomNumber === 11) {
            this.cardsSum + randomNumber > 21 ? this.cardsSum +=1 : this.cardsSum += randomNumber;
        } else this.cardsSum += randomNumber;
        this.cardSumText.innerText = this.cardsSum;
        return randomNumber;
    }
};
// dealer object
const dealer = {
    card1: document.querySelector(`.card1dealer`),
    card2: document.querySelector(`.card2dealer`),
    newCard: document.querySelector(`.new-card-dealer`),
    cardSumText: document.querySelector(`.sum-dealer`),
    cardsSum: 0,
    cardsArray: [],
    GenerateCard() {
        const randomNumber = Math.trunc(Math.random() * 10) + 2;
        this.cardsArray.push(randomNumber);
        if (randomNumber === 11) {
            this.cardsSum + randomNumber > 21 ? this.cardsSum +=1 : this.cardsSum += randomNumber;
        } else this.cardsSum += randomNumber;
        this.cardSumText.innerText = this.cardsSum;
        return randomNumber;
    },
    Chance() {
        return Math.random();
    }
};
// initiate dealer function
function InitiateDealer() {
    dealerPlaying = true;
    dealer.card1.style.backgroundImage = `url("./pictures/${dealer.GenerateCard()}.png")`;
    dealer.card2.style.backgroundImage = `url("./pictures/${dealer.GenerateCard()}.png")`;
}
// reset function
function Reset() {
    alreadyBet = false,alreadyStand = false,inputValue = 0,gameOver = false,winChecked = false,alreadyDD = false,dealerPlaying = false;
    player.cardsSum = 0;
    dealer.cardsSum = 0;
    player.cardsArray.splice(0,player.cardsArray.length);
    dealer.cardsArray.splice(0,dealer.cardsArray.length);
    currency.currentBet.textContent = 0;
    player.cardSumText.textContent = 0;
    dealer.cardSumText.textContent = 0;
    dealer.card1.style.backgroundImage = `url("./pictures/back.png")`;
    dealer.card2.style.backgroundImage = `url("./pictures/back.png")`;
    dealer.newCard.style.backgroundImage = `url("./pictures/back.png")`;
    player.card1.style.backgroundImage = `url("./pictures/back.png")`;
    player.card2.style.backgroundImage = `url("./pictures/back.png")`;
    player.newCard.style.backgroundImage = `url("./pictures/back.png")`;
}
// dealer algorithm
function DealerAlgorithm() {
    if (player.cardsSum > 21) {
        gameOver = true;
    } else {
        if (dealer.cardsSum <= 20 && player.cardsSum > dealer.cardsSum) {
            dealer.newCard.style.backgroundImage = `url("./pictures/${dealer.GenerateCard()}.png")`;
        } else gameOver = true
    }
    if (gameOver) CheckWin(player.cardsSum,dealer.cardsSum);
}
//check who won function
function CheckWin(playerSum,dealerSum) {
    if (!winChecked) {
        if (playerSum === dealerSum) {
            credits += inputValue;
            currency.credits.textContent = credits;
            Draw();
        } else if (dealerSum === 21) {
            DealerWin();
        } else if (playerSum === 21) {
            PlayerWin();
        } else if (playerSum < 21 && dealerSum < 21) {
            if (playerSum > dealerSum) {
                PlayerWin();
            } else {
                DealerWin();
            }
        } else if (playerSum > 21 && dealerSum <= 21) {
            DealerWin();
        } else if (dealerSum > 21 && playerSum <= 21) {
            PlayerWin();
        }
        function Draw() {
            player.cardSumText.innerText = `${player.cardsSum} (Draw)`;
            dealer.cardSumText.innerText = `${dealer.cardsSum} (Draw)`;
        }
        function PlayerWin() {
            player.cardSumText.innerText = `${player.cardsSum} (You Won!)`;
            dealer.cardSumText.innerText = `${dealer.cardsSum} (Dealer Lost!)`;
            if (alreadyDD) {
                credits += inputValue * 3;
            } else {
                credits += inputValue * 2;
            }
            currency.credits.textContent = credits;
        }
        function DealerWin() {
            player.cardSumText.innerText = `${player.cardsSum} (You Lost!)`;
            dealer.cardSumText.innerText = `${dealer.cardsSum} (Dealer Won!)`;
        }
        winChecked = true;
        clearInterval(myTimer);
        setTimeout(Reset,3000);
    }
}
//bet button
buttons.bet.addEventListener(`click`,function() {
    inputValue = Number(document.querySelector(`.ipt`).value);
    if (!alreadyBet && inputValue !== 0 && inputValue <= credits) {
        alreadyBet = true;
        credits -= inputValue;
        player.card1.style.backgroundImage = `url("./pictures/${player.GenerateCard()}.png")`;
        player.card2.style.backgroundImage = `url("./pictures/${player.GenerateCard()}.png")`;
        currency.credits.textContent = credits;
        currency.currentBet.textContent = inputValue;
        if (player.cardsSum === 21) {
            InitiateDealer();
            myTimer = setInterval(DealerAlgorithm,1000);
            player.cardSumText.textContent = `${player.cardsSum} (Blackjack)`;
        } 
    } else {
        inputValue === 0 ? alert(`Invalid bet!`) : inputValue > credits ? alert(`You don't have enough credits!`) : alert(`You already bet!`) 
    }
});
//add card button
buttons.addCard.addEventListener(`click`,function() {
    if (!dealerPlaying) {
        if (player.cardsSum <= 20) {
            if (alreadyBet) {
                player.newCard.style.backgroundImage = `url("./pictures/${player.GenerateCard()}.png")`;
                if (player.cardsSum === 21 || player.cardsSum > 21) {
                    InitiateDealer();
                    myTimer = setInterval(DealerAlgorithm,1000);
                }
            } else {
                alert(`You can't add a card yet!`);
            }
        } else {
            InitiateDealer();
            myTimer = setInterval(DealerAlgorithm,1000);
        }
    } else alert(`You can't add a card now!`);
});
// stand button
buttons.stand.addEventListener(`click`,function() {
    if (!alreadyStand && alreadyBet) {
        alreadyStand = true;
        InitiateDealer();
        myTimer = setInterval(DealerAlgorithm,1000);
    } else {
        alert(`You can't press 'stand' yet!`);
    }
});
// double down button
buttons.doubleDown.addEventListener(`click`,function() {
    if (alreadyBet && !alreadyDD) {
        alreadyDD = true;
        credits-= inputValue;
        currency.credits.textContent = credits;
        currency.currentBet.textContent = inputValue;
        player.newCard.style.backgroundImage = `url("./pictures/${player.GenerateCard()}.png")`;
        InitiateDealer();
        myTimer = setInterval(DealerAlgorithm,1000);
    } else if (!alreadyBet) {
        alert(`You can't press double down yet!`);
    } else {
        alert(`You already doubled down!`);
    }
});