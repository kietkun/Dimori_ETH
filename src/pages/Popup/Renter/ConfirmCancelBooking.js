import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../style/BookedSchedules.css";
import "bootstrap/dist/css/bootstrap.css";
import { ethers, utils } from "ethers";
import { Buffer } from "buffer";
import { Form } from "react-bootstrap";
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import DimoriSmartContract from "../../../artifacts/contracts/DimoriMain.sol/DimoriMain.json";
import {
  contractAddress,
  networkDeployedTo,
} from "../../../utils/contracts-config";
import networksMap from "../../../utils/networksMap.json";

const ConfirmCancelBooking = ({ bookingInfo }) => {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const data = useSelector((state) => state.blockchain.value);

  const confirmCancelBooking = async () => {
    if (data.network === networksMap[networkDeployedTo]) {
      if (window.ethereum !== undefined) {
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
          
          const totalBookingPriceUSD = Number(bookingInfo.price) * bookingInfo.bookedPeriod;
          
          const totalBookingPriceETH = await DimoriContract.convertFromUSD(
            utils.parseEther(totalBookingPriceUSD.toString(), "ether")
          );

          console.log(totalBookingPriceETH)
          const add_tx = await DimoriContract.confirmCancelBooking(
            bookingInfo.id,
            { value: totalBookingPriceETH }
          );

          await add_tx.wait();
          setLoading(false);

          navigate("/#/booked-schedules");
        } catch (err) {
          window.alert("An error has occured");
          setLoading(false);
          console.log(err);
        }
      } else {
        window.alert("Please Install Metamask");
      }
    } else {
      window.alert(
        `Please Switch to the ${networksMap[networkDeployedTo]} network`
      );
    }
  };

  return (
    <>
      <div className="confirmCancelBookingContent">
        <div
          className="confirmCancelBookingContentL"
          style={{ alignItems: "center" }}
        >
          <h2 className="headerText">Cancel Booking</h2>
          <p style={{ textAlign: "center" }}>
            Are you sure to confirm cancel this booking?
          </p>
          <div style={{ textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: "#00afd1" }}
              onClick={confirmCancelBooking}
            >
              {loading ? <CircularProgress color="inherit" /> : "Cancel"}
            </Button>
          </div>
          <br />
        </div>
      </div>
    </>
  );
};

export default ConfirmCancelBooking;
