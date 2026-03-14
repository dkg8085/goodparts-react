import React, { useState, useRef } from "react";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Spinners from "../Common/Spinners";

const MediaItem = ({ media, hideDownload, isArchiveType }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (media.type === "embed" && media.embed_html) {
    return (
      <div className="media-list-wrapper">
        <div
          className="media-embed"
          dangerouslySetInnerHTML={{ __html: media.embed_html }}
        />
        {media.title && (
          <a
            href={media.media_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="media-des"
            style={{ textDecoration: "underline", color: "inherit" }}
          >
            {media.title}
          </a>
        )}
      </div>
    );
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = async (event, url) => {
    event.preventDefault();
    setIsLoading(true);

    const apiBaseUrl = import.meta.env.VITE_BASE_URL;
    const proxyBaseUrl = import.meta.env.VITE_PROXY_BASE_URL;
    const proxyUrl = url.replace(apiBaseUrl, proxyBaseUrl);

    try {
      const response = await fetch(proxyUrl);
      const blob = await response.blob();
      const filename = url.split("/").pop();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clipLength = media.custom_fields?.clip_length?.[0] || media.clip_length;
  const audioUrl = media.media_upload_url || media.media_url;

  return (
    <div className="media-list-wrapper">
      <div className="media-player">
        <div
          className="custom-player media-view"
          style={{ position: "relative" }}
        >
          <audio ref={audioRef} className="cust-audio-player">
            <source type="audio/mpeg" src={audioUrl} />
          </audio>
          <button className="cust-audio-btn test1" onClick={togglePlay}>
            {isPlaying ? (
              <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#ff0000"
                  strokeWidth="1.5"
                />
                <line
                  x1="9.14"
                  y1="7.23"
                  x2="9.14"
                  y2="16.77"
                  stroke="#FF0100"
                  strokeWidth="1.91"
                />
                <line
                  x1="14.86"
                  y1="7.23"
                  x2="14.86"
                  y2="16.77"
                  stroke="#FF0100"
                  strokeWidth="1.91"
                />
              </svg>
            ) : (
              <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#ff0000"
                  strokeWidth="1.5"
                />
                <path
                  d="M15.41 10.94C16.19 11.40 16.19 12.60 15.41 13.06L10.69 15.85C9.93 16.29 9 15.71 9 14.79V9.21C9 8.29 9.93 7.71 10.69 8.15L15.41 10.94Z"
                  stroke="#ff0000"
                  strokeWidth="1.5"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div
        rel="noopener noreferrer"
        className="media-des"
        style={{
          textDecoration: isArchiveType ? "underline" : "none",
        }}
      >
        {media.clip_description || media.title || media.description}
      </div>

      <div className="media-length-download">
        {clipLength && <div className="media-length">{clipLength}</div>}
        {!hideDownload && (
          <div className="media-download">
            <a
              className="downloadLink"
              href={audioUrl}
              onClick={(e) => handleDownload(e, audioUrl)}
            >
              {isLoading && <Spinners />}
              <FontAwesomeIcon icon={faDownload} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default function MediaList({ mediaList, hideDownload, isArchiveType }) {
  return (
    <>
      {mediaList && (
        <>
          <MediaItem
            media={mediaList}
            hideDownload={hideDownload}
            isArchiveType={isArchiveType}
          />
          {Array.isArray(mediaList.media_lists) &&
            mediaList.media_lists.map((media, index) => (
              <MediaItem
                key={index}
                media={media}
                hideDownload={hideDownload}
                isArchiveType={isArchiveType}
              />
            ))}
        </>
      )}
    </>
  );
}
