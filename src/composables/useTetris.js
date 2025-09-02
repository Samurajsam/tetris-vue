// src/composables/useTetris.js
import { ref } from "vue"
import { PIECES } from "../utils/pieces"

export function useTetris(rows = 20, cols = 10) {
  const board = ref(Array.from({ length: rows }, () => Array(cols).fill(0)))
  const score = ref(0)
  const currentPiece = ref(null)
  const isGameOver = ref(false)
  let gameInterval = null

  function spawnPiece() {
    const shape = PIECES[Math.floor(Math.random() * PIECES.length)]
    currentPiece.value = {
      x: Math.floor(cols / 2) - Math.ceil(shape[0].length / 2),
      y: 0,
      shape
    }

    // sprawdzenie od razu po spawn → jeśli kolizja = koniec gry
    if (collision()) {
      stopGame()
      isGameOver.value = true
    }
  }

  function rotate(shape) {
    return shape[0].map((_, i) => shape.map(r => r[i]).reverse())
  }

  function collision(xOffset = 0, yOffset = 0, newShape = null) {
    const shape = newShape || currentPiece.value.shape
    return shape.some((row, dy) =>
      row.some((cell, dx) => {
        if (!cell) return false
        const x = currentPiece.value.x + dx + xOffset
        const y = currentPiece.value.y + dy + yOffset
        return (
          x < 0 ||
          x >= cols ||
          y >= rows ||
          (y >= 0 && board.value[y][x])
        )
      })
    )
  }

  function mergePiece() {
    currentPiece.value.shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell) {
          board.value[currentPiece.value.y + dy][currentPiece.value.x + dx] = 1
        }
      })
    })
  }

  function clearLines() {
    board.value = board.value.filter(row => row.some(cell => !cell))
    const cleared = rows - board.value.length
    if (cleared > 0) {
      score.value += cleared * 100
      while (board.value.length < rows) {
        board.value.unshift(Array(cols).fill(0))
      }
    }
  }

  function tick() {
    if (!currentPiece.value) {
      spawnPiece()
      return
    }

    if (!collision(0, 1)) {
      currentPiece.value.y++
    } else {
      mergePiece()
      clearLines()
      spawnPiece()
    }
  }

  function drawBoard() {
    const b = board.value.map(row => [...row])
    if (currentPiece.value) {
      currentPiece.value.shape.forEach((row, dy) => {
        row.forEach((cell, dx) => {
          if (cell) {
            const y = currentPiece.value.y + dy
            const x = currentPiece.value.x + dx
            if (b[y] && b[y][x] !== undefined) b[y][x] = cell
          }
        })
      })
    }
    return b
  }

  function handleKey(e) {
    if (!currentPiece.value || isGameOver.value) return

    if (e.key === "ArrowLeft" && !collision(-1, 0)) {
      currentPiece.value.x--
    }
    if (e.key === "ArrowRight" && !collision(1, 0)) {
      currentPiece.value.x++
    }
    if (e.key === "ArrowDown" && !collision(0, 1)) {
      currentPiece.value.y++
    }
    if (e.key === "ArrowUp") {
      const newShape = rotate(currentPiece.value.shape)
      if (!collision(0, 0, newShape)) {
        currentPiece.value.shape = newShape
      }
    }
  }

  function startGame() {
    stopGame()
    board.value = Array.from({ length: rows }, () => Array(cols).fill(0))
    score.value = 0
    isGameOver.value = false
    spawnPiece()
    gameInterval = setInterval(tick, 500)
  }

  function stopGame() {
    if (gameInterval) {
      clearInterval(gameInterval)
      gameInterval = null
    }
  }

  return {
    board,
    cols,
    score,
    drawBoard,
    handleKey,
    startGame,
    stopGame,
    isGameOver
  }
}
