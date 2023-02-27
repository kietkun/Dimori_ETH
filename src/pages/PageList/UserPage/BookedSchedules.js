import React, { useState, useEffect } from "react";
import "../../style/BookedSchedules.css";
import { Link } from "react-router-dom";
import { ethers, utils } from "ethers";
import logo from "../../../images/dimori-logo.png";
import { useSelector } from "react-redux";
import Account from "../../../components/Account";
import RentalsMap from "../../../components/RentalsMap";

import DimoriSmartContract from "../../../artifacts/contracts/DimoriMain.sol/DimoriMain.json";
import { contractAddress } from "../../../utils/contracts-config";
import BookedSchedule from "../../Page/UserPage/BookedSchedule";

const BookedSchedules = () => {
  
  const data = useSelector((state) => state.blockchain.value);

  const [rentalsList, setRentalsList] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [highLight, setHighLight] = useState();

  const getRentalsList = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const DimoriContract = new ethers.Contract(
      contractAddress,
      DimoriSmartContract.abi,
      signer
    );
    const _bookedSchedules = await DimoriContract.getRentalBookings();
    const _bookedSchedulesFiltered = _bookedSchedules.filter(
      (b) =>
        b[3] == data.account && b[6] == false && b[7] == false && b[8] == false
    );
    const _bookedList = [];
    await Promise.all(
      _bookedSchedulesFiltered.map(async (r) => {
        let rental = await DimoriContract.getRentalInfo(parseInt(r[1]));
        if (rental.length !== 0) {
          const item = {
            id: Number(r[0]),
            name: rental[2],
            city: rental[3],
            theme: rental[4],
            address: rental[5],
            imgUrl: rental[9],
            startDate: new Date(Number(r[4]) * 1000),
            endDate: new Date(Number(r[5]) * 1000),
            bookedPeriod: ((r[5] - r[4]) / 86400),
            price: utils.formatUnits(rental[11], "ether")
          };
          _bookedList.push(item);
        }
      })
    );
    setRentalsList(_bookedList);
    // let cords = _bookedSchedulesFiltered.map((r) => {
    //   let rental = DimoriContract.getRentalInfo(parseInt(r[1]));
    //   return {
    //     lat: Number(rental[6]),
    //     lng: Number(rental[7]),
    //   };
    // });
    // setCoordinates(cords);
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
          <h2 className="headerText">Your Booked Schedules</h2>
        </div>
        <div className="lrContainers">
          <Account  />
        </div>
      </div>
      <div className="rentalsContent">
        <div className="rentalsContentL">
          <div style={{ textAlign: "center" }}>
            <p className="headerText">Rentals on maps</p>
          </div>
          <RentalsMap
            locations={coordinates}
            setHighLight={setHighLight}
            style={{ border: "2px dotted #a1eded" }}
          />
        </div>
        <div className="rentalsContentR">
          {rentalsList.length !== 0 ? (
            rentalsList.map((e, i) => {
              return (
                <>
                  <br />
                  <div
                    className={highLight == i ? "rentalDivH " : "rentalDiv"}
                    key={i}
                  >
                    <BookedSchedule
                    rentalInfo={e}
                  />
                  </div>
                </>
              );
            })
          ) : (
            <div
              style={{
                textAlign: "center",
                paddingTop: "30%",
                color: "InactiveCaptionText",
              }}
            >
              <p style={{ color: "#00aed0" }}>You have no reservation yet</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BookedSchedules;
