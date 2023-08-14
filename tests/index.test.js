import React, { createRef } from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import { View, Platform } from 'react-native';
import * as Reanimated from 'react-native-reanimated';
import SwipeModal from '../src';
import AnimatedModal from '../src/components/AnimatedModal';
import * as hooks from '../src/core/hooks';

jest.spyOn( hooks, 'useGesture' ).mockImplementation( () => ( { gesture: { onEnd: () => {} }, event: { value: { translationY: 0, velocityY: 0 } } } ) );
jest.spyOn( Reanimated, 'useSharedValue' ).mockImplementation( ( value ) => ( { value } ) );

describe( 'SwipeModal Tests', () => {

  it( 'Should show', () => {

    const ref = createRef();

    render(
      <SwipeModal ref={ref}>
        <View />
      </SwipeModal>,
    );

    act( () => {

      ref.current.show();

    } );

  } );

  it( 'Should work with auto max height', async () => {

    const ref = createRef();

    const { getByTestId } = render(
      <SwipeModal ref={ref} maxHeight="auto">
        <View />
      </SwipeModal>,
    );

    act( () => {

      ref.current.show();

    } );

    await new Promise( ( resolve ) => setTimeout( resolve, 200 ) );

    getByTestId( 'modalContainer' ).props.onLayout( {
      nativeEvent: {
        layout: {
          x: 0, y: 0, width: 100, height: 100,
        },
      },
    } );

  } );

  it( 'Should work with max height 500', () => {

    render(
      <SwipeModal maxHeight={500} disableSwipe>
        <View />
      </SwipeModal>,
    );

  } );

  it( 'Should work with disableSwipe & maxheight = auto', async () => {

    const ref = createRef();
    const { getByTestId } = render(
      <SwipeModal maxHeight="auto" disableSwipe ref={ref}>
        <View />
      </SwipeModal>,
    );

    act( () => {

      ref.current.show();

    } );

    await new Promise( ( resolve ) => setTimeout( resolve, 200 ) );

    getByTestId( 'modalContainer' ).props.onLayout( {
      nativeEvent: {
        layout: {
          x: 0, y: 0, width: 100, height: 100,
        },
      },
    } );

  } );

  it( 'Should call onEnd', async () => {

    jest.spyOn( hooks, 'useGesture' ).mockImplementation( () => ( { gesture: { onEnd: () => {} }, event: { value: undefined } } ) );
    const ref = createRef();

    const { getByTestId } = render(
      <SwipeModal ref={ref}>
        <View />
      </SwipeModal>,
    );

    act( () => {

      ref.current.show();

    } );

    await new Promise( ( resolve ) => setTimeout( resolve, 200 ) );

    act( () => {

      fireEvent( getByTestId( 'gestureContainer' ), 'onResponderEnd' );

    } );

  } );

  it( 'Should call onEnd with fixedHeight = false', async () => {

    jest.spyOn( hooks, 'useGesture' ).mockImplementation( () => ( { gesture: { onEnd: () => {} }, event: { value: undefined } } ) );
    const ref = createRef();

    const { getByTestId } = render(
      <SwipeModal ref={ref} fixedHeight={false}>
        <View />
      </SwipeModal>,
    );

    act( () => {

      ref.current.show();

    } );

    await new Promise( ( resolve ) => setTimeout( resolve, 200 ) );

    act( () => {

      fireEvent( getByTestId( 'gestureContainer' ), 'onResponderEnd' );

    } );

  } );

  it( 'Should call onEnd with closeTriggerValue = 0', async () => {

    jest.spyOn( hooks, 'useGesture' ).mockImplementation( () => ( { gesture: { onEnd: () => {} }, event: { value: undefined } } ) );
    const ref = createRef();

    const { getByTestId } = render(
      <SwipeModal ref={ref} closeTriggerValue={0}>
        <View />
      </SwipeModal>,
    );

    act( () => {

      ref.current.show();

    } );

    await new Promise( ( resolve ) => setTimeout( resolve, 200 ) );

    act( () => {

      fireEvent( getByTestId( 'gestureContainer' ), 'onResponderEnd' );

    } );

  } );

  it( 'Should call onEnd with closeTrigger = minHeight', async () => {

    jest.spyOn( hooks, 'useGesture' ).mockImplementation( () => ( { gesture: { onEnd: () => {} }, event: { value: undefined } } ) );
    const ref = createRef();

    const { getByTestId } = render(
      <SwipeModal ref={ref} closeTrigger="minHeight" closeTriggerValue={1500}>
        <View />
      </SwipeModal>,
    );

    act( () => {

      ref.current.show();

    } );

    await new Promise( ( resolve ) => setTimeout( resolve, 200 ) );

    act( () => {

      fireEvent( getByTestId( 'gestureContainer' ), 'onResponderEnd' );

    } );

  } );

  it( 'Should call onEnd with scrollEnabled', async () => {

    jest.spyOn( hooks, 'useGesture' ).mockImplementation( () => ( { gesture: { onEnd: () => {} }, event: { value: undefined } } ) );
    const ref = createRef();

    const { getByTestId } = render(
      <SwipeModal ref={ref} scrollEnabled closeTrigger="minHeight" closeTriggerValue={0}>
        <View />
      </SwipeModal>,
    );

    act( () => {

      ref.current.show();

    } );

    await new Promise( ( resolve ) => setTimeout( resolve, 200 ) );

    act( () => {

      fireEvent( getByTestId( 'gestureContainer' ), 'onResponderEnd' );

    } );

  } );

  it( 'Should not call onGestureEvent', async () => {

    jest.spyOn( hooks, 'useGesture' ).mockImplementation( () => ( { gesture: { onEnd: () => {} }, event: { value: { velocityY: 0 } } } ) );
    const ref = createRef();

    const { getByTestId } = render(
      <SwipeModal ref={ref} scrollEnabled>
        <View />
      </SwipeModal>,
    );

    act( () => {

      ref.current.show();

    } );

    await new Promise( ( resolve ) => setTimeout( resolve, 200 ) );

    act( () => {

      fireEvent( getByTestId( 'gestureContainer' ), 'onResponderEnd' );

    } );

  } );

  it( 'Should call onGestureEvent when scrollY === 0', async () => {

    jest.spyOn( hooks, 'useGesture' ).mockImplementation( () => ( { gesture: { onEnd: () => {} }, event: { value: { velocityY: 10 } } } ) );
    jest.spyOn( Reanimated, 'useSharedValue' ).mockImplementation( ( val ) => ( { value: typeof val === 'boolean' ? true : val } ) );

    const ref = createRef();

    const { getByTestId } = render(
      <SwipeModal ref={ref} scrollEnabled>
        <View />
      </SwipeModal>,
    );

    act( () => {

      ref.current.show();

    } );

    await new Promise( ( resolve ) => setTimeout( resolve, 200 ) );

    act( () => {

      fireEvent( getByTestId( 'gestureContainer' ), 'onResponderEnd' );

    } );

  } );

  it( 'Should work with height > maxHeight', async () => {

    jest.spyOn( hooks, 'useGesture' ).mockImplementation( () => ( { gesture: { onEnd: () => {} }, event: { value: { translationY: -10, velocityY: 0 } } } ) );
    const ref = createRef();

    render(
      <SwipeModal ref={ref}>
        <View />
      </SwipeModal>,
    );

    act( () => {

      ref.current.show();

    } );

  } );

  it( 'Should work with scroll and velocityY > 0', async () => {

    jest.spyOn( hooks, 'useGesture' ).mockImplementation( () => ( { gesture: { onEnd: () => {} }, event: { value: { translationY: 0, velocityY: 10 } } } ) );
    const ref = createRef();

    const { getByTestId } = render(
      <SwipeModal ref={ref} scrollEnabled>
        <View />
      </SwipeModal>,
    );

    act( () => {

      ref.current.show();

    } );

    const scrollView = getByTestId( 'modalScrollView' );
    fireEvent.scroll( scrollView, { nativeEvent: { contentOffset: { y: 100 } } } );
    fireEvent( getByTestId( 'gestureContainer' ), 'onResponderEnd' );

  } );

  it( 'Should work with scroll', async () => {

    const ref = createRef();

    const { getByTestId } = render(
      <SwipeModal ref={ref} scrollEnabled>
        <View />
      </SwipeModal>,
    );

    act( () => {

      ref.current.show();

    } );

    await new Promise( ( resolve ) => setTimeout( resolve, 200 ) );

    const scrollView = getByTestId( 'modalScrollView' );
    fireEvent.scroll( scrollView, { nativeEvent: { contentOffset: { y: 100 } } } );
    fireEvent.scroll( scrollView, { nativeEvent: { contentOffset: { y: 0 } } } );
    fireEvent( scrollView.parent, 'onScrollBeginDrag' );
    fireEvent( scrollView.parent, 'onScrollEndDrag', { nativeEvent: { contentOffset: { y: 0 } } } );

  } );

} );

