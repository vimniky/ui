import { next } from '@ember/runloop';
import EmberObject, { get } from '@ember/object';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { all as PromiseAll } from 'rsvp';
import Preload from 'ui/mixins/preload';

export default Route.extend(Preload,{
  scope: service(),
  globalStore: service(),

  model(params, transition) {
    return get(this, 'globalStore').find('project', params.project_id).then((project) => {
      return get(this,'scope').startSwitchToProject(project).then(() => {
        return this.loadSchemas('store').then(() =>  {
          return PromiseAll([
          ]).then(() => {
            return EmberObject.create({
              project,
            });
          })
        });
      });
    }).catch((err) => {
      return this.loadingError(err, transition);
    });
  },

  setupController(controller, model) {
    this._super(...arguments);
    get(this, 'scope').finishSwitchToProject(get(model,'project'));
  },
});
