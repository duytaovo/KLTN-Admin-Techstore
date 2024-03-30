import styles from "./filteritemtotal.module.scss";
import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ButtonFilterTotal from "src/components/ButtonFilter/ButtonFilterTotal";
import ButtonItem from "src/components/ButtonFilter/ButtonItem";
import path from "src/constants/path";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { handleFilterStore } from "src/store/product/productSlice";

interface Props {
  data: any;
  handle: (boolean: boolean) => void;
  scroll: () => void;
}

const FilterItemTotal = ({ data, handle, scroll }: Props) => {
  //css
  const [isOpen, setisOpen] = useState<boolean>(false);
  const item: any = useRef<HTMLDivElement>(null);
  const bound: any = useRef<HTMLDivElement>(null);
  const button: any = useRef<HTMLDivElement>(null);
  const itemHiden: any = useRef<HTMLDivElement>(null);
  const before: any = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  let filter = useAppSelector((state) => state.product.filter.data); // Lấy tất cả
  const { product } = useAppSelector<any>((state) => state.product); // Lấy tất cả
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { order } = useAppSelector((state) => state.orders);
  const { productDetail } = useAppSelector((state) => state.product);

  // Xử lý đóng mở nút
  const handleOpen = () => {
    scroll();
    if (isOpen === false) {
      item.current.style.display = "flex";
      setisOpen(true);
    } else {
      item.current.style.display = "none";
      setisOpen(false);
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
          setisOpen(false);
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
    const title = e.target.title;
    const id = e.target.id;
    let newKeyword = {
      [title]: id,
    };
    // // Lấy element theo tên
    const elements = Array.from(document.getElementsByClassName(title));
    // // kiểm tra có tồn tại chưa trong filter chưa
    const checkInFilter: boolean = filter.some((element) => {
      let value = Object.values(element);
      let key = Object.keys(element);
      if (value[0] === id && key[0] === title) return true;
    });

    //  // Nếu có thì bỏ ra khỏi filter
    if (checkInFilter === true) {
      elements.map((current: any) => {
        if (current.id === id)
          current.style = "border-color: #e1e1e1; color:#333";
      });
      const temp = filter.filter((element) => {
        let value = Object.values(element);
        let key = Object.keys(element);
        if (key[0] === title && value[0] === id) {
          return;
        } else {
          return element;
        }
      });
      dispatch(handleFilterStore(temp));
    }
    // Nếu chưa thì thêm vào filter
    else {
      elements.map((current: any) => {
        if (current.id === id) {
          current.style.display = "none";
          current.style = "border-color: #498fef;color: #498fef;";
        }
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
    setisOpen(false);
    // navigate("/product");
  };
  const handleCancel = () => {
    filter.splice(0, filter.length);
    handle(true);
    item.current.style.display = "none";
    setisOpen(false);
  };

  useEffect(() => {
    if (filter.length > 0) {
      button.current.style.borderColor = "#498fef";
    } else {
      button.current.style.borderColor = "#e1e1e1";
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleAppear]);
  //console.log(location.pathname);
  return (
    <div className={styles.bound} ref={bound}>
      {/* Nút chính */}
      <div className={styles.temp} onClick={handleOpen}>
        <ButtonFilterTotal ref={button} />
      </div>

      <span className={styles.before} ref={before}></span>

      <div className={styles.item} ref={item}>
        {/* Các nút con */}
        <div className={styles.wrap}>
          {data?.map((src: any, index: number) => {
            return (
              <div className={styles.show} key={index}>
                <p className={styles.text}>{src.title}</p>
                <span className={styles.click}>
                  {src?.detail?.map((btn: any, index: number) => {
                    return (
                      <div className="" onClick={handleAppear} key={index}>
                        {src.title === "Hãng" ? (
                          <ButtonItem
                            title={btn?.id}
                            name={src?.title}
                            img={btn?.imageUrl?.substring("https:".length)}
                          />
                        ) : src.title === "Nhu cầu" ? (
                          <ButtonItem
                            nhucau={btn?.name}
                            title={btn?.id}
                            name={src?.title}
                          />
                        ) : src.title === "Trạng thái đơn hàng" ? (
                          <ButtonItem
                            nhucau={btn?.name}
                            title={btn?.id}
                            name={src?.title}
                          />
                        ) : src.title === "Trạng thái thanh toán" ? (
                          <ButtonItem
                            nhucau={btn?.name}
                            title={btn?.id}
                            name={src?.title}
                          />
                        ) : (
                          <ButtonItem title={btn} name={src.title} />
                        )}
                      </div>
                    );
                  })}
                </span>
              </div>
            );
          })}
        </div>

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

export default FilterItemTotal;

