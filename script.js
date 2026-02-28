let gameStarted = false;
let gameSpeed = 200;

// Button
const startBtn = document.querySelectorAll(".menu-btn")[0];
const settingsBtn = document.querySelectorAll(".menu-btn")[1];
const modeBtn = document.querySelectorAll(".menu-btn")[2];

// Popups
const settingsPopup = document.getElementById("settingsPopup");
const modePopup = document.getElementById("modePopup");
const bgMusic = document.getElementById("bgMusic");
const eatSound = document.getElementById("eatSound");
const congratsSound = document.getElementById("congratsSound");

bgMusic.volume = 0.4;
eatSound.volume = 0.8;
congratsSound.volume = 1.0;

// Press Start
startBtn.addEventListener("click", () => {
  document.querySelector(".start-container").style.display = "none";

  document.querySelector(".game-container").style.display = "flex";
  document.querySelector(".wrapper").style.display = "flex";

  // 🎵 Play background music
  bgMusic.currentTime = 0;
  bgMusic.play();

  startGame();

  startBtn.addEventListener("click", () => {
    bgMusic.currentTime = 0;

    bgMusic.play().catch((error) => {
      console.log("Autoplay blocked:", error);
    });

    startGame();
  });

});

// Settings
settingsBtn.addEventListener("click", () => {
  settingsPopup.classList.remove("hidden");
});

// Mode
modeBtn.addEventListener("click", () => {
  modePopup.classList.remove("hidden");
});

// Close Popups
function closePopup() {
  settingsPopup.classList.add("hidden");
  modePopup.classList.add("hidden");
}

function startGame() {
  if (gameStarted) return;

  gameStarted = true;
  updateFoodPosition();

  setIntervalId = setInterval(initGame, gameSpeed);
}

// BG Settings
function setBackground(type) {
  if (type === "default") {
    document.body.style.background =
      "url('Asset/background.gif') center / cover no-repeat fixed";
  }

  if (type === "dark") {
    document.body.style.background = "#181c17";
  }

  if (type === "light") {
    document.body.style.background = "#f0f5f0";
  }

  closePopup();
}

// Mode Settings (snake speed)
let apples = [];
let appleCount = 1;

function setMode(mode) {
  if (mode === "easy") {
    gameSpeed = 200;
    appleCount = 1;
  }
  if (mode === "medium") {
    gameSpeed = 120;
    appleCount = 3;
  }
  if (mode === "hard") {
    gameSpeed = 70;
    appleCount = 5;
  }

  // Restart game loop if already started
  if (gameStarted) {
    clearInterval(setIntervalId);
    setIntervalId = setInterval(initGame, gameSpeed);
  }

  console.log("Mode:", mode, "Speed:", gameSpeed, "Apples:", appleCount);
  closePopup();
}

const updateFoodPosition = () => {
  apples = [];
  for (let i = 0; i < appleCount; i++) {
    apples.push({
      x: Math.floor(Math.random() * 30) + 1,
      y: Math.floor(Math.random() * 30) + 1,
    });
  }
};

const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
let gameOver = false;
let foodX, foodY;
let snakeX = 5,
  snakeY = 5;
let velocityX = 0,
  velocityY = 0;
let snakeBody = [];

let score = 0;
// Getting high score from the local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

// Init Game
const initGame = () => {
  if (gameOver) return handleGameOver();

  // Update snake position
  snakeX += velocityX;
  snakeY += velocityY;

  // Shift snake body
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }
  snakeBody[0] = [snakeX, snakeY];

  // Check wall collision
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
    return;
  }

  // Eating apples
  apples.forEach((apple, index) => {
    if (snakeX === apple.x && snakeY === apple.y) {
      snakeBody.push([apple.y, apple.x]);
      score++;

      eatSound.currentTime = 0;
      eatSound.play();

      // Check FIRST before updating high score
      if (score > highScore) {
        highScore = score;
        localStorage.setItem("high-score", highScore);
        showHighScoreCongrats();
      }

      scoreElement.innerText = `Score: ${score}`;
      highScoreElement.innerText = `High Score: ${highScore}`;
      createBubbles(1);

      // Remove eaten apple and respawn
      apples.splice(index, 1);
      apples.push({
        x: Math.floor(Math.random() * 30) + 1,
        y: Math.floor(Math.random() * 30) + 1,
      });
    }
  });

  // Render all
  let html = "";
  apples.forEach((apple) => {
    html += `<div class="food" style="grid-area: ${apple.y} / ${apple.x}"></div>`;
  });

  for (let i = 0; i < snakeBody.length; i++) {
    html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
    }
  }

  playBoard.innerHTML = html;
};

