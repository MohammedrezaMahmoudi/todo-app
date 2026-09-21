// ===== گرفتن عناصر =====
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const emptyMsg = document.getElementById("empty-msg");
const themeToggle = document.getElementById("theme-toggle");
const totalCount = document.getElementById("total-count");
const doneCount = document.getElementById("done-count");
const remainingCount = document.getElementById("remaining-count");

// ===== آرایه کارها (از LocalStorage) =====
let todos = JSON.parse(localStorage.getItem("todos")) || [];

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

  if (todos.length === 0) {
    emptyMsg.classList.remove("hidden");
    updateStats();
    return;
  }

  emptyMsg.classList.add("hidden");
  updateStats();

  todos.forEach((todo, index) => {
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
