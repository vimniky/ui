import Route from '@ember/routing/route';
import { hash, resolve } from 'rsvp';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed'

export default Route.extend({
  globalStore: service(),

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
    const clusterId = this.modelFor('cluster').get('id');

    const targetNode = gs.createRecord({type: 'targetNode'});
    const targetSystemService = gs.createRecord({type: 'targetSystemService'});
    const targetEvent = gs.createRecord({type: 'targetEvent'});

    const recipients = [
      gs.createRecord({type: 'recipient'}),
    ];

    if (alertId) {
      return gs.find('clusterAlert', alertId).then(alert => {
        const t = alert.get('targetType');
        if (t === 'event') {
          const et = alert.get('targetEvent.type');
          if (et === 'Normal') {
            alert.set('_targetType', 'normalEvent');
          }
          if (et === 'Warning') {
            alert.set('_targetType', 'warningEvent');
          }
        } else {
          alert.set('_targetType', t);
        }
        if (!alert.get('recipients')) {
          alert.set('recipients', recipients);
        }
        if (t === 'node' || t === 'nodeSelector') {
          alert.setProperties({
            targetEvent,
            targetSystemService,
          });
        }
        if (t === 'systemService') {
          alert.setProperties({
            targetNode,
            targetEvent,
          });
        }
        if (t === 'event') {
          alert.setProperties({
            targetNode,
            targetSystemService,
          });
        }
        return alert;
      });
    }
    const opt = {
      type: 'clusterAlert',
      clusterId,

      targetNode,
      targetEvent,
      targetSystemService,
      recipients,
    };
    const newAlert = gs.createRecord(opt);
    return resolve(newAlert);
  },

  model(params, transition) {
    const store = get(this, 'store');
    const globalStore = get(this, 'globalStore');
    const newAlert = this.getNewAlert();
    const clusterId = this.modelFor('cluster').get('id');

    const opt = {filter: {clusterId}};
    return hash({
      nodes: globalStore.findAll('machine', opt),
      notifiers: globalStore.findAll('notifier'),
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
