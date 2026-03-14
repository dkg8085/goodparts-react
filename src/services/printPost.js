export const printPosts = (printRef) => {
  if (printRef.current) {
    const filterSection = document.querySelector(".tx-filter-wrap")?.outerHTML || "";
    const printContent = printRef.current.cloneNode(true);
    const originalBody = document.body.innerHTML;

    document.body.innerHTML = `
      <html>
        <head>
          <title>Print</title>
          <style>
            @page {
              margin: 0;
              size: A4;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
            }
            .print-container {
              margin: 0;
              padding: 0;
              width: 100%;
              display: flex;
              flex-direction: column;
            }
            .tx-filter-wrap, 
            .tx-page-items {
              width: 100%;
              page-break-before: avoid;
              page-break-inside: avoid;
              page-break-after: auto;
            }
            .row {
              display: flex;
              flex-direction: column;
              width: 100%;
            }
            .post-title h2 {
              font-size: 20px;
              margin-bottom: 5px;
            }
            .post_cate_name {
              font-weight: bold;
              margin-bottom: 10px;
            }
            .post-content {
              width: 100%;
              display: block;
            }
            .print-btn {
              display: none;
            }
            * {
              break-inside: avoid;
              max-width: 100%;
            }
            audio, video {
              display: block;
              width: 100%;
              max-width: 100%;
              margin-bottom: 10px;
            }
            h2, h3, h4, p {
              margin: 0;
              padding: 5px 0;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${filterSection}
            ${printContent.innerHTML}
          </div>
        </body>
      </html>
    `;

    window.print();
    document.body.innerHTML = originalBody;
    window.location.reload();
  }
};
