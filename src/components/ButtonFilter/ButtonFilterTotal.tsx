import { Funnel } from "react-bootstrap-icons";

import styles from "./btnFilterTotal.module.scss";
import { forwardRef, useRef } from "react";
import { useAppSelector } from "src/hooks/useRedux";

const ButtonFilterTotal = ({}, ref: any) => {
  const filter = useAppSelector((state) => state.product.filter.data); // Lấy tất cả

  const number: any = useRef();
  return (
    <div className={styles.wrap} ref={ref}>
      <span className={styles.text}>
        <i className={styles.fristIcon}>
          <Funnel className="text-2xl mr-1" />
        </i>
        Bộ lọc
        <strong className={styles.number} ref={number}>
          {filter.length}
        </strong>
      </span>
    </div>
  );
};

export default forwardRef(ButtonFilterTotal);

