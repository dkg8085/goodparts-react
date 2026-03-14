import React from "react";

const Tutorials = () => {
  return (
    <section className="how-it-works-video-sec">
  <div className="container">

    <div className="video-row">
      <div className="video-item">
        <h3>Navigating Content</h3>
        <video controls>
          <source src="/assets/video/Content-Navigation.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="video-item">
        <h3>Show Sheet Basics</h3>
        <video controls>
          <source src="/assets/video/Show-sheet-1.mp4" type="video/mp4" />
        </video>
      </div>
    </div>

    <div className="video-row">
      <div className="video-item">
        <h3>Working with Saved Show Sheets</h3>
        <video controls>
          <source src="/assets/video/Show-sheet-–-Boomsite.mp4" type="video/mp4" />
        </video>
      </div>
    </div>

  </div>
</section>
  );
};

export default Tutorials;
