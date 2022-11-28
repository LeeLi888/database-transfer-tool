package com.lee.databasetransfertools.data;

import cn.hutool.db.ds.simple.SimpleDataSource;

public class DbtDataSource extends SimpleDataSource {
    public DbtDataSource(DataSourceSetting ds) {
        super(ds.url, ds.username, ds.password, ds.driverClassName);
    }
}
