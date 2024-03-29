import { IUser } from "./Auth";

import api from "./api";

export interface IEvent {
  id: string;
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
  isExpired?: boolean;
}

/*------------------------------------------------------ Events -----
  |
  |  Purpose:  
  |          House all of the event related api endpoints, much like the Auth.tsx file
  |          to create a more centeralized and less cluttered location for the api endpoints
  |          to be reused.
  |          
  |  Main Functions:
  |                 - CREATE
  |                 take in all the params for a minimal event creation, and make a row
  |                 in the event_event table if success otherwise just return false.
  |                 (opposite is true for success)
  |                 
  |                 - GET
  |                 get either on events details or a whole array of events information
  |                 baised on parameter input wether that be filters or a singular
  |                 events id.
  |                 
  |                 - RELATIONSHIP
  |                 create or view the user2event or group2event relationships via the 
  |                 inputed parameters with outputed data or status.
  |                   
  *-------------------------------------------------------------------*/

export const CreateEventApi = async (
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
  const response = api.post("event/", {
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
export const GetEventArrayApi = async (
  isOnlyDisliked: boolean = false,
  isOnlyLiked: boolean = false,
  excludeDisliked: boolean = false,
  isBaisedOnGroup: boolean = false,
  groupTitle: string = "",
  includeExpired: boolean = false
): Promise<Array<IEvent>> => {
  const response = api.get("event/", {
    params: {
      requType: "COLLECTION",
      isOnlyDisliked,
      isOnlyLiked,
      excludeDisliked,
      isBaisedOnGroup,
      groupTitle,
      includeExpired,
    },
  });

  return (await response).data;
};

export const GetEventDetailsApi = async (eventId: string): Promise<IEvent> => {
  const response = api.get("event/", { params: { eventId, requType: "ID" } });
  return (await response).data;
};

export const CreateUser2EventApi = async (
  viaEmail: boolean,
  email: string,
  eventTitle: string,
  isOwner: boolean,
  isCoOwner: boolean,
  isGuest: boolean
) => {
  const response = api.post("event2user/", {
    viaEmail,
    email,
    eventTitle,
    isOwner,
    isCoOwner,
    isGuest,
  });
  return (await response).status === 200;
};

export const CreateUser2EventPreferenceApi = async (
  eventTitle: string,
  isLiked: boolean,
  isDisliked: boolean
) => {
  const response = api.post("userEventPreference/", {
    eventTitle,
    isLiked,
    isDisliked,
  });
  return (await response).status === 200;
};

export const GetEventMembersApi = async (
  id: string,
  isStaffOnly: boolean = false
): Promise<Array<IUser>> => {
  const response = api.get("event2user/", {
    params: { id, isStaffOnly, requType: "EVENTUSERS" },
  });
  return (await response).data;
};

export const GetEventSelfIsOwnerApi = async (eventId) => {
  const response = api.get("event2user/", {
    params: { eventId, requType: "SELFOWNER" },
  });
  return (await response).data;
};

export const DeleteEventApi = async (eventId) => {
  const response = api.delete("event/", { data: { eventId } });
  return (await response).status === 200;
};
