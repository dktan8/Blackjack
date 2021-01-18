import Deck from "./deck.js"

const dealerdeck1 = document.querySelector(".dealer-deck1")
const dealerdeck2 = document.querySelector(".dealer-deck2")
const dealerdeck3 = document.querySelector(".dealer-deck3")
const dealerdeck4 = document.querySelector(".dealer-deck4")
const dealerdeck5 = document.querySelector(".dealer-deck5")
const playerdeck1 = document.querySelector(".player-deck1")
const playerdeck2 = document.querySelector(".player-deck2")
const playerdeck3 = document.querySelector(".player-deck3")
const playerdeck4 = document.querySelector(".player-deck4")
const playerdeck5 = document.querySelector(".player-deck5")
const hitButton = document.querySelector(".buttonh")
const doubButton = document.querySelector(".buttond")
const standButton = document.querySelector(".buttonst")
const playerInfo = document.querySelector(".textPlayer")
const resultInfo = document.querySelector(".textResult")
const stackInfo = document.querySelector(".textChips")
const betInput = document.querySelector(".bet")
const dealerInfo = document.querySelector(".textDealer")
const stackInfoValue = document.createElement("text")

let playerhand = []
let dealerhand = []
var cardcount = 4
var playerCardPos = 3
let playing = false
let win = null 
let deck = new Deck()
let playerChips = 100
let betSize = 0
let turnCount = 0
let double = false
StartGame()


function StartGame(){
    deck = new Deck()
    deck.shuffle()
    playerhand = [deck.cards[2].handValue, deck.cards[3].handValue]
    dealerhand = [deck.cards[0].handValue , deck.cards[1].handValue]

    playing = true

    const playerInfoHand = document.createElement("text")
    playerInfoHand.textContent = ("Player's Hand: " + (deck.cards[2].handValue + deck.cards[3].handValue))
    playerInfo.appendChild(playerInfoHand)

    
    stackInfoValue.textContent = ("Chips: $" + playerChips)
    stackInfo.appendChild(stackInfoValue)

    const dealerInfoHand = document.createElement("text")
    dealerInfoHand.textContent = ("Dealer's Hand: " + deck.cards[0].handValue) 
    dealerInfo.appendChild(dealerInfoHand)

    dealerdeck1.appendChild(deck.cards[0].getHTML())
    const dealercard = document.createElement("img")
    dealercard.srcset ="./card-backF.jpg"
    dealerdeck2.appendChild(dealercard)

    playerdeck1.appendChild(deck.cards[2].getHTML())
    playerdeck2.appendChild(deck.cards[3].getHTML())
    setBetSize(document.getElementsByTagName("input")[0].value)
    hitButton.addEventListener("click", Hit)
    doubButton.addEventListener("click", Double)
    standButton.addEventListener("click", RevealDealer)
    
    if(playerCardPos == 3 && turnCount > 0 && parseInt(betSize)>0){
        const stackInfoFin = document.createElement("text")
        stackInfo.removeChild(stackInfo.firstChild)
        stackInfoFin.textContent = ("Chips: $" + (parseInt(playerChips) - parseInt(betSize)))
        setStackSize(-(betSize))
        stackInfo.appendChild(stackInfoFin)
        }
    }


function Hit(){
    setBetSize(document.getElementsByTagName("input")[0].value)
    if((parseInt(betSize) == 0 || parseInt(betSize)>0 ) && parseInt(betSize) <= playerChips){
    if(playing == true){

        if(playerCardPos == 3 && turnCount == 0){
                stackInfoValue.textContent = ("Chips: $" + (parseInt(playerChips) - parseInt(betSize)))
                stackInfo.appendChild(stackInfoValue)
                setStackSize(-(betSize))

            }
        if(playerCardPos == 3){
            playerdeck3.appendChild(deck.cards[cardcount].getHTML())
        }
        else if(playerCardPos == 4){
            playerdeck4.appendChild(deck.cards[cardcount].getHTML())
        }
        else{
            playerdeck5.appendChild(deck.cards[cardcount].getHTML())
        }
        playerhand.push(deck.cards[cardcount].handValue)
        cardcount ++
        playerCardPos ++
        CheckBust()
        UpdatePlayer()
        }
    else if (win == true || win == false){
        NewDeal()
    }

}
    }


