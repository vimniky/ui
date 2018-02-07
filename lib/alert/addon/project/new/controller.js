import Ember from 'ember'
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed'

export default Ember.Controller.extend({
  queryParams: ['alertId'],
  alertId: null,
  scope: service(),
  pageScope: reads('scope.currentPageScope'),
});
