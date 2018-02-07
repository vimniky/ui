import Route from '@ember/routing/route';
import { hash, resolve } from 'rsvp';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed'

export default Route.extend({
  globalStore: service(),
  scope: service(),
  cluster: reads('scope.currentCluster'),
  alertId: null,

  beforeModel(params){
    const alertId = params.queryParams.alertId;
    if (alertId) {
      set(this, 'alertId', alertId);
    }
  },

  getNewAlert() {
    const gs = get(this, 'globalStore');
    const alertId = get(this, 'alertId');
    const projectId = this.modelFor('project').get('project.id');

    const targetPod = gs.createRecord({type: 'targetPod'});
    const targetWorkload = gs.createRecord({type: 'targetWorkload'});
    const recipients = [
      gs.createRecord({type: 'recipient'}),
    ];

    if (alertId) {
      return gs.find('projectAlert', alertId).then(alert => {
        const t = alert.get('targetType');
        alert.set('_targetType', t);
        if (!alert.get('recipients')) {
          alert.set('recipients', recipients)
        }
        if (t === 'pod') {
          alert.set('targetWorkload', targetWorkload);
        }
        if (t === 'workload' || t === 'workloadSelector') {
          alert.set('targetPod', targetPod);
        }
        return alert;
      });
    }

    const opt = {
      type: 'projectAlert',
      projectId,
      displayName: null,
      initialWaitSeconds: 180,
      repeatIntervalSeconds: 3600,
      targetName: null,

      targetPod,
      targetWorkload,
      recipients,
    };

    const newAlert = gs.createRecord(opt);
    return resolve(newAlert);
  },

  model(params, transition) {
    const store = get(this, 'store');
    const globalStore = get(this, 'globalStore');
    const newAlert = this.getNewAlert();

    const projectId = this.modelFor('project').get('project.id');
    const clusterId = get(this, 'cluster.id');
    const opt = {filter: {projectId}};

    return hash({
      pods: store.find('pod', null),
      statefulsets: store.findAll('statefulset', opt),
      daemonsets: store.findAll('daemonset', opt),
      deployments: store.findAll('deployment', opt),
      notifiers: globalStore.findAll('notifier', {filter: {clusterId}}),
      newAlert,
    });
  },
  resetController: function (controller, isExiting/*, transition*/) {
    if (isExiting) {
      this.set('alertId', null);
      controller.set('alertId', null);
    }
  },
});
