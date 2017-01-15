
$(document).ready(function(){

        $.getScript("http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js",function(){
            var cityFromIp = remote_ip_info["city"];  
            $('.position').html(cityFromIp+','+'中国'); 

            ajaxJson(cityFromIp);
        }) ;

        $('#searchContent').on('focus',function(){
            if($('#msg').html()=='城市名不能为空！'){
                $('#msg').html('');
            }
        });

        $('#searchButton').on('click',function(){

            if($('#searchContent').val()){

                $('#msg').html('');

                var cityFromUser=$('#searchContent').val();
              
                for(var i=0;i<cityList.length;i++){
                    if(cityFromUser==cityList[i]){
                        $('#msg').html('');
                        $('#searchContent').val('');
                        $('.position').html(cityFromUser+','+'中国'); 
                        ajaxJson(cityFromUser);
                        return false;
                    }
                } 
                $('#msg').html('请输入正确的城市名！');
            }else{
                $('#msg').html('城市名不能为空！');
            }

        });

        $('#searchClean').on('click',function(){
           $('#searchContent').val('');
           $('#msg').html('');
        });
     
        function ajaxJson(city){ 
            $.ajax({
                url:"http://v.juhe.cn/weather/index?format=2&cityname="+city+"&key=8bea793873c93663fa753b21c584c8c3xiao",
                crossDomain:true,
                type:'get',
                dataType:'jsonp',
                jasonp:'callback',
                success:function(data){
                     render(data);
                }
            }); 
        }

        // render();
        function render(data){
                    var returnWeather=data;
                    $('#weather_big_tem').html(returnWeather.result.sk.temp+'°');
                    $('#weather_text').html(returnWeather.result.today.weather);
                    $('#weather_update_time').html(' 今天 '+returnWeather.result.sk.time+' 更新');
                    $('#wet').html('   湿度 '+returnWeather.result.sk.humidity);
                    $('#wind').html('   '+returnWeather.result.sk.wind_direction+' '+returnWeather.result.sk.wind_strength);
                    
                    today_msg_text();
                    function today_msg_text(){
                        var msg_text;
                        var fa=parseInt(returnWeather.result.today.weather_id.fa);
                        var temp=returnWeather.result.sk.temp;
                    
                        if(fa==0||fa==1){  
                            if(temp>30){msg_text='天气炎热，请注意防暑降温！'}
                                else if(temp<10){msg_text='天气寒冷，请注意保暖！'}
                                    else if(temp>=10&&temp<=30){msg_text='天气温暖，请尽情享受生活！'}
                        }
                        else if(fa>=2&&fa<=12){msg_text='今日有降雨，请注意备好雨具！'}
                            else if(fa>=13&&fa<=17){msg_text='今日有降雪，请注意防寒保暖！'}
                                else if((fa>=19&&fa<=21)||fa==28){msg_text='今日雨雪天气，请注意防寒保暖！'}
                                     else if(fa==18||fa==53){msg_text='今日雾霾天气，路上注意安全，做好防护措施！'}
                                        else if((fa>=29&&fa<=31)||fa==20){msg_text='今日局部有扬尘或沙尘暴，请做好防护措施！'}
                        $('#today_msg_text').html(msg_text);
                    } 

                    setBoy();
                    function setBoy(){
                        var b;
                        var temp=returnWeather.result.sk.temp;
                        if(temp<-5){b=10;}
                        else if(temp<10){b=9;}
                        else if(temp<20){ b=Math.floor(Math.random()*4+5);}
                        else if(temp<30){b=3;}
                        else if(temp>=30){b=1;}
                        $('#boy').attr('src','https://h5tq.moji.com/tianqi/assets/155a6d7c27708726/images/avator/icon/'+b+'.png');
                    } 
                    setWeatherImg(returnWeather.result.today.weather_id,$('#weather_big_img')[0]);  
                    function setWeatherImg(obj,which){
                        var img;
                        var fa_today=obj.fa;
                        if(weather_id_detail[fa_today][0]!==undefined){
                             if(returnWeather.result.sk.time<'18:00'){
                                 img=weather_id_detail[fa_today][0]; 
                             }else{
                                 img=weather_id_detail[fa_today][1]; 
                             }  
                        }else{
                              img=weather_id_detail[fa_today];
                        }    
                        which.src='https://h5tq.moji.com/tianqi/assets/images/weather/w'+img+'.png';
                    } 

                    var future=returnWeather.result.future;
                    for(let i=0;i<7;i++){
                        $('table tbody tr td:nth-child(1)')[i].innerHTML=future[i].date+' '+future[i].week;       
                        var mid1=returnWeather.result.future[i].weather_id;
                        var mid2=$('table tbody tr td img')[i];             
                        setWeatherImg(mid1,mid2); 
                        $('table tbody tr td:nth-child(2)')[i].innerHTML+=future[i].weather;
                        $('table tbody tr td:nth-child(3)')[i].innerHTML=future[i].temperature;
                        $('table tbody tr td:nth-child(4)')[i].innerHTML=future[i].wind;
                    }
                    $('.p1')[0].title=returnWeather.result.today.dressing_advice;
                    $('.p2')[0].innerHTML=returnWeather.result.today.dressing_index;
                    $('.p2')[1].innerHTML=returnWeather.result.today.uv_index;
                    $('.p2')[2].innerHTML=returnWeather.result.today.wash_index;
                    $('.p2')[3].innerHTML=returnWeather.result.today.exercise_index;
                    $('.p2')[4].innerHTML=returnWeather.result.today.travel_index;
        }
});

