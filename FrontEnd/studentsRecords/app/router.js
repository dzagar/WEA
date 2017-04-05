import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('home', {path: '/'});
  //this.route('home', {path: '/*wildcard'});
  this.route('login');
  this.route('admin-portal');
  this.route('error-page', {path: '/*wildcard'});
  this.route('about-us');
  this.route('student-records');
  this.route('system-codes');
  this.route('import-files');

  this.route('adjudication');

  this.route('user');
});

export default Router;
