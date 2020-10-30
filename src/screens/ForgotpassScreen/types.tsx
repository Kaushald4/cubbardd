import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../../navigators/AuthStackNavigator";

type ForgotpassScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "ForgotpassScreen"
>;

export type Props = {
  navigation: ForgotpassScreenNavigationProp;
};
