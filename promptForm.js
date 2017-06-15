// Панель обертка для сбора введенных данных
Ext.define('project.view.expertSystem.promptForm', {
    extend: 'Ext.window.Window',
    width: 300,
    autoHeight: true,
    draggable: true,
    closable: true,
    modal: true,
    headerPosition: 'top',
    getFormValues:function (form) {
        return form.getValues();
    },
    initComponent: function () {
        var me = this;
        var items = this.items;
        this.items = [];
        var ok =     Ext.create('Ext.Button', {
            flex: 1,
            margin: '0 10 0 0',
            text: 'OK',
            bubbleEvents: ['closeWindow'],
            handler: function () {
                if (!form.isValid()) return;

                var values = me.getFormValues(form);

                if(me.extraData){
                    values.extraData = me.extraData;
                }

                this.fireEvent('closeWindow', values);
            }
        });
        var cancel = Ext.create('Ext.Button', {
            flex: 1,
            text: 'Отмена',
            bubbleEvents: ['closeWindow'],
            handler: function () {
                this.fireEvent('closeWindow', false);
            }
        });
        var form = Ext.create('Ext.form.Panel', {
            layout:{
                type:'vbox',
                align:'stretch'
            },
            items: items
        });

        this.items.push(form);

        var panel = Ext.create('Ext.Panel', {
            layout:'hbox',
            items:[
                ok,
                cancel
            ]
        });

        this.items.push(panel);

        this.callParent();
    },
    listeners: {
        closeWindow: function (data) {
            var me = this;
            if (data && this.subscribers) {
                this.subscribers.forEach(function (s) {
                    s.fireEvent(me.eventName, data);
                });
            }

            this.close();
        }
    }
});
