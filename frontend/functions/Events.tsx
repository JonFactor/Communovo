import { IUser } from "./Auth";

import api from "./api";

export interface IEvent {
  title: string;
  description: string;
  ownerId: number;
  date: string;
  eventGroup: number;
  eventType: string;
  location: string;
  coverImg: string;
  regionCords: string;
  time?: string;
}

export const EventCreate = async (
  title: string,
  description: string,
  date: string,
  eventType: string,
  location: string,
  coverImg: string,
  eventGroup: string,
  regionCords: string,
  time: string
) => {
  const response = api.post("eventCreate", {
    title,
    description,
    date,
    eventType,
    location,
    coverImg,
    eventGroup,
    regionCords,
    time,
  });
  return (await response).status === 200;
};

// might err
export const EventsGetAll = async (
  isOnlyDisliked: boolean = false,
  isOnlyLiked: boolean = false,
  excludeDisliked: boolean = false,
  isBaisedOnGroup: boolean = false,
  groupTitle: string = ""
): Promise<Array<IEvent>> => {
  const response = api.post("eventCollection", {
    isOnlyDisliked,
    isOnlyLiked,
    excludeDisliked,
    isBaisedOnGroup,
    groupTitle,
  });

  return (await response).data;
};

export const EventsGetDetails = async (id: string): Promise<IEvent> => {
  const response = api.post("eventData", { id });
  return (await response).data;
};

export const User2Event = async (
  viaEmail: boolean,
  email: string,
  eventTitle: string,
  isOwner: boolean,
  isCoOwner: boolean,
  isGuest: boolean
) => {
  const response = api.post("event2userCreate", {
    viaEmail,
    email,
    eventTitle,
    isOwner,
    isCoOwner,
    isGuest,
  });
  return (await response).status === 200;
};

export const setEventUserPref = async (
  eventTitle: string,
  isLiked: boolean,
  isDisliked: boolean
) => {
  const response = api.post("eventUserPreferencesSet", {
    eventTitle,
    isLiked,
    isDisliked,
  });
  return (await response).status === 200;
};

export const GetEventMembers = async (
  id: string,
  isStaffOnly: boolean = false
): Promise<Array<IUser>> => {
  const response = api.post("getMembersFromEvent", { id, isStaffOnly });
  return (await response).data;
};

export const GetIsOwnerEvent = async (eventId) => {
  const response = api.post("memberIsOwner", { eventId });
  return (await response).data;
};

export const DeleteEvent = async (eventId) => {
  const response = api.post("removeEvent", { eventId });
  return (await response).status === 200;
};
