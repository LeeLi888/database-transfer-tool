package com.lee.databasetransfertools.service;

import cn.hutool.db.meta.Table;
import com.lee.databasetransfertools.data.DataSourceSetting;

import java.util.List;

public interface DbtService {

    public void tableTransfer(DataSourceSetting source, DataSourceSetting destination, String tableName);

    public void connectionTest(DataSourceSetting dbSetting) throws Exception;

    public List<Table> getTables(DataSourceSetting dbSetting) throws Exception;

    public Table getTable(DataSourceSetting dbSetting, String tableName) throws Exception;

}
