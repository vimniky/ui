import EmberObject from '@ember/object';
import Component from '@ember/component';
import { reads, alias } from '@ember/object/computed';
import { get, set } from '@ember/object'
import { next } from '@ember/runloop';
import NewOrEdit from 'ui/mixins/new-or-edit';
import { inject as service } from '@ember/service'

export default Component.extend(NewOrEdit, {
  router: service(),
  intl: service(),
  globalStore: service(),
  pageScope: reads('scope.currentPageScope'),
  project: reads('scope.currentProject'),
  cluster: reads('scope.currentCluster'),
  namespace: reads('projects.namespace'),
  scope: service(),
  model: alias('resourceMap.newAlert'),

  isCreate: function() {
    return !get(this, 'alertId');
  }.property('alertId'),

  showAdvanced: false,
  errors: null,
  pods: null,
  workloads: null,

  setProjectAlert() {
    const model = get(this, 'model');
    const t = model.get('_targetType');
    const clone = model.clone();
    // project _targetType:
    // 1. workload
    // 2. workloadSelector
    // 3. Pod
    if (t === 'workload') {
      const type = clone.get('targetWorkload.workloadType');
      clone.setProperties({
        targetPod: null,
        'targetWorkload.selector': null,
        'targetWorkload.type': type,
      });
    }
    if (t === 'workloadSelector') {
      const type = clone.get('targetWorkload.workloadSelectorType');
      clone.setProperties({
        targetPod: null,
        'targetWorkload.workloadId': null,
        'targetWorkload.type': type,
      });
    }
    if (t === 'pod') {
      clone.setProperties({
        targetWorkload: null,
      });
    }
    set(this, 'primaryResource', clone);
  },

  setClusterAlert() {
    // cluster _targetType:
    // 1. node
    // 2. nodeSelector
    // 3. systemService
    // 4. k8s event
    const model = get(this, 'model');
    const t = model.get('_targetType');
    const clone = model.clone();

    if (t === 'node') {
      clone.setProperties({
        'targetNode.selector': null,
        targetSystemService: null,
        targetEvent: null,
      });
    }

    if (t === 'nodeSelector') {
      clone.setProperties({
        'targetNode.nodeId': null,
        targetSystemService: null,
        targetEvent: null,
      });
    }

    if (t === 'systemService') {
      clone.setProperties({
        targetNode: null,
        targetEvent: null,
      });
    }

    if (t === 'warningEvent' || t === 'normalEvent') {
      clone.setProperties({
        targetNode: null,
        targetSystemService: null,
      });
    }
    set(this, 'primaryResource', clone);
  },

  _save() {
    const ps = get(this, 'pageScope');
    if (ps === 'cluster') {
      return this.setClusterAlert();
    } else {
      return this.setProjectAlert();
    }
  },

  doneSaving() {
    this.send('cancel');
  },

  actions: {
    showAdvanced() {
      this.set('showAdvanced', true);
    },
    save(cb) {
      const ps = get(this, 'pageScope');
      if (ps === 'cluster') {
        this.setClusterAlert();
      } else {
        this.setProjectAlert();
      }
      this._super(cb);
    },
    cancel() {
      const ps = get(this, 'pageScope');
      if (ps === 'project') {
        this.get('router').transitionTo('alert.project');
      }
      // todo
      if (ps === 'cluster') {
        this.get('router').transitionTo('alert.cluster');
      }
    },
  },
});
