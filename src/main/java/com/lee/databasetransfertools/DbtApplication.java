package com.lee.databasetransfertools;

import com.lee.databasetransfertools.service.DbtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })
public class DbtApplication {

    public static void main(String[] args) {
        SpringApplication.run(DbtApplication.class, args);
    }

}
