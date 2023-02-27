import React, { useState, useEffect } from "react";
import "../../style/Rentals.css";
import { Link } from "react-router-dom";
import { ethers, utils } from "ethers";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import logo from "../../../images/dimori-logo.png";
import Account from "../../../components/Account";
import Rental from "../../Page/UserPage/Rental";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TextField } from "@mui/material";
import DimoriSmartContract from "../../../artifacts/contracts/DimoriMain.sol/DimoriMain.json";
import { contractAddress } from "../../../utils/contracts-config";

const Rentals = () => {
  const { state: searchFilters } = useLocation();
  const [rentalsList, setRentalsList] = useState([]);

  const [info, setInfo] = useState({
    destination: searchFilters.destination,
    checkIn: new Date(searchFilters.checkIn.getTime()),
    checkOut: new Date(searchFilters.checkOut.getTime()),
    theme: searchFilters.theme,
  });

  const getInitialState = () => {
    const value = "";
    return value;
  };

  const [value, setValue] = useState(getInitialState);
  const data = useSelector((state) => state.blockchain.value);
  const getRentalsList = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const DimoriContract = new ethers.Contract(
      contractAddress,
      DimoriSmartContract.abi,
      signer
    );

    const rentals = await DimoriContract.getRentals();
    const items = rentals.map((r) => {
      return {
        id: Number(r[0]),
        renterWallet: r[1],
        name: r[2],
        city: r[3],
        theme: r[4],
        address: r[5],
        description: r[8],
        imgUrl: r[9],
        roomSize: parseInt(r[10]),
        price: utils.formatUnits(r[11], "ether"),
      };
    });

    const matchedItems = items.filter(
      (p) =>
        p.city.toLowerCase().includes(info.destination.toLowerCase()) &&
        p.theme.toLowerCase().includes(info.theme.toLowerCase())
    );
    setRentalsList(matchedItems);
  };

  useEffect(() => {
    getRentalsList();
  }, []);

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
        <div className="searchReminder">
          <div className="inputs">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                inputFormat="dd/MM/yyyy"
                value={info.checkIn}
                onChange={(newValue) => {
                  setInfo({ ...info, checkIn: newValue });
                }}
                renderInput={(params) => (
                  <TextField
                  variant="standard"
                    {...params}
                    sx={{
                      svg: { color: "#00aed0" },
                      input: { color: "#00aed0" },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </div>

          <div className="vl" />
          <div className="inputs">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                inputFormat="dd/MM/yyyy"
                value={info.checkOut}
                onChange={(newValue) => {
                  setInfo({ ...info, checkOut: newValue });
                }}
                renderInput={(params) => (
                  <TextField
                    variant="standard"
                    {...params}
                    sx={{
                      svg: { color: "#00aed0" },
                      input: { color: "#00aed0" },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </div>
        </div>
        <div className="lrContainers">
          <Account />
        </div>
      </div>
      <hr className="line" />
      <div className="rentalsContent">
        <div className="newContainer">
          {rentalsList.length !== 0 ? (
            rentalsList.map((e, i) => {
              return (
                <>
                  <br />
                  <div className="itemDiv" key={i}>
                    <Rental
                      rental={e}
                      bookingInfo={{
                        checkIn: info.checkIn.getTime(),
                        checkOut: info.checkOut.getTime(),
                      }}
                      searchFilters={searchFilters}
                    />
                  </div>
                </>
              );
            })
          ) : (
            <div
              style={{
                textAlign: "center",
                paddingTop: "10%",
                paddingBottom: "10%",
              }}
            >
              <p style={{ color: "whitesmoke" }}>
                No rentals found for your search
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Rentals;