describe( 'AnimatedModal Tests', () => {

  it( 'Should show', () => {

    const ref = createRef();

    render(
      <AnimatedModal ref={ref}>
        <View />
      </AnimatedModal>,
    );

    act( () => {

      ref.current.show();

    } );

  } );

  it( 'Should hide', () => {

    const ref = createRef();

    render(
      <AnimatedModal ref={ref}>
        <View />
      </AnimatedModal>,
    );

    act( () => {

      ref.current.hide();

    } );

  } );

  it( 'Should call onHide when changing from visible to hidden', () => {

    const ref = createRef();

    render(
      <AnimatedModal ref={ref} visible>
        <View />
      </AnimatedModal>,
    );

    act( () => {

      ref.current.hide();

    } );

  } );

  it( 'Should work on android & should call onShow & hideKeyboardOnShow = false', async () => {

    Platform.OS = 'android';
    const ref = createRef();

    render(
      <AnimatedModal ref={ref} onShow={() => {}} hideKeyboardOnShow={false}>
        <View />
      </AnimatedModal>,
    );

    act( () => {

      ref.current.show();

    } );

    await new Promise( ( resolve ) => setTimeout( resolve, 200 ) );

  } );

  it( 'Should work with closeOnPressBack = false', async () => {

    const ref = createRef();

    render(
      <AnimatedModal ref={ref} visible closeOnPressBack={false}>
        <View />
      </AnimatedModal>,
    );

  } );

} );
