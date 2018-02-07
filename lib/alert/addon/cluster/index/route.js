import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { inject as service } from "@ember/service";
import { reads } from '@ember/object/computed'
import { get, set } from '@ember/object';

export default Route.extend({
  scope: service(),
  globalStore: service(),

  model() {
    const gs = get(this, 'globalStore');
    const clusterId = this.modelFor('cluster').get('id');
    const opt = {
      filter: {clusterId},
    };
    const notifiers = gs.findAll('notifier', opt).then(() => {
      return gs.all('notifier');
    });
    const alerts = gs.findAll('clusterAlert', opt).then(() => {
      return gs.all('clusterAlert');
    });
    return hash({
      alerts,
      notifiers,
    });
  },
});
