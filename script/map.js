window.onload = function(){
    var map;
    initMap();
    $("#info-panel").load("infowindow.html");
    var opts = {
            width: 370,
            height:190,
            enableMessage: false,
            enableAutoPan : true     //自动平移
        };
    var geoc = new BMap.Geocoder();
    // console.log(sContent);
	  //创建和初始化地图函数：
    function initMap(){
      createMap();//创建地图
      setMapEvent();//设置地图事件
      addMapControl();//向地图添加控件
      addMapOverlay();//向地图添加覆盖物
    }
    
    function createMap(){ //创建地图
      map = new BMap.Map("map"); 
      map.centerAndZoom(new BMap.Point(106.586198,29.516889),13);//两个参数，一个是初始化的点坐标（即设置中心点坐标），一个是初始地图显示的级别
    }
    function setMapEvent(){//设置地图事件
      map.enableScrollWheelZoom();//地图鼠标事件
      map.enableKeyboard();//键盘事件
      map.enableDragging();//拖曳事件
      map.enableDoubleClickZoom()//双击放大事件
    }
   
   function Info(marker,markers,point){
        var sContent = $("#divinfoWindow").html();
        var infoWindow = new BMap.InfoWindow(sContent,opts);
        marker.openInfoWindow(infoWindow);
        geoc.getLocation(point,function(rs){
            var addComp = rs.addressComponents;
            var position=addComp.province + "" + addComp.city + "" + addComp.district + "" + addComp.street + "" + addComp.streetNumber;
            $("#position").html(position);
            $("#carnum").text(markers.carnum);
            $("#time").text(markers.time);
            $("#driver").text(markers.driver);
            $("#tel").text(markers.tel);
            $("#department").text(markers.department);
          });
       document.getElementById('imgDemo').onload = function (){
          infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
      }
   }
    function addClickHandler(marker,markers){
        //标注添加监听事件，显示弹框信息
      marker.addEventListener("click",function(e){
        var point=e.point;
        Info(marker,markers,point);
      });
  }
    function addMapOverlay(){//向地图添加覆盖物
      $.get("/Carposition/JSON/data.json",function(data){
          var markers = data.datasoure;
          for(var index = 0; index < markers.length; index++ ){
            
            var point = new BMap.Point(markers[index].position[0].lng,markers[index].position[0].lat);//获取当前覆盖物的经度和纬度
            
            var marker = new BMap.Marker(point,{icon:new BMap.Icon("../Carposition/image/car.png",new BMap.Size(48,48))});//自定义icon图标
         
            var label = new BMap.Label(markers[index].carnum,{offset: new BMap.Size(30,-5)});
            label.setStyle({
              color:"#000",
              backgroundColor:"#0099FF",
              fontSize:"14px",
              fontFamily:"微软雅黑",
              border:"none",
              height:"20px",
            });
            marker.setLabel(label);
            addClickHandler(marker,markers[index]);
            map.addOverlay(marker);//添加点
          };
          tableclick(markers);
        });
    }
    
    function theLocation(no,markers){//用经纬度设置中心点
         var allOverlay = map.getOverlays();
         for(var j = 0; j<=allOverlay.length;j++){
          try{
             if(allOverlay[j].getLabel().content==no){
                 var newpoint = allOverlay[j].getPosition();
                 for(var k = 0;k<markers.length;k++){
                   if(markers[k].carnum==no){
                      Info(allOverlay[j],markers[k],newpoint);
                      break;
                   }
                 }
                 map.setCenter(newpoint);//重新设置中心点
                 allOverlay[j].setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                 allOverlay[j].setAnimation();//取消动画
                 break;
               }
           }
          catch(e){
             // continue;
          }
         }
    }
    
    function addMapControl(){//向地图添加控件
      var scaleControl = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
      scaleControl.setUnit(BMAP_UNIT_IMPERIAL);
      map.addControl(scaleControl);
      var navControl = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:0});
      map.addControl(navControl);
      var overviewControl = new BMap.OverviewMapControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,isOpen:true});
      map.addControl(overviewControl);
    }

    function tableclick(markers){//列表框的点击事件
      $(".contenttr").on("click",function(){
           var no = $(this).children("td").eq(1).text();
           theLocation(no,markers);
        });
    }

}
