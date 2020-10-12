import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { AppStackParamList } from "../../navigators/AppStackNavigator";

type AddItemScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  "AddItemsScreen"
>;

type AddItemScreenRouteProp = RouteProp<AppStackParamList, "AddItemsScreen">;

export type Props = {
  navigation: AddItemScreenNavigationProp;
  route: AddItemScreenRouteProp;
};
