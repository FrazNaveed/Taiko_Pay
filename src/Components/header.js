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
            <Link to="/" className="block mt-4 lg:inline-block lg:mt-0">
              <span className="font-bold text-3xl tracking-tight">XPAY</span>
            </Link>
          </div>
          <div className="block lg:hidden">
            <button
              className="flex items-center px-3 py-2 border rounded hover:text-cpink-100 hover:border-cpink-100 text-white border-white transition-all"
              
            >
              <svg
                className="fill-current h-3 w-3"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
            </button>
          </div>

          <nav className="w-full hidden flex-grow lg:flex lg:items-center lg:w-auto ">
            <div className="text-sm lg:flex-grow md:flex gap-10 md:ml-[3rem]">
              <Link
                to="/pool"
                className="block mt-4 lg:inline-block lg:mt-0 hover:underline transition-all"
              >
                <p className="font-semibold text-[0.95rem]">Pool</p>
              </Link>

              <Link
                to="/staking"
                className="block mt-4 lg:inline-block lg:mt-0 hover:underline transition-all"
              >
                <p className="font-semibold text-[0.95rem]">Staking</p>
              </Link>
              <a
                href="#but-btc"
                className="block mt-4 lg:inline-block lg:mt-0 hover:underline transition-all"
              >
                <p className="font-semibold text-[0.95rem]">Buy BTC</p>
              </a>
            </div>
            <div>{
              currentAccount ? 
              <div className="flex"><BlockchainBox/>
                <button className="inline-block text-sm px-4 py-2 rounded transition-all text-white bg-violet-400 hover:bg-pink-600 mt-4 lg:mt-0">
                  <p className="font-bold" >{shortenAddress(currentAccount)}</p>
                </button> </div>: 
                <button className="inline-block text-sm px-4 py-2 rounded transition-all text-white bg-cpink-100 hover:bg-pink-600 mt-4 lg:mt-0">
                <p className="font-bold" onClick={connectWallet}>Connect Wallet</p>
              </button>
              }
              
            </div>
            {/* <ConnectButton /> */}
          </nav>
        </Container>
      </header>

      <div
        // ref={drawerRef}
        className="fixed top-0 z-40 h-screen p-4 overflow-y-auto transition-all -translate-x-full bg-gray-800 w-72"
      >
        <button
          
          className="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center hover:bg-gray-600 hover:text-white"
        >
          <CloseIcon className="w-5 h-5" />
          <span className="sr-only">Close menu</span>
        </button>

        <div className="mt-7">
          <div className="text-sm flex flex-col gap-1">
            <Link
              to="/pool"
              className="block mt-4 lg:inline-block lg:mt-0 hover:underline transition-all"
            >
              <span >
                <p className="font-semibold text-[0.95rem]">Pool</p>
              </span>
            </Link>
            <Link
              to="/staking"
              className="block mt-4 lg:inline-block lg:mt-0 hover:underline transition-all"
            >
              <span >
                <p className="font-semibold text-[0.95rem]">Staking</p>
              </span>
            </Link>
            <a
              href="#but-btc"
              className="block mt-4 lg:inline-block lg:mt-0 hover:underline transition-all"
            >
              <span >
                <p className="font-semibold text-[0.95rem]">Buy BTC</p>
              </span>
            </a>
          </div>
          <BlockchainBox/>
          <div>
            <button className="inline-block text-sm px-4 py-2 rounded transition-all text-white bg-cpink-100 hover:bg-pink-600 mt-4 lg:mt-0"
              onClick={connectWallet}
            >
              <p className="font-bold" >Connect Wallet</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
