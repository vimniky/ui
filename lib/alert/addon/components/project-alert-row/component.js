import { get, set } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';
import notifierMixin from 'alert/mixins/notifier';


export default Component.extend(notifierMixin, {
  intl: service(),
  model: null,
  tagName: 'TR',
  classNames: 'main-row',
  bulkActions: true,

  displayCondition: function() {
    const t = get(this, 'model.targetType');
    if (t === 'pod') {
      const c = get(this, 'model.targetPod.condition');
      if (c === 'restarts') {
        const times = get(this, 'model.targetPod.restartTimes');
        const interval = get(this, 'model.targetPod.restartIntervalSeconds');
        return `Restarted ${times} times within the last ${interval/60} minutes`;
      }
      if (c === 'notscheduled') {
        return 'Not Scheduled';
      }
      if (c === 'notrunning') {
        return 'Not Running';
      }
      return 'N/A';
    }
    if (t == 'workload' || t === 'workloadSelector') {
      return `${get(this, 'model.targetWorkload.availablePercentage')}% available`;
    }
  }.property('model.targetType', 'model.targetPod.{condition,restartTimes}', 'model.targetWorkload.{availablePercentage}'),

  isRestartCondition: function() {
    const t = get(this, 'model.targetType');
    const c = get(this, 'model.targetPod.condition');
    return t === 'pod' && c === 'restarts';
  }.property('model.targetType', 'model.targetPod.condition'),

  displayTargetType: function() {
    const t = get(this, 'model.targetType');
    if (t === 'pod') {
      return `Pod`;
    }
    if (t === 'workload') {
      return 'Workload';
    }
    if (t === 'workloadSelector') {
      return 'Workload Selector';
    }
  }.property('model.targetType'),


  selectorList: function() {
    const t = get(this, 'model.targetType');
    if (t == 'workloadSelector') {
      const ary = Object
        .entries(get(this, 'model.targetWorkload.selector'))
        .map(([k, v]) => `${k}=${v}`)
      return ary;
    }
    return [];
  }.property('model.targetType'),

});
