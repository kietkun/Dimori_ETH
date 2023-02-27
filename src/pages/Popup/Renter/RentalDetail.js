import React, { useState } from "react";
import "../../style/RentalPopup.css";
import "bootstrap/dist/css/bootstrap.css";

const RentalDetail = ({ rental }) => {
  return (
    <>
      <div className="popupRentalContent">
        <div className="popupContent">
          <div className="row">
            <div className="col-7">
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
              <img className="rounded mt-4" width="350" src={rental.imgUrl} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RentalDetail;
