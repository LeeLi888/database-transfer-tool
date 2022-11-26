package com.lee.databasetransfertools.data;

import lombok.Data;

@Data
public class DataSourceSetting {
    String url;
    String username;
    String password;
    String driverClassName;
}
