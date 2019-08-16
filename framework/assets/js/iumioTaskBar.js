/*
 * This is an iumio Framework component
 *
 * (c) RAFINA DANY <dany.rafina@iumio.com>
 *
 * iumio Framework, an iumio component [https://www.iumio.com]
 *
 * To get more information about licence, please check the licence file
 *
 */
var inload = !1;
window.onload = function() {
    getSimpleApps(), getTaskbarLogs(), detectTaskBarPosition()
};
var reduce = 0,
    restore = 0;

function eventFire(e, t) {
    if (e.fireEvent) e.fireEvent("on" + t);
    else {
        var a = document.createEvent("Events");
        a.initEvent(t, !0, !1), e.dispatchEvent(a)
    }
}

function detectTaskBarPosition() {
    var e = localStorage.getItem("iumioTaskBar");
    if (e == null) {
        localStorage.setItem("iumioTaskBar", 1);
        e = 1;
    }

    document.getElementById("iumioTaskBar").style.width = e == 0? "142px" : "100%";
    document.getElementById("iumioTaskBarBlank").style.display = e == 0? "none" : "block";

    var c = document.getElementsByClassName("iumioTaskBarVSmallItem").length;
    for (var i = 0; i < c; i++) {
        document.getElementsByClassName("iumioTaskBarVSmallItem")[i].style.display = e == 1 ? "block" : "none";
    }
}
var refreshId = setInterval(function() {
        getSimpleApps()
    }, 5e3),
    refreshId2 = setInterval(function() {
        getTaskbarLogs()
    }, 2e3);

function cacheClear(e) {
    var t = document.querySelector("#iumioTaskBarCacheClear"),
        a = e.getAttribute("attr-href"),
        s = new XMLHttpRequest;
    s.open("POST", a), s.send(null), s.addEventListener("readystatechange", function() {
        if (s.readyState === XMLHttpRequest.DONE && 200 === s.status) {
            t.style.backgroundColor = "rgba(23, 202, 23, 0.45)";
            var e = t.cloneNode(!0);
            t.innerHTML = '<a href="#">Successful</a>', setTimeout(function() {
                t.style.backgroundColor = "initial", t.innerHTML = e.innerHTML
            }, 5e3)
        }
    })
}

function assetsPublish(e) {
    var t = document.querySelector("#iumioTaskBarAssets"),
        a = e.getAttribute("attr-href"),
        s = new XMLHttpRequest;
    s.open("POST", a), s.send(null), s.addEventListener("readystatechange", function() {
        if (s.readyState === XMLHttpRequest.DONE && 200 === s.status) {
            t.style.backgroundColor = "rgba(23, 202, 23, 0.45)";
            var e = t.cloneNode(!0);
            t.innerHTML = '<a href="#">Successful</a>', setTimeout(function() {
                t.style.backgroundColor = "initial", t.innerHTML = e.innerHTML
            }, 5e3)
        }
    })
}

function assetsClear(e) {
    var t = document.querySelector("#iumioTaskBarAssets"),
        a = e.getAttribute("attr-href"),
        s = new XMLHttpRequest;
    s.open("POST", a), s.send(null), s.addEventListener("readystatechange", function() {
        if (s.readyState === XMLHttpRequest.DONE && 200 === s.status) {
            t.style.backgroundColor = "#3c58d9";
            var e = t.cloneNode(!0);
            t.innerHTML = '<a href="#">Successful</a>', setTimeout(function() {
                t.style.backgroundColor = "initial", t.innerHTML = e.innerHTML
            }, 5e3)
        }
    })
}
document.getElementById("iumioTaskBarClicker").addEventListener("click", function() {
    var c = document.getElementsByClassName("iumioTaskBarVSmallItem").length;
    var eIumio = localStorage.getItem("iumioTaskBar");
    localStorage.setItem("iumioTaskBar", eIumio ==  1? 0 : 1);
    document.getElementById("iumioTaskBarBlank").style.display = eIumio == 1? "none" : "block";
    document.getElementById("iumioTaskBar").style.width = eIumio == 1? "142px" : "100%";

    for (var i = 0; i < c; i++) {
        document.getElementsByClassName("iumioTaskBarVSmallItem")[i].style.display = eIumio == 0? "block" : "none";
    }
}), document.addEventListener("click", function(e) {
    if (e.target) switch (e.target.className) {
        case "iumioTaskBarCacheClearAll":
            cacheClear(document.querySelector(".iumioTaskBarCacheClearAll"));
            break;
        case "iumioTaskBarCacheClearDev":
            cacheClear(document.querySelector(".iumioTaskBarCacheClearDev"));
            break;
        case "iumioTaskBarCacheClearProd":
            cacheClear(document.querySelector(".iumioTaskBarCacheClearProd"));
            break;
        case "iumioTaskBarAssetsPublishAll":
            assetsPublish(document.querySelector(".iumioTaskBarAssetsPublishAll"));
            break;
        case "iumioTaskBarAssetsClearAll":
            assetsClear(document.querySelector(".iumioTaskBarAssetsClearAll"));
            break;
        case "iumioTaskBarAssetsPublishDev":
            assetsPublish(document.querySelector(".iumioTaskBarAssetsPublishDev"));
            break;
        case "iumioTaskBarAssetsClearDev":
            assetsClear(document.querySelector(".iumioTaskBarAssetsClearDev"));
            break;
        case "iumioTaskBarAssetsPublishProd":
            assetsPublish(document.querySelector(".iumioTaskBarAssetsPublishProd"));
            break;
        case "iumioTaskBarAssetsClearProd":
            assetsClear(document.querySelector(".iumioTaskBarAssetsClearProd"));
            break;
        case "iumio-red-color iumioBtn iumioTaskBarOneApp":
        case "iumio-green-color iumioBtn iumioTaskBarOneApp":
            switchApp(e.target)
    }
});
var inloadlog = !1,
    iumioTaskBardateSession = new Date,
    iumioTaskBarHeightError = 0,
    logsarray = null,
    iumioInitTaskbarLog = 0;

