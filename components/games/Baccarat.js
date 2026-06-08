'use client'

import { useState } from 'react'

const suits = ['♠', '♥', '♦', '♣']
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

const getCard = () => ({
  suit: suits[Math.floor(Math.random() * 4)],
  rank: ranks[Math.floor(Math.random() * 13)]
})

const cardValue = (card) => {
  if (card.rank === 'A') return 1
  if (['J', 'Q', 'K'].includes(card.rank)) return 0
  return parseInt(card.rank)
}

const handValue = (hand) => {
  return hand.reduce((sum, card) => sum + cardValue(card), 0) % 10
}

export default function Baccarat({ balance, setBalance }) {
  const [bet, setBet] = useState(10)
  const [betType, setBetType] = useState('player')
  const [gameState, setGameState] = useState('betting')
  const [playerHand, setPlayerHand] = useState([])
  const [bankerHand, setBankerHand] = useState([])
  const [message, setMessage] = useState('')

  const startGame = () => {
    if (bet > balance) return
    const ph = [getCard(), getCard()]
    const bh = [getCard(), getCard()]
    setPlayerHand(ph)
    setBankerHand(bh)
    endGame(ph, bh)
  }

  const endGame = (ph, bh) => {
    const pValue = handValue(ph)
    const bValue = handValue(bh)

    let winner = ''
    let winnings = 0

    if (pValue > bValue) {
      winner = 'Player Wins!'
      if (betType === 'player') winnings = bet * 2
    } else if (bValue > pValue) {
      winner = 'Banker Wins!'
      if (betType === 'banker') winnings = bet * 1.95
    } else {
      winner = 'Tie!'
      if (betType === 'tie') winnings = bet * 9
    }

    setMessage(winner)
    setBalance(balance - bet + winnings)
    setGameState('result')
  }

  const reset = () => {
    setGameState('betting')
    setPlayerHand([])
    setBankerHand([])
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
          <h2 className="text-2xl font-bold">Baccarat</h2>
          <input
            type="number"
            value={bet}
            onChange={(e) => setBet(Number(e.target.value))}
            min="1"
            max={balance}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white text-center"
          />
          <div className="grid grid-cols-3 gap-2">
            {['player', 'tie', 'banker'].map(type => (
              <button
                key={type}
                onClick={() => setBetType(type)}
                className={`py-3 rounded font-bold transition ${
                  betType === type
                    ? 'bg-cyan-500 text-black'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                {type === 'player' ? 'Player' : type === 'tie' ? 'Tie' : 'Banker'}
              </button>
            ))}
          </div>
          <button
            onClick={startGame}
            disabled={bet > balance}
            className="btn-primary w-full"
          >
            Deal
          </button>
        </div>
      )}

      {gameState === 'result' && (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-yellow-400">{message}</h2>
          <div>
            <h3 className="text-lg font-bold mb-3">Player: {handValue(playerHand)}</h3>
            <div className="flex flex-wrap justify-center">
              {playerHand.map((card, i) => <CardDisplay key={i} card={card} />)}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-3">Banker: {handValue(bankerHand)}</h3>
            <div className="flex flex-wrap justify-center">
              {bankerHand.map((card, i) => <CardDisplay key={i} card={card} />)}
            </div>
          </div>
          <button onClick={reset} className="btn-primary w-full">Play Again</button>
        </div>
      )}
    </div>
  )
}
