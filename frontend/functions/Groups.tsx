import { IUser } from "./Auth";
import api from "./api";

export interface IGroup {
  title: string;
  description: string;
  image: string;
  groupType: string;
  owner: number;
}

export const CreateGroup = async (
  title: string,
  description: string,
  image: string,
  groupType: string
): Promise<IGroup> => {
  const response = api.post("group", {
    title,
    description,
    image,
    groupType,
  });
  return (await response).data;
};

export const GetAllGroups = async (): Promise<Array<IGroup>> => {
  const response = api.get("group", { data: { requType: "ALL" } });
  return (await response).data;
};

export const AddUserToGroupView = async (
  email: string,
  title: string,
  isOwner: boolean,
  isCoOwner: boolean,
  isMember: boolean,
  isBanned: boolean
) => {
  const response = api.post("userToGroup", {
    email,
    title,
    isOwner,
    isCoOwner,
    isMember,
    isBanned,
  });
  return (await response).status === 200;
};

export const GetGroupsViaUser = async (): Promise<Array<IGroup>> => {
  const response = api.get("group", { data: { requType: "USER" } });
  return (await response).data;
};

export const GetGroupDetails = async (title: string): Promise<IGroup> => {
  const response = api.get("group", {
    data: { requType: "TITLE", title: title },
  });
  return (await response).data;
};

export const GetGroupMembers = async (
  title: string,
  isStaffOnly: boolean = false
): Promise<Array<IUser>> => {
  const response = api.get("group", {
    data: { title: title, isStaffOnly: isStaffOnly, requType: "MEMBERS" },
  });
  return (await response).data;
};

export const GetGroupViaId = async (id: number): Promise<IGroup> => {
  const response = api.get("getGroupViaId", {
    data: { id: id, requType: "ID" },
  });
  return (await response).data;
};
