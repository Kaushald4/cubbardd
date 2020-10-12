import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../../navigators/AuthStackNavigator";

type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "LoginScreen"
>;

export type Props = {
  navigation: LoginScreenNavigationProp;
};
