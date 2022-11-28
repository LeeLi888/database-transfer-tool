package com.lee.databasetransfertools.util;

import com.lee.databasetransfertools.data.DataSourceSetting;

import javax.servlet.http.HttpServletRequest;

public class DbtRequestUtil {

    public static DataSourceSetting getDatabaseSetting(HttpServletRequest reqeust) {
        var ds = new DataSourceSetting();
        ds.setDriverClassName(reqeust.getParameter("db-driver-class-name"));
        ds.setUrl(reqeust.getParameter("db-url"));
        ds.setUsername(reqeust.getParameter("db-username"));
        ds.setPassword(reqeust.getParameter("db-password"));
        return ds;
    }

    /**
     *    driverClassName: com.microsoft.sqlserver.jdbc.SQLServerDriver
     *    url: jdbc:sqlserver://localhost:1433;database=lportal_upgrade;
     *    username: sa
     *    password: Liferay@2022
     */
    public static DataSourceSetting getDatabaseSourceSetting(HttpServletRequest reqeust) {
        var ds = new DataSourceSetting();
        ds.setDriverClassName(reqeust.getParameter("source-db-driver-class-name"));
        ds.setUrl(reqeust.getParameter("source-db-url"));
        ds.setUsername(reqeust.getParameter("source-db-username"));
        ds.setPassword(reqeust.getParameter("source-db-password"));
        return ds;
    }

    /**
     *    driverClassName: com.mysql.cj.jdbc.Driver
     *    url: jdbc:mysql://localhost:13306/lportal_upgrade_from_azure3?useUnicode=true&characterEncoding=UTF-8&useFastDateParsing=false&serverTimezone=GMT%2B8&useSSL=false
     *    username: root
     *    password: liferay
     */
    public static DataSourceSetting getDatabaseDestinationSetting(HttpServletRequest reqeust) {
        var ds = new DataSourceSetting();
        ds.setDriverClassName(reqeust.getParameter("destination-db-driver-class-name"));
        ds.setUrl(reqeust.getParameter("destination-db-url"));
        ds.setUsername(reqeust.getParameter("destination-db-username"));
        ds.setPassword(reqeust.getParameter("destination-db-password"));
        return ds;
    }

}
