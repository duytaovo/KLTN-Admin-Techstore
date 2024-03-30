import "./buttontablink.scss";
function ButtonTablink({ title, bg, color, active }: any) {
  return (
    <span className={`tabLink ${bg} ${color} ${active ? "active" : ""}`}>
      {title}
    </span>
  );
}

export default ButtonTablink;
