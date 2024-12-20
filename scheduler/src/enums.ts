export enum ThresholdValues {}

export enum TaintEffects {
  NO_SCHEDULE = 'NoSchedule',
  NO_EXECUTE = 'NoExecute',
  PREFER_NO_SCHEDULE = 'PreferNoSchedule',
}

export enum Operators {
  EQUAL = 'Equal',
  EXISTS = 'Exists',
}

export enum SetupFolderFiles {
  DEFAULT_PATH = '/tmp/data', // TODO add the app path
  QUEUE_PATH = 'notReadyPods',
  QUEUE_FILE = 'deployQueue.json',
}

export enum SemaphoreConcLimits {
  MAX_CONCURRENCY = 20,
}
