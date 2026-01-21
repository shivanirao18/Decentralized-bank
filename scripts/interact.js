const hre = require("hardhat");
async function main() {
    const[deployer] = await hre.ethers.getSigners();
    const bankAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const bank = await hre.ethers.getContractAt("Bank",bankAddress);
    console.log("Deployer Address:", deployer.address);
    console.log("Depositing 1ETH...");
    const depositTx = await bank.deposit({ value: hre.ethers.parseEther("1")});
    await depositTx.wait();
    console.log("Deposit complete.");
    const balance = await bank.getBalance();
    console.log(`Current Balance: ${hre.ethers.formatEther(balance)}ETH`);
    console.log("Withdrawing 0.5 ETH...");
    const withdrawTx = await bank.withdraw(hre.ethers.parseEther("0.5"));
    await withdrawTx.wait();
    console.log("Withdrawl complete.");
    const newBalance = await bank.getBalance();
    console.log(`New Balance: ${hre.ethers.formatEther(newBalance)}ETH`);  
    // console.log('Test balance format:${hre.ethers.formatEther(1000000000000n)}ETH');
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});