function getTaskbarLogs() {
    if (!0 !== inloadlog) {
        inloadlog = !0;
        var e = document.getElementById("iumioTaskBarRequests"),
            t = (e.parentElement.cloneNode(!0), e.getAttribute("attr-href")),
            a = new XMLHttpRequest;
        a.open("POST", t), a.send(null);
        var s = 0;
        a.addEventListener("readystatechange", function() {
            if (a.readyState === XMLHttpRequest.DONE && 200 === a.status) {
                var t = JSON.parse(a.response);
                t = t.results;
                var r = window.location.href;
                var all = 0;
                if (ObjectLength(t) > 0) {
                    void 0 !== document.getElementsByClassName("iumioTaskBarGetOneLog")[0] && document.getElementsByClassName("iumioTaskBarGetOneLog")[0].remove(), e.parentNode.className = " iumioTaskBarDropdown iumioTaskBarVSmallItem";
                    for (var o = "", i = 0, n = 0; n < ObjectLength(t); n++) {
                        var l = t[n].referer;
                        if (!(new Date(1e3 * t[n].time) <= iumioTaskBardateSession) && r == l) {
                            all++;
                            0 === n && (document.getElementById("iumioTaskBarRequests").classList.remove("iumioTaskBarBounceIn"), document.getElementById("iumioTaskBarRequests").classList.add("iumioTaskBarBounceIn"), document.getElementById("iumioTaskBarRequests").innerHTML = t[n].method + " " + t[n].code, document.getElementById("iumioTaskBarRequests").innerHTML = t[n].method + " " + t[n].code, 200 == t[n].code ? document.getElementById("iumioTaskBarRequests").style = "background-color:rgba(218, 51, 51, 0.85);border-top-left-radius: 100px 80px;border-bottom-right-radius: 80px 120px;" : 500 == t[n].code ? document.getElementById("iumioTaskBarRequests").style = "background-color:rgba(171, 27, 27, 0.85);border-top-left-radius: 100px 80px;border-bottom-right-radius: 80px 120px;" : document.getElementById("iumioTaskBarRequests").style.backgroundColor = "background-color: rgba(169, 171, 27, 0.85); border-top-left-radius: 100px 80px;border-bottom-right-radius: 80px 120px;", 1);
                            if (200 == t[n].code ? "  style='background-color:rgba(56, 171, 27, 0.85);border-top-left-radius: 100px 80px;border-bottom-right-radius: 80px 120px;' " : 500 == t[n].code && "   style='background-color : rgba(218, 51, 51, 0.85); border-top-left-radius: 100px 80px;border-bottom-right-radius: 80px 120px;' ", 0 == s) var u = '<li class="iumioTaskBarOneLog" > <table class="iumioTaskbarTable"><thead><tr><th>Status</th><th>URL</th> </tr></thead> <tbody> <tr> <td>' + t[n].method + " " + t[n].code + '</td> <td class="iumiouideurl" onclick="window.open(\'' + t[n].log_url + '\')">' + t[n].uri.substr(0, 19) + " " + (t[n].referer.length > 19 ? "..." : "") + "</td> </tr> </tbody> </table></li>";
                            else u = '<li class="iumioTaskBarOneLog" > <table class="iumioTaskbarTable"><tbody> <tr ><td>' + t[n].method + ' ' + t[n].code + '</td> <td class="iumiouideurl" onclick="window.open=(\'' + t[n].log_url + '\')">' + t[n].uri.substr(0, 19) + " " + (t[n].referer.length > 19 ? "..." : "") + "</td> </tr> </tbody> </table></li>";
                            o += u, i++, void 0 !== document.getElementsByClassName("iumioTaskBarGetOneLog")[0] && iumioTaskBarHeightError < 300 ? (iumioTaskBarHeightError += 50, document.getElementsByClassName("iumioTaskBarGetOneLog")[0].style.height = iumioTaskBarHeightError + "!important") : 0 === i && (iumioTaskBarHeightError = 0), s++
                        }
                    }


                    if (0 === i) return void(inloadlog = !1);
                    o += "";
                    var d = document.createElement("ul");
                    d.innerHTML = o;
                    var c = 100 - 20 * ObjectLength(t);
                    c < 0 && (c = 0), d.className = " iumioTaskBarDropdownContent iumioTaskBarGetOneLog", insertAfter(d, e), inloadlog = !1
                }
            }
        })
    }
}

