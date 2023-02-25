import React, { useState, useEffect } from "react";
import "../../style/YourRentals.css";
import { Link } from "react-router-dom";
import { ethers, utils } from "ethers";
import logo from "../../../images/dimori-logo.png";
import { useSelector } from "react-redux";
import Account from "../../../components/Account";
import YourRental from "../../Page/RenterPage/YourRental";

import DimoriSmartContract from "../../../artifacts/contracts/DimoriMain.sol/DimoriMain.json";
import { contractAddress } from "../../../utils/contracts-config";

const YourRentals = () => {
  const data = useSelector((state) => state.blockchain.value);

  const [propertiesList, setPropertiesList] = useState([]);

  const getRentalsList = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const DimoriContract = new ethers.Contract(
      contractAddress,
      DimoriSmartContract.abi,
      signer
    );

    const rentals = await DimoriContract.getRentals();
    const user_properties = rentals.filter((r) => r[1] == data.account);

    const items = user_properties.map((r) => {
      return {
        id: r[0],
        name: r[2],
        city: r[3],
        theme: r[4],
        address: r[5],
        latitude: r[6],
        longitude: r[7],
        description: r[8],
        imgUrl: r[9],
        maxGuests: r[10],
        price: utils.formatUnits(r[11], "ether"),
      };
    });
    setPropertiesList(items);
  };

  useEffect(() => {
    getRentalsList();
  }, [data.account]);

  return (
    <>
      <div className="topBanner">
        <div>
          <Link to="/">
            <img
              className="logo"
              src={logo}
              alt="logo"
              style={{ height: "auto" }}
            ></img>
          </Link>
        </div>
        <div>
          <h2 className="headerText">Your Rentals</h2>
        </div>
        <div className="lrContainers">
          <Account  />
        </div>
      </div>
      <hr className="line1" />
      <div className="rentalsContent">
        <div className="newContainer">
        {propertiesList.length !== 0 ? (
          propertiesList.map((e, i) => (
            <>
              <br />
              <div className="itemDiv" key={i}>
                <YourRental rental={e} />
              </div>
            </>
          ))
        ) : (
          <div
            style={{
              textAlign: "center",
              paddingTop: "10%",
              paddingBottom: "10%",
            }}
          >
            <p style={{ color: "whitesmoke" }}>You have no rentals listed</p>
          </div>
        )}
        </div>
      </div>
    </>
  );
};
export default YourRentals;
