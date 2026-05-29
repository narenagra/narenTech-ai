// --- ARCADE GENERAL STATE ---
let currentPanel = 'portal'; // 'portal' or 'sandbox'
let activeGame = ''; // 'math-tictactoe', 'alpha-shoot', 'chess-trainer'
let difficulty = 'easy'; // 'easy', 'med', 'hard'
let userScore = parseInt(localStorage.getItem('arcade_score') || '0');

// Update score UI on load
document.getElementById('scoreVal').textContent = userScore;

// --- DYNAMIC STARFIELD BACKGROUND ---
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
let maxStars = 80;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initStars();
}
window.addEventListener('resize', resizeCanvas);

class Star {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.3;
    this.speed = Math.random() * 0.05 + 0.02;
  }
  update() {
    this.alpha += this.speed;
    if (this.alpha > 0.95 || this.alpha < 0.2) {
      this.speed = -this.speed;
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 240, 255, ${this.alpha})`;
    ctx.fill();
  }
}

function initStars() {
  stars = [];
  for (let i = 0; i < maxStars; i++) {
    stars.push(new Star());
  }
}

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(star => {
    star.update();
    star.draw();
  });
  requestAnimationFrame(animateStars);
}
resizeCanvas();
animateStars();

// --- SCORE SYSTEM ---
function addScore(points, reason) {
  userScore += points;
  localStorage.setItem('arcade_score', userScore);
  document.getElementById('scoreVal').textContent = userScore;
  triggerToast('Score Earned', `+${points} XP: ${reason}`);
  updateBadgeState();
}

function resetProgress() {
  userScore = 0;
  localStorage.setItem('arcade_score', '0');
  document.getElementById('scoreVal').textContent = '0';
  triggerToast('Progress Reset', 'Your score has been reset to 0 XP.');
  updateBadgeState();
}

function updateBadgeState() {
  const icon = document.getElementById('badgeIcon');
  const title = document.getElementById('badgeTitle');
  const desc = document.getElementById('badgeDesc');
  
  if (userScore < 100) {
    icon.className = "fa-solid fa-shield-halved";
    icon.style.color = "var(--neon-cyan)";
    title.textContent = "Junior Novice";
    desc.textContent = "Earn 100 XP to rank up to Commander!";
  } else if (userScore < 300) {
    icon.className = "fa-solid fa-award";
    icon.style.color = "var(--neon-yellow)";
    title.textContent = "Logic Commander";
    desc.textContent = "Earn 300 XP to become a Grandmaster!";
  } else {
    icon.className = "fa-solid fa-chess-king";
    icon.style.color = "var(--neon-magenta)";
    title.textContent = "Arcade Grandmaster";
    desc.textContent = "Outstanding! You are a master of math and strategy.";
  }
}
updateBadgeState();

// --- LAUNCHER LOGIC ---
function launchGame(gameId) {
  // Reset viewport scroll to top so the game is immediately visible
  window.scrollTo(0, 0);
  
  activeGame = gameId;
  document.getElementById('portal-panel').style.display = 'none';
  document.getElementById('sandbox-panel').classList.add('active');
  
  // Hide all game views
  document.getElementById('game-math-tictactoe-view').style.display = 'none';
  document.getElementById('game-alpha-shoot-view').style.display = 'none';
  document.getElementById('game-chess-trainer-view').style.display = 'none';
  
  // Show active game view
  document.getElementById(`game-${gameId}-view`).style.display = 'flex';
  
  initGameEngine(gameId);
  updateInstructions(gameId);
}

function exitToPortal() {
  closeFullscreen();
  cleanupBubbleGame();
  activeGame = '';
  document.getElementById('sandbox-panel').classList.remove('active');
  document.getElementById('portal-panel').style.display = 'flex';
}

function setDifficulty(level) {
  difficulty = level;
  document.querySelectorAll('[id^="diff-"]').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`diff-${level}`).classList.add('active');
  triggerToast('Difficulty Changed', `Game scaled for Class ${level === 'easy' ? '5-6 (Easy)' : level === 'med' ? '7-8 (Medium)' : '9-10 (Hard)'}`);
  
  if (activeGame) {
    initGameEngine(activeGame);
  }
}

// --- NATIVE BROWSER FULLSCREEN TOGGLER ---
function toggleFullscreen() {
  const card = document.getElementById('gameCardWrapper');
  
  const isFull = document.fullscreenElement || 
                 document.webkitFullscreenElement || 
                 document.mozFullScreenElement || 
                 document.msFullscreenElement;
                 
  if (!isFull) {
    if (card.requestFullscreen) {
      card.requestFullscreen();
    } else if (card.webkitRequestFullscreen) {
      card.webkitRequestFullscreen();
    } else if (card.mozRequestFullScreen) {
      card.mozRequestFullScreen();
    } else if (card.msRequestFullscreen) {
      card.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

function closeFullscreen() {
  const isFull = document.fullscreenElement || 
                 document.webkitFullscreenElement || 
                 document.mozFullScreenElement || 
                 document.msFullscreenElement;
  if (isFull) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

function handleFullscreenChange() {
  const card = document.getElementById('gameCardWrapper');
  const isFull = document.fullscreenElement || 
                 document.webkitFullscreenElement || 
                 document.mozFullScreenElement || 
                 document.msFullscreenElement;
                 
  if (isFull) {
    card.classList.add('fullscreen-active');
    triggerToast('Fullscreen Mode Active', 'Display fit to screen! Press ESC to minimize.');
  } else {
    card.classList.remove('fullscreen-active');
    triggerToast('Fullscreen Exit', 'Returned to standard layout.');
  }
  
  resizeGameElements();
}

document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

// ESC key listener to exit fullscreen mode explicitly or close active overlays
window.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (key === 'escape' || key === 'esc') {
    // Check if any overlays are active and close them first
    const mathOverlay = document.getElementById('mathQuizOverlay');
    if (mathOverlay && mathOverlay.classList.contains('active')) {
      closeMathQuiz();
      e.preventDefault();
      return;
    }
    const victoryOverlay = document.getElementById('victoryOverlay');
    if (victoryOverlay && victoryOverlay.classList.contains('active')) {
      closeVictoryScreen();
      e.preventDefault();
      return;
    }
    const infoModal = document.getElementById('infoModalOverlay');
    if (infoModal && infoModal.classList.contains('active')) {
      closeInfoModal();
      e.preventDefault();
      return;
    }
    
    closeFullscreen();
  }
});

function resizeGameElements() {
  const card = document.getElementById('gameCardWrapper');
  const isFull = card.classList.contains('fullscreen-active');
  const canvasBubble = document.getElementById('bubbleCanvas');
  
  if (activeGame === 'alpha-shoot' && canvasBubble) {
    if (isFull) {
      canvasBubble.width = Math.min(800, window.innerWidth - 80);
      canvasBubble.height = Math.min(500, window.innerHeight - 180);
    } else {
      canvasBubble.width = 460;
      canvasBubble.height = 360;
    }
    
    if (!bubbleGameActive) {
      initBubbleShooter();
    } else if (bubbleGamePaused) {
      drawPauseOverlay();
    }
  }
}

window.addEventListener('resize', () => {
  if (activeGame === 'alpha-shoot' && document.getElementById('gameCardWrapper').classList.contains('fullscreen-active')) {
    resizeGameElements();
  }
});

// --- HOW TO PLAY WELL TEXT CONTENT ---
function updateInstructions(gameId) {
  const heading = document.getElementById('guideHeading');
  const body = document.getElementById('guideBodyText');
  
  if (gameId === 'math-tictactoe') {
    heading.innerHTML = '<i class="fa-solid fa-calculator"></i> Ganit Quiz Guide';
    body.innerHTML = `
      <ul class="instruction-list">
        <li><i class="fa-solid fa-chevron-right"></i> Click any grid tile to select your space.</li>
        <li><i class="fa-solid fa-chevron-right"></i> Correctly answer the mental math question to claim the tile as "X".</li>
        <li><i class="fa-solid fa-chevron-right"></i> If your answer is wrong, the AI steals a turn or the tile remains locked!</li>
        <li><i class="fa-solid fa-chevron-right"></i> <strong>Pro-Tip:</strong> Try to block the AI from forming three blocks in a row (horizontal, vertical, or diagonal).</li>
      </ul>
    `;
  } else if (gameId === 'alpha-shoot') {
    heading.innerHTML = '<i class="fa-solid fa-keyboard"></i> Alpha Shoot Guide';
    body.innerHTML = `
      <ul class="instruction-list">
        <li><i class="fa-solid fa-chevron-right"></i> Falling bubbles contain alphabet letters (or words on Hard mode).</li>
        <li><i class="fa-solid fa-chevron-right"></i> Press the matching letter on your <strong>keyboard</strong> to shoot and pop the bubbles!</li>
        <li><i class="fa-solid fa-chevron-right"></i> If a bubble hits the bottom grid lines, your shields will deplete by 1.</li>
        <li><i class="fa-solid fa-chevron-right"></i> <strong>Pro-Tip:</strong> Keep your hands in typing home position (ASDF-JKL;) to hit bubbles quickly.</li>
      </ul>
    `;
  } else if (gameId === 'chess-trainer') {
    heading.innerHTML = '<i class="fa-solid fa-chess"></i> Chess Sandbox Guide';
    body.innerHTML = `
      <ul class="instruction-list">
        <li><i class="fa-solid fa-chevron-right"></i> Click on your pieces (White color) to highlight all valid spaces they can move to.</li>
        <li><i class="fa-solid fa-chevron-right"></i> Click any highlighted green target cell to move your piece.</li>
        <li><i class="fa-solid fa-chevron-right"></i> <strong>Pawn (♙):</strong> Moves 1 square forward (or 2 on start). Captures diagonally.</li>
        <li><i class="fa-solid fa-chevron-right"></i> <strong>Knight (♘):</strong> Jumps in an "L" shape (2 up, 1 left/right). Can jump over pieces!</li>
        <li><i class="fa-solid fa-chevron-right"></i> <strong>Rook (♖) & Bishop (♗):</strong> Rooks slide straight; Bishops slide diagonally.</li>
        <li><i class="fa-solid fa-chevron-right"></i> <strong>Queen (♕):</strong> Slides in any straight or diagonal direction.</li>
      </ul>
    `;
  }
}

// --- INIT GAME CONTEXT ---
function initGameEngine(gameId) {
  if (gameId === 'math-tictactoe') {
    initMathTTT();
  } else if (gameId === 'alpha-shoot') {
    initBubbleShooter();
  } else if (gameId === 'chess-trainer') {
    initChessGame();
  }
}


// =========================================================
// GAME 1: MATH TIC-TAC-TOE ENGINE
// =========================================================
let tttBoard = Array(9).fill(null);
let tttSelectedCell = null;
let tttMathAnswer = 0;
let tttGameActive = true;

function initMathTTT() {
  tttBoard = Array(9).fill(null);
  tttGameActive = true;
  document.getElementById('mtttTurnStatus').textContent = 'Your turn: Select an empty square.';
  document.getElementById('mtttTurnStatus').style.color = 'var(--neon-cyan)';
  
  const cells = document.querySelectorAll('.mttt-cell');
  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'mttt-cell';
  });
}

function clickTTTCell(idx) {
  if (!tttGameActive || tttBoard[idx] !== null) return;
  
  tttSelectedCell = idx;
  generateMathQuestion();
  document.getElementById('mathQuizOverlay').classList.add('active');
  document.getElementById('mathAnswerInput').value = '';
  document.getElementById('mathAnswerInput').focus();
}

function generateMathQuestion() {
  const promptEl = document.getElementById('mathPrompt');
  const feed = document.getElementById('mathFeedbackMsg');
  feed.textContent = "Solve the equation to claim the tile!";
  feed.style.color = "var(--text-sub)";

  let num1, num2, operation;
  
  if (difficulty === 'easy') {
    const ops = ['+', '-', '×'];
    operation = ops[Math.floor(Math.random() * ops.length)];
    if (operation === '+') {
      num1 = Math.floor(Math.random() * 40) + 10;
      num2 = Math.floor(Math.random() * 40) + 10;
      tttMathAnswer = num1 + num2;
      promptEl.textContent = `${num1} + ${num2} = ?`;
    } else if (operation === '-') {
      num1 = Math.floor(Math.random() * 50) + 20;
      num2 = Math.floor(Math.random() * num1);
      tttMathAnswer = num1 - num2;
      promptEl.textContent = `${num1} - ${num2} = ?`;
    } else {
      num1 = Math.floor(Math.random() * 9) + 2;
      num2 = Math.floor(Math.random() * 9) + 2;
      tttMathAnswer = num1 * num2;
      promptEl.textContent = `${num1} × ${num2} = ?`;
    }
  } else if (difficulty === 'med') {
    const type = Math.random() > 0.5 ? 'solve-x' : 'math';
    if (type === 'solve-x') {
      const coeff = Math.floor(Math.random() * 6) + 2;
      const addVal = Math.floor(Math.random() * 15) + 1;
      tttMathAnswer = Math.floor(Math.random() * 8) + 2; // x val
      const finalResult = coeff * tttMathAnswer + addVal;
      promptEl.textContent = `Solve for x: ${coeff}x + ${addVal} = ${finalResult}`;
    } else {
      num1 = Math.floor(Math.random() * 12) + 5;
      num2 = Math.floor(Math.random() * 9) + 4;
      tttMathAnswer = num1 * num2;
      promptEl.textContent = `Solve: ${tttMathAnswer} ÷ ${num1} = ?`;
      tttMathAnswer = num2;
    }
  } else {
    const type = Math.random() > 0.5 ? 'percentage' : 'algebra';
    if (type === 'percentage') {
      const percentage = [10, 20, 25, 30, 40, 50, 75][Math.floor(Math.random() * 7)];
      const total = Math.floor(Math.random() * 12) * 50 + 100;
      tttMathAnswer = (percentage / 100) * total;
      promptEl.textContent = `What is ${percentage}% of ${total}?`;
    } else {
      const x = Math.floor(Math.random() * 5) + 2;
      const target = x * x - 5;
      tttMathAnswer = x;
      promptEl.textContent = `If x² - 5 = ${target}, find positive x:`;
    }
  }
}

function closeMathQuiz() {
  document.getElementById('mathQuizOverlay').classList.remove('active');
  tttSelectedCell = null;
}

function submitMathAnswer() {
  const ansInput = document.getElementById('mathAnswerInput');
  const feed = document.getElementById('mathFeedbackMsg');
  const ans = parseInt(ansInput.value);

  if (isNaN(ans)) {
    feed.textContent = "Please enter a valid number!";
    feed.style.color = "var(--neon-magenta)";
    return;
  }

  if (ans === tttMathAnswer) {
    document.getElementById('mathQuizOverlay').classList.remove('active');
    claimTTTCell(tttSelectedCell, 'X');
    addScore(20, 'Correct Math Solution');
    
    if (checkTTTWin('X')) {
      endTTTGame('win');
      return;
    }
    
    if (tttBoard.includes(null)) {
      document.getElementById('mtttTurnStatus').textContent = 'AI thinking...';
      document.getElementById('mtttTurnStatus').style.color = 'var(--neon-magenta)';
      setTimeout(makeTTTAIMove, 1000);
    } else {
      endTTTGame('draw');
    }
  } else {
    feed.textContent = `Incorrect! The answer was ${tttMathAnswer}. Try another tile!`;
    feed.style.color = "var(--neon-magenta)";
    triggerToast('Calculation Error', 'Answer incorrect! The square is locked for this turn.', true);
    
    setTimeout(() => {
      document.getElementById('mathQuizOverlay').classList.remove('active');
      setTimeout(makeTTTAIMove, 500);
    }, 1500);
  }
}

function claimTTTCell(idx, symbol) {
  tttBoard[idx] = symbol;
  const cellBtn = document.querySelector(`[data-cell="${idx}"]`);
  cellBtn.textContent = symbol;
  cellBtn.classList.add(symbol === 'X' ? 'x-mark' : 'o-mark');
}

function makeTTTAIMove() {
  if (!tttGameActive) return;
  
  let empties = [];
  tttBoard.forEach((val, idx) => {
    if (val === null) empties.push(idx);
  });

  if (empties.length === 0) return;

  let chosen = empties[Math.random() * empties.length | 0];
  
  for (let empty of empties) {
    let tempBoard = [...tttBoard];
    tempBoard[empty] = 'O';
    if (checkTTTWinMock(tempBoard, 'O')) {
      chosen = empty;
      break;
    }
  }

  if (chosen === empties[0]) {
    for (let empty of empties) {
      let tempBoard = [...tttBoard];
      tempBoard[empty] = 'X';
      if (checkTTTWinMock(tempBoard, 'X')) {
        chosen = empty;
        break;
      }
    }
  }

  claimTTTCell(chosen, 'O');
  triggerToast('AI Move', 'The AI has claimed a square.');

  if (checkTTTWin('O')) {
    endTTTGame('lose');
    return;
  }

  if (!tttBoard.includes(null)) {
    endTTTGame('draw');
    return;
  }

  document.getElementById('mtttTurnStatus').textContent = 'Your turn: Select an empty square.';
  document.getElementById('mtttTurnStatus').style.color = 'var(--neon-cyan)';
}

function checkTTTWinMock(board, symbol) {
  const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return winConditions.some(comb => {
    return comb.every(idx => board[idx] === symbol);
  });
}

function checkTTTWin(symbol) {
  return checkTTTWinMock(tttBoard, symbol);
}

function endTTTGame(status) {
  tttGameActive = false;
  const statusEl = document.getElementById('mtttTurnStatus');
  if (status === 'win') {
    statusEl.textContent = 'YOU WIN! 🎉 +50 XP';
    statusEl.style.color = 'var(--neon-green)';
    addScore(50, 'Won Ganit Combat Game');
    triggerToast('Victory!', 'Congratulations! You beat the Math AI.');
    setTimeout(() => {
      openVictoryScreen(
        'Congratulations!',
        'Ganit Combat Cleared',
        50,
        'Incredible mathematical calculation and strategic play! You successfully solved the equations and claimed three cells in a row to defeat the CPU Math AI.'
      );
    }, 200);
  } else if (status === 'lose') {
    statusEl.textContent = 'AI WINS! Try again.';
    statusEl.style.color = 'var(--neon-magenta)';
    triggerToast('Defeat', 'AI won this round. Practice makes perfect!', true);
  } else {
    statusEl.textContent = "IT'S A DRAW! Play again.";
    statusEl.style.color = 'var(--neon-yellow)';
    triggerToast('Draw Match', 'Good strategic game.');
  }
}


// =========================================================
// GAME 2: ALPHA SHOOT BUBBLE ENGINE
// =========================================================
let bubbleCanvas = document.getElementById('bubbleCanvas');
let bubbleCtx = bubbleCanvas.getContext('2d');

let bubbleGameActive = false;
let bubbleGamePaused = false;
let bubbles = [];
let splashes = [];
let localBubbleScore = 0;
let bubbleShields = 5;

let bubbleSpawnTimer = null;
let bubbleLoopId = null;

const scienceWords = ["ATOM", "CELL", "ION", "STAR", "GRID", "CHESS", "MATH", "LUX", "NEON", "HULL", "WAVE", "BOOST", "WARP", "CORE", "BEAM"];

function initBubbleShooter() {
  cleanupBubbleGame();
  
  bubbleCtx.clearRect(0, 0, bubbleCanvas.width, bubbleCanvas.height);
  bubbleCtx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  bubbleCtx.fillRect(10, 10, bubbleCanvas.width - 20, bubbleCanvas.height - 20);
  
  bubbleCtx.font = "bold 24px 'Outfit', sans-serif";
  bubbleCtx.fillStyle = "#00f0ff";
  bubbleCtx.textAlign = "center";
  bubbleCtx.shadowBlur = 10;
  bubbleCtx.shadowColor = "rgba(0, 240, 255, 0.5)";
  bubbleCtx.fillText("ALPHA SHOOT ARCADE", bubbleCanvas.width / 2, bubbleCanvas.height / 2 - 20);
  
  bubbleCtx.font = "14px 'Plus Jakarta Sans', sans-serif";
  bubbleCtx.fillStyle = "#a1a1aa";
  bubbleCtx.shadowBlur = 0;
  bubbleCtx.fillText("Click 'Start Game' below and prepare your keyboard!", bubbleCanvas.width / 2, bubbleCanvas.height / 2 + 15);
  
  document.getElementById('bubbleScore').textContent = '0';
  document.getElementById('startBubbleBtn').style.display = 'inline-block';
  document.getElementById('startBubbleBtn').textContent = 'Start Game';
  
  // Hide pause controls when game is not running
  document.getElementById('pauseBubbleBtn').style.display = 'none';
}

function cleanupBubbleGame() {
  bubbleGameActive = false;
  bubbleGamePaused = false;
  clearInterval(bubbleSpawnTimer);
  cancelAnimationFrame(bubbleLoopId);
  window.removeEventListener('keydown', handleBubbleKeyPress);
  bubbles = [];
  splashes = [];
  
  const pauseBtn = document.getElementById('pauseBubbleBtn');
  if (pauseBtn) pauseBtn.style.display = 'none';
}

function startBubbleGame() {
  cleanupBubbleGame();
  
  bubbleGameActive = true;
  bubbleGamePaused = false;
  localBubbleScore = 0;
  bubbleShields = 5;
  
  document.getElementById('bubbleScore').textContent = '0';
  document.getElementById('startBubbleBtn').style.display = 'none';
  
  // Show Pause Button
  const pauseBtn = document.getElementById('pauseBubbleBtn');
  pauseBtn.style.display = 'inline-flex';
  document.getElementById('pauseBtnText').textContent = "Pause";
  document.getElementById('pauseBtnIcon').className = "fa-solid fa-pause";
  
  renderShieldHearts();
  window.addEventListener('keydown', handleBubbleKeyPress);
  
  let spawnDelay = difficulty === 'easy' ? 2200 : difficulty === 'med' ? 1400 : 900;
  bubbleSpawnTimer = setInterval(spawnLetterBubble, spawnDelay);
  
  bubbleLoopId = requestAnimationFrame(bubbleGameLoop);
  triggerToast('Game Started', 'Alpha Shoot active! Type the falling letters!');
}

function renderShieldHearts() {
  const container = document.getElementById('bubbleShields');
  container.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const heart = document.createElement('i');
    if (i < bubbleShields) {
      heart.className = "fa-solid fa-heart";
      heart.style.color = "var(--neon-magenta)";
    } else {
      heart.className = "fa-regular fa-heart";
      heart.style.color = "var(--text-muted)";
    }
    container.appendChild(heart);
  }
}

// Pause Toggler for alpha shooter
function togglePauseBubble() {
  if (!bubbleGameActive) return;
  
  const txt = document.getElementById('pauseBtnText');
  const icon = document.getElementById('pauseBtnIcon');
  
  if (!bubbleGamePaused) {
    // PAUSE GAME
    bubbleGamePaused = true;
    clearInterval(bubbleSpawnTimer);
    cancelAnimationFrame(bubbleLoopId);
    window.removeEventListener('keydown', handleBubbleKeyPress);
    
    txt.textContent = "Resume";
    icon.className = "fa-solid fa-play";
    
    drawPauseOverlay();
    triggerToast('Game Paused', 'Simulation frozen.');
  } else {
    // RESUME GAME
    bubbleGamePaused = false;
    
    txt.textContent = "Pause";
    icon.className = "fa-solid fa-pause";
    
    window.addEventListener('keydown', handleBubbleKeyPress);
    let spawnDelay = difficulty === 'easy' ? 2200 : difficulty === 'med' ? 1400 : 900;
    bubbleSpawnTimer = setInterval(spawnLetterBubble, spawnDelay);
    
    bubbleLoopId = requestAnimationFrame(bubbleGameLoop);
    triggerToast('Game Resumed', 'Typing sensors active.');
  }
}

function drawPauseOverlay() {
  // Semi-transparent overlay block
  bubbleCtx.fillStyle = 'rgba(7, 5, 18, 0.75)';
  bubbleCtx.fillRect(10, 10, bubbleCanvas.width - 20, bubbleCanvas.height - 20);
  
  // PAUSED Text
  bubbleCtx.font = "bold 32px 'Outfit', sans-serif";
  bubbleCtx.fillStyle = "var(--neon-yellow)";
  bubbleCtx.textAlign = "center";
  bubbleCtx.shadowBlur = 10;
  bubbleCtx.shadowColor = "var(--neon-yellow-glow)";
  bubbleCtx.fillText("GAME PAUSED", bubbleCanvas.width / 2, bubbleCanvas.height / 2 - 15);
  
  // Help Subtext
  bubbleCtx.font = "14px 'Plus Jakarta Sans', sans-serif";
  bubbleCtx.fillStyle = "#ffffff";
  bubbleCtx.shadowBlur = 0;
  bubbleCtx.fillText("Press the 'Resume' button to continue playing.", bubbleCanvas.width / 2, bubbleCanvas.height / 2 + 20);
}

class Bubble {
  constructor() {
    this.radius = 24;
    this.x = Math.random() * (bubbleCanvas.width - this.radius * 2) + this.radius;
    this.y = -this.radius;
    
    let baseSpeed = difficulty === 'easy' ? 0.7 : difficulty === 'med' ? 1.4 : 2.1;
    this.speed = baseSpeed + Math.random() * 0.3;
    
    const colors = ['#00f0ff', '#ff2a85', '#facc15', '#10b981'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    
    if (difficulty === 'easy') {
      this.letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    } else if (difficulty === 'med') {
      const isUpper = Math.random() > 0.5;
      this.letter = String.fromCharCode((isUpper ? 65 : 97) + Math.floor(Math.random() * 26));
    } else {
      this.letter = scienceWords[Math.floor(Math.random() * scienceWords.length)];
      this.radius = 32;
    }
  }
  
  update() {
    this.y += this.speed;
  }
  
  draw() {
    bubbleCtx.beginPath();
    bubbleCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    bubbleCtx.strokeStyle = this.color;
    bubbleCtx.lineWidth = 2.5;
    
    bubbleCtx.shadowBlur = 10;
    bubbleCtx.shadowColor = this.color;
    
    bubbleCtx.fillStyle = 'rgba(15, 11, 41, 0.6)';
    bubbleCtx.fill();
    bubbleCtx.stroke();
    
    bubbleCtx.font = "bold 16px 'Outfit', sans-serif";
    if (difficulty === 'hard') bubbleCtx.font = "bold 13px 'Outfit', sans-serif";
    bubbleCtx.fillStyle = '#ffffff';
    bubbleCtx.textAlign = 'center';
    bubbleCtx.textBaseline = 'middle';
    
    bubbleCtx.shadowBlur = 0;
    bubbleCtx.fillText(this.letter, this.x, this.y);
  }
}

class Splash {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = 5;
    this.alpha = 1;
    this.speed = Math.random() * 2 + 1;
    this.angle = Math.random() * Math.PI * 2;
  }
  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.alpha -= 0.04;
  }
  draw() {
    bubbleCtx.beginPath();
    bubbleCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    bubbleCtx.fillStyle = this.color.replace(')', `, ${this.alpha})`).replace('#00f0ff', `rgba(0, 240, 255, ${this.alpha})`).replace('#ff2a85', `rgba(255, 42, 133, ${this.alpha})`).replace('#facc15', `rgba(250, 204, 21, ${this.alpha})`).replace('#10b981', `rgba(16, 185, 129, ${this.alpha})`);
    bubbleCtx.fill();
  }
}

function spawnLetterBubble() {
  if (bubbleGameActive && !bubbleGamePaused) {
    bubbles.push(new Bubble());
  }
}

function bubbleGameLoop() {
  if (!bubbleGameActive || bubbleGamePaused) return;
  
  bubbleCtx.clearRect(0, 0, bubbleCanvas.width, bubbleCanvas.height);
  
  bubbleCtx.beginPath();
  bubbleCtx.moveTo(0, bubbleCanvas.height - 35);
  bubbleCtx.lineTo(bubbleCanvas.width, bubbleCanvas.height - 35);
  bubbleCtx.strokeStyle = 'rgba(255, 42, 133, 0.4)';
  bubbleCtx.lineWidth = 1.5;
  bubbleCtx.setLineDash([5, 5]);
  bubbleCtx.stroke();
  bubbleCtx.setLineDash([]);
  
  bubbleCtx.font = "9px 'Outfit', sans-serif";
  bubbleCtx.fillStyle = "rgba(255, 42, 133, 0.6)";
  bubbleCtx.fillText("SHIELD RADAR FIELD", 60, bubbleCanvas.height - 42);
  
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i];
    b.update();
    b.draw();
    
    if (b.y + b.radius >= bubbleCanvas.height - 35) {
      bubbles.splice(i, 1);
      bubbleShields--;
      renderShieldHearts();
      triggerToast('Shield Hit', 'A bubble got past! Shield power decreasing.', true);
      
      flashCanvasRed();
      
      if (bubbleShields <= 0) {
        endBubbleGame('lose');
        return;
      }
    }
  }
  
  for (let i = splashes.length - 1; i >= 0; i--) {
    const s = splashes[i];
    s.update();
    s.draw();
    if (s.alpha <= 0) splashes.splice(i, 1);
  }
  
  bubbleLoopId = requestAnimationFrame(bubbleGameLoop);
}

function flashCanvasRed() {
  bubbleCtx.fillStyle = 'rgba(255, 42, 133, 0.25)';
  bubbleCtx.fillRect(0, 0, bubbleCanvas.width, bubbleCanvas.height);
}

function handleBubbleKeyPress(e) {
  if (!bubbleGameActive || bubbleGamePaused) return;
  if (e.key === 'Escape' || e.key === 'Esc') return;
  
  const key = e.key; 
  let poppedIndex = -1;
  
  if (difficulty === 'hard') {
    for (let i = 0; i < bubbles.length; i++) {
      if (bubbles[i].letter.toLowerCase().startsWith(key.toLowerCase())) {
        poppedIndex = i;
        break;
      }
    }
  } else {
    for (let i = 0; i < bubbles.length; i++) {
      if (bubbles[i].letter === key) {
        poppedIndex = i;
        break;
      }
    }
  }
  
  if (poppedIndex !== -1) {
    const b = bubbles[poppedIndex];
    
    for (let j = 0; j < 8; j++) {
      splashes.push(new Splash(b.x, b.y, b.color));
    }
    
    bubbles.splice(poppedIndex, 1);
    
    localBubbleScore += 10;
    document.getElementById('bubbleScore').textContent = localBubbleScore;
    addScore(10, 'Popped Alphabet Bubble');
  }
}

function endBubbleGame(status) {
  bubbleGameActive = false;
  cleanupBubbleGame();
  
  document.getElementById('startBubbleBtn').style.display = 'inline-block';
  document.getElementById('startBubbleBtn').textContent = 'Restart Game';
  
  bubbleCtx.fillStyle = 'rgba(7, 5, 18, 0.9)';
  bubbleCtx.fillRect(10, 10, bubbleCanvas.width - 20, bubbleCanvas.height - 20);
  
  bubbleCtx.font = "bold 32px 'Outfit', sans-serif";
  bubbleCtx.fillStyle = "var(--neon-magenta)";
  bubbleCtx.textAlign = "center";
  bubbleCtx.shadowBlur = 10;
  bubbleCtx.shadowColor = "var(--neon-magenta-glow)";
  bubbleCtx.fillText("GAME OVER", bubbleCanvas.width / 2, bubbleCanvas.height / 2 - 20);
  
  bubbleCtx.font = "bold 16px 'Plus Jakarta Sans', sans-serif";
  bubbleCtx.fillStyle = "#ffffff";
  bubbleCtx.shadowBlur = 0;
  bubbleCtx.fillText(`Final Game Score: ${localBubbleScore} XP`, bubbleCanvas.width / 2, bubbleCanvas.height / 2 + 15);
  
  if (localBubbleScore > 0) {
    setTimeout(() => {
      openVictoryScreen(
        'Congratulations!',
        'Alpha Shoot Completed',
        localBubbleScore,
        `Outstanding keyboard reflexes! You successfully protected your shields and shot down alphabet bubbles, accumulating a narenTech score of ${localBubbleScore} XP. Keep practicing to build faster typing velocities!`
      );
    }, 200);
  } else {
    openInfoModal('Game Over!', `Shields depleted! Try standard typing postures and practice key placement to shoot bubbles quicker next time.`);
  }
}


// =========================================================
// GAME 3: CHESS SANDBOX & TRAINING ENGINE
// =========================================================
let chessMatrix = [];
let selectedTile = null;
let currentTurn = 'white';

const initialChess = [
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']
];

const pieceUnicode = {
  'r': '<i class="fa-solid fa-chess-rook chess-piece white-p"></i>',
  'n': '<i class="fa-solid fa-chess-knight chess-piece white-p"></i>',
  'b': '<i class="fa-solid fa-chess-bishop chess-piece white-p"></i>',
  'q': '<i class="fa-solid fa-chess-queen chess-piece white-p"></i>',
  'k': '<i class="fa-solid fa-chess-king chess-piece white-p"></i>',
  'p': '<i class="fa-solid fa-chess-pawn chess-piece white-p"></i>',
  
  'R': '<i class="fa-solid fa-chess-rook chess-piece black-p"></i>',
  'N': '<i class="fa-solid fa-chess-knight chess-piece black-p"></i>',
  'B': '<i class="fa-solid fa-chess-bishop chess-piece black-p"></i>',
  'Q': '<i class="fa-solid fa-chess-queen chess-piece black-p"></i>',
  'K': '<i class="fa-solid fa-chess-king chess-piece black-p"></i>',
  'P': '<i class="fa-solid fa-chess-pawn chess-piece black-p"></i>'
};

let chessGameActive = false;

function initChessGame() {
  chessGameActive = false;
  selectedTile = null;
  currentTurn = 'white';
  
  // Show Start button, hide active game controls
  document.getElementById('chessStartControls').style.display = 'block';
  document.getElementById('chessActiveControls').style.display = 'none';
  
  document.getElementById('chessTurnStatus').textContent = "Press 'Start Match' to begin your training!";
  document.getElementById('chessTurnStatus').style.color = 'var(--neon-yellow)';
  
  renderEmptyChessBoard();
}

function renderEmptyChessBoard() {
  const boardEl = document.getElementById('chessBoard');
  boardEl.innerHTML = '';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const tile = document.createElement('div');
      tile.className = `chess-tile ${(r + c) % 2 === 0 ? 'tile-light' : 'tile-dark'}`;
      boardEl.appendChild(tile);
    }
  }
}

function startChessMatch() {
  chessGameActive = true;
  
  // Hide start controls, show active match controls
  document.getElementById('chessStartControls').style.display = 'none';
  document.getElementById('chessActiveControls').style.display = 'flex';
  
  chessMatrix = JSON.parse(JSON.stringify(initialChess));
  selectedTile = null;
  currentTurn = 'white';
  
  document.getElementById('chessTurnStatus').textContent = 'Your Turn: Select a White piece.';
  document.getElementById('chessTurnStatus').style.color = '#ffffff';
  
  renderChessBoard();
  triggerToast('Match Started', 'Shatranj Trainer active. Make your opening move.');
}

function renderChessBoard() {
  const boardEl = document.getElementById('chessBoard');
  boardEl.innerHTML = '';
  
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const tile = document.createElement('div');
      tile.className = `chess-tile ${(r + c) % 2 === 0 ? 'tile-light' : 'tile-dark'}`;
      tile.dataset.row = r;
      tile.dataset.col = c;
      
      const piece = chessMatrix[r][c];
      if (piece) {
        tile.innerHTML = pieceUnicode[piece];
      }
      
      tile.onclick = () => selectChessTile(r, c);
      boardEl.appendChild(tile);
    }
  }
}

function selectChessTile(r, c) {
  if (!chessGameActive) {
    triggerToast('Match Not Started', 'Click the "Start Match" button to begin playing!', true);
    return;
  }
  const tileEl = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
  
  if (tileEl.classList.contains('tile-highlight')) {
    moveChessPiece(selectedTile.r, selectedTile.c, r, c);
    return;
  }
  
  document.querySelectorAll('.chess-tile').forEach(t => {
    t.classList.remove('tile-selected', 'tile-highlight');
  });
  
  const piece = chessMatrix[r][c];
  if (!piece) {
    selectedTile = null;
    return;
  }
  
  const isWhitePiece = piece === piece.toLowerCase();
  if (currentTurn === 'white' && !isWhitePiece) {
    triggerToast('Invalid Piece', 'It is your turn! Select a White piece.', true);
    return;
  }
  if (currentTurn === 'black' && isWhitePiece) {
    return;
  }
  
  selectedTile = { r, c, piece };
  tileEl.classList.add('tile-selected');
  
  highlightValidMoves(r, c, piece);
}

function highlightValidMoves(r, c, piece) {
  const moves = getLegalMoves(r, c, piece, chessMatrix);
  moves.forEach(m => {
    const tile = document.querySelector(`[data-row="${m.r}"][data-col="${m.c}"]`);
    if (tile) tile.classList.add('tile-highlight');
  });
}

function getPseudoLegalMoves(r, c, piece, matrix) {
  let moves = [];
  const isWhite = piece === piece.toLowerCase();
  const inBounds = (row, col) => row >= 0 && row < 8 && col >= 0 && col < 8;
  
  const checkCell = (row, col) => {
    if (!inBounds(row, col)) return { ok: false, capture: false };
    const p = matrix[row][col];
    if (!p) return { ok: true, capture: false };
    const isEnemy = isWhite ? p === p.toUpperCase() : p === p.toLowerCase();
    return { ok: isEnemy, capture: isEnemy };
  };

  if (piece.toLowerCase() === 'p') {
    const dir = isWhite ? -1 : 1;
    const startRow = isWhite ? 6 : 1;
    
    if (inBounds(r + dir, c) && !matrix[r + dir][c]) {
      moves.push({ r: r + dir, c });
      if (r === startRow && !matrix[r + dir * 2][c]) {
        moves.push({ r: r + dir * 2, c });
      }
    }
    
    [-1, 1].forEach(dc => {
      if (inBounds(r + dir, c + dc)) {
        const target = matrix[r + dir][c + dc];
        if (target) {
          const targetIsEnemy = isWhite ? target === target.toUpperCase() : target === target.toLowerCase();
          if (targetIsEnemy) moves.push({ r: r + dir, c: c + dc });
        }
      }
    });
  } 
  else if (piece.toLowerCase() === 'n') {
    const kOffsets = [
      { r: -2, c: -1 }, { r: -2, c: 1 },
      { r: -1, c: -2 }, { r: -1, c: 2 },
      { r: 1, c: -2 }, { r: 1, c: 2 },
      { r: 2, c: -1 }, { r: 2, c: 1 }
    ];
    kOffsets.forEach(off => {
      const nr = r + off.r;
      const nc = c + off.c;
      const cell = checkCell(nr, nc);
      if (cell.ok) moves.push({ r: nr, c: nc });
    });
  } 
  else if (piece.toLowerCase() === 'b') {
    const dirs = [{ r: -1, c: -1 }, { r: -1, c: 1 }, { r: 1, c: -1 }, { r: 1, c: 1 }];
    dirs.forEach(d => {
      let step = 1;
      while (true) {
        const nr = r + d.r * step;
        const nc = c + d.c * step;
        const cell = checkCell(nr, nc);
        if (!cell.ok) break;
        moves.push({ r: nr, c: nc });
        if (cell.capture) break;
        step++;
      }
    });
  } 
  else if (piece.toLowerCase() === 'r') {
    const dirs = [{ r: -1, c: 0 }, { r: 1, c: 0 }, { r: 0, c: -1 }, { r: 0, c: 1 }];
    dirs.forEach(d => {
      let step = 1;
      while (true) {
        const nr = r + d.r * step;
        const nc = c + d.c * step;
        const cell = checkCell(nr, nc);
        if (!cell.ok) break;
        moves.push({ r: nr, c: nc });
        if (cell.capture) break;
        step++;
      }
    });
  } 
  else if (piece.toLowerCase() === 'q') {
    const dirs = [
      { r: -1, c: -1 }, { r: -1, c: 1 }, { r: 1, c: -1 }, { r: 1, c: 1 },
      { r: -1, c: 0 }, { r: 1, c: 0 }, { r: 0, c: -1 }, { r: 0, c: 1 }
    ];
    dirs.forEach(d => {
      let step = 1;
      while (true) {
        const nr = r + d.r * step;
        const nc = c + d.c * step;
        const cell = checkCell(nr, nc);
        if (!cell.ok) break;
        moves.push({ r: nr, c: nc });
        if (cell.capture) break;
        step++;
      }
    });
  } 
  else if (piece.toLowerCase() === 'k') {
    const dirs = [
      { r: -1, c: -1 }, { r: -1, c: 1 }, { r: 1, c: -1 }, { r: 1, c: 1 },
      { r: -1, c: 0 }, { r: 1, c: 0 }, { r: 0, c: -1 }, { r: 0, c: 1 }
    ];
    dirs.forEach(d => {
      const nr = r + d.r;
      const nc = c + d.c;
      const cell = checkCell(nr, nc);
      if (cell.ok) moves.push({ r: nr, c: nc });
    });
  }

  return moves;
}

function isKingInCheck(color, matrix) {
  const targetKing = color === 'white' ? 'k' : 'K';
  let kingPos = null;
  
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (matrix[r][c] === targetKing) {
        kingPos = { r, c };
        break;
      }
    }
    if (kingPos) break;
  }
  
  if (!kingPos) return false;
  
  const opponentColor = color === 'white' ? 'black' : 'white';
  
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = matrix[r][c];
      if (piece) {
        const pieceColor = piece === piece.toLowerCase() ? 'white' : 'black';
        if (pieceColor === opponentColor) {
          const pseudoMoves = getPseudoLegalMoves(r, c, piece, matrix);
          const attacksKing = pseudoMoves.some(m => m.r === kingPos.r && m.c === kingPos.c);
          if (attacksKing) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

function getLegalMoves(r, c, piece, matrix = chessMatrix) {
  const pseudoMoves = getPseudoLegalMoves(r, c, piece, matrix);
  const color = piece === piece.toLowerCase() ? 'white' : 'black';
  
  return pseudoMoves.filter(m => {
    const tempMatrix = JSON.parse(JSON.stringify(matrix));
    tempMatrix[m.r][m.c] = tempMatrix[r][c];
    tempMatrix[r][c] = null;
    return !isKingInCheck(color, tempMatrix);
  });
}

function hasAnyLegalMoves(color, matrix) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = matrix[r][c];
      if (piece) {
        const pieceColor = piece === piece.toLowerCase() ? 'white' : 'black';
        if (pieceColor === color) {
          const legalMoves = getLegalMoves(r, c, piece, matrix);
          if (legalMoves.length > 0) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

function moveChessPiece(fromR, fromC, toR, toC) {
  const movingPiece = chessMatrix[fromR][fromC];
  const capturedPiece = chessMatrix[toR][toC];
  
  chessMatrix[toR][toC] = movingPiece;
  chessMatrix[fromR][fromC] = null;
  selectedTile = null;
  
  if (capturedPiece) {
    const isPlayerCapture = movingPiece === movingPiece.toLowerCase();
    if (isPlayerCapture) {
      const scoreVal = capturedPiece.toLowerCase() === 'k' ? 100 : capturedPiece.toLowerCase() === 'q' ? 40 : 15;
      addScore(scoreVal, `Captured piece (${capturedPiece.toUpperCase()})`);
    }
  }

  // Swap Turn
  currentTurn = currentTurn === 'white' ? 'black' : 'white';
  renderChessBoard();
  
  const inCheck = isKingInCheck(currentTurn, chessMatrix);
  const movesAvailable = hasAnyLegalMoves(currentTurn, chessMatrix);
  
  if (!movesAvailable) {
    if (inCheck) {
      if (currentTurn === 'black') {
        addScore(100, 'Checkmate Victory');
        setTimeout(() => {
          openVictoryScreen(
            'Congratulations!',
            'Shatranj Sandbox Cleared',
            100,
            'Magnificent grandmaster strategy! You successfully navigated checks, captured opposing pieces, and checkmated the CPU King to win the match!'
          );
        }, 200);
      } else {
        openInfoModal('Checkmate Defeat', 'The CPU has checkmated your King! Try another match to refine your defense.');
      }
    } else {
      openInfoModal('Stalemate Draw', 'The game ends in a Stalemate! The active player has no legal moves and is not in check.');
    }
    resetChessBoard();
    return;
  }
  
  if (inCheck) {
    if (currentTurn === 'white') {
      triggerToast('Check!', 'Your King is in Check! Protect your King.', true);
      document.getElementById('chessTurnStatus').textContent = 'CHECK! Protect your King.';
      document.getElementById('chessTurnStatus').style.color = 'var(--neon-magenta)';
    } else {
      triggerToast('Check!', 'The CPU King is in Check!');
      document.getElementById('chessTurnStatus').textContent = 'AI is in Check! Evaluating defenses...';
      document.getElementById('chessTurnStatus').style.color = 'var(--neon-cyan)';
    }
  } else {
    if (currentTurn === 'white') {
      document.getElementById('chessTurnStatus').textContent = 'Your Turn: Select a White piece.';
      document.getElementById('chessTurnStatus').style.color = '#ffffff';
    } else {
      document.getElementById('chessTurnStatus').textContent = 'AI is evaluating moves...';
      document.getElementById('chessTurnStatus').style.color = 'var(--text-sub)';
    }
  }
  
  if (currentTurn === 'black') {
    setTimeout(makeAIMove, 1000);
  }
}

function makeAIMove() {
  if (currentTurn !== 'black') return;
  
  let aiMoves = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = chessMatrix[r][c];
      if (piece && piece === piece.toUpperCase()) {
        const moves = getLegalMoves(r, c, piece, chessMatrix);
        moves.forEach(m => {
          aiMoves.push({ from: { r, c }, to: m, piece });
        });
      }
    }
  }

  if (aiMoves.length === 0) {
    return;
  }

  let captures = aiMoves.filter(m => chessMatrix[m.to.r][m.to.c] !== null);
  let chosen = captures.length > 0 ? captures[Math.floor(Math.random() * captures.length)] : aiMoves[Math.floor(Math.random() * aiMoves.length)];
  
  moveChessPiece(chosen.from.r, chosen.from.c, chosen.to.r, chosen.to.c);
  triggerToast('AI Move', `AI moved piece to Row ${chosen.to.r + 1}, Col ${chosen.to.c + 1}`);
}

function resetChessBoard() {
  initChessGame();
  triggerToast('Board Reset', 'Chess board set to start configurations.');
}


// =========================================================
// OVERLAYS: MODAL & TOAST MANAGERS
// =========================================================
const infoModalOverlay = document.getElementById('infoModalOverlay');
const modalBodyText = document.getElementById('modalBodyText');

function openInfoModal(title, body) {
  document.getElementById('modalTitle').textContent = title;
  modalBodyText.textContent = body;
  infoModalOverlay.classList.add('active');
}

function closeInfoModal() {
  infoModalOverlay.classList.remove('active');
}

const toastContainer = document.getElementById('toastContainer');
function triggerToast(title, desc, isError = false) {
  const toast = document.createElement('div');
  toast.className = `cosmic-toast ${isError ? 'toast-error' : ''}`;
  
  toast.innerHTML = `
    <i class="fa-solid ${isError ? 'fa-triangle-exclamation' : 'fa-circle-check'}"></i>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-desc">${desc}</div>
    </div>
  `;

  toastContainer.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

function openVictoryScreen(title, sub, xpReward, msg) {
  closeFullscreen();
  document.getElementById('victorySub').textContent = sub;
  document.getElementById('victoryXp').textContent = `+${xpReward} XP`;
  document.getElementById('victoryTotal').textContent = `${userScore} XP`;
  document.getElementById('victoryMsg').textContent = msg;
  document.getElementById('victoryOverlay').classList.add('active');
}

function closeVictoryScreen() {
  document.getElementById('victoryOverlay').classList.remove('active');
  initGameEngine(activeGame);
}

function exitVictoryToPortal() {
  document.getElementById('victoryOverlay').classList.remove('active');
  exitToPortal();
}
