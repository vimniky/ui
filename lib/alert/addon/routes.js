import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {

  this.route('cluster', {path: '/c/:cluster_id'}, function() {
    this.route('index', {path: '/'});
    this.route('new', {path: '/add'});
  });

  this.route('project', {path: '/p/:project_id'}, function() {
    this.route('index', {path: '/'});
    this.route('new', {path: '/add'});
  });
});
