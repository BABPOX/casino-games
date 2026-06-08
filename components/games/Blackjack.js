'use client'

import { useState } from 'react'

const suits = ['♠', '♥', '♦', '♣']
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

const getCard = () => ({
  suit: suits[Math.floor(Math.random() * 4)],
  rank: ranks[Math.floor(Math.random() * 13)]
})

const cardValue = (card) => {
  if (card.rank === 'A') return 11
  if (['J', 'Q', 'K'].includes(card.rank)) return 10
  return parseInt(card.rank)
}

const handValue = (hand) => {
  let value = hand.reduce((sum, card) => sum + cardValue(card), 0)
  let aces = hand.filter(c => c.rank === 'A').length
  while (value > 21 && aces > 0) {
    value -= 10
    aces--
  }
  return value
}

export default function Blackjack({ balance, setBalance }) {
  const [bet, setBet] = useState(10)
  const [playerHand, setPlayerHand] = useState([])
  const [dealerHand, setDealerHand] = useState([])
  const [gameState, setGameState] = useState('betting')
  const [message, setMessage] = useState('')

  const startGame = () => {
    if (bet > balance) return
    setPlayerHand([getCard(), getCard()])
    setDealerHand([getCard(), getCard()])
    setGameState('playing')
    setMessage('')
  }

  const hit = () => {
    const newHand = [...playerHand, getCard()]
    setPlayerHand(newHand)
    if (handValue(newHand) > 21) {
      endGame(newHand, dealerHand, true)
    }
  }

  const stand = () => {
    let dealer = [...dealerHand]
    while (handValue(dealer) < 17) {
      dealer.push(getCard())
    }
    endGame(playerHand, dealer, false)
  }

  const endGame = (pHand, dHand, playerBusted) => {
    const pValue = handValue(pHand)
    const dValue = handValue(dHand)

    let result = ''
    let winnings = 0

    if (playerBusted) {
      result = 'Bust! Dealer wins!'
    } else if (dValue > 21) {
      result = 'Dealer busts! You win!'
      winnings = bet * 2
    } else if (pValue > dValue) {
      result = 'You win!'
      winnings = bet * 2
    } else if (dValue > pValue) {
      result = 'Dealer wins!'
    } else {
      result = 'Push! Draw!'
      winnings = bet
    }

    setMessage(result)
    setBalance(balance - bet + winnings)
    setGameState('result')
  }

  const reset = () => {
    setGameState('betting')
    setPlayerHand([])
    setDealerHand([])
    setBet(10)
  }

  const CardDisplay = ({ card }) => (
    <div className="w-16 h-24 bg-white text-black rounded-lg flex items-center justify-center text-2xl font-bold border-2 border-gray-300 m-2">
      <div className="text-center">
        <div>{card.rank}</div>
        <div className="text-sm">{card.suit}</div>
      </div>
    </div>
  )

  return (
    <div className="game-container">
      {gameState === 'betting' && (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Place Your Bet</h2>
          <input
            type="number"
            value={bet}
            onChange={(e) => setBet(Number(e.target.value))}
            min="1"
            max={balance}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white text-center text-xl"
          />
          <button
            onClick={startGame}
            disabled={bet > balance}
            className="btn-primary w-full"
          >
            Deal
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-3">Dealer: {handValue(dealerHand)}</h3>
            <div className="flex flex-wrap">
              {dealerHand.map((card, i) => <CardDisplay key={i} card={card} />)}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-3">You: {handValue(playerHand)}</h3>
            <div className="flex flex-wrap">
              {playerHand.map((card, i) => <CardDisplay key={i} card={card} />)}
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={hit} className="btn-primary">Hit</button>
            <button onClick={stand} className="btn-primary">Stand</button>
          </div>
        </div>
      )}

      {gameState === 'result' && (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-yellow-400">{message}</h2>
          <div>
            <h3 className="text-lg font-bold mb-3">Dealer: {handValue(dealerHand)}</h3>
            <div className="flex flex-wrap justify-center">
              {dealerHand.map((card, i) => <CardDisplay key={i} card={card} />)}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-3">You: {handValue(playerHand)}</h3>
            <div className="flex flex-wrap justify-center">
              {playerHand.map((card, i) => <CardDisplay key={i} card={card} />)}
            </div>
          </div>
          <button onClick={reset} className="btn-primary w-full">Play Again</button>
        </div>
      )}
    </div>
  )
}
