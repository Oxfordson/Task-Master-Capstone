document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = '/tasks'; // Adjust URL for your backend API
    const taskInput = document.getElementById('task-input');
    const taskDescription = document.getElementById('task-description');
    const taskDueDate = document.getElementById('task-due-date');
    const taskList = document.getElementById('task-list');
    const fetchTasksBtn = document.getElementById('fetch-tasks');
    const addTaskBtn = document.getElementById('add-task-btn');
  
    // Fetch and display tasks
    async function fetchTasks() {
      try {
        const response = await fetch(apiUrl);
        const tasks = await response.json();
        taskList.innerHTML = ''; // Clear the list before rendering new tasks
  
        tasks.forEach(task => {
          const li = document.createElement('li');
          li.className = task.completed ? 'completed' : '';
  
          const timeLeft = getTimeLeft(task.dueDate);
  
          li.innerHTML = `
            <div class="task-info">
              <strong>Title:</strong> <span class="task-title" contenteditable="false">${task.title}</span><br>
              <strong>Description:</strong> <span class="task-description" contenteditable="false">${task.description}</span><br>
              <strong>Due Date:</strong> <input type="datetime-local" class="task-due-date" value="${formatDateTime(task.dueDate)}" disabled/><br>
              <strong>Countdown:</strong> <span class="countdown">${timeLeft}</span>
            </div>
            <button class="edit-btn" data-id="${task._id}">Edit</button>
            <button class="update-btn" data-id="${task._id}" disabled>Update</button>
            <button class="delete-btn" data-id="${task._id}">Delete</button>
          `;
          taskList.appendChild(li);
  
          // Add event listeners for buttons
          document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', enableEditing);
          });
          document.querySelectorAll('.update-btn').forEach(button => {
            button.addEventListener('click', saveTask);
          });
          document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', deleteTask);
          });
        });
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }
  
    // Add a new task
    async function addTask(e) {
      e.preventDefault();
      const taskTitle = taskInput.value.trim();
      const taskDesc = taskDescription.value.trim();
      const taskDue = taskDueDate.value.trim();
  
      if (taskTitle && taskDesc && taskDue) {
        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: taskTitle, description: taskDesc, dueDate: taskDue, completed: false })
          });
  
          const newTask = await response.json();
          if (response.ok) {
            taskInput.value = ''; // Clear input fields
            taskDescription.value = '';
            taskDueDate.value = '';
            alert('Task added successfully!');
            fetchTasks(); // Refresh task list
          } else {
            alert(newTask.error || 'Failed to add task');
          }
        } catch (error) {
          console.error('Error adding task:', error);
        }
      } else {
        alert('Please fill in all fields.');
      }
    }
  
    // // Enable editing mode for a task
    // function enableEditing(e) {
    //   const li = e.target.closest('li');
    //   li.querySelectorAll('.task-title, .task-description').forEach(el => el.contentEditable = 'true');
    //   li.querySelector('.task-due-date').disabled = false;
    //   li.querySelector('.update-btn').disabled = false;
    // }
  
    // // Save task after edit (only update fields that user has changed)
    // async function saveTask(e) {
    //   const taskId = e.target.getAttribute('data-id');
    //   const li = e.target.closest('li');
      
    //   const updatedTitle = li.querySelector('.task-title').textContent.trim();
    //   const updatedDescription = li.querySelector('.task-description').textContent.trim();
    //   const updatedDueDate = li.querySelector('.task-due-date').value.trim();
  
    //   if (updatedTitle && updatedDescription && updatedDueDate) {
    //     try {
    //       const response = await fetch(`${apiUrl}/${taskId}`, {
    //         method: 'PATCH',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({
    //           title: updatedTitle,
    //           description: updatedDescription,
    //           dueDate: updatedDueDate
    //         })
    //       });
  
    //       const updatedTask = await response.json();
    //       if (response.ok) {
    //         // Refresh task list
    //         fetchTasks();
  
    //         // Update countdown with the new due date
    //         const countdownElement = li.querySelector('.countdown');
    //         clearInterval(li.taskInterval); // Clear the previous interval
    //         li.taskInterval = updateCountdown(countdownElement, updatedDueDate); // Start the new countdown timer
    //       } else {
    //         alert(updatedTask.error || 'Failed to update task');
    //       }
    //     } catch (error) {
    //       console.error('Error updating task:', error);
    //     }
    //   } else {
    //     alert('All fields are required to update a task.');
    //   }
    // }
  
  
    // Enable editing for a task
  function enableEditing(e) {
    const li = e.target.closest('li');
    li.querySelectorAll('.task-title, .task-description').forEach(el => el.contentEditable = 'true');
    li.querySelector('.task-due-date').disabled = false; // Enable due date input
    li.querySelector('.update-btn').disabled = false; // Enable update button
  }
  
  // Save edited task
  async function saveTask(e) {
    const taskId = e.target.getAttribute('data-id');
    const li = e.target.closest('li');
    
    const updatedTitle = li.querySelector('.task-title').textContent.trim();
    const updatedDescription = li.querySelector('.task-description').textContent.trim();
    const updatedDueDate = li.querySelector('.task-due-date').value.trim(); // Keep the exact user input
    
    // Ensure only user-modified fields are updated
    if (updatedTitle && updatedDescription) {
      try {
        const response = await fetch(`${apiUrl}/${taskId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: updatedTitle,
            description: updatedDescription,
            dueDate: updatedDueDate // Submit the exact user input (no conversion)
          })
        });
  
        const updatedTask = await response.json();
        if (response.ok) {
          // Fetch tasks and refresh UI
          fetchTasks();
        } else {
          alert(updatedTask.error || 'Failed to update task');
        }
      } catch (error) {
        console.error('Error updating task:', error);
      }
    } else {
      alert('All fields are required to update a task.');
    }
  }
  
  
    // Delete a task
    async function deleteTask(e) {
      const taskId = e.target.getAttribute('data-id');
      const isConfirmed = confirm('Are you sure you want to delete this task?');
  
      if (isConfirmed) {
        try {
          const response = await fetch(`${apiUrl}/${taskId}`, {
            method: 'DELETE',
          });
  
          const result = await response.json();
          if (response.ok) {
            const li = e.target.closest('li');
            li.remove(); // Remove task from the UI
          } else {
            alert(result.error || 'Failed to delete task');
          }
        } catch (error) {
          console.error('Error deleting task:', error);
        }
      }
    }
  
    // Format date and time to YYYY-MM-DDTHH:MM (for displaying in <input type="datetime-local">)
    function formatDateTime(dateStr) {
      const date = new Date(dateStr);
      return date.toISOString().slice(0, 16); // Format to YYYY-MM-DDTHH:MM
    }
  
    // Calculate and return time left for countdown
    function getTimeLeft(dueDate) {
      const now = new Date();
      const due = new Date(dueDate);
      const diff = due - now;
  
      if (diff <= 0) {
        return 'Time’s up!';
      }
  
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
  
    // Continuously update countdown timer
    function updateCountdown(countdownElement, dueDate) {
      const interval = setInterval(() => {
        const timeLeft = getTimeLeft(dueDate);
        countdownElement.textContent = timeLeft;
  
        if (timeLeft === 'Time’s up!') {
          clearInterval(interval); // Stop the countdown when time is up
        }
      }, 1000);
  
      return interval;
    }
  
    // Event listeners
    fetchTasksBtn.addEventListener('click', fetchTasks);
  
    // Call fetchTasks on page load
    fetchTasks();
  
    addTaskBtn.addEventListener('click', addTask);
  });
  