import { Outlet } from "react-router-dom";
import { Grid } from "@mui/material";
import Sidebar from "./component/Sidebar";
import NavbarCustom from "./component/Navbar";
import Menu from "src/components/menu/Menu";
import SideBarNew from "./component/SidebarNew";

function Layout() {
  return (
    <div className="main">
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <SideBarNew />
        </Grid>
        <Grid item xs={10}>
          <div className="homeContainer">
            <NavbarCustom />
            <Outlet />
          </div>
        </Grid>
      </Grid>
    </div>
    // <div className="home">
    //   <div className="container">
    //     <div className="homeContainer">
    //       <Menu />
    //     </div>
    //     <div className="contentContainer">
    //       <NavbarCustom />
    //       <Outlet />
    //     </div>
    //   </div>
    // </div>
  );
}

export default Layout;

