import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Col, Row } from "react-bootstrap";
import { EthersContext } from "../Context/EthersContext";
import '../Styles/Employee.css'
import Loader from "./Loader";
import { ethers } from "ethers";

function Employee() {
  const { getEmployeeTransactions, getName } = useContext(EthersContext)
  const [Loaded, setLoaded] = useState(false)
  const [Transactions, setTransactions] = useState([])
  const [Name, setName] = useState("")
  const navigate = useNavigate()
  useEffect(() => {
    initiator()
  }, [])
  const initiator = async () => {
    setLoaded(false)
    const transactions = await getEmployeeTransactions()
    console.log(transactions);
    if (transactions) setTransactions(transactions)
    const name = await getName()
    if (name === "") navigate("/");
    if (name) setName(name)
    setLoaded(true)
  }
  return (

    <div className='emp_main'>
      {
        Loaded ? <Row>
          {/* Profile Part */}
          {/* <Col sm={12} xs={12} lg={6} md={6}> */}
          <Row>
            <Col sm={12} lg={6} md={12} className='probox'>
              {/* <div className="single_advisor_profile wow fadeInUp" data-wow-delay="0.2s" style="visibility: visible; animation-delay: 0.2s; animation-name: fadeInUp;"> */}
              <div className='pro_box'>
                <div className="single_advisor_profile wow " >
                  <div className="advisor_thumb"><img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="" />
                    <div className="social-info"><a href="#"><i className="fa fa-facebook"></i></a><a href="#"><i className="fa fa-twitter"></i></a><a href="#"><i className="fa fa-linkedin"></i></a></div>
                  </div>
                  <div className="single_advisor_details_info">
                    <h6>{Name}</h6>
                    <p className="designation">Employee</p>
                  </div>
                </div>
              </div>
            </Col>
            <Col sm={12} lg={6} md={12} className='pro_box' >
              <div className='transactions_main '>
                <div className='transactions_head'>
                  <h2>Recent transactions</h2>
                </div>
                <div className='transactions_bottom'>
                  {
                    Transactions.map((transaction, index) => {
                      // let etherValue = ethers.utils.formatEther(transaction.amount._hex);
                      // etherValue = parseInt(etherValue, 16)
                      let etherValue = parseInt(transaction.amount._hex, 16)
                      const date = new Date(parseInt(transaction.time, 16) * 1000);
                      return (<div className='tr_card'>
                        <div className='tr_amount'>{transaction.sender}</div>
                        <div className='tr_amount'>{etherValue} matic</div>
                        <div className="trtime">{date.getDate()}/{date.getMonth()}/2023 {date.getHours()}:{date.getMinutes()}</div>
                      </div>)
                    })
                  }

                </div>
              </div>
            </Col>

          </Row>
          {/* </Col> */}
          {/* Transaction History */}
          {/* <Col sm={12} xs={12} lg={6} md={6}></Col> */}
        </Row> : <Loader />
      }

    </div>
  )

}

export default Employee