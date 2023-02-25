import React, { useState, useEffect } from "react";
import "../../style/BookedSchedules.css";
import { Link } from "react-router-dom";
import { ethers, utils } from "ethers";
import logo from "../../../images/dimori-logo.png";
import { useSelector } from "react-redux";
import Account from "../../../components/Account";

import DimoriSmartContract from "../../../artifacts/contracts/DimoriMain.sol/DimoriMain.json";
import { contractAddress } from "../../../utils/contracts-config";
import RenterBookingSchedule from "../../Page/RenterPage/RenterBookingSchedule";

const RenterBookingSchedules = () => {
  const data = useSelector((state) => state.blockchain.value);

  const [rentalsList, setRentalsList] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [highLight, setHighLight] = useState();
  
  var url = new URL(document.URL);
  let hash = url.hash;
  let id = hash.substring(hash.lastIndexOf("?") + 4, hash.length);

  const getRentalsList = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const DimoriContract = new ethers.Contract(
      contractAddress,
      DimoriSmartContract.abi,
      signer
    );

    const myRentals = [];
    let bookings = await DimoriContract.getRentalBookings();
    let _mybookings = bookings.filter(
      (b) =>
        b[2] === data.account &&
        b[6] === false &&
        b[7] === false &&
        b[8] === false
    );
    await Promise.all(
      _mybookings.map(async (r) => {
        let _rentals = await DimoriContract.getRentalInfo(r[1]);

        if (_rentals.length !== 0) {
          const item = {
            id: Number(r[0]),
            name: _rentals[2],
            city: _rentals[3],
            theme: _rentals[4],
            address: _rentals[5],
            imgUrl: _rentals[9],
            startDate: new Date(Number(r[4]) * 1000),
            endDate: new Date(Number(r[5]) * 1000),
            bookedPeriod: (r[5] - r[4]) / 86400,
            price: utils.formatUnits(_rentals[11], "ether"),
          };
          myRentals.push(item);
        }
      })
    );

    setRentalsList(myRentals);
    let rentals = await DimoriContract.getRentalInfo(_mybookings[0][1]);
    let cords = rentals.map((r) => {
      return {
        lat: Number(r[6]),
        lng: Number(r[7]),
      };
    });
    setCoordinates(cords);
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
        <h2 class="headerText">Booked schedules of your homes</h2>
        <div className="lrContainers">
          <Account  />
        </div>
      </div>
      <hr className="line" />
      <div className="rentalsContent" class="newContainer">
        {rentalsList.length !== 0 ? (
          rentalsList.map((e, i) => {
            return (
              <>
                <br />
                <div className="itemDiv" key={i}>
                  <div className={highLight == i ? "rentalDivH " : "rentalDiv"}>
                    <RenterBookingSchedule bookingInfo={e} />
                  </div>
                </div>
              </>
            );
          })
        ) : (
          <div style={{ textAlign: "center", paddingTop: "30%" }}>
            <p>There are no booking on this home yet</p>
          </div>
        )}
      </div>
    </>
  );
};

export default RenterBookingSchedules;
