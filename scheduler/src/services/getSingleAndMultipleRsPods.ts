import type { DeploymentPodMapType, PodMetrics } from '../k8s/types';
import type {
  DeploymentsSingleMultipleRsType,
  PodSingleMultipleRs,
} from '../types';

export const singleAndMultipleRsPods = (
  deploymentPods: Record<string, DeploymentPodMapType[]>,
  podMetrics: PodMetrics[]
) => {
  const singleMultipleRsDeploys: DeploymentsSingleMultipleRsType = {
    singleRs: [],
    multipleRs: [],
  };

  // helper to get the multiple replica pods
  const structureMultipleDeplRs: Record<string, PodSingleMultipleRs[]> = {};

  // get the deployments that have one replica from the critical pods
  for (const crit of podMetrics) {
    // find the deployment of the pod
    const matchDeployment = Object.keys(deploymentPods).find((deploy) =>
      crit.podName.startsWith(deploy)
    );
    if (!matchDeployment) {
      continue;
    }

    if (deploymentPods[matchDeployment].length === 1) {
      const node = deploymentPods[matchDeployment][0].node;
      // single replica pod
      singleMultipleRsDeploys.singleRs.push({
        deployment: matchDeployment,
        pods: {
          name: crit.podName,
          node: node,
          usage: crit.usage,
          percentUsage: crit.percentUsage,
          requested: crit.requested,
          limits: crit.limits,
        },
      });
      continue;
    }

    deploymentPods[matchDeployment].forEach((pod) => {
      if (pod.pod === crit.podName) {
        if (!structureMultipleDeplRs[matchDeployment]) {
          structureMultipleDeplRs[matchDeployment] = [];
        }

        structureMultipleDeplRs[matchDeployment].push({
          name: pod.pod,
          node: pod.node,
          usage: crit.usage,
          percentUsage: crit.percentUsage,
          requested: crit.requested,
          limits: crit.limits,
        });
      }
    });
  }

  // for each deployment with multiple replicas
  for (const [deploy, pods] of Object.entries(structureMultipleDeplRs)) {
    singleMultipleRsDeploys.multipleRs.push({
      deployment: deploy,
      pods: pods,
    });
  }

  return singleMultipleRsDeploys;
};