function getSimpleApps() {
    if (!0 !== inload) {
        inload = !0;
        var e = document.getElementById("iumioTaskBarEnaDisApp"),
            t = (e.parentElement.cloneNode(!0), e.getAttribute("attr-href")),
            a = new XMLHttpRequest;
        a.open("POST", t), a.send(null);
        a.addEventListener("readystatechange", function() {
            if (a.readyState === XMLHttpRequest.DONE && 200 === a.status) {
                var t = JSON.parse(a.response);
                if (ObjectLength(t = t.results) > 0) {
                    e.parentNode.className = " iumioTaskBarDropdown iumioTaskBarVSmallItem";
                    var s = "",
                        r = document.getElementsByClassName("iumioTaskBarAllAppRemove")[0];
                    void 0 !== r && r.parentNode.removeChild(r), s += "<table class='iumioTaskbarTable iumioTaskbarTableApps'><thead><tr><th>App</th><th>Action</th></tr></thead><tbody>";
                    for (var o = "", i = 0; i < ObjectLength(t); i++) o += "<tr> <td class='iumioTaskBBarAppname'>" + t[i].name +" ("+  ("yes" === t[i].enabled ? "<span class='iumio-green-color'>Enabled</span>" : "<span class='iumio-red-color'>Disabled</span>") +  ") </td><td>" + ("no" === t[i].enabled ? "<span class='iumio-green-color iumioBtn iumioTaskBarOneApp' attr-href='" + t[i].link_auto_dis_ena + "'>Enabled</span>" : "<span class='iumio-red-color iumioBtn iumioTaskBarOneApp' attr-href='" + t[i].link_auto_dis_ena + "'>Disabled</span>") + "</td></tr>";
                    s += o, s += "</tbody></tbody></table>", s += "";
                    var n = document.createElement("ul");
                    n.innerHTML = s;
                    var l = 100 - 20 * ObjectLength(t);
                    l < 0 && (l = 0), n.className = " iumioTaskBarDropdownContent iumioTaskBarAllAppRemove", insertAfter(n, e), inload = !1
                }
            }
        })
    }
}

function switchApp(e) {
    var t = document.querySelector("#iumioTaskBarEnaDisApp"),
        a = e.getAttribute("attr-href"),
        s = new XMLHttpRequest;
    s.open("POST", a), s.send(null), s.addEventListener("readystatechange", function() {
        if (s.readyState === XMLHttpRequest.DONE && 200 === s.status) {
            var e = document.getElementsByClassName("iumioTaskBarAllAppRemove")[0];
            e.parentNode.removeChild(e), t.style.backgroundColor = "#3c58d9";
            var a = t.cloneNode(!0);
            t.innerHTML = "Successful", setTimeout(function() {
                t.style.backgroundColor = "initial", t.innerHTML = a.innerHTML
            }, 5e3)
        }
    })
}

function ObjectLength(e) {
    var t = 0;
    for (var a in e) e.hasOwnProperty(a) && ++t;
    return t
}

function loadEvent() {}

function insertAfter(e, t) {
    t.parentNode.insertBefore(e, t.nextSibling)
}