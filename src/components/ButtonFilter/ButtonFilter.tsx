import { forwardRef } from "react";
import styles from "./btnFilter.module.scss";

function ButtonFilter({ title, id }: any, ref: any) {
  return (
    <div className={styles.wrap} id={id} ref={ref}>
      <span className={styles.text} id={id}>
        {title}
        <span className={styles.arrow}></span>
      </span>
    </div>
  );
}

export default forwardRef(ButtonFilter);

