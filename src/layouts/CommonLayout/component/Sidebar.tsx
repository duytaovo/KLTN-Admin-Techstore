import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import FeedbackIcon from "@mui/icons-material/Feedback";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "src/contexts/darkModeContext";
import { useTranslation } from "react-i18next";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import Brightness4OutlinedIcon from "@mui/icons-material/Brightness4Outlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import LocalPoliceOutlinedIcon from "@mui/icons-material/LocalPoliceOutlined";
import path from "src/constants/path";
import { clearLS } from "src/utils/auth";
export default function Sidebar() {
  const { enable, setEnable } = useContext(DarkModeContext);
  const { t } = useTranslation("home");
  const location = useLocation();
  const logout = () => {
    if (confirm("Bạn có muốn thoát không?")) {
      clearLS();
      window.location.reload();
    }
  };
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  return (
    <div className="border-r-[0.5px_solid_rgb(230,227,227)] min-h-screen bg-white sidebar">
      <div className="h-[50px] flex items-center justify-center">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="text-3xl font-bold text-mainColor">TECH-ADMIN</span>
        </Link>
      </div>
      <hr />
      <div className="pl-[10px]">
        <ul>
          <p className="text-[16px] font-bold text-[#999] mt-[15px] mb-[5px]">
            MAIN
          </p>
          <Link to="/" style={{ textDecoration: "none" }}>
            <li
              className={`flex item-center p-[5px] cursor-pointer ${
                isActive("/") ? "bg-[#ece8ff]" : ""
              }`}
            >
              <DashboardIcon className="text-[22px] text-mainColor" />
              <span className="text-[14px] font-[600] text-[#888] ml-[10px]">
                {t("sidebar.dashboard")}
              </span>
            </li>
          </Link>
          <p className="text-[16px] font-bold text-[#999] mt-[15px] mb-[5px]">
            LISTS
          </p>
          <Link to="/users" style={{ textDecoration: "none" }}>
            <li
              className={`flex item-center p-[5px] cursor-pointer ${
                isActive("/users") ? "bg-[#ece8ff]" : ""
              }`}
            >
              <PersonOutlineIcon className="text-[22px] text-mainColor" />
              <span className="text-[14px] font-[600] text-[#888] ml-[10px]">
                {t("sidebar.users")}
              </span>
            </li>
          </Link>
          <Link to="/products" style={{ textDecoration: "none" }}>
            <li
              className={`flex item-center p-[5px] cursor-pointer ${
                isActive("/products") ? "bg-[#ece8ff]" : ""
              }`}
            >
              <StoreIcon className="text-[22px] text-mainColor" />
              <span className="text-[14px] font-[600] text-[#888] ml-[10px]">
                {t("sidebar.products")}
              </span>
            </li>
          </Link>
          <Link to="/orders" style={{ textDecoration: "none" }}>
            <li
              className={`flex item-center p-[5px] cursor-pointer ${
                isActive("/orders") ? "bg-[#ece8ff]" : ""
              }`}
            >
              <CreditCardIcon className="text-[22px] text-mainColor" />
              <span className="text-[14px] font-[600] text-[#888] ml-[10px]">
                {t("sidebar.orders")}
              </span>
            </li>
          </Link>

          <Link to={path.categories} style={{ textDecoration: "none" }}>
            <li
              className={`flex item-center p-[5px] cursor-pointer ${
                isActive("/categories") ? "bg-[#ece8ff]" : ""
              }`}
            >
              <CategoryOutlinedIcon className="text-[22px] text-mainColor" />
              <span className="text-[14px] font-[600] text-[#888] ml-[10px]">
                {t("sidebar.Category")}
              </span>
            </li>
          </Link>
          <Link to="/brand" style={{ textDecoration: "none" }}>
            <li
              className={`flex item-center p-[5px] cursor-pointer ${
                isActive("/brand") ? "bg-[#ece8ff]" : ""
              }`}
            >
              <LocalPoliceOutlinedIcon className="text-[22px] text-mainColor" />
              <span className="text-[14px] font-[600] text-[#888] ml-[10px]">
                {t("sidebar.Brand")}
              </span>
            </li>
          </Link>
          <Link to="/feedback" style={{ textDecoration: "none" }} className="">
            <li
              className={`flex item-center p-[5px] cursor-pointer ${
                isActive("/feedback") ? "bg-[#ece8ff]" : ""
              }`}
            >
              <FeedbackIcon className="text-[22px] text-mainColor" />
              <span className="text-[14px] font-[600] text-[#888] ml-[10px]">
                {t("sidebar.FeedBack")}
              </span>
            </li>
          </Link>
          {/* <Link to="/order" style={{ textDecoration: "none" }}></Link>
          <p className="text-[16px] font-bold text-[#999] mt-[15px] mb-[5px]">
            USEFUL
          </p>
          <li className={`flex item-center p-[5px] cursor-pointer ${""}`}>
            <InsertChartIcon className="text-[22px] text-mainColor" />
            <span className="text-[14px] font-[600] text-[#888] ml-[10px]">
              {t("sidebar.status")}
            </span>
          </li>
          <li
            className={`flex item-center p-[5px] cursor-pointer
            }`}
          >
            <NotificationsNoneIcon className="text-[22px] text-mainColor" />
            <span className="text-[14px] font-[600] text-[#888] ml-[10px]">
              {t("sidebar.notification")}
            </span>
          </li>
          <p className="text-[16px] font-bold text-[#999] mt-[15px] mb-[5px]">
            USER
          </p>
          <li
            className={`flex item-center p-[5px] cursor-pointer 
            }`}
          >
            <AccountCircleOutlinedIcon className="text-[22px] text-mainColor" />
            <span className="text-[14px] font-[600] text-[#888] ml-[10px]">
              {t("sidebar.profile")}
            </span>
          </li> */}
          <li
            onClick={logout}
            className={`flex item-center p-[5px] cursor-pointer 
            }`}
          >
            <ExitToAppIcon className="text-[22px] text-mainColor" />
            <span className="text-[14px] font-[600] text-[#888] ml-[10px]">
              {t("sidebar.logout")}
            </span>
          </li>
        </ul>
      </div>
      <div className="flex items-center m-[10px]">
        <div
          className="w-5 h-5 rounded border-[1px_solid_#7451f8] cursor-pointer m-[5px]"
          onClick={() => setEnable("false")}
        >
          <LightModeOutlinedIcon />
        </div>
        <div
          className="w-5 h-5 rounded border-[1px_solid_#7451f8] cursor-pointer m-[5px]"
          onClick={() => setEnable("true")}
        >
          <Brightness4OutlinedIcon />
        </div>
      </div>
    </div>
  );
}

