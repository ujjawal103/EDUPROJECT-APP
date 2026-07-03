import { axiosInstance, authAxios } from "./axios";

// ==================== AUTH ====================

export const sendSignupOtp = (data) =>
  axiosInstance.post("/auth/send-signup-otp", data);

export const verifySignupOtp = (data) =>
  axiosInstance.post("/auth/verify-signup-otp", data);

export const resendOtp = (data) =>
  axiosInstance.post("/auth/resend-otp", data);

export const login = (data) =>
  axiosInstance.post("/auth/login", data);

export const refreshToken = (data) =>
  authAxios.post("/auth/refresh-token", data);

export const forgotPassword = (data) =>
  axiosInstance.post("/auth/forgot-password", data);

export const verifyForgotPasswordOtp = (data) =>
  axiosInstance.post("/auth/verify-forgot-password-otp", data);

export const resetPassword = (data) =>
  axiosInstance.post("/auth/reset-password", data);

export const logout = (data) =>
  authAxios.post("/auth/logout", data);

export const logoutAllDevices = (data) =>
  authAxios.post("/auth/logout-all-devices", data);

export const googleAuth = (data) =>
  axiosInstance.post("/auth/google", data);

// ==================== USER ====================

export const changePassword = (data) =>
  axiosInstance.patch("/users/change-password", data);

export const changeEmail = (data) =>
  axiosInstance.patch("/users/change-email", data);

export const verifyChangeEmailOtp = (data) =>
  axiosInstance.post("/users/verify-change-email-otp", data);

export const selectRole = (data) =>
  axiosInstance.patch("/users/select-role", data);

export const getCurrentUser = () =>
  axiosInstance.get("/users/me");