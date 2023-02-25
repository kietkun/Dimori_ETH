import { Modal } from "react-bootstrap";
import CancelBooking from "../../Popup/User/CancelBooking";
import React, { useState } from "react";

const BookedSchedule = ({rentalInfo}) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="divScheduleImg">
        <img className="scheduleImg" src={rentalInfo.imgUrl}></img>
      </div>

      <div className="rentalInfo">
        <div className="rentalTitle">{rentalInfo.name.toUpperCase()}</div>
        <div className="rentalInformation">
          <div className="rentalDesc">ở (city) {rentalInfo.city} á nè</div>
          <div className="rentalDesc">
            màu (theme) {rentalInfo.theme} thấy được không
          </div>
          <div className="rentalDesc">
            tau để địa chỉ ở đây (address) {rentalInfo.address}
          </div>
          <div className="rentalDesc">
            Booked dates:
            {` ${rentalInfo.startDate.toLocaleString("default", {
              month: "short",
            })} ${rentalInfo.startDate.toLocaleString("default", {
              day: "2-digit",
            })}  -  ${rentalInfo.endDate.toLocaleString("default", {
              month: "short",
            })}  ${rentalInfo.endDate.toLocaleString("default", {
              day: "2-digit",
            })} `}
          </div>
        </div>
        <br />
        <div className="price">
          {rentalInfo.bookedPeriod * rentalInfo.price}$ for {rentalInfo.bookedPeriod} day(s)
        </div>
        <div className="bottomButton">
          <a className="btn btn-primary" onClick={handleShow} role="button">
            Cancel Booking
          </a>
        </div>
        <Modal
          show={show}
          onHide={handleClose}
          size="lg"
          centered
          scrollable
          animation
        >
          <Modal.Header closeButton>
            <Modal.Title>Cancel</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CancelBooking bookedSchedule={rentalInfo} />
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};
export default BookedSchedule;
