export {};

declare global {
  interface Window {
    openVideoPopup: (videoUrl: string) => void;
    onCloseVideoPopup: () => void;
    onDestroyClick: () => void;
    onClickSkip: () => void;
  }
}
