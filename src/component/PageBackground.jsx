import boothBackground from "../assets/logo/UI-bg.png";
import "./PageBackground.css";

function PageBackground() {
  return (
    <div className="page-background" aria-hidden="true">
      <img
        src={boothBackground}
        alt=""
        className="page-background__image"
      />
    </div>
  );
}

export default PageBackground;