var weather_id_detail={  
"00": [0,30], //"晴",
"01": [1,31], //"多云",
"02":  2 ,    //"阴",
"03": [3,33], //"阵雨",
"04": 4 ,     //"雷阵雨",
"05": 5 ,     //"雷阵雨伴有冰雹",
"06": 6 ,     //"雨夹雪",
"07": 7 ,     //"小雨",
"08": 8 ,     //"中雨",
"09": 9 ,     //"大雨",
"10": 9 ,     //"暴雨",
"11": 9 ,     //"大暴雨",
"12": 9 ,     //"特大暴雨",
"13": [13,34], //"阵雪",
"14": 14 ,     //"小雪",
"15": 15 ,     //"中雪",
"16": 16 ,     //"大雪",
"17": 17 ,     //"暴雪",
"18": [18,32], //"雾",
"19":  19 ,     //"冻雨",
"20": [29,35] , //"沙尘暴",
"21":  7 ,      //"小雨-中雨",
"22":  8 ,      //"中雨-大雨",
"23":  9 ,      //"大雨-暴雨",
"24":  9 ,      //"暴雨-大暴雨",
"25":  9 ,      //"大暴雨-特大暴雨",
"26": 14 ,      //"小雪-中雪",
"27": 15 ,      //"中雪-大雪",
"28": 16 ,      //"大雪-暴雪",
"29":[29,35],   //"浮尘",
"30":[29,35],   //"扬沙",
"31":[29,35],  //"强沙尘暴",
"53": 45};


