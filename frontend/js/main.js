// Dark Mode Toggle
const themeBtn = document.getElementById('themeBtn');
const body = document.body;

// Check saved preference or system preference
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  body.classList.add('dark');
}

// Toggle function
function toggleTheme() {
  if (body.classList.contains('dark')) {
    body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
}

// Click handler
themeBtn.addEventListener('click', toggleTheme);

// Optional: listen for system theme change
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem('theme')) {  // only if user hasn't manually chosen
    if (e.matches) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
  }
});

// ─── Unified Auth Form (Login + Signup toggle) ────────────────────────
const authForm = document.getElementById('authForm');
const authTitle = document.getElementById('authTitle');
const authSubtitle = document.getElementById('authSubtitle');
const authUsername = document.getElementById('authUsername');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const toggleLink = document.getElementById('toggleLink');
const authMessage = document.getElementById('authMessage');

let isLoginMode = true;  // start with login

function switchMode() {
  isLoginMode = !isLoginMode;

  if (isLoginMode) {
    authTitle.textContent = "Welcome Back";
    authSubtitle.textContent = "Log in to start challenging your brain";
    authUsername.style.display = 'none';
    authUsername.required = false;
    authSubmitBtn.textContent = "Log In";
    authSubmitBtn.style.background = '#667eea';
    toggleLink.textContent = "Don't have an account? Sign Up";
  } else {
    authTitle.textContent = "Join BrainSimp";
    authSubtitle.textContent = "Create your account and start training";
    authUsername.style.display = 'block';
    authUsername.required = true;
    authSubmitBtn.textContent = "Sign Up";
    authSubmitBtn.style.background = '#4caf50';
    toggleLink.textContent = "Already have an account? Log In";
  }

  authMessage.textContent = '';  // clear previous message
}

toggleLink.addEventListener('click', switchMode);

// Form submit handler
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  const username = isLoginMode ? null : document.getElementById('authUsername').value.trim();

  authMessage.textContent = isLoginMode ? 'Logging in...' : 'Creating account...';
  authMessage.style.color = 'white';

  const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
  const bodyData = isLoginMode 
    ? { email, password }
    : { username, email, password };

  try {
    const response = await fetch(`http://localhost:3000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData)
    });

    const data = await response.json();

    if (response.ok) {
      authMessage.style.color = '#4caf50';
      authMessage.textContent = isLoginMode 
        ? `Welcome back, ${data.username}!`
        : `Account created! Welcome, ${data.username} 🎉`;

      console.log('Success:', data);
      if (data.token) {
        localStorage.setItem('token', data.token);
        // You can redirect or update UI here later (show profile, hide auth section, etc.)
      }
    } else {
      authMessage.style.color = '#f44336';
      authMessage.textContent = data.error || 'Something went wrong';
    }
  } catch (err) {
    authMessage.style.color = '#f44336';
    authMessage.textContent = 'Network error – is the server running?';
    console.error(err);
  }
});