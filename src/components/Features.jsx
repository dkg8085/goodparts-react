import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPrepSection } from "../redux/thunks/prepSectionThunks";
import { useNavigate } from "react-router-dom";
import magnifier from "/public/assets/images/magnifier.svg";

const Features = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items, status, error } = useSelector((state) => state.prepSection);
  
  useEffect(() => {
    
    dispatch(fetchPrepSection());
  }, [dispatch]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>{error}</p>;

  const handleClick = (feature) => {
    navigate(`/${feature.prep_taxonomies}`);
  };

  return (
    <>     

      <div className="box-wrapper">
        <div className="box-container">
          <div className="row">
            {items.map((feature, index) => (
              <div className="box-term-item" key={index}>
                <div className="box_content_wrapper">
                  <div className="term_head">
                    <div className="icons">
                      <img
                        src={feature.icon_url}
                        width="25"
                        alt={feature.content_title}
                      />
                    </div>
                    <div className="heading">
                      <h4>{feature.taxonomy_title}</h4>
                    </div>
                  </div>

                  <div className="bucketdesc">
                    <h4>{feature.content_title}</h4>
                    <div
                      className="nb_term_post"
                      dangerouslySetInnerHTML={{
                        __html: feature.content_description,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Features;
