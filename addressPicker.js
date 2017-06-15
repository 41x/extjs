/**
 * Created by admin on 04.05.2017.
 */
Ext.define('project.view.component.picker.address.addressPicker', {
    extend: 'Ext.Panel',
    margin:'0 0 20 0',
    initComponent: function () {
        var me = this;
        this.items = this.items || [];
        if (!this.currentId) {
            this.items.push(Ext.create('project.view.component.picker.address.addressCombo', {
                width:'100%'
            }));

            this.callParent();
            return;
        }

        Ext.Ajax.request({
            url: 'api/private/sector/getFullPath',
            method: 'POST',
            jsonData: {value:this.currentId},
            success: function (response) {
                var data = Ext.decode(response.responseText);

                if(!data.length) return;

                for(var i=data.length-1;i>=0;i--){
                    var parentId = i+1==data.length?null:data[i+1].uuidFias;

                    me.add(Ext.create('project.view.component.picker.address.addressCombo', {
                        width:'100%',
                        parentId:parentId,
                        currentId:data[i].uuidFias
                    }));
                }


                me.add(Ext.create('project.view.component.picker.address.addressCombo', {
                    width:'100%',
                    parentId:data[0].uuidFias
                }));
            }
        });

        this.callParent();
    },
    listeners:{
        addressComboValueChange:function (newV) {
            var me = this;
            var i=0;
            while (i<me.items.items.length && me.items.items[i].lastValue!=newV) i++;
            for(var j=me.items.items.length-1;j>i;j--){
                me.remove(me.items.items[j], true);
            }

            me.add(Ext.create('project.view.component.picker.address.addressCombo', {
                width:'100%',
                parentId:newV
            }));
        },
        removeMe:function (combo) {
            var me = this;
            setTimeout(function () {
                me.remove(combo, true);
            });
        }
    }
});