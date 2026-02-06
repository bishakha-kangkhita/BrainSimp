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

// ─── Check Auth State & Show Welcome Message ────────────────────────
function checkAuthState() {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const authSection = document.querySelector('.auth-section');
  
  if (token && username) {
    // User is logged in - hide auth form and show welcome
    if (authSection) {
      authSection.innerHTML = `
        <div class="container" style="max-width: 600px; text-align: center;">
          <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">Welcome, ${username}! 👋</h2>
          <p style="font-size: 1.2rem; margin-bottom: 2rem; color: #a5b4fc;">Ready to challenge your brain?</p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="#" class="btn-primary" style="text-decoration: none; padding: 1rem 2rem; background: #667eea; color: white; border-radius: 50px; font-weight: 600;">Start Playing</a>
            <button id="logoutBtn" style="padding: 1rem 2rem; background: transparent; color: white; border: 2px solid white; border-radius: 50px; font-weight: 600; cursor: pointer;">Logout</button>
          </div>
        </div>
      `;
      
      // Add logout handler
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          location.reload();
        });
      }
    }
    
    // Update nav
    const loginBtn = document.querySelector('.btn-login');
    if (loginBtn) {
      loginBtn.textContent = 'Logout';
      loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        location.reload();
      });
    }
  }
}

// Run on page load
checkAuthState();

// ─── Unified Auth Form (Login + Signup toggle) ────────────────────────
const authForm = document.getElementById('authForm');
const authTitle = document.getElementById('authTitle');
const authSubtitle = document.getElementById('authSubtitle');
const authUsername = document.getElementById('authUsername');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const toggleLink = document.getElementById('toggleLink');
const authMessage = document.getElementById('authMessage');

// Only setup if elements exist (i.e., user is not logged in)
if (authForm) {
  let isLoginMode = true;  // start with login

  function switchMode() {
    isLoginMode = !isLoginMode;

    if (isLoginMode) {
      authTitle.textContent = "Welcome Back";
      authSubtitle.textContent = "Log in to start challenging your brain";
      authUsername.style.display = 'none';
      authUsername.removeAttribute('required'); // ✅ FIX: Remove required when hidden
      authSubmitBtn.textContent = "Log In";
      authSubmitBtn.style.background = '#667eea';
      toggleLink.textContent = "Don't have an account? Sign Up";
    } else {
      authTitle.textContent = "Join BrainSimp";
      authSubtitle.textContent = "Create your account and start training";
      authUsername.style.display = 'block';
      authUsername.setAttribute('required', 'required'); // ✅ FIX: Add required when visible
      authSubmitBtn.textContent = "Sign Up";
      authSubmitBtn.style.background = '#4caf50';
      toggleLink.textContent = "Already have an account? Log In";
    }

    authMessage.textContent = '';  // clear previous message
    authSubmitBtn.disabled = false; // re-enable button when switching modes
  }

  toggleLink.addEventListener('click', switchMode);
  
  // ✅ Initialize login mode properly
  authUsername.removeAttribute('required');

  // Form submit handler
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    const username = isLoginMode ? null : document.getElementById('authUsername').value.trim();

    // Disable submit button to prevent double-submission
    authSubmitBtn.disabled = true;
    authMessage.textContent = isLoginMode ? 'Logging in...' : 'Creating account...';
    authMessage.style.color = 'white';

    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
    const bodyData = isLoginMode 
      ? { email, password }
      : { username, email, password };

    console.log('Sending request to:', `http://localhost:3000${endpoint}`);
    console.log('Request body:', bodyData);

    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        authMessage.style.color = '#4caf50';
        authMessage.textContent = isLoginMode 
          ? `Welcome back, ${data.username}!`
          : `Account created! Welcome, ${data.username} 🎉`;

        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('username', data.username);
          
          // Reload page after 1.5 seconds to show welcome message
          setTimeout(() => {
            location.reload();
          }, 1500);
        }
      } else {
        authMessage.style.color = '#f44336';
        authMessage.textContent = data.error || 'Something went wrong';
        authSubmitBtn.disabled = false; // Re-enable on error
        console.error('Login/Signup failed:', data);
      }
    } catch (err) {
      authMessage.style.color = '#f44336';
      authMessage.textContent = 'Network error – is the server running on port 3000?';
      console.error('Network error:', err);
      authSubmitBtn.disabled = false; // Re-enable on error
    }
  });
}