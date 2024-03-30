import { useState, useEffect } from "react";

import Slide from "@mui/material/Slide";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import ClickAwayListener from "@mui/material/ClickAwayListener";

import { bgBlur } from "src/theme/css";

import Iconify from "src/components/iconify";
import { Box } from "@mui/material";

import Search from "src/components/Search";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch } from "src/hooks/useRedux";
import { useDebounce } from "usehooks-ts";
import { searchApi } from "src/api/search/search.api";
import { getResultSearch } from "src/store/search/searchSlice";
import PopoverSearch from "src/components/Popover";
import ItemSearch from "src/components/Search/ItemSearch";
// ----------------------------------------------------------------------

const HEADER_MOBILE = 64;
const HEADER_DESKTOP = 92;

const StyledSearchbar = styled("div")(({ theme }) => ({
  ...bgBlur({
    color: theme.palette.background.default,
  }),
  top: 0,
  left: 0,
  zIndex: 99,
  width: "100%",
  display: "flex",
  position: "absolute",
  alignItems: "center",
  height: HEADER_MOBILE,
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  [theme.breakpoints.up("md")]: {
    height: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

export default function Searchbar() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [valueSearch, setValueSearch] = useState("");
  const debouncedValue = useDebounce(valueSearch, 500);
  const onChange = (value) => {
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
  const handle = (boolean) => {
    setIsOpenPopup(false);
  };

  useEffect(() => {
    dispatch(getResultSearch(dataSearch));
  }, [dataSearch]);
  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        {!open && (
          <IconButton onClick={handleOpen}>
            <Iconify icon="eva:search-fill" />
          </IconButton>
        )}

        <Slide direction="down" in={open} mountOnEnter unmountOnExit>
          <StyledSearchbar>
            {/* <Input
              autoFocus
              fullWidth
              disableUnderline
              placeholder="Search…"
              startAdornment={
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ color: "text.disabled", width: 20, height: 20 }}
                  />
                </InputAdornment>
              }
              sx={{ mr: 1, fontWeight: "fontWeightBold" }}
            />
            <Button variant="contained" onClick={handleClose}>
              Search
            </Button> */}
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
                        {dataSearch?.data?.data?.map((item, index) => (
                          <div key={index} className="m-2 ml-0">
                            <ItemSearch item={item} handePopup={handle} />
                          </div>
                        ))}
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
          </StyledSearchbar>
        </Slide>
      </div>
    </ClickAwayListener>
  );
}

