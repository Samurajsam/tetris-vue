<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"
import { useTetris } from "../composables/useTetris"
import './Tetris.css'
import LeftArrow from "../icons/LeftArrow.vue"
import RightArrow from "../icons/RightArrow.vue"
import RestartIcon from "../icons/RestartIcon.vue"
import PauseIcon from "../icons/PauseIcon.vue"
import PlayIcon from "../icons/PlayIcon.vue"
import VolumeOnIcon from "../icons/VolumeOnIcon.vue"
import VolumeOffIcon from "../icons/VolumeOffIcon.vue"
import bgImage from "../assets/tetris-start-bg.png"

const { drawBoard, handleKey, startGame, stopGame, pauseGame, resumeGame, score, isGameOver } = useTetris()

const isRunning = ref(false)
const isPaused = ref(false)
const showRotateOverlay = ref(false)
const isMusicOn = ref(true)
const audioElement = ref(null)
const hasUserInteracted = ref(false)
let holdInterval = null

function handleStart() {
  isRunning.value = true
  startGame()
  // Pierwsza interakcja użytkownika - uruchom muzykę
  if (!hasUserInteracted.value) {
    hasUserInteracted.value = true
    playMusic()
  }
}

function handleRestart() {
  stopGame()
  startGame()
  // Muzyka gra dalej, nie resetujemy jej
}

function handlePlayAgain() {
  stopGame()
  isGameOver.value = false
  isRunning.value = false
  isPaused.value = false
}

function handlePause() {
  if (!isPaused.value) {
    pauseGame()
  } else {
    resumeGame()
  }
  isPaused.value = !isPaused.value
}

function toggleMusic() {
  // Oznacz że użytkownik wchodził w interakcję
  if (!hasUserInteracted.value) {
    hasUserInteracted.value = true
  }
  
  isMusicOn.value = !isMusicOn.value
  if (isMusicOn.value) {
    playMusic()
  } else {
    pauseMusic()
  }
}

function playMusic() {
  if (audioElement.value && isMusicOn.value && !isPaused.value) {
    audioElement.value.play().catch(err => console.log('Audio play failed:', err))
  }
}

function pauseMusic() {
  if (audioElement.value) {
    audioElement.value.pause()
  }
}

function stopMusic() {
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value.currentTime = 0
  }
}

function handleEnterKey(e) {
  if (e.key === "Enter") {
    if (!isRunning.value && !isGameOver.value) {
      // Ekran startowy - uruchom grę
      handleStart()
    } else if (isGameOver.value) {
      // Ekran game over - wróć do startu
      handlePlayAgain()
    }
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKey)
  window.addEventListener("keydown", handleEnterKey)
  checkOrientation()
  window.addEventListener("orientationchange", checkOrientation)
  window.addEventListener("resize", checkOrientation)
  
  // Inicjalizacja audio
  audioElement.value = new Audio(import.meta.env.BASE_URL + 'tetris-theme.mp3')
  audioElement.value.loop = true
  audioElement.value.volume = 0.5
  
  // Nie uruchamiamy muzyki automatycznie - czekamy na interakcję użytkownika
  // (wymóg przeglądarek mobilnych)
})

onBeforeUnmount(() => {
  stopGame()
  stopMusic()
  stopHold()
  window.removeEventListener("keydown", handleKey)
  window.removeEventListener("keydown", handleEnterKey)
  window.removeEventListener("orientationchange", checkOrientation)
  window.removeEventListener("resize", checkOrientation)
})

function handleMove(action) {
  if (action === "left") handleKey({ key: "ArrowLeft" })
  if (action === "right") handleKey({ key: "ArrowRight" })
  if (action === "down") handleKey({ key: "ArrowDown" }) // B = przyspieszenie
  if (action === "rotate") handleKey({ key: "ArrowUp" }) // A = obrót
}

function startHold(action) {
  // Pierwsze wywołanie od razu
  handleMove(action)
  // Potem powtarzaj co 150ms podczas przytrzymania
  holdInterval = setInterval(() => {
    handleMove(action)
  }, 150)
}

function stopHold() {
  if (holdInterval) {
    clearInterval(holdInterval)
    holdInterval = null
  }
}

