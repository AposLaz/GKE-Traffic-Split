/* eslint-disable @typescript-eslint/no-unused-vars */
import kubernetesApi from './api/k8s/kubernetesApi';
import { app } from './app';
import { Config } from './config/config';
import { logger } from './config/logger';
import { gkeSetupConfigs } from './config/setup';

import { setUpGraphLinks } from './services/traffic/trafficLocalization';
import { SetupGkeConfigs } from './types';
import { setupWatchers } from './watchers';

const initRestApi = async () => {
  app.listen(Config.APP_PORT, () => {
    logger.info(`LPA api is running in port: ${Config.APP_PORT}`);
  });
};

initRestApi().catch((error: unknown) => {
  const err = error as Error;
  logger.error(`Could not setup api ${err.message}`);
});

setupWatchers().catch((error: unknown) => {
  const err = error as Error;
  logger.error(`Could not setup watchers ${err.message}`);
});

const setTrafficLocalization = async (region: string) => {
  //TODO => for each namespace
  const ns = 'online-boutique';

  const links = await setUpGraphLinks(ns);
  if (!links) {
    logger.error('There is not graph for this namespace');
    return;
  }

  // const trafficAllocPerLink = links.map((clusterPods) =>
  //   trafficAllocation(clusterPods)
  // );
  // logger.info(JSON.stringify(trafficAllocPerLink, null, 2));
  // setupDestinationRulesPerZone(trafficAllocPerLink, ns, region);
};

export let setupConfigs: SetupGkeConfigs;

const initPlacement = async () => {};

const initSetup = async () => {
  try {
    // Retrieve Istio IP asynchronously
    setupConfigs = await gkeSetupConfigs();
    const currentRegion = await kubernetesApi.getClusterRegion();

    if (!currentRegion) return;

    await setTrafficLocalization(currentRegion);
  } catch (error: unknown) {
    logger.error('Error during setup:', error);
  }
};

initSetup();
