import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { SelectChangeEvent } from "@mui/material/Select";
import React, { useEffect, useState } from "react";
import Product from "./Table/Product";
import path from "src/constants/path";
import { Button, Pagination } from "antd";
import { getFilter, getSort } from "src/store/product/filterSlice";
import { getBrands } from "src/store/brand/brandSlice";
import { getCharacters } from "src/store/characteristic/characteristicSlice";
import FilterPhone from "../FilterPhone";
import { DownloadOutlined } from "@ant-design/icons";
import ButtonAdd from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import CustomStep from "src/components/CustomStep/CustomStep";
import { toast } from "react-toastify";
import { exportProduct, getProducts } from "src/store/product/productSlice";
import Skeleton from "src/components/Skeleton";
import { unwrapResult } from "@reduxjs/toolkit";

const arrProduct = [
  {
    name: "Điện thoại + smartphone + 1",
    key: "smartphone",
    id: 1,
  },
  {
    name: "Laptop + laptop + 2",
    key: "laptop",
    id: 2,
  },
  {
    name: "Tablet + tablet + 4",
    key: "tablet",
    id: 4,
  },
  {
    name: "Smartwatch + smartwatch + 28",
    key: "smartwatch",
    id: 28,
  },
  {
    name: "Thiết bị sạc + adapter + 20",
    key: "adapter",
    id: 20,
  },
  {
    name: "Sạc dự phòng + backup_charger + 21",
    key: "backup_charger",
    id: 21,
  },
  {
    name: "Bàn phím + keyboard + 23",
    key: "keyboard",
    id: 23,
  },
  {
    name: "Chuột + mouse + 24",
    key: "mouse",
    id: 24,
  },
  {
    name: "Tai nghe + earphone + 22",
    key: "earphone",
    id: 22,
  },

  {
    name: "Loa + loudspeaker + 25",
    key: "ram",
    id: 25,
  },
  {
    name: "Microphone + microphone + 26",
    key: "microphone",
    id: 26,
  },
  {
    name: "Ram + ram + 27",
    key: "ram",
    id: 5,
  },
];

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const TableProduct: React.FC = () => {
  const { products } = useAppSelector((state) => state.product);
  const loading = useAppSelector((state) => state.loading.loading);
  const navigate = useNavigate();
  const pageSize = 10; // Số phần tử trên mỗi trang
  const [choose, setChoose] = useState<any>();
  const [chooseCharac, setChooseCharac] = useState<any>();
  const [chooseBox, setChooseBox] = useState<any>();
  const [isOpen, setisOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const filter = useAppSelector((state) => state.product.filter.data); // Lấy tất cả
  const { brand } = useAppSelector<any>((state) => state.brand);
  const { character } = useAppSelector<any>((state) => state.character);
  const [dataFilterLocal, setDataFilterLocal] = useState<any>();
  const [product, setProduct] = useState<string>("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    if (productValue === "undefined") {
      toast.error("Vui lòng chọn sản phẩm");
      return;
    } else {
      setOpen(true);
    }
  };
  const handleClose = () => setOpen(false);
  const location = useLocation();
  const searchParam = new URLSearchParams(location.search);
  const productValue = searchParam.get("product");
  // Hàm tách mảng
  useEffect(() => {
    const separateArrays = (data: any) => {
      const result: any = {};

      data.forEach((item: any) => {
        const key = Object.keys(item)[0]; // Lấy tên thuộc tính (ví dụ: 'Hãng', 'Giá', ...)

        if (!result[key]) {
          result[key] = [];
        }

        result[key].push(item[key]);
      });

      return result;
    };
    // Gọi hàm tách mảng
    const separatedArrays = separateArrays(filter);
    setDataFilterLocal(separatedArrays);
  }, [filter]);

  // Kết quả
  if (dataFilterLocal) {
    var {
      Hãng,
      "Nhu cầu": NhuCau,
      "Tính năng đặc biệt": TinhNangDacBiet,
      Giá: Gia,
    } = dataFilterLocal;
  }

  const getMinMaxPrices = () => {
    if (Gia === undefined || Gia.length === 0) {
      return null;
    }
    const numericRanges = Gia.map((priceString: any) => {
      const matches = priceString.match(/(\d+) - (\d+)/);
      let startPrice;
      let endPrice;
      if (
        priceString.search("Dưới") != -1 &&
        priceString.search("Trên") != -1
      ) {
        startPrice = 0;
        endPrice = 100;

        if (!isNaN(startPrice) && !isNaN(endPrice)) {
          return { startPrice, endPrice };
        }
      } else if (priceString.search("Dưới") != -1) {
        startPrice = 0;
        endPrice = 2;

        if (matches && matches.length === 3) {
          // startPrice = parseInt(matches[1], 10);
          endPrice = parseInt(matches[2], 10);
        }

        if (!isNaN(startPrice) && !isNaN(endPrice)) {
          return { startPrice, endPrice };
        }
      } else if (priceString.search("Trên") != -1) {
        startPrice = 20;
        endPrice = 100;
        if (matches && matches.length === 3) {
          startPrice = parseInt(matches[1], 10);
        }
        if (priceString.search("Dưới") != -1) {
          startPrice = 0;
        }
        if (!isNaN(startPrice) && !isNaN(endPrice)) {
          return { startPrice, endPrice };
        }
      } else if (matches && matches.length === 3) {
        startPrice = parseInt(matches[1], 10);
        endPrice = parseInt(matches[2], 10);

        if (!isNaN(startPrice) && !isNaN(endPrice)) {
          return { startPrice, endPrice };
        }
      }

      return null;
    });

    const validRanges = numericRanges.filter(
      (range: any) => range !== null,
    ) as {
      startPrice: number;
      endPrice: number;
    }[];

    if (validRanges.length === 0) {
      return null;
    }

    const minPrice = Math.min(...validRanges.map((range) => range.startPrice));
    const maxPrice = Math.max(...validRanges.map((range) => range.endPrice));

    return { minPrice: minPrice * 1000000, maxPrice: maxPrice * 1000000 };
  };

  const minMaxPrices = getMinMaxPrices();

  useEffect(() => {
    const body = {
      slug: productValue,
      brandId: Hãng ? Hãng : null,
      characteristicId: NhuCau ? NhuCau : null,
      priceFrom: minMaxPrices?.minPrice
        ? minMaxPrices?.minPrice
        : minMaxPrices?.minPrice == 0
        ? 0
        : null,
      priceTo: minMaxPrices?.maxPrice ? minMaxPrices?.maxPrice : null,
      specialFeatures: TinhNangDacBiet ? TinhNangDacBiet : [],
      name: null,
      lstProductAttributeFilterRequest: [],
    };
    dispatch(
      getProducts({
        body: body,
        params: { pageNumber: currentPage, pageSize: 10, sort: chooseBox },
      }),
    );
  }, [
    currentPage,
    Hãng,
    minMaxPrices?.maxPrice,
    minMaxPrices?.minPrice,
    TinhNangDacBiet,
    chooseBox,
    productValue,
  ]);

  useEffect(() => {
    const body = {
      slug: productValue,
      brandId: choose?.id ? [choose?.id] : null,
      characteristicId: chooseCharac ? [chooseCharac] : null,
      priceFrom: null,
      specialFeatures: [],
      name: null,
    };
    dispatch(
      getProducts({
        body: body,
        params: { pageNumber: currentPage, pageSize: 10 },
      }),
    );
  }, [currentPage, choose, chooseCharac, productValue]);

  useEffect(() => {
    dispatch(getSort(""));
    // dispatch(getFilter({ slug: "smartphone" }));
    dispatch(getBrands({ slug: productValue }));
    dispatch(getCharacters({ categorySlug: productValue }));
  }, [productValue]);

  useEffect(() => {
    navigate({
      pathname: path.products,
      search: createSearchParams({
        product: product?.split("+")[1]?.trim() || "",
        id: product?.split("+")[2]?.trim() || "",
      }).toString(),
    });
  }, [product]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1);
  };
  const handle = (boolean: boolean) => {
    setisOpen(boolean);
  };

  const handleChangeProduct = (event: SelectChangeEvent) => {
    setProduct(event.target.value as string);
  };
  const downloadFile = async (url: string) => {
    // Create a temporary link element
    const link = document.createElement("a");
    link.href = url;

    // Specify the download attribute with a suggested filename
    link.download = "downloaded_file";

    // Append the link to the document
    document.body.appendChild(link);

    // Trigger a click on the link to start the download
    link.click();

    // Remove the link element from the document
    document.body.removeChild(link);
  };
  const exportToExcel = async () => {
    if (productValue === "" || undefined) {
      toast.error("Vui lòng chọn sản phẩm");
      return;
    } else {
      const res = await dispatch(exportProduct(productValue));
      unwrapResult(res);
      downloadFile(res.payload?.data?.data);
    }
  };

  return (
    <div className="mx-6">
      <div className="w-full text-[24px] text-gray-500 mb-[10px] flex items-center justify-between">
        <div>
          Quản lý sản phẩm
          <div className="flex items-center mt-4">
            <FormControl sx={{ minWidth: 160, marginRight: 2 }}>
              <InputLabel id="demo-simple-select-label">Product</InputLabel>
              <Select
                defaultValue={product}
                labelId={product}
                id="demo-simple-select"
                value={product}
                label="Product"
                onChange={handleChangeProduct}
              >
                {arrProduct.map((product, index) => {
                  return (
                    <MenuItem key={product.id} value={product.name}>
                      {product.name.split("+")[0].trim()}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <Button
              onClick={() => exportToExcel()}
              type="primary"
              icon={<DownloadOutlined />}
              size="small"
              className="text-blue-500"
            >
              Xuất file excel
            </Button>
            <Button
              onClick={handleOpen}
              type="primary"
              icon={<DownloadOutlined />}
              size="small"
              className="text-blue-500"
            >
              Nhập file sản phẩm
            </Button>
          </div>
        </div>
        <ButtonAdd
          onClick={() => {
            if (product?.split("+")[1]?.trim() === undefined) {
              toast.error("Vui lòng chọn sản phẩm");
            } else {
              navigate({
                pathname: path.productNew,
                search: createSearchParams({
                  name: product?.split("+")[0]?.trim(),
                  product: product?.split("+")[1]?.trim(),
                  id: product?.split("+")[2]?.trim(),
                }).toString(),
              });
            }
          }}
          variant="contained"
          color="inherit"
          // startIcon={<Iconify icon="eva:plus-fill" />}
        >
          Thêm mới
        </ButtonAdd>
      </div>
      <FilterPhone handle={handle} brand={brand} characteristic={character} />
      {/* <QuickLinkPhone
        handleSetChoose={handleSetChoose}
        choose={choose}
        handleSetChooseCharac={handleSetChooseCharac}
        chooseCharac={chooseCharac}
        brand={brand}
        characteristic={character}
      /> */}

      {loading > 0 ? (
        <Skeleton
          styles={{ height: "50vh" }}
          children={undefined}
          className={undefined}
        />
      ) : (
        <div className="mt-6 grid grid-cols-5 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 h-[80%] mb-10">
          {products?.data?.data?.map((_product: any) => (
            <div className="col-span-1" key={_product.id}>
              <Product
                product={_product}
                slug={productValue}
                idCategory={product?.split("+")[2]?.trim()}
              />
            </div>
          ))}
        </div>
      )}
      <div className="fixed bottom-12 mt-12 ">
        <Pagination
          current={currentPage + 1}
          pageSize={pageSize}
          total={products?.data?.totalElements}
          onChange={handlePageChange}
        />
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <CustomStep setOpen={setOpen} />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default TableProduct;