// Show highscore congrats if beaten
const highscoreCongrats = document.getElementById("highscoreCongrats");

function showHighScoreCongrats() {
  highscoreCongrats.classList.remove("hidden");
  highscoreCongrats.classList.add("show");

  setTimeout(() => {
    highscoreCongrats.classList.remove("show");
    highscoreCongrats.classList.add("hidden");
  }, 2000);
}

const handleGameOver = () => {
  clearInterval(setIntervalId);

  // Stop music
  bgMusic.pause();

  alert("Game Over! Press OK to replay...");
  clearBubbles();
  location.reload();
};

const changeDirection = (e) => {
  // Changing velocity value based on key press
  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
};

// Calling change Direction on each key click and passing key dataset value as an object
controls.forEach((button) =>
  button.addEventListener("click", () =>
    changeDirection({ key: button.dataset.key }),
  ),
);

updateFoodPosition();
document.addEventListener("keyup", changeDirection);
function createBubbles(count) {
  const container = document.querySelector(".bubbles-container");
  const screenHeight = window.innerHeight;
  const screenWidth = window.innerWidth;

  for (let i = 0; i < count; i++) {
    const bubble = document.createElement("div");
    bubble.classList.add("bubble");

    // Random size bubbles
    const size = Math.random() * 25 + 15;
    bubble.style.width = size + "px";
    bubble.style.height = size + "px";

    // Random horizontal position
    bubble.style.left = Math.random() * (screenWidth - size) + "px";
    bubble.style.top = "0px";

    // Random color
    const colors = [
      "#FF5C5C",
      "#5CFF5C",
      "#5C5CFF",
      "#FFFF5C",
      "#FF5CFF",
      "#5CFFFF",
    ];
    bubble.style.background = colors[Math.floor(Math.random() * colors.length)];

    container.appendChild(bubble);

    // Gravity + bounce setup
    let position = 0;
    let velocity = 0;
    const gravity = 0.5;
    let bounceFactor = 0.6;

    function fall() {
      velocity += gravity;
      position += velocity;

      if (position + size >= screenHeight) {
        position = screenHeight - size;
        velocity *= -bounceFactor;

        // stop bouncing
        if (Math.abs(velocity) < 1) {
          velocity = 0;
        }
      }
      bubble.style.top = position + "px";
      if (velocity !== 0) requestAnimationFrame(fall);
    }
    fall();
  }
}
// Reset bubbles on game over / retry
function clearBubbles() {
  const container = document.querySelector(".bubbles-container");
  container.innerHTML = "";
}

let paused = false;
const pauseBtn = document.getElementById("pauseBtn");

function togglePause() {
  if (!gameStarted) return;

  if (!paused) {
    paused = true;
    clearInterval(setIntervalId);
    pauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  } else {
    let countdown = 2;
    pauseBtn.textContent = countdown;

    const countdownInterval = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        pauseBtn.textContent = countdown;
      } else {
        clearInterval(countdownInterval);
        paused = false;
        setIntervalId = setInterval(initGame, gameSpeed);
        pauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
      }
    }, 1000);
  }
}

pauseBtn.addEventListener("click", togglePause);

// Space bar pause/resume
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    togglePause();
  }
});

/* Sounds */
function showHighScoreCongrats() {
  const congratsMsg = document.getElementById("highscoreCongrats");

  // Show message
  congratsMsg.classList.remove("hidden");
  congratsMsg.classList.add("show");

  // Play sound
  congratsSound.currentTime = 0;
  congratsSound.play().catch((error) => {
    console.log("Autoplay blocked:", error);
  });

  // Hide after 3 seconds
  setTimeout(() => {
    congratsMsg.classList.remove("show");
    congratsMsg.classList.add("hidden");
  }, 3000);
}
