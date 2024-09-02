import { PopoverConfig } from "@/entities/Step";

export const modalTemplate = (
  popoverConfig: PopoverConfig,
  options: { allowClose?: boolean } = {}
) => {
  const { title, description, videoUrl } = popoverConfig;
  const { allowClose } = options;

  return `
  <div class="introduction-container">
  <div class="introduction-content">
  ${
    allowClose
      ? `
  <button class="introduction-skip-button" onClick="window.onCloseVideoPopup()">
  <svg
  width='20'
  height='20'
  viewBox='0 0 12 12'
  fill='none'
  xmlns='http://www.w3.org/2000/svg'
  >
  <path
  d='M6 4.82178L10.125 0.696777L11.3033 1.87511L7.17834 6.00011L11.3033 10.1251L10.125 11.3034L6 7.17844L1.875 11.3034L0.696671 10.1251L4.82167 6.00011L0.696671 1.87511L1.875 0.696777L6 4.82178Z'
  fill='#232525'
  />
  </svg>
  </button>
  `
      : `
  <button class="introduction-skip-button" onClick = "window.onClickSkip()" >
  Skip
  <div class="introduction-arrow-icon" >
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M14.4291 18.8191C14.2391 18.8191 14.0491 18.7491 13.8991 18.5991C13.6091 18.3091 13.6091 17.8291 13.8991 17.5391L19.4391 11.9991L13.8991 6.45914C13.6091 6.16914 13.6091 5.68914 13.8991 5.39914C14.1891 5.10914 14.6691 5.10914 14.9591 5.39914L21.0291 11.4691C21.3191 11.7591 21.3191 12.2391 21.0291 12.5291L14.9591 18.5991C14.8091 18.7491 14.6191 18.8191 14.4291 18.8191Z" fill="#1E2328" />
  <path d="M20.33 12.75H3.5C3.09 12.75 2.75 12.41 2.75 12C2.75 11.59 3.09 11.25 3.5 11.25H20.33C20.74 11.25 21.08 11.59 21.08 12C21.08 12.41 20.74 12.75 20.33 12.75Z" fill="#1E2328" />
  </svg>
  </div>
  </button > `
  }
  <div class="introduction-acciona-logo">Logo</div>
  <div class="introduction-line"></div>
  ${
    title
      ? `
  <div class="introduction-title">${title}</div>
  `
      : ""
  }
  ${
    description
      ? `
  <div class="introduction-subtitle">${description}</div>
  `
      : ""
  }
  <div class="introduction-video-container">
  <iframe src="${videoUrl}" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen />
  </div>
  </div>
  </div>`;
};
