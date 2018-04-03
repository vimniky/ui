import { computed, get, set } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from './template';
import VolumeSource from 'shared/mixins/volume-source';

const formats = [
  'json',
  'apache2',
  'nginx',
  'syslog',
  'csv',
  'tsv',
  'ltsv',
].map(value => ({
  value,
  label: value,
}));

export default Component.extend(VolumeSource, {
  layout,
  formats,

  field: 'flexVolume',

  mount: function() {
    return get(this, 'mounts').get('firstObject');
  }.property('mounts.[]'),

  actions: {
    // add() {
    //   if (!get(this, 'customLogPaths')) {
    //     set(this, 'customLogPaths', []);
    //   }
    //   get(this, 'customLogPaths').pushObject({mountPath: '', format: 'json'});
    // },
    remove(obj) {
      this.sendAction('remove', get(this, 'model'));
    },
  }
});
