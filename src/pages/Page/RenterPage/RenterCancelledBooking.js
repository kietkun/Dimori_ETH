import { Modal } from "react-bootstrap";
import React, { useState } from "react";
import ConfirmCancelBooking from "../../Popup/Renter/ConfirmCancelBooking";

const RenterCancelledBooking = ({ bookingInfo }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <div className="divScheduleImg">
        <img className="scheduleImg" src={bookingInfo.imgUrl}></img>
      </div>
      <div className="rentalInfo">
        <div className="rentalTitle">{bookingInfo.name.toUpperCase()}</div>
        <div className="rentalInformation">
          <div className="rentalDesc">ở in {bookingInfo.city} á nè</div>
          <div className="rentalDesc">
            màu (theme) {bookingInfo.theme} thấy được không
          </div>
          <div className="rentalDesc">
            tau để địa chỉ ở đây (at) {bookingInfo.address}
          </div>
          <div className="rentalDesc">
            Mi đã đặt chỗ ở tụi tau ngày ni nì (Booked dates):
            {` ${bookingInfo.startDate.toLocaleString("default", {
              month: "short",
            })} ${bookingInfo.startDate.toLocaleString("default", {
              day: "2-digit",
            })}  -  ${bookingInfo.endDate.toLocaleString("default", {
              month: "short",
            })}  ${bookingInfo.endDate.toLocaleString("default", {
              day: "2-digit",
            })} `}
          </div>
        </div>

        <br />
        <div className="price">
          {bookingInfo.bookedPeriod * bookingInfo.price}$ for{" "}
          {bookingInfo.bookedPeriod} day(s)
        </div>
        <div style={{ textAlign: "center", paddingTop: "15px" }}>
          <a
            className="btn btn-outline-danger"
            onClick={handleShow}
            role="button"
          >
            Confirm Cancel Booking
          </a>
          <Modal
            show={show}
            onHide={handleClose}
            size="lg"
            centered
            scrollable
            animation
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirm Cancel Booking</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ConfirmCancelBooking bookingInfo={bookingInfo} />
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </>
  );
};
export default RenterCancelledBooking;
