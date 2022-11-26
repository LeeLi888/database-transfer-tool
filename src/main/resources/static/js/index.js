$(function () {

    const fieldset = {
        sourceSet : 'source-set',
        destinationSet : 'destination-set',
        optionSet : 'option-set',
        tablesSet : 'tables-set',
    };

    const $fieldset = {
        sourceSet : $('#' + fieldset.sourceSet),
        destinationSet : $('#' + fieldset.destinationSet),
        optionSet : $('#' + fieldset.optionSet),
        tablesSet : $('#' + fieldset.tablesSet),
    };

    /**
     * DOM
     */
    //source database dom
    const $sourceSet = {
        dbType              : $('[name="source-db-type"]'),
        dbDriverClassName   : $('[name="source-db-driver-class-name"]'),
        dbUrl               : $('[name="source-db-url"]'),
        dbUsername          : $('[name="source-db-username"]'),
        dbPassword          : $('[name="source-db-password"]'),
        btnConnectionTest   : $('#btn-source-connection-test'),
    };

    //destination database dom
    const $destinationSet = {
        dbType              : $('[name="destination-db-type"]'),
        dbDriverClassName   : $('[name="destination-db-driver-class-name"]'),
        dbUrl               : $('[name="destination-db-url"]'),
        dbUsername          : $('[name="destination-db-username"]'),
        dbPassword          : $('[name="destination-db-password"]'),
        btnConnectionTest   : $('#btn-destination-connection-test'),
    }

    //tables set dom
    const $tablesSet = {
        status              : $('#status-tables-set'),
        table               : $('#table-list'),
        thead               : $('#table-list > thead'),
        tbody               : $('#table-list > tbody'),
        chkTables           : $('#chk-tables'),
        tablesSelectedText  : $('.tables-selected-text'),
        submit              : $('#btnSubmit'),
    }

    //tools for dbt
    const DbtUtil = {
        //get-source-db
        getSourceDb: () => {
            let db = new DatabaseSetting();
            db.type = $sourceSet.dbType.val();
            db.driverClassName = $sourceSet.dbDriverClassName.val();
            db.url = $sourceSet.dbUrl.val();
            db.username = $sourceSet.dbUsername.val();
            db.password = $sourceSet.dbPassword.val();
            return db;
        },

        //get-destination-db
        getDestinationDb: () => {
            let db = new DatabaseSetting();
            db.type = $destinationSet.dbType.val();
            db.driverClassName = $destinationSet.dbDriverClassName.val();
            db.url = $destinationSet.dbUrl.val();
            db.username = $destinationSet.dbUsername.val();
            db.password = $destinationSet.dbPassword.val();
            return db;
        },

        //convert database setting to FormData
        convertDbSettingToFormData: (dbSetting) => {
            let formData = new FormData();
            formData.append('db-driver-class-name', dbSetting.driverClassName);
            formData.append('db-url', dbSetting.url);
            formData.append('db-username', dbSetting.username);
            formData.append('db-password', dbSetting.password);
            return formData;
        },

        //convert database setting to FormData
        appendDbSettingsToFormData: function (formData) {
            let sourceDb = this.getSourceDb();
            let destinationDb = this.getDestinationDb();

            formData.append('source-db-driver-class-name', sourceDb.driverClassName);
            formData.append('source-db-url', sourceDb.url);
            formData.append('source-db-username', sourceDb.username);
            formData.append('source-db-password', sourceDb.password);
            formData.append('destination-db-driver-class-name', destinationDb.driverClassName);
            formData.append('destination-db-url', destinationDb.url);
            formData.append('destination-db-username', destinationDb.username);
            formData.append('destination-db-password', destinationDb.password);
        },

        //database onnection test
        connectionTest: function (formData, option = {}) {
            gloader.show();

            return new Promise((resolve, reject) => {
                axios.post(`${dbt.contextPath}/connection-test`, formData
                ).then(res => {
                    if (option.silent !== true) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Connection test success.',
                            showConfirmButton: false,
                            timer: 2000
                        });
                    }
                    resolve(res);
                }).finally(() => {
                    gloader.hide();
                }).catch(error => {
                    console.log(error);

                    Swal.fire({
                        icon: 'error',
                        title: 'Connection test failed.',
                        text: error.message,
                        showConfirmButton: false,
                        timer: 2000
                    });
                    reject(error);
                });
            });
        },

        //tools for tables-set
        tablesSet : {
            clearTransferStatusClass : function($tr) {
                $tr.removeClass('pending running done');
            },

            setTransferStatusClass : function($tr, status) {
                this.clearTransferStatusClass($tr);
                $tr.addClass(status);
            },

            setTablesSelectedText : function() {
                let selected = $tablesSet.tbody.find('.check-table:checked').length;
                let summary = `${selected} tables selected.`;

                $tablesSet.tablesSelectedText.text(summary);

                this.setTransferStatusClass($tablesSet.tbody.find('.check-table').closest('tr'), 'pending');
                this.clearTransferStatusClass($tablesSet.tbody.find('.check-table:not(:checked)').closest('tr'));

                $tablesSet.submit.prop('disabled', $tablesSet.tbody.find('.check-table:checked').length == 0);
            },
        }
    }

    /**
     * event on change db-type of source
     */
    $sourceSet.dbType.change(function() {
        let type = $(this).val();
        let defaultSetting = DatabaseType.defaultSetting[type];

        if (defaultSetting !== undefined) {
            $(this).parent().find('.driver-class-name-p').text(defaultSetting.driverClassName || '');
            $sourceSet.dbDriverClassName.val(defaultSetting.driverClassName || '');
            $sourceSet.dbUrl.val(defaultSetting.url || '');
            $sourceSet.dbUsername.val(defaultSetting.username || '');
            $sourceSet.dbPassword.val(defaultSetting.password || '');
        }
    });

    /**
     * event on change db-type of source
     */
    $destinationSet.dbType.change(function() {
        let type = $(this).val();
        let defaultSetting = DatabaseType.defaultSetting[type];

        if (defaultSetting !== undefined) {
            $(this).parent().find('.driver-class-name-p').text(defaultSetting.driverClassName || '');
            $destinationSet.dbDriverClassName.val(defaultSetting.driverClassName || '');
            $destinationSet.dbUrl.val(defaultSetting.url || '');
            $destinationSet.dbUsername.val(defaultSetting.username || '');
            $destinationSet.dbPassword.val(defaultSetting.password || '');
        }
    });

    /**
     * source connection test
     */
    $sourceSet.btnConnectionTest.click(function() {
        let sourceDb = DbtUtil.getSourceDb();

        $(this).prepend(`<i class="button-loading fa-solid fa-circle-notch fa-spin"></i>`);
        $(this).attr('disabled', true);

        let formData = DbtUtil.convertDbSettingToFormData(sourceDb);

        DbtUtil.connectionTest(formData)
            .then(res=>{
                //todo
            }).finally(()=>{
                $(this).removeAttr('disabled');
                $(this).find('.button-loading').remove();
        });
    });

    /**
     * destination connection test
     */
    $destinationSet.btnConnectionTest.click(function() {
        let destinationDb = DbtUtil.getDestinationDb();

        $(this).prepend(`<i class="button-loading fa-solid fa-circle-notch fa-spin"></i>`);
        $(this).attr('disabled', true);

        let formData = DbtUtil.convertDbSettingToFormData(destinationDb);

        DbtUtil.connectionTest(formData)
            .then(res=>{
                //todo
            }).finally(()=>{
                $(this).removeAttr('disabled');
                $(this).find('.button-loading').remove();
        });
    });

    /**
     * click checkbox on the thead
     */
    $tablesSet.chkTables.change(function() {
        $tablesSet.tbody.find('.check-table').prop('checked', $(this).is(':checked'));
        DbtUtil.tablesSet.setTablesSelectedText();
    });

    /**
     * click checkbox on the tbody
     */
    $tablesSet.tbody.click(function(e) {
        let $target = $(e.target);

        if ($target.hasClass('check-table')) {
            let $notChecked = $tablesSet.tbody.find('.check-table:not(:checked)');

            $tablesSet.chkTables.prop('checked', $notChecked.length == 0);
            DbtUtil.tablesSet.setTablesSelectedText();
        }
    });

    /**
     * submit
     */
    $tablesSet.submit.click(function() {

        $tablesSet.status.empty();

        let $pendings = $tablesSet.tbody.children('tr.pending');

        //开始传输
        let _transferStart = async ()=> {
            gloader.show();

            $tablesSet.chkTables.prop('disabled', true);
            $tablesSet.tbody.find('.check-table').prop('disabled', true);
            $(this).prop('disabled', true);

            for (let i = 0; i < $pendings.length; i++) {
                let $tr = $pendings.eq(i);

                //control scroll
                $('.table-container')[0].scrollTop = $tr[0].offsetTop - $('.table-container')[0].offsetHeight + 100;
                DbtUtil.tablesSet.setTransferStatusClass($tr, 'running');

                let sourceDb = DbtUtil.getSourceDb();
                let destinationDb = DbtUtil.getDestinationDb();
                let tableName = $tr.data('table-name');

                let formData = new FormData();
                formData.append("tableName", tableName);
                DbtUtil.appendDbSettingsToFormData(formData);

                $tablesSet.status.text(`${tableName}...${i+1}/${$pendings.length}`);

                // let res = await axios.post(`${dbt.contextPath}/table-transfer`, formData);
                // setTransferStatusClass2Tr($tr, 'done');

                await JUnitTestUtil.mockPromise(200);

                DbtUtil.tablesSet.setTransferStatusClass($tr, 'done');
            }
            $tablesSet.status.text('transfer compelete.');

            gloader.hide();
        }

        if ($pendings.length <=0) {
            Swal.fire({
                icon: 'info',
                title: 'No table selected.',
                text: 'Please select at least one table.',
                allowOutsideClick: false,
            });
        } else {
            Swal.fire({
                title: 'Are you sure?',
                text: "Start to transfer table data.",
                icon: 'warning',
                showCancelButton: true,
                allowOutsideClick: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    _transferStart();
                }
            });
        }
    });

    $('.btn.btn-wizard-next').click(function() {
        let fieldsetId = $(this).closest('fieldset').attr('id');

        let wizardNext = ()=>{
            $(this).closest('fieldset').removeClass('active');
            $($(this).data('next-set')).addClass('active');
        };

        if (fieldset.sourceSet === fieldsetId) {
            let sourceDb = DbtUtil.getSourceDb();
            let sourceFormData = DbtUtil.convertDbSettingToFormData(sourceDb);

            DbtUtil.connectionTest(sourceFormData, {silent: true})
            .then(res=>{
                wizardNext();
            });
        } else if (fieldset.optionSet === fieldsetId) {
            let sourceDb = DbtUtil.getSourceDb();
            let destinationDb = DbtUtil.getDestinationDb();
            let sourceFormData = DbtUtil.convertDbSettingToFormData(sourceDb);
            let destinationFormDb = DbtUtil.convertDbSettingToFormData(destinationDb);
            let $thead = $tablesSet.thead;
            let $tbody = $tablesSet.tbody.empty();

            let render = async ()=> {
                let rowNo = 0;
                //source-tables
                await axios.post(`${dbt.contextPath}/get-tables`, sourceFormData)
                    .then(res=> {
                        res.data.forEach(table => {
                            let $tr = $(`
                                <tr data-table-name="${table.tableName.toLowerCase()}">
                                    <td class="row-no">${++rowNo}</td>
                                    <td class="check">
                                        <input class="form-check-input check-table" type="checkbox" value="1">
                                    </td>
                                    <td class="status"><div></div></td>
                                    <td class="meta-table source-table">${table.tableName}</td>
                                    <td class="meta-table destination-table"></td>
                                    <td class="comment"></td>
                                </tr>
                            `);
                            $tbody.append($tr);
                        });
                    });

                //destination-tables
                await axios.post(`${dbt.contextPath}/get-tables`, destinationFormDb)
                    .then(res=> {
                        res.data.forEach(table => {
                            let $tr = $tbody.children(`tr[data-table-name="${table.tableName.toLowerCase()}"]`);

                            if ($tr.length > 0) {
                                $tr.children('td.destination-table').text(table.tableName);
                            } else {
                                let $tr = $(`
                                    <tr data-table-name="${table.tableName.toLowerCase()}">
                                        <td class="row-no">${++rowNo}</td>
                                        <td class="check">
                                        </td>
                                        <td class="status"><div></div></td>
                                        <td class="meta-table source-table"></td>
                                        <td class="meta-table destination-table">${table.tableName}</td>
                                        <td class="comment"></td>
                                    </tr>
                                `);
                                $tbody.append($tr);
                            }
                        });
                    });
            };

            DbtUtil.connectionTest(destinationFormDb, {silent: true})
            .then(res=>{
                wizardNext();

                $tablesSet.chkTables.prop('disabled', false).prop('checked', false);
                $tablesSet.submit.prop('disabled', false);
                $tablesSet.tablesSelectedText.empty();
                $tablesSet.status.empty();

                gloader.show();
                let rowNo = 0;

                $thead.find('th.source').text(sourceDb.type);
                $thead.find('th.destination').text(destinationDb.type);

                try {
                    render();
                    gloader.hide();
                } catch(error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error occurred.',
                        text: error.message,
                        showConfirmButton: false,
                        timer: 2000
                    });
                }
            });
        } else {
            wizardNext();
        }
    });

    $('.btn.btn-wizard-previous').click(function() {
        $(this).closest('fieldset').removeClass('active');
        $($(this).data('previous-set')).addClass('active');
    });


});