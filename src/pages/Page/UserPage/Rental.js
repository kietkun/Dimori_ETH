import React, { useState, useEffect } from "react";
import BookingInfo from "../../Popup/User/BookingInfo";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

const Rental = ({ rental, bookingInfo, searchFilters }) => {
  const [showBookingInfo, setShowBookingInfo] = useState(false);
  const handleCloseBookingInfo = () => setShowBookingInfo(false);
  const handleShowBookingInfo = () => setShowBookingInfo(true);
  return (
    <>
      <div className="rentalDiv">
        <div className="imgDiv">
          <img className="rentalImg" src={rental.imgUrl}></img>
        </div>
        <div className="rentalInfo">
          <div className="rentalTitle">{rental.name.toUpperCase()}</div>
          <div className="rentalInformation">
            <table>
              <tr>
                <td>Cái này ở : {rental.city}</td>
                <td>Không gian thì là : {rental.theme} </td>
              </tr>
              <tr>
                <td colSpan={2}>Cụ thể nó ở : {rental.address}</td>
              </tr>
              <tr>
                <td colSpan={2}>Thông tin sơ bộ như này</td>
              </tr>
              <tr>
                <td colSpan={2}>
                  {rental.description.length > 255
                    ? rental.description.substring(0, 255) + " ..."
                    : rental.description}
                </td>
              </tr>
            </table>
          </div>
          <br></br>
          <div className="price">Room Size : {rental.roomSize} people</div>
          <div className="price">Price : {rental.price}$ per day</div>
          <div className="bottomButton">
            <Link
              to={"../home-by-renter"}
              state={{
                searchFilters: searchFilters,
                renterWallet: rental.renterWallet,
              }}
              style={
                window.location.href.toString().includes("home-by-renter")
                  ? { display: "none" }
                  : { visibility: "content" }
              }
            >
              <div role="button" className="btn btn-primary">
                More room of this renter
              </div>
            </Link>
            &nbsp;
            <a
              role="button"
              className="btn btn-primary"
              onClick={handleShowBookingInfo}
            >
              Stay here
            </a>
          </div>
          <Modal
            show={showBookingInfo}
            onHide={handleCloseBookingInfo}
            size="xl"
            centered
            scrollable
            animation
            dialogClassName="detail-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title>Booking Info</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <BookingInfo rentalInfo={rental} bookingInfo={bookingInfo} />
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Rental;
