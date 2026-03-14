import React from "react";

const RssFeed = () => {
  return (
    <div className="rss-page">
      <div className="container">
        <h1 className="rss-title">RSS Feeds</h1>

        {/* Top Categories */}
        <div className="rss-top-links">
          <a href="#">Prep Basic</a>
          <a href="#">Comedy</a>
          <a href="#">Audio</a>
        </div>

        {/* Main Grid */}
        <div className="rss-grid">
          {/* Column 1 */}
          <div className="rss-column">
            <ul>
              <li>
                <a href="#">Today's Headlines</a>
              </li>
              <li>
                <a href="#">Entertainment News</a>
              </li>
              <li>
                <a href="#">Top Music News</a>
              </li>
              <li>
                <a href="#">Lifestyle News</a>
              </li>
              <li>
                <a href="#">Offbeat News</a>
              </li>
              <li>
                <a href="#">On Today’s Date</a>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="rss-column">
            <ul>
              <li>
                <a href="#">Comedy Bits</a>
              </li>
              <li>
                <a href="#">One-liners</a>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="rss-column">
            <ul>
              <li>
                <a href="#">Daily Audio</a>
              </li>
              <li>
                <a href="#">Seed Calls Audio</a>
              </li>
              <li>
                <a href="#">Sports Audio</a>
              </li>
              <li>
                <a href="#">Tabloid</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Second Section */}
        <div className="rss-bottom-grid">
          <div className="rss-column">
            <h3><a href="#">Add-ons</a></h3>
            <ul>
              <li>
                <a href="#">Bits and Burners</a>
              </li>
              <li>
                <a href="#">Good News</a>
              </li>
              <li>
                <a href="#">Format News/ Calendars</a>
              </li>
              <li>
                <a href="#">AC/Hot AC</a>
              </li>
              <li>
                <a href="#">CHR/Rhythmic</a>
              </li>
              <li>
                <a href="#">Classic Hits/Oldies</a>
              </li>
              <li>
                <a href="#">Classic Rock</a>
              </li>
              <li>
                <a href="#">Country</a>
              </li>
              <li>
                <a href="#">Rock</a>
              </li>
              <li>
                <a href="#">Song Anatomy</a>
              </li>
              <li>
                <a href="#">Oldies Trivia</a>
              </li>
              <li>
                <a href="#">Viral Videos</a>
              </li>
              <li>
                <a href="#">Lifestyle Extra</a>
              </li>
            </ul>
          </div>

          <div className="rss-column">
            <h3><a href="#">Archives</a></h3>
            <ul>
              <li>
                <a href="#">Confession lines</a>
              </li>
              <li>
                <a href="#">Loser Line</a>
              </li>
              <li>
                <a href="#">Vent line</a>
              </li>
              <li>
                <a href="#">Phone Jacks</a>
              </li>
              <li>
                <a href="#">Comedy Bits</a>
              </li>
              <li>
                <a href="#">Comedy Calls</a>
              </li>
            </ul>
          </div>

          <div className="rss-column">
            <h3> <a href="#">Guest booking</a></h3>
            <ul>
              <li>
                <a href="#">InstaGuest</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RssFeed;
