Ext.define('project.view.component.picker.address.addressPromptWindow', {
    extend: 'project.view.expertSystem.promptForm',
    title:'Выберите адрес',

    initComponent: function () {
        var addressPicker = Ext.create('project.view.component.picker.address.addressPicker', {
            currentId: this.currentId
        });

        this.items = [
            addressPicker
        ];

        this.callParent();
    },
    getFormValues:function (form) {
        var items = constKIS.utils.getLeafComponents(form);
        var i = items.length-1;
        var combo = items[i];
        while(i>=0 && !combo.lastValue){
            i--;
            combo = items[i];
        }

        if(i<0) return; // значения не выбраны

        var id  = combo.lastValue;
        var data = combo.storeData.filter(function (item) {
            return item.data.id == id;
        });

        if(!data.length) return null;

        data = {fullAddress:data[0].data.fullAddress, id:data[0].data.id};
        return data;
    }
});