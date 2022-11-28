package com.lee.databasetransfertools.util;

import cn.hutool.db.meta.Column;
import cn.hutool.db.meta.MetaUtil;
import cn.hutool.db.meta.Table;
import cn.hutool.db.meta.TableType;
import com.lee.databasetransfertools.data.DataSourceSetting;
import com.lee.databasetransfertools.data.DbtDataSource;
import org.apache.commons.lang3.StringUtils;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class DataSourceMetaDataUtil {

    //获取链接
    public static Connection getConnection(DataSourceSetting dataSource) throws ClassNotFoundException, SQLException {
        DataSource ds = new DbtDataSource(dataSource);
        return ds.getConnection();
    }

    //测试链接
    public static void testConnection(DataSourceSetting dataSource) throws ClassNotFoundException, SQLException {
        try (var conn = getConnection(dataSource)) {}
    }

    //获取表列表（基本信息）
    public static List<String> getTables(DataSourceSetting dataSource, String tableNamePattern) {
        DataSource ds = new DbtDataSource(dataSource);
        tableNamePattern = StringUtils.isEmpty(tableNamePattern) ? null : tableNamePattern;

        return MetaUtil.getTables(ds, null, tableNamePattern, TableType.TABLE);
    }

    //获取单个表信息
    public static Table getTable(DataSourceSetting dataSource, String tableName) throws Exception {
        DataSource ds = new DbtDataSource(dataSource);
        return MetaUtil.getTableMeta(ds, tableName);
    }

    //验证两张表字段是否一致
    public static void validateTable(Table tableSource, Table tableDestination) throws Exception {
        var columnsS = tableSource.getColumns();
        var columnsD = tableDestination.getColumns();

        for (var columnS : columnsS) {
            if (! columnsD.stream().anyMatch(columnD -> columnD.getName().equals(columnS.getName()))) {
                throw new SQLException(String.format("Column [%s] not defined in destination talble.", columnS.getName()));
            }
        }
    }
}
