import React, { useRef, useCallback } from "react";
import { View, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useTheme from "../../hooks/useTheme";
import { login } from "../../services/auth.service";
import ScreenWrapper from "../../common/Screen/ScreenWrapper";
import CustomText from "../../common/Text/CustomText";
import CustomInput from "../../common/Input/CustomInput";
import CustomButton from "../../common/Button/CustomButton";
import Logo from "../../common/Logo/Logo";
import Ionicons from "react-native-vector-icons/Ionicons";

// Validation Schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const LoginScreen = ({ navigation }) => {
  const colors = useTheme();
  const passwordInputRef = useRef(null);
  const { control, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handlers
  const onSubmit = useCallback(async (data) => {
    try {
      await login({
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      setError("root", {
        type: "server",
        message: error.response?.data?.message || error.message || "Invalid credentials. Please try again.",
      });
    }
  }, [setError]);

  const handleForgotPassword = useCallback(() => {
    navigation.navigate("ForgotPassword");
  }, [navigation]);

  const handleSignUp = useCallback(() => {
    navigation.navigate("Signup");
  }, [navigation]);

  const handleGoogleLogin = useCallback(() => {
    // TODO: Implement Google OAuth login flow for production
  }, []);

  // Render Helpers
  const renderHeader = () => (
    <View className="mb-8">
      <CustomText variant="title" fontWeight="800" className="mb-2">
        Welcome Back
      </CustomText>
      <CustomText variant="body" color={colors.textSecondary}>
        Enter your details to access your account
      </CustomText>
    </View>
  );

  const renderForm = () => (
    <View>
      {errors.root && (
        <View
          className="mb-4 p-3.5 rounded-xl border"
          style={{
            backgroundColor: colors.error + "10",
            borderColor: colors.error + "30",
          }}
        >
          <CustomText variant="error" centered>
            {errors.root.message}
          </CustomText>
        </View>
      )}

      {/* Email Input */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            label="Email Address"
            placeholder="name@example.com"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => passwordInputRef.current?.focus()}
            error={errors.email?.message}
            editable={!isSubmitting}
            accessibilityLabel="Email input field"
            leftIcon={
              <Ionicons
                name="mail-outline"
                size={20}
                color={colors.textSecondary}
              />
            }
          />
        )}
      />

      {/* Password Input */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            ref={passwordInputRef}
            label="Password"
            placeholder="••••••••"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleSubmit(onSubmit)}
            error={errors.password?.message}
            editable={!isSubmitting}
            accessibilityLabel="Password input field"
            leftIcon={
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={colors.textSecondary}
              />
            }
          />
        )}
      />

      {/* Forgot Password Link */}
      <View className="items-end mb-6">
        <TouchableOpacity
          onPress={handleForgotPassword}
          accessibilityRole="button"
          accessibilityLabel="Forgot password"
          activeOpacity={0.7}
        >
          <CustomText
            variant="body"
            fontWeight="600"
            color={colors.primary}
          >
            Forgot Password?
          </CustomText>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <CustomButton
        title="Sign In"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        disabled={isSubmitting}
        accessibilityRole="button"
        accessibilityLabel="Log in to your account"
      />
    </View>
  );

  const renderSocialLogin = () => (
    <View className="mt-6">
      {/* OR Divider */}
      <View className="flex-row items-center my-6">
        <View
          className="flex-1 h-[1.5px]"
          style={{ backgroundColor: colors.border }}
        />
        <CustomText
          variant="caption"
          className="mx-4 font-bold"
          color={colors.textMuted}
        >
          OR
        </CustomText>
        <View
          className="flex-1 h-[1.5px]"
          style={{ backgroundColor: colors.border }}
        />
      </View>

      {/* Google Button */}
      <CustomButton
        title="Continue with Google"
        onPress={handleGoogleLogin}
        variant="outline"
        accessibilityRole="button"
        accessibilityLabel="Sign in with Google"
        leftIcon={
          <Ionicons
            name="logo-google"
            size={20}
            color={colors.primary}
          />
        }
      />
    </View>
  );

  const renderFooter = () => (
    <View className="flex-row justify-center items-center mt-8">
      <CustomText variant="body" color={colors.textSecondary}>
        Don't have an account?{" "}
      </CustomText>
      <TouchableOpacity
        onPress={handleSignUp}
        accessibilityRole="button"
        accessibilityLabel="Create a new account"
        activeOpacity={0.7}
      >
        <CustomText variant="body" fontWeight="700" color={colors.primary}>
          Sign Up
        </CustomText>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper withScroll={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1 justify-center py-8">
          {/* Logo Section */}
          <View className="items-center mb-8">
            <Logo size={60} showText={true} />
          </View>

          {/* Header Section */}
          {renderHeader()}

          {/* Form Section */}
          {renderForm()}

          {/* Social Sign-In Section */}
          {renderSocialLogin()}

          {/* Footer Section */}
          {renderFooter()}
        </View>
      </TouchableWithoutFeedback>
    </ScreenWrapper>
  );
};

export default LoginScreen;