function checkOrientation() {
  // jeżeli ekran jest „pionowy” – pokaż overlay, żeby obrócić
  showRotateOverlay.value = window.innerHeight > window.innerWidth
  
  // Automatyczne przejście w tryb pełnoekranowy na urządzeniach mobilnych
  if (window.innerHeight < window.innerWidth && isMobileDevice()) {
    enterFullscreen()
  }
}

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

function enterFullscreen() {
  const elem = document.documentElement
  if (elem.requestFullscreen) {
    elem.requestFullscreen().catch(err => console.log('Fullscreen request failed:', err))
  } else if (elem.webkitRequestFullscreen) { // Safari
    elem.webkitRequestFullscreen()
  } else if (elem.msRequestFullscreen) { // IE11
    elem.msRequestFullscreen()
  }
}
</script>

<template>
  <div class="tetris-wrapper" :class="{ 'start-screen': !isRunning }" :style="!isRunning ? { backgroundImage: `url(${bgImage})` } : {}">
    <!-- Przycisk muzyki -->
    <button class="music-toggle" @click="toggleMusic" aria-label="Toggle music">
      <component :is="isMusicOn ? VolumeOnIcon : VolumeOffIcon" />
    </button>

    <div class="header">
      <h1>
      <div v-if="isRunning && !isGameOver" class="score">Score: {{ score }}</div>
      </h1>
    </div>

    <div class="game-area">
      <!-- LEWO: D-Pad -->
      <div v-if="isRunning && !isGameOver" class="dpad">
        <button 
          class="control-btn left" 
          @mousedown="startHold('left')" 
          @mouseup="stopHold" 
          @mouseleave="stopHold"
          @touchstart.prevent="startHold('left')" 
          @touchend.prevent="stopHold"
          aria-label="Move left">
          <LeftArrow />
        </button>

        <button 
          class="control-btn right" 
          @mousedown="startHold('right')" 
          @mouseup="stopHold" 
          @mouseleave="stopHold"
          @touchstart.prevent="startHold('right')" 
          @touchend.prevent="stopHold"
          aria-label="Move right">
          <RightArrow />
        </button>
      </div>

      <!-- ŚRODEK: Plansza -->
      <div class="board" v-if="isRunning && !isGameOver">
        <div
          v-for="(cell, index) in drawBoard().flat()"
          :key="index"
          :class="['cell', cell ? 'filled filled-' + cell : 'empty']"
        ></div>
      </div>

      <!-- PRAWA STRONA: A (obrót) i B (przyspieszenie) -->
      <div v-if="isRunning && !isGameOver" class="right-controls">
      <!-- <div v-if="isRunning && !isGameOver" class="action-panel"> -->
        <!-- A / B -->
        <div class="ab-buttons">
          <button 
            class="control-btn btn-b" 
            @mousedown="startHold('down')" 
            @mouseup="stopHold" 
            @mouseleave="stopHold"
            @touchstart.prevent="startHold('down')" 
            @touchend.prevent="stopHold">
            B
          </button>
          <button 
            class="control-btn btn-a" 
            @mousedown="startHold('rotate')" 
            @mouseup="stopHold" 
            @mouseleave="stopHold"
            @touchstart.prevent="startHold('rotate')" 
            @touchend.prevent="stopHold">
            A
          </button>
        </div>

        <!-- Restart / Pauza -->
        <div class="system-buttons">
          <button class="control-btn small-btn restart-btn" @click="handleRestart">
            <RestartIcon />
          </button>
          <button class="control-btn small-btn pause-btn" @click="handlePause">
            <component :is="isPaused ? PlayIcon : PauseIcon" />
          </button>
        </div>
      </div>
    </div>

    <!-- Ekran Game Over -->
    <div v-if="isGameOver" class="gameover">
      <h1>GAME OVER!</h1>
      <h2>Your score: {{ score }} pts</h2>
      <button class="play-again-btn" @click="handlePlayAgain">Play Again</button>
    </div>

    <!-- Start / Restart -->
    <div class="footer">
      <button v-if="!isRunning" class="start-btn" @click="handleStart">
        Press to start
      </button>
    </div>

    <!-- Overlay: wymuszamy pozycję poziomą na mobile -->
    <div v-if="showRotateOverlay" class="rotate-overlay">
      <p>Turn your device horizontally 📱↔️</p>
    </div>
  </div>
</template>
