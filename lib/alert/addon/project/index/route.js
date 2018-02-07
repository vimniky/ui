import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { inject as service } from "@ember/service";
import { get} from '@ember/object';

export default Route.extend({
  globalStore: service(),

  model() {
    let gs = get(this, 'globalStore');
    const projectId = this.modelFor('project').get('project.id');
    const opt = {
      filter: {
        projectId,
      },
    };
    const notifiers = gs.findAll('notifier', opt).then(() => {
      return gs.all('notifier');
    });
    const alerts = gs.findAll('projectAlert', opt).then(() => {
      return gs.all('projectAlert');
    });
    return hash({
      alerts,
      notifiers,
    });
  },
});
