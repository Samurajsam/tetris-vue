<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"
import { useTetris } from "../composables/useTetris"

const { drawBoard, handleKey, startGame, stopGame, score, isGameOver } = useTetris()

const isRunning = ref(false)

function handleStart() {
  isRunning.value = true
  startGame()
}

function handleRestart() {
  stopGame()
  startGame()
}

onMounted(() => {
  window.addEventListener("keydown", handleKey)
})

onBeforeUnmount(() => {
  stopGame()
  window.removeEventListener("keydown", handleKey)
})

// Mapowanie ID → kolor
const pieceColors = {
  1: "#06b6d4", // I – cyan
  2: "#facc15", // O – yellow
  3: "#a855f7", // T – purple
  4: "#22c55e", // S – green
  5: "#ef4444", // Z – red
  6: "#3b82f6", // J – blue
  7: "#f97316", // L – orange
}
</script>

<template>
  <div class="tetris-wrapper">
    <div class="header">
      <h1>Tetris</h1>
      <div v-if="isRunning && !isGameOver" class="score">Wynik: {{ score }}</div>
    </div>

    <!-- Plansza -->
    <div class="board" v-if="isRunning && !isGameOver">
      <div
        v-for="(cell, index) in drawBoard().flat()"
        :key="index"
        class="cell"
        :style="{ backgroundColor: cell ? pieceColors[cell] : '#111' }"
      ></div>
    </div>

    <!-- Ekran Game Over -->
    <div v-if="isGameOver" class="gameover">
      <h2>Koniec gry!</h2>
      <p>Twój wynik: {{ score }}</p>
    </div>

    <div class="footer">
      <button
        v-if="!isRunning"
        class="start-btn"
        @click="handleStart"
      >
        Start
      </button>

      <button
        v-else-if="isGameOver"
        class="restart-btn"
        @click="handleRestart"
      >
        Zagraj ponownie
      </button>

      <button
        v-else
        class="restart-btn"
        @click="handleRestart"
      >
        Restart
      </button>
    </div>
  </div>
</template>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
}

.tetris-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #111;
  color: white;
  align-items: center;
  box-sizing: border-box;
}

.header {
  flex: 0 0 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.header h1 {
  margin: 0;
  font-size: 3vh;
}

.score {
  font-size: 2vh;
}

.board {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(20, 1fr);
  width: 40vh;
  height: 80%;
  max-height: 80%;
  background-color: #222;
  gap: 1px;
}

.cell {
  width: 100%;
  height: 100%;
  border: 1px solid #333;
  box-sizing: border-box;
}

.gameover {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 3vh;
  color: #f87171;
}

.footer {
  flex: 0 0 10%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.start-btn,
.restart-btn {
  padding: 0.5em 1em;
  font-size: 2vh;
  background-color: #16a34a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.start-btn:hover,
.restart-btn:hover {
  background-color: #22c55e;
}
</style>
