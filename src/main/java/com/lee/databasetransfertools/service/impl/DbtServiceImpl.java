package com.lee.databasetransfertools.service.impl;

import cn.hutool.db.Entity;
import cn.hutool.db.ds.simple.SimpleDataSource;
import cn.hutool.db.meta.Table;
import cn.hutool.db.sql.SqlExecutor;
import cn.hutool.json.JSONObject;
import com.lee.databasetransfertools.data.*;
import com.lee.databasetransfertools.service.DbtService;
import com.lee.databasetransfertools.util.DataSourceMetaDataUtil;
import com.lee.databasetransfertools.util.GeneralSqlUtil;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Service
public class DbtServiceImpl implements DbtService {

    @Override
    public TransferResult tableTransfer(DataSourceSetting source, DataSourceSetting destination, String tableName) throws Exception {
        var result = new TransferResult();
        List<Entity> entities = new ArrayList<>();

        //Source table check
        Table tableSource = DataSourceMetaDataUtil.getTable(source, tableName);
        if (tableSource == null) {
            throw new Exception(String.format("Table %s not defined in source."));
        }

        //Destination table check
        Table tableDestination = DataSourceMetaDataUtil.getTable(destination, tableName);
        if (tableDestination == null) {
            throw new Exception(String.format("Table %s not defined in destination."));
        }

        //Validate column
        DataSourceMetaDataUtil.validateTable(tableSource, tableDestination);

        //get data from source
        try (var conn = DataSourceMetaDataUtil.getConnection(source)) {
            entities = GeneralSqlUtil.getList(conn, tableName);
        }

        //inser data to destination
        try (var conn = DataSourceMetaDataUtil.getConnection(destination)) {
            try {
                conn.setAutoCommit(false);

                var deleted = GeneralSqlUtil.delete(conn, tableName);

                result.setTable(tableName);
                result.setSize(entities.size());
                result.setDeletedSizeFromDestination(deleted);

                //insert
                if (entities.size() > 0) {
                    GeneralSqlUtil.insert(conn, tableName, entities);
                    //set latest data into result
                    result.setLastDatas(entities.subList(Math.max(0, entities.size() - 100), entities.size()));
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
    public List<TableInfo> getTables(DataSourceSetting dataSource, String tableNamePattern, boolean withTableLength) throws Exception {
        List<TableInfo> list = new ArrayList<>();
        var tableNames = DataSourceMetaDataUtil.getTables(dataSource, tableNamePattern);

        try (var conn = DataSourceMetaDataUtil.getConnection(dataSource)) {
            for (String tableName : tableNames) {
                var table = new TableInfo();
                table.setTableName(tableName);

                if (withTableLength) {
                    table.setLength(GeneralSqlUtil.length(conn, tableName));
                }

                list.add(table);
            }
        }

        return list;
    }

    @Override
    public Table getTable(DataSourceSetting dataSource, String tableName) throws Exception {
        var table = DataSourceMetaDataUtil.getTable(dataSource, tableName);

        return table;
    }

    @Override
    public DatabaseInfo getDatabaseInfo(DataSourceSetting dbSetting) throws Exception {
        return DataSourceMetaDataUtil.getDatabaseInfo(dbSetting);
    }

}
