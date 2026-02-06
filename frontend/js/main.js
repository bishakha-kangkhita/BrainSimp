// Dark Mode Toggle
const themeBtn = document.getElementById('themeBtn');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  body.classList.add('dark');
}

function toggleTheme() {
  body.classList.toggle('dark');
  localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
}

themeBtn?.addEventListener('click', toggleTheme);

// ─── Unified Auth Form ────────────────────────
const authForm = document.getElementById('authForm');
const authTitle = document.getElementById('authTitle');
const authSubtitle = document.getElementById('authSubtitle');
const authUsername = document.getElementById('authUsername');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const toggleLink = document.getElementById('toggleLink');
const authMessage = document.getElementById('authMessage');

let isLoginMode = true;

function initializeMode() {
  if (authUsername) {
    authUsername.style.display = 'none';
    authUsername.required = false;
  }
  if (authSubmitBtn) {
    authSubmitBtn.textContent = "Log In";
    authSubmitBtn.style.background = '#667eea';
  }
  if (toggleLink) {
    toggleLink.textContent = "Don't have an account? Sign Up";
  }
  if (authTitle) authTitle.textContent = "Welcome Back";
  if (authSubtitle) authSubtitle.textContent = "Log in to start challenging your brain";
  if (authMessage) authMessage.textContent = '';
}

initializeMode();

function switchMode() {
  isLoginMode = !isLoginMode;

  if (isLoginMode) {
    authTitle?.textContent = "Welcome Back";
    authSubtitle?.textContent = "Log in to start challenging your brain";
    if (authUsername) {
      authUsername.style.display = 'none';
      authUsername.required = false;
    }
    authSubmitBtn.textContent = "Log In";
    authSubmitBtn.style.background = '#667eea';
    toggleLink.textContent = "Don't have an account? Sign Up";
  } else {
    authTitle?.textContent = "Join BrainSimp";
    authSubtitle?.textContent = "Create your account and start training";
    if (authUsername) {
      authUsername.style.display = 'block';
      authUsername.required = true;
    }
    authSubmitBtn.textContent = "Sign Up";
    authSubmitBtn.style.background = '#4caf50';
    toggleLink.textContent = "Already have an account? Log In";
  }

  if (authMessage) authMessage.textContent = '';
}

toggleLink?.addEventListener('click', switchMode);

if (authForm) {
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('authEmail')?.value.trim();
    const password = document.getElementById('authPassword')?.value.trim() || '';
    const username = isLoginMode 
      ? null 
      : document.getElementById('authUsername')?.value.trim();

    if (!email || !password) {
      if (authMessage) {
        authMessage.style.color = '#f44336';
        authMessage.textContent = 'Email and password are required';
      }
      return;
    }

    console.log('Current mode:', isLoginMode ? 'Login' : 'Signup');
    console.log('Sending data:', { username, email, password });

    if (authMessage) {
      authMessage.textContent = isLoginMode ? 'Logging in...' : 'Creating account...';
      authMessage.style.color = 'white';
    }

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
        if (authMessage) {
          authMessage.style.color = '#4caf50';
          authMessage.textContent = isLoginMode 
            ? `Welcome back, ${data.username || 'user'}!`
            : `Account created! Welcome, ${data.username || 'new user'} 🎉`;
        }

        console.log('Success:', data);

        if (data.token) {
          localStorage.setItem('token', data.token);
          // Optional: redirect or reload
          // window.location.href = '/dashboard.html';
        }
      } else {
        if (authMessage) {
          authMessage.style.color = '#f44336';
          authMessage.textContent = data.error || data.details || 'Something went wrong';
        }
      }
    } catch (err) {
      console.error('Fetch error:', err);
      if (authMessage) {
        authMessage.style.color = '#f44336';
        authMessage.textContent = 'Network error – is the server running?';
      }
    }
  });
}