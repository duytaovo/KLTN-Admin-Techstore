import { Menu } from "antd";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import Avatar from "@mui/material/Avatar";
import { alpha } from "@mui/material/styles";
import StoreIcon from "@mui/icons-material/Store";
import Typography from "@mui/material/Typography";
import FeedbackIcon from "@mui/icons-material/Feedback";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import LocalPoliceOutlinedIcon from "@mui/icons-material/LocalPoliceOutlined";
// import ListItemButton from '@mui/material/ListItemButton';
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import { handleFilterStore } from "src/store/product/productSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { usePathname } from "src/hooks/use-pathname";

// import { RouterLink } from 'src/routes/components';

import { useResponsive } from "src/hooks/use-responsive";

import { account } from "src/_mock/account";

import Logo from "src/components/logo";
import Scrollbar from "src/components/scrollbar";

import { NAV } from "./config-layout";
// import navConfig from './config-navigation';

// ----------------------------------------------------------------------
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem("Trang chủ", "/", <DashboardIcon />),
  getItem("Người dùng", "/users", <PersonOutlineIcon />),
  getItem("Sản phẩm", "/products", <StoreIcon />),

  // getItem("Sản phẩm ", "/products", <StoreIcon />, [
  //   // getItem("Sản ph", "/products"),
  //   // getItem("Laptop", "/laptop"),
  //   // getItem("Tablet", "/tablet"),
  //   // getItem("Đồng hồ thông minh", "/smartwatch"),
  //   // getItem("Phụ kiện", "/accessory", null, [
  //   //   getItem("Ram", "/ram"),
  //   //   getItem("Rom", "/rom"),
  //   //   getItem("Bàn phím", "/keyboard"),
  //   //   getItem("Processor", "/processor"),
  //   //   getItem("Card đồ họa", "/card_graphic"),
  //   //   getItem("Chuột máy tính", "/mouse"),
  //   //   getItem("Loa nghe nhạc", "/loudSpeaker"),
  //   //   getItem("Màn hình", "/monitor"),
  //   //   getItem("Microphone", "/microPhone"),
  //   //   getItem("Main booard", "/mainBoard"),
  //   //   getItem("Pin máy tính", "/computerPower"),
  //   //   getItem("Sạc dự phòng", "/backupCharger"),
  //   //   getItem("Cục sạc", "/adapter"),
  //   // ]),
  // ]),
  // getItem("Danh mục", "/categories", <CategoryOutlinedIcon />),
  getItem("Nhãn hiệu", "/brand", <LocalPoliceOutlinedIcon />),
  getItem("Voucher", "/voucher", <SubtitlesIcon />),
  getItem("Đặt hàng", "/orders", <CreditCardIcon />),
  getItem("Phản hồi", "/feedback", <FeedbackIcon />),
  getItem("Đơn yêu cầu đổi / trả", "/returnChange", <CreditCardIcon />),
];

export default function Nav({ openNav, onCloseNav }) {
  const pathname = usePathname();
  const [collapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  if (location.pathname === "logout") {
    if (confirm("Bạn có muốn thoát không?")) {
      clearLS();
      window.location.reload();
    }
  }
  const upLg = useResponsive("up", "lg");

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  const onClick = (e) => {
    //console.log("click ", e);
  };
  const renderAccount = (
    <Box
      sx={{
        my: 3,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: "flex",
        borderRadius: 1.5,
        alignItems: "center",
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
      }}
    >
      <Avatar src={account.photoURL} alt="photoURL" />

      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">{account.displayName}</Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {account.role}
        </Typography>
      </Box>
    </Box>
  );
  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      <Menu
        defaultSelectedKeys={["/"]}
        color="green"
        className="text-gray-700 text-2xl"
        defaultOpenKeys={["/products"]}
        mode="inline"
        theme="light"
        inlineCollapsed={collapsed}
        items={items}
        onClick={({ item, key, keyPath, domEvent }) => {
          if (keyPath[0] !== "product") {
            navigate(keyPath[0]);
            dispatch(handleFilterStore([]));
          } else {
            navigate(keyPath[1]);
            dispatch(handleFilterStore([]));
          }
        }}
      />
    </Stack>
  );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Logo sx={{ mt: 3, ml: 4 }} />

      {renderAccount}
      {renderMenu}
      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: "fixed",
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

