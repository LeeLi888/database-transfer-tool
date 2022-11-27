package com.lee.databasetransfertools.service.impl;

import cn.hutool.db.meta.Table;
import cn.hutool.json.JSONObject;
import com.lee.databasetransfertools.data.DataSourceSetting;
import com.lee.databasetransfertools.data.TransferResult;
import com.lee.databasetransfertools.service.DbtService;
import com.lee.databasetransfertools.util.DataSourceMetaDataUtil;
import com.lee.databasetransfertools.util.GeneralSqlUtil;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Service
public class DbtServiceImpl implements DbtService {

    @Override
    public TransferResult tableTransfer(DataSourceSetting source, DataSourceSetting destination, String tableName) throws Exception {
        var result = new TransferResult();
        List<JSONObject> datas = new ArrayList<>();

        //get data from source
        try (var conn = DataSourceMetaDataUtil.getConnection(source)) {
            var table = DataSourceMetaDataUtil.getTable(conn, tableName);

            datas = GeneralSqlUtil.getList(conn, table);
        }

        //inser data to destination
        try (var conn = DataSourceMetaDataUtil.getConnection(destination)) {
            try {
                conn.setAutoCommit(false);

                var table = DataSourceMetaDataUtil.getTable(conn, tableName);
                var deleted = GeneralSqlUtil.delete(conn, table);

                result.setTable(table);
                result.setSize(datas.size());
                result.setDeletedSizeFromDestination(deleted);

                //insert
                if (datas.size() > 0) {
                    GeneralSqlUtil.insert(conn, table, datas);
                    //set latest data into result
                    result.setLastDatas(datas.subList(Math.max(0, datas.size() - 100), datas.size()));
                }

                conn.commit();
            } catch (Exception e) {
                conn.rollback();;
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
