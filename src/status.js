// import { saveTasks } from './index.js';

const markAsCompleted = (task) => {
  task.completed = true;
  // saveTasks();
};

const markAsIncomplete = (task) => {
  task.completed = false;
  // saveTasks();
};

export { markAsCompleted, markAsIncomplete };
