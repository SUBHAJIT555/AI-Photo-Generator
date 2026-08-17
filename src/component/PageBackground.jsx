import boothBackground from "../assets/logo/Fab-Photobooth_Background.png";
import "./PageBackground.css";

function PageBackground() {
  return (
    <div className="page-background" aria-hidden="true">
      <img
        src={boothBackground}
        alt=""
        className="page-background__image"
      />
      <div className="page-background__overlay" />
    </div>
  );
}

export default PageBackground;
