import DimoriSmartContract from "../../../artifacts/contracts/DimoriMain.sol/DimoriMain.json";
import { contractAddress } from "../../../utils/contracts-config";
import { ethers, utils } from "ethers";
import { useState, useEffect } from "react";
import Account from "../../../components/Account";
import Rental from "../../Page/UserPage/Rental";
import SearchIcon from "@mui/icons-material/Search";
import logo from "../../../images/dimori-logo.png";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";

const HomesByRenter = () => {
  const { state: states } = useLocation();
    console.log(states);
    const searchFilters = states.searchFilters;
  const [rentalsList, setRentalsList] = useState([]);
  const getRentalsList = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const DimoriContract = new ethers.Contract(
      contractAddress,
      DimoriSmartContract.abi,
      signer
    );

    const rentals = await DimoriContract.getRentals();
    const items = rentals
      .filter((r) => r[1] == states.renterWallet)
      .map((r) => {
        return {
          id: Number(r[0]),
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
    setRentalsList(items);
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
        <a role="button">
          <div className="searchReminder">
            <div className="filter">{searchFilters.destination}</div>
            <div className="vl" />
            <div className="filter">
              {`${searchFilters.checkIn.toLocaleString("default", {
                month: "short",
              })} ${searchFilters.checkIn.toLocaleString("default", {
                day: "2-digit",
              })}  -  ${searchFilters.checkOut.toLocaleString("default", {
                month: "short",
              })}  ${searchFilters.checkOut.toLocaleString("default", {
                day: "2-digit",
              })} `}
            </div>
            <div className="vl" />
            <div className="filter">{searchFilters.theme} Theme</div>
            <div className="searchFiltersIcon">
              <SearchIcon sx={{ color: "#fff" }} />
            </div>
          </div>
        </a>
        <div className="lrContainers">
          <Account  />
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
                        checkIn: searchFilters.checkIn.getTime(),
                        checkOut: searchFilters.checkOut.getTime(),
                      }}
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

export default HomesByRenter;
