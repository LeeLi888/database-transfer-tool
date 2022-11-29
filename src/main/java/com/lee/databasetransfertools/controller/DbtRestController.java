package com.lee.databasetransfertools.controller;

import cn.hutool.db.meta.Table;
import com.lee.databasetransfertools.data.DatabaseInfo;
import com.lee.databasetransfertools.data.TableInfo;
import com.lee.databasetransfertools.data.TransferResult;
import com.lee.databasetransfertools.service.DbtService;
import com.lee.databasetransfertools.util.DbtRequestUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
public class DbtRestController {

    @Autowired
    private DbtService dbtService;

    @RequestMapping("/connection-test")
    public void connectionTest(HttpServletRequest request) throws Exception {
        var db = DbtRequestUtil.getDatabaseSetting(request);

        dbtService.connectionTest(db);
    }

    @RequestMapping("/get-tables")
    public List<TableInfo> getTables(HttpServletRequest request) throws Exception {
        var db = DbtRequestUtil.getDatabaseSetting(request);
        var tableNamePattern = request.getParameter("tableNamePattern");
        var withTableLength = Boolean.parseBoolean(request.getParameter("withTableLength"));

        return dbtService.getTables(db, tableNamePattern, withTableLength);
    }

    @RequestMapping("/get-table")
    public Table getTable(HttpServletRequest request) throws Exception {
        var db = DbtRequestUtil.getDatabaseSetting(request);
        var tableName = request.getParameter("tableName");

        return dbtService.getTable(db, tableName);
    }

    @RequestMapping("/get-database-info")
    public DatabaseInfo getDatabaseInfo(HttpServletRequest request) throws Exception {
        var db = DbtRequestUtil.getDatabaseSetting(request);

        return dbtService.getDatabaseInfo(db);
    }

    @RequestMapping("/table-transfer")
    public TransferResult tableTransfer(HttpServletRequest request) throws Exception {
        var source = DbtRequestUtil.getDatabaseSourceSetting(request);
        var destination = DbtRequestUtil.getDatabaseDestinationSetting(request);
        var tableName = request.getParameter("tableName");

        var result = dbtService.tableTransfer(source, destination, tableName);

        return result;
    }


}
