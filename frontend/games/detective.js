// games/detective.js

const CASES = [
  {
    id: 1,
    title: "The Missing Diamond Necklace",
    difficulty: "medium",
    story: `At the annual gala of wealthy socialite Margaret Thorne, her prized 50-carat diamond necklace vanished from the locked trophy room. Security footage shows only four people entered the room between 8 PM and 10 PM. The necklace was last seen at 8:00 PM. You are called to investigate.`,
    clues: [
      "The trophy room lock was not broken. Whoever entered had a key — only Margaret and her butler, Victor, had keys.",
      "Victor claims he was in the kitchen all evening. The chef confirms he saw Victor at 7:45 PM but not after.",
      "Guest Sophia was seen arguing with Margaret earlier about a 'debt'. Sophia's fingerprints were found on the trophy case glass.",
      "A torn piece of black cloth matching Victor's uniform was caught on the trophy case hinge.",
      "The security log shows the trophy room was accessed at 9:15 PM using Margaret's key — but Margaret claims she lost her key two days ago.",
    ],
    suspects: [
      { name: "Victor", role: "Butler", alibi: "Claims to have been in the kitchen all evening preparing late-night snacks." },
      { name: "Sophia", role: "Family Friend", alibi: "Says she was at the bar area the entire evening talking to other guests." },
      { name: "Dr. Harmon", role: "Personal Physician", alibi: "Was giving a toast in the main hall from 8:30 to 9:30 PM." },
      { name: "Lily", role: "House Maid", alibi: "Was cleaning the upstairs bedrooms and says she never came downstairs." },
    ],
    culprit: "Victor",
    explanation: "Victor stole the necklace. He had a copy of Margaret's key (made when she 'lost' it — he had it copied). The torn cloth from his uniform placed him at the scene. The chef only saw him before the theft. His alibi breaks down after 7:45 PM.",
    xp: 80,
  },
  {
    id: 2,
    title: "Poison at the Professor's Table",
    difficulty: "hard",
    story: `Professor Edwin Clark was found dead at his dinner table on the night of Friday the 13th. The cause of death was arsenic poisoning in his wine glass. He had four dinner guests that evening. The poison must have been added to the glass during dinner — the wine bottle tested clean. Your task: find the poisoner.`,
    clues: [
      "Only the wine glass tested positive for arsenic, not the bottle. The poison was added directly to his glass.",
      "Professor Clark's will was changed 3 days before his death. The new beneficiary is his assistant, Daniel.",
      "Guest Nora is a trained chemist who works with various compounds daily. She sat directly to Clark's left.",
      "Security camera footage shows someone entering Clark's study at 11 PM — two hours after he died. They were seen going through his files.",
      "A small paper packet with traces of arsenic was found in the trash behind Daniel's chair.",
      "Nora admits she argued with Clark over a stolen research paper, but insists she didn't poison him.",
    ],
    suspects: [
      { name: "Daniel", role: "Research Assistant", alibi: "Claims to have been refilling wine glasses all evening and stepped out only to get dessert." },
      { name: "Nora", role: "Chemist / Guest", alibi: "Sat to Clark's left and says she was in conversation with him the entire meal." },
      { name: "Mrs. Clark", role: "Ex-Wife", alibi: "Arrived late to dinner and says she sat at the far end of the table, away from Edwin." },
      { name: "Roland", role: "Publisher", alibi: "Was on his phone for much of dinner. Has no chemistry knowledge he claims." },
    ],
    culprit: "Daniel",
    explanation: "Daniel poisoned the professor. As assistant, he was constantly moving around the table (refilling wine) — giving him opportunity to add arsenic to the professor's glass specifically. The arsenic packet behind his chair and his new status as beneficiary are damning. He also entered the study later to destroy evidence.",
    xp: 120,
  },
  {
    id: 3,
    title: "The Forged Painting",
    difficulty: "medium",
    story: `The Belmont Gallery received a call: their prized Rembrandt painting — valued at $4 million — is a forgery. The original has been swapped sometime in the last 72 hours. Only authorized personnel had access. Gallery director Ms. Priya believes it was an inside job. Can you identify who switched the painting?`,
    clues: [
      "The swap happened between Tuesday night and Wednesday morning — the gallery was closed during this time.",
      "Security logs show the alarm was disarmed at 2:14 AM Wednesday using guard Aaron's code.",
      "Aaron claims he was home sick on Wednesday. His doctor appointment was Thursday — he was not seen by a doctor on Wednesday.",
      "Art restorer Camille had been photographing the Rembrandt all of Tuesday — extremely high-resolution shots useful for forgery.",
      "A receipt from a specialty art supply store was found in the break room — pigments used in 17th-century-style forgery. The receipt is unsigned.",
    ],
    suspects: [
      { name: "Aaron", role: "Night Guard", alibi: "Claims to have been sick at home Wednesday. No one can verify this." },
      { name: "Camille", role: "Art Restorer", alibi: "Says she finished photographing Tuesday evening and left at 7 PM. Signed out of the log." },
      { name: "Mr. Frost", role: "Gallery Investor", alibi: "Was at a charity dinner Wednesday night with witnesses. Cannot account for 2 AM." },
      { name: "Tessa", role: "Curator's Assistant", alibi: "Was on a flight to Paris Tuesday night. Airline records can be checked." },
    ],
    culprit: "Aaron",
    explanation: "Aaron disarmed the alarm using his own code at 2:14 AM. His sick alibi is unverifiable and contradicted by no doctor visit. He likely worked with someone who made the forgery (Camille's photos could have been sold or stolen), but he was the one who physically swapped the painting.",
    xp: 80,
  },
  {
    id: 4,
    title: "Vanished at the Train Station",
    difficulty: "hard",
    story: `Millionaire Jake Stanton was seen boarding the 11:45 PM express train — but he never arrived at his destination. When the train was checked, he was gone. No stops were made. Fellow passengers in his private car are suspects. Jake had recently threatened to expose financial crimes by a business partner. Investigate.`,
    clues: [
      "The train made zero stops. Jake's private cabin was locked from the inside — the window latch was broken outward.",
      "Passenger Renata, a former acrobat, was seen near Jake's cabin at 12:10 AM by the conductor.",
      "Jake's briefcase was found empty — he was carrying documents that could implicate someone in a $10M fraud.",
      "A glove was found on the exterior platform between cars — DNA testing shows it belongs to passenger Marcus.",
      "Marcus is Jake's business partner and the one Jake was planning to expose. He booked the same train last-minute.",
      "Renata claims Marcus paid her $5,000 cash 'for consulting' the week before the trip.",
    ],
    suspects: [
      { name: "Renata", role: "Former Acrobat / Traveler", alibi: "Claims she was in the dining car until 1 AM. Waiter only remembers her until midnight." },
      { name: "Marcus", role: "Business Partner", alibi: "Claims he was asleep in his cabin. Conductor did not check on him." },
      { name: "Dr. Yuen", role: "Physician Traveling for Conference", alibi: "Was seen reading in the dining car from 11 PM to 1 AM by multiple witnesses." },
      { name: "Helena", role: "Jake's Personal Assistant", alibi: "Was in a different car. Claims she did not know Jake was on this train." },
    ],
    culprit: "Marcus",
    explanation: "Marcus orchestrated Jake's disappearance. He hired Renata (cash payment + her acrobatic skills = she pushed Jake through the broken window at speed). His glove on the exterior platform places him at the scene. The stolen documents removed the evidence against him — motive is crystal clear.",
    xp: 130,
  },
];

