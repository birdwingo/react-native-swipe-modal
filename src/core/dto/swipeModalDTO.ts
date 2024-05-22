import { ReactNode, RefObject } from 'react';
import { ViewProps, ViewStyle } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SharedValue } from 'react-native-reanimated';
import { AnimatedModalProps } from './animatedModalDTO';

export type SwipeModalProps = AnimatedModalProps & {
  bg?: string;
  showBar?: boolean;
  barColor?: string;
  barContainerStyle?: ViewStyle | ViewStyle[];
  maxHeight?: 'max' | 'auto' | number;
  defaultHeight?: number;
  fixedHeight?: boolean;
  style?: ViewStyle | ViewStyle[];
  closeTrigger?: 'swipeDown' | 'minHeight';
  closeTriggerValue?: number;
  scrollEnabled?: boolean;
  scrollContainerStyle?: ViewStyle | ViewStyle[];
  scrollContainerProps?: ScrollView['props'];
  headerComponent?: ReactNode;
  footerComponent?: ReactNode;
  disableSwipe?: boolean;
  topOffset?: number;
  containerProps?: ViewProps;
  wrapInGestureHandlerRootView?: boolean;
};

export type SwipeModalPublicMethods = {
  show: () => void;
  hide: () => void;
};

export interface ModalScrollContainerProps {
  children: ReactNode;
  scrollRef: RefObject<ScrollView>;
  style?: SwipeModalProps['scrollContainerStyle'];
  props?: SwipeModalProps['scrollContainerProps'];
  scrollY: SharedValue<number>;
  isScrollHandled: SharedValue<boolean>;
  scrollEnabled: SharedValue<boolean>
}
