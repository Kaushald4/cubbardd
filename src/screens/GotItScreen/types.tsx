import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigators/AppStackNavigator';

type GotItScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'GotItScreen'
>;

export type Props = {
  navigation: GotItScreenNavigationProp;
};
