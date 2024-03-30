import classNames from "classnames/bind";
import "./styles.css";

// const cx = classNames.bind(styles);
function Skeleton({ children, styles, className }: any) {
  return (
    <div className={`skeleton ${className}`} style={styles}>
      {children}
    </div>
  );
}

export default Skeleton;

