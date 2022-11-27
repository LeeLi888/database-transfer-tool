package com.lee.databasetransfertools.data;

import cn.hutool.db.meta.Table;
import lombok.Data;

@Data
public class TransferResult {
    private Table table;
    private int deletedSizeFromDestination;
    private int size;

}
