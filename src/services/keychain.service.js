import * as Keychain from "react-native-keychain";

export const saveRefreshToken = async (refreshToken) => {
  await Keychain.setGenericPassword("refreshToken", refreshToken);
};

export const getRefreshToken = async () => {
  const credentials = await Keychain.getGenericPassword();
  return credentials ? credentials.password : null;
};

export const deleteRefreshToken = async () => {
  await Keychain.resetGenericPassword();
};