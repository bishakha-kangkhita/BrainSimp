// games/mind-games.js

// Auth
const username = localStorage.getItem('username');
const userInfoEl = document.getElementById('user-info');
if (username) userInfoEl.innerHTML = `Welcome, <strong>${username}</strong>`;
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.clear(); window.location.href = '../index.html';
});

const modeSelect = document.getElementById('mode-select');

// Back buttons
document.querySelectorAll('.back-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sub-game').forEach(g => g.style.display = 'none');
    modeSelect.style.display = 'block';
    clearAllTimers();
  });
});

// Mode cards
document.querySelectorAll('.mode-card').forEach(card => {
  card.addEventListener('click', () => {
    const mode = card.dataset.mode;
    modeSelect.style.display = 'none';
    if (mode === 'memory')      startMemory();
    if (mode === 'speedmath')   startSpeedMath();
    if (mode === 'wordscramble') startWordScramble();
  });
});

let allTimers = [];
function clearAllTimers() { allTimers.forEach(clearInterval); allTimers = []; }

// ════════════════════════════════════════
//  1. MEMORY MATCH
// ════════════════════════════════════════
const EMOJIS = ['🦊','🐬','🌺','🎸','🍕','🚀','🦋','🎲'];

function startMemory() {
  document.getElementById('memory-game').style.display = 'block';
  const board = document.getElementById('mem-board');
  board.innerHTML = '';
  document.getElementById('mem-moves').textContent = '0';
  document.getElementById('mem-matches').textContent = '0';
  document.getElementById('mem-timer').textContent = '0';

  let moves = 0, matches = 0, seconds = 0;
  let flipped = [], locked = false;

  const cards = shuffle([...EMOJIS, ...EMOJIS]);
  const timerEl = document.getElementById('mem-timer');
  const t = setInterval(() => { seconds++; timerEl.textContent = seconds; }, 1000);
  allTimers.push(t);

  cards.forEach(emoji => {
    const card = document.createElement('div');
    card.className = 'mem-card';
    card.innerHTML = `<div class="mem-card-inner">
      <div class="mem-card-back">?</div>
      <div class="mem-card-front">${emoji}</div>
    </div>`;
    card.dataset.emoji = emoji;

    card.addEventListener('click', () => {
      if (locked || card.classList.contains('flipped') || card.classList.contains('matched')) return;
      card.classList.add('flipped');
      flipped.push(card);

      if (flipped.length === 2) {
        locked = true;
        moves++;
        document.getElementById('mem-moves').textContent = moves;

        if (flipped[0].dataset.emoji === flipped[1].dataset.emoji) {
          flipped.forEach(c => c.classList.add('matched'));
          matches++;
          document.getElementById('mem-matches').textContent = matches;
          flipped = []; locked = false;
          if (matches === EMOJIS.length) {
            clearInterval(t);
            setTimeout(() => showMemComplete(moves, seconds), 400);
          }
        } else {
          setTimeout(() => {
            flipped.forEach(c => c.classList.remove('flipped'));
            flipped = []; locked = false;
          }, 900);
        }
      }
    });
    board.appendChild(card);
  });
}

function showMemComplete(moves, seconds) {
  const board = document.getElementById('mem-board');
  const rating = moves <= 12 ? '⭐⭐⭐' : moves <= 18 ? '⭐⭐' : '⭐';
  board.insertAdjacentHTML('afterend', `
    <div class="mem-complete">
      <h3>${rating} Completed!</h3>
      <p>You found all 8 pairs in <strong>${moves} moves</strong> and <strong>${seconds} seconds</strong>.</p>
      <button class="btn-pink" onclick="startMemory()">Play Again</button>
    </div>`);
}

