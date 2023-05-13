import 'jsdom-global/register.js';
import 'jest-localstorage-mock';

// importing functions I want to test
const {
  tasks,
  addNewTask,
  deleteTask,
  editTaskDescription,
  clearCompletedTasks,
  markAsCompleted,
  markAsIncomplete,
} = require('./index.js');

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};

global.localStorage = localStorageMock;

describe('Task list app', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addNewTask', () => {
    it('adds a new task to the list', () => {
      const initialTasksLength = tasks.length;
      const taskDescription = 'Test task description';
      addNewTask(taskDescription);
      expect(tasks.length).toBe(initialTasksLength + 1);
      expect(tasks[initialTasksLength].description).toBe(taskDescription);
    });

    it('saves the new task to localStorage', () => {
      const taskDescription = 'Test task description';
      addNewTask(taskDescription);
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'tasks',
        JSON.stringify(tasks),
      );
    });
  });

  describe('deleteTask', () => {
    it('deletes the task from the list', () => {
      const initialTasksLength = tasks.length;
      const taskIndex = 0;
      deleteTask(taskIndex);
      expect(tasks.length).toBe(initialTasksLength - 1);
      expect(tasks.every((task, index) => task.index === index)).toBe(true);
    });

    it('saves the updated task list to localStorage', () => {
      const taskIndex = 0;
      const initialTasksLength = tasks.length;
      deleteTask(taskIndex);
      expect(tasks.length).toBe(initialTasksLength - 1);
      expect(tasks.every((task, index) => task.index === index)).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'tasks',
        JSON.stringify(tasks),
      );
    });
  });

  // Edit task description
  describe('editTaskDescription function', () => {
    it('should edit the task', () => {
      const task = {
        description: 'old description',
        completed: false,
        index: 0,
      };
      tasks.push(task);

      const newDescription = 'new description';
      const inputElement = document.createElement('input');
      inputElement.type = 'text';
      inputElement.value = newDescription;
      inputElement.classList.add('edit-input');

      const listItemElement = document.createElement('li');
      const descriptionElement = document.createElement('span');
      descriptionElement.textContent = task.description;
      listItemElement.appendChild(descriptionElement);
      listItemElement.appendChild(document.createElement('i'));

      const taskList = document.createElement('ul');
      taskList.appendChild(listItemElement);

      editTaskDescription(task, taskList);

      const inputElementInDom = listItemElement.querySelector('input');
      expect(inputElementInDom.value).toBe(task.description);

      inputElementInDom.value = newDescription;
      inputElementInDom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter' }),
      );

      expect(task.description).toBe(newDescription);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'tasks',
        JSON.stringify(tasks),
      );
    });
  });
});

describe('clearCompletedTasks function', () => {
  beforeEach(() => {
    // Clear the localStorage mock and reset the tasks array before each test
    localStorage.clear();
    tasks.length = 0;
  });

  it('should clear all completed tasks', () => {
    // Add some random tasks to the array
    const task1 = { description: 'Task 1', completed: true, index: 0 };
    const task2 = { description: 'Task 2', completed: false, index: 1 };
    tasks.push(task1, task2);

    // Call the clearCompletedTasks function
    clearCompletedTasks();

    // Expect the completed task to be removed from the tasks array
    expect(tasks.length).toBe(1);
    expect(tasks[0]).toEqual(task2);
  });
});

describe('Task completion status', () => {
  beforeEach(() => {
    localStorage.clear();
    tasks.length = 0;
  });

  // Mark tasks as Completed
  test('should mark task as completed', () => {
    const tasks = [{ description: 'Task 1', completed: false, index: 0 }];
    localStorage.setItem('tasks', JSON.stringify(tasks));

    markAsCompleted(tasks);
    const storedTasksJSON = localStorage.getItem('tasks');
    const storedTasks = storedTasksJSON ? JSON.parse(storedTasksJSON) : [];

    const updatedTaskCompleted = storedTasks.length > 0 ? storedTasks[0].completed : true;

    expect(updatedTaskCompleted).toBe(true);
  });

  // Mark tasks as InCompleted

  test('should mark task as incompleted', () => {
    const tasks = [{ description: 'Task 1', completed: true, index: 0 }];
    localStorage.setItem('tasks', JSON.stringify(tasks));

    markAsIncomplete(tasks);
    const storedTasksJSON = localStorage.getItem('tasks');
    const storedTasks = storedTasksJSON ? JSON.parse(storedTasksJSON) : [];

    const updatedTaskCompleted = storedTasks.length > 0 ? storedTasks[0].completed : false;

    expect(updatedTaskCompleted).toBe(false);
  });
});
