'use client'

import { useState, useEffect } from 'react'

export default function Mines({ balance, setBalance }) {
  const [bet, setBet] = useState(10)
  const [gameState, setGameState] = useState('betting')
  const [grid, setGrid] = useState([])
  const [mines, setMines] = useState([])
  const [revealed, setRevealed] = useState(new Set())
  const [multiplier, setMultiplier] = useState(1)
  const [message, setMessage] = useState('')
  const [mineCount, setMineCount] = useState(3)

  const gridSize = 25

  const startGame = () => {
    if (bet > balance) return
    const newMines = new Set()
    while (newMines.size < mineCount) {
      newMines.add(Math.floor(Math.random() * gridSize))
    }
    setMines(Array.from(newMines))
    setGrid(Array(gridSize).fill(0))
    setRevealed(new Set())
    setGameState('playing')
    setMultiplier(1)
    setMessage('')
  }

  const revealCell = (index) => {
    if (revealed.has(index)) return
    const newRevealed = new Set(revealed)
    newRevealed.add(index)
    setRevealed(newRevealed)

    if (mines.includes(index)) {
      setMessage('💣 Hit a mine! Game Over!')
      setBalance(balance - bet)
      setGameState('result')
    } else {
      const newMultiplier = multiplier + 0.1
      setMultiplier(newMultiplier)
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
          <h2 className="text-2xl font-bold">Mines Game</h2>
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
            <label className="block mb-2">Mines: {mineCount}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={mineCount}
              onChange={(e) => setMineCount(Number(e.target.value))}
              className="w-full"
            />
          </div>
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
            <div className="text-3xl font-bold text-yellow-400">Multiplier: {multiplier.toFixed(1)}x</div>
            <div className="text-lg text-cyan-300">Potential Win: ${Math.floor(bet * multiplier)}</div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {Array(gridSize).fill(0).map((_, i) => (
              <button
                key={i}
                onClick={() => revealCell(i)}
                disabled={revealed.has(i)}
                className={`aspect-square rounded font-bold text-xl transition ${
                  revealed.has(i)
                    ? mines.includes(i)
                      ? 'bg-red-600 text-white'
                      : 'bg-green-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {revealed.has(i) ? (mines.includes(i) ? '💣' : '✓') : '?'}
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
