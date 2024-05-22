import { ReactNode } from 'react';

export type AnimatedModalBaseProps = {
  controlled?: boolean;
  open?: boolean;
  setOpen?: ( value: boolean ) => void;
  visible?: boolean;
  children: ReactNode | ReactNode[];
  onShow?: () => void;
  onHide?: () => void;
  closeOnEmptySpace?: boolean;
  closeOnPressBack?: boolean;
  animationDuration?: number;
  closeSpaceVisibility?: number;
  hideKeyboardOnShow?: boolean;
  useKeyboardAvoidingView?: boolean;
};

export type ControlledAnimatedModalProps = AnimatedModalBaseProps & {
  visible?: never;
  controlled: true;
  open: boolean;
  setOpen: ( value: boolean ) => void;
};

export type ForwardRefAnimatedModalProps = AnimatedModalBaseProps & {
  visible?: boolean;
  controlled?: never;
  open?: never;
  setOpen?: never;
};

export type AnimatedModalProps = ControlledAnimatedModalProps | ForwardRefAnimatedModalProps;

export type AnimatedModalPublicMethods = {
  show: () => void;
  hide: () => void;
};
