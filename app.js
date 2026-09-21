// ===== گرفتن عناصر =====
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const emptyMsg = document.getElementById("empty-msg");
const themeToggle = document.getElementById("theme-toggle");
const totalCount = document.getElementById("total-count");
const doneCount = document.getElementById("done-count");
const remainingCount = document.getElementById("remaining-count");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearAllBtn = document.getElementById("clear-all");

// ===== آرایه کارها (از LocalStorage) =====
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

// ===== حالت تاریک =====
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    themeToggle.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    themeToggle.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
});

// ===== فیلتر =====
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;

    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    renderTodos();
  });
});

// ===== پاک کردن همه =====
clearAllBtn.addEventListener("click", () => {
  if (todos.length === 0) return;

  const confirmDelete = confirm("مطمئنی می‌خوای همه کارها رو پاک کنی؟");

  if (confirmDelete) {
    todos = [];
    saveTodos();
    renderTodos();
  }
});

// ===== به‌روزرسانی شمارنده =====
function updateStats() {
  const total = todos.length;
  const done = todos.filter((t) => t.done).length;
  const remaining = total - done;

  totalCount.textContent = total;
  doneCount.textContent = done;
  remainingCount.textContent = remaining;
}

// ===== نمایش کارها =====
function renderTodos() {
  list.innerHTML = "";

  let filteredTodos = todos;

  if (currentFilter === "active") {
    filteredTodos = todos.filter((t) => !t.done);
  } else if (currentFilter === "done") {
    filteredTodos = todos.filter((t) => t.done);
  }

  if (filteredTodos.length === 0) {
    emptyMsg.classList.remove("hidden");
    updateStats();
    return;
  }

  emptyMsg.classList.add("hidden");
  updateStats();

  filteredTodos.forEach((todo) => {
    const index = todos.indexOf(todo);

    const li = document.createElement("li");
    li.className = "todo-item";
    if (todo.done) li.classList.add("done");

    const span = document.createElement("span");
    span.textContent = todo.text;
    span.addEventListener("click", () => toggleTodo(index));

    const btn = document.createElement("button");
    btn.textContent = "حذف";
    btn.addEventListener("click", () => deleteTodo(index));

    li.appendChild(span);
    li.appendChild(btn);
    list.appendChild(li);
  });
}

// ===== اضافه کردن کار =====
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  todos.push({ text, done: false });
  saveTodos();
  renderTodos();
  input.value = "";
});

// ===== تیک زدن =====
function toggleTodo(index) {
  todos[index].done = !todos[index].done;
  saveTodos();
  renderTodos();
}

// ===== حذف =====
function deleteTodo(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}

// ===== ذخیره در LocalStorage =====
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// ===== نمایش اولیه =====
renderTodos();

// ===== همگام‌سازی بین تب‌ها =====
window.addEventListener("storage", (e) => {
  if (e.key === "todos") {
    todos = JSON.parse(e.newValue) || [];
    renderTodos();
  }
});
