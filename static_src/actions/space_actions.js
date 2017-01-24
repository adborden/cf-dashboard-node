
/*
 * Actions for space entities. Any actions such as fetching, creating, updating,
 * etc should go here.
 */

import AppDispatcher from '../dispatcher.js';
import cfApi from '../util/cf_api';
import { spaceActionTypes } from '../constants.js';
import SpaceStore from '../stores/space_store';

export default {
  fetch(spaceGuid) {
    AppDispatcher.handleViewAction({
      type: spaceActionTypes.SPACE_FETCH,
      spaceGuid
    });

    // TODO error action should also be specified here
    return cfApi.fetchSpace(spaceGuid).then(this.receivedSpace);
  },

  fetchAll() {
    AppDispatcher.handleViewAction({
      type: spaceActionTypes.SPACES_FETCH
    });

    // TODO error action should also be specified here
    return cfApi.fetchSpaces().then(this.receivedSpaces);
  },

  fetchAllForOrg(orgGuid) {
    AppDispatcher.handleViewAction({
      type: spaceActionTypes.SPACES_FOR_ORG_FETCH,
      orgGuid
    });

    // TODO error action should also be specified here
    return Promise.all(SpaceStore.getAll()
      .filter(space => space.organization_guid === orgGuid)
      .map(space => this.fetch(space.guid))
    );
  },

  receivedSpace(space) {
    AppDispatcher.handleServerAction({
      type: spaceActionTypes.SPACE_RECEIVED,
      space
    });
  },

  receivedSpaces(spaces) {
    AppDispatcher.handleServerAction({
      type: spaceActionTypes.SPACES_RECEIVED,
      spaces
    });
  },

  changeCurrentSpace(spaceGuid) {
    AppDispatcher.handleUIAction({
      type: spaceActionTypes.SPACE_CHANGE_CURRENT,
      spaceGuid
    });
  }
};