var cityList=[
"北京",
"上海",
"天津",
"重庆",
"哈尔滨",
"齐齐哈尔",
"牡丹江",
"佳木斯",
"绥化",
"黑河",
"大兴安岭",
"伊春",
"大庆",
"七台河",
"鸡西",
"鹤岗",
"双鸭山",
"长春",
"吉林",
"延边",
"四平",
"通化",
"白城",
"辽源",
"松原",
"白山",
"沈阳",
"大连",
"鞍山",
"抚顺",
"本溪",
"丹东",
"锦州",
"营口",
"阜新",
"辽阳",
"铁岭",
"朝阳",
"盘锦",
"葫芦岛",
"呼和浩特",
"包头",
"乌海",
"乌兰察布",
"通辽",
"兴安盟",
"通辽",
"赤峰",
"鄂尔多斯",
"巴彦淖尔",
"锡林郭勒",
"呼伦贝尔",
"兴安盟",
"通辽",
"兴安盟",
"阿拉善盟",
"石家庄",
"保定",
"张家口",
"承德",
"唐山",
"廊坊",
"沧州",
"衡水",
"邢台",
"邯郸",
"秦皇岛",
"太原",
"大同",
"阳泉",
"晋中",
"长治",
"晋城",
"临汾",
"运城",
"朔州",
"忻州",
"吕梁",
"西安",
"咸阳",
"延安",
"榆林",
"渭南",
"商洛",
"安康",
"汉中",
"宝鸡",
"铜川",
"杨凌",
"济南",
"青岛",
"淄博",
"德州",
"烟台",
"潍坊",
"济宁",
"泰安",
"临沂",
"菏泽",
"滨州",
"东营",
"威海",
"枣庄",
"日照",
"莱芜",
"聊城",
"乌鲁木齐",
"克拉玛依",
"石河子",
"昌吉",
"吐鲁番",
"巴音郭楞",
"阿拉尔",
"阿克苏",
"喀什",
"伊犁",
"塔城",
"哈密",
"和田",
"阿勒泰",
"克州",
"博尔塔拉",
"拉萨",
"日喀则",
"山南",
"林芝",
"昌都",
"那曲",
"阿里",
"西宁",
"海东",
"黄南",
"海南",
"果洛",
"玉树",
"海西",
"海北",
"格尔木",
"兰州",
"定西",
"平凉",
"庆阳",
"武威",
"金昌",
"张掖",
"酒泉",
"天水",
"陇南",
"临夏",
"甘南",
"白银",
"嘉峪关",
"银川",
"石嘴山",
"吴忠",
"固原",
"中卫",
"郑州",
"安阳",
"新乡",
"许昌",
"平顶山",
"信阳",
"南阳",
"开封",
"洛阳",
"商丘",
"焦作",
"鹤壁",
"濮阳",
"周口",
"漯河",
"驻马店",
"三门峡",
"济源",
"南京",
"无锡",
"镇江",
"苏州",
"南通",
"扬州",
"盐城",
"徐州",
"淮安",
"连云港",
"常州",
"泰州",
"宿迁",
"武汉",
"襄阳",
"鄂州",
"孝感",
"黄冈",
"黄石",
"咸宁",
"荆州",
"宜昌",
"恩施",
"十堰",
"神农架",
"随州",
"荆门",
"荆州",
"天门",
"仙桃",
"潜江",
"杭州",
"湖州",
"嘉兴",
"宁波",
"绍兴",
"台州",
"温州",
"丽水",
"金华",
"衢州",
"舟山",
"合肥",
"蚌埠",
"芜湖",
"淮南",
"马鞍山",
"安庆",
"宿州",
"阜阳",
"亳州",
"黄山",
"滁州",
"淮北",
"铜陵",
"宣城",
"六安",
"巢湖",
"池州",
"福州",
"厦门",
"宁德",
"莆田",
"泉州",
"漳州",
"龙岩",
"三明",
"南平",
"钓鱼岛",
"南昌",
"九江",
"上饶",
"抚州",
"宜春",
"吉安",
"赣州",
"景德镇",
"萍乡",
"新余",
"鹰潭",
"长沙",
"湘潭",
"株洲",
"衡阳",
"郴州",
"常德",
"益阳",
"娄底",
"邵阳",
"岳阳",
"张家界",
"怀化",
"永州",
"湘西",
"贵阳",
"遵义",
"安顺",
"黔南",
"黔东南",
"铜仁",
"毕节",
"六盘水",
"黔西南",
"成都",
"攀枝花",
"自贡",
"绵阳",
"南充",
"达州",
"遂宁",
"广安",
"巴中",
"泸州",
"宜宾",
"内江",
"资阳",
"乐山",
"眉山",
"凉山",
"雅安",
"甘孜",
"阿坝",
"德阳",
"广元",
"广州",
"韶关",
"惠州",
"梅州",
"汕头",
"深圳",
"珠海",
"佛山",
"肇庆",
"湛江",
"江门",
"河源",
"清远",
"云浮",
"潮州",
"东莞",
"中山",
"阳江",
"揭阳",
"茂名",
"汕尾",
"昆明",
"大理",
"红河",
"曲靖",
"保山",
"文山",
"玉溪",
"楚雄",
"普洱",
"昭通",
"临沧",
"怒江",
"迪庆",
"丽江",
"德宏",
"西双版纳",
"南宁",
"崇左",
"柳州",
"来宾",
"桂林",
"梧州",
"贺州",
"贵港",
"玉林",
"百色",
"钦州",
"河池",
"北海",
"防城港",
"海口",
"三亚",
"东方",
"临高",
"澄迈",
"儋州",
"昌江",
"白沙",
"琼中",
"定安",
"屯昌",
"琼海",
"文昌",
"保亭",
"万宁",
"陵水",
"西沙",
"南沙",
"乐东",
"五指山",
"香港",
"澳门",
"台北",
"高雄",
"台中"];