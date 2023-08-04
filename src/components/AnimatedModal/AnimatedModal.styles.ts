import { StyleSheet } from 'react-native';

export default StyleSheet.create( {
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    bottom: 0,
    zIndex: 50,
  },
  modal: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  pressable: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000000',
  },
  flex: {
    flex: 1,
    justifyContent: 'flex-end',
  },
} );
