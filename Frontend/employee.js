const signupForm = document.getElementById('signup-form');
const signinForm = document.getElementById('signin-form');
const signupContainer = document.getElementById('signup-container');
const signinContainer = document.getElementById('signin-container');
const meetingListContainer = document.getElementById('meeting-list-container');

// Sign Up Function
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const fullname = document.getElementById('fullname').value;
  const department = document.getElementById('department').value;

  const response = await fetch('http://localhost:3000/employee/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password, fullname, department }),
  });

  const result = await response.json();
  if (response.status === 200) {
    alert('Sign Up Successful');
    signupContainer.style.display = 'none'; // Hide Sign Up Form
    signinContainer.style.display = 'block'; // Show Sign In Form
  } else {
    alert(`Error: ${result.error}`);
  }
});

// Sign In Function
signinForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('signin-username').value;
  const password = document.getElementById('signin-password').value;

  const response = await fetch('http://localhost:3000/employee/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });

  const result = await response.json();
  if (response.status === 200) {
    // Save JWT Token in cookies
    document.cookie = `token=${result.token}; path=/;`;  // This stores the token in cookies
    console.log('JWT Token saved in cookies:', document.cookie);
    alert('Sign In Successful');
    window.location.href = 'meetingemployee.html';  // Redirect to the meeting page
  } else {
    alert(`Error: ${result.error}`);
  }lert(`Error: ${result.error}`);
  });


