const meetingsList = document.getElementById('meetings-list');

// Function to load meetings
async function loadMeetings() {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token);
  if (!token) {
    alert('Please sign in first!');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/meeting/bulk', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Response Status:', response.status);
    if (response.status !== 200) {
      const errorDetails = await response.text();
      console.error('Error details:', errorDetails);
      alert('Failed to fetch meetings. Check the error details in console.');
    }

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('Error fetching meetings:', errorDetails);
      alert("Failed to load meetings: " + errorDetails);
      return;
    }
    
    const meetings = await response.json();
    console.log('Meetings Data:', meetings);

    if (meetings.length === 0) {
      meetingsList.innerHTML = '<li>No meetings available.</li>';
      return;
    }

    meetingsList.innerHTML = '';

    // Iterate over meetings
    meetings.forEach((meeting) => {
      const li = document.createElement('li');
      
      // Check if the meeting is already joined by the user
      const isJoined = meeting.isJoined ? '<span class="joined-tag">Joined</span>' : '';
      
      li.innerHTML = `
        <span>${meeting.meetingName}</span> - on ${meeting.date} at ${meeting.time}
        ${isJoined}
        <button class="join-button" data-meeting-id="${meeting.id}" ${isJoined ? 'disabled' : ''}>Join</button>
      `;

      meetingsList.appendChild(li);
    });

    // Add event listeners for the "Join" buttons
    document.querySelectorAll('.join-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const meetingId = e.target.getAttribute('data-meeting-id');
        joinMeeting(meetingId);
      });
    });

  } catch (error) {
    console.error("Failed to load meetings:", error);
    alert("An error occurred while loading meetings. Please try again.");
  }
}

// Function to join a meeting
async function joinMeeting(meetingId) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please sign in first!');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/meetingEmployee/join', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ meetingId }),
    });

    if (response.status === 200) {
      alert('Successfully joined the meeting!');
      loadMeetings();  // Refresh meetings after successful join
    } else {
      const errorDetails = await response.text();
      alert(`Failed to join the meeting: ${errorDetails}`);
    }
  } catch (error) {
    console.error('Error joining meeting:', error);
    alert('An error occurred while joining the meeting. Please try again.');
  }
}

loadMeetings();

// Handle LOGOUT
document.getElementById('logoutButton').addEventListener('click', async function () {
  // Clear the JWT token cookie
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  window.location.href = 'employee.html'; // Redirect to the sign-in page
});
