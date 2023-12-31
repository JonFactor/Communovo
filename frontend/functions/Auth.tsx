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

export const UserGetDetails = async (): Promise<any> => {
  console.log("here");
  const requType: string = "SELF";
  //   const response = api
  //     .get("user/SELF")
  //     .then((response) => {
  //       return response.data;
  //     })
  //     .catch((err) => {
  //       return null;
  //     });
  //   return await response;
  // };
  const response = fetch(
    `${process.env.EXPO_PUBLIC_BACKEND_URL}/user/details=${encodeURIComponent(
      JSON.stringify(requType)
    )}`,
    {
      method: "GET",
    }
  ).then(async (response) => {
    if (!response.ok) {
      return null;
    }
    return await response.json;
  });
};
export const UserLogin = async (
  email: string,
  password: string
): Promise<Response> => {
  const requType = "AUTH";
  const response = api
    .post("login", { email, password, requType })
    .catch((err) => {
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
  const response = api.post("user", {
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

  const requType = "COOKIES";
  const response = api.post("login", { jwt, requType });
  return (await response).status === 200;
};

export const UserUpdateProfile = async (profilePicUrl: String, id: String) => {
  const response = api.put("setProfile", { profilePicUrl, id }).catch((err) => {
    console.log("profile:" + err);
    return response;
  });
  return (await response).status === 200;
};

export const UserViaId = async (id: string): Promise<IUser> => {
  const response = api.get("userViaId", { data: { requType: "ID", id: id } });
  return (await response).data;
};
