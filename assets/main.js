//DOM Elements
const AddInput = document.querySelector(".addTask");
const control = document.querySelector(".todoControl");
const container = document.querySelector(".boxContainer");
const clearCompleted = document.querySelector(".clearCompleted");
const filterAll = document.querySelector(".filterAll");
const filterActive = document.querySelector(".filterActive");
const filterCompleted = document.querySelector(".filterCompleted");
const themeToggle = document.querySelector(".toggleTheme");
const addBtn = document.querySelector(".addBtn");

// state
let tasks = [];
let InputValue = "";

// Initialize app
(function init() {
  loadTasks();
  DisplayTasks(tasks);
})();

// ── Storage helpers ──────────────────────────────────────────────
function loadTasks() {
  tasks = JSON.parse(localStorage.getItem("todoTasks") || "[]");
}

function saveTasks() {
  localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ── CRUD ─────────────────────────────────────────────────────────
function addTask() {
  if (!InputValue) return;
  tasks.push({ _id: generateId(), title: InputValue, completed: false });
  saveTasks();
  DisplayTasks(tasks);
}

function DeleteTask(id) {
  tasks = tasks.filter((t) => t._id !== id);
  saveTasks();
}

function markCompleted(id) {
  const task = tasks.find((t) => t._id === id);
  if (task) task.completed = !task.completed;
  saveTasks();
}

// ── UI Functions ─────────────────────────────────────────────────
function DisplayTasks(listOfTasks = tasks) {
  countRemainingTasks();

  // Remove currently displayed task elements
  container.querySelectorAll(".task").forEach((el) => el.remove());

  listOfTasks.forEach((task) => {
    let TaskElement = document.createElement("div");
    TaskElement.className = task.completed ? "task completed" : "task";
    TaskElement.setAttribute("data-id", task._id);

    let checkBox = document.createElement("input");
    checkBox.classList.add("checkAtTask");
    checkBox.type = "checkbox";
    checkBox.checked = task.completed;

    let taskTitle = document.createElement("p");
    taskTitle.classList.add("taskTitle");
    if (task.completed) taskTitle.classList.add("checked");
    taskTitle.textContent = task.title;

    let DeleteIcon = document.createElement("img");
    DeleteIcon.classList.add("deleteIcon");
    DeleteIcon.src = "./images/icon-cross.svg";
    DeleteIcon.alt = "delete";

    TaskElement.append(checkBox, taskTitle, DeleteIcon);
    container.insertBefore(TaskElement, control);
  });
}

function countRemainingTasks() {
  document.querySelector(".remainTasKsCount")?.remove();
  const remaining = tasks.filter((t) => !t.completed).length;
  const remainEl = document.createElement("p");
  remainEl.classList.add("remainTasKsCount");
  remainEl.textContent = `${remaining} items left`;
  document
    .querySelector(".todoControl")
    .insertBefore(remainEl, document.querySelector(".filterTasks"));
}

function animateButton(btn) {
  btn.classList.add("btn-press");
  setTimeout(() => btn.classList.remove("btn-press"), 200);
}

function handleAddTask() {
  if (InputValue) {
    addTask();
    InputValue = "";
    AddInput.value = "";
    animateButton(addBtn);
  }
}

// ── Event Listeners ──────────────────────────────────────────────
AddInput.addEventListener("input", () => {
  InputValue = AddInput.value.trim();
});

document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleAddTask();
});

addBtn.addEventListener("click", handleAddTask);

container.addEventListener("click", (e) => {
  const parent = e.target.closest(".task");
  if (!parent) return;
  const id = parent.getAttribute("data-id");

  if (e.target.classList.contains("deleteIcon")) {
    DeleteTask(id);
    DisplayTasks(tasks);
  }

  if (e.target.classList.contains("checkAtTask")) {
    markCompleted(id);
    DisplayTasks(tasks);
  }
});

clearCompleted.addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  DisplayTasks(tasks);
});

// ── Filters ──────────────────────────────────────────────────────
filterAll.addEventListener("click", () => {
  setActiveFilter(filterAll);
  DisplayTasks(tasks);
});

filterActive.addEventListener("click", () => {
  setActiveFilter(filterActive);
  DisplayTasks(tasks.filter((t) => !t.completed));
});

filterCompleted.addEventListener("click", () => {
  setActiveFilter(filterCompleted);
  DisplayTasks(tasks.filter((t) => t.completed));
});

function setActiveFilter(activeEl) {
  [filterAll, filterActive, filterCompleted].forEach((el) =>
    el.classList.remove("active-filter")
  );
  activeEl.classList.add("active-filter");
}

// ── Theme Toggle ─────────────────────────────────────────────────
themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("light-mode");
  const icon = document.getElementById("theme-icon");
  const topBg = document.getElementById("topBg");

  if (document.body.classList.contains("light-mode")) {
    icon.src = "./images/icon-moon.svg";
    topBg.classList.replace("bgDark", "bgLight");
    addBtn.classList.replace("btnDark", "btnLight");
  } else {
    icon.src = "./images/icon-sun.svg";
    topBg.classList.replace("bgLight", "bgDark");
    addBtn.classList.replace("btnLight", "btnDark");
  }
});
