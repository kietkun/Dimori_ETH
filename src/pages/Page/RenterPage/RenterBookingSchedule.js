import React from "react";

const RenterBookingSchedule = ({ bookingInfo }) => {
  return (
    <>
      <div className="divScheduleImg">
        <img className="rentalImg" src={bookingInfo.imgUrl}></img>
      </div>

      <div className="rentalInfo">
        <div className="rentalTitle">{bookingInfo.name.toUpperCase()}</div>
        <div className="rentalTitle">
          Booked Date :
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
        <div className="rentalInformation">
          <div className="rentalDesc">City : {bookingInfo.city}</div>
          <div className="rentalDesc">Theme : {bookingInfo.theme}</div>
          <div className="rentalDesc">Home address {bookingInfo.address}</div>
        </div>
        <br />
        <br />
        <div className="price">
          {bookingInfo.bookedPeriod * bookingInfo.price}$ for{" "}
          {bookingInfo.bookedPeriod} day(s)
        </div>
      </div>
    </>
  );
};

export default RenterBookingSchedule;
