import { useContext } from "react";
import { EthersContext } from "../Context/EthersContext";
import { Link } from "react-router-dom";
import { shortenAddress } from "../Utils/ShortenAddress";
import BlockchainBox from "./BlockchainBox";
import { CloseIcon } from "../icons/close-icon";
import { Container } from "./ui";



export const Header = () => {
  //rainbow
  
  const { connectWallet, currentAccount } = useContext(EthersContext)
  return (
    <>
      <header className="flex items-center justify-between flex-wrap bg-transparent border-b border-b-cdark-100 py-3 px-6">
        <Container className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0 text-white mr-6">
            <div className="block mt-4 lg:inline-block lg:mt-0">
              <span className="font-bold text-4xl tracking-tight">XPAY</span>
            </div>
          </div>

          <nav className="w-full hidden flex-grow lg:flex lg:items-center lg:w-auto ">
            <div className="text-sm lg:flex-grow md:flex gap-10 md:ml-[3rem]">
              
            </div>
            <div>{
              currentAccount ? 
              <div className="flex"><BlockchainBox/>
                <button className="inline-block text-sm ml-3 px-4 py-2 rounded transition-all text-white bg-violet-400 hover:bg-pink-600 lg:mt-0">
                  <div className="font-bold" >{shortenAddress(currentAccount)}</div>
                </button> </div>: 
                <button className="inline-block text-sm px-4 py-2 rounded-lg transition-all text-white bg-[#121241] hover:bg-black-300 mt-4 lg:mt-0">
                <div className="font-bold text-lg" onClick={connectWallet}>Connect Wallet</div>
              </button>
              }
              
            </div>
            {/* <ConnectButton /> */}
          </nav>
        </Container>
      </header>

    </>
  );
};
