import api from "./api";
import { fetchImageFromUri } from "../common/fetchImageFromUri";
import { Storage } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";

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

/*------------------------------------------------- Auth / User -----
  |
  |  Purpose:  
  |          Provide a centeralized location for all of the user related api endpoints
  |          and use logic with parameters to consolidate the endpoint functions required
  |          making an overall easier to read / develop exeriance for the developer / coder. (me (: )
  |          
  |  Main Functions:
  |                 - USER_DETAILS
  |                 Get either this users details / information or a users infromation via
  |                 a multitude of methods and params, but all returning either a user object
  |                 or a list of user objects.
  |                 
  |                 - LOGIN
  |                 Set a session either with an already established auth token or to
  |                 create a new authentication, session token for the user, each returning 
  |                 the status of the api call in boolean format.
  |                 
  |                 - REGISTER
  |                 input all the required information to create a new account in the register page
  |                 while returning the status of the request, after a row is either added
  |                 or an error in the backend is displayed. (doesnt stop server)
  |                 
  |                 - UPDATE
  |                 set an exisiting users profile picture and other information to a new
  |                 value, returning either the user object itself or the status converted
  |                 to a boolean.
  |                 
  |                 - PHONE_NUMBER
  |                 add or send a message to a phone number via the utils class's sendSms
  |                 function on the backend side with a free google messanger account number
  |                 through a third party librarys un-update code (i hade to update it)
  |                 
  |                 - PASSWORD_RESET
  |                 do the process of sending the user an email with a code, store that code
  |                 in a temp table, use that code to get the users uid (encrypted id)
  |                 and reset the password of that user to the inputed information
  |                  
  |                 - USER_RELATIONS
  |                 update, or view user 2 user relationships to make the app have a more
  |                 community feel.
  |                 
  *-------------------------------------------------------------------*/

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
  jwt: string = "",
  getJwt: boolean = false
) => {
  const requType = useToken ? "COOKIES" : "CREDENTIALS";
  const responseBody = useToken
    ? { email, password, requType, jwt }
    : { email, password, requType };
  const response = api.post("login/", responseBody).catch((err) => {
    return null;
  });

  const returnVal =
    useToken && !getJwt ? await response : (await response).data;
  return returnVal;
};

export const RegisterUserApi = async (
  name: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  console.log("test");
  const response = api
    .post("user/", {
      name,
      email,
      password,
      firstName,
      lastName,
    })
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
  console.log("test1");
  console.log((await response).status);
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


export const getUserProfilePhoto = async (
  viaId: boolean = false,
  userId: string = "0"
): Promise<string> => {

  // check from storage
  let userPhotoUri;
  // check from db
  let userInfo;
  if (viaId) {
    userInfo = await GetUserViaIdApi(userId);
  } else {
    // userInfo = await getUserInfo(); TODO
  }
  if (userInfo === null) {
    return null;
  }

  userPhotoUri = userInfo.profilePic;
  if (userPhotoUri.includes("http:")) {
    return userPhotoUri;
  }
  userPhotoUri = "profile/" + userPhotoUri;
  const photo: string = await Storage.get(userPhotoUri);

  return photo;
};

export const setUserProfilePhoto = async (image, userId: number = null) => {
  const imageKey = uuidv4();

  const imgPath = "profile/" + imageKey;

  const img = await fetchImageFromUri(image["assets"][0]["uri"]);

  await Storage.put(imgPath, img, {
    level: "public",
    contentType: img.type,
  });

  let oldUser;
  if (userId === null) { }
    // const userInfo: IUser = await getUserInfo(); TODO FIX
  //   if (userInfo === null) {
  //     return false;
  //   }

  //   oldUser = userInfo.profilePic;
  //   userId = userInfo.id;

  //   const responseOk = await UpdateUserProfilePicApi(
  //     imageKey,
  //     userId.toString()
  //   );
  //   return responseOk;
  // }
  // const userIdConvert: string = userId.toString();

  // const responseSuccess = await UpdateUserProfilePicApi(
  //   imgPath,
  //   userIdConvert
  // ).then((response) => {
  //   if (response && oldUser !== null) {
  //     // const removeSuccess = await Storage.remove(oldUser, {
  //     //   level: "public",
  //     // });
  //   }
  //   return response;
  // });

  // return responseSuccess;
};
