const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const TodoList = await hre.ethers.getContractFactory("TodoList");
  const todoList = await TodoList.deploy();

  // Ждём деплой
  await todoList.waitForDeployment();

  // Получаем адрес контракта
  const address = await todoList.getAddress();
  console.log("TodoList deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

