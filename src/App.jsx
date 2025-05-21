import { useState, useEffect } from 'react'
import './App.css'
import Button from './components/Button'
import Card from './components/Card'

const EMOJIS = ['🐶', '🐱', '🦊', '🐻', '🐼', '🐵']; // 6 pairs for 12 cards
// const EMOJIS = ['../assets/dog.png', '../assets/cat.png', '../assets/fox.png', '../assets/bear.png', '../assets/panda.png', '../assets/monkey.png'];
function shuffle(array) {
  const arr = array.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
  return arr
}

function createShuffledDeck() {
  const cards = [...EMOJIS, ...EMOJIS].map((emoji, i) => ({
    id: i + '-' + emoji,
    emoji,
  }))
  return shuffle(cards)
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60).toString().padStart(2, '0')
  const sec = (seconds % 60).toString().padStart(2, '0')
  return `${min}:${sec}`
}

function App() {
  const [deck, setDeck] = useState(createShuffledDeck())
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedPairs, setMatchedPairs] = useState([])
  const [moves, setMoves] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameWon, setGameWon] = useState(false)

  // Timer effect
  useEffect(() => {
    let interval
    if (isPlaying && !gameWon) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, gameWon])

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(prev => prev + 1)
      const [first, second] = flippedCards
      const firstCard = deck.find(card => card.id === first)
      const secondCard = deck.find(card => card.id === second)

      if (firstCard.emoji === secondCard.emoji) {
        setMatchedPairs(prev => [...prev, first, second])
        setFlippedCards([])
      } else {
        setTimeout(() => {
          setFlippedCards([])
        }, 1000)
      }
    }
  }, [flippedCards, deck])

  // Check for win
  useEffect(() => {
    if (matchedPairs.length === deck.length && deck.length > 0) {
      setGameWon(true)
      setIsPlaying(false)
    }
  }, [matchedPairs, deck])

  const handleCardClick = (id) => {
    if (flippedCards.length === 2 || matchedPairs.includes(id) || flippedCards.includes(id)) return
    
    if (!isPlaying) {
      setIsPlaying(true)
    }

    setFlippedCards(prev => [...prev, id])
  }

  const handleReset = () => {
    setDeck(createShuffledDeck())
    setFlippedCards([])
    setMatchedPairs([])
    setMoves(0)
    setTimer(0)
    setIsPlaying(false)
    setGameWon(false)
  }

  return (
    <div className="memory-game-container">
      <h1>Memory Game 🧠</h1>
      <div className="game-stats">
        <div>Time: {formatTime(timer)}</div>
        <div>Moves: {moves}</div>
        <div>Points: {Math.floor(matchedPairs.length / 2)}</div>
      </div>
      <Button onClick={handleReset}>New Game</Button>
      <div className="cards-grid">
        {deck.map(card => (
          <Card
            key={card.id}
            isFlipped={flippedCards.includes(card.id) || matchedPairs.includes(card.id)}
            onClick={() => handleCardClick(card.id)}
          >
            {card.emoji}
          </Card>
        ))}
      </div>
      {gameWon && (
        <div className="victory-message">
          🎉 Congratulations! 🎉<br />
          You won in {moves} moves and {formatTime(timer)}!
        </div>
      )}
    </div>
  )
}

export default App
