'use client'

import { useState } from 'react'

export default function Chicken({ balance, setBalance }) {
  const [bet, setBet] = useState(10)
  const [gameState, setGameState] = useState('betting')
  const [multiplier, setMultiplier] = useState(1)
  const [message, setMessage] = useState('')
  const [cashOutOptions, setCashOutOptions] = useState([])
  const [roundNumber, setRoundNumber] = useState(0)

  const startGame = () => {
    if (bet > balance) return
    setMultiplier(1)
    setRoundNumber(1)
    setCashOutOptions([])
    playRound(1)
  }

  const playRound = (round) => {
    setTimeout(() => {
      const rand = Math.random()
      if (rand > 0.3) {
        const newMultiplier = 1 + (round * 0.5)
        setMultiplier(newMultiplier)
        setCashOutOptions([...cashOutOptions, { round, multiplier: newMultiplier }])
        if (round < 5) {
          setRoundNumber(round + 1)
          playRound(round + 1)
        } else {
          endGame(newMultiplier, true)
        }
      } else {
        endGame(multiplier, false)
      }
    }, 1000)
  }

  const endGame = (finalMultiplier, won) => {
    if (won) {
      setMessage(`🎉 Max rounds reached! Won $${Math.floor(bet * finalMultiplier)}`)
      setBalance(balance - bet + bet * finalMultiplier)
    } else {
      setMessage(`💥 Chicken lost! Game over! Won $${Math.floor(bet * finalMultiplier)}`)
      setBalance(balance - bet + bet * finalMultiplier)
    }
    setGameState('result')
  }

  const cashOut = (mult) => {
    setMessage(`💰 Cashed out at ${mult.toFixed(2)}x! Won $${Math.floor(bet * mult)}`)
    setBalance(balance - bet + bet * mult)
    setGameState('result')
  }

  const reset = () => {
    setGameState('betting')
    setMultiplier(1)
    setRoundNumber(0)
  }

  return (
    <div className="game-container">
      {gameState === 'betting' && (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">🐔 Chicken Game</h2>
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

      {gameState === 'result' && (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-yellow-400">{message}</h2>
          <button onClick={reset} className="btn-primary w-full">Play Again</button>
        </div>
      )}

      {gameState !== 'betting' && gameState !== 'result' && (
        <div className="text-center space-y-6">
          <div className="text-7xl">🐔</div>
          <div className="text-5xl font-bold text-yellow-400">{multiplier.toFixed(2)}x</div>
          <div className="text-xl text-cyan-300">Round {roundNumber}</div>
          <div className="space-y-2">
            {cashOutOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => cashOut(opt.multiplier)}
                className="btn-primary w-full"
              >
                Cash Out at {opt.multiplier.toFixed(2)}x
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
