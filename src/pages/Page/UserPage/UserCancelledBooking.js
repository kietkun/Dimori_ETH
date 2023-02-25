const UserCancelledBooking = ({bookingInfo}) => {
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
          {bookingInfo.bookedPeriod * bookingInfo.price}$ for {bookingInfo.bookedPeriod} day(s)
        </div>
        <div style={{ textAlign: "center", paddingTop: "15px" }}>
          <a
            className="btn btn-outline-primary"
            href={"/#/user-cancelled-booking"}
            role="button"
          >
            Active Booking
          </a>
        </div>
      </div>
    </>
  );
};

export default UserCancelledBooking;