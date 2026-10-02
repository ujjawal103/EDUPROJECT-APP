import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import useTheme from "../../hooks/useTheme";
import CustomText from "../Text/CustomText";
import { RADIUS } from "../../constants/radius";
import { SIZES } from "../../constants/sizes";
import Ionicons from "react-native-vector-icons/Ionicons";

const CustomInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  error,
  leftIcon,
  rightIcon,
  multiline = false,
  editable = true,
  style,
  inputStyle,
  ...props
}) => {
  const colors = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPasswordInput = secureTextEntry;

  const handleTogglePassword = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const getBorderColor = () => {
    if (error) return colors.error;
    if (isFocused) return colors.primary;
    return colors.border;
  };

  const containerStyle = {
    borderColor: getBorderColor(),
    backgroundColor: editable ? colors.surface : colors.background,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: multiline ? undefined : SIZES.input.md,
    minHeight: multiline ? 80 : undefined,
  };

  const textInputStyle = {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    paddingVertical: multiline ? 8 : 0,
    textAlignVertical: multiline ? "top" : "center",
  };

  return (
    <View className="mb-4 w-full" style={style}>
      {label && (
        <CustomText
          variant="caption"
          fontWeight="600"
          color={error ? colors.error : colors.textSecondary}
          className="mb-1.5"
        >
          {label}
        </CustomText>
      )}

      <View style={containerStyle}>
        {leftIcon && <View className="mr-2">{leftIcon}</View>}

        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPasswordInput && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[textInputStyle, inputStyle]}
          {...props}
        />

        {/* Right Icon or Password Visibility Toggle */}
        {isPasswordInput ? (
          <TouchableOpacity onPress={handleTogglePassword} activeOpacity={0.7}>
            <Ionicons
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        ) : (
          rightIcon && <View className="ml-2">{rightIcon}</View>
        )}
      </View>

      {error && (
        <CustomText variant="error" className="mt-1">
          {error}
        </CustomText>
      )}
    </View>
  );
};

export default CustomInput;
