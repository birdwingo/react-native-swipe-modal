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

const AnimatedModal = forwardRef<AnimatedModalPublicMethods, AnimatedModalProps>( (
  props,
  ref,
) => {

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
    keyboardAvoidingViewBehavior,
  } = props;

  // default visibility should never change, hence useMemo with empty dependency array
  const defaultVisibility: boolean = useMemo( () => ( 'open' in props && typeof props.open === 'boolean' ? props.open : ( props.visible ?? false ) ), [] );
  const controlledVisibility: boolean | undefined = useMemo( () => props.open, [ props.open ] );

  const [ isVisible, setIsVisible ] = useState( defaultVisibility );
  const animation = useSharedValue( defaultVisibility ? 1 : 0 );
  const opened = useSharedValue( defaultVisibility );

  // handle top-down controlled state
  useEffect( () => {

    if ( typeof controlledVisibility === 'boolean' ) {

      setIsVisible( controlledVisibility );

    }

  }, [ controlledVisibility ] );

  // handle bottom-up controlled state
  useEffect( () => {

    if ( typeof controlledVisibility === 'boolean' && isVisible !== controlledVisibility ) {

      if ( typeof props.setOpen === 'function' ) {

        props.setOpen( isVisible );

      }

    }

  }, [ isVisible, controlledVisibility ] );

  const animatedPressableStyle = useAnimatedStyle(
    () => ( { opacity: interpolate( animation.value, [ 0, 1 ], [ 0, closeSpaceVisibility ] ) } ),
    [],
  );
  const animatedStyle = useAnimatedStyle(
    () => ( { top: interpolate( animation.value, [ 0, 1 ], [ HEIGHT, 0 ] ) } ),
    [],
  );

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
          style={{
            ...AnimatedModalStyles.flex,
            ...props.keyboardAvoidingViewProps
          }}
          behavior={keyboardAvoidingViewBehavior ?? props.keyboardAvoidingViewProps?.behavior ?? ( Platform.OS === 'ios' ? 'height' : undefined )}
          pointerEvents={props.keyboardAvoidingViewProps?.pointerEvents ?? "box-none"}
        >
          {content}
        </KeyboardAvoidingView>
      ) : content}
    </Animated.View>
  );

} );

export default memo( AnimatedModal );
