/* eslint-disable no-shadow */
import {
  refreshToken,
  login as loginApi,
  sendSignupOtp as sendSignupOtpApi,
  verifySignupOtp as verifySignupOtpApi,
  resendOtp as resendOtpApi
} from "../api/auth.api";
import { getRefreshToken, saveRefreshToken, deleteRefreshToken } from "./keychain.service";
import useAuthStore from "../store/auth.store";

export const login = async (credentials) => {
  try {
    const { data } = await loginApi(credentials);
    const { accessToken, refreshToken, user } = data;

    await saveRefreshToken(refreshToken);

    useAuthStore.getState().login({
      user,
      accessToken,
    });

    return user;
  } catch (error) {
    throw error;
  }
};

export const sendSignupOtp = async (signupData) => {
  try {
    const { data } = await sendSignupOtpApi(signupData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const verifySignupOtp = async (verificationData) => {
  try {
    const { data } = await verifySignupOtpApi(verificationData);
    const { accessToken, refreshToken, user } = data;

    await saveRefreshToken(refreshToken);

    useAuthStore.getState().login({
      user,
      accessToken,
    });

    return user;
  } catch (error) {
    throw error;
  }
};

export const resendOtp = async (resendData) => {
  try {
    const { data } = await resendOtpApi(resendData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const refreshSession = async () => {
  try {
    const storedRefreshToken = await getRefreshToken();
    if (!storedRefreshToken) {
      throw new Error("No refresh token found");
    }

    // 2. Call refresh API
    const { data } = await refreshToken({
      refreshToken: storedRefreshToken,
    });

    // 3. Extract response
    const { accessToken, refreshToken: newRefreshToken, user} = data;

    // 4. Update Zustand
    const { login } = useAuthStore.getState();

    login({ user, accessToken});

    // 5. Save new refresh token
    await saveRefreshToken(newRefreshToken);

    // 6. Return fresh access token
    return accessToken;
  } catch (error) {
    // Refresh failed

    await deleteRefreshToken();

    const { logout } = useAuthStore.getState();

    logout();

    throw error;
  }
};