'use client'

import { useState, useEffect } from 'react'

export default function Slide({ balance, setBalance }) {
  const [bet, setBet] = useState(10)
  const [gameState, setGameState] = useState('betting')
  const [tiles, setTiles] = useState([])
  const [revealed, setRevealed] = useState(new Set())
  const [multiplier, setMultiplier] = useState(1)
  const [message, setMessage] = useState('')
  const [winTile, setWinTile] = useState(null)

  const gridSize = 16

  const startGame = () => {
    if (bet > balance) return
    const win = Math.floor(Math.random() * gridSize)
    setWinTile(win)
    setTiles(Array(gridSize).fill(0))
    setRevealed(new Set())
    setGameState('playing')
    setMultiplier(1)
    setMessage('')
  }

  const revealTile = (index) => {
    if (revealed.has(index)) return
    const newRevealed = new Set(revealed)
    newRevealed.add(index)
    setRevealed(newRevealed)

    if (index === winTile) {
      const newMultiplier = multiplier + 0.25
      setMultiplier(newMultiplier)
    } else {
      setMessage('💥 Wrong tile! Game over!')
      setBalance(balance - bet)
      setGameState('result')
    }
  }

  const cashOut = () => {
    const winnings = bet * multiplier
    setBalance(balance - bet + winnings)
    setMessage(`💰 Cashed out! Won $${Math.floor(winnings)}`)
    setGameState('result')
  }

  const reset = () => {
    setGameState('betting')
    setRevealed(new Set())
    setBet(10)
  }

  return (
    <div className="game-container">
      {gameState === 'betting' && (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Slide Game</h2>
          <input
            type="number"
            value={bet}
            onChange={(e) => setBet(Number(e.target.value))}
            min="1"
            max={balance}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white text-center"
          />
          <button
            onClick={startGame}
            disabled={bet > balance}
            className="btn-primary w-full"
          >
            Start Game
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">Multiplier: {multiplier.toFixed(2)}x</div>
            <div className="text-lg text-cyan-300">Potential Win: ${Math.floor(bet * multiplier)}</div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {Array(gridSize).fill(0).map((_, i) => (
              <button
                key={i}
                onClick={() => revealTile(i)}
                disabled={revealed.has(i)}
                className={`aspect-square rounded font-bold text-xl transition ${
                  revealed.has(i)
                    ? i === winTile
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {revealed.has(i) ? (i === winTile ? '✓' : '✕') : '?'}
              </button>
            ))}
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={cashOut} className="btn-primary">Cash Out</button>
          </div>
        </div>
      )}

      {gameState === 'result' && (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-yellow-400">{message}</h2>
          <button onClick={reset} className="btn-primary w-full">Play Again</button>
        </div>
      )}
    </div>
  )
}
