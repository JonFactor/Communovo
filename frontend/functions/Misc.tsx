import api from "./api";
import { IUser } from "./Auth";
import { IEvent } from "./Events";
import { IGroup } from "./Groups";

export const SearchAllDBApi = async (search) => {
  const response = api.get("searchAll/", { params: { search } });
  return (await response).data;
};

export const SendUserEmailApi = async (emailBody, emailHeader) => {
  const response = api.post("selfEmail/", { emailBody, emailHeader });
  return (await response).status === 200;
};
