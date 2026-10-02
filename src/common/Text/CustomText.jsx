import React from "react";
import { Text } from "react-native";
import useTheme from "../../hooks/useTheme";
import { TYPOGRAPHY } from "../../constants/typography";

const CustomText = ({
  children,
  variant = "body",
  color,
  fontWeight,
  numberOfLines,
  centered = false,
  style,
  ...props
}) => {
  const colors = useTheme();

  // Determine standard color based on variant
  const getDefaultColor = () => {
    switch (variant) {
      case "error":
        return colors.error;
      case "caption":
        return colors.textMuted;
      case "subheading":
        return colors.textSecondary;
      default:
        return colors.text;
    }
  };

  const textStyle = {
    ...TYPOGRAPHY[variant],
    color: color || getDefaultColor(),
    textAlign: centered ? "center" : "left",
  };

  if (fontWeight) {
    textStyle.fontWeight = fontWeight;
  }

  return (
    <Text
      style={[textStyle, style]}
      numberOfLines={numberOfLines}
      {...props}
    >
      {children}
    </Text>
  );
};

export default CustomText;
