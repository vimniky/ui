import { get } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  modalService: service('modal'),
  globalStore: service(),

  queryParams: ['type'],
  notifiers: alias('model.notifiers'),
  currentType: 'slack',

  actions: {
    showNewEditModal() {
      get(this, 'modalService').toggleModal('notifier/modal-new-edit', {
        closeWithOutsideClick: false,
        controller: this,
        currentType: alias('controller.currentType'),
        mode: 'add',
      });
    },
  },
});
