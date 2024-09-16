import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { EthersContext } from "../Context/EthersContext";
import "../Styles/Welcome.css";
import heroImage from "../images/hero-image.webp";

const companyCommonStyles =
  "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Welcome = () => {
  const {
    isEmployee,
    registerCompany,
    getName,
    currentAccount,
    connectWallet,
  } = useContext(EthersContext);
  const [Selection, setSelection] = useState(true);
  const [Name, setName] = useState();
  const [Rname, setRname] = useState("");
  const navigate = useNavigate();

  // useEffect(() => {
  //   initiator();
  // }, []);
  // const initiator = async () => {
  //   let name = await getName();
  //   if (name) setRname(name);
  // };

  const handleCreate = async () => {
    let res = await registerCompany();
    if (res) setSelection(false);
    else alert("Something went wrong please try again later");
  };

  const handleClaimSalary = async () => {
    try {
    } catch (error) {
      console.error("Error claiming salary:", error);
    }
  };

  return (
    <div className="wel_main ">
      <div className="wel_sub">
        <Row>
          <Col sm={9} xs={10} lg={6} md={6}>
            <div className="flex flex-1 justify-start items-start flex-col mf:mr-10 w-full mb-20">
              {" "}
              {/* Added mb-4 for margin-bottom */}
              <h1 className="text-3xl sm:text-5xl font-bold text-transparent bg-pink-600 bg-clip-text py-1">
                Seemless financial services
                <br /> at zero fee.
              </h1>
            </div>

            <div>
              {currentAccount ? (
                Rname == "" ? (
                  <div className="window">
                    <div className="content">
                      <h4>Make an account & start paying your team members</h4>
                      <div className="input-fields my-7">
                        {/* <input
                          type="text"
                          placeholder="Name of the Company"
                          className="input-line full-width"
                          onChange={(e) => setName(e.target.value)}
                        /> */}
                      </div>
                      <div>
                        <button
                          className="ghost-round full-width"
                          onClick={handleCreate}
                        >
                          Register Company
                        </button>
                      </div>
                      <h4>Or</h4>
                      <h4 className="mt-5">Claim your salary</h4>
                      <div>
                        <button
                          className="ghost-round full-width"
                          onClick={handleClaimSalary}
                        >
                          Claim Salary
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="window">
                    <div className="content">
                      <div>
                        <button
                          className="ghost-round full-width"
                          onClick={() => navigate("/company")}
                        >
                          Access Dashboard
                        </button>
                      </div>
                    </div>
                    <div className="text-center text-white space2">
                      Signed In as {Rname}
                    </div>
                  </div>
                )
              ) : (
                <div>
                  <button
                    className="button-63 bg-pink-600"
                    role="button"
                    onClick={connectWallet}
                  >
                    Connect Wallet{" "}
                  </button>
                </div>
              )}
            </div>
          </Col>

          <Col sm={9} xs={10} lg={6} md={6} className="wel_left">
            <img src={heroImage} alt="hero-image" />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Welcome;
