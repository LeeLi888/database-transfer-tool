package com.lee.databasetransfertools.controller;

import cn.hutool.db.meta.Table;
import com.lee.databasetransfertools.service.DbtService;
import com.lee.databasetransfertools.util.DbtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
public class DbtController {

    @Autowired
    private DbtService dbtService;

    @ResponseBody
    @RequestMapping("/connection-test")
    public void connectionTest(HttpServletRequest request) throws Exception {
        var db = DbtUtil.getDatabaseSetting(request);

        dbtService.connectionTest(db);
    }

    @ResponseBody
    @RequestMapping("/get-tables")
    public List<Table> getTables(HttpServletRequest request) throws Exception {
        var db = DbtUtil.getDatabaseSetting(request);
        var tableNamePattern = (String)null;

        return dbtService.getTables(db, tableNamePattern);
    }

    @RequestMapping("/table-transfer")
    public void tableTransfer(HttpServletRequest request) {
        var source = DbtUtil.getDatabaseSourceSetting(request);
        var destination = DbtUtil.getDatabaseDestinationSetting(request);
        var tableName = request.getParameter("tableName");

        dbtService.tableTransfer(source, destination, tableName);
    }


}
