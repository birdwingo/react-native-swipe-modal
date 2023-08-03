import { Gesture, GestureUpdateEvent, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { useMemo } from 'react';

type Event = GestureUpdateEvent<PanGestureHandlerEventPayload> | undefined;

const useGesture = ( ref: any ) => {

  const event = useSharedValue<Event>( undefined );

  // eslint-disable-next-line new-cap
  const gesture = useMemo( () => Gesture.Pan()
    .activeOffsetY( [ -10, 10 ] )
    .onUpdate( ( e ) => {

      event.value = e;

    } )
    .onEnd( () => {

      event.value = undefined;

    } ), [ event ] )
    .simultaneousWithExternalGesture( ref );

  return useMemo( () => ( { gesture, event } ), [ gesture, event ] );

};

export { useGesture };
