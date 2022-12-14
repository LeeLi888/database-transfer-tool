$(function () {

    const DatabaseInfo = {
        source : {},
        destination: {},

        isSameDatabase : function() {
            for (var key in this.source) {
                //如果是数组，只要判断数组长度就可以，里面的内容不做判断
                if (Array.isArray(this.source[key])){
                    if (this.source[key].length != this.destination[key].length) {
                        return false;
                    }
                } else if (this.source[key] !== this.destination[key]) {
                    return false;
                }
            }
            return true;
        }
    };

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

    //option set dom
    const $optionSet = {
        ulDsQuickInfo         : $('.ds-quick-info'),
        tableNamePattern    : $('#txtTableNamePattern'),
    }

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
                            title: 'Test connection succeeded.',
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
                        title: 'Test connection failed.',
                        text: dbt.getErrorMessage(error),
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

        //checkbox click
        if ($target.hasClass('check-table')) {
            let $notChecked = $tablesSet.tbody.find('.check-table:not(:checked)');

            $tablesSet.chkTables.prop('checked', $notChecked.length == 0);
            DbtUtil.tablesSet.setTablesSelectedText();

        //table-name click
        } else if ($target.hasClass('table-name')) {
            let $tr = $target.closest('tr');
            let tableName = $target.text();
            let tableNameSource = $tr.find('td.source-table > .table-name').text();
            let tableNameDestination = $tr.find('td.destination-table > .table-name').text();

            let renderColumns$Content = async ()=>{
                let dbSettingSource = DbtUtil.getSourceDb();
                let dbSettingDestination = DbtUtil.getDestinationDb();
                let formDataSource = DbtUtil.convertDbSettingToFormData(dbSettingSource);
                let formDataDestination = DbtUtil.convertDbSettingToFormData(dbSettingDestination);

                formDataSource.append("tableName", tableNameSource);
                formDataDestination.append("tableName", tableNameDestination);

                let $content = $(`
                    <div class="modal-table-colums-container">
                        <table class="table table-columns">
                            <thead>
                                <th>#</th>
                                <th>Source: ${DatabaseInfo.source.productName}</th>
                                <th>Destination: ${DatabaseInfo.destination.productName}</th>
                                <th>Type</th>
                                <th>Length</th>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                `);
                let $tbody = $content.find('tbody');

                let rowNo = 0;
                if (tableNameSource !== "") {
                    await axios.post(`${dbt.contextPath}/get-table`, formDataSource)
                        .then(res => {
                            let columns = res.data.columns;

                            columns.forEach(column => {
                                $tbody.append(`
                                    <tr data-column-name="${column.name}" class="column-not-matched">
                                        <td>${++rowNo}</td>
                                        <td class="source-column column-name ${column.pk === true?'column-pk':''}">${column.name}</td>
                                        <td class="destination-column column-name"></td>
                                        <td class="column-type" data-column-type="${column.type}" data-column-type-name="${column.typeName}">${column.typeName}</td>
                                        <td class="column-size" data-column-size="${column.size}">${column.size}</td>
                                    </tr>
                                `);
                            });
                        });
                }

                if (tableNameDestination !== "") {
                    await axios.post(`${dbt.contextPath}/get-table`, formDataDestination)
                        .then(res => {
                            let columns = res.data.columns;

                            columns.forEach(column => {
                                let $tr = $tbody.children(`tr[data-column-name="${column.name}"]`);

                                if ($tr.length > 0) {
                                    $tr.removeClass('column-not-matched');
                                    $tr.children('td.destination-column').text(column.name);

                                    if (column.pk === true) {
                                        $tr.children('td.destination-column').addClass('column-pk');
                                    }

                                    if (column.type != $tr.find('.column-type').data('column-type')) {
                                        $tr.find('.column-type').addClass('column-type-not-match')
                                            .text($tr.find('.column-type').data('column-type-name') + ' / ' + column.typeName);
                                    }
                                    if (column.size != $tr.find('.column-size').data('column-size')) {
                                        $tr.find('.column-size').addClass('column-size-not-match')
                                            .text($tr.find('.column-size').data('column-size') + ' / ' + column.size);
                                    }
                                } else {
                                    $tbody.append(`
                                        <tr data-column-name="${column.name}" class="column-not-matched">
                                            <td>${++rowNo}</td>
                                            <td class="source-column column-name"></td>
                                            <td class="destination-column column-name ${column.pk === true?'column-pk':''}">${column.name}</td>
                                            <td class="column-type" data-column-type="${column.type}" data-column-type-name="${column.typeName}">${column.typeName}</td>
                                            <td class="column-size" data-column-size="${column.size}">${column.size}</td>
                                        </tr>
                                    `);
                                }
                            });
                        });
                }
                return $content;
            };

            gloader.show();
            renderColumns$Content()
                .then(res=> {
                    let modal = new Modaler({
                        size: 'modal-xl',
                        title: tableName,
                        $content: res,
                    });
                    modal.show();
                }).finally(()=>{
                    gloader.hide();
            });
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

                //await JUnitTestUtil.mockPromise(200);
                await axios.post(`${dbt.contextPath}/table-transfer`, formData)
                    .then(res=>{
                        let $comment = $tr.find('.comment').empty();

                        if (res.data.size == 0) {
                            $comment.addClass('transfer-no-data').append(`No data transfered.`);
                        } else {
                            $comment.addClass('transfer-success')
                                .append(`<a href="#;" class="text-decoration-none">${numeral(res.data.size).format('0,0')} entries transfered.</a>`);

                            let $content  = $(`
                                <table class="table table-bordered table-sm fs-12px">
                                    <thead><tr></tr></thead>
                                    <tbody></tbody>
                                </table>                                   
                            `);
                            let $theadTr = $content.find('thead > tr');
                            let $tbody = $content.find('tbody');

                            var firstData = res.data.lastDatas[0];
                            var keys = [];
                            for (var key in firstData) {
                                $theadTr.append(`<th>${key}</th>`);
                                keys.push(key);
                            }

                            res.data.lastDatas.forEach(data=>{
                                let $tr = $(`<tr></tr>`);
                                keys.forEach(key=>{
                                    $tr.append(`<td>${data[key]}</td>`);
                                });
                                $tbody.append($tr);
                            });

                            $comment.find('a').click(function() {
                                let modal = new Modaler({
                                    size: 'modal-fullscreen',
                                    title: `${res.data.lastDatas.length} / ${numeral(res.data.size).format('0,0')}`,
                                    $content: $content,
                                });
                                modal.show();
                            });
                        }
                        DbtUtil.tablesSet.setTransferStatusClass($tr, 'success')
                    }).catch(error=>{
                        let $comment = $tr.find('.comment').empty();
                        $comment.addClass('transfer-error')
                            .append(`<a href="#;" class="text-decoration-none">${dbt.getErrorMessage(error)}</a>`);

                        $comment.find('a').click(function() {
                            let modal = new Modaler({
                                size: 'modal-xl',
                                title: dbt.getErrorMessage(error),
                                $content: $(`<pre class="text-danger">${error.response.data.trace}</pre>`),
                            });
                            modal.show();
                        });

                        DbtUtil.tablesSet.setTransferStatusClass($tr, 'error')
                    });

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

    $('.btn-wizard-next').click(function() {
        let fieldsetId = $(this).closest('fieldset').attr('id');

        let wizardNext = ()=>{
            $(this).closest('fieldset').removeClass('active');
            $($(this).data('next-set')).addClass('active');
        };

        if (fieldset.sourceSet === fieldsetId) {
            let db = DbtUtil.getSourceDb();
            let formData = DbtUtil.convertDbSettingToFormData(db);

            DbtUtil.connectionTest(formData, {silent: true})
            .then(res=>{
                wizardNext();
            });
        } else if (fieldset.destinationSet === fieldsetId) {
            let sourceDb = DbtUtil.getSourceDb();
            let destinationDb = DbtUtil.getDestinationDb();
            let sourceFormData = DbtUtil.convertDbSettingToFormData(sourceDb);
            let destinationFormDb = DbtUtil.convertDbSettingToFormData(destinationDb);

            let renderDatasourceInfo = ($li, ds)=>{
                $li.find('.card').addClass('shadow-lg');
                $li.find('.card-header').removeClass('w-100 placeholder');
                $li.find('.card-header > span').text(ds.productName);
                $li.find('.card-header > .version').text(ds.productVersion);
                $li.find('.db-name').removeClass('w-100 placeholder').text(ds.catalog);
                $li.find('.db-length').removeClass('w-100 placeholder');

                if ($li.index() == 0 && ds.length && ds.length >= 0) {
                    $li.find('.db-length').text(`${numeral(ds.length).format('0,0')} Entries / ${numeral(ds.tables.length).format('0,0')} Tables`);
                } else {
                    $li.find('.db-length').text(`${numeral(ds.tables.length).format('0,0')} Tables`);
                }

                $li.find('.card-header > span').prepend(`<img class="db-logo" src="/img/${ds.type}-white2.svg" />`);
            };

            let renderPlaceholder = ()=> {
                $optionSet.ulDsQuickInfo.empty();

                for (var i=0; i<2; i++ ) {
                    $optionSet.ulDsQuickInfo.append(`
                        <li>
                            <div class="card">
                                <div class="card-header w-100 placeholder">
                                    <span>&nbsp;</span>
                                    <p class="version">&nbsp;</p>
                                </div>
                                <div class="card-body">
                                    <div class="db-name placeholder w-100">
                                        &nbsp;
                                    </div>
                                    <div class="db-length placeholder w-100">
                                        &nbsp;
                                    </div>
                                </div>
                            </div>
                        </li>
                    `);
                }
            };

            let render = async()=>{
                await DbtUtil.connectionTest(destinationFormDb, {silent: true})
                    .then(res=>{
                        wizardNext();
                    });

                gloader.show();
                renderPlaceholder();

                $optionSet.ulDsQuickInfo.closest('fieldset').find('.alert').remove();

                //source-tables
                await axios.post(`${dbt.contextPath}/get-database-info`, sourceFormData)
                    .then(res=> {
                        DatabaseInfo.source = res.data || {};
                        DatabaseInfo.source.type = sourceDb.type;
                        renderDatasourceInfo($optionSet.ulDsQuickInfo.children('li:nth-child(1)'), DatabaseInfo.source);
                    });

                //destination-tables
                let destinationDatabaseInfo = {};
                await axios.post(`${dbt.contextPath}/get-database-info`, destinationFormDb)
                    .then(res=> {
                        DatabaseInfo.destination = res.data || {};
                        DatabaseInfo.destination.type = destinationDb.type;
                        renderDatasourceInfo($optionSet.ulDsQuickInfo.children('li:nth-child(2)'), DatabaseInfo.destination);
                    });

                //判断两边是否为同一个数据库
                if (DatabaseInfo.isSameDatabase()) {
                    $optionSet.ulDsQuickInfo.before(`
                        <div class="mb-4 alert alert-warning animate__animated animate__fadeIn" role="alert">
                            <i class="fa-solid fa-triangle-exclamation"></i>
                            Both sides seem to be set to the same database.
                        </div>
                    `);
                }

                gloader.hide();
            };

            render();

        } else if (fieldset.optionSet === fieldsetId) {
            wizardNext();

            let sourceDb = DbtUtil.getSourceDb();
            let destinationDb = DbtUtil.getDestinationDb();
            let sourceFormData = DbtUtil.convertDbSettingToFormData(sourceDb);
            let destinationFormDb = DbtUtil.convertDbSettingToFormData(destinationDb);
            let $thead = $tablesSet.thead;
            let $tbody = $tablesSet.tbody.empty();

            sourceFormData.append("tableNamePattern", $optionSet.tableNamePattern.val());
            sourceFormData.append("withTableLength", true);
            destinationFormDb.append("tableNamePattern", $optionSet.tableNamePattern.val());

            let render = async ()=> {
                let rowNo = 0;
                //source-tables
                await axios.post(`${dbt.contextPath}/get-tables`, sourceFormData)
                    .then(res=> {
                        res.data.forEach(table => {
                            let $tr = $(`
                                <tr data-table-name="${table.tableName.toLowerCase()}">
                                    <td class="row-no">${++rowNo}</td>
                                    <td class="check"></td>
                                    <td class="status"><div></div></td>
                                    <td class="table-length ${table.length==0?'table-empty':''}">${table.length>0?numeral(table.length).format('0,0'):'Empty'}</td>
                                    <td class="meta-table source-table"><a class="table-name" href="#;">${table.tableName}</a></td>
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
                                $tr.children('td.destination-table').html(`<a class="table-name" href="#;">${table.tableName}</a>`);
                                $tr.find('td.check').append(`<input class="form-check-input check-table" type="checkbox" value="1">`);
                            } else {
                                let $tr = $(`
                                    <tr data-table-name="${table.tableName.toLowerCase()}">
                                        <td class="row-no">${++rowNo}</td>
                                        <td class="check"></td>
                                        <td class="status"><div></div></td>
                                        <td class="table-length"></td>
                                        <td class="meta-table source-table"></td>
                                        <td class="meta-table destination-table"><a class="table-name" href="#;">${table.tableName}</a></td>
                                        <td class="comment"></td>
                                    </tr>
                                `);
                                $tbody.append($tr);
                            }
                        });
                    });
            };

            $tablesSet.chkTables.prop('disabled', false).prop('checked', false);
            $tablesSet.submit.prop('disabled', true);
            $tablesSet.tablesSelectedText.empty();
            $tablesSet.status.empty();

            $thead.find('th.source').text(`Source: ${DatabaseInfo.source.productName}`);
            $thead.find('th.destination').text(`Destination: ${DatabaseInfo.destination.productName}`);

            gloader.show();
            render()
                .then(res=>{
                    //Nothing to do
                }).finally(()=>{
                    gloader.hide();
                }).catch(error=>{
                    Swal.fire({
                        icon: 'error',
                        title: 'Error occurred.',
                        text: dbt.getErrorMessage(error),
                    });
                });

        } else {
            wizardNext();
        }
    });

    $('.btn-wizard-previous').click(function() {
        $(this).closest('fieldset').removeClass('active');
        $($(this).data('previous-set')).addClass('active');
    });


});