import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../style/AddRental.css";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";
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
import Account from "../../../components/Account";
import styled from "styled-components";
import logo from "../../../images/dimori-logo.png";
import bg from "../../../images/add-bg.png";

import DimoriSmartContract from "../../../artifacts/contracts/DimoriMain.sol/DimoriMain.json";
import {
  contractAddress,
  networkDeployedTo,
} from "../../../utils/contracts-config";
import networksMap from "../../../utils/networksMap.json";
const client = require("ipfs-http-client");

const projectId = "2HrcvAMNAkZmAGwQO6CfyZPWAw0"; // <---------- your Infura Project ID

const projectSecret = "924de794db26653232257f0e12208ecd"; // <---------- your Infura Secret
// (for security concerns, consider saving these values in .env files)

const CustomFormControl = styled(FormControl)`
  && {
    color: #000;
  }
  .MuiInput-underline:before {
    border-bottom-color: #000;
    color: #000;
  }

  .MuiFormLabel-root.Mui-focused {
    color: #000;
  }
`;
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const ipfsClient = client.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

const ipfsBaseUrl = "https://ipfs.io/ipfs/";

const AddRental = () => {
  let navigate = useNavigate();

  const data = useSelector((state) => state.blockchain.value);
  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formInput, setFormInput] = useState({
    name: "",
    city: "",
    theme: "",
    contactAddress: "",
    latitude: "",
    longitude: "",
    description: "",
    numberGuests: 0,
    pricePerDay: 0,
  });

  const getInitialState = () => {
    const value = "";
    return value;
  };

  const [themeValue, setthemeValue] = useState(getInitialState);

  const [roomSizeValue, setroomSizeValue] = useState(getInitialState);

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

  const addRental = async () => {
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
          //handle images
          const addedFile = await ipfsClient.add(image);
          const imageURI = ipfsBaseUrl + addedFile.path;
          const add_tx = await DimoriContract.addRental(
            formInput.name,
            formInput.city,
            themeValue,
            formInput.contactAddress,
            formInput.latitude,
            formInput.longitude,
            formInput.description,
            imageURI,
            parseInt(roomSizeValue),
            utils.parseEther(formInput.pricePerDay, "ether"),
            { value: listingFee }
          );

          await add_tx.wait();

          setImage(null);
          setLoading(false);
          navigate("/#/your-rentals");
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
        <h2 class="headerText">Add your Rental</h2>
        <div className="lrContainers">
          <Account />
        </div>
      </div>
      <hr className="line1" />
      <div className="addRentalContent row">
        <div className="row">
          <div className="rentalContent col-8">
            <table className="pure-table pure-table-horizontal marginTable">
              <tr>
                <td>
                  <Form.Control
                    type="text"
                    placeholder="Tên chi? (Name)"
                    onChange={(e) => {
                      setFormInput({ ...formInput, name: e.target.value });
                    }}
                    required={true}
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    maxLength={30}
                    placeholder="Ở mô? (City)"
                    onChange={(e) => {
                      setFormInput({ ...formInput, city: e.target.value });
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <CustomFormControl
                    variant="standard"
                    sx={{ m: 1, minWidth: 600 }}
                  >
                    <InputLabel id="theme-standard-label">
                      Tụi bây có chi vui (Theme)
                    </InputLabel>
                    <Select
                      value={themeValue}
                      onChange={(e) => {
                        setthemeValue(e.target.value);
                      }}
                      required
                      style={{ color: "#000" }}
                    >
                      <MenuItem value="Peace">Peace</MenuItem>
                      <MenuItem value="Village">Village</MenuItem>
                      <MenuItem value="Royal">Royal</MenuItem>
                      <MenuItem value="Nature">Nature</MenuItem>
                      <MenuItem value="Arts">Arts</MenuItem>
                      <MenuItem value="Green">Green</MenuItem>
                      <MenuItem value="History">History</MenuItem>
                    </Select>
                  </CustomFormControl>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <Form.Control
                    type="text"
                    maxLength={255}
                    placeholder="Ở lộ mô? (Address)"
                    onChange={(e) => {
                      setFormInput({
                        ...formInput,
                        contactAddress: e.target.value,
                      });
                    }}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <Form.Control
                    type="text"
                    maxLength={30}
                    placeholder="Kinh độ (Longtitude)"
                    onChange={(e) => {
                      setFormInput({ ...formInput, latitude: e.target.value });
                    }}
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    maxLength={30}
                    placeholder="Vĩ độ (Latitude)"
                    onChange={(e) => {
                      setFormInput({ ...formInput, longitude: e.target.value });
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    maxLength={2000}
                    placeholder="Kể coi tụi bây có chi? (Description)"
                    onChange={(e) => {
                      setFormInput({
                        ...formInput,
                        description: e.target.value,
                      });
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <CustomFormControl variant="standard" sx={{ minWidth: 150 }}>
                    <InputLabel id="theme-standard-label">
                      Phòng ni chứa được mấy người (max-number of this room)
                    </InputLabel>
                    <Select
                      value={roomSizeValue}
                      onChange={(e) => {
                        setroomSizeValue(e.target.value);
                      }}
                      required
                      style={{ color: "#000" }}
                    >
                      <MenuItem value="1">1</MenuItem>
                      <MenuItem value="2">2</MenuItem>
                      <MenuItem value="3">3</MenuItem>
                      <MenuItem value="4">4</MenuItem>
                      <MenuItem value="5">5</MenuItem>
                      <MenuItem value="6">6</MenuItem>
                      <MenuItem value="7">7</MenuItem>
                      <MenuItem value="8">8</MenuItem>
                      <MenuItem value="9">9</MenuItem>
                      <MenuItem value="10">10</MenuItem>
                      <MenuItem value="100">Thoải mái đê em êi</MenuItem>
                    </Select>
                  </CustomFormControl>
                </td>
                <td>
                  <Form.Control
                    type="number"
                    min={0}
                    placeholder="Một ngày trả bây mấy $ (Price)"
                    onChange={(e) =>
                      setFormInput({
                        ...formInput,
                        pricePerDay: e.target.value,
                      })
                    }
                  />
                </td>
              </tr>
            </table>
          </div>
          <div className="col-3 detailImg">
            <table
              className="pure-table pure-table-horizontal"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <tbody>
                <tr>
                  <td>
                    <Form.Control
                      type="file"
                      name="file"
                      onChange={(e) => {
                        getImage(e);
                      }}
                      className="rounded mt-4"
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    {imagePreview && (
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <img
                          className="rounded mt-4"
                          width="350"
                          src={URL.createObjectURL(imagePreview)}
                          style={{ margin: "0 15% 0 15%", display: "block" }}
                        />
                      </div>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="buttonContainerCenter">
                      <Button
                        type="submit"
                        variant="contained"
                        style={{ backgroundColor: "#00afd1" }}
                        onClick={addRental}
                      >
                        {loading ? <CircularProgress color="inherit" /> : "Add"}
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddRental;
