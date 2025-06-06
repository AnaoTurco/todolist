const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("list");

function updateCounters() {
  const totalTasks = getTaskCount();
  const completedTasks = getCompletedCount();
  
  let counterDiv = document.getElementById('task-counters');
  if (!counterDiv) {
    counterDiv = document.createElement('div');
    counterDiv.id = 'task-counters';
    counterDiv.className = 'counters';
    document.body.insertBefore(counterDiv, taskForm);
  }
  
  counterDiv.innerHTML = `
    <div class="counter-item">
      <span class="counter-label">Tarefas criadas:</span>
      <span class="counter-value">${totalTasks}</span>
    </div>
    <div class="counter-item">
      <span class="counter-label">Tarefas concluídas:</span>
      <span class="counter-value">${completedTasks}</span>
    </div>
  `;
}

function saveTasks() {
  const tasks = [];
  const taskItems = document.querySelectorAll('.task-item');
  
  taskItems.forEach(item => {
    const title = item.querySelector('.title').textContent;
    const description = item.querySelector('.description').textContent;
    const createdAt = item.dataset.createdAt;
    const completed = item.classList.contains('completed');
    tasks.push({ title, description, createdAt, completed });
  });
  
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    const tasks = JSON.parse(savedTasks);
    tasks.forEach(task => {
      const taskElement = createTaskElement(task.title, task.description, task.createdAt, task.completed);
      taskList.appendChild(taskElement);
    });
  }
  updateCounters();
}

function getTaskCount() {
  const count = localStorage.getItem('taskCount') || '0';
  return parseInt(count);
}

function incrementTaskCount() {
  const currentCount = getTaskCount();
  const newCount = currentCount + 1;
  localStorage.setItem('taskCount', newCount.toString());
  return newCount;
}


function decrementTaskCount() {
  const currentCount = getTaskCount();
  const newCount = Math.max(0, currentCount - 1); 
  localStorage.setItem('taskCount', newCount.toString());
  return newCount;
}

function getCompletedCount() {
  const count = localStorage.getItem('completedCount') || '0';
  return parseInt(count);
}

function incrementCompletedCount() {
  const currentCount = getCompletedCount();
  const newCount = currentCount + 1;
  localStorage.setItem('completedCount', newCount.toString());
  return newCount;
}


function decrementCompletedCount() {
  const currentCount = getCompletedCount();
  const newCount = Math.max(0, currentCount - 1);
  localStorage.setItem('completedCount', newCount.toString());
  return newCount;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR');
}

function createTaskElement(title, description, createdAt = null, completed = false) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  
  if (completed) {
    taskItem.classList.add("completed");
  }

  const taskCreatedAt = createdAt || new Date().toISOString();
  taskItem.dataset.createdAt = taskCreatedAt;

  const taskContent = document.createElement("div");
  taskContent.classList.add("card");

  const taskDetails = document.createElement("div");
  taskDetails.innerHTML = `
    <h3 class="title">${title}</h3>
    <p class="description">${description}</p>
    <small class="created-at">Criada em: ${formatDate(taskCreatedAt)}</small>
  `;
  const taskActions = document.createElement("div");
  taskActions.classList.add("actions");

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Excluir";
  deleteButton.classList.add("delete-button");

  deleteButton.addEventListener("click", () => {
  
    const wasCompleted = taskItem.classList.contains("completed");
    
    taskItem.remove();
    
    
    decrementTaskCount();
    
    if (wasCompleted) {
      decrementCompletedCount();
    }
    
    saveTasks();
    updateCounters();
  });

  const editButton = document.createElement("button");
  editButton.textContent = "Editar";
  editButton.classList.add("edit-button");

  editButton.addEventListener("click", () => {
    const newTitle = prompt("Editar título:", title);
    const newDescription = prompt("Editar descrição:", description);

    if (newTitle && newDescription) {
      title = newTitle.trim();
      description = newDescription.trim();
      taskDetails.innerHTML = `
        <h3 class="title">${title}</h3>
        <p class="description">${description}</p>
        <small class="created-at">Criada em: ${formatDate(taskCreatedAt)}</small>
      `;
      saveTasks();
    } else {
      alert("Edição cancelada ou campos inválidos!");
    }
  });

  const completeButton = document.createElement("button");
  completeButton.textContent = completed ? "Reabrir" : "Concluir";
  completeButton.classList.add("complete-button");

  completeButton.addEventListener("click", () => {
    if (taskItem.classList.contains("completed")) {
      taskItem.classList.remove("completed");
      completeButton.textContent = "Concluir";
      decrementCompletedCount(); 
    } else {
      taskItem.classList.add("completed");
      completeButton.textContent = "Reabrir";
      incrementCompletedCount(); 
    }
    saveTasks();
    updateCounters();
  });

  taskContent.appendChild(taskDetails);
  taskContent.appendChild(taskActions);
  taskActions.appendChild(completeButton);
  taskActions.appendChild(editButton);
  taskActions.appendChild(deleteButton);

  taskItem.appendChild(taskContent);

  return taskItem;
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = taskForm.title.value.trim();
  const description = taskForm.description.value.trim();

  if (title && description) {
    const taskElement = createTaskElement(title, description);
    taskList.appendChild(taskElement);
    
    const totalTasks = incrementTaskCount();
    console.log(`Total de tarefas criadas: ${totalTasks}`);
    
    saveTasks();
    updateCounters();
    taskForm.reset();
  } else {
    alert("Por favor, preencha todos os campos!");
  }
});

document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  console.log(`Total de tarefas já criadas: ${getTaskCount()}`);
});
