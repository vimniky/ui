import { get, set } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import notifierMixin from 'alert/mixins/notifier';

export default Component.extend(notifierMixin, {
  intl: service(),
  model: null,
  tagName: 'TR',
  classNames: 'main-row',
  bulkActions: true,

  displayCondition: function() {
    const t = get(this, 'model.targetType');
    if (t === 'systemService') {
      return 'Unhealthy';
    }
    if (t === 'event') {
      return 'Happens';
    }
    if (t === 'node' || t === 'nodeSelector') {
      const c = get(this, 'model.targetNode.condition');
      if (c === 'notready') {
        return 'Not Ready';
      }
      if (c === 'cpu') {
        const n = get(this, 'model.targetNode.cpuThreshold');
        return `CPU usage over ${n}%`
      }
      if (c === 'mem') {
        const n = get(this, 'model.targetNode.memThreshold');
        return `MEM usage over ${n}%`
      }
    }
    return 'n/a';
  }.property('model.targetType', 'model.targetNode.{condition,cpuThreshold,memThreshold}'),

  displayTargetType: function() {
    const t = get(this, 'model.targetType');
    if (t === 'systemService') {
      return 'System Service';
    }
    if (t === 'node') {
      return 'Node';
    }
    if (t === 'nodeSelector') {
      return 'Node Selector';
    }
    if (t === 'event') {
      return 'Event';
    }
    return 'n/a';
  }.property('model.targetType'),

  selectorList: function() {
    const t = get(this, 'model.targetType');
    if (t == 'nodeSelector') {
      const ary = Object
            .entries(get(this, 'model.targetNode.selector'))
            .map(([k, v]) => `${k}=${v}`)
      return ary;
    }
    return [];
  }.property('model.targetType'),

});
