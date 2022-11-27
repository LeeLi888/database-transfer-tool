package com.lee.databasetransfertools.util;

import cn.hutool.db.meta.Column;
import cn.hutool.db.meta.Table;
import cn.hutool.db.meta.TableType;
import com.lee.databasetransfertools.data.DataSourceSetting;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DataSourceMetaDataUtil {

    //获取链接
    public static Connection getConnection(DataSourceSetting dataSource) throws ClassNotFoundException, SQLException {
        Class.forName(dataSource.getDriverClassName());
        var connection = DriverManager.getConnection(dataSource.getUrl(), dataSource.getUsername(), dataSource.getPassword());
        return connection;
    }

    //测试链接
    public static void testConnection(DataSourceSetting dataSource) throws ClassNotFoundException, SQLException {
        try (var conn = getConnection(dataSource)) {}
    }

    //获取表列表（基本信息）
    public static List<Table> getTablesBase(DataSourceSetting dataSource, String tableNamePattern) throws SQLException, ClassNotFoundException {
        List<Table> tables = new ArrayList<>();

        try (var conn = getConnection(dataSource)) {
            var meta = _getMetaData(conn);
            var catalog = conn.getCatalog();
            var schemaPattern = conn.getSchema();

            try (var rs = meta.getTables(catalog, schemaPattern, tableNamePattern, new String[]{ TableType.TABLE.value() })) {
                while (rs.next()) {
                    var table = generateTable(rs);
                    tables.add(table);
                }
            }
        }

        return tables;
    }

    //获取表列表
    public static List<Table> getTables(DataSourceSetting dataSource, String tableNamePattern) throws Exception {
        List<Table> tables = new ArrayList<>();

        try (var conn = getConnection(dataSource)) {
            var meta = _getMetaData(conn);
            var catalog = conn.getCatalog();
            var schemaPattern = conn.getSchema();

            try (var rs = meta.getTables(catalog, schemaPattern, tableNamePattern, new String[]{ TableType.TABLE.value() })) {
                while (rs.next()) {
                    var table = generateTable(rs);
                    tables.add(table);
                }
            }

            for (var table : tables) {
                //table detail
                _setTableDetailInfo(meta, catalog, schemaPattern, table);
            }
        }

        return tables;
    }

    //获取单个表信息
    public static Table getTable(DataSourceSetting dataSource, String tableName) throws Exception {
        var table = (Table)null;

        try (var conn = getConnection(dataSource)) {
            table = getTable(conn, tableName);
        }
        return table;
    }

    public static Table getTable(Connection conn, String tableName) throws Exception {
        var table = (Table)null;
        var catalog = conn.getCatalog();
        var schemaPattern = conn.getSchema();

        var meta = _getMetaData(conn);

        try (var rs = meta.getTables(catalog, schemaPattern, tableName, new String[]{ TableType.TABLE.value() })) {
            if (rs.next()) {
                table = generateTable(rs);
            }
        }

        //table detail
        if (table != null) {
            _setTableDetailInfo(meta, catalog, schemaPattern, table);
        }

        return table;
    }

    private static DatabaseMetaData _getMetaData(Connection connection) throws SQLException {
        var meta = connection.getMetaData();

        //meta.storesMixedCaseIdentifiers();

        return meta;
    }
    private static void _setTableDetailInfo(DatabaseMetaData meta, String catalog, String schemaPattern, Table table) throws Exception {
        try (var rs = meta.getColumns(catalog, schemaPattern, table.getTableName(), null)) {
            while (rs.next()) {
                var column = Column.create(table, rs);

                if (column.isPk()) {
                    table.addPk(column.getName());
                }
                table.setColumn(column);
            }
        }
    }

    //通过ResultSet生成表
    public static Table generateTable(ResultSet rs) throws SQLException {
        var table = new Table(rs.getString("TABLE_NAME"));
        table.setCatalog(rs.getString("TABLE_CAT"));
        table.setSchema(rs.getString("TABLE_SCHEM"));
        table.setComment(rs.getString("REMARKS"));

        return table;
    }

}
