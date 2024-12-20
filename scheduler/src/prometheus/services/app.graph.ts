import { logger } from '../../config/logger';
import { PrometheusMapper } from '../mapper';
import { executePrometheusQuery } from '../utils';

export class Graph {
  //istio_requests_total{source_workload="frontend",source_workload_namespace="online-boutique",destination_workload!="unknown"}
  //rps https://stackoverflow.com/questions/60764352/how-to-calculate-requests-per-minute-using-istio-prometheus-metrics

  constructor(private readonly prometheusUrl: string) {
    this.prometheusUrl = prometheusUrl;
  }

  async getDeploymentDownstream(
    deployment: string,
    namespace: string,
    time: string
  ) {
    try {
      const query = `sum(rate(istio_requests_total{source_workload="${deployment}", source_workload_namespace="${namespace}", destination_workload!="unknown", reporter="destination", job="kubernetes-pods"}[${time}])) by (pod, node, destination_workload, destination_service_namespace, destination_service_name, destination_version, source_version, source_workload, source_workload_namespace)`;
      const result = await executePrometheusQuery(this.prometheusUrl, query);

      if (!result || result.data.result.length === 0) {
        logger.warn(`No data returned for query: ${query}`);
        return;
      }

      return PrometheusMapper.toDownstreamDeploymentGraphData(
        result.data.result,
        namespace
      );
    } catch (e: unknown) {
      const error = e as Error;
      logger.error(error);
      return;
    }
  }

  async getDeploymentUpstream(
    deployment: string,
    namespace: string,
    time: string
  ) {
    try {
      const query = `sum(rate(istio_requests_total{source_workload!="unknown",destination_workload="frontend", destination_service_namespace="online-boutique",job="kubernetes-pods"}[1m])) by (pod, node, destination_workload, destination_service_namespace, destination_service_name, destination_version, source_version, source_workload, source_workload_namespace)`;
      const result = await executePrometheusQuery(this.prometheusUrl, query);
    } catch (e: unknown) {
      const error = e as Error;
      logger.error(error);
      return;
    }
  }
}
