/* =====================================================
   To-Do List logic
   Tasks are saved in localStorage, so they stay after refresh.
   ===================================================== */

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");
const clearDoneBtn = document.getElementById("clearDone");

const STORAGE_KEY = "gautam-todo-tasks";

// Load saved tasks (or start with an empty list)
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

/* ---------- Helpers ---------- */

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Create all list items again from the tasks array
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach(function (task, index) {
    const item = document.createElement("li");
    if (task.done) item.classList.add("done");

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", function () {
      toggleTask(index);
    });

    // Task text (textContent keeps it safe from HTML injection)
    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;
    text.addEventListener("click", function () {
      toggleTask(index);
    });

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete";
    deleteBtn.setAttribute("aria-label", "Delete task");
    deleteBtn.innerHTML = '<i class="bi bi-trash3-fill"></i>';
    deleteBtn.addEventListener("click", function () {
      deleteTask(index);
    });

    item.append(checkbox, text, deleteBtn);
    taskList.appendChild(item);
  });

  updateCounter();
}

function updateCounter() {
  const total = tasks.length;
  const completed = tasks.filter(function (task) { return task.done; }).length;

  if (total === 0) {
    counter.textContent = "No tasks yet";
  } else {
    counter.textContent = completed + " of " + total + " tasks completed";
  }
}

/* ---------- Actions ---------- */

function addTask(text) {
  tasks.push({ text: text, done: false });
  saveTasks();
  renderTasks();
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter(function (task) { return !task.done; });
  saveTasks();
  renderTasks();
}

/* ---------- Events ---------- */

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = taskInput.value.trim();
  if (text === "") return;

  addTask(text);
  taskInput.value = "";
  taskInput.focus();
});

clearDoneBtn.addEventListener("click", clearCompleted);

// Show saved tasks when the page opens
renderTasks();
