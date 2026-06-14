// Timer State
const TIMER_CONFIG = {
  work: { minutes: 25, label: "Time to focus", accent: "#ff6b6b", glow: "rgba(255, 107, 107, 0.35)" },
  shortBreak: { minutes: 5, label: "Take a short break", accent: "#4dadf7", glow: "rgba(77, 173, 247, 0.35)" },
  longBreak: { minutes: 15, label: "Take a long break", accent: "#51cf66", glow: "rgba(81, 207, 102, 0.35)" }
};

let currentMode = 'work';
let timeRemaining = TIMER_CONFIG.work.minutes * 60;
let totalDuration = TIMER_CONFIG.work.minutes * 60;
let timerId = null;
let isRunning = false;

// DOM Elements
const minutesDisplay = document.getElementById('timerMinutes');
const secondsDisplay = document.getElementById('timerSeconds');
const statusDisplay = document.getElementById('currentStatus');
const btnPlayPause = document.getElementById('btnPlayPause');
const btnReset = document.getElementById('btnReset');
const iconPlay = btnPlayPause.querySelector('.icon-play');
const iconPause = btnPlayPause.querySelector('.icon-pause');
const modesNav = document.getElementById('modesNav');
const modeButtons = document.querySelectorAll('.mode-btn');

// Progress Ring Configuration
const circle = document.querySelector('.progress-ring__circle');
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = 0;

// Tasks State
let tasks = [];
let activeTaskId = null;

// Task DOM Elements
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const taskCounter = document.getElementById('taskCounter');
const activeTaskText = document.getElementById('activeTaskText');
const activeTaskContainer = document.querySelector('.active-task-container');

// Sound synthesis using Web Audio API
function playCompletionSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // First Note
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
    gain1.gain.setValueAtTime(0, audioCtx.currentTime);
    gain1.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start();
    osc1.stop(audioCtx.currentTime + 0.4);

    // Second Note (chord/harmony shortly after)
    setTimeout(() => {
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
      gain2.gain.setValueAtTime(0, audioCtx.currentTime);
      gain2.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.05);
      gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start();
      osc2.stop(audioCtx.currentTime + 0.5);
    }, 150);

    // Third Note (high chime resolution)
    setTimeout(() => {
      const osc3 = audioCtx.createOscillator();
      const gain3 = audioCtx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(783.99, audioCtx.currentTime); // G5
      gain3.gain.setValueAtTime(0, audioCtx.currentTime);
      gain3.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.05);
      gain3.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.7);
      osc3.connect(gain3);
      gain3.connect(audioCtx.destination);
      osc3.start();
      osc3.stop(audioCtx.currentTime + 0.7);
    }, 300);

  } catch (error) {
    console.error("Audio context failed to initialize: ", error);
  }
}

// Update Timer Display & Tab Title
function updateDisplay() {
  const mins = Math.floor(timeRemaining / 60);
  const secs = timeRemaining % 60;
  
  const paddedMins = String(mins).padStart(2, '0');
  const paddedSecs = String(secs).padStart(2, '0');
  
  minutesDisplay.textContent = paddedMins;
  secondsDisplay.textContent = paddedSecs;
  
  // Tab title update
  const modeTitle = currentMode === 'work' ? 'Focus' : 'Break';
  document.title = `${paddedMins}:${paddedSecs} — ${modeTitle} (ZenFocus)`;

  // Progress circle update
  const percent = (timeRemaining / totalDuration) * 100;
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}

// Start Timer
function startTimer() {
  if (isRunning) return;
  
  isRunning = true;
  iconPlay.classList.add('hidden');
  iconPause.classList.remove('hidden');
  
  timerId = setInterval(() => {
    if (timeRemaining > 0) {
      timeRemaining--;
      updateDisplay();
    } else {
      clearInterval(timerId);
      timerId = null;
      isRunning = false;
      playCompletionSound();
      
      // Auto switch or alert user
      if (currentMode === 'work') {
        alert("Well done! Focus session completed. Take a break!");
        switchMode('shortBreak');
      } else {
        alert("Break is over! Ready to get back to work?");
        switchMode('work');
      }
    }
  }, 1000);
}

// Pause Timer
function pauseTimer() {
  if (!isRunning) return;
  
  isRunning = false;
  clearInterval(timerId);
  timerId = null;
  
  iconPause.classList.add('hidden');
  iconPlay.classList.remove('hidden');
}

