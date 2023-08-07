import React, {
  forwardRef, useRef, memo, useImperativeHandle, useCallback, useEffect,
} from 'react';
import { View, Dimensions, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, useAnimatedReaction, runOnJS, withTiming,
} from 'react-native-reanimated';
import { GestureDetector, ScrollView } from 'react-native-gesture-handler';
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
  topOffset = 0,
  ...props
}, ref ) => {

  const modalRef = useRef<AnimatedModalPublicMethods>( null );
  const scrollRef = useRef<ScrollView>( null );

  const { gesture, event } = useGesture( scrollRef );

  const scrollY = useSharedValue( 0 );
  const isScrollHandled = useSharedValue( false );
  const maxHeightValue = useSharedValue( getMaxHeight( maxHeight, topOffset ) );
  const height = useSharedValue( defaultHeight || maxHeightValue.value );
  const start = useSharedValue( height.value );
  const isScrollEnabled = useSharedValue( height.value === maxHeightValue.value );
  const canResize = useSharedValue( true );

  const animatedStyle = useAnimatedStyle( () => ( ( maxHeight === 'auto' && !maxHeightValue.value ) || !height.value ? {} : { height: height.value } ), [ height.value ] );

  const onHeightChange = useCallback( ( value = maxHeight ) => {

    const newHeight = getMaxHeight( value, topOffset );
    height.value = defaultHeight || newHeight;
    start.value = defaultHeight || newHeight;
    maxHeightValue.value = newHeight;
    isScrollEnabled.value = true;

  }, [ maxHeight ] );

  const show = useCallback( () => {

    canResize.value = true;
    onHeightChange();
    modalRef.current?.show();

  }, [ maxHeight ] );

  const hide = useCallback( () => modalRef.current?.hide(), [] );

  const onGestureEnd = () => {

    'worklet';

    if ( ( closeTrigger === 'swipeDown' && height.value < start.value - closeTriggerValue )
      || ( closeTrigger === 'minHeight' && height.value < closeTriggerValue )
      || height.value < MIN_HEIGHT ) {

      runOnJS( hide )();

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

    canResize.value = true;

  };

  const onGestureEvent = () => {

    'worklet';

    if ( !event.value ) {

      onGestureEnd();

    } else {

      canResize.value = false;

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

    if ( ( !scrollEnabled || !isScrollEnabled.value || !isScrollHandled.value )
      && scrollY.value <= 0 ) {

      onGestureEvent();

    } else if ( event.value?.velocityY! > 0 && scrollY.value <= 0 ) {

      isScrollHandled.value = false;
      isScrollEnabled.value = false;
      onGestureEvent();

    }

  };

  const onLayout = useCallback( ( e: LayoutChangeEvent ) => {

    if ( maxHeight === 'auto' && canResize.value && !disableSwipe ) {

      onHeightChange( e.nativeEvent.layout.height );

    }

  }, [ maxHeight ] );

  useImperativeHandle( ref, () => ( { show, hide } ), [ maxHeight ] );
  useAnimatedReaction( () => event.value, () => !disableSwipe && onEvent(), [ event.value ] );
  useEffect( () => onHeightChange(), [ maxHeight ] );

  const modalChildren = (
    <View onLayout={onLayout} style={maxHeight !== 'auto' && SwipeModalStyles.flex}>
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
  );

  if ( disableSwipe ) {

    return (
      <AnimatedModal ref={modalRef} {...props}>
        <View style={[ style, { backgroundColor: bg } ]}>
          {modalChildren}
        </View>
      </AnimatedModal>
    );

  }

  return (
    <AnimatedModal ref={modalRef} {...props}>
      <Animated.View style={[ style, !disableSwipe && animatedStyle, { backgroundColor: bg } ]}>
        <GestureDetector gesture={gesture}>{modalChildren}</GestureDetector>
      </Animated.View>
    </AnimatedModal>
  );

} );

export default memo( SwipeModal );
