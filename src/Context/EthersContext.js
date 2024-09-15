import { ethers } from "ethers";
import { createContext, useState, useEffect } from "react";
import { abi } from "../Utils/abi";
import { useNavigate } from "react-router-dom";
import { chainIdMapping } from "../Utils/networks";

export const EthersContext = createContext(null);
const { ethereum } = window;
if (!ethereum) alert("Please install metamask to use the application");

export default function Ethers({ children }) {
  const contractAddressTestnet = "0x11c59ad9697d782A5013fA292991841fB3DaD187";
  const contractAddressMainnet = "0xB9d37068Bd3586aEa1b0B120D183eB7A390312f7";

  const [currentAccount, setCurrentAccount] = useState(null);
  const [chainId, setChainId] = useState(window.ethereum.networkVersion);
  const [EmpWallet, setEmpWallet] = useState("0");
  const [isLoading, setisLoading] = useState(false);
  const [Contract, setContract] = useState(null);
  const navigate = useNavigate();

  const checkIfWalletIsConnect = async () => {
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
      throw new Error("No ethereum object");
    }
  };

  const getEmployeeTransactions = async () => {
    try {
      const account = await getWallet();
      const contract = getContract();
      let emp = await contract.getEmployeeTransactions(account);
      return emp;
    } catch (e) {
      console.log(e);
    }
  };

  const getName = async () => {
    try {
      const account = await getWallet();
      const contract = getContract();
      let name = await contract.Name(account);
      return name;
    } catch (e) {
      console.log(e);
    }
  };
  const getEmployeeName = async (address) => {
    try {
      const contract = getContract();
      let name = await contract.Name(address);
      return name;
    } catch (e) {
      console.log(e);
    }
  };
  // const reqCompany = async () => {
  //   try {
  //     const account = await getWallet()
  //     const contract = getContract()
  //     let res = await contract.reqCompany(account)
  //     return res;
  //   }
  //   catch (e) {
  //     console.log(e)
  //   }
  // }
  // const isEmployee = async () => {
  //   try {
  //     const account = await getWallet()
  //     const contract = getContract()
  //     let emp = await contract.isEmployee(account)
  //     console.log(emp);
  //     if (emp == 0) { navigate("/")}
  //     else if (emp == 1) navigate("/employee")
  //     else navigate('/company')
  //     return emp;
  //   }
  //   catch (e) {
  //     console.log(e)
  //   }
  // }
  const createAccount = async (name) => {
    try {
      const contract = getContract();
      if (name === "" || name == null)
        return alert("Please fill your name before sign in");
      console.log(name);
      let res = await contract.registerUser(name);
      await res.wait();
      alert("You have been succefully registerd");
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };
  // const sendJoinRequest = async (CompanyAddress) => {
  //   try {
  //     const contract = getContract()
  //     let res = await contract.sendJoinRequest(CompanyAddress)
  //     console.log(res)
  //     alert("Succefully sent the join request")
  //   }
  //   catch (e) {
  //     console.log(e)
  //     alert("Something went wrong, try again")
  //   }
  // }

  // const acceptEmployee = async (salary, empAddress) => {
  //   try {
  //     let x = ethers.utils.hexlify(salary)
  //     const contract = getContract()
  //     let res = await contract.acceptEmployee(x, empAddress)
  //     console.log(res)
  //   }
  //   catch (e) {
  //     console.log(e)
  //     alert("Something went wrong, try again")
  //   }
  // }
  // const rejectEmployee = async (empAddress) => {
  //   try {
  //     const contract = getContract()
  //     let res = await contract.acceptEmployee(empAddress)
  //     alert("Succefully rejected the application")
  //     console.log(res)
  //   }
  //   catch (e) {
  //     console.log(e)
  //     alert("Something went wrong, try again")
  //   }
  // }
  const changeEmployeeSalary = async (newSal, empAddr) => {
    try {
      const contract = getContract();
      let res = await contract.changeEmployeeSalary(newSal, empAddr);
      console.log(res);
      await res.wait();
      alert("Succefully changed the salary");
    } catch (e) {
      console.log(e);
      alert("Something went wrong, try again");
    }
  };

  const getCompanyTransactions = async () => {
    try {
      const account = await getWallet();
      const contract = getContract();
      let res = await contract.getCompanyTransactions(account);
      return res;
    } catch (e) {
      console.log(e);
      alert("Something went wrong, try again");
    }
  };

  const addEmployee = async (address, salary, name) => {
    try {
      const contract = getContract();
      let res = await contract.addEmployee(
        ethers.utils.parseEther(salary),
        address
      );
      await res.wait();
      alert(`Succefully added ${name} with salary of ${salary} matic`);
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
      alert("Succefully removed the employee");
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
      let totalSal = await contract.calculateTotalSalary(account);
      console.log(totalSal);
      let overrides = {
        value: totalSal._hex,
        gasLimit: 1000000,
      };
      let res = await contract.payEmployees(overrides);
      await res.wait();
      console.log(res);
      alert("Congratulations salary was distributed succefully");
    } catch (e) {
      console.log(e);
      alert("Something went wrong, try again");
    }
  };
  const calculateTotalSalary = async () => {
    try {
      const account = await getWallet();
      const contract = getContract();
      let res = await contract.calculateTotalSalary(account);
      return ethers.utils.formatEther(res);
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
      let res = await contract.getEmployeeList(account);
      return res;
    } catch (e) {
      console.log(e);
      alert("Something went wrong, try again");
    }
  };
  // const getWaitingList = async (cmpAddr) => {
  //   try {
  //     const contract = getContract()
  //     let res = await contract.getWaitingList(cmpAddr)
  //     console.log(res)
  //   }
  //   catch (e) {
  //     console.log(e)
  //     alert("Something went wrong, try again")
  //   }
  // }

  const getWallet = async () => {
    try {
      if (currentAccount == null) {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        const account = accounts[0];
        return account;
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
    console.log("getContractAddress", chain);
    try {
      if (chain == 167009) return contractAddressTestnet;
      else return contractAddressMainnet;
    } catch (e) {
      alert(e);
      return null;
    }
  };

  const switchNetwork = async (hexChain) => {
    setisLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum); // Use `window.ethereum`
    try {
      console.log("switching", hexChain);
      await provider.send("wallet_switchEthereumChain", [
        { chainId: chainIdMapping[hexChain].hex },
      ]);
      changeContract(hexChain);
      navigate("/");
    } catch (switchError) {
      console.log(switchError);
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
          navigate("/");
        } catch (addError) {
          console.log(addError);
        }
      }
    }
    setisLoading(false);
  };

  useEffect(() => {
    checkIfWalletIsConnect();
    //connectWallet()
  }, []);

  return (
    <EthersContext.Provider
      value={{
        connectWallet,
        currentAccount,
        getName,
        checkIfWalletIsConnect,
        getEmployeeTransactions,
        createAccount,
        getEmployeeList,
        calculateTotalSalary,
        removeEmployee,
        changeEmployeeSalary,
        addEmployee,
        payEmployees,
        getEmployeeName,
        setEmpWallet,
        EmpWallet,
        getCompanyTransactions,
        chainId,
        setChainId,
        switchNetwork,
      }}
    >
      {children}
    </EthersContext.Provider>
  );
}
