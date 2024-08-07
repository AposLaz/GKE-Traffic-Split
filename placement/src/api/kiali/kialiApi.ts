import axios from 'axios';
import { GraphData } from './types';
import { setupConfigs } from '../..';
import { logger } from '../../config/logger';

class KialiApi {
  async getGraph(namespace: string) {
    const url = `http://${setupConfigs.kialiHost}/kiali/api/namespaces/graph?edges=noEdgeLabels&graphType=service&unusedNodes=false&operationNodes=false&injectServiceNodes=true&duration=60s&refresh=15000&namespaces=${namespace}&layout=dagre`;

    try {
      const response = await axios.get<GraphData>(url);
      return response.data;
    } catch (e: unknown) {
      const error = e as Error;
      logger.error('axiosErr:', error);
      return undefined;
    }
  }

  async getGraphMetrics(namespace: string) {
    const url = `http://${setupConfigs.kialiHost}/kiali/api/namespaces/graph?graphType=workload&duration=10m&namespaces=${namespace}&layout=dagre`;

    try {
      const response = await axios.get<GraphData>(url);
      return response.data;
    } catch (e: unknown) {
      const error = e as Error;
      logger.error(error);
      return undefined;
    }
  }
}

const kialiApi = new KialiApi();

export default kialiApi;
