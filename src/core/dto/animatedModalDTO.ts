import { ReactNode } from 'react';
import { KeyboardAvoidingViewProps } from 'react-native';


export type AnimatedModalBaseProps = {
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
  keyboardAvoidingViewBehavior?: KeyboardAvoidingViewProps['behavior'];
  keyboardAvoidingViewProps?: KeyboardAvoidingViewProps;
};

export type ControlledAnimatedModalProps = AnimatedModalBaseProps & {
  visible?: never;
  open: boolean;
  setOpen: ( value: boolean ) => void;
};

export type ForwardRefAnimatedModalProps = AnimatedModalBaseProps & {
  visible?: boolean;
  open?: never;
  setOpen?: never;
};

export type AnimatedModalProps = ControlledAnimatedModalProps | ForwardRefAnimatedModalProps;

export type AnimatedModalPublicMethods = {
  show: () => void;
  hide: () => void;
};
