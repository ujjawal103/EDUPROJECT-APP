import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import useTheme from "../../hooks/useTheme";
import CustomText from "../Text/CustomText";

const Loader = ({
  fullscreen = false,
  text,
  size = "large",
  style,
  ...props
}) => {
  const colors = useTheme();

  if (fullscreen) {
    return (
      <View
        style={[
          StyleSheet.absoluteFillObject,
          styles.fullscreenContainer,
          { backgroundColor: colors.overlay },
          style,
        ]}
        {...props}
      >
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface },
          ]}
        >
          <ActivityIndicator size={size} color={colors.primary} />
          {text && (
            <CustomText
              variant="body"
              fontWeight="600"
              color={colors.text}
              className="mt-3"
            >
              {text}
            </CustomText>
          )}
        </View>
      </View>
    );
  }

  return (
    <View
      className="items-center justify-center p-4"
      style={style}
      {...props}
    >
      <ActivityIndicator size={size} color={colors.primary} />
      {text && (
        <CustomText variant="caption" className="mt-2">
          {text}
        </CustomText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fullscreenContainer: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  card: {
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Loader;
