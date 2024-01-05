import * as Linking from "expo-linking";

export const Linker = (path: string): boolean => {
  const redirectUrl = Linking.createURL(path);
  if (!Linking.canOpenURL(redirectUrl)) {
    return false;
  }

  Linking.openURL(redirectUrl);
  return true;
};
