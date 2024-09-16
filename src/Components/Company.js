import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { EthersContext } from "../Context/EthersContext";
import "../Styles/Company.css";
import Loader from "./Loader";
import { ethers } from "ethers";

function Company() {
  const {
    getEmployeeList,
    calculateTotalSalary,
    removeEmployee,
    payEmployees,
    getName,
    setEmpWallet,
  } = useContext(EthersContext);
  const [Loaded, setLoaded] = useState(false);
  const [TotalSal, setTotalSal] = useState(0);
  const [EmpList, setEmpList] = useState([]);
  const [Name, setName] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    initiator();
  }, []);
  const initiator = async () => {
    setLoaded(false);
    const emp_list = await getEmployeeList();
    const totalSal = await calculateTotalSalary();
    const name = await getName();
    console.log(emp_list);
    if (totalSal) setTotalSal(totalSal);
    if (emp_list) setEmpList(emp_list);
    console.log(emp_list);
    if (name) setName(name);
    setLoaded(true);
  };

  const intiateTransactions = async () => {
    setLoaded(false);
    await payEmployees();
    setLoaded(true);
  };
  if (Loaded)
    return (
      <div className="emp_main">
        <Row>
          <Col sm={12} lg={5} md={12} className="probox">
            <div className="pro_box">
              <div className="cmp_box bg-pink-800">
                <div className="cmp_name font-sans">{Name} </div>
                <div className="flex justify-between p-5 ">
                  <div className="bg-white p-3 rounded-lg">
                    <div>No of Employees:</div>
                    <div className="text-xl text-black text-center">
                      {EmpList.length}
                    </div>
                  </div>
                  <div className="bg-red-100 p-3 rounded-lg">
                    <div>Total Salary</div>
                    <div className="text-orange-600 text-xl text-center">
                      {TotalSal} matic
                    </div>
                  </div>
                </div>
                <div className="flex-col justify-center w-100">
                  <div
                    className=" text-center bg-red-400 mx-5 rounded-lg p-3 hover:bg-white"
                    onClick={intiateTransactions}
                  >
                    Distribute Salary
                  </div>
                  <div
                    className=" text-center  bg-red-100 mx-5 rounded-lg p-3 my-2 hover:bg-red-500"
                    onClick={() => navigate("/addemployees")}
                  >
                    Add Employees
                  </div>
                  {/* <div className=' text-center bg-red-400 mx-5 rounded-lg p-3 hover:bg-white' onClick={()=>navigate('/transactions')}>View Transaction History</div> */}
                </div>
              </div>
            </div>
          </Col>

          <Col sm={12} lg={7} md={12}>
            <div className="text-white text-3xl my-5 ml-2"> Employees</div>

            <div className="emp_list">
              {/* iterating part  */}
              {EmpList.map((employee, index) => {
                let etherValue = ethers.utils.formatEther(employee.salary);
                console.log(etherValue);
                return (
                  <div className="flex  text-xl bg-yellow-100 bg-opacity-20 backdrop-blur-lg rounded drop-shadow-lg py-2 mr-5 mb-3">
                    <div className="text-blue-500 w-6  p-2 ">{index + 1}</div>
                    <div className="emp_name text-white w-64  p-2">
                      {employee.name}
                    </div>
                    <div className="emp_sal text-green-400 w-30  p-2">
                      {etherValue}
                    </div>
                    <div
                      className="change_sal_btn bg-yellow-300 hover:bg-yellow-500 p-2 mx-5 rounded-lg font-semibold "
                      onClick={() => {
                        setEmpWallet(employee.wallet);
                        navigate("/changesalary");
                      }}
                    >
                      Change Salary
                    </div>
                    <div
                      className="remove_employees_btn bg-red-400 hover:bg-red-500 p-2 rounded-lg font-semibold"
                      onClick={async () => {
                        setLoaded(false);
                        await removeEmployee(employee.wallet);
                        setLoaded(true);
                      }}
                    >
                      Remove
                    </div>
                  </div>
                );
              })}
              <div className="list_breaker"></div>
            </div>
          </Col>
        </Row>
      </div>
    );
  else return <Loader />;
}

export default Company;
