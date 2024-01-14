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

export const GetUserDetailsApi = async (): Promise<IUser> => {
  const response = api
    .get("user/", { params: { requType: "SELF" } })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return null;
    });
  return await response;
};

export const LoginUserApi = async (
  email: string = "",
  password: string = "",
  useToken: boolean = false,
  jwt: string = "123"
) => {
  const requType = useToken ? "COOKIES" : "CREDENTIALS";
  const responseBody = useToken
    ? { email, password, requType, jwt }
    : { email, password, requType };
  const response = api.post("login/", responseBody).catch((err) => {
    return null;
  });

  const returnVal = useToken ? await response : (await response).data;
  return returnVal;
};

export const RegisterUserApi = async (
  name: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  const response = api.post("user/", {
    name,
    email,
    password,
    firstName,
    lastName,
  });
  return (await response).status === 200;
};

export const UpdateUserProfilePicApi = async (
  profilePicUrl: String,
  id: String
) => {
  const response = api.patch("user/", { profilePicUrl, id }).catch((err) => {
    return response;
  });
  return (await response).status === 200;
};

export const GetUserViaIdApi = async (id: string | number): Promise<IUser> => {
  const response = api.get("user/", { params: { id: id, requType: "ID" } });
  return (await response).data;
};

export const SendEmailApi = async (email: string) => {
  const response = api.post("requestPasswordReset", { email });
  return (await response).status === 200;
};

export const GetPasswordResetCodeApi = async (
  code: string,
  password: string
) => {
  const repsonse = api.post("passwordResetComplete", { code, password });
  return (await repsonse).status === 200;
};

export const AddPhoneNumberUserApi = async (
  number: string,
  eventTitle: string,
  eventDate: string
): Promise<boolean> => {
  const response = api.post(`userAddPhone/`, {
    number,
    eventTitle,
    eventDate,
  });
  return (await response).status === 200;
};

export const PhoneNotifyUserApi = async (
  number: string,
  eventTitle: string,
  eventDate: string
) => {
  const response = api.post("notifyPhone/", {
    number,
    eventTitle,
    eventDate,
  });
  return (await response).status === 200;
};

export const DeleteSelfUserApi = async () => {
  const response = api.delete("user/");
  return (await response).status === 200;
};

// relationship section

export interface IUserToUser {
  firstUser: number;
  id: number;
  isBlocked: boolean;
  isFollowed: boolean;
  secondUser: number;
}

export const GetSelfFollowingApi = async (
  userEmail: string,
  checkFollow: boolean = true,
  checkBlocked: boolean = false
): Promise<Array<IUserToUser>> => {
  const response = api.get("relationship/", {
    params: {
      userEmail,
      checkFollow,
      checkBlocked,
    },
  });
  return (await response).data;
};

export const User2UserStatusChangeApi = async (
  userId: number,
  isFollow: boolean
) => {
  const response = api.post("user2userStatusChange/", { userId, isFollow });
  return (await response).status === 200;
};
