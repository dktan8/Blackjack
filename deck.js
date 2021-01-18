const Suits = ["♣","♦","♥","♠"]
const Values = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"]

export default class Deck {
    constructor(cards = freshDeck()){
        this.cards = cards
    }


    get deckSize() {
        return this.cards.length
    }

    shuffle() {
        for(let i = 0; i < 52; i++ ){
            const newIndex = Math.floor(Math.random() * (i+ 2))
            const oldValue = this.cards[newIndex]
            this.cards[newIndex] = this.cards[i]
            this.cards[i] = oldValue
        }
    }
}
class Card  {
    constructor(suit, value){
        this.suit = suit
        this.value = value
    }

    get handValue (){
        if(this.value == "A"){
            return 11
        }
        return this.value == "J" || this.value == "Q" || this.value == "K" ? 10 : parseInt(this.value)
    }
    get colour(){
        return this.suit == "♣" || this.suit == "♠" ? "black" : "red"
    }

    getHTML(){
        const cardCon = document.createElement("div")
        cardCon.innerText = this.suit
        cardCon.classList.add("card", this.colour)
        cardCon.dataset.value = `${this.value} ${this.suit}`
        return cardCon
    }
}
    

function freshDeck() {
    return Suits.flatMap(suit => {
        return Values.map(value => {
           return new Card(suit, value)
        })
    })

}
