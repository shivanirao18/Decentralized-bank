const hre = require("hardhat");
async function main() {
    const Bank = await hre.ethers.getContractFactory("Bank");
    const bank = await Bank.deploy();
    console.log("Bank deployed to:", await bank.getAddress());
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
