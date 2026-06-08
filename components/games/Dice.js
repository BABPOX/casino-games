'use client'

import { useState } from 'react'

export default function Dice({ balance, setBalance }) {
  const [bet, setBet] = useState(10)
  const [gameState, setGameState] = useState('betting')
  const [selectedNumber, setSelectedNumber] = useState(3)
  const [rolledNumber, setRolledNumber] = useState(null)
  const [message, setMessage] = useState('')
  const [isRolling, setIsRolling] = useState(false)

  const rollDice = () => {
    if (bet > balance || selectedNumber < 1 || selectedNumber > 6) return
    
    setIsRolling(true)
    
    let rolls = 0
    const interval = setInterval(() => {
      rolls++
      setRolledNumber(Math.floor(Math.random() * 6) + 1)
      if (rolls > 10) {
        clearInterval(interval)
        const final = Math.floor(Math.random() * 6) + 1
        setRolledNumber(final)
        setIsRolling(false)
        
        if (final === selectedNumber) {
          setMessage('🎉 You Won! Correct number!')
          setBalance(balance - bet + bet * 6)
        } else {
          setMessage(`💥 Wrong! It was ${final}`)
          setBalance(balance - bet)
        }
        setGameState('result')
      }
    }, 100)
  }

  const reset = () => {
    setGameState('betting')
    setRolledNumber(null)
  }

  return (
    <div className="game-container">
      {gameState === 'betting' && (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Dice Game</h2>
          <div>
            <label className="block mb-2">Bet Amount</label>
            <input
              type="number"
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              min="1"
              max={balance}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white text-center"
            />
          </div>
          <div>
            <label className="block mb-2">Pick a number (1-6)</label>
            <div className="grid grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map(num => (
                <button
                  key={num}
                  onClick={() => setSelectedNumber(num)}
                  className={`py-4 rounded font-bold text-xl transition ${
                    selectedNumber === num
                      ? 'bg-cyan-500 text-black'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={rollDice}
            disabled={bet > balance}
            className="btn-primary w-full"
          >
            Roll Dice
          </button>
        </div>
      )}

      {(isRolling || gameState === 'result') && (
        <div className="text-center space-y-6">
          <div className={`text-9xl ${isRolling ? 'animate-bounce' : ''}`}>
            🎲 {rolledNumber}
          </div>
          <div className="text-2xl font-bold">You picked: {selectedNumber}</div>
          {gameState === 'result' && (
            <>
              <h2 className="text-2xl font-bold text-yellow-400">{message}</h2>
              <button onClick={reset} className="btn-primary w-full">Play Again</button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
