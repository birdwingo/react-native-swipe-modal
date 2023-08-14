import React, { FC, memo } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import { ModalScrollContainerProps } from '../../core/dto/swipeModalDTO';

const AnimatedScrollView = Animated.createAnimatedComponent( ScrollView );

const ModalScrollView: FC<ModalScrollContainerProps> = ( {
  children,
  scrollY,
  scrollEnabled,
  scrollRef,
  style,
  props,
} ) => {

  const animatedProps = useAnimatedProps( () => ( { scrollEnabled: scrollEnabled.value } ), [] );

  return (
    <AnimatedScrollView
      {...props}
      testID="modalScrollView"
      ref={scrollRef}
      showsVerticalScrollIndicator={false}
      onScroll={( e ) => {

        if ( e.nativeEvent.contentOffset.y > 0 ) {

          scrollY.value = e.nativeEvent.contentOffset.y;

        }

      }}
      onScrollEndDrag={( e ) => {

        scrollY.value = e.nativeEvent.contentOffset.y;

      }}
      scrollEventThrottle={1}
      contentContainerStyle={style}
      bounces={false}
      animatedProps={animatedProps}
    >
      {children}
    </AnimatedScrollView>
  );

};

export default memo( ModalScrollView );
