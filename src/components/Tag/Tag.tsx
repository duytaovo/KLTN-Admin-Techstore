import { useEffect, useState } from "react";
import clsx from "clsx";
import { formatCurrency, rateSale } from "src/utils/utils";
import { Button } from "antd";
import { useTheme } from "@mui/material";

const Tag = ({ productData, onClick }: any) => {
  const theme = useTheme();
  const PRIMARY_MAIN = theme.palette.primary.main;
  const [price, setPrice] = useState(
    productData.lstProductTypeAndPrice[0].price,
  );

  const [salePrice, setSalePrice] = useState(
    productData.lstProductTypeAndPrice[0].salePrice,
  );

  const [selectedRam, setSelectedRam] = useState<string | null>(null);
  const [selectedRom, setSelectedRom] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    if (selectedRam !== null) {
      // Lấy danh sách màu sắc tương ứng với loại RAM đã chọn
      const colorsForSelectedRam = productData.lstProductTypeAndPrice
        .filter((item: any) => item.ram === selectedRam)
        .map((item: any) => item.color);

      // Nếu danh sách không rỗng, chọn màu đầu tiên làm màu mặc định
      if (colorsForSelectedRam && colorsForSelectedRam.length > 0) {
        setSelectedColor(colorsForSelectedRam[0]);
      }
    }
  }, [selectedRam, productData]);

  useEffect(() => {
    if (selectedRom !== null) {
      // Lấy danh sách màu sắc tương ứng với loại RAM đã chọn
      const colorsForSelectedRom = productData.lstProductTypeAndPrice
        .filter((item: any) => item.storageCapacity === selectedRom)
        .map((item: any) => item.color);

      // Nếu danh sách không rỗng, chọn màu đầu tiên làm màu mặc định
      if (colorsForSelectedRom && colorsForSelectedRom.length > 0) {
        setSelectedColor(colorsForSelectedRom[0]);
      }
    }
  }, [selectedRom, productData]);

  useEffect(() => {
    // Lấy danh sách loại RAM unique từ dữ liệu sản phẩm
    const uniqueRams: any = [
      ...new Set(
        productData.lstProductTypeAndPrice.map((item: any) => item.ram),
      ),
    ];

    if (!selectedRam && uniqueRams.length > 0) {
      // Nếu chưa chọn RAM, chọn RAM đầu tiên làm RAM mặc định
      setSelectedRam(uniqueRams[0]);

      // Lấy danh sách màu sắc tương ứng với RAM đầu tiên
      const colorsForDefaultRam = productData.lstProductTypeAndPrice
        .filter((item: any) => item.ram === uniqueRams[0])
        .map((item: any) => item.color);

      if (colorsForDefaultRam && colorsForDefaultRam.length > 0) {
        // Chọn màu sắc đầu tiên làm màu mặc định
        setSelectedColor(colorsForDefaultRam[0]);
      }
    }
  }, [selectedRam, productData]);

  useEffect(() => {
    // Lấy danh sách loại ROM unique từ dữ liệu sản phẩm
    const uniqueRoms: any = [
      ...new Set(
        productData.lstProductTypeAndPrice.map(
          (item: any) => item.storageCapacity,
        ),
      ),
    ];

    if (!selectedRom && uniqueRoms.length > 0) {
      // Nếu chưa chọn ROM, chọn ROM đầu tiên làm ROM mặc định
      setSelectedRom(uniqueRoms[0]);

      // Lấy danh sách màu sắc tương ứng với ROM đầu tiên
      const colorsForDefaultRom = productData.lstProductTypeAndPrice
        .filter((item: any) => item.storageCapacity === uniqueRoms[0])
        .map((item: any) => item.color);

      if (colorsForDefaultRom && colorsForDefaultRom.length > 0) {
        // Chọn màu sắc đầu tiên làm màu mặc định
        setSelectedColor(colorsForDefaultRom[0]);
      }
    }
  }, [selectedRom, productData]);

  // useEffect(() => {
  //   if (selectedRam !== null && selectedColor !== null) {
  //     const selectedProduct =
  //       productData.lstProductTypeAndPrice.find(
  //         (item: any) =>
  //           item.ram === selectedRam && item.color === selectedColor,
  //       );

  //     // if (selectedProduct) {
  //     //   setPrice(selectedProduct.price);
  //     //   setSalePrice(selectedProduct.salePrice);
  //     //   onClick &&
  //     //     onClick({
  //     //       price: selectedProduct.price,
  //     //       salePrice: selectedProduct.salePrice,
  //     //     });
  //     // }
  //   }
  // }, [selectedRam, selectedColor, productData, onClick]);
  const findTypeId = () => {
    const selectedProduct = productData.lstProductTypeAndPrice.find(
      (item: any) =>
        item.ram === selectedRam &&
        item.storageCapacity === selectedRom &&
        item.color === selectedColor,
    );

    return selectedProduct?.typeId || null;
  };
  const typeId = findTypeId();

  useEffect(() => {
    if (selectedRom !== null && selectedColor !== null) {
      const selectedProduct = productData.lstProductTypeAndPrice.find(
        (item: any) =>
          item.storageCapacity === selectedRom && item.color === selectedColor,
      );

      if (selectedProduct) {
        setPrice(selectedProduct.price);
        setSalePrice(selectedProduct.salePrice);
        onClick &&
          onClick({
            price: selectedProduct.price,
            salePrice: selectedProduct.salePrice,
            selectedRom,
            selectedColor,
            selectedRam,
            typeId,
          });
      }
    }
  }, [selectedRom, selectedColor, productData, onClick, selectedRam]);

  return (
    <div className="mb-4">
      {salePrice > 0 && salePrice !== price ? (
        <div className="mt-8 flex items-center bg-gray-50 px-5 py-4">
          <div className="text-gray-500 line-through">
            ₫{formatCurrency(price)}
          </div>
          <div className="ml-3 text-4xl font-medium text-mainColor">
            ₫{formatCurrency(salePrice)}
          </div>
          <div className="ml-4 rounded-sm bg-orange-300 px-1 py-[2px] text-lg font-semibold uppercase text-black">
            {rateSale(salePrice, price)} giảm
          </div>
        </div>
      ) : (
        <div className="mt-8 flex items-center bg-gray-50 px-5 py-4">
          <div className="ml-3 text-4xl font-medium text-mainColor">
            ₫{formatCurrency(price)}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-4">
        {[
          ...new Set(
            productData.lstProductTypeAndPrice
              .filter((item: any) => item.ram === selectedRam)
              .map((item: any) => item.ram),
          ),
        ].map((ram: any, index) => {
          const active = ram === selectedRam;
          const className = clsx(
            "border  px-10 py-4 text-xl rounded",
            active && `text-${PRIMARY_MAIN}  `,
          );

          return (
            <Button
              style={{
                color: (active && `${PRIMARY_MAIN}`) || "",
              }}
              className={className}
              key={index}
              onClick={() => {
                setSelectedRam(ram);
                setSelectedColor(null); // Đặt màu sắc về null khi chọn loại RAM mới
              }}
            >
              {ram}
            </Button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        {[
          ...new Set(
            productData.lstProductTypeAndPrice.map(
              (item: any) => item.storageCapacity,
            ),
          ),
        ].map((rom: any, index) => {
          const active = rom === selectedRom;
          const className = clsx(
            "border  px-10 py-4 text-xl rounded",
            active && "text-blue-400 border-blue-400 ",
          );

          return (
            <Button
              className={className}
              // type={active ? "primary" : "default"}
              key={index}
              onClick={() => {
                setSelectedRom(rom);
                setSelectedColor(null); // Đặt màu sắc về null khi chọn loại RoM mới
              }}
            >
              {rom}
            </Button>
          );
        })}
      </div>

      {/* <div className="flex flex-wrap gap-4 ">
        {productData.lstProductTypeAndPrice
          .filter((item: any) => item.ram === selectedRam)
          .map((product: any, index: number) => {
            const active = product.color === selectedColor;
            const className = clsx(
              "border  px-10 py-4 text-xl rounded",
              active && "text-blue-400 border-blue-400 ",
            );

            return (
              <Button
                className={className}
                // type={active ? "primary" : "default"}
                key={index}
                onClick={() => {
                  setSelectedColor(product.color);
                }}
                disabled={product.quantity === 0} // Ví dụ: Disable nút nếu hết hàng
              >
                {product.color}
              </Button>
            );
          })}
      </div> */}
      <div className="flex flex-wrap gap-4 ">
        {productData.lstProductTypeAndPrice
          .filter((item: any) => item.storageCapacity === selectedRom)
          .map((product: any, index: number) => {
            const active = product.color === selectedColor;
            const className = clsx(
              "border  px-10 py-4 text-xl rounded",
              active && "text-blue-400 border-blue-400 ",
            );

            return (
              <Button
                className={className}
                // type={active ? "primary" : "default"}
                key={index}
                onClick={() => {
                  setSelectedColor(product.color);
                }}
                disabled={product.quantity === 0} // Ví dụ: Disable nút nếu hết hàng
              >
                {product.color}
              </Button>
            );
          })}
      </div>
    </div>
  );
};

export default Tag;

