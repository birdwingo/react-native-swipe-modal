import { ReactNode } from 'react';

export interface AnimatedModalProps {
  children: ReactNode | ReactNode[];
  onShow?: () => void;
  onHide?: () => void;
  closeOnEmptySpace?: boolean;
  closeOnPressBack?: boolean;
  animationDuration?: number;
  closeSpaceVisibility?: number;
}

export type AnimatedModalPublicMethods = {
  show: () => void;
  hide: () => void;
};