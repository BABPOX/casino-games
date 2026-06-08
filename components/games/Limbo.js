'use client'

import { useState } from 'react'

export default function Limbo({ balance, setBalance }) {
  const [bet, setBet] = useState(10)
  const [gameState, setGameState] = useState('betting')
  const [multiplier, setMultiplier] = useState(1)
  const [targetMultiplier, setTargetMultiplier] = useState(1.5)
  const [message, setMessage] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  const startGame = () => {
    if (bet > balance || targetMultiplier < 1.01) return
    setIsRunning(true)
    setMultiplier(1)
    
    const interval = setInterval(() => {
      setMultiplier(prev => {
        const next = prev + 0.01
        if (next > targetMultiplier) {
          clearInterval(interval)
          setIsRunning(false)
          setMessage('🎉 You Won!')
          setBalance(balance - bet + bet * targetMultiplier)
          setGameState('result')
          return next
        }
        return next
      })
    }, 50)
  }

  const crash = () => {
    setIsRunning(false)
    setMessage('💥 Crashed! You Lost!')
    setBalance(balance - bet)
    setGameState('result')
  }

  const reset = () => {
    setGameState('betting')
    setMultiplier(1)
  }

  return (
    <div className="game-container">
      {gameState === 'betting' && (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Limbo</h2>
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
            <label className="block mb-2">Target Multiplier: {targetMultiplier.toFixed(2)}x</label>
            <input
              type="range"
              min="1.01"
              max="10"
              step="0.1"
              value={targetMultiplier}
              onChange={(e) => setTargetMultiplier(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <button
            onClick={startGame}
            disabled={bet > balance}
            className="btn-primary w-full"
          >
            Start
          </button>
        </div>
      )}

      {isRunning && (
        <div className="text-center space-y-6">
          <div className="text-6xl font-bold text-yellow-400 animate-pulse">
            {multiplier.toFixed(2)}x
          </div>
          <div className="h-2 bg-gray-700 rounded overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all"
              style={{ width: `${(multiplier / targetMultiplier) * 100}%` }}
            />
          </div>
          <button onClick={crash} className="btn-primary w-full text-lg py-4">Cash Out Now</button>
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