// Reset Timer
function resetTimer() {
  pauseTimer();
  timeRemaining = totalDuration;
  updateDisplay();
}

// Switch Session Modes
function switchMode(mode) {
  currentMode = mode;
  
  // Update nav UI
  modeButtons.forEach(btn => {
    if (btn.getAttribute('data-mode') === mode) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const config = TIMER_CONFIG[mode];
  totalDuration = config.minutes * 60;
  timeRemaining = totalDuration;
  statusDisplay.textContent = config.label;

  // Swap Accent Colors
  document.documentElement.style.setProperty('--accent-color', config.accent);
  document.documentElement.style.setProperty('--accent-glow', config.glow);

  resetTimer();
}

// Initialize Timer Events
btnPlayPause.addEventListener('click', () => {
  if (isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
});

btnReset.addEventListener('click', resetTimer);

modesNav.addEventListener('click', (e) => {
  const clickedBtn = e.target.closest('.mode-btn');
  if (!clickedBtn) return;
  switchMode(clickedBtn.getAttribute('data-mode'));
});

// Tasks Manager Logic
function loadTasks() {
  const storedTasks = localStorage.getItem('zenfocus_tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  }
  
  const storedActiveTask = localStorage.getItem('zenfocus_active_task_id');
  if (storedActiveTask) {
    activeTaskId = parseInt(storedActiveTask);
  }
  
  renderTasks();
}

function saveTasks() {
  localStorage.setItem('zenfocus_tasks', JSON.stringify(tasks));
  if (activeTaskId) {
    localStorage.setItem('zenfocus_active_task_id', activeTaskId);
  } else {
    localStorage.removeItem('zenfocus_active_task_id');
  }
}

function renderTasks() {
  taskList.innerHTML = '';
  
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''} ${task.id === activeTaskId ? 'active' : ''}`;
    li.dataset.id = task.id;
    
    li.innerHTML = `
      <div class="task-item-content">
        <div class="task-checkbox">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <span class="task-title">${escapeHTML(task.title)}</span>
      </div>
      <button class="delete-task-btn" aria-label="Delete Task">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      </button>
    `;
    
    taskList.appendChild(li);
  });
  
  updateTaskSummary();
}

function updateTaskSummary() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  taskCounter.textContent = `${completed} / ${total}`;
  
  const currentActiveTask = tasks.find(t => t.id === activeTaskId);
  if (currentActiveTask && !currentActiveTask.completed) {
    activeTaskText.textContent = currentActiveTask.title;
    activeTaskContainer.classList.add('active-focus');
  } else {
    activeTaskId = null;
    activeTaskText.textContent = "Select a task below";
    activeTaskContainer.classList.remove('active-focus');
    
    // Auto-select first uncompleted task if available and none active
    const firstUncompleted = tasks.find(t => !t.completed);
    if (firstUncompleted) {
      activeTaskId = firstUncompleted.id;
      activeTaskText.textContent = firstUncompleted.title;
      activeTaskContainer.classList.add('active-focus');
      // Highlight the updated first active task
      const activeEl = taskList.querySelector(`[data-id="${activeTaskId}"]`);
      if (activeEl) activeEl.classList.add('active');
    }
  }
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.innerText = str;
  return div.innerHTML;
}

// Add Task
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;
  
  const newTask = {
    id: Date.now(),
    title: title,
    completed: false
  };
  
  tasks.push(newTask);
  
  // Set as active if no active task exists
  if (!activeTaskId) {
    activeTaskId = newTask.id;
  }
  
  taskInput.value = '';
  saveTasks();
  renderTasks();
});

// Click Interactions on Task List (Check, Delete, Select Focus)
taskList.addEventListener('click', (e) => {
  const li = e.target.closest('.task-item');
  if (!li) return;
  
  const id = parseInt(li.dataset.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) return;
  
  // 1. Delete button clicked
  if (e.target.closest('.delete-task-btn')) {
    e.stopPropagation();
    tasks.splice(taskIndex, 1);
    if (activeTaskId === id) {
      activeTaskId = null;
    }
    saveTasks();
    renderTasks();
    return;
  }
  
  // 2. Checkbox clicked
  if (e.target.closest('.task-checkbox')) {
    e.stopPropagation();
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    saveTasks();
    renderTasks();
    return;
  }
  
  // 3. Clicked on task item body -> Set Active focus
  if (!tasks[taskIndex].completed) {
    activeTaskId = id;
    saveTasks();
    renderTasks();
  }
});

// Init on Load
window.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  updateDisplay();
});
