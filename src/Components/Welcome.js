import React, { useContext,useState, useEffect } from "react";
import { useNavigate} from 'react-router-dom';
import { Col, Row } from "react-bootstrap";
import { EthersContext } from "../Context/EthersContext";
import '../Styles/Welcome.css'


const companyCommonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";



const Welcome = () => {
  const { isEmployee, createAccount, getName, currentAccount, connectWallet } = useContext(EthersContext)
    const [Selection, setSelection] = useState(true)
    const [Name, setName] = useState()
    const [Rname, setRname] = useState("")
    const navigate = useNavigate()
  useEffect(() => {
    initiator()
  }, [])
  const initiator= async()=>{
    let name = await getName()
    if(name)setRname(name)
  }

  const handleCreate = async()=>{
    let res = await createAccount(Name)
    if(res) setSelection(false)
    else alert("Something went wrong please try again later")
  }
  return (
    <div className="wel_main">
      <div  className="wel_sub">
        <Row>
          <Col sm={9} xs={10} lg={6} md={6}>
        <div className="flex flex-1 justify-start items-start flex-col mf:mr-10 w-full">
          <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1 font-light">
            Seemless financial services<br /> at zero fee.
          </h1>
          <p className="text-left mt-3 text-white font-light md:w-9/12 w-11/12 text-base">
           Protect your Works  with the power of BlockChain technology . 
          </p>

          <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
            <div className={`rounded-tl-2xl ${companyCommonStyles}`}>
               zero fee
            </div>
            <div className={companyCommonStyles}> fast</div>
            <div className={`sm:rounded-tr-2xl ${companyCommonStyles}`}>
               Secure
            </div>
            <div className={`sm:rounded-bl-2xl ${companyCommonStyles}`}>
              polygon
            </div>
            <div className={companyCommonStyles}> Reliabile </div>
            <div className={`rounded-br-2xl ${companyCommonStyles}`}>
              easy
            </div>
          </div>
        </div>
        </Col>
       <Col  sm={9} xs={10} lg={6} md={6} className = "wel_left">
        {
              
        }
            {currentAccount ?Rname==""?<div className='window'>
              <div className='overlay'></div>
              <div className='content'>
                <div className='welcome'>Hello There !</div>
                  <div className='subtitle'>We're almost done. Before using our services you need to create an account.</div>
                <div className='input-fields'>
                    <input type='text' placeholder='Name of the Company' className='input-line full-width' onChange={(e) => setName(e.target.value)}></input>
                </div>
                <div><button className='ghost-round full-width' onClick={handleCreate}>Create Account</button></div>
              </div>
              <div className='subtitle space2'>Desclaimer: - Please do it with atmost care you wont be able to change these details</div>
              </div>:<div className='window'>
                <div className='overlay'></div>
                <div className='content'>
                  <div className='welcome'>Welcome !</div>
                  <div className='subtitle space'>Let's get started, please select your category.</div>
                  <div ><button className='ghost-round full-width' onClick={()=>navigate("/company")}>Countinue as a Company</button></div>
                  <div><button className='ghost-round full-width' onClick={() => navigate("/employee")}>Countinue as an Employee</button></div>
                </div>
                <div className='text-center text-white space2'>Signed In as {Rname}</div>
            </div> : <div>
              <button class="button-63" role="button" onClick={connectWallet}>Connect Wallet </button>
            </div>
            }
        </Col>
        </Row>
      </div>
    </div>
  );
};

export default Welcome;
