import { refreshToken } from "../api/auth.api";
import { getRefreshToken, saveRefreshToken, deleteRefreshToken } from "./keychain.service";
import useAuthStore from "../store/auth.store";

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