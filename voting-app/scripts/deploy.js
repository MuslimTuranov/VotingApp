const hre = require("hardhat");

async function main() {
    const Voting = await hre.ethers.getContractFactory("Voting");
  
    // Start deployment
    const voting = await Voting.deploy(["option0"], 90);
    await voting.waitForDeployment(); 
    
    console.log("Contract deployed to:", await voting.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });