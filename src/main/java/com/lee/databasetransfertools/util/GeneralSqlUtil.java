package com.lee.databasetransfertools.util;

import cn.hutool.core.date.DateUtil;
import cn.hutool.db.meta.JdbcType;
import cn.hutool.db.meta.Table;
import cn.hutool.json.JSONObject;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class GeneralSqlUtil {
    private static final Logger logger = LogManager.getLogger(GeneralSqlUtil.class);

    /**
     * delete data
     */
    public static int delete(Connection conn, Table table) throws SQLException {
        var sql = "DELETE FROM " + table.getTableName();
        logger.info(sql);

        try (var st = conn.createStatement()) {
            return st.executeUpdate(sql);
        }
    }

    /**
     * select data
     */
    public static List<JSONObject> getList(Connection conn, Table table) throws SQLException {
        List<JSONObject> list = new ArrayList<>();
        var columns = table.getColumns();
        var sql = new StringBuffer("SELECT");
        var columnBuffer = new StringBuffer();

        columns.forEach(column -> {
            columnBuffer.append(", " + column.getName());
        });
        sql.append(columnBuffer.toString().substring(1));
        sql.append(" FROM " + table.getTableName());
        logger.info(sql.toString());

        try (var st = conn.createStatement()) {
            try (var rs = st.executeQuery(sql.toString())) {
                while (rs.next()) {
                    var data = new JSONObject();
                    for (var column : columns) {
                        if (column.getType() == JdbcType.DATE.typeCode) {
                            data.set(column.getName(), rs.getDate(column.getName()));
                        } else if (column.getType() == JdbcType.TIMESTAMP.typeCode) {
                            data.set(column.getName(), rs.getTimestamp(column.getName()));
                        } else {
                            data.set(column.getName(), rs.getString(column.getName()));
                        }
                    }
                    list.add(data);
                }
            }
        }
        return list;
    }

    /**
     * select data
     */
    public static void insert(Connection conn, Table table, List<JSONObject> datas) throws SQLException {
        var sql = new StringBuffer("INSERT INTO " + table.getTableName());
        var columnBuffer = new StringBuffer();
        var valueBuffer = new StringBuffer();
        List<String> keys = new ArrayList<>();

        for (var key : datas.get(0).keySet()) {
            keys.add(key);
        }
        keys.forEach(key-> columnBuffer.append(", " + key));
        sql.append("(");
        sql.append(columnBuffer.toString().substring(1));
        sql.append(") VALUES (");

        keys.forEach(val-> valueBuffer.append(", ?"));
        sql.append(valueBuffer.toString().substring(1));
        sql.append(")");
        logger.info(sql.toString());

        try (var pst = conn.prepareStatement(sql.toString())) {

            for (var data : datas) {
                var indx = 0;
                for (var key : keys) {
                    if (data.get(key) == null) {
                        pst.setObject(++indx, null);
                    } else {
                        var column = table.getColumn(key);
                        if (column.getType() == JdbcType.DATE.typeCode) {
                            pst.setDate(++indx, new java.sql.Date(data.getDate(key).getTime()));
                        } else if (column.getType() == JdbcType.TIMESTAMP.typeCode) {
                            pst.setTimestamp(++indx, new Timestamp(data.getDate(key).getTime()));
                        } else {
                            pst.setString(++indx, data.getStr(key));
                        }
                    }
                }
                pst.addBatch();
            }
            pst.executeUpdate();
        }
    }

    /**
     * select data
     */
    public static void insert(Connection conn, Table table, JSONObject data) throws SQLException {
        List<JSONObject> list = new ArrayList<>();
        list.add(data);

        insert(conn, table, data);
    }

}

