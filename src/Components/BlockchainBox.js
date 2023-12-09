import React, { useEffect, useState, useContext } from 'react';
import { EthersContext } from '../Context/EthersContext';
import { chainIdMapping } from '../Utils/networks';
import {Modal} from 'react-modal';


const BlockchainBox = () => {
    const { chainId, switchNetwork } = useContext(EthersContext)
    console.log(chainId);
    const customStyles = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
        },
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            border: 'none',
            padding: '20px',
            maxWidth: '600px',       
        },
    };

    const [isOpen, setIsOpen] = useState(false);

    const handleOpenModal = () => {
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
    };
    const switchHandler= async(chain)=>{
      await switchNetwork(chain)
      setIsOpen(false)
      window.location.reload()
    }

    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    type="button"
                    className="inline-flex justify-center items-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={handleOpenModal}
                >
                    {chainIdMapping[chainId].name}
                </button>
            </div>

            {/* <Modal
                isOpen={isOpen}
                onRequestClose={handleCloseModal}
                style={customStyles}
                contentLabel="Example Modal"
            > */}
            {isOpen && <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
                <div className='bg-white p-3 rounded-md'>
                <div className='flex justify-between'>
                    <div className='font-roboto font-semibold text-2xl'>Choose Chain</div>
                    <button onClick={handleCloseModal} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
                <div className='grid grid-rows-2 grid-flow-col gap-4 p-3'>
                    <div className='h-16 w-16 bg-stone-900 rounded-md flex flex-col justify-center text-center cursor-pointer' onClick={() => { switchHandler('0x1') }}>
                        <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/471px-Ethereum_logo_2014.svg.png' 
                        className='w-7 h-11 ml-4'></img>
                        <div className='text-xs text-white'>Ethereum</div>
                    </div>
                    <div className='h-16 w-16 bg-stone-900  rounded-md flex flex-col justify-center text-center cursor-pointer' onClick={() => { switchHandler('0x89') }}>
                        <img src='https://seeklogo.com/images/P/polygon-matic-logo-86F4D6D773-seeklogo.com.png'
                            className='w-10 h-11 ml-3'></img>
                        <div className='text-xs text-white'>Polygon</div>
                    </div>
                    <div className='h-16 w-16 bg-stone-900  rounded-md flex flex-col justify-center text-center cursor-pointer' onClick={() => { switchHandler('0x13881') }}>
                        <img src='https://seeklogo.com/images/P/polygon-matic-logo-86F4D6D773-seeklogo.com.png'
                            className='w-10 h-11 ml-3'></img>
                        <div className='text-xs text-white'>Mumbai</div>
                    </div>
                    <div className='flex justify-between'  onClick={() => { switchHandler('0x38') }}>
                        <div className='h-16 w-16 bg-stone-900  rounded-md flex flex-col justify-center text-center cursor-pointer'>
                            <img src='https://seeklogo.com/images/B/binance-coin-bnb-logo-97F9D55608-seeklogo.com.png'
                                className='w-11 h-11 ml-2'></img>
                            <div className='text-xs text-white'>Binance</div>
                        </div>
                    </div>
                </div>
                </div>
            </div>}
        </div>
    );
};

export default BlockchainBox;
