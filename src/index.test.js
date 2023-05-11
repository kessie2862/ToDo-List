import "jsdom-global/register.js";
import "jest-localstorage-mock";

// importing functions I want to test
import "./index.css";

const { tasks, addNewTask, deleteTask } = require("./index.js");

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};

global.localStorage = localStorageMock;

describe("Task list app", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addNewTask", () => {
    it("adds a new task to the list", () => {
      const initialTasksLength = tasks.length;
      const taskDescription = "Test task description";
      addNewTask(taskDescription);
      expect(tasks.length).toBe(initialTasksLength + 1);
      expect(tasks[initialTasksLength].description).toBe(taskDescription);
    });

    it("saves the new task to localStorage", () => {
      const taskDescription = "Test task description";
      addNewTask(taskDescription);
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "tasks",
        JSON.stringify(tasks)
      );
    });
  });

  describe("deleteTask", () => {
    it("deletes the task from the list", () => {
      const initialTasksLength = tasks.length;
      const taskIndex = 0;
      deleteTask(taskIndex);
      expect(tasks.length).toBe(initialTasksLength - 1);
      expect(tasks.every((task, index) => task.index === index)).toBe(true);
    });

    it("saves the updated task list to localStorage", () => {
      const taskIndex = 0;
      const initialTasksLength = tasks.length;
      deleteTask(taskIndex);
      expect(tasks.length).toBe(initialTasksLength - 1);
      expect(tasks.every((task, index) => task.index === index)).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "tasks",
        JSON.stringify(tasks)
      );
    });
  });
});