function Double(){
    double = true
    setBetSize((document.getElementsByTagName("input")[0].value)*2)
    if((parseInt(betSize) == 0 || parseInt(betSize)>0 ) && parseInt(betSize) <= playerChips){
    if(playing == true){
        if(turnCount == 0){
            if(playerCardPos == 3){
                stackInfoValue.textContent = ("Chips: $" + (parseInt(playerChips) - parseInt(betSize)))
                stackInfo.appendChild(stackInfoValue)
                setStackSize(-(betSize))
            }
            else{
                console.log("heree")
                stackInfoValue.textContent = ("Chips: $" + (parseInt(playerChips) - (parseInt(betSize)*2)))
                stackInfo.appendChild(stackInfoValue)
                setStackSize(-(betSize/2))
                changeStackDisplay()
            }
        }
        else{
            console.log("heree")
                stackInfoValue.textContent = ("Chips: $" + (parseInt(playerChips) - (parseInt(betSize)*2)))
                stackInfo.removeChild(stackInfo.firstChild)
                stackInfo.appendChild(stackInfoValue)
                setStackSize(-(betSize/2))
                changeStackDisplay()
        }
        if(playerCardPos == 3){
            playerdeck3.appendChild(deck.cards[cardcount].getHTML())
        }
        else if(playerCardPos == 4){
            playerdeck4.appendChild(deck.cards[cardcount].getHTML())
        }
        else{
            playerdeck5.appendChild(deck.cards[cardcount].getHTML())
        }
        playerhand.push(deck.cards[cardcount].handValue)
        cardcount ++
        playerCardPos ++
        CheckBust()
        UpdatePlayer()
        }
    RevealDealer()
}
}

function CheckBust(){
    if (HandTotal(true) > 21 && playerhand.includes(11)){
        playerhand[playerhand.indexOf(11)] = 1
        UpdatePlayer()
        CheckBust()
    }
    else if(HandTotal(true) > 21 && !playerhand.includes(11)){
        
        const chipsInfoFin = document.createElement("text")
        playing = false
        doubButton.removeEventListener("click", Double)
        standButton.removeEventListener("click", RevealDealer)

        chipsInfoFin.textContent = ("Player Busts") 
        resultInfo.appendChild(chipsInfoFin)
        win = false
        changeStackDisplay(win)
    }
    else{

    }
}

function RevealDealer(){
    if(playing == true){
    const dealerInfoHand = document.createElement("text")
    dealerInfoHand.textContent = ("Dealer's Hand: " + HandTotal(false)) 
    dealerInfo.removeChild(dealerInfo.children[0])
    dealerInfo.appendChild(dealerInfoHand)

    dealerdeck2.removeChild(dealerdeck2.firstChild)
    dealerdeck2.appendChild(deck.cards[1].getHTML()) 
    
    UpdatePlayer()
    DrawDealer()
    }playing = false
    
}

function HandTotal(player){
    var x = 0
    if(player == true){
        for(var i = 0;i < playerhand.length ; i++ ){
            x = x + playerhand[i]
        }
    }
    else{
        var currentPos = dealerhand.length - 2
        for(var i = 0;i < dealerhand.length; i++ ){
            x = x + dealerhand[i]

        }
    }
 
    return parseInt(x)
}

function UpdatePlayer(){
    const playerInfoHand = document.createElement("text")
    playerInfo.removeChild(playerInfo.children[0])
    playerInfoHand.textContent = ("Player's Hand: " + HandTotal(true) )
    playerInfo.appendChild(playerInfoHand)
}


function UpdateDealer(){
    const dealerInfoHand = document.createElement("text")
    dealerInfo.removeChild(dealerInfo.children[0])
    dealerInfoHand.textContent = ("Dealer's Hand: " + HandTotal(false) )
    dealerInfo.appendChild(dealerInfoHand)
}

