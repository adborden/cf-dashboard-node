
var anyEvents = require('./fixtures/events');
var appRoutes = require('./fixtures/app_routes.js');
var appSummaries = require('./fixtures/app_summaries');
var appStats = require('./fixtures/app_stats');
var organizations = require('./fixtures/organizations');
var organizationQuotaDefinitions = require('./fixtures/organization_quota_definitions.js');
var organizationUsers = require('./fixtures/organization_users.js');
var organizationUserRoles = require('./fixtures/organization_user_roles.js');
var organizationSummaries = require('./fixtures/organization_summaries');
var organizationMemoryUsage = require('./fixtures/organization_memory_usage');
var services = require('./fixtures/services');
var serviceBindings = require('./fixtures/service_bindings.js');
var serviceInstances = require('./fixtures/service_instances.js');
var servicePlans = require('./fixtures/service_plans.js');
var sharedDomains = require('./fixtures/shared_domains.js');
var spaces = require('./fixtures/spaces');
var spaceRoutes = require('./fixtures/space_routes');
var spaceSummaries = require('./fixtures/space_summaries');
var spaceQuotaDefinitions = require('./fixtures/space_quota_definitions');
var spaceUserRoles = require('./fixtures/space_user_roles.js');
var userOrganizations = require('./fixtures/user_organizations.js');
var userSpaces = require('./fixtures/user_spaces.js');

var BASE_URL = '/v2';

const ENV_NO_ORGS = process.env.NO_ORGS || false;
const ENV_NO_SPACES = process.env.NO_SPACES || false;
const ENV_NO_APPS = process.env.NO_APPS || false;
const ENV_NO_ORG_USERS = process.env.NO_ORG_USERS || false;
const ENV_NO_SPACE_USERS = process.env.NO_SPACE_USERS || false;

function SingleResponse(response) {
  return response;
}

function MultiResponse(responses) {
  return {
    total_results: responses.length,
    total_pages: 1,
    prev_url: null,
    next_url: null,
    resources: responses
  }
}

