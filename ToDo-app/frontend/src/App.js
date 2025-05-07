import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

let web3;

const contractAddress = "0x9B85fEBcaFE1bA79b9D60c2f067A95C77ce54886";
const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "TaskCompleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "description",
        "type": "string"
      }
    ],
    "name": "TaskCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "TaskDeleted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      }
    ],
    "name": "createTask",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_taskId",
        "type": "uint256"
      }
    ],
    "name": "deleteTask",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_taskId",
        "type": "uint256"
      }
    ],
    "name": "getTask",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "completed",
            "type": "bool"
          }
        ],
        "internalType": "struct TodoList.Task",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTasks",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "completed",
            "type": "bool"
          }
        ],
        "internalType": "struct TodoList.Task[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "taskCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "tasks",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "completed",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_taskId",
        "type": "uint256"
      }
    ],
    "name": "toggleCompleted",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];


const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskDescription, setTaskDescription] = useState('');
  const [account, setAccount] = useState('');
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    const loadTasks = async () => {
      const readOnlyWeb3 = new Web3(new Web3.providers.HttpProvider("https://eth-sepolia.g.alchemy.com/v2/KiSqWtrJ5Bga-ryTGVtExs9XpqDyZRJ4"));
      const contract = new readOnlyWeb3.eth.Contract(contractABI, contractAddress);
      const tasksCount = await contract.methods.taskCount().call();
      const tasksData = [];
      for (let i = 1; i <= tasksCount; i++) {
        const task = await contract.methods.getTask(i).call();
        tasksData.push(task);
      }
      setTasks(tasksData);
    };

    if (account) {
      loadTasks();
    }
  }, [account]);

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
        setWeb3(web3Instance);
      } catch (err) {
        console.error('Error connecting to MetaMask:', err);
        alert('Error connecting to MetaMask');
      }
    } else {
      alert('Please install MetaMask');
    }
  };

  const createTask = async () => {
    if (!account) {
      alert('Please connect to MetaMask first');
      return;
    }

    if (!web3) {
      alert('Web3 not initialized');
      return;
    }

    try {
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      await contract.methods.createTask(taskDescription).send({ from: account });
      setTaskDescription('');
      // Instead of reloading, consider updating the state directly
      const tasksCount = await contract.methods.taskCount().call();
      const newTask = await contract.methods.getTask(tasksCount).call();
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error creating task');
    }
  };

  const toggleCompleted = async (id) => {
    if (!account || !web3) {
      alert('Please connect to MetaMask first');
      return;
    }

    try {
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      await contract.methods.toggleCompleted(id).send({ from: account });
      // Update the task in state instead of reloading
      const updatedTask = await contract.methods.getTask(id).call();
      setTasks(tasks.map(task => task.id === id ? updatedTask : task));
    } catch (error) {
      console.error('Error toggling task:', error);
      alert('Error toggling task');
    }
  };

  const deleteTask = async (id) => {
    if (!account || !web3) {
      alert('Please connect to MetaMask first');
      return;
    }

    try {
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      await contract.methods.deleteTask(id).send({ from: account });
      // Remove the task from state instead of reloading
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Error deleting task');
    }
  };

  return (
    <div className="container">
      <h1>ToDo List</h1>
      <div className="connection-status">
        {account ? (
          <p>Connected with: {account}</p>
        ) : (
          <div>
            <p>Not connected</p>
            <button onClick={connectMetaMask}>Connect MetaMask</button>
          </div>
        )}
      </div>
      <div className="task-form">
        <input
          type="text"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          disabled={!account}
          placeholder="Enter task description"
        />
        <button onClick={createTask} disabled={!account}>Add Task</button>
      </div>
      <ul className="task-list">
        {tasks.map((task, index) => (
          <li className="task-item" key={index}>
            <div className="task-info">
              <p className="task-description">{task.description}</p>
              <p className={`task-status ${task.completed ? 'completed' : ''}`}>
                {task.completed ? 'Completed' : 'Pending'}
              </p>
            </div>
            <div className="task-actions">
              <button 
                className="toggle-btn" 
                onClick={() => toggleCompleted(task.id)} 
                disabled={!account}
              >
                Toggle Complete
              </button>
              <button 
                className="delete-btn" 
                onClick={() => deleteTask(task.id)} 
                disabled={!account}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;