import { IUser } from "./Auth";
import api from "./api";

export interface IGroup {
  title: string;
  description: string;
  image: string;
  groupType: string;
  owner: number;
}

/*------------------------------------------------- Group -------------
  |
  |  Purpose:  
  |          Handle the use of axios for the group api endpoints in one locations for
  |          easier imports and standardization, much like the Auth, and Events pages.
  |          
  |  Main Functions:
  |                 - CREATE
  |                 take in all of the params to get a minimal group and send this data
  |                 via a post request to the backend server to create a new row or return 
  |                 false.
  |                 
  |                 - GET
  |                 much like previous gets, take in params, filter, output data or null
  |                 for array repeat over and over again.
  |
  |                 - RELATIONSHIP
  |                 similar to the other files, get or create a new relationship to users
  |                 or events depending, all of which have their own endpoints in the backend.
  |                 
  *-------------------------------------------------------------------*/

export const CreateGroupApi = async (
  title: string,
  description: string,
  image: string,
  groupType: string
): Promise<IGroup> => {
  const response = api.post("group/", {
    title,
    description,
    image,
    groupType,
  });
  return (await response).data;
};

export const GetAllGroupsApi = async (): Promise<Array<IGroup>> => {
  const response = api.get("group/", { params: { requType: "ALL" } });
  return (await response).data;
};

export const CreateGroupUserRelationshipApi = async (
  email: string,
  title: string,
  isOwner: boolean,
  isCoOwner: boolean,
  isMember: boolean,
  isBanned: boolean
) => {
  const response = api.post("group2User/", {
    email,
    title,
    isOwner,
    isCoOwner,
    isMember,
    isBanned,
  });
  return (await response).status === 200;
};

export const GetGroupArrayViaUserApi = async (): Promise<Array<IGroup>> => {
  const response = api.get("group2User/", { params: { requType: "USER" } });
  return (await response).data;
};

export const GetGroupDetailsViaTitleApi = async (
  title: string
): Promise<IGroup> => {
  const response = api.get("group/", { params: { requType: "TITLE", title } });
  return (await response).data;
};

export const GetGroupMemberArrayViaTitleApi = async (
  title: string,
  isStaffOnly: boolean = false
): Promise<Array<IUser>> => {
  const response = api.post("user2Event/", {
    params: { title, isStaffOnly, requType: "TITLE" },
  });
  return (await response).data;
};

export const GetGroupViaIdApi = async (id: number): Promise<IGroup> => {
  const response = api.get("group/", { params: { id, requType: "ID" } });
  return (await response).data;
};
