package com.lee.databasetransfertools.service.impl;

import cn.hutool.db.meta.Table;
import com.lee.databasetransfertools.data.DataSourceSetting;
import com.lee.databasetransfertools.data.TransferResult;
import com.lee.databasetransfertools.service.DbtService;
import com.lee.databasetransfertools.util.DataSourceMetaDataUtil;
import com.lee.databasetransfertools.util.GeneralSqlUtil;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;

@Service
public class DbtServiceImpl implements DbtService {

    @Override
    public TransferResult tableTransfer(DataSourceSetting source, DataSourceSetting destination, String tableName) throws Exception {
        var result = new TransferResult();

        try (var connSource = DataSourceMetaDataUtil.getConnection(source);
             var connDestination = DataSourceMetaDataUtil.getConnection(destination);) {

            try {
                connDestination.setAutoCommit(false);

                var tableSource = DataSourceMetaDataUtil.getTable(source, tableName);
                var tableDestination = DataSourceMetaDataUtil.getTable(destination, tableName);
                var columns = tableSource.getColumns();

                var datas = GeneralSqlUtil.getList(connSource, tableSource);
                var deleted = GeneralSqlUtil.delete(connDestination, tableDestination);

                result.setTable(tableSource);
                result.setSize(datas.size());
                result.setDeletedSizeFromDestination(deleted);

                //insert
                if (datas.size() > 0) {
                    GeneralSqlUtil.insert(connDestination, tableDestination, datas);
                }

                connDestination.commit();
            } catch (Exception e) {
                connDestination.rollback();;
                throw e;
            }
        }

        return result;
    }

    @Override
    public void connectionTest(DataSourceSetting dataSource) throws Exception {
        DataSourceMetaDataUtil.testConnection(dataSource);
    }

    @Override
    public List<Table> getTables(DataSourceSetting dataSource, String tableNamePattern) throws Exception {
        List<Table> tables = DataSourceMetaDataUtil.getTablesBase(dataSource, tableNamePattern);

        return tables;
    }

    @Override
    public Table getTable(DataSourceSetting dataSource, String tableName) throws Exception {
        var table = DataSourceMetaDataUtil.getTable(dataSource, tableName);

        return table;
    }


}
