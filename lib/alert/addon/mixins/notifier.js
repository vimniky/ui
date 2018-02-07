import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default Mixin.create({
  getNotifierById(id) {
    if (!id) {
      return null;
    }
    const notifiers = get(this, 'notifiers');
    return notifiers.filterBy('id', id).get('firstObject');
  },

  firstRecipientOfNotifier: function() {
    const recipient = get(this, 'model.recipients').get('firstObject');
    const notifiers = get(this, 'notifiers');
    if (recipient && get(recipient, 'notifierId')) {
      const notifierId = get(recipient, 'notifierId');
      return this.getNotifierById(notifierId)
    }
    return null;
  }.property('model.recipients.length', 'notifiers.@each.{id,displayName}'),

  recipientsTip: function() {
    const notifiers = get(this, 'notifiers');
    const recipients = get(this, 'model.recipients') || [];
    const out = recipients.map(recipient => {
      const notifierId = get(recipient, 'notifierId');
      const notifier = this.getNotifierById(notifierId);
      if (notifier) {
        return notifier.get('displayName');
      }
      return '';
    }).filter(str => !!str).join('<br/>');

    return htmlSafe(out);
  }.property('notifiers.@each.{id,displayName}', 'model.recipients.@each.{length,notifierType,recipient,notifierId}'),
});