// State
let solvedCases = JSON.parse(localStorage.getItem('det_solved') || '[]');
let detXP = parseInt(localStorage.getItem('det_xp') || '0');
let activeCaseId = null;
let revealedClues = 0;
let caseAccused = false;

// Auth
const username = localStorage.getItem('username');
document.getElementById('user-info').innerHTML = username ? `Welcome, <strong>${username}</strong>` : '';
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.clear(); window.location.href = '../index.html';
});

// Score display
function updateScoreDisplay() {
  document.getElementById('solved-count').textContent = solvedCases.length;
  document.getElementById('det-xp').textContent = detXP;
}

// Render case list
function renderCaseList() {
  const list = document.getElementById('case-list');
  list.innerHTML = '';
  CASES.forEach((c, i) => {
    const solved = solvedCases.includes(c.id);
    const div = document.createElement('div');
    div.className = 'case-thumb';
    div.innerHTML = `
      <div class="case-thumb-num">0${i+1}</div>
      <div class="case-thumb-body">
        <h3>${c.title}</h3>
        <p>${c.story.substring(0, 100)}…</p>
        <div class="case-thumb-foot">
          <span class="diff-badge ${c.difficulty}">${c.difficulty}</span>
          ${solved ? '<span class="solved-badge">✓ Solved</span>' : ''}
        </div>
      </div>`;
    div.addEventListener('click', () => openCase(c.id));
    list.appendChild(div);
  });
  updateScoreDisplay();
}

