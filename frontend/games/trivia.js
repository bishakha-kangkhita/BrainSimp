// games/trivia.js

let currentQuestionIndex = 0;
let score = 0;
let questions = [];

const questionEl     = document.getElementById('question');
const optionsEl      = document.getElementById('options');
const scoreEl        = document.getElementById('score');
const questionNumEl  = document.getElementById('question-num');
const nextBtn        = document.getElementById('next-btn');
const resultEl       = document.getElementById('result');
const finalScoreEl   = document.getElementById('final-score');
const xpGainEl       = document.getElementById('xp-gain');
const userInfoEl     = document.getElementById('user-info');

// ===== AUTH CHECK =====
function checkAuth() {
  const token    = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  if (!token || !username) {
    alert("Please login first!");
    window.location.href = "../index.html";
    return false;
  }

  userInfoEl.innerHTML = `Welcome, <strong>${username}</strong>`;
  return true;
}

// ===== LOAD QUESTIONS =====
async function loadQuestions() {
  showLoading();

  try {
    const token = localStorage.getItem('token');

    const res = await fetch('http://localhost:3000/api/games/trivia', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();

    if (data.success && data.questions.length > 0) {
      questions = data.questions;
      hideLoading();
      showQuestion();
    } else {
      questionEl.innerHTML = `<div class="loading-state">No questions found! Please add questions in the database.</div>`;
    }
  } catch (err) {
    console.error(err);
    questionEl.innerHTML = `<div class="loading-state">Cannot connect to server. Is the server running?</div>`;
  }
}

function showLoading() {
  questionEl.innerHTML = `
    <div class="loading-state">
      <div class="loading-spinner"></div>
      Loading questions...
    </div>`;
  optionsEl.innerHTML = '';
  updateProgress();
}

function hideLoading() {
  questionEl.innerHTML = '';
}

// ===== PROGRESS BAR =====
function updateProgress() {
  const fill = document.getElementById('progress-fill');
  if (!fill) return;
  const pct = questions.length > 0
    ? Math.round((currentQuestionIndex / questions.length) * 100)
    : 0;
  fill.style.width = pct + '%';
}

// ===== SHOW QUESTION =====
function showQuestion() {
  const q = questions[currentQuestionIndex];

  questionEl.textContent = q.question_text;
  questionNumEl.textContent = currentQuestionIndex + 1;
  updateProgress();

  // clear feedback
  const feedbackEl = document.getElementById('feedback-msg');
  if (feedbackEl) {
    feedbackEl.style.display = 'none';
    feedbackEl.className = 'feedback-msg';
    feedbackEl.textContent = '';
  }

  optionsEl.innerHTML = '';

  const labels = ['A', 'B', 'C', 'D'];
  const values = [q.option_a, q.option_b, q.option_c, q.option_d];

  values.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<strong>${labels[index]}</strong>${option}`;
    btn.dataset.label = labels[index];
    btn.addEventListener('click', () => selectAnswer(labels[index], q.correct_answer));
    optionsEl.appendChild(btn);
  });

  nextBtn.style.display = 'none';
}

// ===== SELECT ANSWER =====
function selectAnswer(selected, correct) {
  const allBtns = optionsEl.querySelectorAll('.option-btn');
  allBtns.forEach(btn => (btn.disabled = true));

  const isCorrect = selected === correct;

  allBtns.forEach(btn => {
    if (btn.dataset.label === correct) {
      btn.classList.add('correct');
    }
    if (btn.dataset.label === selected && !isCorrect) {
      btn.classList.add('wrong');
    }
  });

  if (isCorrect) {
    score += 10;
    scoreEl.textContent = score;
  }

  // Show feedback
  const feedbackEl = document.getElementById('feedback-msg');
  if (feedbackEl) {
    feedbackEl.style.display = 'block';
    if (isCorrect) {
      feedbackEl.className = 'feedback-msg correct-msg';
      feedbackEl.textContent = '✓ Correct!';
    } else {
      feedbackEl.className = 'feedback-msg wrong-msg';
      feedbackEl.textContent = `✗ Wrong! Correct answer: ${correct}`;
    }
  }

  nextBtn.style.display = 'block';
}

// ===== NEXT BUTTON =====
nextBtn.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    endGame();
  }
});

// ===== END GAME =====
function endGame() {
  updateProgress();
  document.querySelector('.game-container').innerHTML = buildResultHTML();

  document.getElementById('play-again-btn').addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    location.reload();
  });
}

function getGrade(score, total) {
  const pct = (score / (total * 10)) * 100;
  if (pct === 100) return { label: 'Perfect! 🏆', color: '#fcd34d' };
  if (pct >= 80)  return { label: 'Excellent! ⭐', color: '#4ade80' };
  if (pct >= 60)  return { label: 'Good Job! 👍', color: '#60a5fa' };
  if (pct >= 40)  return { label: 'Keep Practicing 💪', color: '#fb923c' };
  return            { label: 'Try Again! 📚', color: '#f87171' };
}

function buildResultHTML() {
  const total = questions.length;
  const grade = getGrade(score, total);

  return `
    <div id="result" class="result">
      <h2>Game Over!</h2>
      <div class="result-score-circle">
        <span>${score}</span>
        <span>/ ${total * 10} pts</span>
      </div>
      <p class="result-grade" style="color: ${grade.color}">${grade.label}</p>
      <p id="xp-gain">You earned <strong>+${score} XP</strong>!</p>
      <div class="result-actions">
        <button id="play-again-btn" class="play-again-btn">Play Again</button>
        <a href="../index.html" class="home-btn">Go to Home</a>
      </div>
    </div>
  `;
}

// ===== LOGOUT =====
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = "../index.html";
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  if (!checkAuth()) return;

  // Inject progress bar into DOM (before game-stats)
  const gameContainer = document.querySelector('.game-container');
  const gameStats     = gameContainer.querySelector('.game-stats');
  const progressHTML  = `
    <div class="progress-bar-wrapper">
      <div class="progress-bar-fill" id="progress-fill" style="width: 0%"></div>
    </div>`;
  gameContainer.insertAdjacentHTML('afterbegin', progressHTML);

  // Inject feedback message placeholder after options
  const optionsContainer = document.getElementById('options');
  optionsContainer.insertAdjacentHTML(
    'afterend',
    `<div id="feedback-msg" class="feedback-msg"></div>`
  );

  loadQuestions();
});