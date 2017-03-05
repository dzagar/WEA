import Ember from 'ember';
import XLSX from 'npm:xlsx-browserify-shim';

export default Ember.Component.extend({
  isEditing: false,
  tableHeader: [],
  tableData: null,
  store: Ember.inject.service(),

  rolePermissionModel: Ember.computed('isFeaturesEditing', function () {
    return this.get('store').findAll('rolePermission');
  }),

  MF001IsPermitted: Ember.computed(function () { //Manage Features
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("MF001") >= 0);
    }
  }),

  actions: {
    addNewFeature(){
      this.set('code', "");
      this.set('sysFeature', "");
      this.set('isEditing', true);
    },

    importFromExcel(file) {
      var workbook = XLSX.read(file.data, {type: 'binary'});
      var row = 0;
      var col = null;
      var data = [];
      var header = [];
      var first_sheet_name = workbook.SheetNames[0];

      /* Get worksheet */
      var worksheet = workbook.Sheets[first_sheet_name];
      var size = 0;
      for (var cellName in worksheet) {
        //all keys that do not begin with "!" correspond to cell addresses
        if (cellName[0] === '!') {
          continue;
        }
        row = cellName.slice(1) - 1;
        col = cellName.charCodeAt(0) - 65;
        data[size++] = [];
        if (row === 0) {
          header[col] = worksheet[cellName].v;
        } else {
          data[row][col] = worksheet[cellName].v;
        }
      }
      this.set('tableHeader', header); //just in case I need it
      this.set('tableData', data);

      var myStore = this.get('store');
      let features = myStore.peekAll('rolePermission');
      features.forEach(function (oneFeature) {
          oneFeature.set('roleCode', null);
          oneFeature.save().then(function () {
            oneFeature.destroyRecord();
          });
      });

      data.forEach(function (row) {
        if (row[0]) {
          var newRolePermission = myStore.createRecord('rolePermission', {
            code: row[0],
            sysFeature: row[1]
          });
          newRolePermission.save();
        }
      });
    },

    save(){
      var myStore = this.get('store');
      var newRolePermission = myStore.createRecord('rolePermission', {
        code: this.get('code'),
        sysFeature: this.get('sysFeature')
      });
      newRolePermission.save();
      this.set('isEditing', false);
    },

    deleteOneFeature: function (id) {
      var myStore = this.get('store');
      if (confirm('If this a predefined system feature, then the only way to undo this process is to do a factory reset. \nAre you sure you need to delete this feature?')) {

        myStore.find('rolePermission', id).then(function (feature) {
          feature.set('roleCode', null);
          feature.save().then(function () {
            feature.destroyRecord();
          });
        });

      }
    },

    cancel() {
      this.set('isEditing', false);
    }
  }
});
