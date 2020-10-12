import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../../navigators/AuthStackNavigator";

type SignupScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "SignUpScreen"
>;

export type Props = {
  navigation: SignupScreenNavigationProp;
};
