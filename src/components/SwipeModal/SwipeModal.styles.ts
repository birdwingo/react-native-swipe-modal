import { StyleSheet } from 'react-native';

export default StyleSheet.create( {
  container: {
    overflow: 'hidden',
    width: '100%',
    flex: 1,
  },
  containerAuto: {
    overflow: 'hidden',
    width: '100%',
  },
  barContainer: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    width: 34,
    height: 5,
    borderRadius: 10,
  },
  flex: {
    flex: 1,
  },
  rootView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
} );
