'use client'

import { useState, useEffect } from 'react'

export default function JokeGenerator() {
  const [joke, setJoke] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [jokeType, setJokeType] = useState('general')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchJoke = async () => {
    setLoading(true)
    setError('')
    setJoke('')

    try {
      let url = 'https://official-joke-api.appspot.com/random_joke'
      
      if (jokeType === 'knock-knock') {
        url = 'https://official-joke-api.appspot.com/jokes/knock-knock/random'
      } else if (jokeType === 'programming') {
        url = 'https://official-joke-api.appspot.com/jokes/programming/random'
      }

      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch')
      
      const data = await response.json()
      const jokeText = Array.isArray(data) 
        ? data[0]?.joke || `${data[0]?.setup} ... ${data[0]?.punchline}`
        : data.joke || `${data.setup} ... ${data.punchline}`
      
      setJoke(jokeText)
    } catch (err) {
      setError('Failed to fetch joke. Please try again!')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
            😂 Random Joke Generator
          </h1>
          <p className="text-gray-400">Get a random joke to brighten your day!</p>
        </div>

        <div className="game-container space-y-6">
          {/* Joke Type Selection */}
          <div>
            <label className="block text-lg font-bold mb-3 text-cyan-300">Choose Joke Type:</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { value: 'general', label: 'General' },
                { value: 'knock-knock', label: 'Knock-Knock' },
                { value: 'programming', label: 'Programming' }
              ].map(type => (
                <button
                  key={type.value}
                  onClick={() => setJokeType(type.value)}
                  className={`py-3 rounded font-bold transition ${
                    jokeType === type.value
                      ? 'bg-cyan-500 text-black'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Joke Display */}
          {joke && (
            <div className="bg-gradient-to-r from-purple-900 to-pink-900 p-6 rounded-lg border-2 border-purple-500 min-h-24 flex items-center">
              <p className="text-xl text-white leading-relaxed">{joke}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-900 p-4 rounded-lg border-2 border-red-500">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {!joke && !error && !loading && (
            <div className="text-center text-gray-400 py-8">
              <p className="text-lg">Click the button below to get a joke!</p>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin">
                <div className="text-4xl">🤔</div>
              </div>
              <p className="text-gray-300 mt-4">Fetching a joke for you...</p>
            </div>
          )}

          {/* Get Joke Button */}
          <button
            onClick={fetchJoke}
            disabled={loading}
            className="btn-primary w-full py-4 text-lg font-bold"
          >
            {loading ? 'Loading...' : 'Get Random Joke 😆'}
          </button>

          {/* Back Button */}
          <a
            href="/"
            className="btn-primary w-full py-3 text-center block"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