module.exports = function api(smocks) {

  smocks.route({
    id: 'uaa-userinfo',
    label: 'UAA user info',
    path: '/uaa/userinfo',
    handler: function(req, reply) {
      reply({
        user_id: "bba7537f-601d-48c4-9705-4583ba54ea4b",
        sub: "bba7537f-601d-48c4-9705-4583ba54ea4b",
        user_name: "fake-personb@gsa.gov",
        given_name: "fake-personb",
        family_name: "gsa.gov",
        email: "fake-personb@gsa.gov",
        phone_number: null,
        previous_logon_time: 1489612053883,
        name: "fake-personb@gsa.gov"
      });
    }
  });

  smocks.route({
    id: 'app-routes',
    label: 'App routes',
    path: `${BASE_URL}/apps/{guid}/routes`,
    handler: function (req, reply) {
      const guid = req.params.guid;
      const routes = appRoutes;
      reply(MultiResponse(routes));
    }
  });

  smocks.route({
    id: 'app-summary',
    label: 'App summary',
    path: `${BASE_URL}/apps/{guid}/summary`,
    handler: function (req, reply) {
      const guid = req.params.guid;
      const app = appSummaries.find(function(app) {
        return app.guid === guid;
      });
      reply(SingleResponse(app));
    }
  });

  smocks.route({
    id: 'app-stats',
    label: 'App stats',
    path: `${BASE_URL}/apps/{guid}/stats`,
    handler: function (req, reply) {
      const guid = req.params.guid;
      const appStat = appStats.find(function(app) {
        return app.guid === guid;
      });
      if (guid === '3c37ff32-d954-4f9f-b730-15e22442fd82') {
        reply({ message: 'There is a problem with the server'}).code(503);
      } else {
        reply(SingleResponse(appStat));
      }
    }
  });

  smocks.route({
    id: 'organizations',
    label: 'Organizations',
    path: `${BASE_URL}/organizations`,
    handler: function (req, reply) {
      if (ENV_NO_ORGS) {
        reply(MultiResponse([]));
      } else {
        reply(MultiResponse(organizations));
      }
    }
  });

  smocks.route({
    id: 'organization',
    label: 'Organization',
    path: `${BASE_URL}/organizations/{guid}`,
    handler: function (req, reply) {
      const guid = req.params.guid;
      const org = organizations.find(function(organization) {
        return organization.metadata.guid === guid;
      });
      reply(SingleResponse(org));
    }
  });

  smocks.route({
    id: 'organizations-services',
    label: 'Organizations services',
    path: `${BASE_URL}/organizations/{guid}/services`,
    handler: function (req, reply) {
      reply(MultiResponse(services));
    }
  });

  smocks.route({
    id: 'organizations-summary',
    label: 'Organization Summary',
    path: `${BASE_URL}/organizations/{guid}/summary`,
    handler: function (req, reply) {
      const guid = req.params.guid;
      const organization = organizationSummaries.find(function(organizationSummary) {
        return organizationSummary.guid === guid;
      });
      reply(SingleResponse(organization));
    }
  });

  smocks.route({
    id: 'organization-memory-usage',
    label: 'Organization memory usage',
    path: `${BASE_URL}/organizations/{guid}/memory_usage`,
    handler: function (req, reply) {
      reply(SingleResponse(organizationMemoryUsage));
    }
  });

  smocks.route({
    id: 'organization-quota-definitions',
    label: 'Organization quota definitions',
    path: `${BASE_URL}/quota_definitions/{guid}`,
    handler: function (req, reply) {
      const guid = req.params.guid;
      const quota = organizationQuotaDefinitions.find(function(orgQuota) {
        return orgQuota.metadata.guid === guid;
      });
      reply(SingleResponse(quota));
    }
  });

  smocks.route({
    id: 'organization-users',
    label: 'Organization users',
    path: `${BASE_URL}/organizations/{guid}/users`,
    handler: function (req, reply) {
      if (ENV_NO_ORG_USERS) {
        reply(MultiResponse([organizationUsers[0]]));
      } else {
        reply(MultiResponse(organizationUsers));
      }
    }
  });

  smocks.route({
    id: 'user',
    label: 'User',
    path: `${BASE_URL}/users/{guid}`,
    handler: function (req, reply) {
      const guid = req.params.guid;
      const user = organizationUsers.find((orgUser) =>
        orgUser.metadata.guid === guid);

      reply(SingleResponse(user));
    }
  });

  smocks.route({
    id: 'user-organizations',
    label: 'User organizations',
    path: `${BASE_URL}/users/{guid}/organizations`,
    handler: function(req, reply) {
      reply(MultiResponse(userOrganizations));
    }
  });

  smocks.route({
    id: 'user-spaces',
    label: 'User spaces',
    path: `${BASE_URL}/users/{guid}/spaces`,
    handler: function(req, reply) {
      reply(MultiResponse(userSpaces));
    }
  });

  smocks.route({
    id: 'organization-users-roles',
    label: 'Organization user roles',
    path: `${BASE_URL}/organizations/{guid}/user_roles`,
    handler: function (req, reply) {
      reply(MultiResponse(organizationUserRoles));
    }
  });

  smocks.route({
    id: 'spaces',
    label: 'Spaces',
    path: `${BASE_URL}/spaces`,
    handler: function (req, reply) {
      if (ENV_NO_SPACES) {
        reply(MultiResponse([]));
      } else {
        reply(MultiResponse(spaces));
      }
    }
  });

  smocks.route({
    id: 'space-events',
    label: 'Space events',
    path: `${BASE_URL}/spaces/{guid}/events`,
    handler: function (req, reply) {
      const guid = req.params.guid;
      const spaceEvents = anyEvents.filter(function(event) {
        return event.entity.space_guid === guid;
      });
      reply(MultiResponse(spaceEvents));
    }
  });

  smocks.route({
    id: 'space-service-instances',
    label: 'Space service instsances',
    path: `${BASE_URL}/spaces/{guid}/service_instances`,
    handler: function (req, reply) {
      const guid = req.params.guid;
      const instances = serviceInstances.filter(function(serviceInstance) {
        return serviceInstance.entity.space_guid === guid;
      });
      reply(MultiResponse(instances));
    }
  });

  smocks.route({
    id: 'space-routes',
    label: 'Space routes',
    path: `${BASE_URL}/spaces/{guid}/routes`,
    handler: function (req, reply) {
      const guid = req.params.guid;
      const routes = spaceRoutes.filter(function(spaceRoute) {
        return spaceRoute.entity.space_guid === guid;
      });
      reply(MultiResponse(routes));
    }
  });

  smocks.route({
    id: 'space-summary',
    label: 'Space summary',
    path: `${BASE_URL}/spaces/{guid}/summary`,
    handler: function (req, reply) {
      const guid = req.params.guid;
      const space = spaceSummaries.find(function(spaceSummary) {
        return spaceSummary.guid === guid;
      });
      if (ENV_NO_APPS) {
        space.apps = [];
      }
      reply(SingleResponse(space));
    }
  });

  smocks.route({
    id: 'space-quota-definitions',
    label: 'Space quota definitions',
    path: `${BASE_URL}/space_quota_definitions`,
    handler: function (req, reply) {
      reply(MultiResponse(spaceQuotaDefinitions));
    }
  });

  smocks.route({
    id: 'space-user-roles',
    label: 'Space user roles',
    path: `${BASE_URL}/spaces/{guid}/user_roles`,
    handler: function (req, reply) {
      if (ENV_NO_SPACE_USERS) {
        reply(MultiResponse([spaceUserRoles[0]]));
      } else {
        reply(MultiResponse(spaceUserRoles));
      }
    }
  });

  smocks.route({
    id: 'service-bindings',
    label: 'Service bindings',
    path: `${BASE_URL}/service_bindings`,
    handler: function (req, reply) {
      reply(MultiResponse(serviceBindings));
    }
  });

  smocks.route({
    id: 'service-plans',
    label: 'Service plans',
    path: `${BASE_URL}/service_plans/{guid}`,
    handler: function (req, reply) {
      const guid = req.params.guid;
      const plan = servicePlans.find(function(servicePlan) {
        return servicePlan.metadata.guid === guid;
      });
      reply(MultiResponse(plan));
    }
  });

  smocks.route({
    id: 'service-service-plans',
    label: 'Service service plans',
    path: `${BASE_URL}/services/{guid}/service_plans`,
    handler: function (req, reply) {
      const serviceGuid = req.params.guid;
      const plans = servicePlans.filter(function(servicePlan) {
        return servicePlan.entity.service_guid === serviceGuid;
      });
      reply(MultiResponse(plans));
    }
  });

  smocks.route({
    id: 'quota-definitions',
    label: 'Quota definitions',
    path: `${BASE_URL}/quota_definitions`,
    handler: function (req, reply) {
      // TODO should be renamed just quotaDefinitions?
      reply(MultiResponse(organizationQuotaDefinitions));
    }
  });

  smocks.route({
    id: 'shared-domains',
    label: 'Shared domains',
    path: `${BASE_URL}/shared_domains/{guid}`,
    handler: function (req, reply) {
      const guid = req.params.guid;
      const domain = sharedDomains.find(function(sharedDomain) {
        return sharedDomain.metadata.guid === guid;
      });
      reply(SingleResponse(domain));
    }
  });
};
