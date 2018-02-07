import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';

export default Mixin.create({
  router: service(),
  scope: service(),
  pageScope: reads('scope.currentPageScope'),
  cluster: reads('scope.currentCluster'),
  project: reads('scope.currentProject'),

  relevantState: function() {
    return this.get('combinedState') || this.get('status.state') || 'unknown';
  }.property('combinedState','state'),

  actions: {
    edit() {
      const params = {
        queryParams: {
          alertId: get(this, 'id'),
        },
      };
      const ps = get(this, 'pageScope');
      if (ps === 'cluster') {
        get(this, 'router').transitionTo('alert.cluster.new', params);
      } else if (ps === 'project') {
        get(this, 'router').transitionTo('alert.project.new', params);
      }
    },
    mute() {
      this.doAction('mute');
    },
    unmute() {
      this.doAction('mute');
    },
    activate() {
      this.doAction('activate');
    },
    deactivate() {
      this.doAction('deactivate');
    },
  },

  availableActions: function() {
    // let a = this.get('actionLinks');
    let l = this.get('links');
    const state = this.get('status.state');
    return [
      {
        label: 'action.edit',
        icon: 'icon icon-edit',
        action: 'edit',
        enabled: !!l.update,
      },
      {divider: true },
      {
        label: 'action.mute',
        action: 'mute',
        enabled: state === 'alerting',
        icon: 'icon icon-mute',
        bulkable: true,
      },
      {
        label: 'action.unmute',
        action: 'unmute',
        icon: 'icon icon-unmute',
        enabled: state === 'muted',
        bulkable: true,
      },
      {
        label: 'action.deactivate',
        action: 'deactivate',
        icon: 'icon icon-pause',
        enabled: state === 'active',
        bulkable: true,
      },
      {
        label: 'action.activate',
        icon: 'icon icon-play',
        action: 'activate',
        enabled: state === 'inactive',
        bulkable: true,
      },
      {
        label: 'action.remove',
        icon: 'icon icon-trash',
        action: 'promptDelete',
        enabled: !!l.remove,
        altAction: 'delete',
        bulkable: true,
      },
      {divider: true},
      {
        label: 'action.viewInApi',
        icon: 'icon icon-external-link',
        action: 'goToApi',
        enabled: true
      },
    ];
  }.property('actionLinks.{mute,unmute}','links.{update,remove}'),
});
