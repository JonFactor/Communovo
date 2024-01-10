import api from "./api";

export interface IUser {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePic: string;
  description: string;
  favColor: string;
  phoneNum?: string;
}

export const UserGetDetails = async (): Promise<IUser> => {
  const response = api
    .get("user")
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return null;
    });
  return await response;
};

export const UserLogin = async (
  email: string,
  password: string
): Promise<Response> => {
  const response = api.post("login", { email, password }).catch((err) => {
    return null;
  });
  return await response;
};

export const UserRegister = async (
  name: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  const response = api.post("register", {
    name,
    email,
    password,
    firstName,
    lastName,
  });
  return (await response).status === 200;
};

export const UserLoginViaCookies = async (jwt: string) => {
  if (jwt === null) {
    return false;
  }

  const response = api.post("cookieLogin", { jwt });
  return (await response).status === 200;
};

export const UserUpdateProfile = async (profilePicUrl: String, id: String) => {
  const response = api
    .post("setProfile", { profilePicUrl, id })
    .catch((err) => {
      return response;
    });
  return (await response).status === 200;
};

export const UserViaId = async (id: string): Promise<IUser> => {
  const response = api.post("userViaId", { id });
  return (await response).data;
};

export const SendEmail = async (email: string) => {
  const response = api.post("requestPasswordReset", { email });
  return (await response).status === 200;
};

export const PasswordResetCode = async (code: string, password: string) => {
  const repsonse = api.post("passwordResetComplete", { code, password });
  return (await repsonse).status === 200;
};

export const UserPhoneNumberAdd = async (
  number: string,
  eventTitle: string,
  eventDate: string
): Promise<boolean> => {
  const response = api.post(`userAddPhoneNumber`, {
    number,
    eventTitle,
    eventDate,
  });
  return (await response).status === 200;
};

export const UserPhoneNumberNotify = async (
  number: string,
  eventTitle: string,
  eventDate: string
) => {
  const response = api.post("userPhoneNumberNotify", {
    number,
    eventTitle,
    eventDate,
  });
  return (await response).status === 200;
};

export const User2UserStatusChange = async (
  userId: number,
  isFollow: boolean
) => {
  const response = api.post("user2userStatusChange", { userId, isFollow });
  return (await response).status === 200;
};

export const DeleteAccount = async () => {
  const response = api.post("userDeleteAccount");
  return (await response).status === 200;
};
