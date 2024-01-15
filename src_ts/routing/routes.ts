import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import {ROOT_PATH} from '../config/config';
import {RouteCallbackParams, RouteDetails} from '@unicef-polymer/etools-types';

const routeParamRegex = '([^\\/?#=+]+)';

EtoolsRouter.init({
  baseUrl: ROOT_PATH,
  redirectPaths: {
    notFound: '/not-found',
    default: '/action-points/list'
  },
  redirectedPathsToSubpageLists: ['action-points']
});

EtoolsRouter.addRoute(new RegExp('^action-points/list$'), (params: RouteCallbackParams): RouteDetails => {
  return {
    routeName: 'action-points',
    subRouteName: 'list',
    path: params.matchDetails[0],
    queryParams: params.queryParams,
    params: null
  };
})
  .addRoute(new RegExp('^action-points/new$'), (params: RouteCallbackParams): RouteDetails => {
    return {
      routeName: 'action-points',
      subRouteName: 'new',
      path: params.matchDetails[0],
      queryParams: params.queryParams,
      params: null
    };
  })
  .addRoute(new RegExp('^action-points/details$'), (params: RouteCallbackParams): RouteDetails => {
    return {
      routeName: 'action-points',
      subRouteName: 'details',
      path: params.matchDetails[0],
      queryParams: params.queryParams,
      params: null
    };
  })
  .addRoute(
    new RegExp(`^action-points\\/${routeParamRegex}\\/${routeParamRegex}$`),
    (params: RouteCallbackParams): RouteDetails => {
      return {
        routeName: 'action-points',
        subRouteName: params.matchDetails[2], // tab name
        path: params.matchDetails[0],
        queryParams: params.queryParams,
        params: {
          actionId: params.matchDetails[1]
        }
      };
    }
  )
  .addRoute(
    new RegExp(`^action-points\\/${routeParamRegex}\\/${routeParamRegex}\\/${routeParamRegex}$`),
    (params: RouteCallbackParams): RouteDetails => {
      return {
        routeName: 'action-points',
        subRouteName: params.matchDetails[2], // tab name
        subSubRouteName: params.matchDetails[3], // sub tab name
        path: params.matchDetails[0],
        queryParams: params.queryParams,
        params: {
          actionId: params.matchDetails[1]
        }
      };
    }
  )
  .addRoute(new RegExp(`^not-found$`), (params: RouteCallbackParams): RouteDetails => {
    return {
      routeName: 'not-found',
      subRouteName: null,
      path: params.matchDetails[0],
      queryParams: null,
      params: null
    };
  });
