import { axiosInstance, authAxios } from "./axios";

// ==================== AUTH ====================

export const sendSignupOtp = (data) =>
  axiosInstance.post("/v1/auth/send-signup-otp", data);

export const verifySignupOtp = (data) =>
  axiosInstance.post("/v1/auth/verify-signup-otp", data);

export const resendOtp = (data) =>
  axiosInstance.post("/v1/auth/resend-otp", data);

export const login = (data) =>
  axiosInstance.post("/v1/auth/login", data);

export const refreshToken = (data) =>
  authAxios.post("/v1/auth/refresh-token", data);

export const forgotPassword = (data) =>
  axiosInstance.post("/v1/auth/forgot-password", data);

export const verifyForgotPasswordOtp = (data) =>
  axiosInstance.post("/v1/auth/verify-forgot-password-otp", data);

export const resetPassword = (data) =>
  axiosInstance.post("/v1/auth/reset-password", data);

export const logout = (data) =>
  authAxios.post("/v1/auth/logout", data);

export const logoutAllDevices = (data) =>
  authAxios.post("/v1/auth/logout-all-devices", data);

export const googleAuth = (data) =>
  axiosInstance.post("/v1/auth/google", data);

// ==================== USER ====================

export const changePassword = (data) =>
  axiosInstance.patch("/v1/user/change-password", data);

export const changeEmail = (data) =>
  axiosInstance.patch("/v1/user/change-email", data);

export const verifyChangeEmailOtp = (data) =>
  axiosInstance.post("/v1/user/verify-change-email-otp", data);

export const selectRole = (data) =>
  axiosInstance.patch("/v1/auth/select-role", data);

export const getCurrentUser = () =>
  axiosInstance.get("/v1/user/me");