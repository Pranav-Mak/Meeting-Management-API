const signupForm = document.getElementById('signup-form');
const signinForm = document.getElementById('signin-form');

// Sign Up Function
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const fullname = document.getElementById('fullname').value;
  const department = document.getElementById('department').value;

  const response = await fetch('http://localhost:3000/manager/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password, fullname, department }),
  });

  const result = await response.json();
  if (response.status === 200) {
    alert('Sign Up Successful');
  } else {
    alert(`Error: ${result.error}`);
  }
});

// Sign In Function
signinForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('signin-username').value;
  const password = document.getElementById('signin-password').value;

  const response = await fetch('http://localhost:3000/manager/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });

  const result = await response.json();
  if (response.status === 200) {
    localStorage.setItem('token', result.token);
    alert('Sign In Successful');
    window.location.href = 'meeting.html';  // Redirect to meeting page after successful sign-in
  } else {
    alert(`Error: ${result.error}`);
  }
});
