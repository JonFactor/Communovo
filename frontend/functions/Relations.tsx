import { IUser } from "./Auth";

import axios from "axios";
import api from "./api";

export interface IUserToUser {
  firstUser: number;
  id: number;
  isBlocked: boolean;
  isFollowed: boolean;
  secondUser: number;
}

export const FindFollowing = async (
  userEmail: string,
  checkFollow: boolean = true,
  checkBlocked: boolean = false
): Promise<Array<IUserToUser>> => {
  const response = api.post("/viewRelationships", {
    userEmail,
    checkFollow,
    checkBlocked,
  });
  return (await response).data;
};

export const CreateFollowing = async (): Promise<boolean> => {
  const response = api.post("/", {});
  return (await response).status === 200;
};
