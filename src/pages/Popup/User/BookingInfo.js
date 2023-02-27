import React, { useState } from "react";
import "../../style/RentalPopup.css";
import "bootstrap/dist/css/bootstrap.css";
import { ethers, utils } from "ethers";

import DimoriSmartContract from "../../../artifacts/contracts/DimoriMain.sol/DimoriMain.json";
import {
  contractAddress,
  networkDeployedTo,
} from "../../../utils/contracts-config";
import networksMap from "../../../utils/networksMap.json";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { TextField, Button, CircularProgress } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const BookingInfo = ({ rentalInfo, bookingInfo }) => {
  const [info, setInfo] = useState({
    destination: "",
    checkIn: new Date(bookingInfo.checkIn),
    checkOut: new Date(bookingInfo.checkOut),
  });

  let navigate = useNavigate();
  const data = useSelector((state) => state.blockchain.value);
  const [loading, setLoading] = useState(false);

  const _datefrom = Math.floor(info.checkIn / 1000);
  const _dateto = Math.floor(info.checkOut / 1000);

  const dayToSeconds = 86400;
  const stayDays =
    _dateto - _datefrom === 0 ? dayToSeconds : _dateto - _datefrom;
  const bookPeriod = stayDays / dayToSeconds;

  const bookProperty = async (_id, _price) => {
    if (data.network === networksMap[networkDeployedTo]) {
      try {
        setLoading(true);
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        const signer = provider.getSigner();
        const DimoriContract = new ethers.Contract(
          contractAddress,
          DimoriSmartContract.abi,
          signer
        );

        const totalBookingPriceUSD = Number(_price) * bookPeriod;
        const totalBookingPriceETH = await DimoriContract.convertFromUSD(
          utils.parseEther(totalBookingPriceUSD.toString(), "ether")
        );

        const book_tx = await DimoriContract.bookDates(
          _id,
          _datefrom,
          _dateto,
          { value: totalBookingPriceETH }
        );
        await book_tx.wait();

        setLoading(false);
        navigate("/#/booked-schedules");
      } catch (err) {
        setLoading(false);
        var x = err.message;
        console.log(x);
        window.alert("An error has occured, please try again");
      }
    } else {
      setLoading(false);
      window.alert(
        `Please Switch to the ${networksMap[networkDeployedTo]} network`
      );
    }
  };

  return (
    <>
      <div className="popupRentalContent">
        <div className="row">
          <div className="col-6">
            <table
              className="pure-table pure-table-horizontal"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <tbody>
                <tr>
                  <td className="label">Room-Name : </td>
                  <td className="labelDetail">{rentalInfo.name}</td>
                  <td className="label">Theme : </td>
                  <td className="labelDetail">{rentalInfo.theme}</td>
                </tr>
                <tr>
                  <td className="label">City : </td>
                  <td className="labelDetail">{rentalInfo.city}</td>
                  <td className="label">Address : </td>
                  <td className="labelDetail">{rentalInfo.address}</td>
                </tr>
                <tr>
                  <td className="label" colSpan={4}>
                    Description :{" "}
                  </td>
                </tr>
                <tr>
                  <td className="labelDetail" colSpan={4}>
                    {rentalInfo.description}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-4">
            <img
              className="rounded mt-4"
              width="350"
              src={rentalInfo.imgUrl}
              style={{ margin: "0 15% 0 15%" }}
            />
          </div>
        </div>
        <div>
          <div className="price-pop">Room Size : {rentalInfo.roomSize}</div>
          <div className="price-pop">
            Total Price : {parseInt(bookPeriod) * parseInt(rentalInfo.price)} $
          </div>
        </div>
        <div className="buttonContainerEnd">
          <div className="price-pop">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                inputFormat="dd/MM/yyyy"
                value={info.checkIn}
                onChange={(newValue) => {
                  setInfo({ ...info, checkIn: newValue });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{
                      svg: { color: "#00aed0" },
                      input: { color: "#00aed0" },
                      width: '150px',
                      height: '30px',
                    }}
                  />
                )}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                inputFormat="dd/MM/yyyy"
                value={info.checkOut}
                onChange={(newValue) => {
                  setInfo({ ...info, checkOut: newValue });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{
                      svg: { color: "#00aed0" },
                      input: { color: "#00aed0" },
                      width: '150px',
                      height: '30px'
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </div>
          <Button
            variant="contained"
            style={{ backgroundColor: "#00aed0" }}
            onClick={() => {
              bookProperty(rentalInfo.id, rentalInfo.price);
            }}
          >
            {loading ? <CircularProgress color="inherit" /> : "Book"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default BookingInfo;
