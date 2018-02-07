import Route from '@ember/routing/route';
import { next } from '@ember/runloop';
import { inject as service } from "@ember/service";
import { get, set } from '@ember/object'
import { alias } from '@ember/object/computed';

export default Route.extend({
  globalStore: service(),
  scope: service(),
  pageScope: alias('scope.currentPageScope'),
  cluster: alias('scope.currentCluster'),
  project: alias('scope.currentProject'),

  createLogging(loggingType) {
    const newLogging = get(this, 'globalStore').createRecord({
      type: loggingType,
      outputFlushInterval: 3,
      outputTags: {},
    });
    return newLogging;
  },

  model() {
    const globalStore = this.get('globalStore');
    const pageScope = this.get('pageScope');
    const loggingType = pageScope === 'cluster' ? 'clusterlogging' : 'projectlogging';
    let opt;
    if (pageScope === 'cluster') {
      const cluster = window.l('route:application').modelFor('authenticated.cluster');
      opt = {
        filter: {
          clusterId: cluster.get('id'),
        },
      };
    }
    if (pageScope === 'project') {
      const project = window.l('route:application').modelFor('authenticated.project').get('project');
      opt = {
        filter: {
          projectId: project.get('id'),
        },
      };
    }
    return globalStore.findAll(loggingType, opt).then(loggings => {
      // return a live array so its updated
      let logging = loggings.get('firstObject');
      if (!logging) {
        logging = this.createLogging(loggingType);
      }
      // clone first
      const originalLogging = logging.clone();
      return {
        logging,
        originalLogging,
      };
    });
  },
  setupController(controller, model) {
    this._super(...arguments);
    const t = get(model, 'originalLogging.targetType');
    next(() => {
      controller.set('targetType', t);
    });
  },
});
