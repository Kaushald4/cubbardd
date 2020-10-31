import { Dimensions, PixelRatio } from "react-native";

let { height, width } = Dimensions.get("window");

//detect
let deviceHeight = Dimensions.get("screen").height;
let windowHeight = Dimensions.get("window").height;
let bottomNavBarHeight = deviceHeight - windowHeight;

const widthToDp = (number: number | string) => {
  let givenWidth = typeof number === "number" ? number : parseFloat(number);
  return PixelRatio.roundToNearestPixel((width * givenWidth) / 100);
};

const heightToDp = (number: number | string) => {
  let givenHeight = typeof number === "number" ? number : parseFloat(number);
  return PixelRatio.roundToNearestPixel((height * givenHeight) / 100);
};

export { widthToDp, heightToDp, bottomNavBarHeight };
