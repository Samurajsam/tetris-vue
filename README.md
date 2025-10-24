# 🎮 Tetris Game - Vue.js

A classic Tetris game built with Vue 3, Vite, and Composition API. The game features a responsive interface with support for both keyboard and touch controls, making it perfect for playing on computers and mobile devices.

## 🚀 Live Demo

🔗 **[Play Now!](https://tetrisgame-samurajsam.netlify.app)**

## ✨ Features

- 🎯 Classic Tetris gameplay with various block shapes
- 🎵 Background music with toggle on/off option
- 📱 Responsive design - works on desktop and mobile
- 🎮 Keyboard (arrow keys) and touch controls support
- ⏸️ Pause and restart functionality
- 🏆 Scoring system
- 📐 Automatic fullscreen mode on mobile devices in landscape orientation
- 🔄 Overlay notification to rotate device

## 🛠️ Technologies

- **Vue 3** - JavaScript Framework
- **Vite** - Fast build tool
- **Composition API** - Modern Vue API
- **CSS3** - Styling and animations
- **Netlify** - Hosting and deployment

## 📋 Requirements

- Node.js (version 16 or higher)
- npm or yarn

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/Samurajsam/tetris-vue.git
cd tetris-vue
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎮 Controls

### Keyboard (Desktop)
- **Left Arrow** - Move block left
- **Right Arrow** - Move block right
- **Up Arrow** - Rotate block
- **Down Arrow** - Speed up falling
- **Enter** - Start game / Restart after Game Over

### Touch Controls (Mobile)
- **D-Pad (left)** - Left/right buttons to move
- **A Button** - Rotate block
- **B Button** - Speed up falling
- **Restart** - Restart game
- **Pause** - Pause/Resume game

## 📦 Build

To build the project for production:

```bash
npm run build
```

Production files will be located in the `dist/` directory.

## 🚢 Deployment

The project is configured for automatic deployment on Netlify.

### Manual deployment:

```bash
npm run build
netlify deploy --prod --dir=dist
```

## 📁 Project Structure

```
tetris-vue/
├── public/              # Static files
│   ├── tetris-theme.mp3 # Music (not in repo)
│   └── manifest.json    # PWA manifest
├── src/
│   ├── assets/          # Assets (images)
│   ├── components/      # Vue components
│   │   ├── Tetris.vue   # Main game component
│   │   └── Tetris.css   # Game styles
│   ├── composables/     # Game logic
│   │   └── useTetris.js # Tetris composition
│   ├── icons/           # SVG icon components
│   └── main.js          # Entry point
├── index.html
├── vite.config.js       # Vite configuration
├── netlify.toml         # Netlify configuration
└── package.json
```

## ⚙️ Configuration

### Adding Custom Music

1. Place the `tetris-theme.mp3` file in the `public/` folder
2. The file is in `.gitignore` - it won't be committed to the repo

### Adding Custom Background

1. Place the `tetris-start-bg.png` file in the `src/assets/` folder
2. The file is in `.gitignore` - it won't be committed to the repo

## 🐛 Bug Reports

If you find a bug or have a suggestion, please open an [Issue](https://github.com/Samurajsam/tetris-vue/issues).

## 📄 License

MIT License - feel free to use and modify the project.

## 👤 Author

**Samurajsam**
- GitHub: [@Samurajsam](https://github.com/Samurajsam)

---

Made with ❤️ using Vue.js
