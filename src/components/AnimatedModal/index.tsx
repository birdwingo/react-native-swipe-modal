import { Dimensions, Pressable, BackHandler } from 'react-native';
import React, {
  forwardRef, memo, useState, useImperativeHandle, useCallback, useEffect,
} from 'react';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, runOnJS, interpolate,
} from 'react-native-reanimated';
import AnimatedModalStyles from './AnimatedModal.styles';
import { AnimatedModalProps, AnimatedModalPublicMethods } from '../../core/dto/animatedModalDTO';
import { ANIMATION_DURATION, MAX_VISIBILITY } from '../../core/constants/data';

const AnimatedPressable = Animated.createAnimatedComponent( Pressable );
const HEIGHT = Dimensions.get( 'window' ).height;

const AnimatedModal = forwardRef<AnimatedModalPublicMethods, AnimatedModalProps>( ( {
  children,
  visible,
  onShow,
  onHide,
  closeOnEmptySpace = true,
  closeOnPressBack = true,
  animationDuration = ANIMATION_DURATION,
  closeSpaceVisibility = MAX_VISIBILITY,
}, ref ) => {

  const [ isVisible, setIsVisible ] = useState( visible );

  const animation = useSharedValue( visible ? 1 : 0 );

  const animatedPressableStyle = useAnimatedStyle( () => (
    { opacity: interpolate( animation.value, [ 0, 1 ], [ 0, closeSpaceVisibility ] ) }
  ), [] );
  const animatedStyle = useAnimatedStyle( () => (
    { top: interpolate( animation.value, [ 0, 1 ], [ HEIGHT, 0 ] ) }
  ), [] );

  const show = useCallback( () => {

    setIsVisible( true );

  }, [] );

  const hide = useCallback( () => {

    animation.value = withTiming(
      0,
      { duration: animationDuration },
      () => runOnJS( setIsVisible )( false ),
    );

  }, [] );

  useImperativeHandle( ref, () => ( { show, hide } ), [] );

  useEffect( () => {

    if ( isVisible ) {

      animation.value = withTiming(
        1,
        { duration: animationDuration },
        () => onShow && runOnJS( onShow )(),
      );

      if ( closeOnPressBack ) {

        const backHandler = BackHandler.addEventListener( 'hardwareBackPress', () => {

          hide();

          return true;

        } );

        return backHandler.remove;

      }

    } else {

      onHide?.();

    }

    return () => {};

  }, [ isVisible, closeOnPressBack ] );

  if ( !isVisible ) {

    return null;

  }

  return (
    <Animated.View style={[ AnimatedModalStyles.container ]} pointerEvents="box-none">
      {closeOnEmptySpace && (
        <AnimatedPressable
          onPress={hide}
          style={[ AnimatedModalStyles.pressable, animatedPressableStyle ]}
        />
      )}
      <Animated.View
        style={[ animatedStyle, AnimatedModalStyles.modal ]}
        pointerEvents="box-none"
      >
        {children}
      </Animated.View>
    </Animated.View>
  );

} );

export default memo( AnimatedModal );
