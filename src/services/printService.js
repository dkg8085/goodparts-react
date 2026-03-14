export const handlePrint = (type, AllPostData, selectedBtnIds) => {
  let dataToPrint = [];

  if (type === 'selected') {
    dataToPrint = AllPostData.filter(post => selectedBtnIds.includes(post.ID));
  } else {
    dataToPrint = AllPostData;
  }

  if (dataToPrint.length === 0) {
    alert("Please Select Atleast One Post!");
    return;
  }

  const printIframe = document.createElement("iframe");
  printIframe.style.position = "absolute";
  printIframe.style.width = "0px";
  printIframe.style.height = "0px";
  printIframe.style.border = "none";
  document.body.appendChild(printIframe);
  const printDocument = printIframe.contentDocument || printIframe.contentWindow.document;
  printDocument.open();
  printDocument.write(`
    <html>
    <head>
        <title>Print Show Sheet</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: left; border-bottom: 1px solid #000; }
            .post { border-bottom: 1px solid #ddd; margin-bottom: 10px; padding-bottom: 10px; }
            .media-list-wrapper { margin-top: 10px; display: flex; border-bottom: solid 1px #C8C8C9; padding-bottom: 30px; margin-bottom: 30px; justify-content: center; align-items: center; }
            .media-player { width: 70px; text-align: center; }
            .media-des { font-weight: bold; width: calc(100% - 190px); padding: 0 25px; color: #707070; font-size: 16px; line-height: 32px; font-family: 'Proxima Nova'; }
            .media-length-download { display: flex; justify-content: space-between; }
            .media-length { font-style: italic; }
            .media-download a { text-decoration: none; }
            svg { width: 40px; }
            button { border: none; background: transparent; }
            .script-content { margin-top: 10px; padding: 10px; background: #f9f9f9; border-left: 3px solid #ff2828; }
        </style>
    </head>
    <body>
        <h1>Show Sheet</h1>
        ${dataToPrint.map(post => {
          // Extract script content (prep_content) safely
          const scriptContent = post.custom_fields?.prep_content || '';
          const hasScript = post.custom_fields?.add_script?.[0] === "yes";

          return `
            <div class="post">
                <h2>${post.title}</h2>
                <p>${scriptContent || "No content available"}</p>
                <div class="post-media-list">
                    ${post.custom_fields?.media_list_items?.length > 0 ? `
                        ${post.media_post_data?.map(media => `
                            <div class="media-list-wrapper">
                                <div class="media-player">
                                    <div class="custom-player media-view" style="position: relative;">
                                        <button class="cust-audio-btn test1" onclick="playMedia('${media.url}')">
                                            <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="10" stroke="#000" stroke-width="1.5" />
                                                <path d="M15.41 10.94C16.19 11.40 16.19 12.60 15.41 13.06L10.69 15.85C9.93 16.29 9 15.71 9 14.79V9.21C9 8.29 9.93 7.71 10.69 8.15L15.41 10.94Z" stroke="#000" stroke-width="1.5" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div class="media-des">${media.title}</div>
                                <div class="media-length-download">
                                    <div class="media-length">${media.custom_fields?.clip_length || "N/A"}</div>
                                    <div class="media-download">
                                        <a class="downloadLink" href="${media.download_url || '#'}" download>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none">
                                                <path d="m8 12 4 4 4-4" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M12 16V4M19 17v.6c0 1.33-1.07 2.4-2.4 2.4H7.4C6.07 20 5 18.93 5 17.6V17" stroke="#000000" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"/>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            ${media.media_lists?.map(subMedia => `
                                <div class="media-list-wrapper">
                                    <div class="media-player">
                                        <div class="custom-player media-view" style="position: relative;">
                                            <button class="cust-audio-btn test1" onclick="playMedia('${subMedia.url}')">
                                                <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none">
                                                    <circle cx="12" cy="12" r="10" stroke="#000" stroke-width="1.5" />
                                                    <path d="M15.41 10.94C16.19 11.40 16.19 12.60 15.41 13.06L10.69 15.85C9.93 16.29 9 15.71 9 14.79V9.21C9 8.29 9.93 7.71 10.69 8.15L15.41 10.94Z" stroke="#000" stroke-width="1.5" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="media-des">${subMedia.description}</div>
                                    <div class="media-length-download">
                                        <div class="media-length">${subMedia.custom_fields?.clip_length || subMedia.clip_length || "N/A"}</div>
                                        <div class="media-download">
                                            <a class="downloadLink" href="${subMedia.download_url || '#'}" download>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none">
                                                    <path d="m8 12 4 4 4-4" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M12 16V4M19 17v.6c0 1.33-1.07 2.4-2.4 2.4H7.4C6.07 20 5 18.93 5 17.6V17" stroke="#000000" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"/>
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        `).join('')}
                    ` : ''}

                    ${hasScript ? `
                        <div class="media-list-wrapper">
                            <div class="media-player">
                                <div class="custom-player media-view" style="position: relative;">
                                    <a class="script" href="#">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" id="script" width="40" height="40">
                                            <g>
                                                <path d="M20 13a5 5 0 0 1-5-5V3.14A2.939 2.939 0 0 1 15.23 2H9a3.009 3.009 0 0 0-3 3v22a3.009 3.009 0 0 0 3 3h14a3.009 3.009 0 0 0 3-3V12.82a2.772 2.772 0 0 1-1 .18Zm-5.293 10.293a1 1 0 1 1-1.414 1.414l-2-2a1 1 0 0 1 0-1.414l2-2a1 1 0 0 1 1.414 1.414L13.414 22Zm6-.586-2 2a1 1 0 0 1-1.414-1.414L18.586 22l-1.293-1.293a1 1 0 0 1 1.414-1.414l2 2a1 1 0 0 1 0 1.414Z" />
                                                <path d="M24.953 7.643 19.21 2.721a3.157 3.157 0 0 0-.839-.51A1 1 0 0 0 17 3.14V8a3 3 0 0 0 3 3h5a1 1 0 0 0 1-1v-.08a3.008 3.008 0 0 0-1.047-2.277Z" />
                                            </g>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                            <div class="media-des">SCRIPT</div>
                            <div class="media-length-download">
                                <div class="media-download">
                                    <!-- Download link with actual script content as data URI -->
                                    <a class="downloadLink" 
                                       href="data:text/plain;charset=utf-8,${encodeURIComponent(scriptContent)}" 
                                       download="${post.title.replace(/[^a-z0-9]/gi, '_')}_script.txt">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none">
                                            <path d="m8 12 4 4 4-4" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M12 16V4M19 17v.6c0 1.33-1.07 2.4-2.4 2.4H7.4C6.07 20 5 18.93 5 17.6V17" stroke="#000000" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <!-- Optional extra div if you have place_script field -->
                        ${post.custom_fields?.place_script ? `<div>${post.custom_fields.place_script}</div>` : ''}
                    ` : ''}
                </div>
            </div>
          `;
        }).join('')}
    </body>
    </html>
  `);
  printDocument.close();

  setTimeout(() => {
    printIframe.contentWindow.focus();
    printIframe.contentWindow.print();
    document.body.removeChild(printIframe);
  }, 500);
};