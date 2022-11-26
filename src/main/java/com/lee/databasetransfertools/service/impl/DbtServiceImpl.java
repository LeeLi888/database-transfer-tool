package com.lee.databasetransfertools.service.impl;

import cn.hutool.db.meta.Table;
import com.lee.databasetransfertools.data.DataSourceSetting;
import com.lee.databasetransfertools.service.DbtService;
import com.lee.databasetransfertools.util.DataSourceMetaDataUtil;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DbtServiceImpl implements DbtService {

    @Override
    public void tableTransfer(DataSourceSetting source, DataSourceSetting destination, String tableName) {
        System.out.println(source.getDriverClassName());
        System.out.println(destination.getDriverClassName());
        System.out.println(tableName);

        //TODO:
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
