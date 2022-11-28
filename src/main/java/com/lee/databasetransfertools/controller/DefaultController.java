package com.lee.databasetransfertools.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
public class DefaultController {

    @RequestMapping("/")
    public String index(HttpServletRequest request) {
        return "index";
    }


}
