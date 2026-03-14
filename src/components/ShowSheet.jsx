import ShowsheetVideoContent from './ShowsheetVideoContent'
import AccordionShowSheet from './AccordionShowSheet'

const ShowSheet = () => {
       return (
        <section className="show-sheet-main-wrap" id="top-show-sheet">
            <div className="container">
                <div className="how-it-works-wrap">
                    <ShowsheetVideoContent />
                </div>
            </div>

            <div className="show-sheet-sect">
                <div className="container">
                    <AccordionShowSheet />
                    <div className="show-backto-top">
                        <a href="#top">Back to top</a>
                        <div className="horizontal_line"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ShowSheet;