// ════════════════════════════════════════
//  2. SPEED MATH
// ════════════════════════════════════════
function startSpeedMath() {
  document.getElementById('speedmath-game').style.display = 'block';
  document.getElementById('sm-screen').style.display = 'block';
  document.getElementById('sm-result').style.display = 'none';

  let smScore = 0, smStreak = 0, smTime = 60, answered = false;

  const smScoreEl  = document.getElementById('sm-score');
  const smTimerEl  = document.getElementById('sm-timer');
  const smStreakEl = document.getElementById('sm-streak');
  const smQ        = document.getElementById('sm-question');
  const smOpts     = document.getElementById('sm-options');
  const smFB       = document.getElementById('sm-feedback');

  smScoreEl.textContent  = '0';
  smStreakEl.textContent = '0';

  const t = setInterval(() => {
    smTime--;
    smTimerEl.textContent = smTime;
    if (smTime <= 0) {
      clearInterval(t);
      showSpeedResult(smScore, smStreak);
    }
  }, 1000);
  allTimers.push(t);

  function nextQ() {
    answered = false;
    smFB.textContent = '';
    const q = genMathQ();
    smQ.textContent = q.question;
    smOpts.innerHTML = '';
    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'sm-opt';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        smOpts.querySelectorAll('button').forEach(b => b.disabled = true);
        if (opt === String(q.answer)) {
          btn.classList.add('correct');
          smScore += 10 + smStreak * 2;
          smStreak++;
          smFB.textContent = `✓ +${10 + (smStreak-1)*2} pts`;
          smFB.style.color = '#4ade80';
        } else {
          btn.classList.add('wrong');
          smOpts.querySelectorAll('button').forEach(b => { if (b.textContent === String(q.answer)) b.classList.add('correct'); });
          smScore = Math.max(0, smScore - 2);
          smStreak = 0;
          smFB.textContent = `✗ Answer: ${q.answer}`;
          smFB.style.color = '#f87171';
        }
        smScoreEl.textContent  = smScore;
        smStreakEl.textContent = smStreak;
        setTimeout(nextQ, 600);
      });
      smOpts.appendChild(btn);
    });
  }
  nextQ();
}

function genMathQ() {
  const ops = ['+', '-', '×'];
  const op  = ops[Math.floor(Math.random() * ops.length)];
  let a, b, answer;
  if (op === '+') { a = rand(10,50); b = rand(5,50); answer = a+b; }
  if (op === '-') { a = rand(20,80); b = rand(1,a); answer = a-b; }
  if (op === '×') { a = rand(2,12);  b = rand(2,12); answer = a*b; }
  const question = `${a} ${op} ${b} = ?`;
  const wrongs = genWrongAnswers(answer, 3);
  return { question, answer, options: shuffle([String(answer), ...wrongs]) };
}

function genWrongAnswers(correct, count) {
  const set = new Set();
  while (set.size < count) {
    const delta = rand(-15, 15);
    if (delta !== 0) set.add(String(correct + delta));
  }
  return [...set];
}

function showSpeedResult(score, topStreak) {
  document.getElementById('sm-screen').style.display = 'none';
  const res = document.getElementById('sm-result');
  res.style.display = 'block';
  const grade = score >= 200 ? '🔥 Blazing Fast!' : score >= 120 ? '⭐ Quick Thinker!' : score >= 60 ? '👍 Good Speed' : '📚 Keep Practicing';
  res.innerHTML = `
    <h3>Time's Up!</h3>
    <div class="big-score">${score}</div>
    <p>${grade} | Top Streak: ${topStreak}🔥</p>
    <button class="btn-pink" onclick="startSpeedMath()">Play Again</button>
  `;
}

// ════════════════════════════════════════
//  3. WORD SCRAMBLE
// ════════════════════════════════════════
const WORDS = [
  { word:'ELEPHANT', category:'Animal', hint:'Large mammal with a trunk' },
  { word:'PYTHON',   category:'Programming', hint:'A popular coding language' },
  { word:'JUPITER',  category:'Space', hint:'Largest planet in our solar system' },
  { word:'OXYGEN',   category:'Science', hint:'We breathe this gas' },
  { word:'LIBRARY',  category:'Places', hint:'Where you borrow books' },
  { word:'TRIANGLE', category:'Math', hint:'Shape with 3 sides' },
  { word:'SYMPHONY', category:'Music', hint:'A complex musical composition' },
  { word:'VOLCANO',  category:'Geography', hint:'Mountain that can erupt' },
  { word:'HISTORY',  category:'Subjects', hint:'Study of past events' },
  { word:'DOLPHIN',  category:'Animal', hint:'Intelligent ocean mammal' },
];

