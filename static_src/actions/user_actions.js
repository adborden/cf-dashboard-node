
/*
 * Actions for user entities. Any actions such as fetching, creating, updating,
 * etc should go here.
 */

import AppDispatcher from '../dispatcher.js';
import cfApi from '../util/cf_api';
import uaaApi from '../util/uaa_api';
import { userActionTypes } from '../constants';
import UserStore from '../stores/user_store';

const userActions = {
  fetchOrgUsers(orgGuid) {
    AppDispatcher.handleViewAction({
      type: userActionTypes.ORG_USERS_FETCH,
      orgGuid
    });
  },

  fetchOrgUserRoles(orgGuid) {
    AppDispatcher.handleViewAction({
      type: userActionTypes.ORG_USER_ROLES_FETCH,
      orgGuid
    });
  },

  fetchSpaceUsers(spaceGuid) {
    AppDispatcher.handleViewAction({
      type: userActionTypes.SPACE_USERS_FETCH,
      spaceGuid
    });
  },

  receivedOrgUsers(users, orgGuid) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.ORG_USERS_RECEIVED,
      users,
      orgGuid
    });
  },

  receivedOrgUserRoles(roles, orgGuid) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.ORG_USER_ROLES_RECEIVED,
      orgUserRoles: roles,
      orgGuid
    });
  },

  receivedSpaceUsers(users, spaceGuid) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.SPACE_USERS_RECEIVED,
      users,
      spaceGuid
    });
  },

  deleteUser(userGuid, orgGuid) {
    AppDispatcher.handleViewAction({
      type: userActionTypes.USER_DELETE,
      userGuid,
      orgGuid
    });
  },

  deletedUser(userGuid, orgGuid) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.USER_DELETED,
      userGuid,
      orgGuid
    });
  },

  addUserRoles(roles, userGuid, resourceGuid, resourceType) {
    AppDispatcher.handleViewAction({
      type: userActionTypes.USER_ROLES_ADD,
      roles,
      userGuid,
      resourceGuid,
      resourceType
    });
  },

  addedUserRoles(roles, userGuid, resourceType) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.USER_ROLES_ADDED,
      roles,
      userGuid,
      resourceType
    });
  },

  deleteUserRoles(roles, userGuid, resourceGuid, resourceType) {
    AppDispatcher.handleViewAction({
      type: userActionTypes.USER_ROLES_DELETE,
      roles,
      userGuid,
      resourceGuid,
      resourceType
    });
  },

  deletedUserRoles(roles, userGuid, resourceType) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.USER_ROLES_DELETED,
      roles,
      userGuid,
      resourceType
    });
  },

  errorRemoveUser(userGuid, error) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.ERROR_REMOVE_USER,
      userGuid,
      error
    });
  },

  changeCurrentlyViewedType(userType) {
    AppDispatcher.handleUIAction({
      type: userActionTypes.USER_CHANGE_VIEWED_TYPE,
      userType
    });
  },

  fetchCurrentUserInfo() {
    AppDispatcher.handleViewAction({
      type: userActionTypes.CURRENT_USER_INFO_FETCH
    });

    return uaaApi.fetchUserInfo()
      .then(userInfo => userActions.receivedCurrentUserInfo(userInfo));
  },

  receivedCurrentUserInfo(userInfo) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.CURRENT_USER_INFO_RECEIVED,
      currentUser: userInfo
    });

    return Promise.resolve(userInfo);
  },

  fetchUser(userGuid) {
    if (!userGuid) {
      return Promise.reject(new Error('userGuid is required'));
    }

    AppDispatcher.handleViewAction({
      type: userActionTypes.USER_FETCH,
      userGuid
    });

    return cfApi.fetchUser(userGuid)
      .then(userActions.receivedUser);
  },

  receivedUser(user) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.USER_RECEIVED,
      user
    });

    return Promise.resolve(user);
  },

  fetchUserSpaces(userGuid, options = {}) {
    if (!userGuid) {
      return Promise.reject(new Error('userGuid is required'));
    }

    // orgGuid s optional for filtering
    const { orgGuid } = options;
    AppDispatcher.handleViewAction({
      type: userActionTypes.USER_SPACES_FETCH,
      userGuid,
      orgGuid
    });

    return cfApi.fetchUserSpaces(userGuid, options)
      .then(userSpaces => userActions.receivedUserSpaces(userGuid, userSpaces, options));
  },

  // Optionally specify orgGuid if filtered for spaces belonging to orgGuid
  receivedUserSpaces(userGuid, userSpaces, options = {}) {
    const { orgGuid } = options;
    AppDispatcher.handleServerAction({
      type: userActionTypes.USER_SPACES_RECEIVED,
      userGuid,
      userSpaces,
      orgGuid
    });

    return Promise.resolve(userSpaces);
  },

  fetchUserOrgs(userGuid, options = {}) {
    if (!userGuid) {
      return Promise.reject(new Error('userGuid is required'));
    }

    AppDispatcher.handleViewAction({
      type: userActionTypes.USER_ORGS_FETCH,
      userGuid
    });

    return cfApi.fetchUserOrgs(userGuid, options)
      .then(userOrgs => userActions.receivedUserOrgs(userGuid, userOrgs, options));
  },

  receivedUserOrgs(userGuid, userOrgs) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.USER_ORGS_RECEIVED,
      userGuid,
      userOrgs
    });

    return Promise.resolve(userOrgs);
  },

  // Meta action to fetch all the pieces of the current user
  fetchCurrentUser(options = {}) {
    AppDispatcher.handleViewAction({
      type: userActionTypes.CURRENT_USER_FETCH
    });

    // TODO add error action
    return userActions
      .fetchCurrentUserInfo()
      .then(userInfo =>
        Promise.all([
          userActions.fetchUser(userInfo.user_id),
          userActions.fetchUserOrgs(userInfo.user_id),
          userActions.fetchUserSpaces(userInfo.user_id, options)
        ])
      )
      // Grab user from store with all merged properties
      .then(() => UserStore.currentUser)
      .then(userActions.receivedCurrentUser);
  },

  // Meta action that the current user is completely loaded
  receivedCurrentUser(user) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.CURRENT_USER_RECEIVED,
      user
    });

    return Promise.resolve(user);
  }
};

export default userActions;
