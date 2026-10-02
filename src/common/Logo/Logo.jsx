import React from "react";
import { View, StyleSheet } from "react-native";
import useTheme from "../../hooks/useTheme";
import CustomText from "../Text/CustomText";
import Ionicons from "react-native-vector-icons/Ionicons";

const Logo = ({ size = 48, showText = true, style }) => {
  const colors = useTheme();

  const iconSize = size * 0.55;

  return (
    <View className="items-center justify-center flex-row" style={style}>
      <View
        style={[
          styles.iconContainer,
          {
            width: size,
            height: size,
            borderRadius: size * 0.25,
            backgroundColor: colors.primary,
          },
        ]}
      >
        <Ionicons name="trending-up" size={iconSize} color={colors.white} />
      </View>

      {showText && (
        <View className="ml-3 flex-row items-center">
          <CustomText
            variant="heading"
            fontWeight="800"
            color={colors.text}
          >
            ed
          </CustomText>
          <CustomText
            variant="heading"
            fontWeight="800"
            color={colors.primary}
          >
            stock
          </CustomText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Logo;
