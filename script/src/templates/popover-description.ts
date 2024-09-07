import { DescriptionItem } from "@/entities/Step";

export const popoverDescriptionTemplate = (descriptions: DescriptionItem[]) => {
  let result = ``;
  descriptions.forEach((item) => {
    switch (item.type) {
      case "text":
        result += `<div class="driver-popover-description-item description-text">${item.value}</div>`;
        break;
      case "image":
        result += item.value
          ? `<div class="driver-popover-description-item description-image">
        <img src="${item.value}" alt="${item.alt}" />
        </div>`
          : "";
        break;
      case "link":
        result += item.value
          ? `<a href="${item.value}" target="_blank" class="driver-popover-description-item description-link">${item.linkText}</a>`
          : "";
        break;
      case "media":
        result += item.value
          ? `<div class="driver-popover-description-item description-media" onClick="window.openVideoPopup('${item.value}')">
        <div class="description-media-trigger">
        <div class="play-icon">
        <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.96276 6.1004C9.75283 5.64424 9.75283 4.5039 8.96276 4.04774L2.29609 0.198637C1.50601 -0.257526 0.518311 0.312642 0.518311 1.22511V8.92303C0.518311 9.8355 1.50601 10.4057 2.29609 9.9495L8.96276 6.1004Z" fill="#E20714"/>
        </svg>
        </div>
        </div>
        ${item.mediaText}
        </div>`
          : "";
        break;
      default:
        break;
    }
  });
  return result;
};
