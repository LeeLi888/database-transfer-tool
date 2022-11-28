package com.lee.databasetransfertools.data;

import cn.hutool.db.Entity;
import cn.hutool.db.meta.Table;
import cn.hutool.json.JSONObject;
import lombok.Data;

import java.util.List;

@Data
public class TransferResult {
    private String table;
    private int deletedSizeFromDestination;
    private int size;
    private List<Entity> lastDatas;

}
