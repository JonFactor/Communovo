import api from "./api";
import { IUser } from "./Auth";
import { IEvent } from "./Events";
import { IGroup } from "./Groups";

export const SearchAllDB = async (search) => {
  const response = api.post("searchAll", { search });
  return (await response).data;
};

export const SendUserEmail = async (emailBody, emailHeader) => {
  const response = api.post("sendSelfEmail", { emailBody, emailHeader });
  return (await response).status === 200;
};
