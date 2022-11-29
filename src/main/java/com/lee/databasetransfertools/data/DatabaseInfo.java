package com.lee.databasetransfertools.data;

import lombok.Data;

import java.util.List;

@Data
public class DatabaseInfo {
    String productName;
    String productVersion;
    String catalog;
    List<String> tables;
    long length;
}
