import {
  Dimensions, Pressable, BackHandler, KeyboardAvoidingView, Platform, Keyboard,
} from 'react-native';
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
  visible = false,
  onShow,
  onHide,
  closeOnEmptySpace = true,
  closeOnPressBack = true,
  animationDuration = ANIMATION_DURATION,
  closeSpaceVisibility = MAX_VISIBILITY,
  hideKeyboardOnShow = true,
}, ref ) => {

  const [ isVisible, setIsVisible ] = useState( visible );

  const animation = useSharedValue( visible ? 1 : 0 );
  const opened = useSharedValue( visible );

  const animatedPressableStyle = useAnimatedStyle( () => (
    { opacity: interpolate( animation.value, [ 0, 1 ], [ 0, closeSpaceVisibility ] ) }
  ), [] );
  const animatedStyle = useAnimatedStyle( () => (
    { top: interpolate( animation.value, [ 0, 1 ], [ HEIGHT, 0 ] ) }
  ), [] );

  const show = useCallback( () => {

    if ( hideKeyboardOnShow ) {

      Keyboard.dismiss();

    }

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

      opened.value = true;
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

    } else if ( opened.value ) {

      onHide?.();
      opened.value = false;

    }

    return () => {};

  }, [ isVisible ] );

  if ( !isVisible ) {

    return null;

  }

  return (
    <Animated.View style={AnimatedModalStyles.container} pointerEvents="box-none" testID="animatedModal">
      <KeyboardAvoidingView style={AnimatedModalStyles.flex} behavior={Platform.OS === 'ios' ? 'height' : undefined} pointerEvents="box-none">
        {closeOnEmptySpace && (
          <AnimatedPressable
            onPress={hide}
            style={[ AnimatedModalStyles.pressable, animatedPressableStyle ]}
          />
        )}
        <Animated.View style={[ animatedStyle, AnimatedModalStyles.modal ]} pointerEvents="box-none">{children}</Animated.View>
      </KeyboardAvoidingView>
    </Animated.View>
  );

} );

export default memo( AnimatedModal );
