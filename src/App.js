import {
  AddRental,
  Home,
  Rentals,
  BookedSchedules,
  YourRentals,
  EditRental,
  RemoveRental,
  CancelBooking,
  UserCancelledBookings,
  RenterCancelledBookings,
  ConfirmCancelBooking,
  Footer,
  RentalDetail,
  RenterBookingSchedules,
  HomesByRenter
} from "./pages";
import { Route, Routes, HashRouter } from "react-router-dom";

function App() {
  return (
    <>
      <div>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rentals" element={<Rentals />} />
            <Route path="/add-rental" element={<AddRental />} />
            <Route path="/booked-schedules" element={<BookedSchedules />} />
            <Route path="/your-rentals" element={<YourRentals />} />
            <Route path="/edit-rental" element={<EditRental />} />
            <Route path="/remove-rental" element={<RemoveRental />} />
            <Route path="/rental-detail" element={<RentalDetail />} />
            <Route path="/cancel-booking" element={<CancelBooking />} />
            <Route path="/home-by-renter" element={<HomesByRenter />} />
            <Route
              path="/user-cancelled-booking"
              element={<UserCancelledBookings />}
            />
            <Route
              path="/renter-cancelled-booking"
              element={<RenterCancelledBookings />}
            />
            <Route
              path="/confirm-cancel-booking"
              element={<ConfirmCancelBooking />}
            />
            <Route
              path="/renter-booking-schedules"
              element={<RenterBookingSchedules />}
            />
          </Routes>
        </HashRouter>
      </div> 
      <Footer/>
    </>
  );
}

export default App;
