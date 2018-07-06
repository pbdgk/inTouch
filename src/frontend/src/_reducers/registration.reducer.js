// Path: /src/_reducers/users.reducer.js
//
// The redux users reducer manages the users section of the application state which is used by the HomePage to display a list of users and enable deleting of users.


import { userConstants } from '../_constants';

export function registration(state = {}, action) {
  switch (action.type) {
    case userConstants.REGISTER_REQUEST:
      return { registering: true };
    case userConstants.REGISTER_SUCCESS:
      return {};
    case userConstants.REGISTER_FAILURE:
      return {};
    default:
      return state
  }
}
