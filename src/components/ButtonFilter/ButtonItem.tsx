import styles from "./btnItem.module.scss";

type Props = {
  title: string;
  name: string;
  img?: string;
  id?: number;
  nhucau?: string;
};
function ButtonItem(props: Props) {
  return (
    <div
      className={`${styles.wrap}  ${props.name} `}
      id={props.title}
      title={props.name}
    >
      {props.img ? (
        <img src={`https:` + props?.img} className={styles.text}></img>
      ) : (
        <span className={styles.text}>
          {props.name === "Nhu cầu" ||
          props.name === "Trạng thái đơn hàng" ||
          props.name === "Trạng thái thanh toán"
            ? props.nhucau
            : props.title}
        </span>
      )}
    </div>
  );
}

export default ButtonItem;

