const createMeetingForm = document.getElementById('create-meeting-form');
const meetingsList = document.getElementById('meetings-list');

// Create Meeting Function
createMeetingForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please sign in first!');
    return;
  }

  const meetingName = document.getElementById('meeting-name').value;
  const date = document.getElementById('meeting-date').value;
  const time = document.getElementById('meeting-time').value;

  const response = await fetch('http://localhost:3000/meeting', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify({ meetingName, date, time }),
  });

  const result = await response.json();
  if (response.status === 200) {
    alert('Meeting Created Successfully');
    loadMeetings(); // Reload the meeting list
  } else {
    alert(`Error: ${result.error}`);
  }
});

// Edit Meeting Function
async function editMeeting(meetingId) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please sign in first!');
    return;
  }

  const meetingName = prompt("Enter new meeting name:");
  const date = prompt("Enter new meeting date (YYYY-MM-DD):");
  const time = prompt("Enter new meeting time (HH:MM):");

  if (meetingName && date && time) {
    const response = await fetch(`http://localhost:3000/meeting`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        id: meetingId,
        meetingName,
        date,
        time,
      }),
    });

    const result = await response.json();
    if (response.status === 200) {
      alert('Meeting Updated Successfully');
      loadMeetings(); // Reload the meeting list
    } else {
      alert(`Error: ${result.error}`);
    }
  } else {
    alert('Please fill all the fields');
  }
}

// Delete Meeting Function
async function deleteMeeting(meetingId) {
  try {
    const response = await fetch(`http://localhost:3000/meeting/${meetingId}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include'  // Include cookies with the request
    });

    if (response.ok) {
      alert('Meeting deleted successfully');
      loadMeetings(); // Refresh the meeting list after deletion
    } else {
      const data = await response.json();
      alert(data.error || 'Failed to delete meeting');
    }
  } catch (error) {
    console.error('Error deleting meeting:', error);
    alert('An error occurred while deleting the meeting');
  }
}
// Load Meetings Function
async function loadMeetings() {
  try {
    const response = await fetch('http://localhost:3000/meeting/bulk', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Log the response status and body
    console.log('Response Status:', response.status);
    const meetings = await response.json();

    if (!response.ok) {
      throw new Error(`Error fetching meetings: ${response.statusText}`);
    }

    console.log('Meetings Data:', meetings);

    meetingsList.innerHTML = '';
    meetings.forEach((meeting) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${meeting.meetingName}</span> - on ${meeting.date} at ${meeting.time}
        <button onclick="editMeeting(${meeting.id})">Edit</button>
        <button onclick="deleteMeeting(${meeting.id})">Delete</button>
      `;
      meetingsList.appendChild(li);
    });
  } catch (error) {
    console.error("Failed to load meetings:", error);
    alert("An error occurred while loading meetings. Please try again.");
  }
}


// Function to handle LOGOUT////////////////////////
document.getElementById('logoutButton').addEventListener('click', async function () {
  // Clear the JWT token cookie
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  window.location.href = 'manager.html';
});

// Initial call to load meetings
loadMeetings();
