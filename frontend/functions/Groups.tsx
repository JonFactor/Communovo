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
  const response = api.post("createGroup", {
    title,
    description,
    image,
    groupType,
  });
  return (await response).data;
};

export const GetAllGroups = async (): Promise<Array<IGroup>> => {
  const response = api.get("getAllGroups");
  return (await response).data;
};

export const AddUserToGroupView = async (
  email: string,
  title: string,
  isOwner: boolean,
  isCoOwner: boolean,
  isMember: boolean,
  isBanned: boolean
): Promise<boolean> => {
  const response = api.post("addUserToGroup", {
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
  const response = api.post("getGroupViaUser");
  return (await response).data;
};

export const GetGroupDetails = async (title: string): Promise<IGroup> => {
  const response = api.post("getGroupData");
  return (await response).data;
};

export const GetGroupMembers = async (
  title: string,
  isStaffOnly: boolean = false
): Promise<Array<IUser>> => {
  const response = api.post("getMembersFromGroup", { title, isStaffOnly });
  return (await response).data;
};

export const GetGroupViaId = async (id: number): Promise<IGroup> => {
  const response = api.post("getGroupViaId", { id });
  return (await response).data;
};
