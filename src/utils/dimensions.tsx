import { Dimensions, PixelRatio } from "react-native";

let { height, width } = Dimensions.get("window");

const widthToDp = (number: number | string) => {
  let givenWidth = typeof number === "number" ? number : parseFloat(number);
  return PixelRatio.roundToNearestPixel((width * givenWidth) / 100);
};

const heightToDp = (number: number | string) => {
  let givenHeight = typeof number === "number" ? number : parseFloat(number);
  return PixelRatio.roundToNearestPixel((height * givenHeight) / 100);
};

export { widthToDp, heightToDp };
