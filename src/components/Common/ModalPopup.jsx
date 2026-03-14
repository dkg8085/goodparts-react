import React, { useEffect } from "react";

function ModalPopup({ isOpen, onClose, contentType, contentSrc }) {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"; // Stop scrolling
        } else {
            document.body.style.overflow = ""; // Restore scrolling
        }

        return () => {
            document.body.style.overflow = ""; // Cleanup on unmount
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay show-sheet-popup" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                {/* Close Button */}
                {/* <button className="close-btn" onClick={onClose}>x</button> */}
                <div className="close-btn" onClick={onClose}><span>×</span></div>
                {/* Render Based on Content Type */}
                {contentType === "video" ? (
                    // <iframe
                    //     width="100%"
                    //     height="400"
                    //     src={contentSrc}
                    //     title="Video Player"
                    //     allow="autoplay; fullscreen"
                    //     allowFullScreen
                    // ></iframe>
                    <video width="100%" controls autoPlay>
                        <source src={contentSrc} type="video/mp4" />
                        <source src={contentSrc} type="video/ogg" />
                        Error Playing Video
                    </video>
                ) : contentType === "image" ? (
                    <img src={contentSrc} alt="Popup Content" className="modal-image" />
                ) : (
                    <div className="custom-content">{contentSrc}</div>
                )}
            </div>
        </div>
    );
}

export default ModalPopup;
