import './index.css';

const taskList = document.getElementById('task-list');
const newTask = document.getElementById('new-task');
const form = document.querySelector('form');

// Tasks array
const tasks = [
  { description: 'Check email', completed: false, index: 0 },
  { description: 'Finish coding challenge', completed: true, index: 1 },
  { description: 'Workout', completed: false, index: 2 },
  { description: 'Complete Todo list project', completed: false, index: 3 },
];

function createTaskListItemElement(task) {
  // Create the list item element
  const listItemElement = document.createElement('li');

  // Create the checkbox element
  const checkboxElement = document.createElement('input');
  checkboxElement.type = 'checkbox';
  checkboxElement.checked = task.completed;

  // Add an event listener to the checkbox to update the task object when checked
  checkboxElement.addEventListener('change', () => {
    task.completed = checkboxElement.checked;
  });

  // Create the description element
  const descriptionElement = document.createElement('span');
  descriptionElement.textContent = task.description;

  // Append the checkbox and description elements to the list item
  listItemElement.appendChild(checkboxElement);
  listItemElement.appendChild(descriptionElement);

  // Create a horizontal line element
  const hrElement = document.createElement('hr');

  listItemElement.appendChild(hrElement);
  return listItemElement;
}

// Create a new tasks
function addNewTask(description) {
  const taskIndex = tasks.length;

  const task = { description, completed: false, index: taskIndex };
  tasks.push(task);

  const listItemElement = createTaskListItemElement(task);
  taskList.appendChild(listItemElement);
}

// Add an event listener to the form to handle task creation
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const taskDescription = newTask.value;
  if (taskDescription.trim() === '') {
    return;
  }

  // Add the new task and reset the input field
  addNewTask(taskDescription);
  newTask.value = '';
});

function renderTaskList() {
  taskList.innerHTML = '';

  tasks
    .sort((task1, task2) => task1.index - task2.index)
    .forEach((task) => {
      const listItemElement = createTaskListItemElement(task);
      taskList.appendChild(listItemElement);
    });
}

renderTaskList();
window.addEventListener('load', renderTaskList);
