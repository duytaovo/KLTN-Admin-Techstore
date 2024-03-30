import styles from "./filteritem.module.scss";
import { useState, useRef, useEffect, useCallback } from "react";
import SliderPrice from "./SliderPrice";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import ButtonFilter from "src/components/ButtonFilter/ButtonFilter";
import ButtonItem from "src/components/ButtonFilter/ButtonItem";
import path from "src/constants/path";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { handleFilterStore } from "src/store/product/productSlice";

interface Props {
  data: any;
  handle: (boolean: boolean) => void;
  scroll: () => void;
}
const FilterItem = ({ data, handle, scroll }: Props) => {
  //css
  const [isOpen, setIsOpen] = useState(false);
  const [isApper, setIsApper] = useState(false);
  const item: any = useRef<HTMLDivElement>(null);
  const bound: any = useRef<HTMLDivElement>(null);
  const button: any = useRef<HTMLDivElement>(null);
  const itemHiden: any = useRef<HTMLDivElement>(null);
  const before: any = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { order } = useAppSelector((state) => state.orders);
  //redux + logic
  const filter = useAppSelector((state) => state.product.filter.data); // Lấy tất cả
  const { products } = useAppSelector((state) => state.product); // Lấy tất cả
  // const { productBySlug } = useAppSelector((state) => state.);

  const [arrayTemp, setArrayTemp] = useState([]); // Lấy giá trị trong một khung
  const dispatch = useAppDispatch();
  //const navigate = useNavigate();
  // Tạo thẻ để css thêm
  // const styleElem = document.head.appendChild(document.createElement("style"));
  const navigate = useNavigate();
  // Xử lý đóng mở nút
  const handleOpen = () => {
    scroll();
    if (isOpen === false) {
      item.current.style.display = "flex";
      setIsOpen(true);
    } else {
      item.current.style.display = "none";
      setIsOpen(false);
    }
  };

  // Đóng khi click ra ngoài
  const useOutsideAlerter = (ref: any) => {
    useEffect(() => {
      const handleClickOutside = (event: any) => {
        if (
          ref.current &&
          !ref.current.contains(event.target) &&
          isOpen === true
        ) {
          item.current.style.display = "none";
          setIsOpen(false);
        }
      };
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    });
  };

  useOutsideAlerter(bound);

  const handleAppear = (e: any) => {
    // Lấy keyword
    let newKeyword = {
      [data.title]: e.target.id,
    };
    // kiểm tra có tồn tại chưa trong mảng
    const checkInArray = arrayTemp.some((element) => {
      let value = Object.values(element);
      if (value[0] === e.target.id) return true;
    });
    // Lấy element theo tên
    // const element = Array.from(document.getElementsByName(data.title));
    const element = Array.from(document.getElementsByClassName(data.title));

    // Nếu có thì tắt và bỏ ra khỏi mảng
    if (checkInArray) {
      e.target.style = "border-color: #e1e1e1; color:#333";
      // Tắt bằng id
      const temp = arrayTemp.filter((element) => {
        return Object.values(element) != e.target.id;
      });
      setArrayTemp(temp);
    }
    // Nếu chưa thì bật và thêm vào mảng
    else {
      e.target.style = "border-color: #498fef;color: #498fef;";
      // Mở bằng id
      const temp: any = [...arrayTemp, newKeyword];
      setArrayTemp(temp);
    }
    // kiểm tra có tồn tại trong filter chưa
    const checkInFilter = filter.some((element) => {
      let value = Object.values(element);
      let key = Object.keys(element);
      if (value[0] === e.target.id && key[0] === data.title) return true;
    });

    // Nếu có thì bỏ ra khỏi filter
    if (checkInFilter) {
      element.map((curent: any) => {
        if (curent.id === e.target.id)
          curent.style = "border-color: #e1e1e1; color:#333";
      });
      const temp = filter.filter((element) => {
        let value = Object.values(element);
        let key = Object.keys(element);

        if (key[0] === data.title && value[0] === e.target.id) {
          return;
        } else {
          return element;
        }
      });
      dispatch(handleFilterStore(temp));
    }
    // Nếu chưa thì thêm vào filter
    else {
      element.map((curent: any) => {
        if (curent.id === e.target.id)
          curent.style = "border-color: #498fef;color: #498fef;";
      });
      const temp = [...filter, newKeyword];
      dispatch(handleFilterStore(temp));
    }
    // Hiện nút filter
    itemHiden.current.style.display = "block";
  };

  const handleFilterLocal = () => {
    // filter.splice(0, filter.length);
    handle(true);
    item.current.style.display = "none";
    setIsOpen(false);
    // navigate("/product");
  };

  const Apper = (boolean: boolean) => {
    setIsApper(boolean);
  };

  if (isApper) {
    itemHiden.current.style.display = "block";
  }
  const handleCancel = () => {
    filter.splice(0, filter.length);
    handle(true);
    item.current.style.display = "none";
    setIsOpen(false);
  };
  const checkTurnOn = useCallback(
    () =>
      filter.some((element) => {
        let key = Object.keys(element);
        if (key[0] === data.title) return true;
      }),
    [],
  );

  const checkTurnOn1 = () =>
    filter.some((element) => {
      let key = Object.keys(element);
      if (key[0] === data.title) return true;
    });

  useEffect(() => {
    if (filter.length === 0) setArrayTemp([]);
    if (arrayTemp.length > 0 || (filter.length > 0 && checkTurnOn())) {
      button.current.style.borderColor = "#498fef";
      // number[0].display = "inline";
    } else {
      button.current.style.borderColor = "#e1e1e1";
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.length, checkTurnOn]);

  useEffect(() => {
    if (checkTurnOn1()) {
      button.current.style.borderColor = "#498fef";
      // const number = Array.from(document.getElementsByClassName("number"));
      // number[0].style.display = "inline";
    }
  }, [checkTurnOn1]);
  //console.log(product);
  return (
    <div className={styles.bound} ref={bound}>
      {/* Nút chính */}
      <div className={styles.temp} onClick={handleOpen} id={data.id.toString()}>
        <ButtonFilter title={data.title} ref={button} />
      </div>
      <span className={styles.before} ref={before}></span>
      <div className={styles.item} ref={item}>
        {/* Các nút con */}
        <div className={styles.wrap}>
          {data?.detail?.map((src: any, index: number) => {
            return (
              <span
                className={styles.click}
                onClick={handleAppear}
                id={src}
                key={index}
              >
                {data.title === "Hãng" ? (
                  <ButtonItem
                    title={src?.id}
                    name={data?.title}
                    img={src?.imageUrl?.substring("https:".length)}
                  />
                ) : data.title === "Nhu cầu" ? (
                  <ButtonItem
                    nhucau={src?.name}
                    title={src?.id}
                    name={data?.title}
                  />
                ) : data.title === "Trạng thái đơn hàng" ? (
                  <ButtonItem
                    nhucau={src?.name}
                    title={src?.id}
                    name={data?.title}
                  />
                ) : data.title === "Trạng thái thanh toán" ? (
                  <ButtonItem
                    nhucau={src?.name}
                    title={src?.id}
                    name={data?.title}
                  />
                ) : (
                  <ButtonItem title={src} name={data.title} />
                )}
              </span>
            );
          })}
        </div>
        {data.title == "Giá" ? <SliderPrice Apper={Apper} /> : ""}

        {/* Kết quả */}
        {/* {location.pathname === "/product" ? (
          <div className={styles.itemHiden} ref={itemHiden}>
            <Link
              to={path.product}
              className={styles.close}
              onClick={handleCancel}
            >
              Bỏ chọn
            </Link>
            <div className={styles.open} onClick={handleFilterLocal}>
              Xem {product?.data?.totalElements} kết quả
            </div>
          </div>
        ) : location.pathname === "/tablet" ? (
          <div className={styles.itemHiden} ref={itemHiden}>
            <Link
              to={path.tablet}
              className={styles.close}
              onClick={handleCancel}
            >
              Bỏ chọn
            </Link>
            <div className={styles.open} onClick={handleFilterLocal}>
              Xem {productBySlug?.data?.totalElements} kết quả
            </div>
          </div>
        ) : (
          <div className={styles.itemHiden} ref={itemHiden}>
            <Link
              to={location.pathname.substring(11)}
              className={styles.close}
              onClick={handleCancel}
            >
              Bỏ chọn
            </Link>
            <div className={styles.open} onClick={handleFilterLocal}>
              Xem {productBySlug?.data?.totalElements} kết quả
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};
export default FilterItem;

