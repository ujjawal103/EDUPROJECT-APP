import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useTheme from "../../hooks/useTheme";
import { verifySignupOtp, resendOtp } from "../../services/auth.service";
import ScreenWrapper from "../../common/Screen/ScreenWrapper";
import CustomText from "../../common/Text/CustomText";
import CustomButton from "../../common/Button/CustomButton";
import Logo from "../../common/Logo/Logo";
import Ionicons from "react-native-vector-icons/Ionicons";

// Validation Schema
const otpSchema = z.object({
  otp: z
    .string()
    .min(1, "OTP is required")
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

const VerifyOtpScreen = ({ route, navigation }) => {
  const colors = useTheme();
  const { email } = route.params || { email: "your email" };

  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const textInputRef = useRef(null);

  const { control, handleSubmit, watch, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const otpValue = watch("otp") || "";

  // Auto-focus OTP input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      textInputRef.current?.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Countdown Timer
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  // Handlers
  const onSubmit = useCallback(async (data) => {
    try {
      await verifySignupOtp({
        email,
        otp: data.otp,
      });
      // The authentication state updates automatically in the Zustand store,
      // and RootNavigator will route the user to the logged-in app area.
    } catch (error) {
      setError("otp", {
        type: "server",
        message: error.response?.data?.message || error.message || "Invalid OTP. Please try again.",
      });
    }
  }, [email, setError]);

  const handleResend = useCallback(async () => {
    if (timer > 0 || isResending) return;

    setIsResending(true);
    try {
      await resendOtp({
        email,
        purpose: "email_verification",
      });
      setTimer(60);
    } catch (error) {
      setError("root", {
        type: "server",
        message: error.response?.data?.message || error.message || "Failed to resend OTP. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  }, [email, timer, isResending, setError]);

  const handlePressContainer = () => {
    textInputRef.current?.focus();
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  // Render Helpers
  const renderHeader = () => (
    <View className="mb-6">
      {/* Back button */}
      <TouchableOpacity
        onPress={handleGoBack}
        className="self-start mb-6 p-2 rounded-full border"
        style={{ borderColor: colors.border, backgroundColor: colors.surface }}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={20} color={colors.text} />
      </TouchableOpacity>

      <CustomText variant="title" fontWeight="800" className="mb-2">
        Verify Email
      </CustomText>
      <CustomText variant="body" color={colors.textSecondary}>
        We have sent a 6-digit verification code to
      </CustomText>
      <CustomText variant="body" fontWeight="600" color={colors.primary} className="mt-1">
        {email}
      </CustomText>
    </View>
  );

  const renderOtpSlots = () => {
    const codeLength = 6;
    const otpArray = Array(codeLength).fill("");

    return (
      <View className="mb-6">
        <TouchableWithoutFeedback onPress={handlePressContainer}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10 }}>
            {otpArray.map((_, index) => {
              const char = otpValue[index] || "";
              const isFocused = otpValue.length === index;

              return (
                <View
                  key={index}
                  style={{
                    width: 46,
                    height: 52,
                    borderRadius: 12,
                    borderWidth: 1.5,
                    borderColor: isFocused ? colors.primary : colors.border,
                    backgroundColor: isFocused ? colors.primary + "08" : colors.surface,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CustomText
                    variant="h2"
                    fontWeight="700"
                    color={char ? colors.text : colors.textMuted}
                  >
                    {char || "•"}
                  </CustomText>
                </View>
              );
            })}
          </View>
        </TouchableWithoutFeedback>

        {/* Hidden TextInput for native behavior */}
        <Controller
          control={control}
          name="otp"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              ref={textInputRef}
              value={value}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, "");
                if (numericText.length <= 6) {
                  onChange(numericText);
                }
              }}
              onBlur={onBlur}
              keyboardType="number-pad"
              maxLength={6}
              style={{
                position: "absolute",
                width: 0,
                height: 0,
                opacity: 0,
              }}
              accessibilityLabel="6-digit verification code"
            />
          )}
        />

        {errors.otp && (
          <CustomText variant="error" className="mt-2" centered>
            {errors.otp.message}
          </CustomText>
        )}

        {errors.root && (
          <CustomText variant="error" className="mt-2" centered>
            {errors.root.message}
          </CustomText>
        )}
      </View>
    );
  };

  const renderResendSection = () => {
    const isTimerActive = timer > 0;

    return (
      <View className="items-center mt-4 mb-6">
        {isTimerActive ? (
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={16} color={colors.textSecondary} style={{ marginRight: 6 }} />
            <CustomText variant="body" color={colors.textSecondary}>
              Resend code in{" "}
              <CustomText variant="body" fontWeight="600" color={colors.primary}>
                {timer}s
              </CustomText>
            </CustomText>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleResend}
            disabled={isResending}
            activeOpacity={0.7}
            className="flex-row items-center py-2 px-4 rounded-xl border"
            style={{
              borderColor: colors.primary,
              backgroundColor: isResending ? colors.border : "transparent",
            }}
          >
            <CustomText variant="body" fontWeight="600" color={colors.primary}>
              {isResending ? "Resending..." : "Resend Code"}
            </CustomText>
          </TouchableOpacity>
        )}
      </View>
    );
  };

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

          {/* OTP Input Section */}
          {renderOtpSlots()}

          {/* Resend Logic */}
          {renderResendSection()}

          {/* Submit Button */}
          <CustomButton
            title="Verify Code"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            disabled={isSubmitting || otpValue.length < 6}
          />
        </View>
      </TouchableWithoutFeedback>
    </ScreenWrapper>
  );
};

export default VerifyOtpScreen;