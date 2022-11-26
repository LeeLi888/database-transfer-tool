$(function () {

    //source
    let $sourceDbType = $('[name="source-db-type"]');
    let $sourceDbDriverClassName = $('[name="source-db-driver-class-name"]');
    let $sourceDbUrl = $('[name="source-db-url"]');
    let $sourceDbUsername = $('[name="source-db-username"]');
    let $sourceDbPassword = $('[name="source-db-password"]');
    let $btnSourceConnectionTest = $('#btn-source-connection-test');

    let $destinationDbType = $('[name="destination-db-type"]');
    let $destinationDbDriverClassName = $('[name="destination-db-driver-class-name"]');
    let $destinationDbUrl = $('[name="destination-db-url"]');
    let $destinationDbUsername = $('[name="destination-db-username"]');
    let $destinationDbPassword = $('[name="destination-db-password"]');
    let $btnDestinationConnectionTest = $('#btn-destination-connection-test');

    let $statusTablesSet = $('#status-tables-set');

    //destination
    let $destinationSet = $('#destination-set');

    let getSourceDb = ()=> {
        let db = new DatabaseSetting();
        db.type = $sourceDbType.val();
        db.driverClassName = $sourceDbDriverClassName.val();
        db.url = $sourceDbUrl.val();
        db.username = $sourceDbUsername.val();
        db.password = $sourceDbPassword.val();

        return db;
    }

    let getDestinationDb = ()=> {
        let db = new DatabaseSetting();
        db.type = $destinationDbType.val();
        db.driverClassName = $destinationDbDriverClassName.val();
        db.url = $destinationDbUrl.val();
        db.username = $destinationDbUsername.val();
        db.password = $destinationDbPassword.val();

        return db;
    }

    $sourceDbType.change(function() {
        let type = $(this).val();
        let defaultSetting = DatabaseType.defaultSetting[type];

        if (defaultSetting !== undefined) {
            $(this).parent().find('.driver-class-name-p').text(defaultSetting.driverClassName || '');
            $sourceDbDriverClassName.val(defaultSetting.driverClassName || '');
            $sourceDbUrl.val(defaultSetting.url || '');
            $sourceDbUsername.val(defaultSetting.username || '');
            $sourceDbPassword.val(defaultSetting.password || '');
        }
    });

    $destinationDbType.change(function() {
        let type = $(this).val();
        let defaultSetting = DatabaseType.defaultSetting[type];

        if (defaultSetting !== undefined) {
            $(this).parent().find('.driver-class-name-p').text(defaultSetting.driverClassName || '');
            $destinationDbDriverClassName.val(defaultSetting.driverClassName || '');
            $destinationDbUrl.val(defaultSetting.url || '');
            $destinationDbUsername.val(defaultSetting.username || '');
            $destinationDbPassword.val(defaultSetting.password || '');
        }
    });

    //connection-test
    let connectionTest = (formData, option={})=>{
        gloader.show();

        return new Promise((resolve, reject)=>{
            axios.post(`${dbt.contextPath}/connection-test`, formData
            ).then(res=>{
                if (option.silent !== true) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Connection test success.',
                        showConfirmButton: false,
                        timer: 2000
                    });
                }

                resolve(res);
            }).finally(()=>{
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
    };

    let convertDbSettingToFormData = (dbSetting)=>{
        let formData = new FormData();
        formData.append('db-driver-class-name', dbSetting.driverClassName);
        formData.append('db-url', dbSetting.url);
        formData.append('db-username', dbSetting.username);
        formData.append('db-password', dbSetting.password);

        return formData;
    }

    $btnSourceConnectionTest.click(function() {
        let sourceDb = getSourceDb();

        $(this).prepend(`<i class="button-loading fa-solid fa-circle-notch fa-spin"></i>`);
        $(this).attr('disabled', true);

        let formData = convertDbSettingToFormData(sourceDb);

        connectionTest(formData)
            .then(res=>{
                //todo
            }).finally(()=>{
                $(this).removeAttr('disabled');
                $(this).find('.button-loading').remove();
        });
    });

    $btnDestinationConnectionTest.click(function() {
        let destinationDb = getDestinationDb();

        $(this).prepend(`<i class="button-loading fa-solid fa-circle-notch fa-spin"></i>`);
        $(this).attr('disabled', true);

        let formData = convertDbSettingToFormData(destinationDb);

        connectionTest(formData)
            .then(res=>{
                //todo
            }).finally(()=>{
                $(this).removeAttr('disabled');
                $(this).find('.button-loading').remove();
        });
    });

    let actionSummary = ()=>{
        let selected = $('#table-list > tbody .check-table:checked').length;
        let summary = `${selected} tables selected.`;

        $('.transfer-summary').text(summary);
        setTransferStatusClass2Tr($('#table-list > tbody .check-table').closest('tr'), 'pending');
        clearTransferStatusClass2Tr($('#table-list > tbody .check-table:not(:checked)').closest('tr'));

        $('#btnSubmit').attr('disabled', $('#table-list > tbody .check-table:checked').length == 0);
    };

    $('#chk-tables').change(function() {
        $('#table-list > tbody .check-table').prop('checked', $(this).is(':checked'));

        actionSummary();
    });

    $('#table-list > tbody').click(function(e) {
        let $target = $(e.target);

        if ($target.hasClass('check-table')) {
            let $notChecked = $('#table-list > tbody .check-table:not(:checked)');

            $('#chk-tables').prop('checked', $notChecked.length == 0);
            actionSummary();
        }
    });

    let clearTransferStatusClass2Tr = ($tr)=>{
        $tr.removeClass('pending running done');
    };
    let setTransferStatusClass2Tr = ($tr, status)=>{
        clearTransferStatusClass2Tr($tr);
        $tr.addClass(status);
    };

    $('#btnSubmit').click(function() {

        $statusTablesSet.empty();

        let $pendings = $('#table-list > tbody > tr.pending');

        //开始传输
        let _transferStart = async ()=> {
            gloader.show();

            $('#chk-tables').prop('disabled', true);
            $('.check-table').prop('disabled', true);
            $(this).prop('disabled', true);

            for (let i = 0; i < $pendings.length; i++) {
                let $tr = $pendings.eq(i);

                setTransferStatusClass2Tr($tr, 'running');

                let sourceDb = getSourceDb();
                let destinationDb = getDestinationDb();
                let tableName = $tr.data('table-name');

                let formData = new FormData();
                formData.append("tableName", tableName);
                formData.append('source-db-driver-class-name', sourceDb.driverClassName);
                formData.append('source-db-url', sourceDb.url);
                formData.append('source-db-username', sourceDb.username);
                formData.append('source-db-password', sourceDb.password);
                formData.append('destination-db-driver-class-name', destinationDb.driverClassName);
                formData.append('destination-db-url', destinationDb.url);
                formData.append('destination-db-username', destinationDb.username);
                formData.append('destination-db-password', destinationDb.password);

                $statusTablesSet.text(`${tableName}...${i+1}/${$pendings.length}`);

                // let res = await axios.post(`${dbt.contextPath}/table-transfer`, formData);
                // setTransferStatusClass2Tr($tr, 'done');

                await JUnitTestUtil.mockPromise(200);

                setTransferStatusClass2Tr($tr, 'done');
            }
            $statusTablesSet.text('transfer compelete.');

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

        if ('source-set' === fieldsetId) {
            let formData = convertDbSettingToFormData(getSourceDb());

            connectionTest(formData, {silent: true})
            .then(res=>{
                wizardNext();
            });
        } else if ('destination-set' === fieldsetId) {
            let sourceDb = getSourceDb();
            let destinationDb = getDestinationDb();
            let formData = convertDbSettingToFormData(destinationDb);

            connectionTest(formData, {silent: true})
            .then(res=>{
                wizardNext();

                $('#chk-tables').prop('disabled', false).prop('checked', false);
                $('#btnSubmit').prop('disabled', false);
                $statusTablesSet.empty();

                gloader.show();
                let rowNo = 0;

                let $thead = $('#table-list > thead');
                let $tbody = $('#table-list > tbody').empty();

                $thead.find('th.source').text(sourceDb.type);
                $thead.find('th.destination').text(destinationDb.type);

                //source-tables
                axios.post(`${dbt.contextPath}/get-tables`, convertDbSettingToFormData(sourceDb)
                ).then(resSource=>{

                    resSource.data.forEach(table=>{
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

                    //destination-tables
                    axios.post(`${dbt.contextPath}/get-tables`, convertDbSettingToFormData(destinationDb)
                    ).then(resDestination=> {
                        resDestination.data.forEach(table=>{
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

                }).finally(()=>{
                    gloader.hide();
                }).catch(error => {
                });
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