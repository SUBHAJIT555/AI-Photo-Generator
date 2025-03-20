import loadingVideo from "../assets/loading.mp4";
import PropTypes from "prop-types";

const LoadingSwapping = ({ visibility }) => {
  return (
    <div style={{ display: visibility }} className="fixed  h-screen w-[100vw]">
      {/* <h1>hello</h1> */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        <source src={loadingVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

LoadingSwapping.propTypes = {
  visibility: PropTypes.string.isRequired,
};

export default LoadingSwapping;
