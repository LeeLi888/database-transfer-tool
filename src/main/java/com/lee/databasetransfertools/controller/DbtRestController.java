package com.lee.databasetransfertools.controller;

import cn.hutool.db.meta.Table;
import com.lee.databasetransfertools.data.TransferResult;
import com.lee.databasetransfertools.service.DbtService;
import com.lee.databasetransfertools.util.DbtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
public class DbtRestController {

    @Autowired
    private DbtService dbtService;

    @RequestMapping("/connection-test")
    public void connectionTest(HttpServletRequest request) throws Exception {
        var db = DbtUtil.getDatabaseSetting(request);

        dbtService.connectionTest(db);
    }

    @RequestMapping("/get-tables")
    public List<Table> getTables(HttpServletRequest request) throws Exception {
        var db = DbtUtil.getDatabaseSetting(request);
        var tableNamePattern = (String)null;

        return dbtService.getTables(db, tableNamePattern);
    }

    @RequestMapping("/get-table")
    public Table getTable(HttpServletRequest request) throws Exception {
        var db = DbtUtil.getDatabaseSetting(request);
        var tableName = request.getParameter("tableName");

        return dbtService.getTable(db, tableName);
    }

    @RequestMapping("/table-transfer")
    public TransferResult tableTransfer(HttpServletRequest request) throws Exception {
        var source = DbtUtil.getDatabaseSourceSetting(request);
        var destination = DbtUtil.getDatabaseDestinationSetting(request);
        var tableName = request.getParameter("tableName");

        var result = dbtService.tableTransfer(source, destination, tableName);

        return result;
    }


}
