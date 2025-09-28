function updateTaskCount() {
  var total = document.getElementById("taskList").children.length;
  var completed = document.querySelectorAll("#taskList .completed").length;
  document.getElementById("taskCount").textContent = "Total Tasks: " + total + ", Completed Tasks: " + completed;
}

function clearTasks() {
  if (confirm("Are you sure you want to clear all tasks?")) {
    document.getElementById("taskList").innerHTML = "";
    updateTaskCount();
  }
}

function filterTasks(type) {
  var tasks = document.getElementById("taskList").children;
 for (var i = 0; i < tasks.length; i++) {
    var li = tasks[i];
    var isCompleted = li.classList.contains("completed");

    if (type === "all") {
      li.style.display = "list-item"; 
    } else if (type === "completed" && isCompleted) {
      li.style.display = "list-item"; 
    } else if (type === "active" && !isCompleted) {
      li.style.display = "list-item"; 
    } else {
      li.style.display = "none"; 
    }
  }
}

function addTask(text = null, completed = false, timestamp = null, modified = false) {
  const inputValue = text !== null ? text : document.getElementById("taskInput").value;
  if (!inputValue.trim()) {
    alert("Please enter a task.");
    return;
  }

  const li = document.createElement("li");

// wrapper generale (sinistra + separatore + pulsanti)
const content = document.createElement("div");
content.className = "taskContent";

// sezione sinistra: testo + data
const leftSide = document.createElement("div");
leftSide.className = "taskLeft";

// testo
const span = document.createElement("span");
span.className = "taskText";
span.textContent = inputValue;
leftSide.appendChild(span);

// data
const small = document.createElement("small");
small.className = "taskDate";
const dateObj = timestamp ? new Date(timestamp) : new Date();
small.textContent = (modified ? "Modificato: " : "Creato: ") + dateObj.toLocaleString();
small.dataset.ts = dateObj.toISOString();
small.dataset.modified = modified ? "true" : "false";
leftSide.appendChild(small);

// sezione destra: pulsanti verticali
const buttonGroup = document.createElement("div");
buttonGroup.className = "buttonGroup";

// ✔️
const completeBtn = document.createElement("button");
completeBtn.className = "completeBtn";
completeBtn.type = "button";
completeBtn.textContent = "✔️";
completeBtn.addEventListener("click", function(e) {
  e.stopPropagation();
  li.classList.toggle("completed");
  saveTasks();
  updateTaskCount();
});
buttonGroup.appendChild(completeBtn);

// ✏️
const editBtn = document.createElement("button");
editBtn.className = "editBtn";
editBtn.type = "button";
editBtn.textContent = "✏️";
editBtn.addEventListener("click", function(e) {
  e.stopPropagation();
  const newText = prompt("Modifica task:", span.textContent);
  if (newText !== null && newText.trim()) {
    span.textContent = newText.trim();
    const now = new Date();
    small.textContent = "Modificato: " + now.toLocaleString();
    small.dataset.ts = now.toISOString();
    small.dataset.modified = "true";
    saveTasks();
  }
});
buttonGroup.appendChild(editBtn);

// ❌
const deleteBtn = document.createElement("button");
deleteBtn.className = "deleteBtn";
deleteBtn.type = "button";
deleteBtn.textContent = "❌";
deleteBtn.addEventListener("click", function(e) {
  e.stopPropagation();
  li.remove();
  saveTasks();
  updateTaskCount();
});
buttonGroup.appendChild(deleteBtn);

// 🔁 UNDO group
const undoGroup = document.createElement("div");
undoGroup.className = "undoGroup";

// ↩️ ANNULLA COMPLETAMENTO
const undoBtn = document.createElement("button");
undoBtn.className = "undoBtn";
undoBtn.type = "button";
undoBtn.textContent = "↩️";
undoBtn.title = "Annulla completamento";
undoBtn.addEventListener("click", function(e) {
  e.stopPropagation();
  li.classList.remove("completed");
  saveTasks();
  updateTaskCount();
});
undoGroup.appendChild(undoBtn);

// aggiungi al content
content.appendChild(leftSide);

// separatore verticale
const separator = document.createElement("div");
separator.className = "taskSeparator";
content.appendChild(separator);

// aggiungi pulsanti
content.appendChild(buttonGroup);
content.appendChild(undoGroup);

// append finali
li.appendChild(content);
document.getElementById("taskList").appendChild(li);

  if (!text) document.getElementById("taskInput").value = "";

  saveTasks();
  updateTaskCount();
}



document.getElementById("taskInput").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // evita comportamenti predefiniti
    addTask();
  }
});

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    tasks.push({
      text: li.querySelector(".taskText").textContent.trim(),
      completed: li.classList.contains("completed"),
      timestamp: li.querySelector("small").textContent.includes("Creato")
        ? new Date(li.querySelector("small").dataset.ts).toISOString()
        : new Date(li.querySelector("small").dataset.ts).toISOString(),
      modified: li.querySelector("small").textContent.includes("Modificato: ")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => {
    addTask(task.text, task.completed, task.timestamp, task.modified);
  });
}

window.onload = loadTasks;


