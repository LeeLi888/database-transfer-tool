let dbt = {};

let DatabaseType = {
    mysql : 'mysql',
    mssql : 'mssql',
    mariadb : 'mariadb',
    postgresql : 'postgresql',

    defaultSetting : {
        mysql : {
            driverClassName : 'com.mysql.cj.jdbc.Driver',
            url: 'jdbc:mysql://localhost:3306/lportal?useUnicode=true&characterEncoding=UTF-8&useFastDateParsing=false&serverTimezone=GMT%2B8&useSSL=false',
            username: 'root',
        },
        mssql : {
            driverClassName : 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
            url: 'jdbc:sqlserver://localhost:1433;database=lportal;trustServerCertificate=true;',
            username: 'sa',
        },
        mariadb : {
            driverClassName : 'org.mariadb.jdbc.Driver',
            url: 'jdbc:mariadb://localhost/lportal?useUnicode=true&characterEncoding=UTF-8&useFastDateParsing=false',
            username: 'root',
        },
        postgresql : {
            driverClassName : 'org.postgresql.Driver',
            url: 'jdbc:postgresql://localhost:5432/lportal',
            username: 'root',
        }
    }
};

class DatabaseSetting {
    type;
    driverClassName;
    url;
    username;
    password;

    set type(type) {
        this.type = type;
    }

    get type() {
        return this.type;
    }

    set driverClassName(driverClassName) {
        this.driverClassName = driverClassName;
    }

    get driverClassName() {
        return this.driverClassName;
    }

    set url(url) {
        this.url = url;
    }

    get url() {
        return this.url;
    }

    set username(username) {
        this.username = username;
    }

    get username() {
        return this.username;
    }

    set password(password) {
        this.password = password;
    }

    get password() {
        return this.password;
    }
};

class Loader {
    $el;
    $loader;
    bloading;
    delay;
    option;

    constructor($el) {
        this.$el = ($el && $el.length > 0) ? $el : $('body');
        this.$loader = this.$el.find('.loader');
        this.delay = 200;
        this.bloading = false;
    }

    show() {
        if (this.$loader == null || this.$loader.length <= 0) {
            this.$loader = $(`<div class="loader"><div class="inner"><i class="fa-solid fa-spinner fa-spin"></i></div></div>`);
            this.$el.append(this.$loader);
        }

        this.bloading = true;
        setTimeout(()=>{
            if (this.bloading) {
                this.$loader.show();
            }
        }, this.delay);
    }

    hide() {
        this.bloading = false;
        if (this.$loader != null && this.$loader.length > 0) {
            this.$loader.hide().remove();
            this.$loader = null;
        }
    }
};

const gloader = new Loader();

//单体测试模块儿
const JUnitTestUtil = {
    mockPromise : function(timeout) {
        if (timeout <= 0) {
            return Promise.resolve();
        } else {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, timeout);
            })
        }
    },
};


