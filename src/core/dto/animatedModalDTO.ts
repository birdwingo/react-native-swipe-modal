import { ReactNode } from 'react';

export interface AnimatedModalProps {
  children: ReactNode | ReactNode[];
  visible?: boolean;
  onShow?: () => void;
  onHide?: () => void;
  closeOnEmptySpace?: boolean;
  closeOnPressBack?: boolean;
  animationDuration?: number;
  closeSpaceVisibility?: number;
  hideKeyboardOnShow?: boolean;
  useKeyboardAvoidingView?: boolean;
}

export type AnimatedModalPublicMethods = {
  show: () => void;
  hide: () => void;
};
