import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return {
      license: null,
      username: null,
      password: null,
      serviceType: 'nodePort',
      persistence: false,
    }
  },
});
