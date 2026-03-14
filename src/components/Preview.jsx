import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";


import { MoonLoader } from "react-spinners";

import ManageShowSheet from "./Common/ManageShowSheet";
import MediaList from "./Common/MediaList";
import ScriptList from "./Common/ScriptList";
import AddandRemoveShowSheet from "./Common/AddandRemoveShowSheet";
import PostIconSvg from "./Common/PostIconSvg";
import AddandRemoveFavorites from "./Common/AddandRemoveFavorites";

const WP_URL = "https://goodpartsadmin.boomsite.fm/";

function addTargetBlankToLinks(htmlInput) {
    let htmlString = Array.isArray(htmlInput) ? htmlInput[0] : htmlInput;
    if (typeof htmlString !== "string") return "";
    return htmlString.replace(
      /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1([^>]*)>/gi,
      (match, quote, url, rest) => {
        if (/target\s*=/i.test(rest)) return match;
        return `<a href=${quote}${url}${quote} target="_blank" rel="noopener noreferrer"${rest}>`;
      },
    );
  }


export default function Preview() {

  const [searchParams] = useSearchParams();
  const postId = searchParams.get("postId");
  const token = searchParams.get("token");

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const selectedTaxonomy = localStorage.getItem("selectedTaxonomy");
  let assignTaxonomyName = selectedTaxonomy || null;
  if (!assignTaxonomyName) {
    const assignTaxonomy = localStorage.getItem("assign_taxonomies");
    const assignTaxonomyData = assignTaxonomy
      ? JSON.parse(assignTaxonomy)
      : null;
    assignTaxonomyName = assignTaxonomyData?.[0] || null;
  }

  
  const isArchiveType = (() => {
    const archiveSlugs = ["prank-category", "listener-category"];
    if (post?.categories && post.categories.length > 0){
      const taxSlug = post?.categories[0].taxonomy_slug;
      return archiveSlugs.includes(taxSlug);
    }
    return false;
  })();

  useEffect(() => {

    if (!postId || !token) {
      setError("Missing preview details.");
      setLoading(false);
      return;
    }

    const fetchPreview = async () => {
      try {

        const res = await fetch(
          `${WP_URL}/wp-json/headless/v1/preview/${postId}?token=${encodeURIComponent(token)}`
        );

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${await res.text()}`);
        }
        const mediaId = res?.meta_box?.media_list_items?.[0]?.media_list_upload?.[0];

        const data = await res.json();
        // console.log("Data",data.data.data.data)
        setPost({
            ...data.data.data.data,
          });
          setDataLoaded(true);
      } catch (err) {
        setError(err.message || "Preview failed.");
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();

  }, [postId, token]);

  
  const hasPulseFields = post?.meta_box?.pulse_file_path?.[0];
  
  return (
<section id="g-page-surround" className="single-post-layout single-page draft">
        <div className="container">
          {error && <p style={{ color: "red" }}>Error: {error}</p>}
          {!dataLoaded ? (
            <div className="loader-overlay">
              <MoonLoader color="#15273B" loading size={50} />
            </div>
          ) : (
            <div className="us-perp-content">
              <div className="usprep-head row">
                <div className="banner-meta col-12">
                  <div className="post-meta row">
                    <div className="meta-publish col-12">
                      <div className="meta-icon">
                        <PostIconSvg />
                      </div>
                      <div className="usprep-date">
                        <span>DRAFT </span>
                      </div>
                    </div>

                    <div className="post-term col-12">
                      {post?.categories?.map(
                        (categoryItem, index) =>
                          categoryItem.name &&
                          categoryItem.name.trim() !== "" && (
                            <React.Fragment key={index}>
                              <div 
                                // to="#"
                                // onClick={(e) => {
                                //   e.preventDefault();
                                //   // Navigate using the clicked category name
                                //   navigate(`/${assignTaxonomyName}`, {
                                //     state: {
                                //       clickedCatName: categoryItem.name,
                                //     },
                                //   });
                                // }}
                                className="cat-preview-wrapper"
                              >
                                {categoryItem.name}
                              </div>
                              {/* Add a separator between categories (optional) */}
                              {index < post.categories.length - 1 && (
                                <span className="category-separator">, </span>
                              )}
                            </React.Fragment>
                          ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="usprep-body row tx-page-items">
                <div className="usprep-title col-12">
                  <h2>{post?.title}</h2>
                </div>
                <div className="usprep-post-content col-12">
                  <div className="post-content-wrap col-12">
                    <p
                      dangerouslySetInnerHTML={{
                        __html:
                          addTargetBlankToLinks(
                            post?.custom_fields?.prep_content,
                          ) || "No content available",
                      }}
                    ></p>
                  </div>
                  <div className="post-media-list">
                    {post?.custom_fields?.media_list_items?.length > 0 &&
                      post?.media_post_data?.map((media, index) => (
                        <MediaList key={index} mediaList={media} />
                      ))}
                    {post?.custom_fields?.add_script?.[0] === "yes" && (
                      <ScriptList scriptList={post} />
                    )}
                  </div>
                  <div className="post-btns">
                    <AddandRemoveShowSheet itemid={post?.ID} />
                    <ManageShowSheet itemid={post?.ID} />
                    <AddandRemoveFavorites
                      itemid={post?.ID}
                      categoriesName={post?.category}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="backto-top">
            <a href="#g-page-surround"> Back to top </a>
          </div>
        </div>
      </section>
  );
}