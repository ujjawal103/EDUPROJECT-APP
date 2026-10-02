import React, { useRef, useCallback } from "react";
import { View, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useTheme from "../../hooks/useTheme";
import { sendSignupOtp } from "../../services/auth.service";
import ScreenWrapper from "../../common/Screen/ScreenWrapper";
import CustomText from "../../common/Text/CustomText";
import CustomInput from "../../common/Input/CustomInput";
import CustomButton from "../../common/Button/CustomButton";
import Logo from "../../common/Logo/Logo";
import Ionicons from "react-native-vector-icons/Ionicons";

// Validation Schema
const signupSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters"),
  lastName: z
    .string()
    .max(50, "Last name must be at most 50 characters")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),
  role: z.enum(["customer", "educator"]),
  angelOneClientId: z
    .string()
    .max(10, "Client ID must be at most 10 characters")
    .optional()
    .or(z.literal("")),
});

const SignupScreen = ({ navigation }) => {
  const colors = useTheme();

  // Refs for sequential focus
  const lastNameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const angelOneInputRef = useRef(null);

  const { control, handleSubmit, watch, setValue, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "customer",
      angelOneClientId: "",
    },
  });

  const selectedRole = watch("role");

  // Handlers
  const onSubmit = useCallback(async (data) => {
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName || undefined,
        email: data.email,
        password: data.password,
        role: data.role,
        angelOneClientId: data.role === "educator" ? (data.angelOneClientId || undefined) : undefined,
      };

      await sendSignupOtp(payload);

      // Navigate to VerifyOtp Screen
      navigation.navigate("VerifyOtp", {
        email: data.email,
      });
    } catch (error) {
      setError("root", {
        type: "server",
        message: error.response?.data?.message || error.message || "Failed to create account. Please try again.",
      });
    }
  }, [navigation, setError]);

  const handleLoginRedirect = useCallback(() => {
    navigation.navigate("Login");
  }, [navigation]);

  // Render Helpers
  const renderHeader = () => (
    <View className="mb-6">
      <CustomText variant="title" fontWeight="800" className="mb-2">
        Create Account
      </CustomText>
      <CustomText variant="body" color={colors.textSecondary}>
        Sign up to start learning and managing your assets
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

      {/* First Name Input */}
      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            label="First Name"
            placeholder="John"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            returnKeyType="next"
            onSubmitEditing={() => lastNameInputRef.current?.focus()}
            error={errors.firstName?.message}
            editable={!isSubmitting}
            leftIcon={
              <Ionicons
                name="person-outline"
                size={20}
                color={colors.textSecondary}
              />
            }
          />
        )}
      />

      {/* Last Name Input */}
      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            ref={lastNameInputRef}
            label="Last Name (Optional)"
            placeholder="Doe"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            returnKeyType="next"
            onSubmitEditing={() => emailInputRef.current?.focus()}
            error={errors.lastName?.message}
            editable={!isSubmitting}
            leftIcon={
              <Ionicons
                name="person-outline"
                size={20}
                color={colors.textSecondary}
              />
            }
          />
        )}
      />

      {/* Email Input */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            ref={emailInputRef}
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
            returnKeyType="next"
            onSubmitEditing={() => {
              if (selectedRole === "educator") {
                angelOneInputRef.current?.focus();
              } else {
                Keyboard.dismiss();
              }
            }}
            error={errors.password?.message}
            editable={!isSubmitting}
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

      {/* Role Selection */}
      <View className="mb-4">
        <CustomText
          variant="caption"
          fontWeight="600"
          color={colors.textSecondary}
          className="mb-1.5"
        >
          Select Role
        </CustomText>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={isSubmitting}
            style={{
              flex: 1,
              marginRight: 8,
              paddingVertical: 12,
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: selectedRole === "customer" ? colors.primary : colors.border,
              backgroundColor: selectedRole === "customer" ? colors.primary + "15" : colors.surface,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
            onPress={() => setValue("role", "customer")}
          >
            <Ionicons
              name="person"
              size={18}
              color={selectedRole === "customer" ? colors.primary : colors.textSecondary}
              style={{ marginRight: 6 }}
            />
            <CustomText
              variant="body"
              fontWeight="600"
              color={selectedRole === "customer" ? colors.primary : colors.textSecondary}
            >
              Customer
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            disabled={isSubmitting}
            style={{
              flex: 1,
              marginLeft: 8,
              paddingVertical: 12,
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: selectedRole === "educator" ? colors.primary : colors.border,
              backgroundColor: selectedRole === "educator" ? colors.primary + "15" : colors.surface,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
            onPress={() => setValue("role", "educator")}
          >
            <Ionicons
              name="school"
              size={18}
              color={selectedRole === "educator" ? colors.primary : colors.textSecondary}
              style={{ marginRight: 6 }}
            />
            <CustomText
              variant="body"
              fontWeight="600"
              color={selectedRole === "educator" ? colors.primary : colors.textSecondary}
            >
              Educator
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Angel One Client ID (Conditional for Educator) */}
      {selectedRole === "educator" && (
        <Controller
          control={control}
          name="angelOneClientId"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              ref={angelOneInputRef}
              label="Angel One Client ID"
              placeholder="e.g. ANGELID1"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="characters"
              returnKeyType="done"
              onSubmitEditing={handleSubmit(onSubmit)}
              error={errors.angelOneClientId?.message}
              editable={!isSubmitting}
              leftIcon={
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color={colors.textSecondary}
                />
              }
            />
          )}
        />
      )}

      {/* Submit Button */}
      <CustomButton
        title="Sign Up"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        disabled={isSubmitting}
        style={{ marginTop: 8 }}
      />
    </View>
  );

  const renderFooter = () => (
    <View className="flex-row justify-center items-center mt-6 mb-8">
      <CustomText variant="body" color={colors.textSecondary}>
        Already have an account?{" "}
      </CustomText>
      <TouchableOpacity
        onPress={handleLoginRedirect}
        accessibilityRole="button"
        accessibilityLabel="Go to Login"
        activeOpacity={0.7}
      >
        <CustomText variant="body" fontWeight="700" color={colors.primary}>
          Sign In
        </CustomText>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper withScroll={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1 justify-center py-6">
          {/* Logo Section */}
          <View className="items-center mb-6">
            <Logo size={55} showText={true} />
          </View>

          {/* Header Section */}
          {renderHeader()}

          {/* Form Section */}
          {renderForm()}

          {/* Footer Section */}
          {renderFooter()}
        </View>
      </TouchableWithoutFeedback>
    </ScreenWrapper>
  );
};

export default SignupScreen;