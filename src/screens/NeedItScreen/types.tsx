import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../../navigators/AppStackNavigator';

type NeedItScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'NeedItScreen'
>;

export type Props = {
  navigation: NeedItScreenNavigationProp;
};
