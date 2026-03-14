import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import ModalPopup from "./Common/ModalPopup";
import ShowSheetCloseIconSvg from './Common/ShowSheetCloseIconSvg';

const ShowsheetVideoContent = () => {
    const [isHowWorksOpen, setIsHowWorksOpen] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ type: "", src: "" });

    const openModal = (type, src) => {
        setModalContent({ type, src });
        setIsOpen(true);
    };

    const handleHowItWorksSec = (e) => {
        e?.preventDefault();
        setIsHowWorksOpen(!isHowWorksOpen);
    };

    return (
        <div className="how-it-works-container">
            {!isHowWorksOpen ? (
                <div className="how-it-works-open">
                    <a href="#" onClick={handleHowItWorksSec}>Open how it works video</a>
                </div>
            ) : (
                <div className="how-it-works-video-wrap">
                    <div className="close-sec" onClick={handleHowItWorksSec}>
                        <div className="cross-btn">
                            <ShowSheetCloseIconSvg />
                        </div>
                    </div>
                    <div className="accordion-title">
                        <h2>How it works</h2>
                    </div>
                    <div className="how-it-works-list">
                        <ul className="checklist">
                            <li>
                                <FontAwesomeIcon icon={faCheckCircle} className="icon" />
                               <span>Add content and order it as you’d like to use in your show.</span>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faCheckCircle} className="icon" />
                            <span>Print your show sheet or remove items as you use them on air.</span>    
                            </li>
                        </ul>
                    </div>
                    <div className="how-it-works-video-sec">
                        <div className="img-container">
                            <img src="/assets/images/background-showsheet.png" alt="Sample Image" />
                            <div className="icon-container" onClick={() => openModal("video", "https://boom-site-wp.s3.us-east-2.amazonaws.com/wp-content/uploads/2024/04/01100548/Show-sheet-1.mp4")}>
                                                                
                                        <svg
                                        width="60"
                                        height="60"
                                        viewBox="0 0 100 100"
                                        xmlns="http://www.w3.org/2000/svg"
                                        >
                                        <circle cx="50" cy="50" r="50" fill="rgba(255,255,255,0.3)" />
                                        <polygon points="40,30 70,50 40,70" fill="#ff2828" />
                                        </svg>
                                        
                            </div>
                            <ModalPopup isOpen={isOpen} onClose={() => setIsOpen(false)} contentType={modalContent.type} contentSrc={modalContent.src} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShowsheetVideoContent;
