import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { get, set, computed } from '@ember/object';
import NewOrEdit from 'ui/mixins/new-or-edit';

export default Controller.extend(NewOrEdit, {
  intl: service(),
  more: false,
  errors: null,
  confirmDisable: false,
  enabled: false,
  disabling: false,
  enabling: false,
  passwordAgain: null,

  varlidataNewPassword() {
    const p = get(this, 'model.password') || '';
    const p1 = get(this, 'passwordAgain') || '';
    const errors = get(this, 'errors');

    if (p.trim() !== p1.trim()) {
      errors.push(get(this, 'intl', 'artifactoryPage.password don\'t match'));
    }
  },

  init() {
    this._super(...arguments);
    const requestsCpu = get(this, 'model.requestsCpu') || 1000;
    const limitsCpu = get(this, 'model.limitsCpu');
    set(this, 'requestsCpu', requestsCpu / 1000);
    set(this, 'limitsCpu', limitsCpu / 1000);
  },

  requestsCpuChanged: function() {
    const requestsCpu = get(this, 'requestsCpu');
    set(this, 'model.requestsCpu', requestsCpu * 1000);
  }.observes('requestsCpu'),

  limitsCpuChanged: function() {
    const limitsCpu = get(this, 'limitsCpu');
    set(this, 'model.limitsCpu', limitsCpu * 1000);
  }.observes('limitsCpu'),

  timer: null,
  actions: {
    toggle() {
      set(this, 'more', !get(this, 'more'));
    },
    promptDisable() {
      set(this, 'confirmDisable', true);
      const timer = setTimeout(() => {
        set(this, 'confirmDisable', false);
      }, 5000);
      set(this, 'timer', timer);
    },

    disable() {
      clearTimeout(get(this, 'timer'));
      set(this, 'disabling', true);
      setTimeout(() => {
        set(this, 'confirmDisable', false);
        set(this, 'enabled', false);
        set(this, 'disabling', false);
      }, 3000);
    },

    enable() {
      set(this, 'enabling', true);
      setTimeout(() => {
        set(this, 'enabling', false);
        set(this, 'enabled', true);
      }, 3000);
    },
  },
});
