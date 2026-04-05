// games/iq-test.js

const QUESTIONS = [
  // ── Pattern Recognition ──
  {
    category: "Pattern Recognition",
    question: "What comes next in the sequence?",
    pattern: "2, 4, 8, 16, __",
    options: ["24", "32", "28", "36"],
    answer: "32",
    explanation: "Each number doubles: ×2 pattern."
  },
  {
    category: "Pattern Recognition",
    question: "Complete the number sequence:",
    pattern: "1, 4, 9, 16, 25, __",
    options: ["30", "36", "49", "35"],
    answer: "36",
    explanation: "These are perfect squares: 6² = 36."
  },
  {
    category: "Pattern Recognition",
    question: "What number continues the pattern?",
    pattern: "3, 6, 11, 18, 27, __",
    options: ["36", "38", "40", "34"],
    answer: "38",
    explanation: "Differences: +3,+5,+7,+9,+11 → 27+11=38."
  },
  {
    category: "Pattern Recognition",
    question: "What letter comes next?",
    pattern: "A, C, F, J, O, __",
    options: ["S", "T", "U", "V"],
    answer: "U",
    explanation: "Gaps: +2,+3,+4,+5,+6 → O(15)+6=U(21)."
  },
  {
    category: "Pattern Recognition",
    question: "Find the missing number:",
    pattern: "1, 1, 2, 3, 5, 8, __",
    options: ["11", "12", "13", "14"],
    answer: "13",
    explanation: "Fibonacci: each number = sum of two before it."
  },

  // ── Logical Reasoning ──
  {
    category: "Logical Reasoning",
    question: "If all Bloops are Razzles, and all Razzles are Lazzles, then which must be true?",
    options: ["All Razzles are Bloops", "All Bloops are Lazzles", "All Lazzles are Bloops", "None of the above"],
    answer: "All Bloops are Lazzles",
    explanation: "Transitive logic: Bloops→Razzles→Lazzles, so Bloops are Lazzles."
  },
  {
    category: "Logical Reasoning",
    question: "A clock shows 3:15. What is the angle between the hour and minute hands?",
    options: ["0°", "7.5°", "15°", "22.5°"],
    answer: "7.5°",
    explanation: "Hour hand moves 0.5°/min. At 3:15, hour hand is at 97.5°, minute at 90°. Difference = 7.5°."
  },
  {
    category: "Logical Reasoning",
    question: "If you rearrange 'CIFAIPC' you get a type of:",
    options: ["Ocean", "Country", "City", "Animal"],
    answer: "Ocean",
    explanation: "CIFAIPC → PACIFIC (Pacific Ocean)."
  },
  {
    category: "Logical Reasoning",
    question: "Which word is the odd one out?",
    options: ["Dog", "Lion", "Shark", "Eagle"],
    answer: "Shark",
    explanation: "Dog, Lion, Eagle are warm-blooded mammals/birds. Shark is a cold-blooded fish."
  },
  {
    category: "Logical Reasoning",
    question: "How many squares are in a 3×3 grid?",
    options: ["9", "12", "14", "16"],
    answer: "14",
    explanation: "9 (1×1) + 4 (2×2) + 1 (3×3) = 14 squares total."
  },

  // ── Spatial Reasoning ──
  {
    category: "Spatial Reasoning",
    question: "A cube has 6 faces, 12 edges, and 8 vertices. If you cut off one corner, how many faces does it now have?",
    options: ["6", "7", "8", "9"],
    answer: "7",
    explanation: "Cutting a corner creates 1 new triangular face, giving 6+1=7 faces."
  },
  {
    category: "Spatial Reasoning",
    question: "How many sides does a hexagon have?",
    options: ["5", "6", "7", "8"],
    answer: "6",
    explanation: "Hex = 6. A hexagon has 6 sides."
  },
  {
    category: "Spatial Reasoning",
    question: "If you fold a square paper in half diagonally, what shape do you get?",
    options: ["Square", "Rectangle", "Triangle", "Trapezoid"],
    answer: "Triangle",
    explanation: "Folding diagonally creates a right isosceles triangle."
  },

  // ── Math & Logic ──
  {
    category: "Math & Logic",
    question: "A bat and ball cost $1.10 in total. The bat costs $1 more than the ball. How much does the ball cost?",
    options: ["$0.10", "$0.05", "$0.15", "$0.20"],
    answer: "$0.05",
    explanation: "Ball = x, Bat = x+1. So 2x+1=1.10 → x=$0.05."
  },
  {
    category: "Math & Logic",
    question: "In a race, you overtake the person in 2nd place. What place are you now?",
    options: ["1st", "2nd", "3rd", "4th"],
    answer: "2nd",
    explanation: "You take their position (2nd), they move to 3rd. You can't be 1st by overtaking 2nd."
  },
];

let currentQ = 0;
let score = 0;
let correctCount = 0;
let timerInterval = null;
let timeLeft = 30;
let answered = false;

const introScreen  = document.getElementById('intro-screen');
const gameScreen   = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const qNumEl       = document.getElementById('q-num');
const timerEl      = document.getElementById('timer');
const scoreEl      = document.getElementById('score');
const progressFill = document.getElementById('progress-fill');
const categoryBadge= document.getElementById('category-badge');
const questionBox  = document.getElementById('question-box');
const optionsEl    = document.getElementById('options');
const feedbackEl   = document.getElementById('feedback');
const nextBtn      = document.getElementById('next-btn');

// Auth
const username = localStorage.getItem('username');
const userInfoEl = document.getElementById('user-info');
if (username) userInfoEl.innerHTML = `Welcome, <strong>${username}</strong>`;

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.clear(); window.location.href = '../index.html';
});

