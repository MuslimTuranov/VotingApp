// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {
    struct Task {
        uint id;
        string description;
        bool completed;
    }

    mapping(uint => Task) public tasks;
    uint public taskCount;

    event TaskCreated(uint id, string description);
    event TaskCompleted(uint id);
    event TaskDeleted(uint id);

    constructor() {
        taskCount = 0;
    }

    function createTask(string memory _description) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _description, false);
        emit TaskCreated(taskCount, _description);
    }

    function toggleCompleted(uint _taskId) public {
        Task storage task = tasks[_taskId];
        task.completed = !task.completed;
        emit TaskCompleted(_taskId);
    }

    function deleteTask(uint _taskId) public {
        delete tasks[_taskId];
        emit TaskDeleted(_taskId);
    }

    function getTask(uint _taskId) public view returns (Task memory) {
        return tasks[_taskId];
    }

    function getTasks() public view returns (Task[] memory) {
        Task[] memory allTasks = new Task[](taskCount);
        for (uint i = 1; i <= taskCount; i++) {
            allTasks[i - 1] = tasks[i];
        }
        return allTasks;
    }
}