// Open a case
function openCase(id) {
  activeCaseId = id;
  revealedClues = 0;
  caseAccused = false;

  const c = CASES.find(x => x.id === id);
  document.getElementById('case-select').style.display = 'none';
  document.getElementById('active-case').style.display = 'block';

  document.getElementById('case-title').textContent = c.title;
  document.getElementById('case-story').textContent = c.story;
  document.getElementById('clues-used').textContent = 0;

  const diffBadge = document.getElementById('case-difficulty');
  diffBadge.textContent = c.difficulty;
  diffBadge.className = `diff-badge ${c.difficulty}`;

  // Clues
  document.getElementById('clues-list').innerHTML = '';
  const revealBtn = document.getElementById('reveal-clue-btn');
  revealBtn.disabled = false;
  revealBtn.textContent = '🔎 Reveal Next Clue';

  // Suspects
  const suspectsList = document.getElementById('suspects-list');
  suspectsList.innerHTML = '';
  c.suspects.forEach(s => {
    const card = document.createElement('div');
    card.className = 'suspect-card';
    card.innerHTML = `<div class="suspect-name">${s.name}</div>
      <div class="suspect-role">${s.role}</div>
      <div class="suspect-alibi">${s.alibi}</div>`;
    suspectsList.appendChild(card);
  });

  // Accuse buttons
  const accuseArea = document.getElementById('accuse-buttons');
  accuseArea.innerHTML = '';
  c.suspects.forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'accuse-btn';
    btn.textContent = `Accuse ${s.name}`;
    btn.addEventListener('click', () => makeAccusation(s.name));
    accuseArea.appendChild(btn);
  });

  document.getElementById('verdict').style.display = 'none';
}

// Reveal clue one at a time
document.getElementById('reveal-clue-btn').addEventListener('click', () => {
  const c = CASES.find(x => x.id === activeCaseId);
  if (revealedClues >= c.clues.length) return;

  const clue = c.clues[revealedClues];
  revealedClues++;
  document.getElementById('clues-used').textContent = revealedClues;

  const item = document.createElement('div');
  item.className = 'clue-item';
  item.innerHTML = `<span class="clue-num">Clue ${revealedClues}:</span>${clue}`;
  document.getElementById('clues-list').appendChild(item);

  if (revealedClues >= c.clues.length) {
    document.getElementById('reveal-clue-btn').disabled = true;
    document.getElementById('reveal-clue-btn').textContent = '✓ All clues revealed';
  }
});

// Make accusation
function makeAccusation(suspect) {
  if (caseAccused) return;
  caseAccused = true;

  // Disable all accuse buttons
  document.querySelectorAll('.accuse-btn').forEach(b => b.disabled = true);

  const c = CASES.find(x => x.id === activeCaseId);
  const correct = suspect === c.culprit;
  const verdict = document.getElementById('verdict');
  verdict.style.display = 'block';

  if (correct) {
    if (!solvedCases.includes(c.id)) {
      solvedCases.push(c.id);
      detXP += c.xp;
      localStorage.setItem('det_solved', JSON.stringify(solvedCases));
      localStorage.setItem('det_xp', detXP);
    }
    verdict.className = 'verdict correct-v';
    verdict.innerHTML = `
      <h3>🎉 Case Solved!</h3>
      <p><strong>${suspect}</strong> is the culprit. ${c.explanation}</p>
      <div class="verdict-xp">+${c.xp} Detective XP earned!</div>
      <button class="btn-gold" onclick="backToCases()">← Next Case</button>`;
  } else {
    verdict.className = 'verdict wrong-v';
    verdict.innerHTML = `
      <h3>❌ Wrong Accusation!</h3>
      <p>You accused <strong>${suspect}</strong>, but that's not the culprit. Review the clues carefully.</p>
      <p style="margin-top:.5rem;color:rgba(255,255,255,.4);font-size:.85rem;">Tip: Reveal all clues before making your accusation!</p>
      <button class="btn-gold" onclick="retryCase()">🔄 Try Again</button>`;
  }
  updateScoreDisplay();
}

function retryCase() {
  openCase(activeCaseId);
}

function backToCases() {
  document.getElementById('active-case').style.display = 'none';
  document.getElementById('case-select').style.display = 'block';
  renderCaseList();
}

document.getElementById('back-to-cases').addEventListener('click', backToCases);

// Init
renderCaseList();