document.getElementById('start-btn').addEventListener('click', startGame);

function startGame() {
  introScreen.style.display = 'none';
  gameScreen.style.display  = 'block';
  showQuestion();
}

function showQuestion() {
  answered = false;
  const q = QUESTIONS[currentQ];
  qNumEl.textContent    = currentQ + 1;
  scoreEl.textContent   = score;
  progressFill.style.width = ((currentQ / QUESTIONS.length) * 100) + '%';
  categoryBadge.textContent = q.category;
  feedbackEl.className  = 'feedback';
  feedbackEl.textContent = '';
  nextBtn.style.display = 'none';

  // Build question HTML
  if (q.pattern) {
    questionBox.innerHTML = `<p style="margin-bottom:.75rem;color:rgba(255,255,255,.8)">${q.question}</p><div class="pattern">${q.pattern}</div>`;
  } else {
    questionBox.innerHTML = `<p>${q.question}</p>`;
  }

  // Build options
  optionsEl.innerHTML = '';
  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => selectAnswer(opt, q));
    optionsEl.appendChild(btn);
  });

  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 30;
  timerEl.textContent = timeLeft;
  timerEl.className = '';
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 10) timerEl.className = 'danger';
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      if (!answered) timeUp();
    }
  }, 1000);
}

function timeUp() {
  answered = true;
  disableOptions();
  const q = QUESTIONS[currentQ];
  markCorrect(q.answer);
  feedbackEl.className = 'feedback wrong-fb';
  feedbackEl.textContent = `⏰ Time's up! Answer: ${q.answer}`;
  nextBtn.style.display = 'block';
}

function selectAnswer(selected, q) {
  if (answered) return;
  answered = true;
  clearInterval(timerInterval);
  disableOptions();

  const isCorrect = selected === q.answer;
  if (isCorrect) {
    score += Math.max(5, timeLeft * 2); // bonus for speed
    correctCount++;
    feedbackEl.className = 'feedback correct-fb';
    feedbackEl.textContent = `✓ Correct! ${q.explanation}`;
  } else {
    feedbackEl.className = 'feedback wrong-fb';
    feedbackEl.textContent = `✗ Wrong. ${q.explanation}`;
  }
  scoreEl.textContent = score;
  markCorrect(q.answer);
  if (!isCorrect) markWrong(selected);
  nextBtn.style.display = 'block';
}

function disableOptions() {
  optionsEl.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
}
function markCorrect(ans) {
  optionsEl.querySelectorAll('.option-btn').forEach(b => {
    if (b.textContent === ans) b.classList.add('correct');
  });
}
function markWrong(ans) {
  optionsEl.querySelectorAll('.option-btn').forEach(b => {
    if (b.textContent === ans) b.classList.add('wrong');
  });
}

nextBtn.addEventListener('click', () => {
  currentQ++;
  if (currentQ < QUESTIONS.length) showQuestion();
  else showResult();
});

function calcIQ(correct, total, rawScore) {
  const accuracy = correct / total;
  const base = 70 + Math.round(accuracy * 60);
  return Math.min(145, base + Math.round(rawScore / 50));
}

function getIQTier(iq) {
  if (iq >= 130) return { label: 'Very Superior 🌟', color: '#fbbf24', desc: 'Exceptional cognitive ability. You are in the top 2% of the population.' };
  if (iq >= 120) return { label: 'Superior 💎', color: '#a78bfa', desc: 'Well above average. You demonstrate advanced reasoning and problem-solving.' };
  if (iq >= 110) return { label: 'High Average ⭐', color: '#60a5fa', desc: 'Above average intelligence. Strong analytical and logical thinking.' };
  if (iq >= 90)  return { label: 'Average 👍', color: '#4ade80', desc: 'Average intelligence. You performed solidly on reasoning tasks.' };
  if (iq >= 80)  return { label: 'Low Average 📚', color: '#fb923c', desc: 'Below average. Practice logic puzzles to improve your score.' };
  return { label: 'Keep Practicing 💪', color: '#f87171', desc: 'Keep working on pattern recognition and logical thinking.' };
}

function showResult() {
  progressFill.style.width = '100%';
  gameScreen.style.display  = 'none';
  resultScreen.style.display = 'block';

  const iq   = calcIQ(correctCount, QUESTIONS.length, score);
  const tier = getIQTier(iq);
  const accuracy = Math.round((correctCount / QUESTIONS.length) * 100);

  resultScreen.innerHTML = `
    <h2>Test Complete!</h2>
    <div class="iq-circle">
      <span class="iq-num">${iq}</span>
      <span class="iq-label">IQ Score</span>
    </div>
    <p class="iq-tier" style="color:${tier.color}">${tier.label}</p>
    <p class="iq-desc">${tier.desc}</p>
    <div class="result-stats">
      <div class="stat-box"><div class="stat-val">${correctCount}/${QUESTIONS.length}</div><div class="stat-lbl">Correct</div></div>
      <div class="stat-box"><div class="stat-val">${accuracy}%</div><div class="stat-lbl">Accuracy</div></div>
      <div class="stat-box"><div class="stat-val">${score}</div><div class="stat-lbl">Points</div></div>
    </div>
    <p style="color:rgba(255,255,255,.4);font-size:.8rem;margin-bottom:1.5rem;">Note: This is a fun estimation, not a certified IQ test.</p>
    <div class="result-actions">
      <button class="btn-primary" onclick="location.reload()">Try Again</button>
      <a href="../index.html" class="btn-secondary">Home</a>
    </div>
  `;
}