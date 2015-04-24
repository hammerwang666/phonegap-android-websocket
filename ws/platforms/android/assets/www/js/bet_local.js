var onbet = null;
//var gameHost = "http://m.ags.qnear.com";
//var wsHost = "m.ags.qnear.com";
var gameHost = "http://yjd.ags.com:9900";
var wsHost = "yjd.ags.com:9900";
var token ="";
setTimeout(function(){

$(function() {

    if (!FDATA || FDATA.length !== 22) {
        console.log(FDATA);
        console.error("FDATA is invalid");
        return;
    }
    if (!BDATA || BDATA.length !== 8) {
        console.log(BDATA);
        console.error("FDATA is invalid");
        return;
    }
    var bws = {};
    var BET_N = "0";
    var BET_BZ = "10"; //big prize
    var BET_LUCKY = "20"; //lucky
    //
    var WIN_H = window.innerHeight;
    var WIN_W = window.innerWidth;
    var BS = WIN_H / WIN_W > 1.2;
    var FOOD_C = 24;
    var FAS_STIME = 1000;
    $("#game").height(WIN_H).width(WIN_W);
    $("#bet_bg").height(WIN_H).width(WIN_W);
    if (BS) {
        $("#bet_bg").attr("src", "img/bet_bg.png");
    } else {
        $("#bet_bg").attr("src", "img/bet_bg_1.png");
    }
    //
    var top_mg;
    if (BS) {
        top_mg = WIN_H * 0.11;
    } else {
        top_mg = WIN_H * 0.03;
    }
    var top_h = WIN_H * 0.05;
    var top_w = WIN_W * 0.8;
    // $("#bet")
    // 	.height(top_h)
    // 	.width(top_w);
    $("#bet .top")
        .height(top_h)
        .width(top_w)
        .css("margin-top", top_mg);
    if (BS) {
        $("#bet .top").css('margin-top', WIN_H * 0.11);
    } else {
        $("#bet .top").css('margin-top', WIN_H * 0.03);
    }
    var top_t_h = top_h - 8;
    var top_t_w = WIN_W * 0.22;
    $(".bet_record")
        .height(top_t_h)
        .width(top_t_w).css("font-size", top_t_h * 0.45);
    $("#bet_money")
        .css("font-size", top_t_h * 0.45)
        .css("margin-top", top_h * 0.20);
    $(".bet_money")
        .css("float", "right")
        .height(top_t_h);
    $(".bet_ingot").height(top_h * 0.5).css("margin-top", top_h * 0.20);
    // $(".bet_money").height(top_t_h);
    // $(".bet_money")
    // .css("margin-right", WIN_W * 0.1);

    $("#top_record_bg").height(top_t_h).width(top_t_w);
    $("#top_record_p_bg").height(top_t_h).width(top_t_w * 0.4);

    $("#top_record_s")
        .height(top_t_h * 0.40).width(top_t_h * 0.40 * 1.5)
        .css("margin-left", top_t_w - (top_t_h * 0.40 * 1.5) - 4)
        .css("margin-top", top_t_h * 0.30 - 2);
    $(".bet_record span").height(top_t_h).css("line-height", Math.round(top_t_h) + "px");
    //
    $("#bet .record_l").height(top_h).width(top_w);
    $("#bet .record_l img").height(top_h).width(top_w);
    $("#bet .record_l span")
        .width(top_w * 0.190)
        .height(top_h)
        .css("line-height", top_h + "px");
    $("#bet .record_l div").height(top_h);
    $("#bet_history").height(top_h);
    $("#record_c").width(top_w - 67).css("margin-left", 60);
    //

    //
    var foods = [];
    var tw = Math.floor(WIN_W * 0.8);
    var th = Math.floor(WIN_H * 0.45);
    // var fsize = tw / 7;
    var fsize = Math.floor((tw + th) / 14);
    var xs = Math.floor(tw / fsize);
    var ys = Math.floor(th / fsize);
    while (ys < 3 || (ys % 2) === 0) {
        fsize--;
        ys = Math.floor(th / fsize);
        xs = Math.floor(tw / fsize);
    }
    while (ys + xs < 14) {
        fsize--;
        xs = Math.floor(tw / fsize);
    }
    xs = 14 - ys;
    var f_dis = (tw - xs * fsize) / (xs - 1);
    tw += f_dis;
    var tx = Math.floor((WIN_W - tw) / 2);
    var ty = top_mg + 2 * top_h + 11;
    var lkidx = xs + Math.floor(ys / 2) - 1;
    var bpidx = 2 * xs + Math.floor(ys / 2) * 3 - 2;
    // console.log(Math.floor(WIN_W * 0.22), (th - fsize * ys));
    console.log(
        "WIN_W:" + WIN_W + ",\nWIN_H:" + WIN_H + ",\ntw:" + tw + ",\nth:" + th +
        ",\ntx:" + tx + ",\nty:" + ty + ",\nxs:" + xs + ",\nys:" + ys + ",\nfsize:" + fsize +
        ",\nlkidx:" + lkidx + ",\nbpidx:" + bpidx);
    //
    function createFood(f) {
        var food_d = $("<div></div>");
        food_d.append($("<img src='img/food_bg_1.png'/>").css('z-index', -3).attr("class", "layer"));
        food_d.fas = $("<img/>").css('z-index', -2).attr("class", "layer").css("display", "none");
        food_d.append(food_d.fas);
        food_d.append($("<img src='img/dish_bg_1.png'/>").css('z-index', -1).attr("class", "layer"));
        food_d.append($("<img src='" + f.imgs.split(",")[0] + '?w=' + fsize + "&h=" + fsize + "'/>").css('z-index', 0).attr("class", "layer food_img"));
        return food_d;
    }

    function createBigPrize() {
        var food_d = $("<div></div>");
        food_d.append($("<img src='img/food_bg_1.png'/>").css('z-index', -3).attr("class", "layer"));
        food_d.fas = $("<img />").css('z-index', -2).attr("class", "layer").css("display", "none");
        food_d.append(food_d.fas);
        food_d.append($("<img src='img/big_prize.png'/>").css('z-index', -1).attr("class", "layer"));
        return food_d;
    }

    function createLucky() {
        var food_d = $("<div></div>");
        food_d.append($("<img src='img/food_bg_1.png'/>").css('z-index', -3).attr("class", "layer"));
        food_d.fas = $("<img />").css('z-index', -2).attr("class", "layer").css("display", "none");
        food_d.append(food_d.fas);
        food_d.append($("<img src='img/lucky.png'/>").css('z-index', -1).attr("class", "layer"));
        return food_d;
    }
    // console.log(FDATA);
    var TFDATA = [];

    function recreateFoods() {
        TFDATA = [];
        $("#foods").html("");
        foods = [];
        for (var f = 0; f < FOOD_C; f++) {
            if (f == xs + Math.floor(ys / 2) - 1) {
                TFDATA.push(null);
            } else if (f == FOOD_C - Math.floor(ys / 2)) {
                TFDATA.push(null);
            } else if (f > FOOD_C - Math.floor(ys / 2)) {
                TFDATA.push(FDATA[f - 2]);
            } else if (f > xs + Math.floor(ys / 2) - 1) {
                TFDATA.push(FDATA[f - 1]);
            } else {
                TFDATA.push(FDATA[f]);
            }
        }
        // console.log(TFDATA);
        for (var j = 0; j < ys; j++) {
            var t_tr = $("<tr></tr>");
            for (var i = 0; i < xs; i++) {
                var tidx = -1;
                if (j === 0) {
                    tidx = i;
                } else if (j === ys - 1) {
                    tidx = 2 * xs + ys - 3 - i;
                } else {
                    if (i === 0) {
                        tidx = FOOD_C - j;
                    } else if (i === xs - 1) {
                        tidx = xs + j - 1;
                    } else {
                        tidx = -1;
                    }
                }
                if (tidx < 0) {
                    t_tr.append($("<td />"));
                } else {
                    var food_d;
                    if (TFDATA[tidx]) {
                        food_d = createFood(TFDATA[tidx]);
                    } else if (tidx === xs + Math.floor(ys / 2) - 1) {
                        food_d = createLucky();
                    } else if (tidx === FOOD_C - Math.floor(ys / 2)) {
                        food_d = createBigPrize();
                    }
                    foods[tidx] = food_d;
                    t_tr.append($("<td />").append(food_d));
                }
            }
            $("#foods").append(t_tr);
        }
        $("#foods img").width(fsize).height(fsize);
        $("#foods div").width(fsize).height(fsize);
        $("#foods .food_img").width(fsize * 0.8)
            .height(fsize * 0.8)
            .css("border-radius", fsize / 2)
            .css("margin-top", fsize * 0.1)
            .css("margin-left", fsize * 0.1);
        $("#foods").width(tw).css("margin-left", WIN_W * 0.1);
        setTimeout(function() {
            for (i in document.images) document.images[i].ondragstart = function() {
                return false;
            }
        }, 300);
    }
    recreateFoods();
    var center_w = tw - 2 * fsize - f_dis;
    var center_h = (ys - 2) * fsize;
    $("#center_bg").width(center_w - 10)
        .height(center_h - 10)
        .css("margin-left", tx + fsize + 5)
        .css("margin-top", ty + fsize + 5);
    if (BS) {
        $("#center_bg").attr("src", "img/center_bg.png");
    } else {
        $("#center_bg").attr("src", "img/center_bg_1.png");
    }
    var center_lucky_h;
    if (BS) {
        center_lucky_h = center_h * 0.6;
    } else {
        center_lucky_h = center_h * 0.9;
    }
    var center_lucky_w = center_lucky_h * 1.64
    $("#center_lucky >img").width(center_lucky_w)
        .height(center_lucky_h)
        .css("margin-left", tx + fsize + (center_w - center_lucky_w) / 2)
        .css("margin-top", ty + fsize + (center_h - center_lucky_h) / 2);
    var lucky_view_h = center_lucky_h * 0.25;
    var lucky_view_w = center_lucky_w * 0.36;
    $("#lucky_view").width(lucky_view_w).height(lucky_view_h)
        .css("margin-left", tx + fsize + (center_w - center_lucky_w) / 2 + center_lucky_w * 0.3)
        .css("margin-top", ty + fsize + (center_h - center_lucky_h) / 2 + center_lucky_h * 0.33);
    //
    var lucky_view_img_w = lucky_view_w * 0.32;
    var lucky_view_img_h = lucky_view_w * 0.32;
    $("#lucky_view img").width(lucky_view_img_w)
        .height(lucky_view_img_h);
    $("#lucky_view_0").width(lucky_view_img_w).css("margin-left", 0);
    $("#lucky_view_1").width(lucky_view_img_w).css("margin-left", lucky_view_img_w + (lucky_view_w - lucky_view_img_w * 3) / 3 + 1);
    $("#lucky_view_2").width(lucky_view_img_w).css("margin-left", 2 * (lucky_view_img_w + (lucky_view_w - lucky_view_img_w * 3) / 3) + 2);
    //
    $(".center_time").css("margin-top", ty + (ys - 1) * fsize - center_h * 0.08 - $(".center_time").height())
        .css("margin-left", (WIN_W - 80) / 2);
    $("#center_default >img").width(center_h * 0.8)
        .height(center_h * 0.8).css("margin-left", tx + fsize + (center_w - center_h * 0.8) / 2)
        .css("margin-top", ty + fsize + center_h * 0.02);
    $("#buttons_i").width(WIN_W).height(WIN_H * 0.13).css("margin-top", WIN_H * 0.17 + th - ys * fsize);
    $("#buttons_btn").width(WIN_W).height(WIN_H * 0.13).css("margin-top", WIN_H * 0.17 + th - ys * fsize);
    var bi_h;
    if (BS) {
        bi_h = WIN_H * 0.08;
    } else {
        bi_h = WIN_H * 0.12;
    }
    $("#buttons_i div").height(bi_h).width(WIN_W / 8);
    $("#buttons_i img").height(bi_h).width(WIN_W / 8);
    $("#buttons_i td").width(WIN_W / 8);
    $("#buttons_btn div").height(WIN_H * 0.13).width(WIN_W / 8);
    $("#buttons_i_food_0").css("margin-left", (WIN_W / 8 - WIN_W / 8 * 0.5) / 2);
    $("#buttons_i_food_1").css("margin-left", (WIN_W / 8 - WIN_W / 8 * 0.5) / 2);
    $("#buttons_i_food_2").css("margin-left", (WIN_W / 8 - WIN_W / 8 * 0.5) / 2.5);
    $("#buttons_i_food_3").css("margin-left", (WIN_W / 8 - WIN_W / 8 * 0.5) / 2);
    $("#buttons_i_food_4").css("margin-left", (WIN_W / 8 - WIN_W / 8 * 0.5) / 2.7);
    $("#buttons_i_food_5").css("margin-left", (WIN_W / 8 - WIN_W / 8 * 0.5) / 2.7);
    $("#buttons_i_food_6").css("margin-left", (WIN_W / 8 - WIN_W / 8 * 0.5) / 2.7);
    $("#buttons_i_food_7").css("margin-left", (WIN_W / 8 - WIN_W / 8 * 0.5) / 2.7);
    //
    function recreateButton() {
        var buttons_m = $("#buttons_i_m").html("");
        var buttons_n = $("#buttons_i_n").html("");
        for (var b in BDATA) {
            buttons_m.append("<td>￥" + BDATA[b].price + "</td>");
            buttons_n.append("<td>" + BDATA[b].name.substr(0, 6) + "</td>");
            $("#buttons_i_food_" + b)
                .height(WIN_W / 8 * 0.5)
                .width(WIN_W / 8 * 0.5)
                .css("border-radius", WIN_W / 8 * 0.3)
                .attr("src", BDATA[b].imgs.split(",")[0]);
        }
    }
    recreateButton();
    //
    $("#bet_cong_bg").width(WIN_W).height(WIN_H);
    $("#bet_cong_dish")
        .width(WIN_W * 0.34).height(WIN_W * 0.34)
        .css("top", WIN_H * 0.38).css("left", WIN_W * 0.265);
    $("#bet_cong_food")
        .width(WIN_W * 0.34 * 0.8).height(WIN_W * 0.34 * 0.8)
        .css("top", WIN_H * 0.38 + WIN_W * 0.034)
        .css("left", WIN_W * 0.265 + WIN_W * 0.034)
        .css("border-radius", WIN_W * 0.34 * 0.4);
    $("#bet_cong_c")
        .css("top", WIN_H * 0.46).css("left", WIN_W * 0.643);
    $("#bet_cong_m")
        .css("top", WIN_H * 0.38 + WIN_W * 0.34 + 10);
    $("#bet_cong_n")
        .css("top", WIN_H * 0.38 + WIN_W * 0.34 + 55);
    if (BS) {
        $("#bet_none_bg").width(WIN_W).height(WIN_H).attr("src", "img/none.png");
    } else {
        $("#bet_none_bg").width(WIN_W).height(WIN_H).attr("src", "img/none_1.png");
    }
    $("#bet_bp_bg").width(WIN_W).height(WIN_H);
    //
    //
    $("#bet_bp_dish_0")
        .width(WIN_W * 0.24).height(WIN_W * 0.24)
        .css("top", WIN_H * 0.62 - WIN_W * 0.24)
        .css("left", WIN_W * 0.38);
    $("#bet_bp_food_0")
        .width(WIN_W * 0.24 * 0.8).height(WIN_W * 0.24 * 0.8)
        .css("top", WIN_H * 0.62 - WIN_W * 0.24 + WIN_W * 0.024)
        .css("left", WIN_W * 0.38 + WIN_W * 0.024)
        .css("border-radius", WIN_W * 0.24 * 0.4);
    $("#bet_bp_n_0")
        .width(WIN_W * 0.24)
        .css("top", WIN_H * 0.62)
        .css("left", WIN_W * 0.38);
    //
    $("#bet_bp_dish_1")
        .width(WIN_W * 0.16).height(WIN_W * 0.16)
        .css("top", WIN_H * 0.62 - WIN_W * 0.05)
        .css("left", WIN_W * 0.38 - WIN_W * 0.16 - 30);
    $("#bet_bp_food_1")
        .width(WIN_W * 0.16 * 0.8).height(WIN_W * 0.16 * 0.8)
        .css("top", WIN_H * 0.62 - WIN_W * 0.05 + WIN_W * 0.016)
        .css("left", WIN_W * 0.38 - WIN_W * 0.16 - 30 + WIN_W * 0.016)
        .css("border-radius", WIN_W * 0.16 * 0.4);
    $("#bet_bp_n_1")
        .width(WIN_W * 0.16)
        .css("top", WIN_H * 0.62 + WIN_W * 0.11)
        .css("left", WIN_W * 0.38 - WIN_W * 0.16 - 30);
    //
    $("#bet_bp_dish_2")
        .width(WIN_W * 0.16).height(WIN_W * 0.16)
        .css("top", WIN_H * 0.62 - WIN_W * 0.16)
        .css("left", WIN_W * 0.38 + WIN_W * 0.24 + 10);
    $("#bet_bp_food_2")
        .width(WIN_W * 0.16 * 0.8).height(WIN_W * 0.16 * 0.8)
        .css("top", WIN_H * 0.62 - WIN_W * 0.16 + WIN_W * 0.016)
        .css("left", WIN_W * 0.38 + WIN_W * 0.24 + 10 + WIN_W * 0.016)
        .css("border-radius", WIN_W * 0.16 * 0.4);
    $("#bet_bp_n_2")
        .width(WIN_W * 0.16)
        .css("top", WIN_H * 0.62)
        .css("left", WIN_W * 0.38 + WIN_W * 0.24 + 10);
    //
    $("#bet_bp_dish_3")
        .width(WIN_W * 0.12).height(WIN_W * 0.12)
        .css("top", WIN_H * 0.62 - WIN_W * 0.18 - 10)
        .css("left", WIN_W * 0.38 - WIN_W * 0.16);
    $("#bet_bp_food_3")
        .width(WIN_W * 0.12 * 0.8).height(WIN_W * 0.12 * 0.8)
        .css("top", WIN_H * 0.62 - WIN_W * 0.18 - 10 + WIN_W * 0.012)
        .css("left", WIN_W * 0.38 - WIN_W * 0.16 + WIN_W * 0.012)
        .css("border-radius", WIN_W * 0.16 * 0.4);
    $("#bet_bp_n_3")
        .width(WIN_W * 0.12)
        .css("top", WIN_H * 0.62 - WIN_W * 0.06 - 10)
        .css("left", WIN_W * 0.38 - WIN_W * 0.16);
    //
    $("#bet_bp_dish_4")
        .width(WIN_W * 0.12).height(WIN_W * 0.12)
        .css("top", WIN_H * 0.62 - WIN_W * 0.28 - 30)
        .css("left", WIN_W * 0.38 + WIN_W * 0.24 + 10);
    $("#bet_bp_food_4")
        .width(WIN_W * 0.12 * 0.8).height(WIN_W * 0.12 * 0.8)
        .css("top", WIN_H * 0.62 - WIN_W * 0.28 - 30 + WIN_W * 0.012)
        .css("left", WIN_W * 0.38 + WIN_W * 0.24 + 10 + WIN_W * 0.012)
        .css("border-radius", WIN_W * 0.16 * 0.4);
    $("#bet_bp_n_4")
        .width(WIN_W * 0.12)
        .css("top", WIN_H * 0.62 - WIN_W * 0.16 - 30)
        .css("left", WIN_W * 0.38 + WIN_W * 0.24 + 10);
    //
    $("#bet_bp_dish_5")
        .width(WIN_W * 0.12).height(WIN_W * 0.12)
        .css("top", WIN_H * 0.62 - WIN_W * 0.28 - 70)
        .css("left", WIN_W * 0.38 + WIN_W * 0.12 - 10);
    $("#bet_bp_food_5")
        .width(WIN_W * 0.12 * 0.8).height(WIN_W * 0.12 * 0.8)
        .css("top", WIN_H * 0.62 - WIN_W * 0.28 - 70 + WIN_W * 0.012)
        .css("left", WIN_W * 0.38 + WIN_W * 0.12 - 10 + WIN_W * 0.012)
        .css("border-radius", WIN_W * 0.16 * 0.4);
    $("#bet_bp_n_5")
        .width(WIN_W * 0.12)
        .css("top", WIN_H * 0.62 - WIN_W * 0.16 - 70)
        .css("left", WIN_W * 0.38 + WIN_W * 0.12 - 10);
    //
    $("#bet_bp_dish_6")
        .width(WIN_W * 0.16).height(WIN_W * 0.16)
        .css("top", WIN_H * 0.62 - WIN_W * 0.40)
        .css("left", WIN_W * 0.38 - WIN_W * 0.20 - 30);
    $("#bet_bp_food_6")
        .width(WIN_W * 0.16 * 0.8).height(WIN_W * 0.16 * 0.8)
        .css("top", WIN_H * 0.62 - WIN_W * 0.40 + WIN_W * 0.016)
        .css("left", WIN_W * 0.38 - WIN_W * 0.20 - 30 + WIN_W * 0.016)
        .css("border-radius", WIN_W * 0.16 * 0.4);
    $("#bet_bp_n_6")
        .width(WIN_W * 0.16)
        .css("top", WIN_H * 0.62 - WIN_W * 0.24)
        .css("left", WIN_W * 0.38 - WIN_W * 0.20 - 30);
    //
    $("#bet_bp_dish_7")
        .width(WIN_W * 0.12).height(WIN_W * 0.12)
        .css("top", WIN_H * 0.62 - WIN_W * 0.36 - 10)
        .css("left", WIN_W * 0.38 - WIN_W * 0.04);
    $("#bet_bp_food_7")
        .width(WIN_W * 0.12 * 0.8).height(WIN_W * 0.12 * 0.8)
        .css("top", WIN_H * 0.62 - WIN_W * 0.36 - 10 + WIN_W * 0.012)
        .css("left", WIN_W * 0.38 - WIN_W * 0.04 + WIN_W * 0.012)
        .css("border-radius", WIN_W * 0.16 * 0.4);
    $("#bet_bp_n_7")
        .width(WIN_W * 0.12)
        .css("top", WIN_H * 0.62 - WIN_W * 0.24 - 10)
        .css("left", WIN_W * 0.38 - WIN_W * 0.04);

    //
    $("#bet_bp_c")
        .css("top", WIN_H * 0.56).css("left", WIN_W * 0.643);
    $("#bet_bp_m")
        .css("top", WIN_H * 0.71);
    $("#bet_bp_n")
        .css("top", WIN_H * 0.77);

    //
    var my_r_c_mh = WIN_H - (WIN_H * 0.11 + top_t_h + 2) - 20;
    $("#my_r_c")
        .width(top_w * 0.6)
        .css("margin-top", top_mg + top_t_h + 2)
        .css("margin-left", WIN_W * 0.1)
        .css("min-height", 34)
        .css("max-height", my_r_c_mh);
    $("#my_r_c table").width(top_w * 0.6 + 2);
    $("#top_record_p").click(function() {
        $.getJSON(gameHost + "/usr/api/listOrder?type=10&ps=200&printed=0&tonek=" + token, function(res) {
            if (res.code !== 0) {
                console.error("loading my record error:", res);
                showTips("打印失败")
                return;
            }
            var ois = [];
            for (var i in res.data.data) {
                ois.push({
                    iid: res.data.data[i].items[0].tid,
                    oit: "10",
                })
            }
            if (res.data.data == undefined || res.data.data.length == 0) {
                showTips("您还没有奖品，快快来一局吧～");
                return
            }
            $.getJSON(gameHost + "/usr/api/addOrder?token=" + token, {
                action: "PRINT",
                foods: JSON.stringify(ois),
            }, function(res) {
                if (res.code !== 0) {
                    console.error("adding order error:", res);
                    showTips("打印失败");
                    return;
                } else {
                    showTips("打印成功")
                    $("#bet_foods").html("战绩：0");
                }
            })
        });
    });
    //

    //
    //
    //
    //
    var hide_bet_cover = null;

    function showCong(food, done) {
        $("#bet_cong_food").attr("src", food.imgs.split(",")[0]);
        $("#bet_cong_m").html("￥" + food.price);
        $("#bet_cong_n").html(food.name);
        $("#bet_cong").fadeIn(1000, done);
        hide_bet_cover = hideCong
    }

    function hideCong(done) {
        $("#bet_cong").fadeOut(1000, done);
        hide_bet_cover = null;
    }

    function showBp(foods, done) {
        var idx = 0
        for (idx in foods) {
            var food = BDATA[foods[idx].bidx]
            $("#bet_bp_food_" + idx).attr("src", food.imgs.split(",")[0]);
            $("#bet_bp_n_" + idx).html(food.name);
            $("#bet_bp_" + idx).show();
        }
        idx++;
        for (; idx < 8; idx++) {
            $("#bet_bp_" + idx).hide();
        }
        $("#bet_bp").fadeIn(1000, done);
        hide_bet_cover = hideBp
    }

    function hideBp(done) {
        $("#bet_bp").fadeOut(1000, done);
        hide_bet_cover = null;
    }

    function showNone(done) {
        $("#bet_none").fadeIn(1000, done);
        hide_bet_cover = hideNone
    }

    function hideNone(done) {
        $("#bet_none").fadeOut(1000, done);
        hide_bet_cover = null
    }

    function hideCover() {
        if (hide_bet_cover) {
            hide_bet_cover();
        }
    }
    //
    // showCong(FDATA[0]);
    // showBp(FDATA[0]);
    var tickAns = [];

    function clsfas() {
        tickAns = [];
        for (var i = foods.length - 1; i >= 0; i--) {
            foods[i].fas.css("display", "none");
        }
    }

    function dotick() {
        if (tickAns.length < 1) {
            // tickAns.push(newfas(0, 24, 2, false));
            // tickAns.push(newfas(0, 24, 3, true));
        }
        // if (this.tick > 1 && this.tick < 1.01) {
        // 	this.ans.push(this.newfas(0, 24, 2, true));
        // }
        if (bws.timing > 0) {
            clsfas();
        }
        for (var i in tickAns) {
            var an = tickAns[i];
            if (an.stopped) {
                tickAns.splice(i, 1);
            } else {
                tickAns[i].update();
            }
        }
    }

    function newfas(start, end, rc, reverse, done) {
        if (!done) {
            done = function() {}
        }
        var rbeg = reverse ? end : start;
        var rend = reverse ? (rc * FOOD_C + start) : (rc * FOOD_C + end);
        if (Math.floor((rend - rbeg) / FOOD_C) < 1) {
            rend += FOOD_C;
        }
        return {
            idx: reverse ? end : start,
            T: 0.5,
            tick: 0.1,
            rc: rc,
            end: end,
            start: start,
            stopped: false,
            reverse: reverse,
            rbeg: rbeg,
            rend: rend,
            update: function() {
                this.tick += 0.1;
                if (this.stopped || this.tick < this.T) {
                    return;
                }
                var dis = Math.min(this.idx - this.rbeg, this.rend - this.idx, 14);
                this.T = (15 - dis) * 0.025;
                this.stopped = this.idx >= this.rend;
                for (var i = this.idx; i > -1 && (i - this.rbeg) > -1 && i > this.idx - 5; i--) {
                    var ridx = 0;
                    if (this.reverse) {
                        ridx = (this.rend - i + this.end) % FOOD_C;
                    } else {
                        ridx = i % FOOD_C;
                    }
                    if ((this.stopped && (this.idx - i) !== 0) || (this.idx - i) === 4) {
                        foods[ridx].fas.css("display", "none");
                    } else {
                        foods[ridx].fas.css("display", "block");
                        foods[ridx].fas.attr("src", "img/fas_" + (this.idx - i) + ".png");
                    }
                }
                this.idx++;
                this.tick = 0;
                if (this.stopped) {
                    this.done(this);
                }
            },
            hide: function() {
                foods[end].fas.css("display", "none");
            },
            done: done,
        };
    }
    //new one big prize animate
    function newbpa(idx, time, done, proc) {
        if (!done) {
            done = function(fas) {
                fas.hide();
            }
        }
        if (!proc) {
            proc = function() {}
        }
        var count = Math.floor(time / 1000 / 0.2);
        var speed = 0.2 / count;
        return {
            idx: idx,
            T: 0.2,
            tick: 0.1,
            used: 0,
            time: time,
            show: false,
            stopped: false,
            count: count,
            speed: speed,
            update: function() {
                this.tick += 0.1;
                if (this.stopped || this.tick < this.T) {
                    return;
                }
                this.proc(this.count);
                if (this.count > 0) {
                    this.T = this.count * this.speed
                    this.count--;
                } else {
                    this.T = this.speed
                }
                this.used += this.tick * 1000;
                this.stopped = this.used >= this.time;
                this.tick = 0;
                if (this.stopped) {
                    this.done(this);
                }
                if (this.show || this.stopped) {
                    foods[this.idx].fas.css("display", "none");
                    this.show = false;
                } else {
                    foods[this.idx].fas.css("display", "block");
                    foods[this.idx].fas.attr("src", "img/fas_0.png");
                    this.show = true;
                }
            },
            hide: function() {
                foods[idx].fas.css("display", "none");
            },
            proc: proc,
            done: done,
        };
    }

    function faidx(idx) {
        if (idx >= bpidx - 1) {
            return idx + 2;
        } else if (idx >= lkidx) {
            return idx + 1;
        } else {
            return idx;
        }
    }

    function startfas(end, reverse, done) {
        tickAns.push(newfas(0, end, 2, reverse, done));
    }

    function startfas2(start, end, reverse, done) {
        tickAns.push(newfas(start, end, 2, reverse, done));
    }

    function startbpa(idx, time, done, proc) {
        tickAns.push(newbpa(idx, time, done, proc));
    }

    function showLuckyAns(idx, lucky, done) {
        var lv = $("#lucky_view_" + idx);
        lv.html("");
        var cc = 36 + Math.floor(Math.random() * 10);
        if (lucky > 0) {
            lv.append($("<img src='img/avatar/0" + (lucky % 8) + ".jpg' />"))
        } else {
            lv.append($("<img src='img/avatar/none.png' />"));
        }
        for (var i = 1; i < cc; i++) {
            lv.append($("<img class='lucky_view_nuse' src='img/avatar/0" + (1 + Math.floor(Math.random() * 7)) + ".jpg' />"))
        }
        $("#lucky_view img").width(lucky_view_img_w - 6)
            .height(lucky_view_img_h - 6)
            .css("padding", 3);
        lv.width(lucky_view_img_w).height(lucky_view_img_h * cc)
            .css("top", -lucky_view_img_h * cc);
        lv.tween({
            top: {
                start: -lucky_view_img_h * cc,
                stop: (lucky_view_h - lucky_view_img_h) / 2,
                time: 0,
                units: 'px',
                duration: 5,
                effect: 'quartInOut'
            },
            onStop: function() {
                $(".lucky_view_nuse").remove();
                if (done) {
                    done();
                }
            },
        }).play();
    }

    function showLuckyAnses(luckys, done) {
        var tdone;
        $(".lucky_view_img").html("");
        for (var i = 0; i < 3; i++) {
            if (i === 2) {
                tdone = done;
            } else {
                tdone = undefined;
            }
            setTimeout(showLuckyAns, i * 500, i, luckys.length > i ? luckys[i] : 0, tdone);
        }
    }

    function showLuckyView() {
        $("#center_lucky").show();
    }

    function hideLuckView() {
        $("#center_lucky").hide();
    }
    // showLuckyAnses(["a"], function() {
    // 	console.log("---->xxx");
    // });
    // tickAns.push(newfas(1, 10, 2, false));
    // startfas2(21, 1, true);
    // startbpa(1, 3000);
    function betAns2(idx, num) {
        if (num >= 0) {
            betAns(idx, true, num)
        } else {
            betAns(idx, false, -num);
        }
    }

    function betAns(idx, add, num) {
        var ba_c = $("<div class='layer' style=\"z-index:300\" />")
            .width(WIN_W * 0.05)
            .height(WIN_W * 0.04)
            .css("margin-top", WIN_H * 0.86)
            .css("margin-left", WIN_W / 8 * idx + (WIN_W / 8 - WIN_W * 0.05) / 2);
        if (add) {
            ba_c.append($("<img src='img/num/+.png' />")
                .width(WIN_W * 0.03).height(WIN_W * 0.03)
                .css("margin-top", WIN_W * 0.005));
        } else {
            ba_c.append($("<img src='img/num/-.png' />")
                .width(WIN_W * 0.03).height(WIN_W * 0.014)
                .css("margin-top", WIN_W * 0.013));
        }
        ba_c.append($("<img src='img/num/" + num + ".png' />").width(WIN_W * 0.02).height(WIN_W * 0.04));
        $("#game").append(ba_c);
        ba_c.animate({
            "margin-top": WIN_H * 0.86 - 80
        }, 500, 'linear', function() {
            ba_c.remove();
        });
    }
    setInterval(dotick, 100);

    function chkBtn(idx, selected) {
        var down = $("#buttons_i_down_" + idx);
        var normal = $("#buttons_i_normal_" + idx);
        if (selected === undefined) {
            chk = down.css("display") == "none";
        }
        if (selected) {
            down.css("display", "block");
            normal.css("display", "none");
            $("#buttons_i_food_" + idx).css("margin-top", 8);
        } else {
            down.css("display", "none");
            normal.css("display", "block");
            $("#buttons_i_food_" + idx).css("margin-top", 0);
        }
    }

    function resetBtn() {
        for (var i = 0; i < 8; i++) {
            chkBtn(i, false)
        }
    }

    var tips = $(".tips");
    tips.count = 0;
    tips.hide();

    function showTips(text) {
        tips.html(text);
        tips.css("top", WIN_H * 0.7).css("left", WIN_W / 2 - tips.width() / 2);
        tips.show();
        tips.count++;
        setTimeout(function() {
            tips.count--;
            if (tips.count < 1) {
                tips.hide();
            }
        }, 2000)
    }
    // showHistory(BDATA);
    //
    //
    //
    function getCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr !== null) return unescape(arr[2]);
        return null;
    }
    //var token = getCookie("token");
    token = location.search.match(/token=([^&]+)/) && RegExp.$1;
    if (!token || token.trim().length < 1) {
        console.error("token not found");
        return;
    }

    if (token != "abc") {
        $("#top_record_p_bg").css("display", "none");
        $("#top_record_p").css("display", "none");
        $("#top_record_p_t").css("display", "none");
    }

    function newws(ta) {
        var ws = new WebSocket('ws://' + wsHost + "/gaming/bet/ws");
        ws.onerror = function(ev) {
            ta.onerror(ev);
        };
        ws.onopen = function(ev) {
            ta.onopen(ev);
        };
        ws.onmessage = function(ev) {
            ta.onmessage(ev);
        };
        ws.onclose = function(ev) {
            ta.onclose(ev);
        };
        return ws;
    }

    var bh_d_w = 0;

    function showHistory(tdata) {
        $("#bet_history .history").remove();
        for (var i = 0; i < tdata.length; i++) {
            if (tdata[i].type === BET_N) {
                $("#bet_history tr").append("<td class='history'><img src='" + tdata[i].foods[0].food.imgs.split(",")[0] + "' /></td>");
            } else if (tdata[i].type === BET_BZ) {
                $("#bet_history tr").append("<td class='history'><img src='img/big_prize.png' /></td>");
            } else if (tdata[i].type === BET_LUCKY) {
                $("#bet_history tr").append("<td class='history'><img src='img/lucky.png' /></td>");
            }
        }
        $("#bet_history img")
            .width(top_h * 0.8).height(top_h * 0.8)
            .css("border-radius", top_h * 0.4)
            .css("margin-top", top_h * 0.05);
        bh_d_w = $("#bet_history td").width() * tdata.length - $("#record_c").width();
    }

    function refreshHistory() {
        $.getJSON(gameHost + "/gaming/bet/listBetHistoryFoods?pn=0&ps=20&token=" + token, function(res) {
            if (res.code !== 0) {
                console.error("loading history error:", res);
                return;
            }
            showHistory(res.data);
        });
    }
    refreshHistory();
    //
    var my_d_w = 0;
    var mr_d_ttop = 0;

    function showMyRecord(tdata) {
        var mrc = $("#my_r_c table").html("");
        for (var i = 0; i < tdata.length; i++) {
            mrc.append(
                '<tr><td class = "rc_lr" ><img src = "' +
                tdata[i].items[0].imgs.split(",")[0] +
                '" > </td><td>' + tdata[i].items[0].name +
                '</td><td class = "rc_lr" >￥' + tdata[i].items[0].price + '</td></tr>');
        }
        my_d_w = tdata.length * 34 - my_r_c_mh;
        mr_d_ttop = $("#my_r_c table").offset().top;

    }

    function refreshMyRecord() {
        $.getJSON(gameHost + "/usr/api/listOrder?type=10&ps=200&printed=0&token" + token, function(res) {
            if (res.code !== 0) {
                console.error("loading my record error:", res);
                return;
            }
            showMyRecord(res.data.data);
        });
    }
    $("#top_record").click(function() {
        $("#my_record").show();
        refreshMyRecord();
    });
    $("#my_r_c_b").click(function() {
        $("#my_record").hide();
    });
    var bh_d_ = false;
    var bh_d_iX;
    var bh_d_tleft = $("#bet_history").offset().left;
    var bh_d_xleft = 0;
    $("#bet_history").mousedown(function(e) {
        bh_d_ = true;
        bh_d_iX = e.clientX;
        bh_d_xleft = $("#bet_history").offset().left;
        return false;
    });
    var mr_d_ = false;
    var mr_d_iY;
    var mr_d_xtop = 0;
    $("#my_r_c table").mousedown(function(e) {
        mr_d_ = true;
        mr_d_iY = e.clientY;
        mr_d_xtop = $("#my_r_c table").offset().top;
        return false;
    });
    document.onmousemove = function(e) {
        var e = e || window.event;
        if (bh_d_) {
            var oX = (e.clientX - bh_d_iX) + bh_d_xleft;
            if (oX < bh_d_tleft - bh_d_w) {
                oX = bh_d_tleft - bh_d_w
            }
            if (oX > bh_d_tleft) {
                oX = bh_d_tleft;
            }
            $("#bet_history").offset({
                left: oX,
            });
            return false;
        } else if (mr_d_) {
            var oY = (e.clientY - mr_d_iY) + mr_d_xtop;
            if (oY < mr_d_ttop - my_d_w) {
                oY = mr_d_ttop - my_d_w
            }
            if (oY > mr_d_ttop) {
                oY = mr_d_ttop;
            }
            $("#my_r_c table").offset({
                top: oY,
            });
            return false;
        }
    };
    $(document).mouseup(function(e) {
        bh_d_ = false;
        mr_d_ = false;
        e.cancelBubble = true;
    });
    //
    bws.logined = false;
    bws.betting = false;
    bws.pressed = {};
    bws.betted = {};
    bws.tdata = "";
    bws.closed = true;
    bws.timing = 0;

    function countdown(time) {
        if (bws.closed) {
            return;
        }
        if (bws.timing < 1) {
            bws.timing = time;
            countdown_(time);
        } else {
            bws.timing = time;
        }
    }

    function countdown_() {
        if (bws.timing > 0) {
            $("#bet_gs").html(Math.floor(bws.timing / 1000) + "秒");
            bws.timing -= 1000;
            setTimeout(countdown_, 1000);
        } else {
            if ($("#bet_gs").html() == "正在开奖") {
                $("#bet_gs").html("0秒");
            }
        }
    }

    function reset() {
        if (bws.refresh) {
            console.log("refresh all");
            FDATA = bws.refresh.fs;
            BDATA = bws.refresh.bs;
            recreateButton();
            recreateFoods();
            bws.refresh = null;
        }
        bws.betting = false;
        resetBtn();
        bws.pressed = {};
        bws.betted = {};
        hideCover();
        hideLuckView();
        $(".lucky_view_img").html("");
        bws.showUinfo();
        refreshHistory();
    }
    bws.onerror = function(ev) {
        console.log("onerror", ev);
    };

    bws.onopen = function(ev) {
        bws.closed = false;
        console.log("login by token:" + token);
        clsfas();
        bws.sends(token);
    };
    bws.onclose = function(ev) {
        bws.closed = true;
        reset();
        clsfas();
        // console.log("onclose", ev);
        //$("#bet_gs").html("正在重连...");
        //bws.ws = newws(bws);
    };
    bws.onmessage = function(ev) {
        bws.tdata += ev.data;
        if (bws.tdata.substr(bws.tdata.length - 1) != "\n") {
            return;
        }
        var sdata = bws.tdata.trim();
        bws.tdata = "";
        if (sdata === "OK") {
            bws.logined = true;
            console.log("login success");
            $("#bet_gs").html("开始游戏");
            return;
        }
        if (!bws.logined) {
            console.error("receive message:" + sdata);
            return;
        }
        var msg = null;
        try {
            msg = $.parseJSON(sdata);
        } catch (e) {
            console.error(sdata);
            console.error("parse json err:" + e.message);
            return;
        }
        // console.log("M->", msg);
        switch (msg.C) {
            case "msg":
                bws.onmsg(msg);
                break;
            case "res":
                bws.onres(msg);
                break;
            case "data":
                bws.ondata(msg);
                break;
            case "heartbeat":
                break;
            default:
                console.error("unknow type->", msg);
                break;
        }
    };
    bws.ondata = function(msg) {
        bws.refresh = msg.data;
        console.log("ondata", msg.data);
        setTimeout(function() {
            for (i in document.images) document.images[i].ondragstart = function() {
                return false;
            }
        }, 300);
    };
    bws.onres = function(msg) {
        console.log("onres", msg);
        switch (msg.A) {
            case "a_bet":
                bws.pressed[msg.idx] = false;
                if (msg.code === 0) {
                    chkBtn(msg.idx, true);
                    bws.betted[msg.idx] = true;
                } else {
                    if (msg.msg == "余额不足") {
                        showTips(msg.msg);
                    } else {
                        console.log(msg.msg);
                        showTips("下注失败");
                    }
                }
                break;
            case "c_bet":
                bws.pressed[msg.idx] = false;
                if (msg.code === 0) {
                    chkBtn(msg.idx, false);
                    bws.betted[msg.idx] = false;
                } else {
                    showTips(msg.msg);
                }
                break;
            default:
                console.error("unknow action->", msg);
                break;
        }
    };
    bws.onmsg = function(msg) {
        console.log("onmsg", msg);
        switch (msg.A) {
            case "uinfo":
                bws.onuinfo(msg);
                break;
            case "gs":
                bws.ongs(msg);
                break;
            case "bet_res":
                bws.onbetres(msg);
                break;
            case "binfo":
                bws.onbinfo(msg);
            default:
                console.error("unknow action->", msg);
                break;
        }
    };
    bws.onbinfo = function(msg) {
        betAns2(msg.idx, msg.m);
    };
    bws.onuinfo = function(msg) {
        console.log("onuinfo->", msg);
        bws.uinfo = msg;
        console.log("status->", bws.status);
        if ("A" !== bws.status && "R" !== bws.status) {
            bws.showUinfo();
        }
    };
    bws.showUinfo = function() {
        $("#bet_foods").html("战绩：" + bws.uinfo.foods);
        $("#bet_money").html(bws.uinfo.overage + "元");
    };
    bws.ongs = function(msg) {
        // console.log("ongs->", msg);
        bws.status = msg.status;
        switch (msg.status) {
            case "W":
                $("#bet_gs").html("开始游戏");
                reset();
                break;
            case "B":
                bws.betting = true
                countdown(msg.time);
                break;
            default:
                bws.betting = false;
                break;
        }
    };
    bws.onbetres = function(msg) {
        console.log("onbetres->", msg);
        $("#bet_gs").html("正在开奖");
        var bres = msg.res;
        var done = function() {};
        switch (bres.type) {
            case BET_N:
                bws.onbetres_n(msg, bres, done);
                break;
            case BET_BZ:
                bws.onbetres_bz(msg, bres, done);
                break;
            case BET_LUCKY:
                bws.onbetres_lk(msg, bres, done);
                break;
            default:
                console.error("unknow betres->", msg);
                break;
        }
    };
    bws.onbetres_lk_1 = function(msg, bres, done) {
        if (bres.foods.length) {
            showLuckyAnses(bres.lucky, function() {
                var bf = bres.foods[0];
                startfas2(lkidx, faidx(bf.idx), false, done);
            });
        } else {
            showLuckyAnses(bres.lucky, done);
        }

    }
    bws.onbetres_lk_0 = function(msg, bres, done) {
        startfas(lkidx, false, function() {
            startbpa(lkidx, 5000, function() {}, function(cc) {
                if (cc === 20) {
                    bws.onbetres_lk_1(msg, bres, done)
                } else if (cc === 23) {
                    showLuckyView();
                }
            })
        });
    };
    bws.onbetres_lk = function(msg, bres, done) {
        bws.onbetres_lk_0(msg, bres, function(fas) {
            // setTimeout(function() {
            if (bres.foods.length) {
                var bf = bres.foods[0];
                if (bws.betted[bf.bidx]) {
                    showCong(BDATA[bf.bidx], function() {
                        fas.hide();
                        done();
                    });
                    return;
                }
            }
            showNone(function() {
                fas && fas.hide();
                done();
            });
            // }, FAS_STIME);
        });
    };
    bws.onbetres_bz_2 = function(msg, bres, idx, done) {
        var bf = bres.foods[idx];
        var bpidx = FOOD_C - Math.floor(ys / 2);
        // console.log(bpidx, bf.idx);
        startfas2(bpidx, faidx(bf.idx), (idx % 2) === 1, done);
    };
    bws.onbetres_bz_1 = function(msg, bres, done) {
        if (bres.foods.length < 1) {
            done(null);
            return;
        }
        bres.foods.sort(function(a, b) {
            return a.idx > b.idx;
        });

        var i = 0;
        for (; i < bres.foods.length - 1; i++) {
            setTimeout(bws.onbetres_bz_2, i * 500, msg, bres, i)
        };
        setTimeout(bws.onbetres_bz_2, i * 500, msg, bres, i, done);
    };
    bws.onbetres_bz_0 = function(msg, bres, done) {
        var bpidx = FOOD_C - Math.floor(ys / 2);
        startfas(bpidx, false, function() {
            startbpa(bpidx, 3000, function() {}, function(cc) {
                if (cc === 10) {
                    bws.onbetres_bz_1(msg, bres, done);
                }
            })
        });
    };
    bws.onbetres_bz = function(msg, bres, done) {
        bws.onbetres_bz_0(msg, bres, function(fas) {
            setTimeout(function() {
                if (bres.foods.length < 1) {
                    showNone(function() {});
                    return;
                }
                var bfs = [];
                for (var fidx in bres.foods) {
                    var bf = bres.foods[fidx];
                    if (bws.betted[bf.bidx]) {
                        bfs.push(bf);
                    }
                }
                // console.log(bfs, bws.betted);
                if (bfs.length) {
                    showBp(bfs, function() {});
                } else {
                    showNone(function() {});
                }
            }, FAS_STIME);
        });
    }
    bws.onbetres_n = function(msg, bres, done) {
        var bf = bres.foods[0];
        console.log(FDATA[bf.idx], "-->", BDATA[bf.bidx]);
        startfas(faidx(bf.idx), false, function(fas) {
            setTimeout(function() {
                if (bws.betted[bf.bidx]) {
                    showCong(BDATA[bf.bidx], function() {
                        fas.hide();
                        done();
                    });
                } else {
                    showNone(function() {
                        fas.hide();
                        done();
                    });
                }
            }, FAS_STIME);
        });
    }
    bws.sends = function(data) {
        bws.ws.send(data + "\n");
    };
    bws.sendv = function(obj) {
        bws.sends(JSON.stringify(obj));
    };

    function heartbeat() {
        bws.sendv({
            "C": "heartbeat",
            "time": new Date().getTime(),
        })
    }
    onbet = function(idx) {
        if (!bws.betting) {
            showTips("开始游戏");
            return;
        }
        if (bws.pressed[idx]) {
            showTips("正在压菜");
            return;
        }
        bws.pressed[idx] = true;
        if (bws.betted[idx]) {
            console.log("cancel bet to " + idx)
            bws.sendv({
                "C": "c_bet",
                "idx": idx, //菜品下标
                "m": 1, //压菜额度
            })
        } else {
            console.log("adding bet to " + idx)
            bws.sendv({
                "C": "a_bet",
                "idx": idx, //菜品下标
                "m": 1, //压菜额度
            })
        }
    };
    bws.ws = newws(bws);
    setInterval(heartbeat, 5000);
    // if (!Modernizr.touch) { // if not a smartphone
    // 	debiki.Utterscroll.enable();
    // 	console.log("sssss->>>>>");
    // }
    $("div").attr("onselectstart", "return false");
    recreateButton();
    recreateFoods();
    setTimeout(function() {
        for (i in document.images) document.images[i].ondragstart = function() {
            return false;
        }
    }, 300);

});
}, 500);
