import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "src/contexts/darkModeContext";
import { Box, IconButton } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { changeLanguage } from "i18next";
import { MenuProps } from "antd";
import LanguageIcon from "@mui/icons-material/Language";
import { useTranslation } from "react-i18next";
import { locales } from "src/i18n/i18n";
import Search from "src/components/Search";
import CustomDropDown from "src/components/Dropdown/Dropdown";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch } from "src/hooks/useRedux";
import { useDebounce } from "usehooks-ts";
import { searchApi } from "src/api/search/search.api";
import { getResultSearch } from "src/store/search/searchSlice";
import PopoverSearch from "src/components/Popover";
import ItemSearch from "src/components/Search/ItemSearch";
import { clearLS } from "src/utils/auth";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";
const items: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <button
        className=" px-2 text-left text-xl hover:text-mainColor"
        onClick={() => {
          if (confirm("Bạn có muốn thoát không?")) {
            clearLS();
            window.location.reload();
          }
        }}
      >
        Đăng xuất
      </button>
    ),
  },
];
const customDropdownStyle = {
  arrow: false,
  isOnClick: false,
  className: "px-1 mx-3 text-xl xl:p-0 xl:mr-0 hover:text-mainColor",
};
const menuStyle = {
  padding: "10px 10px",
  borderRadius: "16px",
};
export default function NavbarCustom() {
  const { t } = useTranslation("home");
  const { i18n } = useTranslation();
  const currentLanguage = locales[i18n.language as keyof typeof locales];
  const { setEnable, enable } = useContext(DarkModeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;

      if (scrollTop > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const [valueSearch, setValueSearch] = useState("");
  const debouncedValue = useDebounce<string>(valueSearch, 500);
  const onChange = (value: string) => {
    setValueSearch(value);
    if (value == "") {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 700);
  }, [isLoading]);
  const { data: dataSearch } = useQuery({
    queryKey: ["dataSearch", debouncedValue],
    queryFn: () => {
      setIsLoading(false);
      return searchApi.getResultSearchApi({ keyword: debouncedValue });
    },

    enabled: debouncedValue !== "",
    // keepPreviousData: true,
    staleTime: 3 * 60 * 1000,
  });
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const handle = (boolean: boolean) => {
    setIsOpenPopup(false);
  };

  useEffect(() => {
    dispatch(getResultSearch(dataSearch));
  }, [dataSearch]);
  return (
    <div className="h-[50px] border-b-[0.5px_solid_rgb(231,228,228)] flex items-center text-base text-[#555]">
      <div className="w-full p-5 flex items-center justify-between">
        <div className="flex items-center border-[0.5px solid lightgray] dark">
          <PopoverSearch
            className="z-[10000]"
            isOpenPopup={isOpenPopup}
            setIsOpenPopup={setIsOpenPopup}
            handePopup={handle}
            renderPopover={
              <Box
                sx={{
                  width: 400,
                  // height: "50vh",
                  backgroundColor: "white",
                  borderRadius: "1px",
                  overflow: "auto",
                  scrollBehavior: "smooth",
                  scrollbarColor: "revert",
                  zIndex: 10000,
                }}
                className="h-auto max-h-[50vh] min-h-auto"
              >
                <div className="ml-3 text-black">
                  {dataSearch?.data?.data.length > 0 ? (
                    <div>
                      <h6 className=" mt-2 p2">Kết quả tìm kiếm</h6>
                      {dataSearch?.data?.data?.map(
                        (item: any, index: number) => (
                          <div key={index} className="m-2 ml-0">
                            <ItemSearch item={item} handePopup={handle} />
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <div className="h-10 bg-white">
                      {dataSearch?.data?.data.length === 0 && (
                        <h2>Không có sản phẩm trong hệ thống chúng tôi</h2>
                      )}
                    </div>
                  )}
                </div>
              </Box>
            }
          >
            <div>
              <Search
                width="400px"
                placeholder="Tìm kiếm"
                onChange={onChange}
                loading={isLoading}
                handePopup={handle}
              />
            </div>
          </PopoverSearch>
        </div>
        <div className="flex items-center">
          <div className="">
            <CustomDropDown
              {...customDropdownStyle}
              menuStyle={menuStyle}
              items={items}
            >
              <div className=" hover:text-red-500">
                <LogoutIcon />
                <span className="text- text-xl"></span>
              </div>
            </CustomDropDown>
          </div>
          {/* <div className="flex items-center mr-5 relative">
            {enable === "true" ? (
              <IconButton>
                <DarkModeOutlinedIcon
                  className="text-xl  text-white/70"
                  onClick={() => {
                    setEnable("false");
                    localStorage.setItem("enable", "false");
                  }}
                />
              </IconButton>
            ) : (
              <IconButton>
                <LightModeOutlinedIcon
                  className="text-xl"
                  onClick={() => {
                    setEnable("true");
                    localStorage.setItem("enable", "true");
                  }}
                />
              </IconButton>
            )}
          </div> */}

          <div className="flex item-center mr-5 relative">
            {/* <NotificationsNoneOutlinedIcon className="text-xl" />
            <div className="w-[15px] h-[15px] bg-red-500 rounded-[50%] text-white flex items-center justify-center text-[10px] font-bold absolute -top-[5px] -r-[5px]">
              1
            </div>
          </div>
          <div className="flex item-center mr-5 relative">
            <ChatBubbleOutlineOutlinedIcon className="text-xl" />
            <div className="w-[15px] h-[15px] bg-red-500 rounded-[50%] text-white flex items-center justify-center text-[10px] font-bold absolute -top-[5px] -r-[5px]">
              2
            </div> */}
          </div>

          <div className="flex item-center mr-5 relative">
            {/* <img
              src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
              alt=""
              className="w-[30px] h-[30px] rounded-[50%]"
            /> */}
            <div className="">
              {/* <CustomDropDown
                {...customDropdownStyle}
                menuStyle={menuStyle}
                items={items}
              > */}
              <div className=" hover:text-mainColor flex items-center space-x-5">
                {/* <PersonOutlineIcon /> */}
                <img
                  src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                  alt=""
                  className="w-[30px] h-[30px] rounded-[50%]"
                />
                <span>Admin</span>
              </div>
              {/* </CustomDropDown> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

