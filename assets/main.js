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
// constants
const proxy = "https://api.allorigins.win/raw?url=";
const baseUrl = `${proxy}https://todos.routemisr.com/api/v1/todos`;
// state
let tasks = [];
let InputValue = "";
// Initialize app
let APIKey = localStorage.getItem("todoAPIKey");

// Initialize app
(async function init() {
  if (!APIKey) {
    APIKey = await getAPIKey();
    localStorage.setItem("todoAPIKey", APIKey);
  }
  await getAllTodos();
})();

//API Functions
async function getAPIKey() {
  const response = await fetch("https://todos.routemisr.com/api/v1/getApiKey");
  if (!response.ok) throw new Error("Failed to get API key");
  const data = await response.json();
  return data.apiKey;
}
async function getAllTodos() {
  let data = await fetch(`${baseUrl}/${APIKey}`);
  let result = await data.json();
  tasks = result.todos;
  DisplayTasks(tasks);
}
async function addTask() {
  let result = await fetch(baseUrl, {
    method: "post",
    body: JSON.stringify({
      title: InputValue,
      apiKey: APIKey,
    }),
    headers: { "content-type": "application/json" },
  });
  let message = await result.json();
  if (message.message == "success") {
    await getAllTodos();
  }
}
async function DeleteTask(id) {
  let result = await fetch("https://todos.routemisr.com/api/v1/todos", {
    method: "DELETE",
    body: JSON.stringify({
      todoId: id,
    }),
    headers: { "content-type": "application/json" },
  });
  console.log(await result.json());
}
async function markCompleted(id) {
  let result = await fetch("https://todos.routemisr.com/api/v1/todos", {
    method: "PUT",
    body: JSON.stringify({
      todoId: id,
    }),
    headers: { "content-type": "application/json" },
  });

  console.log(await result.json());
  await getAllTodos();
}
// UI Functions
function DisplayTasks(listOfTasks = tasks) {
  console.log(listOfTasks);
  countRemainingTasks(); // Update remaining tasks counter

  // Clear current displayed tasks
  const tasksOnScreen = container.querySelectorAll(".task");
  tasksOnScreen.forEach((task) => task.remove());

  // Render each task
  listOfTasks.forEach((task) => {
    // task container element
    let TaskElement = document.createElement("div");
    TaskElement.className = task.completed ? "task completed" : "task";
    TaskElement.setAttribute("data-id", `${task._id}`);

    // task check box element
    let checkBox = document.createElement("input");
    checkBox.classList.add("checkAtTask");
    checkBox.type = "checkbox";
    checkBox.checked = task.completed;

    // task title element
    let taskTitle = document.createElement("p");
    taskTitle.classList.add("taskTitle");
    taskTitle.textContent = task.title;

    // task delete icon element
    let DeleteIcon = document.createElement("img");
    DeleteIcon.classList.add("deleteIcon");
    DeleteIcon.src = "./images/icon-cross.svg";
    DeleteIcon.alt = "delete";

    //  add these elements in  task container
    TaskElement.append(checkBox, taskTitle, DeleteIcon);

    // add the task element in  box container
    container.insertBefore(TaskElement, control);
  });
}
function countRemainingTasks() {
  document.querySelector(".remainTasKsCount")?.remove();
  let listOfRemaining = tasks.filter((task) => task.completed === false);
  const remainTasKsCount = document.createElement("p");
  remainTasKsCount.classList.add("remainTasKsCount");
  remainTasKsCount.textContent = `${listOfRemaining.length} items left`;
  document
    .querySelector(".todoControl")
    .insertBefore(remainTasKsCount, document.querySelector(".filterTasks"));
}
function animateButton(btn) {
  btn.classList.add("btn-press");
  setTimeout(() => {
    btn.classList.remove("btn-press");
  }, 200);
}
function handleAddTask() {
  if (InputValue) {
    addTask();
    InputValue = "";
    AddInput.value = "";
    animateButton(addBtn);
  }
}
// Events Listener
AddInput.addEventListener("input", () => {
  InputValue = AddInput.value.trim();
});

document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleAddTask();
});

addBtn.addEventListener("click", handleAddTask);
container.addEventListener("click", async (e) => {
  const parent = e.target.closest(".task");
  const id = parent?.getAttribute("data-id");

  // Delete a task when clicking the delete icon
  if (e.target.classList.contains("deleteIcon")) {
    await DeleteTask(id);
    await getAllTodos();
  }
  // task completion when checkbox is clicked
  if (e.target.classList.contains("checkAtTask")) {
    const title = e.target.parentElement.querySelector(".taskTitle");
    await markCompleted(id);
    const task = tasks.find((t) => t._id === id);
    if (task && task.completed) {
      title.classList.add("checked");
    }
    countRemainingTasks();
  }
});
clearCompleted.addEventListener("click", async () => {
  const completed = tasks.filter((task) => task.completed == true);
  await Promise.all(completed.map((task) => DeleteTask(task._id)));
  await getAllTodos();
});
//filters
filterAll.addEventListener("click", () => DisplayTasks(tasks));
filterActive.addEventListener("click", () => {
  let allTasks = tasks.filter((task) => task.completed === false);
  DisplayTasks(allTasks);
});
filterCompleted.addEventListener("click", () => {
  let allTasks = tasks.filter((task) => task.completed === true);
  DisplayTasks(allTasks);
});
// themeToggle
themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("light-mode");
  const icon = document.getElementById("theme-icon");
  const topBg = document.getElementById("topBg");

  if (document.body.classList.contains("light-mode")) {
    icon.src = "./images/icon-moon.svg";
    topBg.classList.remove("bgDark");
    topBg.classList.add("bgLight");
    addBtn.classList.remove("btnDark");
    addBtn.classList.add("btnLight");
  } else {
    icon.src = "./images/icon-sun.svg";
    topBg.classList.remove("bgLight");
    topBg.classList.add("bgDark");
    addBtn.classList.add("btnDark");
    addBtn.classList.remove("btnLight");
  }
});