function CheckWin(){
    const resultInfoFin = document.createElement("text")
    if(HandTotal(false) > 21 ||HandTotal(true) > HandTotal(false)){
        resultInfoFin.textContent = ("PLAYER WINS!") 
        resultInfo.appendChild(resultInfoFin)
        win = true
        changeStackDisplay(win)

    }
    else if(HandTotal(true) < HandTotal(false)){
        resultInfoFin.textContent = ("Player Loses") 
        resultInfo.appendChild(resultInfoFin)

        win = false
        changeStackDisplay(win)
     
        }
    else{
        resultInfoFin.textContent = ("Player Push") 
        resultInfo.appendChild(resultInfoFin)

        win = true
        changeStackDisplay(win)
       
    }

}

function DrawDealer(){
    if(deck.cards[0].handValue + deck.cards[1].handValue < 17){
        let cardslotPos = 3
        for(var cardpos = playerCardPos+1; HandTotal(false) <17; cardpos++){
            if(cardslotPos == 3){
                dealerdeck3.appendChild(deck.cards[cardpos].getHTML())
            }
            else if(cardslotPos == 4){
                dealerdeck4.appendChild(deck.cards[cardpos].getHTML())
            }
            else{
                dealerdeck5.appendChild(deck.cards[cardpos].getHTML())
            }

            cardslotPos ++
            dealerhand.push(deck.cards[cardpos].handValue)

            if (HandTotal(false) > 21 && dealerhand.includes(11)){
                dealerhand[dealerhand.indexOf(11)] = 1
                UpdateDealer()
            }
        }
        UpdateDealer()
            
    }
        CheckWin()
}

function NewDeal(){

    dealerdeck1.removeChild(dealerdeck1.children[0])
    dealerdeck2.removeChild(dealerdeck2.firstChild)
    if(dealerdeck3.firstChild){
    dealerdeck3.removeChild(dealerdeck3.firstChild)
    }
    if(dealerdeck4.firstChild){
    dealerdeck4.removeChild(dealerdeck4.firstChild)
    }
    if(dealerdeck5.firstChild){
    dealerdeck5.removeChild(dealerdeck5.firstChild)
    }
    playerdeck1.removeChild(playerdeck1.firstChild)
    playerdeck2.removeChild(playerdeck2.firstChild)
    if(playerdeck3.firstChild){
    playerdeck3.removeChild(playerdeck3.firstChild)
    }
    if(playerdeck4.firstChild){
    playerdeck4.removeChild(playerdeck4.firstChild)
    }
    if(playerdeck5.firstChild){
        while(playerdeck5.firstChild)
    playerdeck5.removeChild(playerdeck5.firstChild)
    }
    playerInfo.removeChild(playerInfo.firstChild)
    stackInfo.removeChild(stackInfo.firstChild)
    dealerInfo.removeChild(dealerInfo.children[0])
    resultInfo.removeChild(resultInfo.firstChild)
    cardcount = 4
    playerCardPos = 3
    playing = true
    turnCount ++
    double =false
    StartGame()
    
}



function setBetSize(value){
    betSize = value
}
function setStackSize(value){
    playerChips = (parseInt(playerChips) + parseInt(value))
}

function changeStack(win){
    if(double = false){
    if(win == true){
        if(HandTotal(true) == HandTotal(false)){
            setStackSize(betSize)
        }
        else{
            setStackSize(parseInt(betSize)*2)
        }
    }
    else{
    }
    }
    else{
        if(win == true){
            if(HandTotal(true) == HandTotal(false)){
                setStackSize(parseInt(betSize))
            }
            else{
                setStackSize(parseInt(betSize)*2)
            }
        }
        else{


        }
    }
}

function changeStackDisplay(win){
    
    if(betSize>0){
    changeStack(win)
    const stackInfoFin = document.createElement("text")
    stackInfo.removeChild(stackInfo.firstChild)
    stackInfoFin.textContent = ("Chips: $" + playerChips)
    stackInfo.appendChild(stackInfoFin)
}
}