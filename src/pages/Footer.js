import React from "react";
import {
  FacebookOutlined,
  Instagram,
  Twitter,
  Info,
  Copyright,
} from "@mui/icons-material/";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footerDiv">
      <table style={{ color: "azure" }}>
        <tr>
          <td>
            <Copyright /> Dimori
          </td>
          <td>
            <a
              href="https://www.facebook.com/dimoritravels"
              className="linkstyle"
            >
              <FacebookOutlined />
            </a>
          </td>
          <td>
            <a
              href="https://www.instagram.com/dimoritravels/"
              className="linkstyle"
            >
              <Instagram />
            </a>
          </td>
          <td>
            <a href="https://twitter.com/DimoriTravels" className="linkstyle">
              <Twitter />
            </a>
          </td>
          <td>
            <a href="https://twitter.com/DimoriTravels" className="linkstyle">
              <Info />
            </a>
          </td>
        </tr>
      </table>
    </footer>
  );
};
export default Footer;
