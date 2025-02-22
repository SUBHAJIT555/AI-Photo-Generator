import React from "react";
import loadingVideo from "../assets/loading.mp4";

function Loadingswaping(props) {
  return (
    <div style={{ display: props.visibilyy }}>
      <h1>hello</h1>
      <video autoPlay loop muted playsInline width="1080" height="1920">
        <source src={loadingVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default Loadingswaping;
