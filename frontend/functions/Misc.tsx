import api from "./api";

/*------------------------------------------------- MISC -------------
  |
  |  Purpose:  
  |          When an endpoint does not fit in the previous 3 files this is where
  |          it is kept, more general api calls are placed here.
  |          
  |  Main Functions:
  |           - SEARCH_ALL_DB: returns every object in the db (other than relationships)
  |            that have any of the letters inside of the search input param.     
  |                 
  |           - SEND_USER_EMAIL: this is a general purpose email sending function that
  |            can be used with any email body / header to send an email to the users self,
  |            returning the status of the call in boolean form.
  |               
  *-------------------------------------------------------------------*/

export const SearchAllDBApi = async (search) => {
  const response = api.get("searchAll/", { params: { search } });
  return (await response).data;
};

export const SendUserEmailApi = async (emailBody, emailHeader) => {
  const response = api.post("selfEmail/", { emailBody, emailHeader });
  return (await response).status === 200;
};
