import {ethers} from "ethers";
import Bank from "./abi/Bank.json";
import {useEffect } from "react";
import { useState } from 'react'
import './App.css'


function App() {
  console.log("ethers:",ethers);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [balance, setBalance] = useState(null);
    const loadContract = async() => {
      if(typeof window.ethereum !=="undefined") {
        try{
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts",[]);
        setAccount(accounts[0]);
        const signer = await provider.getSigner();
        const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
        const bankContract = new ethers.Contract(contractAddress,Bank.abi,signer);
        setContract(bankContract);
        console.log("Contract loaded:",bankContract);
      } catch(error) {
        console.error("Error loading wallet or contract:",error);
      }
    } else {
      console.log("Please install MetaMask");
    }
  };
  useEffect(() => {
  loadContract();
},[]);
const handleDeposit = async() => {
  if(!contract) {
    alert("Contract not connected");
    return;
  }
  try{
    console.log("Depositing",depositAmount);
    const tx = await contract.deposit({value:ethers.parseEther(depositAmount)});
    await tx.wait();
    alert("Deposit successful!");
  } catch(error) {
    console.error("Deposit failed:", error);
  }
};
const handleWithdraw = async() => {
  if(!contract) {
    alert("Contract not connected");
    return;
  }
  try{
    console.log("Withdrawing",withdrawAmount);
    const tx = await contract.withdraw(ethers.parseEther(withdrawAmount));
    await tx.wait();
    alert("Withdraw successful!");
  } catch(error){
    console.error("Withdraw failed:",error);
  }
};
const getBalance = async() => {
  if(!contract) {
    alert("Contract not connected");
    return;
  }
  try{
    const balance = await contract.balances("0x247550a931181093e14585bc0b155476c4a9becb");
    const etherBalance = ethers.formatEther(balance);
    setBalance(etherBalance);
    console.log("Balance:", etherBalance);
  } catch(error){
    console.error("Could not fetch balance:", error);
    setBalance(null);
  }
};
return (
  <><><div style ={{ textAlign:"center",marginTop:"50px"}}>
    <h1>dBank</h1>
    <p>Connected account: {account ? account : "Not connnected"}</p>
    <div>
      <h2>Deposit</h2>
      <input
        type="text"
        placeholder="Amount in ETH"
        value={depositAmount}
        onChange={(e) => setDepositAmount(e.target.value)} />
      <button onClick={handleDeposit}>Deposit</button>
    </div>
  </div><div>
      <h2>Withdraw </h2>
      <input
        type="text"
        placeholder="Amount in ETH"
        value={withdrawAmount}
        onChange={(e) => setWithdrawAmount(e.target.value)} />
      <button onClick={handleWithdraw}>Withdraw</button>
    </div></><div>
      <button onClick={getBalance}
      >Show Balance</button>
      {balance !== null && <p>Balance:{ethers.formatEther(balance)} ETH</p>}
    </div></>
  );
}

export default App;
