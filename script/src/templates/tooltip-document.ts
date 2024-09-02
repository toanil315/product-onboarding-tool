export const tooltipDocumentTemplate = (
  detailLink: string,
  videoUrl: string
) => {
  return `<div class="tooltip-more-info">
  ${
    videoUrl
      ? `<div class='tooltip-more-info-video' onClick="window.openVideoPopup('${videoUrl}')">
  <div class='play-icon'>
  <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.96276 6.1004C9.75283 5.64424 9.75283 4.5039 8.96276 4.04774L2.29609 0.198637C1.50601 -0.257526 0.518311 0.312642 0.518311 1.22511V8.92303C0.518311 9.8355 1.50601 10.4057 2.29609 9.9495L8.96276 6.1004Z" fill="#E20714"/>
  </svg>
  </div>
  </div>`
      : ""
  }
  ${
    detailLink
      ? `<a href="${detailLink}" target="_blank" class="tooltip-more-info-link">See details documents</a>`
      : ""
  }
  </div>`;
};
