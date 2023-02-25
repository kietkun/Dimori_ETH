import { Modal } from "react-bootstrap";
import RentalDetail from "../../Popup/Renter/RentalDetail";
import EditRental from "../../Popup/Renter/EditRental";
import RemoveRental from "../../Popup/Renter/RemoveRental";
import "../../style/YourRentals.css";
import React, { useState, useEffect } from "react";

const YourRental = ({ rental }) => {
  const [showDetail, setShowDetail] = useState(false);

  const handleCloseDetial = () => setShowDetail(false);
  const handleShowDetial = () => setShowDetail(true);

  const [showRemove, setShowRemove] = useState(false);

  const handleCloseRemove = () => setShowRemove(false);
  const handleShowRemove = () => setShowRemove(true);

  const [showEdit, setShowEdit] = useState(false);

  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);
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
                <td>{rental.city}</td>
                <td>{rental.theme} </td>
                <td>{rental.address}</td>
              </tr>
              <tr>
                <td colSpan={3}>
                  {rental.description.length > 255
                    ? rental.description.substring(0, 255) + " ..."
                    : rental.description}
                </td>
              </tr>
            </table>
          </div>
          <br></br>
          <div className="price">price per day : {rental.price}$</div>
          <div className="button-area">
            <a className="btn btn-secondary" onClick={handleShowDetial}>
              Details
            </a>
            &nbsp;
            <a
              className="btn btn-secondary"
              onClick={handleShowEdit}
              role="button"
            >
              Edit rental
            </a>
            &nbsp;
            <a
              className="btn btn-danger"
              onClick={handleShowRemove}
              role="button"
            >
              Remove rental
            </a>
            &nbsp;
            <a
              className="btn btn-dark"
              href={"/#/renter-booking-schedules"}
              role="button"
            >
              Booking Schedules
            </a>
          </div>
        </div>
      </div>
      {/* Rental Modal */}
      <Modal
        show={showDetail}
        onHide={handleCloseDetial}
        size="xl"
        centered
        scrollable
        animation
        dialogClassName="detail-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RentalDetail rental={rental} />
        </Modal.Body>
      </Modal>
      <Modal
        show={showEdit}
        onHide={handleCloseEdit}
        size="xl"
        centered
        scrollable
        animation
        dialogClassName="edit-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditRental rental={rental} />
        </Modal.Body>
      </Modal>
      <Modal
        show={showRemove}
        onHide={handleCloseRemove}
        size="xl"
        centered
        scrollable
        animation
        dialogClassName="remove-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Remove</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RemoveRental rental={rental} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default YourRental;
