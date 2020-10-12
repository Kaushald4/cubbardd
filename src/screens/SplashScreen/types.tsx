import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../../navigators/AuthStackNavigator";

type SplashScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "SplashScreen"
>;

export type Props = {
  navigation: SplashScreenNavigationProp;
};
