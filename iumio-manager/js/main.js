/*
 * This is an iumio Framework component
 *
 * (c) RAFINA DANY <dany.rafina@iumio.com>
 *
 * iumio Framework, an iumio component [https://www.iumio.com]
 *
 * To get more information about licence, please check the licence file
 */



/* ----------------------------------------------------------
* ON LOAD
* ----------------------------------------------------------*/


$(document).ready(function () {

    /**
     * iumio loader
     */
    $(".iumio-loader-gen").fadeOut("fast");
    /**
     * Check a task is prior than all
     * @type {number} Priority value (0 for none, 1 for high)
     */
    var priorTask = 0;

    var used = 0;

    /**
     * Check if string does not contain any specials characters
     * @param str String to analyse
     * @returns {boolean} If string is valid
     */
    var isValidStr = function (str) {
        return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
    };

    /**
     * Format a date
     * @param date Date to format
     * @returns {string} Date formatted
     */
    var formatDate = function(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
    }

    /**
     * Open or close a modal
     * @param instruction To close or open
     */
    var modal = function (instruction) {
        $("#modalManager").modal(instruction)
    };

    /**
     * Modal operation is a success
     */
    var operationSuccess = function () {
        if (used === 1) {
            return false;
        }
        used = 1;
        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>The operation has been successfully completed.</h4>");
        selecttorModal.find(".btn-close").html("Close");
        selecttorModal.find(".btn-valid").hide();
    };

    /**
     * Modal operation is a success with reload page
     */
    var operationSuccessReload = function (time) {
        if (used === 1) {
            return false;
        }
        var selecttorModal = $("#modalManager");
        selecttorModal.data('bs.modal').options.keyboard = false;
        selecttorModal.data('bs.modal').options.backdrop = 'static';
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>The operation has been successfully completed.</h4>");
        selecttorModal.find(".btn-close").hide();
        selecttorModal.find(".btn-valid").hide();
        setTimeout(function () {
            location.reload();
        }, time);

    };

    /**
     * Modal operation is an error
     */
    var operationError = function (data) {
        if (used === 1) {
            return false;
        }
        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>The operation has generated an error.</h4>");
        if (typeof data["responseJSON"] !== "undefined" || typeof data["msg"] !== "undefined")
            selecttorModal.find(".modal-body").append("<h5 class='text-center' style='color: red'><em>"+ ((typeof data["msg"] !== "undefined")? data["msg"] : data["responseJSON"]["msg"])+"</em></h5>");
        selecttorModal.find(".btn-close").html("Close");
        selecttorModal.find(".btn-valid").hide();
    };


    var noapp = false;

    /**
     * get debug log (limited to 10 values)
     */
    var getLogs = function (reload) {
        var selector = $('.lastlog, .errorlastlog');
        if (typeof selector.attr("attr-href") === "undefined")
            return (1);

        $.ajax({
            url : selector.attr("attr-href"),
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    var results = data['results'];
                    selector.html("");
                    if (results.length === 0)
                        return (selector.append("<li>No logs</li>"));

                    $.each(results, function (index, value) {
                        var datelog = formatDate(new Date(value['time'] * 1000));
                        selector.append("<li style='padding-top: 10px;'><ul><li>Date : "+datelog+"</li><li>IP : "+value['client_ip']+"</li> <li>Uidie : <a href='"+value['log_url']+"'>"+value['uidie']+"</a> </li> <li>Message :  "+value['explain']+"</li></ul></li>");
                    })

                }
            },
            error : function (data) {
                if (typeof reload !== 'undefined')
                    operationError(data);
            }
        });
    };


    /**
     * get routing file list
     */
    var getRoutingList = function (reload) {
        var selector = $('.routinglist');
        if (typeof selector.attr("attr-href") === "undefined")
            return (1);

        $.ajax({
            url : selector.attr("attr-href"),
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    var results = data['results'];
                    selector.html("");
                    selector.html("");
                    if (results.length === 0)
                        return (selector.append("<tr><td colspan='6'>No routing file</td></tr>"));

                    $.each(results, function (index, value) {
                        selector.append("<tr>" +
                            "<td>"+value['name']+"</td>" +
                            "<td>"+value['app']+"</td>" +
                            "<td>"+value['count_route']+"</td>" +
                            "<td><button class=' btn-info btn showrouting' attr-href='"+value['view']+"' attr-appname='"+value["app"]+"' attr-filename='"+value["name"]+"'>VI</button></td>"+
                            "<td><button class='btn-info btn todeleterouting' attr-href='"+value['remove']+"' attr-appname='"+value["app"]+"' attr-filename='"+value["name"]+"'>DE</button></td>"+
                            "</tr>");
                    });

                }
            },
            error : function (data) {
                if (typeof reload !== 'undefined')
                    operationError(data);
            }
        });
    };


    /**
     * get all locale
     */
    var getAllLocale = function (reload) {
        var selector = $('.localeconfig');
        if (typeof selector.attr("attr-href") === "undefined")
            return (1);

        $.ajax({
            url : selector.attr("attr-href"),
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    var results = data['results'];
                    selector.html("");
                    selector.html("");
                    if (results.length === 0)
                        return (selector.append("<tr><td colspan='6'>No locale file</td></tr>"));

                    $.each(results, function (index, value) {
                        if (typeof value.values[0] !== "undefined") {
                            var list = "<table class='table table-bordered'><thead><tr><th>Locale</th><th>URL</th></tr></thead><tbody>";
                            $.each(value.values[0], function (index2, value2) {
                                list += "<tr><td>"+index2 + "</td><td>/" +value2+"</td></tr>";
                            });
                            list += "</tbody></table>";
                        }
                        else {
                            var list = "/"
                        }

                        selector.append("<tr>" +
                            "<td>"+((list != "" || value.values != null)? list : "/")+"</td>" +
                            "<td>"+((true === value['enabled'])? "Enabled" :  "Disabled")+"</td>"+
                            "<td>"+value['app']+"</td>" +
                            "<td>"+((null == value['prefered'])? "/": value['prefered'])+"</td>"
                            +((true === value['enabled'])?
                                "<td><button class=' btn-info btn toeditlocaleapp' attr-href='"+value['route_get_one_locale_app']+"' attr-href2='"+value['route_get_one_locale_app_save']+"' attr-appname='"+value['app']+"' >ED</button></td>"
                                : "<td>/</td>") +
                            "<td><button class='btn "+((true === value['enabled'])? "changestatusapplocale btn-danger" :  "changestatusapplocale btn-success")+"' attr-href='"+value['route_status_change']+"' attr-appname='"+value['app']+"'attr-status='"+((true === value['enabled'])? "disabled" :  "enabled")+"'  >"+((true === value['enabled'])? "DISABLE" :  "ENABLE")+"</button></td>"+
                            "</tr>");
                    });

                }
            },
            error : function (data) {
                if (typeof reload !== 'undefined')
                    operationError(data);
            }
        });
    };

    var composer = function (reload) {
        var selector = $('.composerlist');
        if (typeof selector.attr("attr-href") === "undefined")
            return (1);


        $.ajax({
            url : selector.attr("attr-href"),
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    var a = data['results'];
                    if (selector.html(""), 0 === a.length) return selector.append("<tr><td colspan='4'>No composer dependencies</td></tr>");
                    $.each(a, function (t, a) {


                        if ("packages" === t) {
                            $.each(a, function (m, u) {
                                selector.append("<tr><td>" + u.name + "</td><td>" + u.version + "</td><td>" + ((typeof  u.description !== "undefined")? u.description : "Aucune description")+ "</td><td>" + u.type + "</td><td>Prod</td></tr>");

                            });
                        }
                        else if ("packages-dev" === t) {
                            $.each(a, function (m, u) {
                                selector.append("<tr><td>" + u.name + "</td><td>" + u.version + "</td><td>" + ((typeof  u.description !== "undefined")? u.description : "Aucune description")+ "</td><td>" + u.type + "</td><td>Dev</td></tr>");

                            });
                        }
                        else if ("minimum-stability" === t) {
                            $(".minimum-stability .rs").html(a);
                        }
                        else if ("platform" === t) {
                            $(".platform .rs").html("");
                            $.each(a, function (m, u) {
                                $(".platform .rs").append("<li>" + m + " : " + u + "</li>");
                            });

                        }
                    })

                }
            },
            error : function (data) {
                if (typeof reload !== 'undefined')
                    operationError(data);
            }
        });
    };


    /**
     * get services file list
     */
    var getServicesList = function (reload) {
        var selector = $('.serviceslist');
        if (typeof selector.attr("attr-href") === "undefined")
            return (1);

        $.ajax({
            url : selector.attr("attr-href"),
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    var results = data['results'];
                    selector.html("");
                    selector.html("");
                    if ($.isEmptyObject(results))
                        return (selector.append("<tr><td colspan='6'>No services</td></tr>"));

                    $.each(results, function (index, value) {
                        selector.append("<tr>" +
                            "<td>"+index+"</td>" +
                            "<td>"+value['namespace']+"</td>" +
                            "<td>"+value['status']+"</td>" +
                            "<td><button class=' btn-info btn editservice' attr-href='"+value['edit']+"'  attr-href2='"+value['edit_save']+"'  attr-servicename='"+index+"' >ED</button></td>"+
                            "<td><button class='btn-info btn deleteservice' attr-href='"+value['remove']+"' attr-servicename='"+index+"'>DE</button></td>"+
                            "</tr>");
                    });

                }
            },
            error : function (data) {
                if (typeof reload !== 'undefined')
                    operationError(data);
            }
        });
    };

    /**
     * Infinite scroll for logs for dev
     */
    $('.iumio-unlimited-log-display').bind('scroll', function(){
        if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight)
            getUnlimitedLogs(true);
    });

    /**
     * Infinite scroll for logs for prod
     */
    $('.iumio-unlimited-log-display2').bind('scroll', function(){
        if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight)
            getUnlimitedLogs2(true);
    });



    /**
     * get debug log (unlimited) with min-max
     */
    var pos = 0;
    var call = 0;
    var ajaxlogs = false;
    var getUnlimitedLogs = function (reload) {
        var selector = $('.logslist');
        if (typeof selector.attr("attr-href") === "undefined")
            return (1);
        if (ajaxlogs === true)
            return (1);
        ajaxlogs = true;
        $.ajax({
            url : selector.attr("attr-href"),
            type : 'POST',
            data : {'pos' : pos},
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    var results = (data['results']);
                    if (results.length === 0 && call === 0)
                        return (selector.append("<tr><td colspan='6'>No logs</td></tr>"));

                    $.each(results, function (index, value) {
                        var dateLog = formatDate(new Date(value['time'] * 1000));
                        selector.append("<tr>" +
                            "<td><a href='"+value['log_url']+"'>"+value['uidie']+"</a></td>" +
                            "<td>"+dateLog+"</td>" +
                            "<td>"+value['code']+"</td>" +
                            "<td>"+value['client_ip']+"</td>" +
                            "<td>"+value['method']+"</td>" +
                            "</tr>");
                    });
                    pos += results.length;
                    $(".iumiocountlog").html(pos);
                    call++;
                    ajaxlogs = false;
                    if (results.length <= 0)
                        return (1);


                }
            },
            error : function (data) {
                $(".loader-iumio-m").hide();
                if (typeof reload !== 'undefined')
                    operationError(data);
            }
        })
    };

    /**
     * get debug log (unlimited) with min-max for prod
     */
    var pos2 = 0;
    var call2 = 0;
    var ajaxlogs2 = false;
    var getUnlimitedLogs2 = function (reload) {
        var selector = $('.logslist2');

        if (typeof selector.attr("attr-href") === "undefined")
            return (1);
        if (ajaxlogs2 === true)
            return (1);
        ajaxlogs2 = true;
        $.ajax({
            url : selector.attr("attr-href"),
            type : 'POST',
            data : {'pos' : pos2},
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    var results = (data['results']);
                    if (results.length === 0 && call === 0)
                        return (selector.append("<tr><td colspan='6'>No logs</td></tr>"));

                    $.each(results, function (index, value) {
                        var dateLog = formatDate(new Date(value['time'] * 1000));
                        selector.append("<tr>" +
                            "<td><a href='"+value['log_url']+"'>"+value['uidie']+"</a></td>" +
                            "<td>"+dateLog+"</td>" +
                            "<td>"+value['code']+"</td>" +
                            "<td>"+value['client_ip']+"</td>" +
                            "<td>"+value['method']+"</td>" +
                            "</tr>");
                    });
                    pos2 += results.length;
                    $(".iumiocountlog2").html(pos2);
                    call2++;
                    ajaxlogs2 = false;
                    if (results.length <= 0)
                        return (1);


                }
            },
            error : function (data) {
                $(".loader-iumio-m2").hide();
                if (typeof reload !== 'undefined')
                    operationError(data);
            }
        })
    };


    /**
     * get databases list
     */
    var getDatabasesList = function (reload) {
        var selector = $('.databaseslist');
        if (typeof selector.attr("attr-href") === "undefined")
            return (1);
        $.ajax({
            url : selector.attr("attr-href"),
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    var results = data['results'];
                    selector.html("");
                    if (results.length === 0)
                        return (selector.append("<tr><td colspan='6'>No database configuration</td></tr>"));

                    $.each(results, function (index, value) {
                        selector.append("<tr>" +
                            "<td>"+index+"</td>" +
                            "<td>"+value['db_name']+"</td>" +
                            "<td>"+value['db_host']+"</td>" +
                            "<td>"+value['db_driver']+"</td>" +
                            "<td><button class=' btn-info btn toeditdatabase' attr-href='"+value['edit']+"' attr-href2='"+value['edit_save']+"' attr-dbconfig='"+index+"'>ED</button></td>"+
                            "<td><button class='btn-info btn todeletedatabase' attr-href='"+value['remove']+"' attr-dbconfig='"+index+"'>DE</button></td>"+
                            "</tr>");
                    });
                }
            },
            error : function (data) {
                if (typeof reload !== 'undefined')
                    operationError(data);
            }
        });
    };


    /**
     * get hosts list
     */
    var getHostsList = function (reload) {
        var selector = $('.hostslist');
        if (typeof selector.attr("attr-href") === "undefined")
            return (1);
        $.ajax({
            url : selector.attr("attr-href"),
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    var results = data['results'];
                    selector.html("");
                    if (results.length === 0)
                        return (selector.append("<tr><td colspan='6'>No hosts configuration</td></tr>"));

                    $.each(results, function (index, value) {
                        selector.append("<tr>" +
                            "<td>"+index+"</td>" +
                            "<td>"+value['allowed']+"</td>" +
                            "<td>"+value['denied']+"</td>" +
                            "<td><button class=' btn-info btn toedithosts' attr-href='"+value['edit']+"' attr-href2='"+value['save']+"' attr-env='"+index+"'>ED</button></td>"+
                            "</tr>");
                    });
                }
            },
            error : function (data) {
                if (typeof reload !== 'undefined')
                    operationError(data);
            }
        });
    };

    /**
     * get smarty configuration list
     */
    var getAllSmartyConfigs = function (reload) {

        var selector = $('.smartyconfigs');
        if (typeof selector.attr("attr-href") === "undefined")
            return (1);
        $.ajax({
            url : selector.attr("attr-href"),
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    var results = data['results'];
                    selector.html("");
                    if (results.length === 0)
                        return (selector.append("<tr><td colspan='4'>No smarty configurations</td></tr>"));

                    $.each(results, function (index, value) {
                        selector.append("<tr>" +
                            "<td>"+index+"</td>" +
                            "<td>"+((value['debug'] === true)? "Enabled" : "Disabled") +"</td>" +
                            "<td>"+((value['cache'] === 1)? "Enabled" : "Disabled")+"</td>" +
                            "<td>"+value['console_debug']+"</td>" +
                            "<td><button class=' btn-info btn editsmartyconfig' attr-href='"+value['edit']+"' attr-href2='"+value['save']+"' attr-config='"+index+"'>ED</button></td>"+
                            "</tr>");
                    });
                }
            },
            error : function (data) {
                if (typeof reload !== 'undefined')
                    operationError(data);
            }
        });
    };


    /**
     * get app list
     */
    var simpleapps = null;
    var getAppListSimple = function (reload) {

        var selector = $('.applist');
        if (typeof selector.attr("attr-href") === "undefined")
            return (1);
        $.ajax({
            url : selector.attr("attr-href"),
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    var results = data['results'];
                    selector.html("");
                    if (results.length === 0)
                        return (selector.append("<tr><td colspan='6'>No apps</td></tr>"));

                    $.each(results, function (index, value) {
                        selector.append("<tr>" +
                            "<td>"+index+"</td>" +
                            "<td>"+value['name']+"</td>" +
                            "<td>"+value['enabled']+"</td>" +
                            "<td>"+((value['prefix'] !== "")? "/"+value['prefix'] : "no prefix")+"</td>" +
                            "<td>"+value['class']+"</td>" +
                            "<td><button class=' btn-info btn toeditapp' attr-href2='"+value['link_edit_save']+"' attr-appname='"+value['name']+"' attr-prefix='"+value['prefix']+"' attr-enabled='"+value['enabled']+"' attr-href-config='"+value['link_config']+"'>ED</button></td>"+
                            "<td><button class='btn-info btn deleteapp' attr-href='"+value['link_remove']+"' attr-appname='"+value['name']+"'>DE</button></td>"+
                            "<td><button class='btn-info btn exportapp' attr-href='"+value['link_export']+"' attr-appname='"+value['name']+"'>EXP</button></td>"+
                            "</tr>");
                    });
                    simpleapps = results;

                }
            },
            error : function (data) {
                if (typeof reload !== 'undefined')
                    operationError(data);
            }
        })
    };

    /**
     * Get an app config
     * @param appname The app name
     * @param href Link to get the config
     * @param callback the callback
     * @returns {number}
     */
    var getConfigApp = function (appname, href, callback) {

        $.ajax({
            url : href,
            type : 'POST',
            dataType : 'json',
            data : {'appname' : appname},
            success : function(data){
                if (data['code'] === 200) {
                    callback(data["result"]);
                }
                else {
                    console.error("Cannot get the app : "+appname+ " - Code : "+data['code']+" - "+JSON.stringify(data));
                }
            },
            error : function (data) {
                console.error("Cannot get the app : "+appname+ " - "+JSON.stringify(data))
            }
        })
    };

    /**
     * get all cache environment
     */
    var getAllCacheEnv = function (reload) {
        var selector = $('.getAllEnvCache');
        if (typeof selector.attr("attr-href") === "undefined")
            return (1);
        $.ajax({
            url : selector.attr("attr-href"),
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    var results = data['results'];
                    selector.html("");
                    if (results.length === 0)
                        return (selector.append("<tr><td colspan='6'>No cache directory</td></tr>"));

                    $.each(results, function (index, value) {
                        selector.append("<tr>" +
                            "<td>"+value['name']+"</td>" +
                            "<td>"+value['path']+"</td>" +
                            "<td>"+value['size']+"</td>" +
                            "<td class='"+((value['perms'] === true)? "iumio-green-color" : "iumio-red-color")+"'>"+value['nperms']+" "+((value['perms'] === true)? '<i class="pe-7s-angle-down-circle iumio-green-red-btn" style="color: green;"></i>' : '<i class="pe-7s-close-circle iumio-green-red-btn" style="color: red;"></i>')+"</td>" +
                            "<td>"+value['status']+"</td>" +
                            "<td><button class='btn-info btn clearcachespec' attr-href='"+value['clear']+"' attr-env='"+value['env']+"'>CL</button></td>"+
                            "</tr>");
                    });

                }
            },
            error : function (data) {
                if (typeof reload !== 'undefined')
                    operationError(data);
            }
        })
    };

    /**
     * get all assets
     */
    var getAllAssets = function (reload) {

        var selector = $('.getAllAssets');
        if (typeof selector.attr("attr-href") === "undefined")
            return (1);
        $.ajax({
            url : selector.attr("attr-href"),
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    var results = data['results'];
                    selector.html("");
                    if (results.length === 0)
                        return (selector.append("<tr><td colspan='6'>No assets</td></tr>"));

                    $.each(results, function (index, value) {
                        /**
                         * 0 : AppName
                         * 1 : Have assets (1 ==> contains assets, 0 ==> not exist,  2 ==> Empty)
                         * 3 : Perms on Dev
                         * 4 : Perms on Prod
                         * 5 : Status dev (0==> "Need to publish (redColor)", 1==> "OK (Green Color)")
                         * 6 : Status prod (0==> "Need to publish (redColor)", 1==> "OK (Green Color)")
                         * 7 : Action (Modal with url clear prod and dev , url publish prod and dev)
                         */
                        if (value['haveassets'] === 1) {
                            selector.append("<tr>" +
                                "<td>" + index + "</td>" +
                                "<td>" + value['name'] + "</td>" +
                                "<td>" + ((value['haveassets'] === 1) ? "Yes" : ((value['haveassets'] === 2) ? "Empty" : "No")) + "</td>" +
                                "<td>" + value['dev_perms'] + "</td>" +
                                "<td>" + value['prod_perms'] + "</td>" +
                                "<td class='" + ((value['haveassets'] === 1) ? (((value['status_dev'] === 1) ? 'iumio-green-color' : 'iumio-red-color') + "'>" + ((value['status_dev'] === 1) ? 'Published <i class="pe-7s-angle-down-circle iumio-green-red-btn" style="color: green;"></i>' : 'Need to be published <i class="pe-7s-close-circle iumio-green-red-btn" style="color: red;"></i>')) : "Unavailable") + "</td>" +
                                "<td class='" + ((value['haveassets'] === 1) ? ((value['status_prod'] === 1) ? 'iumio-green-color' : 'iumio-red-color') + "'>" + ((value['status_prod'] === 1) ? 'Published <i class="pe-7s-angle-down-circle iumio-green-red-btn" style="color: green;"></i>' : 'Need to be published <i class="pe-7s-close-circle iumio-green-red-btn" style="color: red;"></i>') : "") + "</td>" +
                                ((value['haveassets'] === 1) ? "<td><button class='btn-info btn showoptionsassets' attr-href-clear-dev='" + value['clear']['dev'] + "' attr-href-clear-prod='" + value['clear']['prod'] + "' attr-href-publish-dev='" + value['publish']['dev'] + "'  attr-href-publish-prod='" + value['publish']['prod'] + "'  attr-href-clear-all='" + value['clear']['all'] + "' attr-href-publish-all='" + value['publish']['all'] + "' attr-appname='" + value['name'] + "' >AC</button></td>" : "<td>Unavailable</td>") +
                                "</tr>");
                        }
                    });

                }
            },
            error : function (data) {
                if (typeof reload !== 'undefined')
                    operationError(data);
            }
        })
    };


    /**
     * get all compile environment
     */
    var getAllCompileEnv = function (reload) {

        var selector = $('.getAllEnvCompile');
        if (typeof selector.attr("attr-href") === "undefined")
            return (1);
        $.ajax({
            url : selector.attr("attr-href"),
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    var results = data['results'];
                    selector.html("");
                    if (results.length === 0)
                        return (selector.append("<tr><td colspan='6'>No compiled directory</td></tr>"));

                    $.each(results, function (index, value) {
                        selector.append("<tr>" +
                            "<td>"+value['name']+"</td>" +
                            "<td>"+value['path']+"</td>" +
                            "<td>"+value['size']+"</td>" +
                            "<td class='"+((value['perms'] === true)? "iumio-green-color" : "iumio-red-color")+"'>"+value['nperms']+" "+((value['perms'] === true)? '<i class="pe-7s-angle-down-circle iumio-green-red-btn" style="color: green;"></i>' : '<i class="pe-7s-close-circle iumio-green-red-btn" style="color: red;"></i>')+"</td>" +
                            "<td>"+value['status']+"</td>" +
                            "<td><button class='btn-info btn clearcompilespec' attr-href='"+value['clear']+"' attr-env='"+value['env']+"'>CL</button></td>"+
                            "</tr>");
                    });

                }
            },
            error : function (data) {
                if (typeof reload !== 'undefined')
                    operationError(data);
            }
        })
    };




    /**
     * Create on app
     */

    var createOneApp = function (href) {
        var name           = $("input[type=text][name=appname]").val();
        var template       = $("input[type=checkbox][name=template]:checked" ).val();
        var enabled      = $( "input[type=checkbox][name=enabled]:checked" ).val();
        var prefix           = $("input[type=text][name=prefix]").val();
        var selecttorModal = $("#modalManager");

        if (name === "")
        {
            selecttorModal.find(".onealert").html("Oups! Enter an app name");
            selecttorModal.find(".onealert").show();
            return (false);
        }

        if (name === "App" || name.length <= 3 || !isValidStr(name))
        {
            selecttorModal.find(".onealert").html("Oups! Error on app name. <br>Your app name must to end with 'App' keyword (example TestApp) ");
            selecttorModal.find(".onealert").show();
            return (false);
        }
        var p2    = name[name.length - 1];
        var p1    = name[name.length - 2];
        var a     = name[name.length - 3];
        var conca = a + p1 + p2;

        if (conca !== "App" && isValidStr(name)) {
            selecttorModal.find(".onealert").html("Oups! Error on app name. <br>Your app name must to end with 'App' keyword (example TestApp) ");
            selecttorModal.find(".onealert").show();
            return (false);
        }

        if (typeof template !== "undefined")
            template = "yes";
        else
            template = "no";

        if (typeof enabled !== "undefined")
            enabled = "yes";
        else
            enabled = "no";

        selecttorModal.find(".onealert").hide();
        priorTask = 1;
        $.ajax({
            url : href,
            type : 'POST',
            dataType : 'json',
            data : {"name" : name, "template" : template, "enabled" : enabled, "prefix" : prefix},
            success : function(data){
                priorTask = 0;
                if (data['code'] === 200)
                {
                    getAppListSimple(true);
                    if (data['code'] === 200)
                        operationSuccess();
                    else {
                        operationError();
                    }
                }
                else {
                    operationError(data);
                }
            },
            error : function (data) {
                priorTask = 0;
                operationError(data);
            }
        })
    };


    /**
     * save database configuration
     */

    var saveDatabaseConfiguration = function (href) {
        var name           = ($("input[type=text][name=name]").val());
        var host           = $("input[type=text][name=host]").val();
        var user           = $("input[type=text][name=user]").val();
        var password       = $("input[type=password][name=password]").val();
        var port           = $("input[type=number][name=port]").val();
        var driver         = $("select[name=driver]").val();

        var selecttorModal = $("#modalManager");

        if (name === ""  || host === ""  || user === ""  || driver === "" )
        {
            selecttorModal.find(".onealert").html("Oups! An error was detected : A parameter is empty");
            selecttorModal.find(".onealert").show();
            return (false);
        }

        selecttorModal.find(".onealert").hide();

        $.ajax({
            url : href,
            type : 'POST',
            dataType : 'json',
            data : {"name" : name, "host" : host, "user" : user, "password" : password,
                "port" : port, "driver" : driver},
            success : function(data){
                if (data['code'] === 200)
                {
                    getDatabasesList(true);
                    if (data['code'] === 200)
                        operationSuccess();
                    else {
                        operationError();
                    }
                }
                else {
                    operationError();
                }
            },
            error : function (data) {
                operationError(data);
            }
        });
    };

    /**
     * save service configuration
     */

    var saveServiceConfiguration = function (href) {
        var namespace      = $("input[type=text][name=namespace]").val();
        var status         = $("input[type=checkbox][name=status]:checked").val();

        var selecttorModal = $("#modalManager");

        if (namespace === ""  || status === "" )
        {
            selecttorModal.find(".onealert").html("Oups! An error was detected");
            selecttorModal.find(".onealert").show();
            return (false);
        }

        if (typeof status !== "undefined")
            status = "enabled";
        else
            status = "disabled";

        selecttorModal.find(".onealert").hide();

        $.ajax({
            url : href,
            type : 'POST',
            dataType : 'json',
            data : {"namespace" : namespace, "status" : status},
            success : function(data){
                if (data['code'] === 200)
                {
                    getServicesList(true);
                    if (data['code'] === 200)
                        operationSuccess();
                    else {
                        operationError();
                    }
                }
                else {
                    operationError();
                }
            },
            error : function (data) {
                operationError(data);
            }
        })
    };

    /**
     * save smarty configuration
     */

    var saveSmartyConfiguration = function (href) {
        var debug           = $("input[type=checkbox][name=debug]:checked").val();
        var cache           = $("input[type=checkbox][name=cache]:checked").val();
        var compile         = $("input[type=checkbox][name=compile]:checked").val();
        var force           = $("input[type=checkbox][name=force]:checked").val();
        var sdebug          = $("input[type=checkbox][name=sdebug]:checked").val();
        var console         = $("input[type=checkbox][name=console]:checked").val();


        var selecttorModal = $("#modalManager");

        if (typeof debug !== "undefined")
            debug = true;
        else
            debug = false;

        if (typeof cache !== "undefined")
            cache = 1;
        else
            cache = 0;

        if (typeof compile !== "undefined")
            compile = true;
        else
            compile = false;

        if (typeof force !== "undefined")
            force = true;
        else
            force = false;

        if (typeof sdebug !== "undefined")
            sdebug = true;
        else
            sdebug = false;

        if (typeof console !== "undefined")
            console = "on";
        else
            console = "off";


        selecttorModal.find(".onealert").hide();

        $.ajax({
            url : href,
            type : 'POST',
            dataType : 'json',
            data : {"debug" : debug, "cache" : cache, "compile" : compile, "force" : force, "sdebug" : sdebug, "console" : console},
            success : function(data){
                if (data['code'] === 200)
                {
                    getDatabasesList(true);
                    if (data['code'] === 200)
                    {
                        operationSuccess();
                        var selecttorModal = $("#modalManager");
                        selecttorModal.find(".btn-close").hide();
                        setTimeout(function () {
                            location.reload();
                        }, 5000)
                    }
                    else
                        operationError();
                }
                else
                    operationError();
            },
            error : function (data) {
                operationError(data);
            }
        });
    };


    /**
     * save edit app
     */

    var saveApp = function (href) {
        var prefix           = $("input[type=text][name=prefix]").val();
        var enabled           = $("input[type=checkbox][name=enabled]:checked").val();

        // Advanced options
        var vdev           = $("select[name=vdev] option:selected").val();
        var vprod          = $("select[name=vprod] option:selected").val();

        var hostsdeva      = $("input[type=text][name=hostsdeva]").val();
        var hostsdevd      = $("input[type=text][name=hostsdevd]").val();
        var hostsproda     = $("input[type=text][name=hostsproda]").val();
        var hostsprodd     = $("input[type=text][name=hostsprodd]").val();


        var selecttorModal = $("#modalManager");

        if (typeof enabled !== "undefined")
            enabled = "yes";
        else
            enabled = "no";

        selecttorModal.find(".onealert").hide();

        $.ajax({
            url : href,
            type : 'POST',
            dataType : 'json',
            data : {"prefix" : prefix, "enabled" : enabled, "vdev" : vdev,
                "vprod" : vprod, "hostsdeva" : hostsdeva, "hostsdevd" : hostsdevd,
                "hostsproda" : hostsproda, "hostsprodd" : hostsprodd},
            success : function(data){
                if (data['code'] === 200)
                {
                    getDatabasesList(true);
                    if (data['code'] === 200)
                    {
                        getAppListSimple(true);
                        operationSuccess();
                    }
                    else
                        operationError();
                }
                else
                    operationError();
            },
            error : function (data) {
                operationError(data);
            }
        });
    };


    /**
     * save an edited locale
     */

    var saveLocale = function (href) {
        var plocale           = $("input[type=text][name=plocale]").val();
        var status           = $("input[type=checkbox][name=status]:checked").val();

        // Advanced options
        var trans_type           = $("select[name=trans_type] option:selected").val();

        var u = [];
        var v = [];
        $('input[name^="localname"]').each(function() {
            u.push($(this).val());
        });
        $('input[name^="localval"]').each(function() {
            v.push($(this).val());
        });

        var locales = {};
        for (var i = 0; i < u.length; i++) {
            locales[u[i]] = v[i];
        }

        var selecttorModal = $("#modalManager");

        if (typeof status !== "undefined")
            status = true;
        else
            status = false;

        selecttorModal.find(".onealert").hide();

        $.ajax({
            url : href,
            type : 'POST',
            dataType : 'json',
            data : {"plocale" : plocale, "status" : status, "trans_type" : trans_type,
                "locales" : locales},
            success : function(data){
                if (data['code'] === 200)
                {
                    getAllLocale(true);
                    operationSuccess();
                }
                else
                    operationError();
            },
            error : function (data) {
                operationError(data);
            }
        });
    };

    /**
     * save edit hosts
     */

    var updateHosts = function (href) {
        var allowed           = $("textarea[name=iumio-hosts-allowed]").val();
        var denied           = $("textarea[name=iumio-hosts-denied]").val();

        var selecttorModal = $("#modalManager");

        selecttorModal.find(".onealert").hide();

        $.ajax({
            url : href,
            type : 'POST',
            dataType : 'json',
            data : {"allowed" : allowed, "denied" : denied},
            success : function(data){
                if (data['code'] === 200)
                {
                    getHostsList(true);
                    operationSuccess();
                }
                else
                    operationError();
            },
            error : function (data) {
                operationError(data);
            }
        });
    };


    /**
     * create database configuration
     */

    var createDatabaseConfiguration = function (href) {
        var config         = ($("input[type=text][name=config]").val());
        var name           = ($("input[type=text][name=name]").val());
        var host           = $("input[type=text][name=host]").val();
        var user           = $("input[type=text][name=user]").val();
        var password       = $("input[type=password][name=password]").val();
        var port           = $("input[type=number][name=port]").val();
        var driver         = $("select[name=driver]").val();


        var selecttorModal = $("#modalManager");

        if (config === ""  || name === ""  || host === ""  || user === ""  || password === ""  || driver === "" )
        {
            selecttorModal.find(".onealert").html("Oups! An error was detected");
            selecttorModal.find(".onealert").show();
            return (false);
        }

        selecttorModal.find(".onealert").hide();

        $.ajax({
            url : href,
            type : 'POST',
            dataType : 'json',
            data : {"config" : config, "name" : name, "host" : host, "user" : user, "password" : password, "port" : port, "driver" : driver},
            success : function(data){
                if (data['code'] === 200)
                {
                    getDatabasesList(true);
                    if (data['code'] === 200)
                        operationSuccess();
                    else
                        operationError();
                }
                else
                    operationError();
            },
            error : function (data) {
                operationError(data);
            }
        });
    };



    /**
     * create service configuration
     */

    var createserviceconfig = function (href) {
        var name           = $("input[type=text][name=name]").val();
        var namespace      = $("input[type=text][name=namespace]").val();
        var status         = $("input[type=checkbox][name=status]:checked").val();

        var selecttorModal = $("#modalManager");

        if (name === "" || namespace === ""  || status === "" )
        {
            selecttorModal.find(".onealert").html("Oups! An error was detected");
            selecttorModal.find(".onealert").show();
            return (false);
        }

        if (typeof status !== "undefined")
            status = "enabled";
        else
            status = "disabled";

        selecttorModal.find(".onealert").hide();

        $.ajax({
            url : href,
            type : 'POST',
            dataType : 'json',
            data : {'name' : name, "namespace" : namespace, "status" : status},
            success : function(data){
                if (data['code'] === 200)
                {
                    getServicesList(true);
                    if (data['code'] === 200)
                        operationSuccess();
                    else
                        operationError();
                }
                else
                    operationError();
            },
            error : function (data) {
                operationError(data);
            }
        });
    };



    /**
     * Switch app to defalt
     * @param url Url to switch app
     */
    var getSwitchApp = function (url) {

        $.ajax({
            url : url,
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    getAppListSimple(true);
                    operationSuccess();
                }
            },
            error : function (data) {
                operationError(data);
            }
        })
    };



    /**
     * Build the class map
     * @param url Url to build class map
     */
    var autoBuildManager = function (url) {

        $.ajax({
            url : url,
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    operationSuccess();
                }
            },
            error : function (data) {
                operationError(data);
            }
        })
    };

    /**
     * Clear the class map
     * @param url Url to clear class map
     */
    var autoClearManager = function (url) {

        $.ajax({
            url : url,
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    operationSuccess();
                }
            },
            error : function (data) {
                operationError(data);
            }
        })
    };


    /**
     * Get time elapsed time (minutes) for reload data deployment
     * @param selector The selector to change value
     */
    var loadElapsedTimeDeployment = function (selector) {
        var i =  parseInt(selector.html());
        selector.html(i + 1);
    };

    var onCallDeploy = 0;
    var last_update_requirements_deploy = 0;
    /**
     * Clear the requirements for deployment
     */
    var getRequirementsDeployment = function (reload) {

        if (onCallDeploy === 1)
            return (false);
        onCallDeploy = 1;
        var selector = $(".requirements-deployment");
        if (typeof selector.attr("attr-href") === "undefined")
            return (1);
        if (selector.attr("attr-current-default-env") === "prod")
            return (false);
        var url = selector.attr("attr-href");
        var lock = 0;
        selector.html("<tr><td><i class='fa fa-spinner fa-spin fa-2x'></i>  <span class='text-info text-lg-center' style='padding-left: 20px; font-size: 20px'>Loading...</span> </td></tr>")
        $.ajax({
            url : url,
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    var rs = data['results'];

                    selector.html("");
                    $.each(rs, function (index, value) {
                        selector.append("<tr>\n" +
                            "    <td class='break-word'>\n" +
                            "    <div class=\"checkbox break-word\">\n" +
                            "        <input id=\"checkbox1\" type=\"checkbox\">\n" +
                            "        <label for=\"checkbox1\"></label>\n" +
                            "        </div>\n" +
                            "        </td>\n" +
                            "        <td class=\"text-left break-word'\">"+value['s']+"</td>\n" +
                            "        <td class=\"td-actions text-right break-word'\">\n" +
                            "        <i class=\"fa "+((value["status"] == false)? "fa-times text-danger" : "fa-check text-success")+"\"></i>\n" +
                            "        </td>\n" +
                            "        </tr>");
                        if (value["status"] == false)
                            lock++;
                    });

                    var sdep = $(".deployprod");
                    var tdep = $(".text-deploy-iumio");
                    if (lock > 0) {

                        sdep.attr("disabled", "disabled");
                        sdep.removeClass("btn-success");
                        sdep.addClass("btn-danger");
                        tdep.html("Your environment is not ready to be deployed");
                        tdep.removeClass("text-success");
                        tdep.addClass("text-danger");
                    }
                    else
                    {
                        sdep.removeAttr("disabled");
                        sdep.removeClass("btn-danger");
                        sdep.addClass("btn-success");
                        tdep.html("Your environment is ready to be deployed");
                        tdep.removeClass("text-danger");
                        tdep.addClass("text-success");

                    }

                    $(".last_up_req_deploy").html(0);
                    onCallDeploy = 0;

                }
            },
            error : function (data) {
                onCallDeploy = 0;
                if (typeof reload !== 'undefined')
                    operationError(data);
            }
        })
    };



    /**
     * Undeployed applications
     * @param url Url to undeployed
     */
    var undeployed = function (url) {

        $.ajax({
            url : url,
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    operationSuccessReload(3000);
                }
            },
            error : function (data) {
                operationError(data);
            }
        })
    };

    /**
     * deployed applications
     * @param url Url to deployed
     */
    var deployed = function (url) {

        $.ajax({
            url : url,
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    operationSuccessReload(3000);
                }
            },
            error : function (data) {
                operationError(data);
            }
        })
    };

    /**
     * remove a routing file
     * @param url Url to remove routing file
     */
    var removeRouting = function (url) {

        $.ajax({
            url : url,
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    getRoutingList(true);
                    operationSuccess();
                }
            },
            error : function (data) {
                operationError(data);
            }
        })
    };

    /**
     * Dashboard Statistics
     * @param url Url to have dashboard stats
     */
    var dashboardStatistics = function (reload) {
        var selector = $('.dashboardStats');
        if (typeof selector.attr('attr-href') == 'undefined')
            return (1);
        $.ajax({
            url : selector.attr("attr-href"),
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    var rs = data['results'];
                    $('.dashb-app').html(rs['apps']['number']);
                    $('.dashb-appena').html(rs['apps']['prefixed']);
                    $('.dashb-apppre').html(rs['apps']['enabled']);

                    $('.dashb-dbco').html(rs['dbs']['number']);

                    $('.dashb-route').html(rs['routes']['number']);
                    $('.dashb-routedisa').html(rs['routes']['disabled']);
                    $('.dashb-routevisi').html(rs['routes']['public']);

                    $('.dashb-reqsuc-dev').html(rs['logs']['dev']['success']);
                    $('.dashb-err-dev').html(rs['logs']['dev']['errors']);
                    $('.dashb-errcri-dev').html(rs['logs']['dev']['critical']);
                    $('.dashb-erroth-dev').html(rs['logs']['dev']['others']);

                    $('.dashb-reqsuc-prod').html(rs['logs']['prod']['success']);
                    $('.dashb-err-prod').html(rs['logs']['prod']['errors']);
                    $('.dashb-errcri-prod').html(rs['logs']['prod']['critical']);
                    $('.dashb-erroth-prod').html(rs['logs']['prod']['others']);

                    $('.dashb-services').html(rs['services']['number']);
                    $('.dashb-services-ena').html(rs['services']['enabled']);
                }
            },
            error : function (data) {
                if (typeof reload !== 'undefined')
                    operationError(data);
            }
        })
    };

    /**
     * Autoloader Statistics
     * @param url Url to have autoloader stats
     */
    var autoloaderStatistics = function () {

        var selector = $('.autoloaderStats');
        if (typeof selector.attr("attr-href") === "undefined")
            return (1);
        $.ajax({
            url : selector.attr("attr-href"),
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    var rs = data['results'];
                    $('.class-auto-dev').html(rs['ccdev']);
                    $('.class-auto-prod').html(rs['ccprod']);
                    $('.uni-auto').html(rs['ufile']);
                    $('.mast-auto').html(rs['appmaster']);
                    $('.app-auto').html(rs['appclass']);
                    $('.build-dev').html(rs['lastbuilddev']);
                    $('.build-prod').html(rs['lastbuildprod']);
                }
            },
            error : function (data) {
                operationError(data);
            }
        })
    };

    /**
     * export an app
     * @param url Url to export app
     */
    var exportApp = function (url) {

        $.ajax({
            url : url,
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    getAppListSimple(true);
                    operationSuccess();
                }
            },
            error : function (data) {
                operationError(data);
            }
        })
    };


    /**
     * install an app
     * @param url Url to install app
     */
    var installApp = function (url) {

        var file_data = $('#apppackage').prop('files')[0];
        var form_data = new FormData();
        form_data.append('file', file_data);
        $.ajax({
            url : url,
            type : 'POST',
            data: form_data,
            contentType: false,
            cache: false,
            processData:false,

            success : function(data){
                var ndata = JSON.parse(data);
                if (ndata['code'] === 200)
                {
                    getAppListSimple(true);
                    operationSuccess();
                    $("#modalManager").find(".modal-body").append("<h5 class='text-center' style='color: limegreen'><em>"+ndata["ext"]+"</em></h5>");
                }
            },
            error : function (data) {
                operationError(data);
                var d = JSON.parse(data["responseText"]);
                $("#modalManager").find(".modal-body").append("<h5 class='text-center' style='color: red'><em>"+d["msg"]+"</em></h5>");
            }
        })
    };




    /**
     * rebuild js routing file
     * @param url Url to rebuild js routing file
     */
    var rebuildJS = function (url) {

        $.ajax({
            url : url,
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    getRoutingList(true);
                    operationSuccess();
                }
            },
            error : function (data) {
                operationError(data);
            }
        })
    };



    /**
     * Clear logs
     * @param url Url to clear logs
     */
    var clearLogs = function (url) {
        $.ajax({
            url : url,
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    operationSuccess();
                    getUnlimitedLogs(true);
                    getUnlimitedLogs2(true);
                }
            },
            error : function (data) {
                operationError(data);
            }
        })
    };



    /**
     * remove an app
     * @param url Url to remove app
     */
    var removeApp = function (url) {
        priorTask = 1;

        $.ajax({
            url : url,
            type : 'POST',
            dataType : 'json',
            success : function(data){
                var d = data;
                priorTask = 0;
                if (d['code'] === 200)
                {
                    if (d['msg'] === "RELOAD")
                    {
                        noapp = true;
                        operationSuccess();
                        var selecttorModal = $("#modalManager");
                        selecttorModal.find(".modal-body").html("<h4 class='text-center'>You have no longer registered apps.</h4>");
                        selecttorModal.find(".modal-body").append("<h4 class='text-center'><em>Redirects to the framework installer</em></h4>");
                        selecttorModal.find(".btn-close").hide();
                        selecttorModal.find(".btn-valid").hide();
                        $("html").attr("style", "pointer-events:none;bottom: 0;left: 0;position: fixed;right: 0;top: 0;");
                        $("body").attr("style", "pointer-events:none;bottom: 0;left: 0;position: fixed;right: 0;top: 0;");
                        setTimeout(function () {
                            location.reload();
                        }, 5000);

                    }
                    else
                    {
                        getAppListSimple(true);
                        operationSuccess();
                    }
                }

                else
                    operationError();
            },
            error : function (data) {
                priorTask = 0;
                operationError(data);
            }
        })
    };


    /**
     * clear all cache
     * @param url Url to remove all cache
     */
    var clearAllCache = function (url) {

        $.ajax({
            url : url,
            type : 'POST',
            dataType : 'json',
            success : function(data){
                getAllCacheEnv(true);
                if (data['code'] === 200)
                    operationSuccess();
                else
                    operationError();
            },
            error : function (data) {
                operationError(data);
            }
        })
    };


    /**
     * clear all compile
     * @param url Url to remove all compile
     */
    var clearAllCompile = function (url) {

        $.ajax({
            url : url,
            type : 'POST',
            dataType : 'json',
            success : function(data){
                getAllCompileEnv();
                if (data['code'] === 200)
                    operationSuccess();
                else
                    operationError();
            },
            error : function (data) {
                operationError(data);
            }
        })
    };

    /**
     * clear cache for specific env
     * @param url Url to clear cache for specific env
     */
    var clearCache = function (url) {

        $.ajax({
            url : url,
            type : 'POST',
            dataType : 'json',
            success : function(data){
                getAllCacheEnv(true);
                if (data['code'] === 200)
                    operationSuccess();
                else
                    operationError();
            },
            error : function (data) {
                operationError(data);
            }
        })
    };


    /**
     * Change status of locale
     * @param url Url to change locale framework status
     */
    var changestatuslocale = function (url) {

        $.ajax({
            url : url,
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200) {
                    operationSuccess();
                    $("#modalManager").find(".btn-close").hide();
                    setTimeout(function () {
                        location.reload()
                    }, 1500);
                }
                else
                    operationError();
            },
            error : function (data) {
                operationError(data);
            }
        })
    };

    /**
     * Change status of app locale
     * @param url Url to change local app status
     */
    var changestatuslocaleapp = function (url) {

        $.ajax({
            url : url,
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200) {
                    getAllLocale(true);
                    operationSuccess();
                }
                else
                    operationError();
            },
            error : function (data) {
                operationError(data);
            }
        })
    };


    /**
     * clear compile for specific env
     * @param url Url to clear compile for specific env
     */
    var clearCompile = function (url) {

        $.ajax({
            url : url,
            type : 'POST',
            dataType : 'json',
            success : function(data){
                getAllCompileEnv();
                if (data['code'] === 200)
                    operationSuccess();
                else
                    operationError();
            },
            error : function (data) {
                operationError(data);
            }
        })
    };


    /**
     * remove db configuration
     * @param url Url to remove db
     */
    var removeDb = function (url) {

        $.ajax({
            url : url,
            type : 'POST',
            dataType : 'json',
            success : function(data){
                getDatabasesList(true);
                if (data['code'] === 200)
                    operationSuccess();
                else
                    operationError();
            },
            error : function (data) {
                operationError(data);
            }
        })
    };

    /**
     * remove service configuration
     * @param url Url to remove service
     */
    var removeService = function (url) {

        $.ajax({
            url : url,
            type : 'POST',
            dataType : 'json',
            success : function(data){
                getServicesList(true);
                if (data['code'] === 200)
                    operationSuccess();
                else
                    operationError();
            },
            error : function (data) {
                operationError(data);
            }
        })
    };

    /**
     * Publish assets
     * @param url Url to publish
     */
    var assetsPublishManager = function (url) {

        $.ajax({
            url : url,
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                    operationSuccess();
                else
                    operationError();
            },
            error : function (data) {
                operationError(data);
            }
        })
    };


    /**
     * Clear assets
     * @param url Url to clear
     */
    var assetsClearManager = function (url) {

        $.ajax({
            url : url,
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                    operationSuccess();
                else
                    operationError();
            },
            error : function (data) {
                operationError(data);
            }
        })
    };



    /**
     * Event to switch default app
     */
    $(document).on('click', ".todefaultapp", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var appname = selector.attr("attr-appname");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Switch to default</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Are you sure to set <strong>"+appname+"</strong> default app ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "switchapp");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });

    /**
     * Event to switch default app
     */
    $(document).on('click', ".switchdeploy", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Switch to dev environment</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Are you sure to undeployed all applications ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "confirmundeployed");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });

    //

    /**
     * Event to publish all assets for all env
     */
    $(document).on('click', ".publishallassets", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Publish all assets - all environments</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Are you sure to publish all assets for all environments ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "pallassets");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });


    /**
     * Event to change status locale
     */
    $(document).on('click', ".changestatuslocaleevent", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var mode = selector.attr("attr-mode");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Change the locale status</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Are you sure to "+mode+" locale ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "changestatuslocale");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });

    /**
     * Event to publish all assets for dev env
     */
    $(document).on('click', ".publishalldevassets", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Publish all assets - dev environment</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Are you sure to publish all assets for dev environment ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "palldevassets");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });

    /**
     * Event to publish all assets for prod env
     */
    $(document).on('click', ".publishallprodassets", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Publish all assets - prod environment</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Are you sure to publish all assets for prod environment ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "pallprodassets");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });


    /**
     * Event to clear all assets for all env
     */
    $(document).on('click', ".clearallassets", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Clear all assets - all environments</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Do you want to clear all assets for all environments ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "callassets");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });

    /**
     * Event to clear all assets for dev env
     */
    $(document).on('click', ".clearalldevassets", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Clear all assets - dev environment</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Do you want to clear all assets for dev environment ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "calldevassets");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });

    /**
     * Event to clear all assets for prod env
     */
    $(document).on('click', ".clearallprodassets", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Clear all assets - prod environment</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Do you want to clear all assets for prod environment ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "callprodassets");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });


    /**
     * Event to deploy to production
     */
    $(document).on('click', ".deployprod", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        if (selector.attr("disabled") == "disabled")
            return (false);

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Deploy to production</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Do you want to start the deployment to production environment ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "deployprodconfirm");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });

    /**
     * Event to delete an app
     */
    $(document).on('click', ".deleteapp", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var appname = selector.attr("attr-appname");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Delete "+appname+"</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Do you want to delete <strong>"+appname+"</strong> ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "removeapp");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });


    /**
     * Event to delete an database configuration
     */
    $(document).on('click', ".todeletedatabase", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var name = selector.attr("attr-dbconfig");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Delete "+name+"</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Do you want to delete <strong>"+name+"</strong> database configuration ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "removedb");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });

    /**
     * Event to delete a service configuration
     */
    $(document).on('click', ".deleteservice", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var name = selector.attr("attr-servicename");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Delete "+name+" service</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Do you want to delete <strong>"+name+"</strong> service configuration ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "removeservice");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });

    /**
     * Event to edit u3i
     */
    var editu3i = false;
    $(document).on('click', ".u3i", function () {
        if (true === editu3i) {
            return ;
        }
        var selector = $(this);
        editu3i = true;
        selector.addClass("u3i-new").removeClass("u3i");
        var href = selector.attr("attr-href");
        var content = selector.html();
        selector.html("<input type='text' class='u3i-edit form-control-sm' value='"+content+"' /><button type='button' class='u3i-btn-save' attr-href='"+href+"'>Save</button> ");
    });


    /**
     * Event to save edit u3i
     */
    $(document).on('click', ".u3i-btn-save", function () {
        var content = $(".u3i-edit").val();
        var href = $(this).attr("attr-href");

        $.ajax({
            url : href,
            type : 'POST',
            dataType : 'json',
            data : {"u3i" : content},
            success : function(data){
                if (data['code'] === 200)
                {
                    $(".u3i-new").addClass("u3i").removeClass("u3i-new");
                    $(".u3i").html(content);
                    editu3i = false;
                }
                else
                {
                    operationError();
                    return (0);
                }
            },
            error : function (data) {
                operationError(data);
            }
        });
    });

    /**
     * Event to override js routing
     */
    $(document).on('click', ".rebuildjs", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Rebuild JS Routing</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Do you want to rebuild the JS routing file ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "rebuildjsok");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });



    /**
     * Event to validate an event
     */
    $(document).on('click', ".btn-valid", function () {
        var selector = $(this);
        var event = selector.attr("attr-event");
        var href = selector.attr("attr-href");

        switch (event)
        {
            case "switchapp":
                getSwitchApp(href);
                break;
            case "removeapp":
                removeApp(href);
                break;
            case "createvalidapp":
                createOneApp(href);
                break;
            case "clearlogs":
                clearLogs(href);
                break;
            case "removedb":
                removeDb(href);
                break;
            case "removeservice":
                removeService(href);
                break;
            case "editdatabasesave":
                saveDatabaseConfiguration(href);
                break;
            case "createsaveservice":
                createserviceconfig(href);
                break;
            case "editservicesave":
                saveServiceConfiguration(href);
                break;
            case "createsavedatabase":
                createDatabaseConfiguration(href);
                break;
            case "clearallcache":
                clearAllCache(href);
                break;
            case "clearcache":
                clearCache(href);
                break;
            case "clearallcompile":
                clearAllCompile(href);
                break;
            case "clearcompile":
                clearCompile(href);
                break;
            case "changestatuslocale":
                changestatuslocale(href);
                break;

            case "editsmartysave":
                saveSmartyConfiguration(href);
                break;
            case "editappsave":
                saveApp(href);
                break;
            case "editlocalesave":
                saveLocale(href);
                break;
            case "rebuildjsok":
                rebuildJS(href);
                break;
            case "removearouting":
                removeRouting(href);
                break;
            case "processtoexportapp":
                exportApp(href);
                break;
            case "installapp":
                installApp(href);
                break;
            case "applychangelocalapp":
                changestatuslocaleapp(href);
                break;

            case "callprodassets":
            case "calldevassets":
            case "callassets":
                assetsClearManager(href);
                break;
            case "pallprodassets":
            case "palldevassets":
            case "pallassets":
                assetsPublishManager(href);
                break;
            case "bautodev":
            case "bautoprod":
            case "bautoall":
                autoBuildManager(href);
                break;
            case "cautodev":
            case "cautoprod":
            case "cautoall":
                autoClearManager(href);
                break;
            case "editsavehosts":
                updateHosts(href);
                break;
            case "confirmundeployed":
                undeployed(href);
                break;
            case "deployprodconfirm":
                deployed(href);
                break;

        }
    });


    /**
     * Event to show create app modal
     */
    $(document).on('click', ".createapp", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");

        selecttorModal.find(".modal-header").html("<strong class='text-center'>Create one app</strong>");
        selecttorModal.find(".modal-header").append("<p class='alert alert-danger onealert' style='display: none'></p>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Fill in the fields to create an application.</h4>");
        selecttorModal.find(".modal-body").append("<br>");
        selecttorModal.find(".modal-body").append("<div class='container'><div class='row'>");

        selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Name</label><input type='text' name='appname' class='form-control'></div>");
        selecttorModal.find(".modal-body").append("</div></div>");
        selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Prefix</label><input type='text' name='prefix' class='form-control'></div>");
        selecttorModal.find(".modal-body").append("</div></div>");
        selecttorModal.find(".modal-body").append('<div class="container-new">' +
            '<div class="form-group text-center"> <label>Default template</label> <div class="check"><input id="check" type="checkbox" name="template" style="display: none"/><label for="check"><div class="box"><i class="fa fa-check"></i></div> </label></div></div>' +
            '<div class="form-group text-center"><label>Enabled</label> <div class="check"><input id="check1" name="enabled"  type="checkbox" style="display: none" /><label for="check1"><div class="box"><i class="fa fa-check"></i></div> </label></div></div>' +
            '</div>');

        selecttorModal.find(".btn-close").html("Close");
        selecttorModal.find(".btn-valid").html("Create");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "createvalidapp");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });

    /**
     * Event to show edit locale app modal
     */
    $(document).on('click', ".toeditlocaleapp", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var href2 = selector.attr("attr-href2");
        var name = selector.attr("attr-appname");
        var result = null;

        $.ajax({
            url : href,
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    result = data['results'];
                    var selecttorModal = $("#modalManager");

                    selecttorModal.find(".modal-header").html("<strong class='text-center'>Edit locale configuration for "+name+"</strong>");
                    selecttorModal.find(".modal-header").append("<p class='alert alert-danger onealert' style='display: none'></p>");
                    selecttorModal.find(".modal-body").html("<h4 class='text-center'>Edit fields to update locale configuration.</h4>");
                    selecttorModal.find(".modal-body").append("<br>");
                    selecttorModal.find(".modal-body").append("<div class='container'><div class='row'>");
                    selecttorModal.find(".modal-body").append('<div class="container-new">' +
                        '<div class="form-group text-center"> <label>Enabled</label> <div class="check"><input id="check" type="checkbox" name="status" '+((result['enabled'] === true)? "checked='checked'" : "")+' style="display: none"/><label for="check"><div class="box"><i class="fa fa-check"></i></div> </label></div></div>' +
                        '</div>');
                    selecttorModal.find(".modal-body").append("</div></div>");
                    selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Locale values locale</label></div>");
                    var table = $('<table/>').addClass('table').addClass("table-bordered table-iumio-locale");
                    var rowf = $('<thead>').html('<tr><td>Locale</td><td>URL</td><td>Delete</td></tr>');
                    table.append(rowf);
                    var rowg = $('<tbody/>').addClass("iumiolocaleitem-tbody");
                    if (typeof result.values[0] !== "undefined") {
                        var u = result.values[0];
                        var i = 0;
                        for (var k in u) {
                            var row = $('<tr>').html("<td><input type='text' name='localname["+i+"]' value='"+k+"' /></td><td><input type='text' name='localval["+i+"]' value='"+u[k]+"' /></td><td><button type='button' class='btn btn-danger removelocaleitem'><i class='fa fa-remove'/> </button> </td>");
                            i++;
                            rowg.append(row);

                        }

                    }
                    table.append(rowg);
                    selecttorModal.find(".modal-body").append(table);

                    selecttorModal.find(".modal-body").append("<div class='form-group text-center'><button type='button' class='adddlocaleitem btn btn-success'>Add locale item</button> </div>");
                    selecttorModal.find(".modal-body").append("</div></div>");

                    selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Default locale</label><input type='text' name='plocale' class='form-control text-center' value='"+((null !== result['prefered'])? result['prefered'] : "")+"'></div>");
                    selecttorModal.find(".modal-body").append("</div></div>");

                    selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Translation type</label> <select name='trans_type' class='form-control'>"+
                        "<option value='' value='null'>Select a translation type</option> " +
                        "<option value='json' "+((result['transtype'] == "json")? "selected" : "")+">JSON</option> " +
                        "<option value='poedit' "+((result['transtype'] == "poedit")? "selected" : "")+">POEDIT</option> " +
                        "</select></div>");
                    selecttorModal.find(".modal-body").append("</div></div>");

                    selecttorModal.find(".btn-close").html("Close");
                    selecttorModal.find(".btn-valid").html("Update");

                    selecttorModal.find(".btn-valid").attr("attr-href", href2);
                    selecttorModal.find(".btn-valid").attr("attr-appname", name);
                    selecttorModal.find(".btn-valid").attr("attr-event", "editlocalesave");
                    selecttorModal.find(".btn-close").show();
                    selecttorModal.find(".btn-valid").show();

                    modal("show");
                }
                else
                {
                    operationError();
                    return (0);
                }
            }
        });
    });


    /**
     * Event to remove a locale item
     */
    $(document).on('click', ".removelocaleitem", function () {
        var selector = $(this);
        selector.parent().parent().remove();
    });

    /**
     * Event to add a locale item
     */
    $(document).on('click', ".adddlocaleitem", function () {
        var count = ($(".iumiolocaleitem-tbody > tr").length) + 1;
        $(".iumiolocaleitem-tbody").append("<tr><td><input type='text' name='localname["+count+"]' value='' /></td><td><input type='text' name='localval["+count+"]' value='' /></td><td><button type='button' class='btn btn-danger removelocaleitem'><i class='fa fa-remove'/> </button> </td></tr>");
    });


    /**
     * Event to show edit database modal
     */
    $(document).on('click', ".toeditdatabase", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var href2 = selector.attr("attr-href2");
        var name = selector.attr("attr-dbconfig");
        var result = null;

        $.ajax({
            url : href,
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    result = data['results'];
                    var selecttorModal = $("#modalManager");

                    selecttorModal.find(".modal-header").html("<strong class='text-center'>Edit "+name+" configuration</strong>");
                    selecttorModal.find(".modal-header").append("<p class='alert alert-danger onealert' style='display: none'></p>");
                    selecttorModal.find(".modal-body").html("<h4 class='text-center'>Edit fields to update database configuration.</h4>");
                    selecttorModal.find(".modal-body").append("<br>");
                    selecttorModal.find(".modal-body").append("<div class='container'><div class='row'>");

                    selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Configuration name</label><input type='text' name='config' class='form-control text-center' value='"+name+"' disabled='disabled'></div>");
                    selecttorModal.find(".modal-body").append("</div></div>");
                    selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Name</label><input type='text' name='name' class='form-control text-center' value='"+result['db_name']+"'></div>");
                    selecttorModal.find(".modal-body").append("</div></div>");
                    selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Host</label><input type='text' name='host' class='form-control text-center' value='"+result['db_host']+"'></div>");
                    selecttorModal.find(".modal-body").append("</div></div>");
                    selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>User name</label><input type='text' name='user' class='form-control text-center' value='"+result['db_user']+"'></div>");
                    selecttorModal.find(".modal-body").append("</div></div>");
                    selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>User password</label><input type='password' name='password' class='form-control text-center' value='"+result['db_password']+"'></div>");
                    selecttorModal.find(".modal-body").append("</div></div>");
                    selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Port</label><input type='number' name='port' class='form-control text-center' value='"+result['db_port']+"'></div>");
                    selecttorModal.find(".modal-body").append("</div></div>");
                    selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Driver</label> <select name='driver' class='form-control'>"+
                        "<option value='mysql' "+((result['db_driver'] == "mysql")? "selected" : "")+">MySQL</option> " +
                        "<option value='pgsql' "+((result['db_driver'] == "pgsql")? "selected" : "")+">PostgreSQL</option> " +
                        "<option value='sqlsrv' "+((result['db_driver'] == "sqlsrv")? "selected" : "")+">Microsoft SQL Server</option> " +
                        "<option value='cubrid' "+((result['db_driver'] == "cubrid")? "selected" : "")+">CUBRID</option> " +
                        "<option value='firebird' "+((result['db_driver'] == "firebird")? "selected" : "")+">Firebird</option> " +
                        "<option value='ibm' "+((result['db_driver'] == "ibm")? "selected" : "")+">IBM</option> " +
                        "<option value='informix' "+((result['db_driver'] == "informix")? "selected" : "")+">Informix</option> " +
                        "<option value='sybase' "+((result['db_driver'] == "sybase")? "selected" : "")+">Sybase</option> " +
                        "<option value='mssql' "+((result['db_driver'] == "mssql")? "selected" : "")+">FreeTDS</option> " +
                        "<option value='dblib' "+((result['db_driver'] == "dblib")? "selected" : "")+">Microsoft SQL Server (dblib)</option> " +
                        "<option value='oci' "+((result['db_driver'] == "oci")? "selected" : "")+">Oracle</option> " +
                        "<option value='odbc' "+((result['db_driver'] == "odbc")? "selected" : "")+">IBM DB2 Call Level</option> " +
                        "<option value='4D' "+((result['db_driver'] == "4D")? "selected" : "")+">4D</option> " +
                        "</select></div>");
                    selecttorModal.find(".modal-body").append("</div></div>");

                    selecttorModal.find(".btn-close").html("Close");
                    selecttorModal.find(".btn-valid").html("Update");

                    selecttorModal.find(".btn-valid").attr("attr-href", href2);
                    selecttorModal.find(".btn-valid").attr("attr-dbconfig", name);
                    selecttorModal.find(".btn-valid").attr("attr-event", "editdatabasesave");
                    selecttorModal.find(".btn-close").show();
                    selecttorModal.find(".btn-valid").show();

                    modal("show");
                }
                else
                {
                    operationError();
                    return (0);
                }
            }
        });
    });

    /**
     * Event to show edit service modal
     */
    $(document).on('click', ".editservice", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var href2 = selector.attr("attr-href2");
        var name = selector.attr("attr-servicename");
        var result = null;

        $.ajax({
            url : href,
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    result = data['results'];
                    var selecttorModal = $("#modalManager");

                    selecttorModal.find(".modal-header").html("<strong class='text-center'>Edit "+name+" service configuration</strong>");
                    selecttorModal.find(".modal-header").append("<p class='alert alert-danger onealert' style='display: none'></p>");
                    selecttorModal.find(".modal-body").html("<h4 class='text-center'>Edit fields to update service configuration.</h4>");
                    selecttorModal.find(".modal-body").append("<br>");
                    selecttorModal.find(".modal-body").append("<div class='container'><div class='row'>");

                    selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Namespace</label><input type='text' name='namespace' class='form-control text-center' value='"+result['namespace']+"'></div>");
                    selecttorModal.find(".modal-body").append("</div></div>");
                    selecttorModal.find(".modal-body").append('<div class="container-new">' +
                        '<div class="form-group text-center"> <label>Enabled</label> <div class="check"><input id="check" type="checkbox" name="status" '+((result['status'] === "enabled")? "checked='checked'" : "")+' style="display: none"/><label for="check"><div class="box"><i class="fa fa-check"></i></div> </label></div></div>' +
                        '</div>');
                    selecttorModal.find(".modal-body").append("</div></div>");

                    selecttorModal.find(".btn-close").html("Close");
                    selecttorModal.find(".btn-valid").html("Update");

                    selecttorModal.find(".btn-valid").attr("attr-href", href2);
                    selecttorModal.find(".btn-valid").attr("attr-servicename", name);
                    selecttorModal.find(".btn-valid").attr("attr-event", "editservicesave");
                    selecttorModal.find(".btn-close").show();
                    selecttorModal.find(".btn-valid").show();

                    modal("show");
                }
                else
                {
                    operationError();
                    return (0);
                }
            }
        });
    });

    /**
     * Event to show edit database modal
     */
    $(document).on('click', ".toedithosts", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var href2 = selector.attr("attr-href2");
        var name = selector.attr("attr-env");
        var result = null;

        $.ajax({
            url : href,
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    result = data['results'];
                    var allowed = result['allowed'];
                    var denied = result['denied'];
                    var selecttorModal = $("#modalManager");

                    selecttorModal.find(".modal-header").html("<strong class='text-center'>Edit hosts for "+name+" environment</strong>");
                    selecttorModal.find(".modal-header").append("<p class='alert alert-danger onealert' style='display: none'></p>");
                    selecttorModal.find(".modal-body").html("<h4 class='text-center'>Split each host with ; delimiter</h4>");
                    selecttorModal.find(".modal-body").append("<br>");
                    selecttorModal.find(".modal-body").append("<div class='container'><div class='row'>");

                    selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Allowed hosts</label><textarea type='text' name='iumio-hosts-allowed' class='form-control text-center'>"+allowed+"</textarea></div>");
                    selecttorModal.find(".modal-body").append("</div></div>");
                    selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Denied hosts</label><textarea type='text' name='iumio-hosts-denied' class='form-control text-center' >"+denied+"</textarea></div>");
                    selecttorModal.find(".modal-body").append("</div></div>");

                    selecttorModal.find(".btn-close").html("Close");
                    selecttorModal.find(".btn-valid").html("Update");

                    selecttorModal.find(".btn-valid").attr("attr-href", href2);
                    selecttorModal.find(".btn-valid").attr("attr-denv", name);
                    selecttorModal.find(".btn-valid").attr("attr-event", "editsavehosts");
                    selecttorModal.find(".btn-close").show();
                    selecttorModal.find(".btn-valid").show();

                    modal("show");
                }
                else
                {
                    operationError();
                    return (0);
                }
            }
        });
    });

    /**
     * Event to import an app
     */
    $(document).on('click', ".importapp", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");

        selecttorModal.find(".modal-header").html("<strong class='text-center'>Import an app</strong>");
        selecttorModal.find(".modal-header").append("<p class='alert alert-danger onealert' style='display: none'></p>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Select the app package in your computer</h4>");
        selecttorModal.find(".modal-body").append("<br>");
        selecttorModal.find(".modal-body").append("<div class='container'><div class='row'>");

        selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Package</label><input type='file' id='apppackage' name='apppackage' class='form-control text-center'></div>");
        selecttorModal.find(".modal-body").append("</div></div>");
        selecttorModal.find(".modal-body").append("</div></div>");

        selecttorModal.find(".btn-close").html("Close");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "installapp");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").hide();


        modal("show");
    });

    $(document).on("change", "#apppackage", function (e) {
        e.preventDefault();
        var selecttorModal = $("#modalManager");
        selecttorModal.find(".btn-valid").html("Install");
        selecttorModal.find(".btn-valid").show();
    });


    /**
     * Event to show edit app modal
     */
    $(document).on('click', ".toeditapp", function () {
        var selector = $(this);
        var href = selector.attr("attr-href2");
        var prefix = selector.attr("attr-prefix");
        var enabled = selector.attr("attr-enabled");
        var name = selector.attr("attr-appname");
        var href_conf = selector.attr("attr-href-config");

        var selecttorModal = $("#modalManager");
        getConfigApp(name, href_conf, function (results) {
            var hadev = "";
            var hddev = "";
            var haprod = "";
            var hdprod = "";
            if (null !== results) {
                if ("undefined" !== typeof results.hosts_allowed_dev && null !== results.hosts_allowed_dev) {
                    hadev = (results.hosts_allowed_dev).join(";");
                }
                if ("undefined" !== typeof results.hosts_denied_dev && null !== results.hosts_denied_dev) {
                    hddev = (results.hosts_denied_dev).join(";");
                }
                if ("undefined" !== typeof results.hosts_allowed_prod && null !== results.hosts_allowed_prod) {
                    haprod = (results.hosts_allowed_prod).join(";");
                }
                if ("undefined" !== typeof results.hosts_denied_prod && null !== results.hosts_denied_prod) {
                    hdprod = (results.hosts_denied_prod).join(";");
                }
            }
            selecttorModal.find(".modal-header").html("<strong class='text-center'>Edit "+name+" app configuration</strong>");
            selecttorModal.find(".modal-header").append("<p class='alert alert-danger onealert' style='display: none'></p>");
            selecttorModal.find(".modal-body").html("<h4 class='text-center'>Edit fields to update app configuration.</h4>");
            selecttorModal.find(".modal-body").append("<br>");
            selecttorModal.find(".modal-body").append("<div class='container'><div class='row'>");

            selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Prefix</label><input type='text' name='prefix' class='form-control text-center' value='"+prefix+"' ></div>");
            selecttorModal.find(".modal-body").append("</div></div>");
            selecttorModal.find(".modal-body").append('<div class="container-new">' +
                '<div class="form-group text-center"> <label>Enabled</label> <div class="check"><input id="check" type="checkbox" name="enabled" '+((enabled === "yes")? "checked='checked'" : "")+' style="display: none"/><label for="check"><div class="box"><i class="fa fa-check"></i></div> </label></div></div>' +
                '<div class="text-center "> <button data-toggle="collapse" data-target="#'+name+'-collapse" class=" btn btn-toolbar">Advanced options</button></div><br>' +
                '<div id="'+name+'-collapse" class="collapse">' +
                '<div class="row"> <div class="col-md-12 text-center text-lg-center text-info"><strong>Advanced options</div> <div class="form-group text-center col-md-6"> <label>Visible on dev</label><select name="vdev" class="form-control"><option value="null" '+((null ===  results || "undefined" === typeof  results.visibility_dev  || null === results.visibility_dev)? "selected" : "")+' >Not specified</option><option value="true" '+((null !==  results && ("undefined" !== typeof  results.visibility_dev  && true === results.visibility_dev))? "selected" : "")+' >Yes</option><option value="false" '+((null !==  results && ("undefined" !== typeof  results.visibility_dev  && false === results.visibility_dev))? "selected" : "")+' >No</option></select></div>' +
                '<div class="form-group text-center col-md-6"> <label>Visible on prod</label> <select name="vprod" class="form-control"><option value="null" '+((null ===  results || "undefined" === typeof  results.visibility_prod  || null === results.visibility_prod)? "selected" : "")+' >Not specified</option><option value="true" '+((null !==  results && ("undefined" !== typeof  results.visibility_prod  && true === results.visibility_prod))? "selected" : "")+' >Yes</option><option value="false" '+((null !==  results && ("undefined" !== typeof  results.visibility_prod  && false === results.visibility_prod))? "selected" : "")+' >No</option></select></div>' +
                "<div class='form-group text-center col-md-12'><label>Hosts allowed on dev <br><small class='text-info'>(Split each host with ; delimiter)</small></label><input type='text' name='hostsdeva' class='form-control text-center' value='"+hadev+"' ></div>"+
                "<div class='form-group text-center col-md-12'><label>Hosts denied on dev <br><small class='text-info'>(Split each host with ; delimiter)</small></label><input type='text' name='hostsdevd' class='form-control text-center' value='"+hddev+"' ></div>"+
                "<div class='form-group text-center col-md-12'><label>Hosts allowed on prod <br><small class='text-info'>(Split each host with ; delimiter)</small></label><input type='text' name='hostsproda' class='form-control text-center' value='"+haprod+"' ></div>"+
                "<div class='form-group text-center col-md-12'><label>Hosts denied on prod <br><small class='text-info'>(Split each host with ; delimiter)</small></label><input type='text' name='hostsprodd' class='form-control text-center' value='"+hdprod+"' ></div>"+
                '</div>'+
                '</div>');
            selecttorModal.find(".modal-body").append("</div></div>");
            selecttorModal.find(".btn-close").html("Close");
            selecttorModal.find(".btn-valid").html("Update");

            selecttorModal.find(".btn-valid").attr("attr-href", href);
            selecttorModal.find(".btn-valid").attr("attr-appname", name);
            selecttorModal.find(".btn-valid").attr("attr-event", "editappsave");
            selecttorModal.find(".btn-close").show();
            selecttorModal.find(".btn-valid").show();

            modal("show");
        });

    });


    /**
     * Event to show edit smarty configuration
     */
    $(document).on('click', ".editsmartyconfig", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var href2 = selector.attr("attr-href2");
        var name = selector.attr("attr-config");
        var result = null;

        $.ajax({
            url : href,
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    result = data['results'];
                    var selecttorModal = $("#modalManager");

                    selecttorModal.find(".modal-header").html("<strong class='text-center'>Edit "+name+" configuration</strong>");
                    selecttorModal.find(".modal-header").append("<p class='alert alert-danger onealert' style='display: none'></p>");
                    selecttorModal.find(".modal-body").html("<h4 class='text-center'>Edit fields to update smarty configuration.</h4>");
                    selecttorModal.find(".modal-body").append("<br>");
                    selecttorModal.find(".modal-body").append("<div class='container'><div class='row'>");

                    selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Configuration name</label><input type='text' name='config' class='form-control text-center' value='"+name+"' disabled='disabled'></div>");
                    selecttorModal.find(".modal-body").append("</div></div>");
                    selecttorModal.find(".modal-body").append('<div class="container-new">' +
                        '<div class="form-group text-center"> <label>Debug</label> <div class="check"><input id="check" type="checkbox" name="debug" '+((result['debug'] === true)? "checked='checked'" : "")+' style="display: none"/><label for="check"><div class="box"><i class="fa fa-check"></i></div> </label></div></div>' +
                        '<div class="form-group text-center"><label>Cache</label> <div class="check"><input id="check1" name="cache" '+((result['cache'] === 1)? "checked='checked'" : "")+' type="checkbox" style="display: none" /><label for="check1"><div class="box"><i class="fa fa-check"></i></div> </label></div></div>' +
                        '<div class="form-group text-center"><label>Compile Check</label> <div class="check"><input id="check2" name="compile" '+((result['compile_check'] === true)? "checked='checked'" : "")+' type="checkbox" style="display: none" /><label for="check2"><div class="box"><i class="fa fa-check"></i></div> </label></div></div>' +
                        '<div class="form-group text-center"><label>Force to compile</label> <div class="check"><input id="check3" name="force" '+((result['force_compile'] === true)? "checked='checked'" : "")+' type="checkbox" style="display: none" /><label for="check3"><div class="box"><i class="fa fa-check"></i></div> </label></div></div>' +
                        '<div class="form-group text-center"><label>Smarty Debug</label> <div class="check"><input id="check4" name="sdebug" '+((result['smarty_debug'] === true)? "checked='checked'" : "")+' type="checkbox" style="display: none" /><label for="check4"><div class="box"><i class="fa fa-check"></i></div> </label></div></div>' +
                        '<div class="form-group text-center"><label>Console</label> <div class="check"><input id="check5" name="console" '+((result['console_debug'] === "on")? "checked='checked'" : "")+' type="checkbox" style="display: none" /><label for="check5"><div class="box"><i class="fa fa-check"></i></div> </label></div></div>' +
                        '</div>');
                    selecttorModal.find(".modal-body").append("</div></div>");

                    selecttorModal.find(".btn-close").html("Close");
                    selecttorModal.find(".btn-valid").html("Update");

                    selecttorModal.find(".btn-valid").attr("attr-href", href2);
                    selecttorModal.find(".btn-valid").attr("attr-config", name);
                    selecttorModal.find(".btn-valid").attr("attr-event", "editsmartysave");
                    selecttorModal.find(".btn-close").show();
                    selecttorModal.find(".btn-valid").show();

                    modal("show");
                }
                else
                {
                    operationError();
                    return (0);
                }
            },
            error : function (data) {
                operationError(data);
            }
        });
    });

    /**
     * Reload data for deployment
     */
    $(document).on("click", ".iumioDeployReload", function () {
        getRequirementsDeployment(true);
    });

    /**
     * Event to show routing
     */
    $(document).on('click', ".showrouting", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var appname = selector.attr("attr-appname");
        var filename = selector.attr("attr-filename");
        var result = null;

        $.ajax({
            url : href,
            type : 'POST',
            dataType : 'json',
            success : function(data){
                if (data['code'] === 200)
                {
                    result = data['results'];
                    var selecttorModal = $("#modalManager");
                    var pu = "";
                    selecttorModal.find(".modal-header").html("<strong class='text-center'>Content of  "+filename+" routing file :  "+appname+"</strong>");
                    selecttorModal.find(".modal-body").html('');
                    var u2 = '<div class="container-fluid"><div class="row">';

                    $.each(result, function (index, value) {
                        var params = "";
                        var link_gen = "";
                        if (typeof  value['params'] !== "undefined") {
                            var pa = value['params'];
                            pu = value['r_parameters'];
                            for (var i = 0; i < pa.length; i++)
                            {
                                if (typeof  pu[i] !== "undefined")
                                    params += "<li class='list-group-item text-center'> "+ pa[i] +" <i class='pe-7s-right-arrow iumio-picto-routing'></i> <strong>"+ pu[i][1]+"</strong></li>";
                                else
                                    params += "<li class='list-group-item text-center'> "+ pa[i] + " <i class='pe-7s-right-arrow iumio-picto-routing'></i> <strong>untyped</strong></li>";
                            }

                        }
                        else
                            params = "<li class='list-group-item text-center'>No parameters</li>";

                        if ((typeof  value['route_gen'] !== "undefined") && value['visibility'] !== "disabled")
                            link_gen = "<li class='list-group-item'> <a class='text-center' href='"+value['route_gen']+"'><strong>Go to link</strong></a></li>";

                        u2 +=    '<div class="col-md-12">'+
                            '<div class="card">'+
                            '<div class="header">'+
                            '<h4 class="title">Route : <a href="#">'+value['routename']+'</a></h4>'+
                            '<p class="category">Details</p>'+
                            '   </div>'+
                            '  <div class="content" >'+
                            ' <ul class="list-group iumio-routing-list-details text-center">'+
                            '<li class="list-group-item">Path : <span class="">'+value['path']+'</span> </li>'+
                            '<li class="list-group-item">Linked master : <span class="">'+value['controller']+'</span></li>'+
                            '<li class="list-group-item">Visibility : <span class="">'+value['visibility']+'</span></li>'+
                            '<li class="list-group-item">Activity  : <span class="">'+value['method']+'</span></li>'+
                            '<li class="list-group-item">Method(s) allowed : <span class="">'+value['m_allow']+'</span></li>'+
                            '<li class="list-group-item">Parameters' +
                            '<ul class="list-group" style="padding-top: 13px">'+
                            params+
                            '</ul>'+
                            '</li>'+
                            link_gen+
                            '</ul>'+
                            '</div>'+
                            '</div>';
                    });

                    u2 +=  '</div></div>';

                    selecttorModal.find(".modal-body").append(u2);
                    selecttorModal.find(".btn-close").html("Close");
                    selecttorModal.find(".btn-valid").attr("attr-href", href);
                    selecttorModal.find(".btn-close").show();
                    selecttorModal.find(".btn-valid").hide();

                    modal("show");
                }
                else
                {
                    operationError();
                    return (0);
                }
            },
            error : function (data) {
                operationError(data);
            }
        });
    });




    /**
     * Event to show create database config modal
     */
    $(document).on('click', ".createdatabaseconfig", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");

        selecttorModal.find(".modal-header").html("<strong class='text-center'>Create a new database configuration</strong>");
        selecttorModal.find(".modal-header").append("<p class='alert alert-danger onealert' style='display: none'></p>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Fill in the fields to create a database configuration.</h4>");
        selecttorModal.find(".modal-body").append("<br>");
        selecttorModal.find(".modal-body").append("<div class='container'><div class='row'>");

        selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Configuration name</label><input type='text' name='config' class='form-control text-center'></div>");
        selecttorModal.find(".modal-body").append("</div></div>");
        selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Name</label><input type='text' name='name' class='form-control text-center'></div>");
        selecttorModal.find(".modal-body").append("</div></div>");
        selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Host</label><input type='text' name='host' class='form-control text-center'></div>");
        selecttorModal.find(".modal-body").append("</div></div>");
        selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>User name</label><input type='text' name='user' class='form-control text-center'></div>");
        selecttorModal.find(".modal-body").append("</div></div>");
        selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>User password</label><input type='password' name='password' class='form-control text-center'></div>");
        selecttorModal.find(".modal-body").append("</div></div>");
        selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Port</label><input type='number' name='port' class='form-control text-center'></div>");
        selecttorModal.find(".modal-body").append("</div></div>");
        selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Driver</label>" +
            "<select name='driver' class='form-control'>" +
            "<option value='mysql' selected>MySQL</option> " +
            "<option value='pgsql'>PostgreSQL</option> " +
            "<option value='sqlsrv'>Microsoft SQL Server</option> " +
            "<option value='cubrid'>CUBRID</option> " +
            "<option value='firebird'>Firebird</option> " +
            "<option value='ibm'>IBM</option> " +
            "<option value='informix'>Informix</option> " +
            "<option value='sybase'>Sybase</option> " +
            "<option value='mssql'>FreeTDS</option> " +
            "<option value='dblib'>Microsoft SQL Server (dblib)</option> " +
            "<option value='oci'>Oracle</option> " +
            "<option value='odbc'>IBM DB2 Call Level</option> " +
            "<option value='4D'>4D</option> " +
            "</select>" +
            "</div>");
        selecttorModal.find(".modal-body").append("</div></div>");

        selecttorModal.find(".btn-close").html("Close");
        selecttorModal.find(".btn-valid").html("Create");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "createsavedatabase");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });



    /**
     * Event to show create service config modal
     */
    $(document).on('click', ".createservice", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");

        selecttorModal.find(".modal-header").html("<strong class='text-center'>Create a new service configuration</strong>");
        selecttorModal.find(".modal-header").append("<p class='alert alert-danger onealert' style='display: none'></p>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Fill in the fields to create a service configuration.</h4>");
        selecttorModal.find(".modal-body").append("<br>");
        selecttorModal.find(".modal-body").append("<div class='container'><div class='row'>");

        selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>name</label><input type='text' name='name' class='form-control text-center'></div>");
        selecttorModal.find(".modal-body").append("</div></div>");
        selecttorModal.find(".modal-body").append("<div class='form-group text-center'><label>Namespace</label><input type='text' name='namespace' class='form-control text-center'></div>");
        selecttorModal.find(".modal-body").append("</div></div>");
        selecttorModal.find(".modal-body").append('<div class="container-new">' +
            '<div class="form-group text-center"> <label>Enabled</label> <div class="check"><input id="check" type="checkbox" name="status" style="display: none"/><label for="check"><div class="box"><i class="fa fa-check"></i></div> </label></div></div>' +
            '</div>');
        selecttorModal.find(".modal-body").append("</div></div>");

        selecttorModal.find(".btn-close").html("Close");
        selecttorModal.find(".btn-valid").html("Create");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "createsaveservice");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });

    /**
     * Event to show assets options modal
     */
    $(document).on('click', ".showoptionsassets", function () {
        var selector = $(this);
        var hrefcd = selector.attr("attr-href-clear-dev");
        var hrefcp = selector.attr("attr-href-clear-prod");
        var hrefpd = selector.attr("attr-href-publish-dev");
        var hrefpp = selector.attr("attr-href-publish-prod");
        var hrefca = selector.attr("attr-href-clear-all");
        var hrefpa = selector.attr("attr-href-publish-all");
        var appname = selector.attr("attr-appname");

        var selecttorModal = $("#modalManager");

        selecttorModal.find(".modal-header").html("<strong class='text-center'>Options for "+appname+" assets</strong>");
        selecttorModal.find(".modal-header").append("<p class='alert alert-danger onealert' style='display: none'></p>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Choose the action you want to perform for "+appname+" assets.</h4>");
        selecttorModal.find(".modal-body").append("<br>");

        selecttorModal.find(".modal-body").append(
            '<div class="row center-block text-center manager-options">'
            + '<div class="col-md-4 text-center"><a class="btn-default btn publishappassets" attr-href="'+hrefpd+'"> Publish dev</a></div>'

            +'<div class="col-md-4 text-center"><a class="btn-default btn publishappassets" attr-href="'+hrefpp+'" >Publish prod</a></div>'

            +'<div class="col-md-4 text-center"><a class="btn-default btn publishappassets" attr-href="'+hrefpa+'">Publish all</a></div>'

            +'<div class="col-md-4 text-center"><a class="btn-default btn publishappassets" attr-href="'+hrefcd+'">Clear dev</a></div>'

            +'<div class="col-md-4 text-center"><a class="btn-default btn publishappassets" attr-href="'+hrefcp+'">Clear prod</a></div>'

            +'<div class="col-md-4 text-center"><a class="btn-default btn publishappassets" attr-href="'+hrefca+'">Clear all</a></div>'

            +"</div>");

        selecttorModal.find(".btn-close").html("Close");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").hide();

        modal("show");
    });



    /**
     * Event to clear logs
     */
    $(document).on('click', ".clearlogs", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var env = selector.attr("attr-env");

        var selecttorModal = $("#modalManager");

        selecttorModal.find(".modal-header").html("<strong class='text-center'>Clear log for "+env+" environment</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Would you like to empty log file for <strong>"+env+"</strong> environment ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "clearlogs");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });


    /**
     * Event to clear all cache
     */
    $(document).on('click', ".clearcache", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var env = selector.attr("attr-env");

        var selecttorModal = $("#modalManager");

        selecttorModal.find(".modal-header").html("<strong class='text-center'>Clear cache for all environment</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Would you like to empty cache folder for all environment ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "clearallcache");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });


    /**
     * Event to clear all cache
     */
    $(document).on('click', ".clearcachespec", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var env = selector.attr("attr-env");

        var selecttorModal = $("#modalManager");

        selecttorModal.find(".modal-header").html("<strong class='text-center'>Clear cache for "+env+" environment</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Would you like to empty cache folder for <strong>"+env+"</strong> environment ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "clearcache");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });


    /**
     * Event to change status of app locale
     */
    $(document).on('click', ".changestatusapplocale", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var app = selector.attr("attr-appname");
        var status = selector.attr("attr-status");

        var selecttorModal = $("#modalManager");

        selecttorModal.find(".modal-header").html("<strong class='text-center'>Change locale app status for "+app+"</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Would you like to "+status+" locale mode for <strong>"+app+"</strong> ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "applychangelocalapp");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });


    /**
     * Event to clear all compile
     */
    $(document).on('click', ".clearcompile", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var env = selector.attr("attr-env");

        var selecttorModal = $("#modalManager");

        selecttorModal.find(".modal-header").html("<strong class='text-center'>Clear compiled for all environment</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Would you like to empty compiled folder for all environment ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "clearallcompile");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });

    /**
     * Event to remove a routing file
     */
    $(document).on('click', ".todeleterouting", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var appname = selector.attr("attr-appname");
        var filename = selector.attr("attr-filename");

        var selecttorModal = $("#modalManager");

        selecttorModal.find(".modal-header").html("<strong class='text-center'>Remove a routing file</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Would you like to remove "+filename+" routing file related with "+appname+" ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "removearouting");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });

    /**
     * Event to export an application
     */
    $(document).on('click', ".exportapp", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var appname = selector.attr("attr-appname");

        var selecttorModal = $("#modalManager");

        selecttorModal.find(".modal-header").html("<strong class='text-center'>Export an app</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Would you like to export "+appname+" ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "processtoexportapp");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });



    /**
     * Event to clear all compile
     */
    $(document).on('click', ".clearcompilespec", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");
        var env = selector.attr("attr-env");

        var selecttorModal = $("#modalManager");

        selecttorModal.find(".modal-header").html("<strong class='text-center'>Clear compiled for "+env+" environment</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Would you like to empty compiled folder for <strong>"+env+"</strong> environment ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "clearcompile");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });



    /**
     * Event to clear classampp for prod environement
     */
    $(document).on('click', ".clearautoloaderprod", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Clear ClassMap - PROD</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Do you want to clear the class map file for prod environment ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "cautoprod");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });


    /**
     * Event to build classampp for prod environement
     */
    $(document).on('click', ".buildautoloaderdev", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Build ClassMap - PROD</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Do you want to build the class map file for dev environment ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "bautodev");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });

    /**
     * Event to Build classampp for prod environement
     */
    $(document).on('click', ".buildautoloaderprod", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Build ClassMap - PROD</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Do you want to build the class map file for prod environment ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "bautoprod");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });

    /**
     * Notify when modal closed
     */
    $(document).on('click', ".btn-close, #modalManager", function () {
        used = 0;
    });

    /**
     * Event to build classampp for all environements
     */
    $(document).on('click', ".buildautoloaderall", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        var selecttorModal = $("#modalManager");
        selecttorModal.find(".modal-header").html("<strong class='text-center'>Build ClassMap - All environements</strong>");
        selecttorModal.find(".modal-body").html("<h4 class='text-center'>Do you want to build the class map file for each environment ?</h4>");
        selecttorModal.find(".btn-close").html("No");
        selecttorModal.find(".btn-valid").html("Yes");

        selecttorModal.find(".btn-valid").attr("attr-href", href);
        selecttorModal.find(".btn-valid").attr("attr-event", "cautoall");
        selecttorModal.find(".btn-close").show();
        selecttorModal.find(".btn-valid").show();

        modal("show");
    });


    /**
     * Event to manage assets (clear, publish)
     */
    $(document).on('click', ".publishappassets", function () {
        var selector = $(this);
        var href = selector.attr("attr-href");

        $.ajax({
            url : href,
            type : 'POST',
            dataType : 'json',
            success : function(data){
                getAllAssets(true);
                if (data['code'] === 200)
                    operationSuccess();
                else
                    operationError();
            },
            error : function (data) {
                operationError(data);
            }
        });

    });

    getLogs(true);
    getAppListSimple(true);
    getUnlimitedLogs(true);
    getUnlimitedLogs2(true);
    getDatabasesList(true);
    getHostsList(true);
    getAllCacheEnv(true);
    getAllCompileEnv(true);
    getAllSmartyConfigs(true);
    getAllAssets(true);
    getRoutingList(true);
    getServicesList(true);
    dashboardStatistics(true);
    getRequirementsDeployment(true);
    composer(true);
    getAllLocale(true);


    setInterval(function () {
        if (priorTask === 1) {
            return (false);
        }
        if (noapp === false)
        {
            getLogs(true);
            getAppListSimple(true);
            getDatabasesList(true);
            getHostsList(true);
            getAllCacheEnv(true);
            getAllCompileEnv(true);
            getAllSmartyConfigs(true);
            getAllAssets(true);
            getRoutingList(true);
            getServicesList(true);
            dashboardStatistics(true);
            composer(true);
            getAllLocale(true);
        }
    }, 7000);

    setInterval(function () {
        if (noapp === false)
        {
            getUnlimitedLogs(true);
            getUnlimitedLogs2(true);
        }
    }, 10000);

    setInterval(function () {
        loadElapsedTimeDeployment($(".last_up_req_deploy"));
    }, 60000);


});

$(window).on('load', function() {
    // Animate loader off screen
    $(".se-pre-con").fadeOut("fast");
});