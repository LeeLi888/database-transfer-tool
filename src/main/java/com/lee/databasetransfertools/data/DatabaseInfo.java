package com.lee.databasetransfertools.data;

import lombok.Data;

@Data
public class DatabaseInfo {
    String productName;
    String productVersion;
    String catalog;
    long length;
}
