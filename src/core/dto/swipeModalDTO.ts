import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SharedValue } from 'react-native-reanimated';
import { AnimatedModalProps } from './animatedModalDTO';

export interface SwipeModalProps extends AnimatedModalProps {
  children: ReactNode | ReactNode[];
  bg?: string;
  showBar?: boolean;
  barColor?: string;
  maxHeight?: 'max' | 'auto' | number;
  defaultHeight?: number;
  fixedHeight?: boolean;
  style?: ViewStyle;
  closeTrigger?: 'swipeDown' | 'minHeight';
  closeTriggerValue?: number;
  scrollEnabled?: boolean;
  scrollContainerStyle?: ViewStyle;
  scrollContainerProps?: ScrollView['props'];
  headerComponent?: ReactNode;
  footerComponent?: ReactNode;
}

export type SwipeModalPublicMethods = {
  show: () => void;
  hide: () => void;
};

export interface ModalScrollContainerProps {
  children: ReactNode;
  scrollRef: React.RefObject<ScrollView>;
  style?: ViewStyle;
  props?: SwipeModalProps['scrollContainerProps'];
  scrollY: SharedValue<number>;
  isScrollHandled: SharedValue<boolean>;
  scrollEnabled: SharedValue<boolean>
}