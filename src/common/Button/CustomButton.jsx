import React from "react";
import { TouchableOpacity, ActivityIndicator, View } from "react-native";
import useTheme from "../../hooks/useTheme";
import CustomText from "../Text/CustomText";
import { RADIUS } from "../../constants/radius";
import { SIZES } from "../../constants/sizes";

const CustomButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
  variant = "primary",
  style,
  textStyle,
  ...props
}) => {
  const colors = useTheme();

  // Get background and border styling based on variant
  const getVariantStyles = () => {
    const styles = {
      button: {},
      text: {},
      loader: colors.white,
    };

    switch (variant) {
      case "primary":
        styles.button = {
          backgroundColor: colors.primary,
        };
        styles.text = {
          color: colors.white,
        };
        styles.loader = colors.white;
        break;

      case "secondary":
        styles.button = {
          backgroundColor: colors.secondary,
        };
        styles.text = {
          color: colors.white,
        };
        styles.loader = colors.white;
        break;

      case "outline":
        styles.button = {
          backgroundColor: "transparent",
          borderWidth: 1.5,
          borderColor: colors.primary,
        };
        styles.text = {
          color: colors.primary,
        };
        styles.loader = colors.primary;
        break;

      case "danger":
        styles.button = {
          backgroundColor: colors.error,
        };
        styles.text = {
          color: colors.white,
        };
        styles.loader = colors.white;
        break;

      case "ghost":
        styles.button = {
          backgroundColor: "transparent",
        };
        styles.text = {
          color: colors.primary,
        };
        styles.loader = colors.primary;
        break;

      default:
        break;
    }

    if (disabled) {
      styles.button.backgroundColor = colors.border;
      styles.button.borderColor = "transparent";
      styles.text.color = colors.textMuted;
      styles.loader = colors.textMuted;
    }

    return styles;
  };

  const variantStyles = getVariantStyles();

  const buttonStyle = [
    {
      height: SIZES.button.md,
      borderRadius: RADIUS.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16,
      alignSelf: fullWidth ? "stretch" : "center",
    },
    variantStyles.button,
    style,
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={buttonStyle}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantStyles.loader} />
      ) : (
        <View className="flex-row items-center justify-center">
          {leftIcon && <View className="mr-2">{leftIcon}</View>}
          <CustomText
            variant="body"
            fontWeight="600"
            style={[variantStyles.text, textStyle]}
          >
            {title}
          </CustomText>
          {rightIcon && <View className="ml-2">{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
