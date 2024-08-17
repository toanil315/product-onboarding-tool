export interface Step {
  id: string;
  name: string;
  element: string;
  popover: PopoverConfig;
}

type PopoverType = 'tooltip' | 'modal' | 'driven action';
export interface StyleConfig {
  titleColor?: string;
  descriptionColor?: string;
  fontSize?: number;
  tooltipBgColor?: string;
  overlayColor?: string;
}

export interface PopoverConfig extends Omit<StyleConfig, 'overlayColor'> {
  // Please refer to https://driverjs.com/docs/configuration for futher information
  title?: string;
  description?: string;
  detailLink?: string;
  videoUrl?: string;
  type: PopoverType;
  action?: 'click' | 'input';
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  showButtons?: ('next' | 'previous' | 'close')[];
  disableButtons?: ('next' | 'previous' | 'close')[];
  nextBtnText?: string;
  prevBtnText?: string;
  doneBtnText?: string;
  showProgress?: boolean;
  progressText?: string;
  popoverClass?: string;
}
