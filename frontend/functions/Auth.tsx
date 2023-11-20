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
): Promise<boolean> => {
  const response = api.post("register", {
    name,
    email,
    password,
    firstName,
    lastName,
  });
  return (await response).status === 200;
};

export const UserLoginViaCookies = async (jwt: string): Promise<boolean> => {
  if (jwt === null) {
    return false;
  }

  console.log(jwt);

  const response = api.post("cookieLogin", { jwt });
  return (await response).status === 200;
};

export const UserUpdateProfile = async (
  profilePicUrl: String,
  id: String
): Promise<boolean> => {
  const response = api
    .post("setProfile", { profilePicUrl, id })
    .catch((err) => {
      console.log("profile:" + err);
      return response;
    });
  return (await response).status === 200;
};

export const UserViaId = async (id: string): Promise<IUser> => {
  const response = api.post("userViaId", { id });
  return (await response).data;
};
