package com.lee.databasetransfertools.util;

import java.sql.DatabaseMetaData;
import java.sql.SQLException;

public class DatabaseProductNameUtil {
    public final static String MySQL = "MySQL";
    public final static String MicrosoftSQLServer = "Microsoft SQL Server";

    public final static String MariaDB = "MariaDB";

    public final static String PostgreSQL = "PostgreSQL";

    public static boolean isMySQL(DatabaseMetaData meta) throws SQLException {
        return MySQL.equalsIgnoreCase(getProductName(meta));
    }

    public static boolean isMicrosoftSQLServer(DatabaseMetaData meta) throws SQLException {
        return MicrosoftSQLServer.equalsIgnoreCase(getProductName(meta));
    }

    public static boolean isMariaDB(DatabaseMetaData meta) throws SQLException {
        return MariaDB.equalsIgnoreCase(getProductName(meta));
    }

    public static boolean isPostgreSQL(DatabaseMetaData meta) throws SQLException {
        return PostgreSQL.equalsIgnoreCase(getProductName(meta));
    }

    public static String getProductName(DatabaseMetaData meta) throws SQLException {
        return meta.getDatabaseProductName();
    }
}
