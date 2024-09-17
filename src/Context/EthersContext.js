import { ethers } from "ethers";
import { createContext, useState, useEffect } from "react";
import { abi } from "../Utils/abi";
import { useNavigate } from "react-router-dom";
import { chainIdMapping } from "../Utils/networks";

export const EthersContext = createContext(null);
const { ethereum } = window;
if (!ethereum) alert("Please install MetaMask to use the application");

export default function Ethers({ children }) {
  const contractAddressTestnet = "0x9FC682f62eE5957bFe3fa108c2c5d2bE713Db4ec";
  const contractAddressMainnet = "0xB9d37068Bd3586aEa1b0B120D183eB7A390312f7";

  const [currentAccount, setCurrentAccount] = useState(null);
  const [chainId, setChainId] = useState(window.ethereum.networkVersion);
  const [isLoading, setIsLoading] = useState(false);
  const [Contract, setContract] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkIfWalletIsConnected();

    const handleAccountsChanged = (accounts) => {
      setCurrentAccount(accounts[0] || null);
    };

    const handleChainChanged = (chainIdHex) => {
      const chainId = parseInt(chainIdHex, 16);
      setChainId(chainId.toString());
      changeContract(chainId.toString());
    };

    if (ethereum) {
      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (ethereum) {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
        ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        const network = window.ethereum.networkVersion;
        setChainId(network);
      } else {
        alert(
          "No accounts found, please click the connect wallet button to proceed"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object");
    }
  };

  const getWallet = async () => {
    try {
      if (currentAccount == null) {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        return accounts[0];
      } else return currentAccount;
    } catch (e) {
      alert(e);
    }
  };

  const getContract = () => {
    try {
      if (Contract == null) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          getContractAddress(chainId),
          abi,
          signer
        );
        setContract(contract);
        return contract;
      } else return Contract;
    } catch (e) {
      alert(e);
      return null;
    }
  };

  const changeContract = (chain) => {
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        getContractAddress(chain),
        abi,
        signer
      );
      setContract(contract);
      return contract;
    } catch (e) {
      alert(e);
      return null;
    }
  };

  const getContractAddress = (chain) => {
    try {
      if (chain == 167009) return contractAddressTestnet;
      else if (chain == 11155111) {
        return contractAddressTestnet;
      }
      return contractAddressMainnet;
    } catch (e) {
      alert(e);
      return null;
    }
  };

  const switchNetwork = async (hexChain) => {
    if (!window.ethereum) {
      alert(
        "MetaMask is not installed. Please install it to use this feature."
      );
      return;
    }

    setIsLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log("inside switch network", hexChain);
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdMapping[hexChain].hex }],
      });

      setChainId(hexChain);
      changeContract(hexChain);
      navigate("/");
    } catch (switchError) {
      console.error("Switch network error:", switchError);

      if (switchError.code === 4902) {
        try {
          await provider.send("wallet_addEthereumChain", [
            {
              chainId: chainIdMapping[hexChain].hex,
              chainName: chainIdMapping[hexChain].name,
              rpcUrls: chainIdMapping[hexChain].rpcUrls,
              blockExplorerUrls: chainIdMapping[hexChain].blockExplorerUrls,
              nativeCurrency: chainIdMapping[hexChain].nativeCurrency,
            },
          ]);

          await provider.send("wallet_switchEthereumChain", [
            { chainId: chainIdMapping[hexChain].hex },
          ]);
          changeContract(hexChain);
          navigate("/");
        } catch (addError) {
          console.error("Add network error:", addError);
        }
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const addEmployee = async (address, salary) => {
    try {
      const contract = getContract();
      let res = await contract.registerEmployee(
        address,
        ethers.utils.parseEther(salary)
      );
      await res.wait();
      alert(`Successfully added ${address} with salary of ${salary} ETH`);
      window.location.reload();
    } catch (e) {
      console.log(e);
      alert("Something went wrong, try again");
    }
  };

  const removeEmployee = async (empAddr) => {
    try {
      const contract = getContract();
      let res = await contract.removeEmployee(empAddr);
      await res.wait();
      alert("Successfully removed the employee");
      window.location.reload();
    } catch (e) {
      console.log(e);
      alert("Something went wrong, try again");
    }
  };

  const payEmployees = async () => {
    try {
      const account = await getWallet();
      const contract = getContract();
      let totalSal = await contract.getContractBalance();
      let overrides = {
        value: totalSal._hex,
        gasLimit: 1000000,
      };
      let res = await contract.payEmployees(overrides);
      await res.wait();
      alert("Successfully distributed salaries");
    } catch (e) {
      console.log(e);
      alert("Something went wrong, try again");
    }
  };

  const calculateTotalSalary = async () => {
    try {
      const account = await getWallet();
      const contract = getContract();
      // let res = await contract.calculateTotalSalary(account);
      // return ethers.utils.formatEther(res);
    } catch (e) {
      console.log(e);
      alert("Something went wrong, try again");
      return 0;
    }
  };

  const getEmployeeList = async () => {
    try {
      const account = await getWallet();
      const contract = getContract();
      let res = await contract.getEmployeeList();
      return res;
    } catch (e) {
      console.log(e);
      alert("Something went wrong, try again");
    }
  };

  const getEmployeeNumber = async () => {
    try {
      const account = await getWallet();
      const contract = getContract();
      let res = await contract.getEmployeeNumber();
      res = res.toString();
      console.log("total employees", res);
      return res;
    } catch (e) {
      console.log(e);
      alert("Something went wrong, try again");
    }
  };

  const registerCompany = async () => {
    try {
      const contract = getContract();
      const account = await getWallet();
      let res = await contract.registerEmployer(account);
      await res.wait();
      alert("Successfully registered the company");
      window.location.reload();
    } catch (e) {
      console.log(e);
      alert("Something went wrong, try again");
    }
  };

  const isEmployer = async () => {
    try {
      const contract = getContract();
      const account = await getWallet();
      let res = await contract.employers(account);
      console.log("is employer", res);
      return res ? true : false;
    } catch (e) {
      console.log(e);
      alert("Something went wrong, try again");
    }
  };

  return (
    <EthersContext.Provider
      value={{
        connectWallet,
        currentAccount,
        checkIfWalletIsConnected,
        addEmployee,
        removeEmployee,
        payEmployees,
        calculateTotalSalary,
        getEmployeeList,
        chainId,
        setChainId,
        switchNetwork,
        registerCompany,
        isEmployer,
        getEmployeeNumber,
      }}
    >
      {children}
    </EthersContext.Provider>
  );
}
