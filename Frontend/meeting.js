const createMeetingForm = document.getElementById('create-meeting-form');
const meetingsList = document.getElementById('meetings-list');

////////////////// Create Meeting Function
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

//////////////////////////// Load Meetings Function
async function loadMeetings() {
  try {
    const response = await fetch('http://localhost:3000/meeting/bulk', {
      method: 'GET',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
    });

    const meetings = await response.json();

    if (!Array.isArray(meetings)) {
      console.error("Expected an array of meetings, but received:", meetings);
      alert("Error: Meetings data is not an array!");
      return;
    }

    meetingsList.innerHTML = '';
    meetings.forEach((meeting) => {
      console.log(`Rendering meeting with ID: ${meeting.id}`);
      const li = document.createElement('li');
      li.setAttribute('data-meeting-id', meeting.id); // Ensure each li has the correct meeting ID
      
      // Check for members (if any)
      getMeetingMembers(meeting.id).then(members => {
        li.innerHTML = `
          <span class="meeting-name">${meeting.meetingName}</span> - on 
          <span class="meeting-date">${meeting.date}</span> at 
          <span class="meeting-time">${meeting.time}</span>
          <ul>${members.join('')}</ul>
          <button onclick="editMeeting(${meeting.id})">Edit</button>
          <button onclick="deleteMeeting(${meeting.id})">Delete</button>
        `;
        
        meetingsList.appendChild(li);
      }).catch(err => {
        console.error('Error fetching members:', err);
        li.innerHTML = `
          <span class="meeting-name">${meeting.meetingName}</span> - on 
          <span class="meeting-date">${meeting.date}</span> at 
          <span class="meeting-time">${meeting.time}</span>
          <ul><li>Failed to load members</li></ul>
          <button onclick="editMeeting(${meeting.id})">Edit</button>
          <button onclick="deleteMeeting(${meeting.id})">Delete</button>
        `;
        meetingsList.appendChild(li);
      });
    });
  } catch (error) {
    console.error("Failed to load meetings:", error);
    alert("An error occurred while loading meetings. Please try again.");
  }
}


//////////////////// Fetch Meeting Members
async function getMeetingMembers(meetingId) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/meeting/meetMembers`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const members = await response.json();

    // Check if there is an error in the response
    if (members.error) {
      console.error('Error in response:', members.error);
      return [`<li>${members.error}</li>`]; // Show error message in the list
    }

    // Check if the response is an array (list of meeting members)
    if (Array.isArray(members)) {
      const meetingMembers = members.filter(member => member.meetingId === meetingId);
      
      return meetingMembers.map(member => `<li>Employee ID: ${member.employeeId}</li>`); // Change as per your need
    } else {
      console.error("Expected an array of meeting members, but received:", members);
      return ["<li>No members found</li>"];
    }
  } catch (error) {
    console.error("Error fetching meeting members:", error);
    return ["<li>Failed to load members</li>"];
  }
}

//////////////edit meeting
function editMeeting(meetingId) {
  console.log(`Attempting to edit meeting with ID: ${meetingId}`);
  
  const meeting = meetingsList.querySelector(`li[data-meeting-id='${meetingId}']`);

  if (!meeting) {
    console.error('Meeting element not found with ID:', meetingId);
    return; // Exit if the meeting is not found
  }

  const meetingName = meeting.querySelector('.meeting-name');
  const meetingDate = meeting.querySelector('.meeting-date');
  const meetingTime = meeting.querySelector('.meeting-time');

  // If any of the elements are not found, return early
  if (!meetingName || !meetingDate || !meetingTime) {
    console.error('Some meeting elements were not found.');
    return;
  }

  // Set the form fields with current meeting data
  document.getElementById('edit-meeting-name').value = meetingName.textContent;
  document.getElementById('edit-meeting-date').value = meetingDate.textContent;
  document.getElementById('edit-meeting-time').value = meetingTime.textContent;

  // Set the hidden field for ID
  document.getElementById('edit-meeting-id').value = meetingId;
  
  // Show the edit form
  document.getElementById('edit-meeting-container').style.display = 'block';
  document.querySelector('.meeting-list').style.display = 'none';
}

// Handle Edit Form Submission
document.getElementById('edit-meeting-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please sign in first!');
    return;
  }

  const meetingId = document.getElementById('edit-meeting-id').value;
  const meetingName = document.getElementById('edit-meeting-name').value;
  const date = document.getElementById('edit-meeting-date').value;
  const time = document.getElementById('edit-meeting-time').value;

  // Send PUT request to update the meeting
  const response = await fetch('http://localhost:3000/meeting', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify({ id: meetingId, meetingName, date, time }),
  });

  const result = await response.json();
  if (response.status === 200) {
    alert('Meeting Updated Successfully');
    loadMeetings(); // Reload the meeting list with updated data
    document.getElementById('edit-meeting-container').style.display = 'none'; // Hide the edit form
    document.querySelector('.meeting-list').style.display = 'block'; // Show the meeting list again
  } else {
    alert(`Error: ${result.error}`);
  }
});



//////////////////////// Delete Meeting Function
async function deleteMeeting(meetingId) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please sign in first!');
    return;
  }

  const response = await fetch(`http://localhost:3000/meeting/${meetingId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });

  const result = await response.json();
  if (response.status === 200) {
    alert('Meeting Deleted Successfully');
    loadMeetings(); // Reload the meeting list after deletion
  } else {
    alert(`Error: ${result.error}`);
  }
}




///////////////////////LOGOUT////////////////////////
document.getElementById('logoutButton').addEventListener('click', async function () {
  // Clear the JWT token cookie
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  window.location.href = 'manager.html';
});

// Initial call to load meetings
loadMeetings();
