import styles from "./sliderPrice.module.scss";
import { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { handleFilterStore } from "src/store/product/productSlice";

const SliderPrice = ({ Apper }: any) => {
  //css
  const [min, setMin] = useState<number>(0);
  const [max, setMax] = useState<number>(100);
  const [commaMin, setCommaMin] = useState<string>("0");
  const [commaMax, setCommaMax] = useState<string>("100");

  const progress: any = useRef();
  const minVal: any = useRef();
  const maxVal: any = useRef();
  //redux + logic
  const filter = useAppSelector((state) => state.product.filter.data); // Lấy tất cả
  const dispatch = useAppDispatch();

  const handleInputMin = (e: any) => {
    const value = e.target.value;

    if (!value.includes(".")) {
      setMin(value);
      let commas = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      setCommaMin(commas);
    } else {
      let commas = value.toString().replace(".", "");
      setCommaMin(commas);
      setMin(commas);
    }
    if (max - min < 100) {
      // minVal.current.value = max - 100;
    } else {
      const temp = (min / 100) * 100 + "%";
      progress.current.style.left = `${temp}`;
    }
  };

  const handleInputMax = (e: any) => {
    const value = e.target.value;

    if (!value.includes(".")) {
      setMax(value);
      let commas = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      setCommaMax(commas);
    } else {
      let commas = value.toString().replace(".", "");

      setCommaMax(commas);
      setMax(commas);
    }
    if (max - min < 100) {
      // maxVal.current.min = min + 100;
    } else {
      const temp = 100 - (max / 100) * 100 + "%";
      progress.current.style.right = `${temp}`;
    }
  };

  useEffect(() => {
    if (min != 0 || max != 100) Apper(true);
    const temp = (min / 100) * 100 + "%";
    progress.current.style.left = `${temp}`;
    const temp1 = 100 - (max / 100) * 100 + "%";
    progress.current.style.right = `${temp1}`;

    const string = `${min} - ${max}`;
    // Lấy keyword
    if (min != 0 || max != 100) {
      let newKeyword = {
        Giá: string,
      };

      // kiểm tra có tồn tại chưa trong filter chưa
      const checkInFilter = filter.some((element) => {
        let key = Object.keys(element);

        if (key[0] == "Giá") return true;
      });

      // Nếu có thì bỏ ra khỏi filter
      if (checkInFilter) {
        const temp = filter.map((obj: any) => {
          if (obj.Giá) {
            return newKeyword;
          }

          return obj;
        });

        dispatch(handleFilterStore(temp));
      } else {
        const temp = [newKeyword];
        dispatch(handleFilterStore(temp));
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [min, max]);

  return (
    <div className={styles.priceBar}>
      <div className={styles.rowInput}>
        <form className={styles.range}>
          <span className={styles.left}>
            <input
              className={styles.input}
              type="number"
              maxLength={8}
              name="price-min-value"
              min="0"
              max="100"
              value={commaMin}
              onChange={(e) => handleInputMin(e)}
            />

            <label className={styles.placeHolder}>.000.000đ</label>
          </span>
          <span className={styles.right}>
            <input
              className={styles.input}
              type="number"
              maxLength={8}
              name="price-max-value"
              min="0"
              max="100"
              value={commaMax}
              onChange={(e) => handleInputMax(e)}
            />

            <label className={styles.placeHolder}>.000.000đ</label>
          </span>
        </form>
      </div>
      <div className={styles.slider}>
        <div className={styles.progress} ref={progress}></div>
      </div>
      <div className={styles.rangeInput}>
        <input
          type="range"
          className={styles.rangeMin}
          min="0"
          max="100"
          value={min}
          onChange={(e) => handleInputMin(e)}
          ref={minVal}
        />
        <input
          type="range"
          className={styles.rangeMax}
          min="0"
          max="100"
          value={max}
          onChange={(e) => handleInputMax(e)}
          ref={maxVal}
        />
      </div>
    </div>
  );
};

export default SliderPrice;

