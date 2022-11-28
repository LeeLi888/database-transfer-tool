package com.lee.databasetransfertools.service;

import cn.hutool.db.meta.Table;
import com.lee.databasetransfertools.data.DataSourceSetting;
import com.lee.databasetransfertools.data.DatabaseInfo;
import com.lee.databasetransfertools.data.TransferResult;

import java.sql.SQLException;
import java.util.List;

public interface DbtService {

    public TransferResult tableTransfer(DataSourceSetting source, DataSourceSetting destination, String tableName) throws Exception;

    public void connectionTest(DataSourceSetting dbSetting) throws Exception;

    public List<String> getTables(DataSourceSetting dbSetting, String tableNamePattern) throws Exception;

    public Table getTable(DataSourceSetting dbSetting, String tableName) throws Exception;

    public DatabaseInfo getDatabaseInfo(DataSourceSetting dbSetting) throws Exception;

}
