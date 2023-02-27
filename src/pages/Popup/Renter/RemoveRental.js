import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../style/RentalPopup.css";
import "bootstrap/dist/css/bootstrap.css";
import { ethers } from "ethers";
import { Buffer } from "buffer";
import { Button, CircularProgress } from "@mui/material";
import DimoriSmartContract from "../../../artifacts/contracts/DimoriMain.sol/DimoriMain.json";
import { contractAddress, networkDeployedTo } from "../../../utils/contracts-config";
import networksMap from "../../../utils/networksMap.json";

const RemoveRental = ({ rental }) => {
  let navigate = useNavigate();

  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  const signer = provider.getSigner();
  const DimoriContract = new ethers.Contract(
    contractAddress,
    DimoriSmartContract.abi,
    signer
  );

  const data = useSelector((state) => state.blockchain.value);
  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const getInitialState = () => {
    const value = "";
    return value;
  };

  const getImage = async (e) => {
    e.preventDefault();
    const reader = new window.FileReader();
    const file = e.target.files[0];

    if (file !== undefined) {
      reader.readAsArrayBuffer(file);

      reader.onloadend = () => {
        const buf = Buffer(reader.result, "base64");
        setImage(buf);
        setImagePreview(file);
      };
    }
  };

  const removeRental = async () => {
    if (data.network === networksMap[networkDeployedTo]) {
      if (image !== undefined && window.ethereum !== undefined) {
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
          const listingFee = DimoriContract.callStatic.listingFee();
          const add_tx = await DimoriContract.removeHome(parseInt(rental.id));
          await add_tx.wait();

          setImage(null);
          setLoading(false);

          navigate("/#/your-rentals");
        } catch (err) {
          window.alert("Couldn't remove this rental. Please try again!");
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
      <div className="popupRentalContent row">
        <div className="row">
          <div className="popupContent col-7">
            <table
              className="pure-table pure-table-horizontal"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <tbody>
                <tr>
                  <td className="label">Name : </td>
                  <td className="labelDetail">{rental.name}</td>
                  <td className="label">City : </td>
                  <td className="labelDetail">{rental.city}</td>
                </tr>
                <tr>
                  <td className="label">Theme : </td>
                  <td className="labelDetail">{rental.theme}</td>
                  <td className="label">Contact Address : </td>
                  <td className="labelDetail">{rental.address}</td>
                </tr>
                <tr>
                  <td colSpan={4} className="label">
                    Description :{" "}
                  </td>
                </tr>
                <tr>
                  <td colSpan={4} className="labelDetail">
                    {rental.description}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-4 detailImg">
            <img
              className="rounded mt-4"
              width="350"
              src={rental.imgUrl}
            />
          </div>
          <p className="label">Are you sure to remove this Rental?</p>
        </div>
      </div>
      <div className="buttonContainerCenter">
        
        <Button
          type="submit"
          variant="contained"
          className="removeButton"
          onClick={removeRental}
        >
          {loading ? <CircularProgress color="inherit" /> : "Remove"}
        </Button>
      </div>
    </>
  );
};

export default RemoveRental;
