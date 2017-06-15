Ext.define('project.view.component.picker.address.addressCombo', {
    extend: 'Ext.form.field.ComboBox',
    multiSelect: false,
    minWidth: 150,
    trackChange:false,
    hidden:true,
    editable: false,
    queryMode: 'local',
    valueField: 'id',
    displayField: 'name',
    forceSelection: true,
    bubbleEvents:['addressComboValueChange', 'removeMe'],
    initComponent: function () {
        var me = this;
        this.store = Ext.create('Ext.data.Store', {
            fields: [
                {name: 'curId', type: 'string', mapping: 'id'},
                {name: 'id', type: 'string', mapping: 'id'},
                {name: 'name', type: 'string', mapping: 'name'}
            ],
            proxy: {
                type: 'ajax',
                actionMethods: {
                    read: 'POST'
                },
                url: 'api/private/sector/getBranchToUUID',
                reader: {
                    type: 'json',
                    root: 'root'
                },
                paramsAsJson: true,
                extraParams: {value: this.parentId || null},
                pageParam: false, //to remove param "page"
                startParam: false, //to remove param "start"
                limitParam: false //to remove param "limit"

            },
            autoLoad:true,

            listeners: {
                load: function (a, data) {
                    if(!me.currentId){
                        me.trackChange = true;
                    }

                    if (!data.length) {
                        me.fireEvent('removeMe', me);
                        return;
                    }

                    me.storeData = data;

                    var types = data.map(function (item) {
                        return item.data.fullType;
                    });

                    var fullType = types[0];

                    types = types.filter(function (type) {
                        return type != fullType;
                    });

                    var val = (!types.length && !fullType) ? 'Страна' : fullType;
                    me.setFieldLabel(val.charAt(0).toUpperCase()+val.slice(1));
                    me.show();
                    me.fireEvent('storeLoaded');
                }
            }
        });

        this.callParent();
    },

    listeners:{
        storeLoaded:function () {
            if(!this.currentId) return;
            this.setValue(this.currentId);
        },
        change:function (a,newV) {
            var rec = this.getStore().data.items.filter(function (item) {
                return item.data.id == newV;
            });
            var val = rec[0].data.fullType ? rec[0].data.fullType : 'Страна';
            this.setFieldLabel(val.charAt(0).toUpperCase() + val.slice(1));

            if(!this.trackChange) {
                this.trackChange = true;
                return;
            }

            this.fireEvent('addressComboValueChange', newV);
            if(this.subscribers && this.subscribers.length){
                this.subscribers.forEach(function (s) {
                    s.fireEvent('addressComboValueChange', newV);
                });
            }
        }
    }
});