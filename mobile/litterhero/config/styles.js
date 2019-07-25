import {StyleSheet} from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  uiContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    zIndex: 0,
  },
  mcManager: {
    flex: 0.15,
    width: '100%',
  },
  bottomControls: {
    flex: 0.23,
    paddingBottom: '8%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  iconButton: {
    height: 50,
    width: 50,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    width: '100%',
    height: '100%',
  },
  camera: {
    flex: 1,
  },
  cameraScreenStyle: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    alignSelf: 'flex-end',
    alignItems: 'center',
    alignContent: 'center',
    width: '100%',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    backgroundColor: colors.WHITE,
  },
  formFields: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '80%',
    backgroundColor: colors.SEE_THROUGH,
    paddingTop: 20,
  },
  subtitleText: {
    paddingLeft: 0,
    color: colors.REAL_GREY,
  },
  largeImage: {
    flex: 1,
    width: 1000,
    height: 1000,
    position: 'absolute',
  },
  alertText: {
    paddingLeft: 0,
    color: colors.TORCH_RED,
  },
  buttonStyleContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.BLUE,
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  buttonStyleText: {
    color: colors.WHITE,
    textAlign: 'left',
    height: 20,
  },
});

export default styles;
