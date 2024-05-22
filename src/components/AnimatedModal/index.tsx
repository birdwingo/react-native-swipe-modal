import {
  BackHandler,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import AnimatedModalStyles from './AnimatedModal.styles';
import { AnimatedModalProps, AnimatedModalPublicMethods } from '../../core/dto/animatedModalDTO';
import { ANIMATION_DURATION, MAX_VISIBILITY } from '../../core/constants/data';

const AnimatedPressable = Animated.createAnimatedComponent( Pressable );
const HEIGHT = Dimensions.get( 'window' ).height;

// eslint-disable-next-line max-len
const AnimatedModal = forwardRef<AnimatedModalPublicMethods, AnimatedModalProps>( ( props, ref ) => {

  const {
    children,
    onShow,
    onHide,
    closeOnEmptySpace = true,
    closeOnPressBack = true,
    animationDuration = ANIMATION_DURATION,
    closeSpaceVisibility = MAX_VISIBILITY,
    hideKeyboardOnShow = true,
    useKeyboardAvoidingView = true,
  } = props;

  // default visibility should never change, hence useMemo with empty dependency array
  // eslint-disable-next-line max-len
  const defaultVisibility: boolean = useMemo( () => ( props.controlled ? props.open : ( props.visible ?? false ) ), [] );

  const [ isVisible, setIsVisible ] = useState( defaultVisibility );
  const animation = useSharedValue( defaultVisibility ? 1 : 0 );
  const opened = useSharedValue( defaultVisibility );

  // handle top-down controlled state
  useEffect( () => {

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    props.controlled && setIsVisible( props.open );

  }, [ props.controlled, props.open ] );

  // handle bottom-up controlled state
  useEffect( () => {

    if ( props.controlled && isVisible !== props.open ) {

      props.setOpen( isVisible );

    }

  }, [ isVisible ] );

  // eslint-disable-next-line max-len
  const animatedPressableStyle = useAnimatedStyle( () => ( { opacity: interpolate( animation.value, [ 0, 1 ], [ 0, closeSpaceVisibility ] ) } ), [] );
  // eslint-disable-next-line max-len
  const animatedStyle = useAnimatedStyle( () => ( { top: interpolate( animation.value, [ 0, 1 ], [ HEIGHT, 0 ] ) } ), [] );

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

  useImperativeHandle( ref, () => ( {
    show,
    hide,
  } ), [] );

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

  const content = (
    <>
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
        { children }
      </Animated.View>
    </>
  );

  return (
    <Animated.View
      style={AnimatedModalStyles.container}
      pointerEvents="box-none"
      testID="animatedModal"
    >
      {useKeyboardAvoidingView ? (
        <KeyboardAvoidingView
          style={AnimatedModalStyles.flex}
          behavior={Platform.OS === 'ios' ? 'height' : undefined}
          pointerEvents="box-none"
        >
          {content}
        </KeyboardAvoidingView>
      ) : content}
    </Animated.View>
  );

} );

export default memo( AnimatedModal );
