import React, {
  forwardRef, useRef, memo, useImperativeHandle, useCallback, useMemo,
} from 'react';
import {
  View, Dimensions, LayoutChangeEvent, Platform, StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, useAnimatedReaction, runOnJS, withTiming,
} from 'react-native-reanimated';
import { GestureDetector, ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AnimatedModal from '../AnimatedModal';
import ModalScrollView from './scroll';
import { SwipeModalProps, SwipeModalPublicMethods } from '../../core/dto/swipeModalDTO';
import { AnimatedModalPublicMethods } from '../../core/dto/animatedModalDTO';
import { useGesture } from '../../core/hooks';
import { MIN_HEIGHT } from '../../core/constants/data';
import SwipeModalStyles from './SwipeModal.styles';

const HEIGHT = Dimensions.get( 'window' ).height;

const getMaxHeight = ( maxHeight: SwipeModalProps['maxHeight'] = HEIGHT, top = 0 ) => {

  'worklet';

  if ( maxHeight === 'max' ) {

    return HEIGHT - top;

  }

  if ( maxHeight === 'auto' ) {

    return 0;

  }

  return Math.min( HEIGHT - top, maxHeight );

};

const SwipeModal = forwardRef<SwipeModalPublicMethods, SwipeModalProps>( ( {
  children,
  bg = 'black',
  showBar = true,
  barColor = 'grey',
  maxHeight = 'max',
  fixedHeight = false,
  defaultHeight,
  style,
  closeTrigger = 'swipeDown',
  closeTriggerValue = 10,
  scrollEnabled = false,
  scrollContainerStyle,
  scrollContainerProps,
  headerComponent,
  footerComponent,
  disableSwipe = false,
  ...props
}, ref ) => {

  const modalRef = useRef<AnimatedModalPublicMethods>( null );
  const scrollRef = useRef<ScrollView>( null );

  const { gesture, event } = useGesture( scrollRef );
  const { top, bottom } = useSafeAreaInsets();

  const marginTop = ( Platform.OS === 'ios' ? top : StatusBar.currentHeight ) || 0;

  const scrollY = useSharedValue( 0 );
  const isScrollHandled = useSharedValue( false );
  const maxHeightValue = useSharedValue( getMaxHeight( maxHeight, marginTop ) );
  const height = useSharedValue( defaultHeight || maxHeightValue.value );
  const start = useSharedValue( height.value );
  const isScrollEnabled = useSharedValue( height.value === maxHeightValue.value );

  const animatedStyle = useAnimatedStyle( () => ( { height: maxHeight === 'auto' && !maxHeightValue.value ? '100%' : height.value } ), [] );

  const show = useCallback( () => {

    const newHeight = getMaxHeight( maxHeight, marginTop );
    height.value = newHeight;
    start.value = newHeight;
    maxHeightValue.value = newHeight;
    isScrollEnabled.value = true;
    modalRef.current?.show();

  }, [ modalRef ] );

  const hide = () => {

    'worklet';

    runOnJS( modalRef.current?.hide! )();

  };

  const onGestureEnd = () => {

    'worklet';

    if ( ( closeTrigger === 'swipeDown' && height.value < start.value - closeTriggerValue )
      || ( closeTrigger === 'minHeight' && height.value < closeTriggerValue )
      || height.value < MIN_HEIGHT ) {

      hide();

    } else {

      if ( fixedHeight ) {

        height.value = withTiming( start.value );

      } else {

        start.value = height.value;

      }

      if ( start.value === maxHeightValue.value ) {

        isScrollEnabled.value = true;

      }

    }

  };

  const onGestureEvent = () => {

    'worklet';

    if ( !event.value ) {

      onGestureEnd();

    } else {

      const { translationY } = event.value;

      const newHeight = start.value - translationY;

      if ( newHeight <= maxHeightValue.value ) {

        height.value = newHeight;

      } else {

        height.value = maxHeightValue.value;

      }

    }

  };

  const onEvent = () => {

    'worklet';

    if ( !scrollEnabled || ( !isScrollHandled.value && !isScrollEnabled.value ) ) {

      onGestureEvent();

    } else if ( event.value?.velocityY! > 0 && scrollY.value === 0 && isScrollHandled.value ) {

      isScrollHandled.value = false;
      isScrollEnabled.value = false;
      onGestureEvent();

    } else if ( !isScrollHandled.value && isScrollEnabled.value ) {

      isScrollEnabled.value = false;

    }

  };

  const onLayout = useCallback( ( e: LayoutChangeEvent ) => {

    if ( maxHeight === 'auto' && !maxHeightValue.value && !disableSwipe ) {

      const newHeight = getMaxHeight( e.nativeEvent.layout.height, marginTop );
      maxHeightValue.value = newHeight;
      height.value = newHeight;
      start.value = newHeight;

    }

  }, [] );

  useImperativeHandle( ref, () => ( { show, hide } ), [] );
  useAnimatedReaction( () => event.value, onEvent, [ event.value ] );

  const modalChildren = useMemo( () => (
    <View onLayout={onLayout}>
      {showBar && (
        <View style={SwipeModalStyles.barContainer}>
          <View style={[ SwipeModalStyles.bar, { backgroundColor: barColor } ]} />
        </View>
      )}
      {headerComponent}
      {scrollEnabled ? (
        <ModalScrollView
          scrollRef={scrollRef}
          style={scrollContainerStyle}
          props={scrollContainerProps}
          scrollEnabled={isScrollEnabled}
          scrollY={scrollY}
          isScrollHandled={isScrollHandled}
        >
          {children}
        </ModalScrollView>
      ) : children}
      {footerComponent}
    </View>
  ), [] );

  return (
    <AnimatedModal ref={modalRef} {...props}>
      <Animated.View
        style={[ animatedStyle, { paddingBottom: bottom, backgroundColor: bg }, style ]}
      >
        {disableSwipe
          ? modalChildren
          : <GestureDetector gesture={gesture}>{modalChildren}</GestureDetector>}
      </Animated.View>
    </AnimatedModal>
  );

} );

export default memo( SwipeModal );
