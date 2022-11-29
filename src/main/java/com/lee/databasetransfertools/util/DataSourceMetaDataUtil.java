package com.lee.databasetransfertools.util;

import cn.hutool.db.handler.NumberHandler;
import cn.hutool.db.meta.MetaUtil;
import cn.hutool.db.meta.Table;
import cn.hutool.db.meta.TableType;
import cn.hutool.db.sql.SqlExecutor;
import com.lee.databasetransfertools.data.DataSourceSetting;
import com.lee.databasetransfertools.data.DatabaseInfo;
import com.lee.databasetransfertools.data.DbtDataSource;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.sql.DataSource;
import java.sql.*;
import java.util.List;

public class DataSourceMetaDataUtil {
    private static final Logger logger = LogManager.getLogger(GeneralSqlUtil.class);

    //获取链接
    public static Connection getConnection(DataSourceSetting dataSource) throws ClassNotFoundException, SQLException {
        DataSource ds = new DbtDataSource(dataSource);
        return ds.getConnection();
    }

    public static DatabaseInfo getDatabaseInfo(DataSourceSetting dataSource) throws Exception {
        var info = new DatabaseInfo();

        var tables = getTables(dataSource, null);
        info.setTables(tables);

        try (var conn = getConnection(dataSource)) {
            info.setCatalog(MetaUtil.getCatalog(conn));
            info.setProductName(DatabaseProductNameUtil.getProductName(conn.getMetaData()));
            info.setProductVersion(conn.getMetaData().getDatabaseProductVersion());
            info.setLength(getDatabaseLength(conn));
        }

        return info;
    }

    public static long getDatabaseLength(Connection conn) throws SQLException {
        long size = -1;
        var meta = conn.getMetaData();
        var databaseName = conn.getCatalog();

        try {
            if (DatabaseProductNameUtil.isMySQL(meta) || DatabaseProductNameUtil.isMariaDB(meta)) {
                size = SqlExecutor.query(conn,
                   "SELECT SUM(table_rows) FROM INFORMATION_SCHEMA.tables where TABLE_SCHEMA=?", new NumberHandler(), databaseName).longValue();

            } else if (DatabaseProductNameUtil.isMicrosoftSQLServer(meta)) {
                size = SqlExecutor.query(conn,
                    "SELECT SUM(B.rows) FROM sys.objects A INNER JOIN sys.partitions B ON A.object_id = B.object_id WHERE A.type = 'U'", new NumberHandler()).longValue();

            } else if (DatabaseProductNameUtil.isPostgreSQL(meta)) {
                size = SqlExecutor.query(conn,
                        "select sum(n_live_tup) from pg_stat_user_tables where schemaname='public'", new NumberHandler()).longValue();
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

        return size;
    }

    //测试链接
    public static void testConnection(DataSourceSetting dataSource) throws ClassNotFoundException, SQLException {
        try (var conn = getConnection(dataSource)) {
        }
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