function startWordScramble() {
  document.getElementById('wordscramble-game').style.display = 'block';
  const words = shuffle([...WORDS]).slice(0, 10);
  let wsIdx = 0, wsScore = 0, wsHints = 3;

  const wsScoreEl = document.getElementById('ws-score');
  const wsNumEl   = document.getElementById('ws-num');
  const wsHintsEl = document.getElementById('ws-hints');
  const wsCat     = document.getElementById('ws-category');
  const wsScram   = document.getElementById('ws-scrambled');
  const wsInput   = document.getElementById('ws-input');
  const wsFB      = document.getElementById('ws-feedback');
  const wsHintBtn = document.getElementById('ws-hint');
  const wsSkip    = document.getElementById('ws-skip');

  function showWord() {
    if (wsIdx >= words.length) { showWSResult(); return; }
    const w = words[wsIdx];
    wsNumEl.textContent   = wsIdx + 1;
    wsCat.textContent     = w.category;
    wsScram.textContent   = scramble(w.word);
    wsInput.value = '';
    wsInput.focus();
    wsFB.textContent  = '';
    wsFB.className    = 'ws-feedback';
    wsHintBtn.textContent = `💡 Hint (${wsHints} left)`;
    wsHintBtn.disabled = wsHints <= 0;
  }

  document.getElementById('ws-submit').addEventListener('click', checkWord);
  wsInput.addEventListener('keydown', e => { if (e.key === 'Enter') checkWord(); });

  wsHintBtn.addEventListener('click', () => {
    if (wsHints <= 0) return;
    wsHints--;
    wsHintsEl.textContent = wsHints;
    wsHintBtn.textContent = `💡 Hint (${wsHints} left)`;
    wsHintBtn.disabled = wsHints <= 0;
    const w = words[wsIdx];
    wsFB.className = 'ws-feedback hint';
    wsFB.textContent = `💡 ${w.hint}`;
  });

  wsSkip.addEventListener('click', () => {
    wsFB.className = 'ws-feedback wrong';
    wsFB.textContent = `Answer was: ${words[wsIdx].word}`;
    wsIdx++;
    setTimeout(showWord, 1000);
  });

  function checkWord() {
    const ans = wsInput.value.trim().toUpperCase();
    const correct = words[wsIdx].word;
    if (ans === correct) {
      wsScore += wsHints > 0 ? 15 : 10;
      wsScoreEl.textContent = wsScore;
      wsFB.className = 'ws-feedback correct';
      wsFB.textContent = '✓ Correct!';
      wsIdx++;
      setTimeout(showWord, 800);
    } else {
      wsFB.className = 'ws-feedback wrong';
      wsFB.textContent = '✗ Try again!';
      wsInput.select();
    }
  }

  showWord();
}

function showWSResult() {
  document.getElementById('ws-screen').innerHTML = `
    <div class="ws-result">
      <h3>All Done! 🎉</h3>
      <div class="big-score">${document.getElementById('ws-score').textContent} pts</div>
      <p>${getWSGrade(parseInt(document.getElementById('ws-score').textContent))}</p>
      <button class="btn-pink" onclick="startWordScramble()">Play Again</button>
    </div>`;
}

function getWSGrade(score) {
  if (score >= 140) return '🏆 Word Wizard! Incredible vocabulary!';
  if (score >= 100) return '⭐ Word Pro! Great performance!';
  if (score >= 60)  return '👍 Good effort! Keep practicing!';
  return '📚 Keep playing to improve!';
}

// ─── Helpers ───
function scramble(word) {
  let arr = word.split('');
  do { arr = shuffle(arr); } while (arr.join('') === word);
  return arr.join(' ');
}
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }