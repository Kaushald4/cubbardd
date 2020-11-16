import React, { memo } from "react";
import { View, Text, Platform } from "react-native";
import { AdMobBanner, PublisherBanner } from "react-native-admob";

const googleAdds = () => {
  return (
    <AdMobBanner
      adSize={Platform.OS === "android" ? "smartBannerPortrait" : "banner"}
      adUnitID={
        Platform.OS === "android"
          ? "ca-app-pub-7830260140012280/8150965953"
          : "ca-app-pub-7830260140012280/7883372644"
      }
      onAdFailedToLoad={(error) => {
        console.log(error);
      }}
    />
  );
};

export default memo(googleAdds);
