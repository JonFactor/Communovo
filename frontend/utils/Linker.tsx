import * as Linking from "expo-linking";

// to bypass the complex and non-funcitonal expo router hook, the Linker funcition will
// explicitly redirect the user to the specified path then returning wether or not it was
// a successfull attempt.
export const Linker = (path: string): boolean => {
  const redirectUrl = Linking.createURL(path);
  if (!Linking.canOpenURL(redirectUrl)) {
    return false;
  }

  Linking.openURL(redirectUrl);
  return true;
};
