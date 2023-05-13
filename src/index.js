import './index.css';
import { markAsCompleted, markAsIncomplete } from './status.js';

const taskList = document.getElementById('task-list');
const newTask = document.getElementById('new-task');
const form = document.querySelector('form');

const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

let editTaskDescription;
let deleteTask;

const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const createTaskLists = (task) => {
  const deleteButton = document.createElement('button');
  const listItemElement = document.createElement('li');
  const iconElement = document.createElement('i');
  const descriptionElement = document.createElement('span');

  const checkboxElement = document.createElement('input');
  checkboxElement.type = 'checkbox';
  checkboxElement.checked = task.completed;

  checkboxElement.addEventListener('change', () => {
    if (checkboxElement.checked) {
      markAsCompleted(task);
    } else {
      markAsIncomplete(task);
    }
    saveTasks();

    // Check if the checkbox is now checked
    if (checkboxElement.checked) {
      deleteButton.style.display = 'block';
      iconElement.style.display = 'none';
      listItemElement.style.display = 'flex';
      listItemElement.style.justifyContent = 'flex-start';
      deleteButton.style.marginLeft = 'auto';
    } else {
      deleteButton.style.display = 'none';
      iconElement.style.display = 'block';
      descriptionElement.style.color = '#999';
    }
  });

  descriptionElement.textContent = task.description;

  descriptionElement.addEventListener('click', () => {
    editTaskDescription(task);
  });

  listItemElement.appendChild(checkboxElement);
  listItemElement.appendChild(descriptionElement);

  iconElement.classList.add('uil', 'uil-ellipsis-v');
  iconElement.addEventListener('click', () => {
    editTaskDescription(task);
  });
  listItemElement.appendChild(iconElement);

  deleteButton.innerHTML = '<i class="uil uil-trash"></i>';
  deleteButton.classList.add('delete-button');
  deleteButton.style.display = 'none';

  deleteButton.addEventListener('click', () => {
    deleteTask(task.index);
  });

  listItemElement.appendChild(deleteButton);

  return listItemElement;
};

const updateTaskIndexes = () => {
  tasks.forEach((task, index) => {
    task.index = index;
  });
};

const renderTaskList = () => {
  if (taskList !== null) {
    taskList.innerHTML = '';

    tasks
      .sort((task1, task2) => task1.index - task2.index)
      .forEach((task) => {
        const listItemElement = createTaskLists(task);
        taskList.appendChild(listItemElement);
      });
  }
};

deleteTask = (index) => {
  tasks.splice(index, 1);
  tasks.forEach((task, i) => {
    task.index = i;
  });
  updateTaskIndexes();
  saveTasks();
  renderTaskList();
};

editTaskDescription = (task, taskList) => {
  const inputElement = document.createElement('input');
  inputElement.type = 'text';
  inputElement.value = task.description;
  inputElement.classList.add('edit-input');

  inputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      task.description = inputElement.value.trim();
      saveTasks();
      renderTaskList();
    } else if (event.key === 'Escape') {
      renderTaskList();
    }
  });

  const listItemElement = taskList.children[task.index];
  listItemElement.replaceChild(inputElement, listItemElement.children[1]);
  inputElement.select();
};

function addNewTask(description) {
  const taskIndex = tasks.length;

  const task = { description, completed: false, index: taskIndex };
  tasks.push(task);
  saveTasks();

  if (taskList) {
    const listItemElement = createTaskLists(task);
    taskList.appendChild(listItemElement);
  }
}

// Clearing completed
const clearCompletedTasks = () => {
  tasks.forEach((task, index) => {
    if (task.completed) {
      tasks.splice(index, 1);
      index -= 1;
    }
  });
  updateTaskIndexes();
  saveTasks();
  renderTaskList();
};

const clearCompleted = document.getElementById('clear-completed');

if (clearCompleted) {
  clearCompleted.addEventListener('click', (event) => {
    event.preventDefault();
    clearCompletedTasks();
  });
}

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const taskDescription = newTask.value;
    if (taskDescription.trim() === '') {
      return;
    }

    addNewTask(taskDescription);
    newTask.value = '';
  });
}

renderTaskList();
window.addEventListener('load', renderTaskList);

module.exports = {
  tasks,
  addNewTask,
  deleteTask,
  editTaskDescription,
  clearCompletedTasks,
  markAsCompleted,
  markAsIncomplete,
};
