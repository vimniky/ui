import { scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import C from 'ui/utils/constants';
import { tagsToArray } from 'ui/models/namespace';

//const NONE = 'none';
//const WORKLOAD = 'workload';
const NAMESPACE = 'namespace';

export default Controller.extend({
  prefs: service(),
  scope: service(),

  init() {
    this._super(...arguments);
  },

  actions: {
    hideWarning() {
      this.set('prefs.projects-warning','hide');
    }
  },

  showWarning: function() {
    return this.get('prefs.projects-warning') !== 'hide';
  }.property('prefs.projects-warning'),

  showClusterWelcome: function() {
    return this.get('scope.currentCluster.state') === 'inactive' && !this.get('nodes.length');
  }.property('scope.currentCluster.state','nodes.[]'),
});
