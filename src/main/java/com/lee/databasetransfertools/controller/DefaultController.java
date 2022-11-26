package com.lee.databasetransfertools.controller;

import com.lee.databasetransfertools.service.DbtService;
import com.lee.databasetransfertools.util.DbtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@Controller
public class DefaultController {

    @RequestMapping("/")
    public String index(HttpServletRequest request) {
        return "index";
    }


}
