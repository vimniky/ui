import { computed, get, set } from '@ember/object';
import { inject as service } from '@ember/service';

import Component from '@ember/component';

export default Component.extend({
  disableRemove: false,

  selectedNotifier: function() {
    return get(this, 'notifiers')
      .filterBy('id', get(this, 'model.notifierId'))
      .get('firstObject');
  }.property('model.notifierId', 'notifiers.[]'),

  setRecipient: function() {
    const v = get(this, 'selectedNotifier.notifierValue');
    const t = get(this, 'selectedNotifier.notifierType');
    set(this, 'model.recipient', v);
    set(this, 'model.notifierType', t);
    console.log(get(this, 'model'));
  }.observes('selectedNotifier.{notifierValue,notifierType}'),

  actions: {
    remove() {
      if (!get(this, 'disableRemove')) {
        this.sendAction('remove', get(this, 'model'));
      }
    },
  },
});
