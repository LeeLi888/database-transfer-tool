package com.lee.databasetransfertools.util;

import cn.hutool.db.Entity;
import cn.hutool.db.StatementUtil;
import cn.hutool.db.handler.EntityHandler;
import cn.hutool.db.handler.EntityListHandler;
import cn.hutool.db.handler.NumberHandler;
import cn.hutool.db.meta.Table;
import cn.hutool.db.sql.SqlExecutor;
import com.lee.databasetransfertools.data.DataSourceSetting;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class GeneralSqlUtil {
    private static final Logger logger = LogManager.getLogger(GeneralSqlUtil.class);

    /**
     * delete data
     */
    public static int delete(Connection conn, String tableName) throws SQLException {
        int count = SqlExecutor.execute(conn, "DELETE FROM " + tableName);
        return count;
    }

    public static int length(Connection conn, String tableName) throws SQLException {
        int count = SqlExecutor.query(conn, "SELECT COUNT(*) FROM " + tableName, new NumberHandler()).intValue();
        return count;
    }

    public static List<Entity> getList(Connection conn, String tableName) throws SQLException {
        List<Entity> list = SqlExecutor.query(conn, "SELECT * FROM " + tableName, new EntityListHandler());
        return list;
    }

    /**
     * select data
     */
    public static void insert(Connection conn, String tableName, List<Entity> entities) throws SQLException {
        var sql = new StringBuffer("INSERT INTO " + tableName);
        var firstEntity = entities.get(0);
        var columnBuffer = new StringBuffer();
        var valueBuffer = new StringBuffer();
        var fields = firstEntity.getFieldNames();

        fields.forEach(field-> columnBuffer.append(", " + field));
        sql.append("(");
        sql.append(columnBuffer.toString().substring(1));
        sql.append(") VALUES (");

        fields.forEach(val-> valueBuffer.append(", ?"));
        sql.append(valueBuffer.toString().substring(1));
        sql.append(")");
        logger.info(sql.toString());

        try (var pst = conn.prepareStatement(sql.toString())) {
            for (var entity : entities) {
                var params = new ArrayList<Object>();
                fields.forEach(field-> params.add(entity.get(field)));
                StatementUtil.fillParams(pst, params);
                pst.addBatch();
            }
            pst.executeBatch();
        }
    }


}

