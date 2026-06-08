'use client'

import { useState, useEffect } from 'react'
import Blackjack from '@/components/games/Blackjack'
import Mines from '@/components/games/Mines'
import Baccarat from '@/components/games/Baccarat'
import Limbo from '@/components/games/Limbo'
import Dice from '@/components/games/Dice'
import Chicken from '@/components/games/Chicken'
import Slide from '@/components/games/Slide'

const games = [
  { id: 'blackjack', name: '🃏 Blackjack', component: Blackjack },
  { id: 'mines', name: '💣 Mines', component: Mines },
  { id: 'baccarat', name: '🎴 Baccarat', component: Baccarat },
  { id: 'limbo', name: '📈 Limbo', component: Limbo },
  { id: 'dice', name: '🎲 Dice', component: Dice },
  { id: 'chicken', name: '🐔 Chicken', component: Chicken },
  { id: 'slide', name: '🏄 Slide', component: Slide },
]

const apps = [
  { id: 'joke', name: '😂 Joke Generator', href: '/joke' },
  { id: 'todo', name: '✓ To-Do List', href: '/todo' },
]

export default function Home() {
  const [balance, setBalance] = useState(1000)
  const [selectedGame, setSelectedGame] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('casino-balance')
    if (saved) setBalance(Number(saved))
  }, [])

  useEffect(() => {
    if (mounted) localStorage.setItem('casino-balance', balance)
  }, [balance, mounted])

  if (!mounted) return null

  if (selectedGame) {
    const game = games.find(g => g.id === selectedGame)
    const GameComponent = game.component
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setSelectedGame(null)}
              className="btn-primary text-sm"
            >
              ← Back to Lobby
            </button>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-cyan-400 mb-2">{game.name}</h1>
              <div className="balance-display">💰 ${balance}</div>
            </div>
            <div className="w-20"></div>
          </div>
          <GameComponent balance={balance} setBalance={setBalance} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 pt-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-4">🎰 CASINO GAMES</h1>
          <div className="balance-display text-4xl">💰 ${balance}</div>
          <button
            onClick={() => { setBalance(1000); localStorage.setItem('casino-balance', '1000') }}
            className="mt-4 text-sm bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition"
          >
            Reset Balance
          </button>
        </div>

        {/* Games Section */}
        <div>
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">🎮 Casino Games</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {games.map(game => (
              <button
                key={game.id}
                onClick={() => setSelectedGame(game.id)}
                className="game-container hover:scale-105 transition transform duration-200 hover:bg-opacity-50 cursor-pointer p-6 text-center"
              >
                <div className="text-4xl mb-3">{game.name.split(' ')[0]}</div>
                <div className="text-lg font-semibold text-cyan-300">{game.name.split(' ').slice(1).join(' ')}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Apps Section */}
        <div>
          <h2 className="text-2xl font-bold text-purple-400 mb-4">📱 Fun Apps</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {apps.map(app => (
              <a
                key={app.id}
                href={app.href}
                className="game-container hover:scale-105 transition transform duration-200 hover:bg-opacity-50 cursor-pointer p-6 text-center"
              >
                <div className="text-4xl mb-3">{app.name.split(' ')[0]}</div>
                <div className="text-lg font-semibold text-purple-300">{app.name.split(' ').slice(1).join(' ')}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
