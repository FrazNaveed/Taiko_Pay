import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { EthersContext } from "../Context/EthersContext";
import "../Styles/Welcome.css";
import heroImage from "../images/hero-image.webp";

const companyCommonStyles =
  "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Welcome = () => {
  const { isEmployer, registerCompany, connectWallet } =
    useContext(EthersContext);
  const [employerStatus, setEmployerStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkEmployerStatus = async () => {
      try {
        const res = await isEmployer();
        setEmployerStatus(res);
      } catch (error) {
        console.error("Error checking employer status:", error);
        setEmployerStatus(false);
      }
    };
    checkEmployerStatus();
  }, [isEmployer]);

  const handleCreate = async () => {
    let res = await registerCompany();
    if (!res) {
      alert("Something went wrong please try again later");
    }
  };

  const handleClaimSalary = async () => {
    try {
      // Your claim salary logic
    } catch (error) {
      console.error("Error claiming salary:", error);
    }
  };

  return (
    <div className="wel_main">
      <div className="wel_sub">
        <Row>
          <Col sm={9} xs={10} lg={6} md={6}>
            <div className="flex flex-1 justify-start items-start flex-col mf:mr-10 w-full mb-20">
              <h1 className="text-3xl sm:text-5xl font-bold text-transparent bg-pink-600 bg-clip-text py-1">
                Seamless financial services
                <br /> at zero fee.
              </h1>
            </div>

            <div>
              <div className="window">
                <div className="content">
                  {employerStatus === null ? (
                    <p>Checking status...</p>
                  ) : employerStatus ? (
                    <div>
                      <button
                        className="ghost-round full-width"
                        onClick={() => navigate("/company")}
                      >
                        Access Dashboard
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h4>Make an account & start paying your team members</h4>
                      <div className="input-fields my-7">
                        {/* Input field for company name */}
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
                  )}
                </div>
              </div>
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
