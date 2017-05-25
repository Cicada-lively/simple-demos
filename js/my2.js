function getCardExpDate(){
	return $("#years").val().substr(2,4)+$("#month").val();
}
//定时对象
var intval=null;
//是否允许发送短信
var allowGetSms = true;
$(function() {
  //初始化
  var path_remote=document.getElementById("remoteUrlPath").value;
  
  //获取导航菜单的第一个菜单的业务类型，初始化对应的支付类型
  var businesstype = $("#nav p:first").attr("businesstype");
  
  //如果是WAP支付，则初始化WAP支付；如果是银行卡支付，则初始化银行卡支付;如果是支付宝wap支付，则初始化支付宝wap支付
  if("wap" == businesstype || "b2c" == businesstype || "alipayWap" == businesstype) {
	var hisId = $("#hisId"+businesstype).val() ;
	var hisMobileVerifyFlag = $("#hisMobileVerifyFlag"+businesstype).val();
	if(hisId != '' && typeof(hisId) != "undefined") {
		$(".bank_whole3 .banks").addClass('border_35c295') ;
		$("#payChannelId"+businesstype).val(hisId) ;
		$("#mobileVerifyFlag"+businesstype).val(hisMobileVerifyFlag) ;
	}else{
		$("#bank_whole4"+businesstype+" li:first").addClass('border_35c295');
		var payclass = $("#bank_whole4"+businesstype+" li:first").find("img").data("payclass");
		$("#payChannelId"+businesstype).val(payclass);
	}
  }
  $("#pointwxpayWap").html("2、打开微信扫一扫，点击右上角的相册按钮；");
  $("#pointalipayScanWap").html("2、打开支付宝扫一扫，点击右上角的相册按钮；");
 
  //如果是微信支付或者支付宝支付
  if("wxpayWap" == businesstype || "alipayScanWap" == businesstype){
	  var isReceivablePayment=$("#isReceivablePaymentInput").val(); 
	  if(isReceivablePayment==null||isReceivablePayment==undefined||isReceivablePayment==''){
   		 payAndGetOrCode(businesstype,'qrcode'+businesstype,'scan2d'+businesstype,200,200);
      }
	  
  }
  
  //如果是快捷支付，则初始化快捷支付
  if("express" == businesstype){
	  initExpressPay();
  }
  
  var Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ];// 加权因子   
  var ValideCode = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ];// 身份证验证位值.10代表X  
  var errorCounts = 0;//易宝快捷支付首次获取验证码失败次数控制
  var path=document.getElementById("path").value;
  $(".order_list li:lt(2)").show();
  $(".bank_whole li:lt(5)").show();
  $(".bank_whole2 li:lt(5)").show(); 
  $("#bank_payb2c .bank_whole3 li:lt(1)").show();
  $("#bank_paywap .bank_whole3 li:lt(1)").show();
  $("#bank_payalipayWap .bank_whole3 li:lt(1)").show();
  $("#bank_payb2c .bank_whole4 li:lt(5)").show();
  $("#bank_paywap .bank_whole4 li:lt(5)").show();
  $("#bank_payalipayWap .bank_whole4 li:lt(5)").show();
  $(".date_hide").hide(); 
  var $upp_height=$(".banks a").height()+"px";

  // var $upp_height=$(".banks a").height()+"px";
  // $(".upp").height($upp_height);
  $(".upp").css({"display":"inlin-block"});
  
  $(".prompt em").click(function() {
    $(".prompt").slideUp();
  })

	  var expressShowFlag = $("#expressShowFlag").val() ;
	  var debitShowFlag = $("#debitShowFlag").val() ;
	  if("0"==debitShowFlag){
		  $(".quick_title2").addClass("hidden_div");
		  $(".bank_whole .banks").css("display", "none");
	  }
	  if("0"==expressShowFlag){
		  $(".quick_title2").addClass("hidden_div");
		  $(".bank_whole2 .banks").css("display", "none");
	  }   	

   
/**************菜单下拉**************/
  $("#nav p").click(function() {
	
	if ($(this).hasClass("cav")) {
		return;
	}
	var businesstype = $(this).attr("businesstype");
    var $nav_index =$("#nav p").index(this);
    $(this).addClass('cav').siblings().removeClass("cav");    
    $("#main .li_choose").eq($nav_index).show().siblings().hide();   
    $("#bank_whole_express li:first").removeClass('border_35c2951_1');
    $("#bank_whole2_express li:first").removeClass('border_35c2951_1');
 	if(!$(".border_35c2951_1").length>0){
	    var hisId = $("#hisId"+businesstype).val() ;
	    var hisMobileVerifyFlag = $("#hisMobileVerifyFlag"+businesstype).val();
	    if("wap" == businesstype || "b2c" == businesstype || "alipayWap" ==businesstype) {
	    	if(hisId != '' && typeof(hisId) != "undefined") {
				$(".bank_whole3 .banks").addClass('border_35c295') ;
				$("#payChannelId"+businesstype).val(hisId) ;
				$("#mobileVerifyFlag"+businesstype).val(hisMobileVerifyFlag) ;
			}else{
				$("#bank_whole4"+businesstype+" li:first").addClass('border_35c295');
				var payclass = $("#bank_whole4"+businesstype+" li:first").find("img").data("payclass");
				$("#payChannelId"+businesstype).val(payclass);
			}
		}	
    }
 	if("express" == businesstype) {
 		initExpressPay();
 	}
		
 	//如果是微信支付或者支付宝支付
	
	if("wxpayWap" == businesstype || "alipayScanWap" == businesstype){
		var isReceivablePayment=$("#isReceivablePaymentInput").val(); 
		if(isReceivablePayment==null||isReceivablePayment==undefined||isReceivablePayment==''){
	   		payAndGetOrCode(businesstype,'qrcode'+businesstype,'scan2d'+businesstype,200,200);
	    }
    }
    
    $("#nav").slideUp();
    $("#title").text($(this).text()); 
    $("#nav_btn").removeClass('cav5');
  })
  
  /**初始化快捷支付**/
  function initExpressPay(){
	  $("#exp_first_div").removeClass("hidden_div");
	  $("#exp_second_div").addClass("hidden_div");
	  $("#exp_third_div").addClass("hidden_div");
	  $("#mobile").val("此卡在银行预留的手机号");
	  $("#chPhoneNumber").val("");
	  $(".submitErrP").val("");
	  $(".cardtab").data("selected",false);
	  $(".cardtab").removeData("bankcode");
	  $(".cardtab").removeData("paychannelid");
	  $(".cardtab").removeData("channelcode");
	  $("#bank_list1 .banks").removeClass('border_35c2951_1');
	  $("#new_card_main li").removeClass('cav4');
   	  $("#nextStep").removeClass('active');
   	  $("#bindId").val("");
   	  $("#signId").val("");
   	  //借记卡不存在，则显示信用卡
   	  var wstyle1 = $(".bank_whole li").length;
  	  if(wstyle1 == 0){
		  $(".bank_whole2").css("display", "block");
		  $("#oldCardDebit").removeClass("cav2")
		  $("#oldCardCredit").addClass("cav2")
  	  }
   	  // 若显示借记卡tab页，则借记卡第一个银行选中；若显示信用卡tab页，则信用卡第一个银行选中
	  var $bkImg = {};
	  if($("#oldCardDebit").hasClass("cav2")){
	   	$bkImg = $("#bank_whole_express img:first");
	  }
	  if($("#oldCardCredit").hasClass("cav2")){
	   	$bkImg = $("#bank_whole2_express img:first");
	  }
	  loadSelectBankData($bkImg);  	  
  }
  
   $("#nav_btn").on("click", function(e){
    if($("#nav").is(":hidden")){
        $("#nav").slideDown();
         $(this).addClass('cav5')
      }else{
        $(".nav").slideUp();
         $(this).removeClass('cav5')
      }
      $(document).one("click", function(){
          $("#nav").slideUp();
           $("#nav_btn").removeClass('cav5');
      });
      e.stopPropagation();
  });
  $("#nav p").on("click", function(e){  
      e.stopPropagation();
  });
  
  function qrcodeErrorPicClick(businessType){
	  
      payAndGetOrCode(businessType,'qrcode'+businessType,'scan2d'+businessType,200,200);
  };
  function ErrorPicDisplay(qrcode,payType,errorcode,errorMsg){
	  $("#"+qrcode).css("display","none");
	  $("#"+qrcode).html("");
	  $("#payFailDiv"+payType).css("display","block");
	  $("#scanPayErrorCode"+payType).html(errorcode);
	  $("#scanPayErrorMsg"+payType).html(errorMsg);
  }
   
  function payAndGetOrCode(payType, qrcode, scan2d, width, height) {
		setLoading(payType, qrcode, width, height);
		
		var url =$("#scanPay"+payType).attr("action");
		var payChannelId = '';
		
		var chlType = "";
		var errorCode = "ORDER_AMOUNT_OVER_LIMIT";
		var errorMsg = "";
		if (payType == 'wxpayWap') {
			chlType = "03";
			errorMsg = "微信扫码单笔金额不能超过50000元，请选择其他支付方式";
		}else if (payType == 'alipayScanWap'){
			errorMsg = "支付宝扫码单笔金额不能超过50000元，请选择其他支付方式";
		} 
		
		var txMoney = $("#txMoney" + payType).val();
		if (txMoney > 50000) {
			ErrorPicDisplay(qrcode,payType,errorCode,errorMsg);
			return;
		}
		
		var scan2d = $("#scan2d" + payType).val();
		if(scan2d != ''){
			$("#" + qrcode).html("");
			var oQRCode = new QRCode(qrcode, {
				width : width,
				height : height
			});
			oQRCode.clear();
			oQRCode.makeCode(scan2d);
			
			return ;
		}

		var bankCode = $("#payChannelId" + payType).data("bankcode");
		var payChannelId = $("#payChannelId" + payType).val();
		var orderKey = $("#orderKey" + payType).val();
		var orderInfo = $("#orderInfo" + payType).val();
		var isReceivablePayment=$("#isReceivablePaymentInput").val();
		
		var payMoney = $("#payMoney").val();
		var merchantId = $("#merchantId").val();
		var userName = $("#userName").val();
		var phone = $("#phone").val();
		var email = $("#email").val();
		var addr = $("#addr").val();
		var postzip = $("#postzip").val();
		

		var dataStr = "bankCode=" + bankCode + "&payChannelId=" + payChannelId
				+ "&orderKey=" + orderKey + "&orderInfo=" + orderInfo
				+ "&chlType=" + chlType + "&isReceivablePayment=" + isReceivablePayment
				+ "&payMoney=" + payMoney + "&merchantId=" + merchantId
				+ "&userName=" + userName + "&phone=" + phone
				+ "&email=" + email + "&addr=" + addr + "&postzip=" + postzip;

		$.ajax( {
			type : "post",
			url : url,
			dataType : "text",
			data : dataStr,
			timeout : 30000, //30s
			error : function(result) {
				setQrCodeErrorPage(payType, qrcode, scan2d, width, height);
				return;
			},
			
			success : function(result) { //请求成功时的返回函数
				var data = eval("(" + result + ")");
				var code = data.qrcode;
				if (code != "") {
					$("#payFailDiv"+payType).css("display","none");
					$("#"+qrcode).css("display","block");
					$("#"+qrcode).html("");
					var oQRCode = new QRCode(qrcode, {
						width : width,
						height : height
					});
					oQRCode.clear();
					oQRCode.makeCode(code);
					$("#scan2d" + payType).val(code);
					
					setTimeout(function(){intime = setInterval("checkSuccess('PaymentCom')", 60000);}, 300000);
					openWebsocket();
				} else {
					var errorcode = data.errorcode;
					var errordesc = data.errordesc;
					if(errordesc == ""){
						setQrCodeErrorPage(payType, qrcode, scan2d, width, height);
						return;
					}
					ErrorPicDisplay(qrcode,payType,errorcode,errordesc);
					
				}
			}

		});
	}

	function setLoading(payType,qrcode, width, height) {
		var picUrl = path_remote + '/wap/images/wxloading.gif';
		var html = '';
		html = '<img id="qrcodeErrorPic' + payType + '"  src="' + picUrl
				+ '" data-businesstype="'+ payType +'"  style="width: '
				+ width + 'px; height:' + height + 'px"/>';
		$("#" + qrcode).children().remove();

		$("#" + qrcode).append(html);
	}
	function setQrCodeErrorPage(payType, qrcode, scan2d, width, height) {
		var picUrl = path_remote + '/wap/images/qrcodeError.jpg';
		var html = '';
		html = '<img id="qrcodeErrorPic' + payType + '"  src="' + picUrl
				+ '" data-businesstype="'+ payType +'"  style="width: '
				+ width + 'px; height:' + height + 'px"/>';
		$("#" + qrcode).children().remove();

		$("#" + qrcode).append(html);
		
		$("#qrcodeErrorPic"+payType).on("click", function() {
	  		var businessType = $(this).data("businesstype");
			qrcodeErrorPicClick(businessType);
		});

	}

/*************绑定银行卡 信用卡借记卡内容增减*************/
    // $(".date_hide_btn").click(function() {
    //   $(".date_hide").hide();     
    // })
    // $(".date_show_btn").click(function() {
    //   $(".date_hide").show();     
    // })

/**************选择银行卡 加选中项**************/
  $(".quick_tab span").click(function() {
    var $quick_index =$(".quick span").index(this);
    $(this).addClass('cav2').siblings().removeClass("cav2");
    if($(".quick span").length>=3){
	    $("#quick ul").eq($quick_index).show().siblings().hide();
    }
    
  	// 若显示借记卡tab页，则借记卡第一个银行选中；若显示信用卡tab页，则信用卡第一个银行选中
   	var $bkImg = {};
   	if($quick_index == '0'){
   		$bkImg = $("#bank_whole_express img:first");
   	}
   	if($quick_index == '1'){
   		$bkImg = $("#bank_whole2_express img:first");
   	}
   	loadSelectBankData($bkImg);
  })

  /**************B2C支付 选择银行卡 加选中项**************/
  $(".b2c_bank_list ul li").click(function(){
       $(this).addClass('border_35c2951_1').siblings().removeClass('border_35c2951_1');       
       $(this).parent().siblings().find("li").removeClass('border_35c2951_1');
  })
  
/**************展开更多银行不取消已选择银行**************/
  $(".upp").click(function(){
    $(this).parent().removeClass('border_35c2951_1');
    return false;
  })

/**************银行卡 选择银行卡 加选中项**************/
  $(".b2c_quick ul li").click(function(){
	   if($(this).hasClass("border_35c295")){
		   return;
	   }
       $(this).toggleClass('border_35c295').siblings().removeClass('border_35c295');
       $(this).parent().siblings().find("li").removeClass('border_35c295');
       if($(".border_35c295").length>0){        
         $("#button").addClass('active');
         $("#button").click(function(){
         var $agreement_height = "-"+($agreement.height()/2+"px");
         $agreement.css("margin-top",$agreement_height);
         $(".new_card_bg,.agreement").show();
        })
       }else{
         $("#button").removeClass('active');
         $("#button").click(function(){
         var $agreement_height = "-"+($agreement.height()/2+"px");
         $agreement.css("margin-top",$agreement_height);
         $(".new_card_bg,.agreement").hide();
        })
       }
  
  })
/***************立即付款弹窗****************/
        if($(".border_35c295").length>0){        
         $("#button").addClass('active');
         $("#button").click(function(){
         var $agreement_height = "-"+($agreement.height()/2+"px");
         $agreement.css("margin-top",$agreement_height);
         $(".new_card_bg,.agreement").show();
        })
       }else{
         $("#button").removeClass('active');
         $("#button").click(function(){
         var $agreement_height = "-"+($agreement.height()/2+"px");
         $agreement.css("margin-top",$agreement_height);
         $(".new_card_bg,.agreement").hide();
        })
       }

  $(".upp").click(function() {
    $(this).parent().removeClass("banks_upp").hide().parent().find(".banks:gt(4)").slideToggle();
  })


	/*****订单详情収展******/
	top();
	function top(){
	  var body_width=$(window).width();
	  var top_box=$("#top_box");
	  // var main_top=$("#top_box").height();
	  // $("#main").css({"margin-top":main_top});
	  if(body_width<1080){
	     $(top_box).css({"margin-left":"0","left":"0"});
	 
	  }else{   
	     $(top_box).css({"margin-left":"-540px","left":"50%"});   
	  } 
	}

	$("#up").click(function () {
    if ($(this).attr("class") == "out") {
      $(".order_list li:gt(1)").slideUp();
      $(this).removeClass().addClass("up").text("展开");
    } else {
      $(".order_list li:gt(1)").slideDown();
      $(this).removeClass().addClass("out").text("收起");
      // setTimeout(function () {
      //   var header = $("#top").height() + "px";
      //   $("#main").css({
      //     "margin-top": header
      //   });
      // }, 400);

    }
    // setTimeout(function () {
    //   var header = $("#top").height() + "px";
    //   $("#main").css({
    //     "margin-top": header
    //   });
    // }, 400);
	  })
	
/***************立即付款弹窗****************/
var intime;
$("#button").click(function(){
   var payChannelId = $("#payChannelId").val(); 	
   if(payChannelId != "") {
	   var $agreement_height = "-"+($agreement.height()/2+"px");
	   $agreement.css("margin-top",$agreement_height);
	   $(".new_card_bg,.agreement").show();
	}
})

/******点击空白处 遮罩弹窗消失******/
  $(".new_card_bg1").click(function(){
       $(this).hide();
       $("#date_month,#date_years").slideUp(); 
    return false;
  }) 

/******协议查看******/
var $agreement=$(".agreement");
var $agreement1=$(".agreement1");
var $agreement2=$(".agreement2");
var $agreement3=$(".agreement3");
var $agreement_top_x=$(".agreement_top span");
var $agreement_top2_x=$(".agreement_top2 span");
var $agreement_top3_x=$(".agreement_top3 span");
var $agreement_submit=$(".agreement_submit button");
var $agreement_btn=$("#agreement_btn");
var $agreement_btn1=$("#agreement_btn1");
 $agreement_btn.click(function(){ 
       var $agreement1_height = "-"+($agreement1.height()/2+"px");
       $agreement1.css("margin-top",$agreement1_height);
 		var $body_height=$(document).height();    
      $agreement1.show();
      $new_card_bg.show();
      $new_card_bg.height($body_height);
    })
    
$agreement_btn1.click(function(){ 	
   var $agreement1_height = "-"+($agreement1.height()/2+"px");
   $agreement1.css("margin-top",$agreement1_height);
       var $body_height=$(document).height();    
      $agreement1.show();
      $new_card_bg.show();
      $new_card_bg.height($body_height);
    })

  $agreement_submit.click(function(){         
          $agreement.hide();
           $agreement1.hide();
          $new_card_bg.hide();           
    })
  $agreement_top_x.click(function(){  
          $agreement1.hide();       
          $agreement.hide();
          $new_card_bg.hide();           
    })
   $agreement_top2_x.click(function(){  
          $agreement1.hide();       
          $agreement.hide();
          $agreement2.hide();
          $new_card_bg.hide();           
    })
    $agreement_top3_x.click(function(){  
          $agreement1.hide();       
          $agreement.hide();
          $agreement3.hide();
          $new_card_bg.hide();           
    })
    


/******日期下拉******/

 $("#years").click(function(){  
    $("#date_month").slideUp(); 
    $("#date_years").css("z-index","1111111") ;   
      $("#date_years").slideToggle();
      $(".new_card_bg1").show();
      $("#date_years p").click(function(){
           $("#years").val($(this).text());
           $("#date_years").slideUp();
            $(".new_card_bg1").hide();
       })
   })

   $("#month").click(function(){  
    $("#date_years").slideUp(); 
      $("#date_month").css("z-index","1111111");    
      $("#date_month").slideToggle();
      $(".new_card_bg1").show();
      $("#date_month p").click(function(){
           $("#month").val($(this).text());
           $("#date_month").slideUp();
             $(".new_card_bg1").hide();
       })
   })
 
var $agreement3=$(".agreement3");
$(".js-button").click( function() {
			$(".js-error").html("");
			if (checkVerifyAddr(".js-tel") && checkVerifyCode(".js-code")) {
				var mobile = $(".js-tel").val();
				mobile= $.trim(mobile);
				var mobileVerifyCode = $(".js-code").val();
				mobileVerifyCode = $.trim(mobileVerifyCode);
				$("#mobile_formb2c").val(mobile);
				$("#mobileVerifyCodeb2c").val(mobileVerifyCode);
				appendReceiveChannelData($("#bank_payb2c"));
				$("#bank_payb2c").submit();
				$('#mobile_formb2c').val('');
				$('#mobileVerifyCodeb2c').val('');
				$(".bg_b2c").hide();
				$("#js-popwintwo").hide();
				showtcc();
			}
		});
$("#bank_submitwap , #bank_submitalipayWap").click( function(){
	var id = $(this).attr("id");
	if("bank_submitwap"==id){
		var chkObjs = $("#payChannelIdwap").val(); 
	}else if("bank_submitalipayWap"==id){
		var chkObjs = $("#payChannelIdalipayWap").val();
	}
	
	if(chkObjs == ''){
		return; 
	}
    setTimeout(function(){intime = setInterval("checkSuccess('PaymentCom')", 60000);}, 300000);
    //如果是收款通道，不开启推送
    var isReceivablePaymentInput=$("#isReceivablePaymentInput").val();
    if('yes'==isReceivablePaymentInput){
    	return;
    }
 	openWebsocket();
    var $agreement_height = "-"+($agreement3.height()/2+"px");
    $agreement3.css("margin-top",$agreement_height);
    $(".new_card_bg,.agreement3").show();
 });

 
 function showtcc(){
	 setTimeout(function(){intime = setInterval("checkSuccess('PaymentCom')", 60000);}, 300000);
	 //如果是收款通道，不开启推送
	 var isReceivablePaymentInput=$("#isReceivablePaymentInput").val();
	 if('yes'==isReceivablePaymentInput){
		 return;
	 }
	 openWebsocket();
	 var $agreement_height = "-"+($agreement3.height()/2+"px");
	 $agreement3.css("margin-top",$agreement_height);
	 $(".new_card_bg,.agreement3").show();
 }
  
 function openWebsocket(){
	var url=$("#pushUrl").val();
	if(!url){
		return;
	}
	var ws;
	try{
		ws = new WebSocket(url);
	}catch(e){
		console.log(e);
		return;
	}
	ws.onopen = function() {
		console.log('connect pushGateway success.')
	}
	ws.onmessage = function(e) {
		var data = eval("("+e.data+")");
		if(data.result == "0") {
			checkSuccess('PaymentCom');
		}
	}
	ws.onclose = function(e) {
		if(e.code==1000){//正常关闭（超时、业务已完成）
			//do nothing
			console.log('connect close',e.code+":"+e.reason)
		}else if(e.code==1003){//服务器拒绝连接
			console.log('connect close',e.code+":"+e.reason)
			//do nothing
		}else{//重新连接
			setTimeout("openWebsocket()", 10000);
		}
	}
}
 
 
  
 $(document).click(function(e){
  if($(e.target).is("#date_years,#years")){
   return false;
  }
  $("#date_years").slideUp();
 })

 $(document).click(function(e){
  if($(e.target).is("#date_month,#month")){
   return false;
  }
  $("#date_month").slideUp();
 })

	
	$(window).resize(function() {
	  top(); 
	});

 $(window).scroll(function(){
	  var body_width=$(window).width();
	  var top_box=$("#top_box");
	  // var main_top=$("#top_box").height();
	  // $("#main").css({"margin-top":main_top});
	  if(body_width<1080){
	   $("#top_box").css({"position":"fixed","margin":"0 auto","left":"0"});
	  }else{
	    $(top_box).css({"margin-left":"-540px","left":"50%","position":"fixed"});   
	  }
 });
 
/*****************************************快捷支付新增*********************************/
/**************快捷支付选择银行卡 加选中项**************/
	function $$(id){
		return document.getElementById(id);
	}
	var $submitErrP = $(".submitErrP");
	/**点击银行图片**/
	$(".show_bank_img").click(function(){
		$this = $(this);
		loadSelectBankData($this);
	});
	
/**
 * 快捷支付选择银行卡加载数据（备注：点击银行图片）
 * @param {Object} bankImg
 */
//function loadSelectBankData(bankImg){
//	$this = bankImg;
//	$thisBankLi = $this.parent().parent();
// 	$thisBankLi.toggleClass('border_35c2951_1').siblings().removeClass('border_35c2951_1');
//    $thisBankLi.parent().siblings().find("li").removeClass('border_35c2951_1');
//   	if($(".border_35c2951_1").length>0){
//    	$("#nextStep").addClass('active');
//  	}else{
//    	$("#nextStep").removeClass('active');
//  	}
//	var $cardTab = $('#'+$this.data("cardtabid"));
//	$(".cardtab").removeData("bankcode");
//	$(".cardtab").removeData("paychannelid");
//	$(".cardtab").removeData("channelcode");
//	if($thisBankLi.hasClass("border_35c2951_1")) {
//		$cardTab.data("selected",true);
//		$cardTab.data("bankcode",$this.data("bankcode"));
//		$cardTab.data("paychannelid",$this.data("paychannelid"));
//		$cardTab.data("channelcode",$this.data("channelcode"));
//	}
//}
	
/**
 * 校验是易宝借记卡
 * @param {Object} channelCode
 * @return {TypeName} 
 */
function isYeeExpressPay(channelCode){
	if ("YEEPAY_EXPRESS" == channelCode) {
		return true;
	}
	return false;
}
	
	/******绑新银行卡 tab******/
	$(function(){
	  var $new_card = $("#new_card_btn span");
	     $new_card.click(function(){
	          $(this).addClass("cav3").siblings().removeClass("cav3");
	          var div_index = $new_card.index(this);
	          var new_card_main = $("#new_card_main >ul");
	          new_card_main.eq(div_index).show().siblings().hide();
	          var newBankImg = {};
	          new_card_main.each(function(){
			    if($(this).css("display")=="block"){             
			    	 newBankImg = $(this).find("img:first");         
			    }
			  });
			  loadSelectNewBankData(newBankImg);
	     })
	  });
	
	  var $credit=$("#credit");  
	  var $new_card_bg=$(".new_card_bg");
	  var $new_card_top=$(".new_card_top span");
	  var $new_card_submit=$(".new_card_submit button");
	  var $new_card_submit1=$("#new_card_submit1 button");
	  var $new_card=$("#new");  
	  var $new_card_up=$(".new_card_up1");
	  var $back_select_bank=$(".back_select_bank");
	  
	  $($new_card_up).click(function(){ 
	      $submitErrP.html("");
	      var $body_height=$(document).height();    
	      $new_card.show();
	      $new_card_bg.show();
	      $new_card_bg.height($body_height);
	      var cardType = getChannelInfo().cardType;
	      if('1'==cardType) {
	      	$("#newCardCredit").click();
	      }else{
	      	$("#newCarddebit").click();
	      }
	    })
     $($back_select_bank).click(function(){ 
    	 $("#mobile").val('');
		 $("#bankNum").val('');
		 $(".smsCode").val('');
      	 $new_card.addClass("hidden_div");
	     $new_card_bg.addClass("hidden_div");
	     $("#exp_first_div").removeClass("hidden_div");
	     $(".already_quick").show();
		 $("#exp_third_div").addClass("hidden_div");
		 $("#exp_second_div").addClass("hidden_div");
		 $(".cardtab").each(function(){
			 if($(this).data("selected")) {
			 	$(this).data("selected",false);
			 }
		 });
		 var $this = $(".border_35c2951_1  a img");
		 var $cardTab = $('#'+$this.data("cardtabid"));
		 $(".cardtab").removeData("bankcode");
		 $(".cardtab").removeData("paychannelid");
		 $(".cardtab").removeData("channelcode");
		 $cardTab.data("selected",true);
		 $cardTab.data("bankcode",$this.data("bankcode"));
		 $cardTab.data("paychannelid",$this.data("paychannelid"));
		 $cardTab.data("channelcode",$this.data("channelcode"));
		 
		 var $new_card_submit1=$("#new_card_submit1 button");
		 var newCardMainLi= $("#new_card_main ul").find("li");
         newCardMainLi.removeClass('cav4');
      	 $new_card_submit1.removeClass("on").css("background","#666");
    })
	  $new_card_submit1.click(function(){
		  var $selectedNewTab;
		  $(".new_cardtab").each(function(){
			  if($(this).data("temp_selected")) {
				  $selectedNewTab = $(this);
			  }
		  });
		  if($.isEmptyObject($selectedNewTab)) {
			  return;
		  }
		  $(".cardtab").not($selectedNewTab).data("selected",false);
		  $selectedNewTab.data("selected",true);
		  var bankCode = getChannelInfo().bankCode;
		  if($.isEmptyObject(bankCode)) {
			  return;
		  }
		 $("#bankNum").val('');
		 $("#cardCVV2").val('');
		 $(".smsCode").val('');
		 $(".cardCVV2").val('');
		var channelCode = getChannelInfo().channelCode;
		if(channelCode != undefined && channelCode =="EXPRESS_CMBC_C"){
			$("#areaCodeLi").css("display", "block");
		}else{
			$("#areaCodeLi").css("display", "none");
		}
		if(getChannelInfo().cardType=="1") { //信用卡
			if(channelCode=='UPOP_ORG_EXPRESS'){
				$(".union_only").css("display", "none");
			}else {
				$(".union_only").css("display", "block");
			}
		}else { //借记卡
			if(channelCode=='UPOP_ORG_EXPRESS'){
				$(".union_only").css("display", "none");
			}else {
				$(".union_only").css("display", "block");
				$(".date_hide").hide();
			}
		}
		if($new_card_submit1.attr("class")=="on"){      
		  $(this).css("background","#666")
		  $new_card.hide();
		  $new_card_bg.hide(); 
		  //$(".already_quick").hide(); 
		  $("#exp_second_div").hide();
		  $("#exp_third_div").show();
		}else{     
		      var $submit=$(".cav4 p").html();
		      $credit_html=$credit.html($submit);
		      $new_card.hide();
		      $new_card_bg.hide();
		     //$(".already_quick").hide();
		      $("#exp_second_div").hide();
		      $("#exp_third_div").show();
		}
		$("#bindId").val("");
		$("#signId").val("");
		//$("#exp_third_div").removeClass("hidden_div");
		//$("#exp_second_div").addClass("hidden_div");
		
		var bankCode = getChannelInfo().bankCode;
		//用来判断是否是交通银行信用卡
		var reValidate=document.getElementById("re_validate");
		var channelData=getChannelInfo();
		var cardType=channelData.cardType;
		var channelCode=channelData.channelCode;
		var dumpSubmitButton=document.getElementById("dump_submit_button");
		reValidate.value="true";
		//此处代表交行首次签约，此处的cardType代表是选择信用卡处
		if("BCOM_CREDIT_EXPRESS"==channelCode&&1==cardType){
			$credit_html=$credit.html("<img id=\"new_bank_img\" src=\"\"/>");
			$("#new_bank_img").attr("src",path_remote+"/wap/images/"+bankCode+".jpg");
			$("#signId").val("");
			$("#bindId").val("");
			$("#exp_first_div").addClass("hidden_div");
			$("#exp_third_div").removeClass("hidden_div");
			dumpSubmitButton.innerText="下一步";
		}else{
			dumpSubmitButton.innerText="确定";
		}

	})
 


   $new_card_submit.click(function(){
          var $submit=$(".cav4 p").html();
          $credit_html=$credit.html($submit);
          $new_card.hide();
          $new_card_bg.hide();           
    })

  $new_card_top.click(function(){         
          $new_card.hide();
          $new_card_bg.hide();           
    })
    
	/**绑定新卡点击银行图片**/
	$(".show_bank_img_new").click(function(){
		$this = $(this);
		loadSelectNewBankData($this);
	});
	
	/**
	 * 快捷支付绑定新卡选择银行卡加载数据（备注：点击银行图片）
	 * @param {Object} newBankImg
	 */
	function loadSelectNewBankData(newBankImg){
		$this = newBankImg;
		var $new_card_submit1=$("#new_card_submit1 button");
		$thisBankLi = $this.parent().parent();
		$thisBankLi.toggleClass('cav4').siblings().removeClass("cav4"); 
        $thisBankLi.parent().siblings().find("li").removeClass('cav4');
      	if($(".cav4").length>0) {
        	$new_card_submit1.addClass("yes").css("background","#66aef6"); 
      	}else{
         	$new_card_submit1.removeClass("on").css("background","#666"); 
      	}     
		
		var $cardTab = $('#'+$this.data("cardtabid"));
		$(".new_cardtab").data("temp_selected",false);
		$(".new_cardtab").removeData("bankcode");
		$(".new_cardtab").removeData("paychannelid");
		$(".new_cardtab").removeData("channelcode");
		if($thisBankLi.hasClass("cav4")) {
			$cardTab.data("temp_selected",true);
			$cardTab.data("bankcode",$this.data("bankcode"));
			$cardTab.data("paychannelid",$this.data("paychannelid"));
			$cardTab.data("channelcode",$this.data("channelcode"));
		}
	}  
	
	/**第一个页面切换借记卡信用卡切换**/
	$("#exp_first_div .quick_tab span").click(function(){
		$(".cardtab").data("selected",false);
		$(this).data("selected",true);
		if($(this).data("cardtype") == "1") {
			$(".date_hide").show();
		}else{
			$(".date_hide").hide();
		}
	});
	
	function getChannelInfo(){
		var bankCode;
		var paychannelid;
		var cardType;
		var channelCode;
		$(".cardtab").each(function(){
			if($(this).data("selected")) {
				bankCode = $(this).data("bankcode");
				paychannelid = $(this).data("paychannelid");
				cardType = $(this).data("cardtype");
				channelCode = $(this).data("channelcode");
			}
		});
		var data = new Object;
		data.bankCode = bankCode;
		data.paychannelid = paychannelid;
		data.cardType = cardType;
		data.channelCode = channelCode;
		return data;
	}
	
	/**快捷支付点击下一步**/
	$("#nextStep").click(function(){
		//如果是收款通道,判断金额字段是否有值，若没有值则赋值
		var isReceivablePaymentInput=$("#isReceivablePaymentInput").val();
		var amount = $('#amount').val();
		if('yes'==isReceivablePaymentInput && (amount =='null' || amount=='')){
			$('#amount').val($('#payMoney').val());
		}
		
		//如果是收款通道，验证用户填入数据
		if('yes'==isReceivablePaymentInput && !validate()){
			return false;
		}
		var url = path+"/CheckExpressSign";
		var channelInfo = getChannelInfo();
		if($.isEmptyObject(channelInfo.bankCode)){
			$("#chPhoneNumber").css("display","inline-block");
			$("#chPhoneNumber").html("请选择银行！");
			setTimeout($$("chPhoneNumber").focus, 50);
			return;
		}
		var phoneValue= $$("mobile").value.replace(/(^\s*)|(\s*$)/g,"");
		if(0==phoneValue.length){
			$("#chPhoneNumber").css("display","inline-block");
			$("#chPhoneNumber").html("请输入此卡在银行预留的手机号！");
			setTimeout($$("mobile").focus, 50);
			return;
		} else {
			$("#mobile").val(phoneValue.replace(/(^\s*)|(\s*$)/g,""));
		}
		if(!/^((13)|(14)|(15)|(17)|(18))\d{9}$/.test(phoneValue)){
			$("#chPhoneNumber").css("display","inline-block");
			$("#chPhoneNumber").html("手机号码有误，请确认手机号码！");
			setTimeout($$("mobile").focus, 50);
			return;
		} else {
			$("#chPhoneNumber").css("display","none");
		} 
		
		var mobile = $$("mobile").value;
		var providerType = $$("providerType").value;
		var cardType = channelInfo.cardType;
		var bankCode = channelInfo.bankCode;
		var orderKey = $$("orderKey").value;
		var token = $$("token").value;
		var channelCode = channelInfo.channelCode;
		if(getChannelInfo().cardType=="1") { //信用卡
			if(channelCode=='UPOP_ORG_EXPRESS'){
				$(".union_only").css("display", "none");
			}else {
				$(".union_only").css("display", "block");
			}
		}else { //借记卡
			if(channelCode=='UPOP_ORG_EXPRESS'){
				$(".union_only").css("display", "none");
			}else {
				$(".union_only").css("display", "block");
				$(".date_hide").hide();
			}
		}
		var isReceivablePayment=$("#isReceivablePaymentInput").val();
		$submitErrP.html("");
		var dataStr = "mobile="+mobile+
		"&providerType="+providerType+"&cardType="+cardType+
		"&bankCode="+bankCode+"&orderKey="+orderKey +"&channelCode=" + channelCode + "&token=" + token+"&random="+Math.random()+"&areaCode="+$('#areaCode').val()+"&isReceivableExpress="+isReceivablePayment;
		if (isYeeExpressPay(channelCode)) {
			$.ajax({
		        type: "post",
		        url: url,
		        dataType:"text",
		        data: dataStr,
		        success: yeePayBackFunc
		    });
		} else if("UPOP_ORG_EXPRESS" == channelCode){
			$.ajax({
		        type: "post",
		        url: url,
		        dataType:"text",
		        data: dataStr,
		        success: unionpayBackFunc
		    });
		}else {
			$.ajax({
		        type: "post",
		        url: url,
		        dataType:"text",
		        data: dataStr,
		        success: chinaPayBackFunc
		    });
		}
	});
	
	/**中移检查银行卡是否绑定结果处理**/
	function chinaPayBackFunc(dataObj){
		var data=dataObj.replace(/(^\s*)|(\s*$)/g, "");
		if(data=='security'){
			alert('订单时效已过期或非法请求，请在商户网站重新提交订单.');
			return;
		}else if(data=='moretimes'){
			alert('查询签约信息过于频繁,请稍后再试.');
			return;
		}else if(data=='expired'){
			alert('订单时效已过期，请在商户网站重新提交订单.');
			return;
		}
		data = eval("("+data+")");
		//将安全信息保存到页面
		var modulus = data.modulus;
		var exponent = data.exponent;
		var token = data.token;
		var checkInfo = data.checkInfo;
		$("#modulus").val(modulus);
		$("#exponent").val(exponent);
		$("#token").val(token);
		$("#checkInfo").val(checkInfo);
		var cardList = data.resultData;
		if("" == cardList){
			alert("系统繁忙,请稍后再试!");
			return;
		}
		data = cardList;
		var curChlCode = getChannelInfo().channelCode;
			if(curChlCode != undefined && curChlCode=="EXPRESS_CMBC_C"){
					$("#areaCodeLi").css("display", "block");
				}
		var bankCode = getChannelInfo().bankCode;
		//用来判断是否是交通银行这种需要二次验证的信用卡
		var reValidate=document.getElementById("re_validate");
		var channelData=getChannelInfo();
		var cardType=channelData.cardType;
		var channelCode=channelData.channelCode;
		var dumpSubmitButton=document.getElementById("dump_submit_button");
		reValidate.value="true";
		//此处代表交行首次签约
		if("BCOM_CREDIT_EXPRESS"==channelCode&&1==cardType&&"newBank"==data){
			$credit_html=$credit.html("<img id=\"new_bank_img\" src=\"\"/>");
			$("#new_bank_img").attr("src",path_remote+"/wap/images/"+bankCode+".jpg");
			$("#signId").val("");
			$("#bindId").val("");
			$("#exp_first_div").addClass("hidden_div");
			$("#exp_third_div").removeClass("hidden_div");
			dumpSubmitButton.innerText="下一步";
		}else{
			dumpSubmitButton.innerText="确定";
		}
		//代表已经签约
		if(data.signStatus && data.signStatus == "0"){
			reValidate.value="false";
		}else if(data[0] && data[0].signStatus &&  data[0].signStatus == "0"){
			reValidate.value="false";
		}
		if("systemError"==data){
			alert("系统繁忙,请稍后再试!");
			return;
		}
		
		var findBandCard = false;
		$("#binding").html("");
		for(var i=0;i<data.length;i++) {
			if(data[i].bankNum == undefined || data[i].bankCode == undefined || data[i].signId == undefined ) {
				continue;
			}
			if(data[i].bankCode != bankCode) {
				continue;
			}
			$(".ew_card_up").css("display","block");
			var bankNum = "**" +data[i].bankNum.substr(data[i].bankNum.length-4,data[i].bankNum.length);
			var $bandLi = $("<li class=\"banks\"><a href=\"javascript:;\"><img alt=\""+data[i].bankCode+"\" data-signId=\""+data[i].signId+"\" data-banknum=\""+data[i].bankNum+"\" data-bankcode=\""+data[i].bankCode+"\" src=\""+path_remote+"/wap/images/"+ data[i].bankCode +".jpg\"/></a><span>"+bankNum+"</span></li>");
			$("#binding").append($bandLi);
			if(i==0) {
				$bandLi.click();
			}
			findBandCard = true;
		}
		if(findBandCard) {//1111
			//找到选择银行绑定的卡，则显示该卡
			$("#exp_first_div").addClass("hidden_div");
			$("#exp_second_div").removeClass("hidden_div");
		}else{
			//未找到选择银行绑定的卡，则跳转至绑定新银行页面
			$("#signId").val("");
			$("#bindId").val("");
			$credit_html=$credit.html("<img id=\"new_bank_img\" src=\"\"/>");
			$("#new_bank_img").attr("src",path_remote+"/wap/images/"+bankCode+".jpg");
			$("#exp_first_div").addClass("hidden_div");
			$("#exp_third_div").removeClass("hidden_div");
			return;
		}
	}
	/**易宝检查银行卡是否绑定结果处理**/
	function unionpayBackFunc(dataObj){
		var data=dataObj.replace(/(^\s*)|(\s*$)/g, "");
		if(data=='security'){
			alert('订单时效已过期或非法请求，请在商户网站重新提交订单.');
			return;
		}else if(data=='moretimes'){
			alert('查询签约信息过于频繁,请稍后再试.');
			return;
		}else if(data=='expired'){
			alert('订单时效已过期，请在商户网站重新提交订单.');
			return;
		}
		data = eval("("+data+")");
		
		//将安全信息保存到页面
		var modulus = data.modulus;
		var exponent = data.exponent;
		var token = data.token;
		var checkInfo = data.checkInfo;
		$("#modulus").val(modulus);
		$("#exponent").val(exponent);
		$("#token").val(token);
		$("#checkInfo").val(checkInfo);
		
		var retCode = data.retCode;
		var cardList = data.resultData;
		if("0"==retCode || "" == cardList){
			alert("系统繁忙请稍后再试!");
			return;
		}
		$(".union_only").css("display", "none");
		
		var bankCode = getChannelInfo().bankCode;
		var cardType = getChannelInfo().cardType;
		if("newBank"==cardList){
			//跳转至绑定新银行页面
			$("#signId").val("");
			$("#bindId").val("");
			$("#new_bank_img").attr("src",path_remote+"/wap/images/"+bankCode+".jpg");
			$("#exp_first_div").addClass("hidden_div");
			$("#exp_third_div").removeClass("hidden_div");
			return;
		}
		data = cardList;
		var findBandCard = false;
		$("#binding").html("");
		var bandTimes = 0;
		for(var i=0;i<data.length;i++) {
			if(data[i].bankNum == undefined || data[i].bankCode == undefined) {
				continue;
			}
			if(data[i].bankCode != bankCode) {
				continue;
			}
			var bankNum = "**" +data[i].bankNum.substr(data[i].bankNum.length-4,data[i].bankNum.length);
			var $bandLi = $("<li class=\"banks\"><a href=\"javascript:;\"><img alt=\""+data[i].bankCode+"\" data-signId=\""+data[i].signId+"\" data-banknum=\""+data[i].bankNum+"\" data-bankcode=\""+data[i].bankCode+"\" src=\""+path_remote+"/wap/images/"+ data[i].bankCode +".jpg\"/></a><span style='padding-left: 20px;'>"+bankNum+"</span></li>");
			$("#binding").append($bandLi);
			if(bandTimes==0) {
				$bandLi.click();
			}
			findBandCard = true;
			bandTimes++;
		}
		if(findBandCard) {
			//找到选择银行绑定的卡，则显示该卡
			$("#exp_first_div").addClass("hidden_div");
			$("#exp_second_div").removeClass("hidden_div");
		}else{
			//未找到选择银行绑定的卡，则跳转至绑定新银行页面
			$("#signId").val("");
			$("#bindId").val("");
			$("#new_bank_img").attr("src",path_remote+"/wap/images/"+bankCode+".jpg");
			$("#exp_first_div").addClass("hidden_div");
			$("#exp_third_div").removeClass("hidden_div");
			return;
		}
	}
	
	function yeePayBackFunc(dataObj){
		var data=dataObj.replace(/(^\s*)|(\s*$)/g, "");
		if(data=='security'){
			alert('订单时效已过期或非法请求，请在商户网站重新提交订单.');
			return;
		}else if(data=='moretimes'){
			alert('查询签约信息过于频繁,请稍后再试.');
			return;
		}else if(data=='expired'){
			alert('订单时效已过期，请在商户网站重新提交订单.');
			return;
		}
		data = eval("("+data+")");
		
		//将安全信息保存到页面
		var modulus = data.modulus;
		var exponent = data.exponent;
		var token = data.token;
		var checkInfo = data.checkInfo;
		$("#modulus").val(modulus);
		$("#exponent").val(exponent);
		$("#token").val(token);
		$("#checkInfo").val(checkInfo);
		
		var retCode = data.retCode;
		var cardList = data.resultData;
		if("0"==retCode || "" == cardList){
			alert("系统繁忙,请稍后再试!");
			return;
		}
		
		var bankCode = getChannelInfo().bankCode;
		var cardType = getChannelInfo().cardType;
		if("newBank"==cardList){
			//跳转至绑定新银行页面
			$("#signId").val("");
			$("#bindId").val("");
			$credit_html=$credit.html("<img id=\"new_bank_img\" src=\"\"/>");
			$("#new_bank_img").attr("src",path_remote+"/wap/images/"+bankCode+".jpg");
			$("#exp_first_div").addClass("hidden_div");
			$("#exp_third_div").removeClass("hidden_div");
			return;
		}
		data = cardList;
		var findBandCard = false;
		$("#binding").html("");
		var bandTimes = 0;
		for(var i=0;i<data.length;i++) {
			if(data[i].bankNum == undefined || data[i].bankCode == undefined || data[i].argNo == undefined ) {
				continue;
			}
			if(data[i].bankCode != bankCode || data[i].cardType != cardType) {
				continue;
			}
			$(".ew_card_up").css("display","block");
			var bankNum = "**" +data[i].bankNum.substr(data[i].bankNum.length-4,data[i].bankNum.length);
			var $bandLi = $("<li class=\"banks\"><a href=\"javascript:;\"><img alt='"+data[i].bankCode+"' data-banknum=\""+data[i].bankNum+"\" data-bankcode=\""+data[i].bankCode+"\" data-argno=\""+data[i].argNo +"\" src=\""+path_remote+"/wap/images/"+ data[i].bankCode +".jpg\"/></a><span>"+bankNum+"</span></li>");
			$("#binding").append($bandLi);
			if(bandTimes==0) {
				$bandLi.click();
			}
			findBandCard = true;
			bandTimes++;
		}
		if(findBandCard) {
			//找到选择银行绑定的卡，则显示该卡
			$("#exp_first_div").addClass("hidden_div");
			$("#exp_second_div").removeClass("hidden_div");
		}else{
			//未找到选择银行绑定的卡，则跳转至绑定新银行页面
			$("#signId").val("");
			$("#bindId").val("");
			$credit_html=$credit.html("<img id=\"new_bank_img\" src=\"\"/>");
			$("#new_bank_img").attr("src",path_remote+"/wap/images/"+bankCode+".jpg");
			$("#exp_first_div").addClass("hidden_div");
			$("#exp_third_div").removeClass("hidden_div");
			return;
		}
	}

/***************已绑定的卡 选中****************/
  
  $("#binding").on("click","li",function(){
    $(this).addClass('cav6 cav_data').siblings().removeClass("cav6 cav_data");
    $("#bindId").val($(this).children("a").children("img").data("argno"));
    $("#signId").val($(this).children("a").children("img").data("signid"));
  })
var allowCounted = false;
$(".getsmscode_a").click(function(){
	//如果是收款通道，验证用户填入数据
	var isReceivablePaymentInput=$("#isReceivablePaymentInput").val();
	if('yes'==isReceivablePaymentInput){
		if(!validate()){
			return false;
		}
		if(null==$("#amount").val()||undefined==$("#amount").val()){
		    $("#amount").val( $("#payMoney").val());
		}
	}
	//全局变量是否允许获取短信
	if(!allowGetSms) {
		return;
	}
	allowGetSms = false;
	var $this = $(this);
	var newcardflag = $this.data("newcardflag");
	var gateWayId = $("#providerType").val();
	if(isYeeExpressPay(getChannelInfo().channelCode)) {
		//易宝
		yeePay(newcardflag);
	}else if(getChannelInfo().channelCode == 'UPOP_ORG_EXPRESS'){
		getUnionPaySmsCode();
	}else if(getChannelInfo().channelCode == 'CEBB_EXPRESS'||
			getChannelInfo().channelCode == 'ECITIC_EXPRESS'
				|| getChannelInfo().channelCode == 'SPDB_EXPRESS' ){
		getNormalSmsCode();
	}else if(getChannelInfo().channelCode == 'CMBC_EXPRESS') {
		getCMBCSmsCode();
	} else {
		//发送短信
		getNormalSmsCode();
	}
	if(!allowCounted) {
		allowGetSms = true;
	}
	
});
function getCMBCSmsCode() {
	var dataStr = "";
	var url = path+"/GetSmsCode";
	$(".outer_div").not(".hidden_div").find(".smsCode").val("");
	var signId=$("#signId").val();
	var mobileNumber = $("#mobile").val();
	
	if(mobileNumber == "") {
		$submitErrP.html("获取预留手机号失败！请刷新后重试!");
		return;
	}
	if(signId ==""){ //如果是新绑定的卡 则按卡类型区分 参数的校验
		if(!checkParam("getSMS")){
			return;
		}
	} 
	
	//TODO
	var realName =$("#realName").val();
	var idNo =$("#idNo").val();
	var bankNum =$("#bankNum").val();
	var cardCVV2 = $("#cardCVV2").val();
	var cardExpDate = getCardExpDate();
	var payChannelId = getChannelInfo().paychannelid;
	var channelCode = getChannelInfo().channelCode;
	if(payChannelId ==""){
		$submitErrP.html("绑定新卡失败,请重新选择要开通快捷支付的银行卡");
		return;
	}
	payChannelId=payChannelId.substr(payChannelId.lastIndexOf("|")+1);
	var bankCode =getChannelInfo().bankCode;
	var cardType =getChannelInfo().cardType;
	var amount = $("#amount").val();
	var checkInfo = $("#checkInfo").val();
	var orderKey = $("#orderKey").val();
	var token = $("#token").val();
	var isReceivableExpress = $("#isReceivablePaymentInput").val();
	
	dataStr = "checkInfo="+checkInfo+"&signId="+signId+"&mobile="+mobileNumber+"&realName="+realName+ "&channelCode=" + channelCode + 
	"&idNo="+idNo+"&bankNum="+bankNum+"&cardCVV2="+cardCVV2+"&cardExpDate="+cardExpDate+"&token="+token+"&orderKey="+orderKey+
	"&payChannelId="+payChannelId+"&bankCode="+bankCode+"&cardType="+cardType+"&amount="+amount + "&isReceivableExpress=" + isReceivableExpress + "&payMoney=" + $("#amount").val();
	
	$.ajax({
		type: "post",
		url: url,
		dataType:"text",
		data: dataStr,
		success: function(result){
			var data = eval("("+result+")");
			$("#tradeNo").val(data.tradeNo);
			$("#bankNo").val(data.bankNo);
			
			if(data.retMsg != "" || data.retMsg != undefined){
				alert(data.retMsg);
			}
			var modulus = data.modulus;
		    var exponent = data.exponent;
		    var checkInfo = data.checkInfo;
		    var token = data.token;
			//将安全参数返回到页面
		    $("#modulus").val((modulus==undefined || modulus=='null' )?"":modulus);
		    $("#exponent").val((exponent==undefined || exponent=='null')?"":exponent);
		    $("#checkInfo").val((checkInfo==undefined || checkInfo=='null')?"":checkInfo);
		    $("#token").val((token==undefined || token=='null')?"":token);
		}
	});
	allowCounted = true;
	var i = 60;
	var intval = setInterval(function(){
		if(0 < i){
			$(".getsmscode_a").html(i + "秒后重新获取");
			i--;
			$(".getsmscode_a").attr("disabled" , true);
		}else{
			$(".getsmscode_a").attr("disabled", false);
			$(".getsmscode_a").html("免费获取");
			allowGetSms = true;
			clearInterval(intval);
		}
	},1000);
}
function getNormalSmsCode() {
	var dataStr = "";
	var url = path+"/GetSmsCode";
	$(".outer_div").not(".hidden_div").find(".smsCode").val("");
	var signId=$("#signId").val();
	var mobileNumber = $("#mobile").val();
	
	if(mobileNumber == "") {
		$submitErrP.html("获取预留手机号失败！请刷新后重试!");
		return;
	}
	if(signId ==""){ //如果是新绑定的卡 则按卡类型区分 参数的校验
		if(!checkParam("getSMS")){
			return;
		}
	} 
	var realName =$("#realName").val();
	var idNo =$("#idNo").val();
	var bankNum =$("#bankNum").val();
	var cardCVV2 = $("#cardCVV2").val();
	var cardExpDate = getCardExpDate();
	var payChannelId = getChannelInfo().paychannelid;
	var channelCode = getChannelInfo().channelCode;
	if(payChannelId ==""){
		$submitErrP.html("绑定新卡失败,请重新选择要开通快捷支付的银行卡");
		return;
	}
	payChannelId=payChannelId.substr(payChannelId.lastIndexOf("|")+1);
	var bankCode =getChannelInfo().bankCode;
	var cardType =getChannelInfo().cardType;
	var amount = $("#amount").val();
	var checkInfo = $("#checkInfo").val();
	var orderKey = $("#orderKey").val();
	var token = $("#token").val();
	var isReceivableExpress = $("#isReceivablePaymentInput").val();
	
	
	var reValidate=document.getElementById("re_validate").value
	dataStr = "checkInfo="+checkInfo+"&signId="+signId+"&mobile="+mobileNumber+"&realName="+realName+ "&channelCode=" + channelCode + 
	    "&idNo="+idNo+"&bankNum="+bankNum+"&cardCVV2="+cardCVV2+"&cardExpDate="+cardExpDate+"&token="+token+"&orderKey="+orderKey+
	    "&payChannelId="+payChannelId+"&bankCode="+bankCode+"&cardType="+cardType+"&amount="+amount + "&isReceivableExpress=" 
	    + isReceivableExpress+ "&payMoney=" + $("#amount").val();
	
	//此处代表是交行的
	if("BCOM_CREDIT_EXPRESS" == channelCode&&signId!=""&&reValidate=="false"){
	    dataStr+="&firstSmsCode=1";
	}
	
	$.ajax({
		type: "post",
		url: url,
		dataType:"text",
		data: dataStr,
		success: function(result){
			var data = eval("("+result+")");
			$("#tradeNo").val(data.tradeNo);
			if(data.retMsg != "" || data.retMsg != undefined){
				alert(data.retMsg);
			}
			var modulus = data.modulus;
		    var exponent = data.exponent;
		    var checkInfo = data.checkInfo;
		    var token = data.token;
			//将安全参数返回到页面
		    $("#modulus").val((modulus==undefined || modulus=='null' )?"":modulus);
		    $("#exponent").val((exponent==undefined || exponent=='null')?"":exponent);
		    $("#checkInfo").val((checkInfo==undefined || checkInfo=='null')?"":checkInfo);
		    $("#token").val((token==undefined || token=='null')?"":token);
		}
	});
	allowCounted = true;
	var i = 60;
	intval = setInterval(function(){
		if(0 < i){
			$(".getsmscode_a").html(i + "秒后重新获取");
			i--;
			$(".getsmscode_a").attr("disabled" , true);
		}else{
			$(".getsmscode_a").attr("disabled", false);
			$(".getsmscode_a").html("免费获取");
			allowGetSms = true;
			clearInterval(intval);
		}
	},1000);
}
/**易宝获取验证码**/
function yeePay(newcardflag) {
	var isfirstReqFlag = $("#sms-validate-first").data("firstreqflag");
	var dataStr = "";
	var url="";
	var tradeNo = "";
	if (isfirstReqFlag == '1') {
		url = path+"/Pay"
	} else if(isfirstReqFlag == '0') {
		url = path+"/GetSmsCode";
	} else {
		$submitErrP.html("订单时效已过期或非法请求, 请在商户端重新提交一笔订单！");
		return;
	}
	var mobileNumber = $("#mobile").val();
	
	if(mobileNumber == "") {
		$submitErrP.html("获取预留手机号失败！请刷新后重试!");
		return;
	}
	
	var realName =$("#realName").val();
	var idNo =$("#idNo").val();
	var bankNum =$("#bankNum").val();
	var cardCVV2 = $("#cardCVV2").val();
	var cardExpDate = getCardExpDate();
	var payChannelIdExp = getChannelInfo().paychannelid;
	
	var orderKey = $$("orderKey").value;
	if(payChannelIdExp ==""){
		$submitErrP.html("绑定新卡失败,请重新选择要开通快捷支付的银行卡");
		return;
	}
	var bankCode =getChannelInfo().bankCode;
	var cardType =getChannelInfo().cardType;
	var channelCode = getChannelInfo().channelCode;
	var amount = $("#amount").val();
	
	idNo = idNo.replace(/(\s*)/g,"");
	bankNum = bankNum.replace(/(\s*)/g,"");
	
	if (!yeePayCheckParam()) {
		return;
	}
	//对敏感信息进行加密
	exponent = $("#exponent").val();
	modulus = $("#modulus").val();
	var publicKey = RSAUtils.getKeyPair(exponent, '', modulus);
	
	checkInfo = $("#checkInfo").val();
	orderKey = $("#orderKey").val();
	token =  $("#token").val();
	var isReceivablePayment = $("#isReceivablePaymentInput").val();
	//首次获取验证码
	if (isfirstReqFlag == '1') {
	     bankNum = RSAUtils.encryptedString(publicKey, bankNum);
	     realName =  RSAUtils.encryptedString(publicKey, encodeURIComponent(realName));
	     idNo = RSAUtils.encryptedString(publicKey, idNo);
	     cardCVV2 = RSAUtils.encryptedString(publicKey, cardCVV2);
	     cardExpDate =  RSAUtils.encryptedString(publicKey, cardExpDate);
		  //组装发送报文
		dataStr="mobile="+mobileNumber+"&realName="+realName+
			"&idNo="+idNo+"&bankNum="+bankNum+"&cardCVV2="+cardCVV2+"&cardExpDate="+cardExpDate+
			"&payChannelIdExp="+payChannelIdExp+"&cardType="+cardType+"&payMoney="+amount+"&orderKey="+orderKey+
			"&token="+token+"&checkInfo="+checkInfo+"&channelCode=" + channelCode + "&isReceivablePayment=" + isReceivablePayment;
     } else {
    	 //订单号
    	 tradeNo = $("#tradeNo").val();
    	 tradeNo = RSAUtils.encryptedString(publicKey, tradeNo);
		 //组装请求报文
		 dataStr = "payChannelIdExp="+payChannelIdExp+"&tradeNo="+tradeNo+"&mobile="+mobileNumber+"&orderKey="+orderKey+
		 	"&token="+token+"&checkInfo="+checkInfo+"&channelCode=" + channelCode + "&isReceivablePayment=" + isReceivablePayment;
     }
    
	 var bindId = $("#bindId").val();
	 var bindCardNo="";
	 //绑定支付
	 if (bindId != undefined && bindId != '') {
		 bindCardNo = $("#binding .cav_data a img").data("banknum");
		 bindBankCode = $("#binding .cav_data a img").data("bankcode");
		 dataStr += "&cardNo="+bindCardNo.replace(/\*/g, "_");
		 dataStr += "&bankCode="+bindBankCode;
		 dataStr +="&bindId="+encodeURIComponent(bindId);
	 } else {
		 dataStr += "&bankCode="+bankCode;
	 }
	
	if (errorCounts > 4) {
	   $submitErrP.html("已超过最大错误次数[5]");
	   $(".getsmscode_a").attr("disabled" , true);
	   return;
	} 
	 $submitErrP.html("");
	$.ajax({
		type: "post",
		url: url,
		dataType:"json",
		data: dataStr,
		success: function(result){
		    var secflag = result.secflag;
		    var sucflag = result.sucflag;
		    var isfirst = result.isfirst;
		    var modulus = result.modulus;
		    var exponent = result.exponent;
		    var checkInfo = result.checkInfo;
		    var token = result.token;
		    //安全检查
		    if(secflag == '1' && sucflag == '0') {
		    	$("#sms-validate-first").data("firstreqflag","-1");
		    	alert(result.retMsg);
		    	$(".getsmscode_a").attr("disabled" , true);
		    	return;
		    }
		    //交易验证
		    if(sucflag =='0' && isfirst == '1'){//首次失败,则重新从易宝获取
					$("#sms-validate-first").data("firstreqflag","1");
					errorCounts++;
					alert(result.retMsg);
		    } else if (sucflag =='1'){//成功
		    	var tradeNo = result.tradeNo;
					$("#tradeNo").val((tradeNo==undefined || tradeNo=='null')?"":tradeNo);
					errorCounts = 0;
					$("#sms-validate-first").data("firstreqflag","0");
		    } else if(sucflag =='0'){//重新获取验证码打印错误信息
		    		errorCounts++;
					alert(result.retMsg);
		    } else {
		    		errorCounts++;
		    		alert("失败原因：网络繁忙，请稍后再试");
		    }
		    //将安全参数返回到页面
		    $("#modulus").val((modulus==undefined || modulus=='null' )?"":modulus);
		    $("#exponent").val((exponent==undefined || exponent=='null')?"":exponent);
		    $("#checkInfo").val((checkInfo==undefined || checkInfo=='null')?"":checkInfo);
		    $("#token").val((token==undefined || token=='null')?"":token);
		    
		}
	});
	allowCounted = true;
	var i = 60;
	var intval = setInterval(function(){
		if(0 < i){
			$(".getsmscode_a").html(i + "秒后重新获取");
			i--;
			$(".getsmscode_a").attr("disabled" , true);
			
		}else{
			$(".getsmscode_a").attr("disabled", false);
			$(".getsmscode_a").html("免费获取");
			allowGetSms = true;
			clearInterval(intval);
		}
	},1000);
}


/**获取银联验证码**/
function getUnionPaySmsCode(){
	var url = path+"/GetSmsCode";
	$(".outer_div").not(".hidden_div").find(".smsCode").val("");
	var signId = $("#signId").val();
	if(signId == ""){ //如果是新绑定的卡 则按卡类型区分 参数的校验
		return;
	} 
	var mobile = $("#mobile").val();
	if(mobile == "") {
		$submitErrP.html("获取预留手机号失败！请刷新后重试!");
		return;
	}
	var payChannelId = getChannelInfo().paychannelid;
	if(payChannelId ==""){
		$submitErrP.html("绑定新卡失败,请重新选择要开通快捷支付的银行卡");
		return;
	}
	payChannelId = payChannelId.substr(payChannelId.lastIndexOf("|")+1);
	var checkInfo = $("#checkInfo").val();
	var orderKey = $("#orderKey").val();
	var token = $("#token").val();
	var isReceivableExpress = $("#isReceivablePaymentInput").val();
	
	var dataStr = "checkInfo="+checkInfo+"&mobile="+mobile+"&orderKey="+orderKey+
		"&payChannelId="+payChannelId+"&signId="+signId+"&token="+token + "&isReceivableExpress=" + isReceivableExpress + "&payMoney=" + $("#amount").val() ;
	$.ajax({
		type: "post",
		url: url,
		dataType:"text",
		data: dataStr,
		success: function(result){
			var data = eval("("+result+")");
			if(data.retMsg != "" || data.retMsg != undefined){
				alert(data.retMsg);
			}
			var modulus = data.modulus;
		    var exponent = data.exponent;
		    var checkInfo = data.checkInfo;
		    var token = data.token;
			//将安全参数返回到页面
		    $("#modulus").val((modulus==undefined || modulus=='null' )?"":modulus);
		    $("#exponent").val((exponent==undefined || exponent=='null')?"":exponent);
		    $("#checkInfo").val((checkInfo==undefined || checkInfo=='null')?"":checkInfo);
		    $("#token").val((token==undefined || token=='null')?"":token);
		}
	});
	
	allowCounted = true;
	var i = 60;
	var intval = setInterval(function(){
		if(0 < i){
			$(".getsmscode_a").html(i + "秒后重新获取");
			i--;
			$(".getsmscode_a").attr("disabled" , true);
		}else{
			$(".getsmscode_a").attr("disabled", false);
			$(".getsmscode_a").html("免费获取");
			allowGetSms = true;
			clearInterval(intval);
		}
	},1000);
}

/**获取中移验证码**/
function getSmsCode() {
	var url = path+"/GetSmsCode";
	$(".outer_div").not(".hidden_div").find(".smsCode").val("");
	var signId=$("#signId").val();
	var mobileNumber = $("#mobile").val();
	
	if(mobileNumber == "") {
		$submitErrP.html("获取预留手机号失败！请刷新后重试!");
		return;
	}
	if(signId ==""){ //如果是新绑定的卡 则按卡类型区分 参数的校验
		if(!checkParam("getSMS")){
			return;
		}
	} 
	var realName =$("#realName").val();
	var idNo =$("#idNo").val();
	var bankNum =$("#bankNum").val();
	var cardCVV2 = $("#cardCVV2").val();
	var cardExpDate = getCardExpDate();
	var payChannelId = getChannelInfo().paychannelid;
	if(payChannelId ==""){
		$submitErrP.html("绑定新卡失败,请重新选择要开通快捷支付的银行卡");
		return;
	}
	payChannelId=payChannelId.substr(payChannelId.lastIndexOf("|")+1);
	var bankCode =getChannelInfo().bankCode;
	var cardType =getChannelInfo().cardType;
	var amount = $("#amount").val();
	var isReceivableExpress = $("#isReceivablePaymentInput").val();
	var dataStr ="signId="+signId+"&mobile="+mobileNumber+"&realName="+realName+
	"&idNo="+idNo+"&bankNum="+bankNum+"&cardCVV2="+cardCVV2+"&cardExpDate="+cardExpDate+
	"&payChannelId="+payChannelId+"&bankCode="+bankCode+"&cardType="+cardType+"&amount="+amount+ "&isReceivableExpress=" + isReceivableExpress + "&payMoney=" + $("#amount").val();
	
	$.ajax({
		type: "post",
		url: url,
		dataType:"text",
		data: dataStr,
		success: function(result){
		var data = eval("("+result+")");
			if(data.tradeNo != ""){
				$("#tradeNo").val(data.tradeNo);
			}else{
				alert(data.retMsg);
			}
		}
	});
	allowCounted = true;
	var i = 60;
	var intval = setInterval(function(){
		if(0 < i){
			$(".getsmscode_a").html(i + "秒后重新获取");
			i--;
			$(".getsmscode_a").attr("disabled" , true);
		}else{
			$(".getsmscode_a").attr("disabled", false);
			$(".getsmscode_a").html("免费获取");
			allowGetSms = true;
			clearInterval(intval);
		}
	},1000);
}
/** 验证区域编码 (民生代扣)  */
function areaCodeValidate(){
		var pass = false;
		
		var areaCodeEl = $("#areaCode");
		var areaCodeErrorEl = $("#areaCodeError");
		var areaCode = areaCodeEl.val();
		if(areaCode == ''){
			$submitErrP.html('请选择区域');
			pass = false;
		}else{
			areaCodeErrorEl.html('').show();
			pass = true;
		}
		
		return pass;
	};
function yeePayCheckParam(){
	var bindId=$("#bindId").val();
	if( bindId =="" || bindId == undefined  ){
		if(!validateNewBindBankInfo()){
			return false;
		}
		if(getChannelInfo().cardType=="1"){
			var cardCVV2 = $("#cardCVV2").val();
			var cardExpDate = getCardExpDate();
			if(!/^\d+$/.test(cardCVV2)||cardCVV2.replace(/(^\s*)|(\s*$)/g,"").length>4||cardCVV2.replace(/(^\s*)|(\s*$)/g,"").length<3||cardCVV2==""){
				$submitErrP.html("CVV2输入有误");
				return false;
			}
			  if(cardExpDate.length<3){
				$submitErrP.html("有效期有误");
				return false;
		  }
		}
	}
	return true;
}
function validateNewBindBankInfo(){
	$submitErrP.html("");
	var bankNum = $("#bankNum").val();
	bankNum = bankNum.replace(/(\s*)/g,"");
	$("#bankNum").val(bankNum);
	if(!/^\d+$/.test(bankNum)||bankNum.replace(/(^\s*)|(\s*$)/g,"").length>19||bankNum.replace(/(^\s*)|(\s*$)/g,"").length<13||bankNum==""){
		$submitErrP.html("银行账号有误");
		return false;
	}
	var channelCode__ = getChannelInfo().channelCode;
	if(channelCode__ != 'UPOP_ORG_EXPRESS'){
		var realName =$("#realName").val();
		if(realName=="" || realName.length>60){
			$submitErrP.html("姓名有误");
			return false;
		}
		var idNo =$("#idNo").val();
		idNo = idNo.replace(/(\s*)/g,"");
		$("#idNo").val(idNo);
		if(!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idNo)){
			$submitErrP.html("证件号有误");
			return false;
		}
		if(!IdCardValidate(idNo)){
			$submitErrP.html("证件号有误");
			return false;
		}
	}
	return true;
}
function IdCardValidate(idCard) { 
    idCard = idCard.replace(/ /g, "").trim();   
    if (idCard.length == 15) {   
        return isValidityBrithBy15IdCard(idCard);   
    } else if (idCard.length == 18) {   
        var a_idCard = idCard.split("");// 得到身份证数组   
        if(isValidityBrithBy18IdCard(idCard)&&isTrueValidateCodeBy18IdCard(a_idCard)){   
            return true;   
        }else {   
            return false;   
        }   
    } else {   
        return false;   
    }   
}
 /**  
  * 验证18位数身份证号码中的生日是否是有效生日  
  * @param idCard 18位书身份证字符串  
  * @return  
  */  
function isValidityBrithBy18IdCard(idCard18){   
    var year =  idCard18.substring(6,10);   
    var month = idCard18.substring(10,12);   
    var day = idCard18.substring(12,14);   
    var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));   
    // 这里用getFullYear()获取年份，避免千年虫问题   
    if(temp_date.getFullYear()!=parseFloat(year)   
          ||temp_date.getMonth()!=parseFloat(month)-1   
          ||temp_date.getDate()!=parseFloat(day)){   
            return false;   
    }else{   
        return true;   
    }   
}   
/**  
 * 判断身份证号码为18位时最后的验证位是否正确  
 * @param a_idCard 身份证号码数组  
 * @return  
 */  
function isTrueValidateCodeBy18IdCard(a_idCard) {   
    var sum = 0; // 声明加权求和变量   
    if (a_idCard[17].toLowerCase() == 'x') {   
        a_idCard[17] = 10;// 将最后位为x的验证码替换为10方便后续操作   
    }   
    for ( var i = 0; i < 17; i++) {   
        sum += Wi[i] * a_idCard[i];// 加权求和   
    }   
    valCodePosition = sum % 11;// 得到验证码所位置   
    if (a_idCard[17] == ValideCode[valCodePosition]) {   
        return true;   
    } else {   
        return false;   
    }   
}
function checkParam(param){
	var signId = $("#signId").val();
	//var smsCode = $(".outer_div").not(".hidden_div").find(".smsCode").val();
	var smsCode;
		//获取验证码
		if("true"==document.getElementById("re_validate").value){
			smsCode=getValueById("sms-validate-first");
		}else{
			smsCode=getValueById("pay_validate_code"); 
			
		}
	var cardType = getChannelInfo().cardType;
	if(signId != ""){
		var reg = /[0-9]{6}/;
		if(smsCode==""){
			$submitErrP.html("请输入验证码");
			return false;
		}else if(!reg.test(smsCode)){
			$submitErrP.html("请填写正确格式验证码");
			return false;
		}
		
	} else {
		if(!validateNewBindBankInfo()){
			return false;
		}
		var channelCode_ = getChannelInfo().channelCode;
		if(cardType=="1" && channelCode_!='UPOP_ORG_EXPRESS'){
			var cardCVV2 = $("#cardCVV2").val();
			var cardExpDate = getCardExpDate();
			if(!/^\d+$/.test(cardCVV2)||cardCVV2.replace(/(^\s*)|(\s*$)/g,"").length>4||cardCVV2.replace(/(^\s*)|(\s*$)/g,"").length<3||cardCVV2==""){
				$submitErrP.html("cvv2非法");
				return false;
			}
		    if(cardExpDate.length<3){
		    	$submitErrP.html("有效日期非法");
				return false;
			  } 
		}
		
		if(param!="getSMS"){
			if(smsCode =="" && channelCode_!='UPOP_ORG_EXPRESS'&&channelCode_!='EXPRESS_CMBC_C'){
				$submitErrP.html("请输入验证码");
				return false;
			}
		}
	}
	return true;
}

//TODO
//限制重复支付,默认允许支付
var limitRePay=true;
$(".credit_submit_button").click(function(){
		//如果是收款通道，验证用户填入数据
		var isReceivablePaymentInput=$("#isReceivablePaymentInput").val();
		if('yes'==isReceivablePaymentInput && !validate()){
			return false;
		}
		var payGateWay = $$("providerType").value;
		var smsCode;
		//获取验证码
		if("true"==document.getElementById("re_validate").value){
			smsCode=getValueById("sms-validate-first");
		}else{
			smsCode=getValueById("pay_validate_code"); 
		}
		//$(".outer_div").not(".hidden_div").find(".smsCode").val();
        var orderKey = $("#orderKey").val(); 
        var cardType = getChannelInfo().cardType;
        var channelCode = getChannelInfo().channelCode;
        var payChannelIdExp = getChannelInfo().paychannelid;
        if(channelCode=='EXPRESS_CMBC_C'){
        	if ($("#signId").val()==''&&!areaCodeValidate()) {
				return;
			}
        }
		if (isYeeExpressPay(channelCode)) {
			if (!yeePayCheckParam()) {
				return;
			}
			//对验证码进行加密
			if($.isEmptyObject(smsCode)) {
				$submitErrP.html("请输入验证码");
				return;
			}
			var checkInfo = $("#checkInfo").val();
            var token = $("#token").val();
            var modulus = $("#modulus").val();
			var exponent = $("#exponent").val();
            if (exponent == "" || modulus == "") {
            	$submitErrP.html("请求非法");
		            return;
			}
            
			var publicKey = RSAUtils.getKeyPair(exponent, '', modulus);
            var encSmsCode = RSAUtils.encryptedString(publicKey, smsCode);
 			
			$("#yeepaySubmitForm").children("input[name='tradeNo']").val($("#tradeNo").val());
			$("#yeepaySubmitForm").children("input[name='smsCode']").val(encSmsCode);
			$("#yeepaySubmitForm").children("input[name='mobile']").val($("#mobile").val());
			$("#yeepaySubmitForm").children("input[name='cardType']").val(cardType);
			$("#yeepaySubmitForm").children("input[name='providerType']").val($("#providerType").val());
			$("#yeepaySubmitForm").children("input[name='token']").val($("#token").val());
			$("#yeepaySubmitForm").children("input[name='checkInfo']").val(checkInfo);
			$("#yeepaySubmitForm").children("input[name='orderKey']").val(orderKey);
			$("#yeepaySubmitForm").children("input[name='channelCode']").val(channelCode);
			$("#yeepaySubmitForm").submit();
		} else if(channelCode == 'UPOP_ORG_EXPRESS'){//浦发
			if(checkParam("pay")){
				var exponent = $("#exponent").val();
				if (exponent == "" || modulus == "") {
            		$submitErrP.html("请求非法");
		            return;
				}
				var modulus = $("#modulus").val();
				var orderKey = $("#orderKey").val();
				var checkInfo = $("#checkInfo").val();
				var token =  $("#token").val();
				var publicKey = RSAUtils.getKeyPair(exponent, '', modulus);
	            var encSmsCode = RSAUtils.encryptedString(publicKey, smsCode);
				var bankNum = $("#bankNum").val();
				var mobile = $("#mobile").val();
	            var signId = $("#signId").val();
	            if(signId == ''){
			         bankNum = RSAUtils.encryptedString(publicKey, bankNum);
				     $("#unionpaySubmitForm").attr("target", "_blank");
				     showtcc();
	            }else {
					$(".credit_submit_button").not(".unionpay_signed").unbind("click");
	            }
				$("#unionpaySubmitForm").children("input[name='cardNo']").val(bankNum);
				$("#unionpaySubmitForm").children("input[name='checkInfo']").val(checkInfo);
				$("#unionpaySubmitForm").children("input[name='mobile']").val(mobile);
				$("#unionpaySubmitForm").children("input[name='orderKey']").val(orderKey);
				$("#unionpaySubmitForm").children("input[name='payChannelIdExp']").val(payChannelIdExp);
				$("#unionpaySubmitForm").children("input[name='signId']").val(signId);
				$("#unionpaySubmitForm").children("input[name='smsCode']").val(encSmsCode);
				$("#unionpaySubmitForm").children("input[name='token']").val(token);
				appendReceiveChannelData($("#unionpaySubmitForm").children("input[name='token']"));
				$("#unionpaySubmitForm").submit();
			}
		} else if(channelCode == 'CMBC_EXPRESS') {//民生
			if(!checkParam("pay")){
				return ;
			}
			
			var orderKey = $("#orderKey").val();
			var checkInfo = $("#checkInfo").val();
			var token =  $("#token").val();
			
			$("#cmbcExpressSubmitForm").children("input[name='checkInfo']").val(checkInfo);
			$("#cmbcExpressSubmitForm").children("input[name='token']").val(token);
			$("#cmbcExpressSubmitForm").children("input[name='orderKey']").val(orderKey);
			$("#cmbcExpressSubmitForm").children("input[name='payChannelIdExp']").val(payChannelIdExp);
			$("#cmbcExpressSubmitForm").children("input[name='cardNo']").val($("#bankNum").val());
			$("#cmbcExpressSubmitForm").children("input[name='signId']").val($("#signId").val());
			$("#cmbcExpressSubmitForm").children("input[name='mobile']").val($("#mobile").val());
			$("#cmbcExpressSubmitForm").children("input[name='tradeNo']").val($("#tradeNo").val());
			$("#cmbcExpressSubmitForm").children("input[name='bankNo']").val($("#bankNo").val());
			$("#cmbcExpressSubmitForm").children("input[name='smsCode']").val(smsCode);
			$("#cmbcExpressSubmitForm").children("input[name='cardType']").val(cardType);
			$("#cmbcExpressSubmitForm").children("input[name='bankCode']").val(getChannelInfo().bankCode);
			$("#cmbcExpressSubmitForm").children("input[name='cardCVV2']").val($("#cardCVV2").val());
			$("#cmbcExpressSubmitForm").children("input[name='cardExpDate']").val(getCardExpDate());
			$("#cmbcExpressSubmitForm").children("input[name='cardName']").val($("#realName").val());
			$("#cmbcExpressSubmitForm").children("input[name='idNo']").val($("#idNo").val());
			$("#cmbcExpressSubmitForm").children("input[name='channelCode']").val(channelCode);
			appendReceiveChannelData($("#cmbcExpressSubmitForm"));
			$("#cmbcExpressSubmitForm").submit();
			
		} else {
			if(!checkParam("pay")){
				return ;
			}
			if(!limitRePay){
				return;
			}
			$("#chinaPaySubmitForm").children("input[name='payChannelIdExp']").val(payChannelIdExp);
			$("#chinaPaySubmitForm").children("input[name='cardNo']").val($("#bankNum").val());
			$("#chinaPaySubmitForm").children("input[name='signId']").val($("#signId").val());
			$("#chinaPaySubmitForm").children("input[name='mobile']").val($("#mobile").val());
			$("#chinaPaySubmitForm").children("input[name='tradeNo']").val($("#tradeNo").val());
			$("#chinaPaySubmitForm").children("input[name='smsCode']").val(smsCode);
			$("#chinaPaySubmitForm").children("input[name='cardType']").val(cardType);
			$("#chinaPaySubmitForm").children("input[name='bankCode']").val(getChannelInfo().bankCode);
			$("#chinaPaySubmitForm").children("input[name='cardCVV2']").val($("#cardCVV2").val());
			$("#chinaPaySubmitForm").children("input[name='cardExpDate']").val(getCardExpDate());
			$("#chinaPaySubmitForm").children("input[name='cardName']").val($("#realName").val());
			$("#chinaPaySubmitForm").children("input[name='idNo']").val($("#idNo").val());
			$("#chinaPaySubmitForm").children("input[name='channelCode']").val(channelCode);
			if(channelCode=="EXPRESS_CMBC_C"){
				$("#chinaPaySubmitForm").children("input[name='areaCode']").val($("#areaCode").val());
			}
			appendReceiveChannelData($("#chinaPaySubmitForm"));
			var reValidate=document.getElementById("re_validate").value
			//交行信用卡支付下一步
			if(reValidate=="true" && "BCOM_CREDIT_EXPRESS"==channelCode && "1"==cardType){
				var data=new Object();
				data.cardType=cardType;
				data.payChannelId=payChannelIdExp;
				data.bankCode=getChannelInfo().bankCode;
				data.mobile=getValueById("mobile");
				data.orderKey=getValueById("orderKey");
				data.token=getValueById("token");
				data.checkInfo=getValueById("checkInfo");
				data.tradeNo=getValueById("tradeNo");
				if(isReceivablePaymentInput){
					data.isReceivablePayment=getValueById("isReceivablePaymentInput");
				}
				bcomPay(data);
				return;
			}
			$("#chinaPaySubmitForm").submit();
			limitRePay=false;
		}
});

/**同意支付**/

});
/**
 * 交行支付
 * @return {TypeName} 
 */
function bcomPay(data){
	
	//此处实现交行的签约付款步骤
    var submitAddressPath = $("#submitAddressPath").val();
	var url = submitAddressPath + "/expressPaySign";
	//获取表单数据
	var cardNo =getValueById("bankNum"); //获取银行账号
	cardNo = cardNo.replace(/(\s*)/g,"");
	var cardName = getValueById("realName");//获取姓名
	var idNo = getValueById("idNo").replace(/(\s*)/g,"");//获取身份证号码
	var cardCVV2 = getValueById("cardCVV2");
	var cardExpDate =getCardExpDate();//$("#years").val().substr(2,4)+$("#month").val();
	var smsCode = getValueById("sms-validate-first");
	var fields = "cardNo="+cardNo +"&cardName="+ encodeURI(cardName) +"&idNo="+ idNo +
				 "&cardCVV2="+ cardCVV2 +"&cardExpDate="+ cardExpDate;
	//验证请求
	var modulus = $("#modulus").val();
	var exponent = $("#exponent").val();
	if(null==exponent || ''==exponent || null==modulus || ''==modulus){
		alert("非法请求");
		return;
	}
	var publicKey = RSAUtils.getKeyPair(exponent, '', modulus);			
	var encryptInfo = RSAUtils.encryptedString(publicKey, fields);
	var encryptInfoArr = encryptInfo.split(" ");
	encryptInfo = encryptInfoArr[0];
	//获取相关信息
	var payChannelId = data.payChannelId;
	var cardType =data.cardType;
	var bankCode =data.bankCode;
	var mobile =data.mobile;
	var orderKey =data.orderKey;
	var token =data.token;
	var checkInfo =data.checkInfo;
	var tradeNo =data.tradeNo;
	var isReceivablePayment=data.isReceivablePayment;
	var reqData = {"encryptInfo":encryptInfo,"payChannelId":payChannelId,"cardType":cardType,"bankCode":bankCode,
					"mobile":mobile,"orderKey":orderKey,"token":token,"modulus":modulus, "smsCode":smsCode,
					"exponent":exponent,"checkInfo":checkInfo,"tradeNo":tradeNo};
	
	if("yes"==isReceivablePayment){
		reqData.isReceivablePayment = isReceivablePayment;
	}
	
	$.ajax({
	      type: "post",
	      url: url,
	      data: reqData,
	      async:false,
	      dataType:"json",
	      error:function(){
			 alert("系统繁忙,请稍后再试!");
	      },
	      success: function(data,responseStatus){
		     if("success" == responseStatus){		
			     var status = "";
			     if(data ==null && data== undefined){
			    	 $(".submitErrP").html("签约失败");
				     return;
			     }else{
				    status = data.status;
			     }
			     //将安全信息保存到页面
			     setParamToPage(data);
			     if("0"==status){
				    //下一步跳转到支付页面
				    nextPay(data);
			     }else{
				     var errorMsg = data.errorMsg;
				     if(isEmpty(errorMsg)){
				    	 $(".submitErrP").html("签约失败");
				     }else{
				    	 $(".submitErrP").html(errorMsg);
				     }
			     }
		     }
	      }
	});
}

/**
 * 同意协议并支付
 * @param {Object} data
 */
function nextPay(data){
	$("#signId").val(data.signId);
	//清除界面验证码问题
	if(intval){
		clearInterval(intval);
		intval=null;
		$(".getsmscode_a").removeAttr("disabled");
		$(".getsmscode_a").html("免费获取");
		allowGetSms=true;
	}
	var path_remote=$("#submitAddressPath").val();
	$("#exp_third_div").hide();
	$("#exp_second_div").show();
	//代表签约结束，付款开始或者重新绑定
	document.getElementById("re_validate").value="false";
	var bankNum = "**" +data.bankNum;
	
	//增加显示相同签约信息控制
	var $bandLiSpan = $("#binding>li>span");
	var isAppend = true;
	for(var i=0 ;i<$bandLiSpan.length;i++){
		var bindCardNum = $bandLiSpan[i].innerText;
		if(bindCardNum == bankNum){
			isAppend = false;
		}
	}
	if(isAppend){
		var $bandLi = $("<li class=\"banks\"><a href=\"javascript:;\"><img alt=\""+data.bankCode+"\" data-signId=\""+data.signId+"\" data-banknum=\""+data.bankNum+"\" data-bankcode=\""+data.bankCode+"\" src=\""+path_remote+"/wap/images/"+ data.bankCode +".jpg\"/></a><span>"+bankNum+"</span></li>");
		$("#binding").append($bandLi);
	}
}

function isEmpty(val){
		if (val == null || val == undefined || val == '') { 
			return true;
		} 
		return false;
	}

/** 设置页面安全参数 */
function setParamToPage(data){
	var modulus = data.modulus;
    var exponent = data.exponent;
    var checkInfo = data.checkInfo;
    var token = data.token;
    
	//将安全参数返回到页面
    $("#modulus").val((modulus==undefined || modulus=='null' )?"":modulus);
    $("#exponent").val((exponent==undefined || exponent=='null')?"":exponent);
    $("#checkInfo").val((checkInfo==undefined || checkInfo=='null')?"":checkInfo);
    $("#token").val((token==undefined || token=='null')?"":token);
	
};
/**
 * 通过id获取value
 * @param {Object} elementId
 */
function getValueById(elementId){
	var value=document.getElementById(elementId).value;
	return value;
}


//打开遮罩层
function openDialog_scanPay(){
	//触发检查订单状态
	setTimeout(function(){intime = setInterval("checkSuccess('PaymentCom')", 60000);}, 300000);
	
    var winHeight=0;
    if (document.body && document.body.scrollHeight){
        winHeight = document.body.scrollHeight;
    }
    $("#fade").show();
}


//收款通道扫码

function receiveChannel_scanPay(businessType,width,height){
	
	if(!validate()){
		return false;
	}
	var path_remote=$("#remoteUrlPath").val();
	$("#qrcode").html("正在生成二维码<img src='" + path_remote + "wap/images/wait.gif' /></div>");
	
	var scan2d = '';
	var chlType = '';
	if(businessType == 'alipayScanWap'){
		scan2d= $("#scan2d_alipay").val();
		$("#subImg_scanPay").attr("src", path_remote + "/images/scanning_alipay.png");
		
	}else if(businessType == 'wxpayWap'){
		scan2d= $("#scan2d").val();
		$("#subImg_scanPay").attr("src", path_remote + "/images/scanning.png");
		chlType = '03';
	}
	
	var txMoney = $("#payMoney").val() ;
	if(txMoney > 50000){
		$("#fade").show();
		$("#scan_window_excption").show();
		$("#scan_window_excption").find("#msg").html("MONEY_OVER_LIMIT");
		$("#scan_window_excption").find("#showMsg").html("单笔订单金额不能超过50000元");
		$("#scan_pay_over").show() ;
		return ;
	}
	
	if (compareAndRefreshParam(businessType) && scan2d.trim() != '') {
		 $("#fade").show();
         $("#scan_window").show();
         $('#qrcode').html('');
		 var oQRCode = new QRCode("qrcode", {
		   width : width,
		   height : height
         });
		  oQRCode.clear();
		  oQRCode.makeCode(scan2d.trim());
		  scanRefresh("qrcode");
         return ;
	}
	var url =$("#scanPay"+businessType).attr("action");
	
	var bankCode = $("#payChannelId" + businessType).data("bankcode");
	var payChannelId = $("#payChannelId" + businessType).val();
	var orderKey = $("#orderKey" + businessType).val();
	var orderInfo = $("#orderInfo" + businessType).val();
	var isReceivablePayment=$("#isReceivablePaymentInput").val();
	
	var payMoney = $("#payMoney").val();
	var customerIdCard = $("#customerIdCard").val();
	var customerName = $("#customerName").val();
	var merchantId = $("#merchantId").val();
	var userName = $("#userName").val();
	var phone = $("#phone").val();
	var email = $("#email").val();
	var addr = $("#addr").val();
	var postzip = $("#postzip").val();
	

	var dataStr = "bankCode=" + bankCode + "&payChannelId=" + payChannelId
			+ "&orderKey=" + orderKey + "&orderInfo=" + orderInfo
			+ "&chlType=" + chlType + "&isReceivablePayment=" + isReceivablePayment
			+ "&payMoney=" + payMoney + "&customerIdCard=" + customerIdCard + "&customerName=" + customerName + "&merchantId=" + merchantId
			+ "&userName=" + userName + "&phone=" + phone
			+ "&email=" + email + "&addr=" + addr + "&postzip=" + postzip;
	
	$.post(url, {"bankCode" : bankCode, "payChannelId" : payChannelId, "orderKey" : orderKey, "orderInfo" : orderInfo, 
		"chlType" : chlType, "isReceivablePayment" : isReceivablePayment, "payMoney" : payMoney, "customerIdCard":customerIdCard, "customerName":customerName, "merchantId" : merchantId, 
		"userName" : userName, "phone" : phone, "email" : email, "addr" : addr, "postzip" : postzip}, 
		function(resultdata){
			var data = eval("("+resultdata+")");
			if(data.qrcode != ""){
				openDialog_scanPay();
				$("#scan_window").show();
				$("#qrcode").html("");
				var oQRCode = new QRCode("qrcode", {width : 200, height : 200});
				oQRCode.clear();
				oQRCode.makeCode(data.qrcode);
				scanRefresh("qrcode");
				if(businessType == 'alipayScanWap'){
					$("#scan2d_alipay").val(data.qrcode);
				}else if(businessType == 'wxpayWap'){
					$("#scan2d").val(data.qrcode);
				}	
			}else{
				openDialog_scanPay();
				$("#scan_window_excption").show();
				var code = data.errorcode;
				var desc = data.errordesc;
				$("#scan_window_excption").find("#msg").html(code);
				$("#scan_window_excption").find("#showMsg").html(desc);
				return;
			}
	});
	
}
function compareAndRefreshParam(businessType){
	
	var paramJson = $("#paramJson"+businessType).val();
	var paramJsonObj = JSON.parse(paramJson);
	var payMoney=$("#payMoney").val();
	var userName=$("#userName").val();
	var phone=$("#phone").val();
	var email=$("#email").val();
	var addr=$("#addr").val();
	var postzip=$("#postzip").val();
	var flag = false;
	if(compareParams(payMoney,paramJsonObj.payMoney) && compareParams(userName,paramJsonObj.userName) && compareParams(phone,paramJsonObj.phone)
			&& compareParams(email,paramJsonObj.email) && compareParams(addr,paramJsonObj.addr) && compareParams(postzip,paramJsonObj.postzip) ){
		flag = true;
	}else{
		paramJson='{"payMoney":"'+payMoney+'","userName":"'+userName+'","phone":"'+phone+'",' +
					'"email":"'+email+'","addr":"'+addr+'","postzip":"'+postzip+'"}';
	}
	
	$("#paramJson"+businessType).val(paramJson);
	
	return flag;
	
}
function compareParams(a,b){
	//json字符串undefined必须加双引号
	if ((a == null || a == undefined || a == ''|| a == "undefined") && (b == null || b == undefined || b == '')|| b == "undefined") { 
		return true;
	} 
	if(a==b){
		return true;
	}
	return false;
}

// 针对IE10以下的浏览器二维码插件生成的二维码高度兼容性问题，重新刷新二维码高度
function scanRefresh(qrcodeId) {
	//获取二维码对象
	var qrcodeObj = $("#"+qrcodeId);
	
	//刷新二维码单元格的高度
	var trs = qrcodeObj.find("tr")
	if (trs.length > 0) {
		//alert(trs.length)
		var tableHeight = qrcodeObj.height();
		var tdHeigth = Math.round(tableHeight / trs.length);
		trs.find("td").height(tdHeigth);
	}

	//刷新二维码外边框的高度
	var table = qrcodeObj.find("table")
	if (table.length > 0) {
		//alert(table.height());
		qrcodeObj.height(table.height());
	}
}

//提交表单
function submitForm(formname, businesstype){	
	//如果是收款通道，验证用户填入数据
	var isReceivablePaymentInput=$("#isReceivablePaymentInput").val();
	if('yes'==isReceivablePaymentInput && !validate()){
			return false;
	}
	
	$("#pay_failed").show() ;
	var bankCode = "";
	var chiannelId="";
	var chkObjs = $("#payChannelId"+businesstype).val();
	var mobileVerifyFlag = $("#mobileVerifyFlag"+businesstype).val();
	if(chkObjs != ""){
		var str=chkObjs.split("|");
		bankCode = str[1];
		chiannelId=str[2];
	}else{
		alert("请选择支付银行"); 
		return; 
	}
	//非银行卡支付不更新Cookie
	if(bankCode!="CMPAY" && bankCode!="ZYC"){
	        //保存24小时
		setCookie("tempChannelId",chiannelId,24);
	}
	var redoFlag = $("#redoFlag").val();
	if("1" == redoFlag){
		$("#"+formname).attr("target", "_self");
	}else{
		$("#"+formname).attr("target", "dinpay");
	}
	
	//如果是点卡支付，则加入通道的“通道代码+dinpay”费率信息
	if('dcard_pay'==formname){
		var $s = '#'+bankCode+'_dinpayRate';
		var dinpayRate = $($s).val();
		$('#dinpayRate').val(bankCode+'|'+dinpayRate);
		$('#dCardBankCode').val(bankCode);
	}
	if('bank_payb2c'==formname && ('1'==mobileVerifyFlag ||'2'==mobileVerifyFlag||'3'==mobileVerifyFlag)){
		$('.js-tel').val('');
		$('.js-code').val('');
		$(".bg_b2c").show();
		$("#js-popwintwo").show();	
		if('1'== mobileVerifyFlag){
			$("#formSelectDiv").css("display", "none");
			$('.js-tel').attr('placeholder','手机号码');
			$('.js-code').attr('placeholder','短信验证码');
		}else if('2'== mobileVerifyFlag){
			$("#formSelectDiv").css("display", "none");
			$('.js-tel').attr('placeholder','邮箱地址');
			$('.js-code').attr('placeholder','邮箱验证码');
		}else if('3'== mobileVerifyFlag){
			$("#formSelectDiv").css("display", "");
			var all_options = document.getElementById("formSelect").options;
			all_options[0].selected = true;
			$('.js-tel').attr('placeholder','手机号码');
			$('.js-code').attr('placeholder','短信验证码');
		}
	}else{
		appendReceiveChannelData($("#"+formname));
		$("#"+formname).submit();
	}
}

$(function(){
	$(".agreement2").hide() ;
})

//设置Cookie
function setCookie(name,value,expireHours){
	var cookieString=name+"="+escape(value);
	if(expireHours>0){
		var exp=new Date();
		exp.setTime(exp.getTime()+expireHours*60*60*1000);
		cookieString=cookieString+"; expires="+exp.toGMTString();
	} 
	document.cookie=cookieString;
}

//获取Cookie
function getCookie(name){
        var strCookie=document.cookie;
        var arrCookie=strCookie.split("; ");
        for(var i=0;i<arrCookie.length;i++){
            var arr=arrCookie[i].split("=");
            if(arr[0]==name){
            	return arr[1]
    		};
        }
        return "0";
}

var $agreement=$(".agreement");
var intime;
$("#button").click(function(){
	  setTimeout(function(){intime = setInterval("checkSuccess('PaymentCom')", 60000);}, 300000);
	   var $agreement_height = "-"+($agreement.height()/2+"px");
	   $agreement.css("margin-top",$agreement_height);
	   $(".new_card_bg,.agreement").show();
})

//设置setpaychannelid
function setPayChannelId(obj, businesstype){
		var $obj = $(obj);
	var payclass = $obj.data("payclass");
	var mobileVerifyFlag = $obj.data("mobileverifyflag");
	$("#payChannelId"+businesstype).val(payclass);
	$("#mobileVerifyFlag"+businesstype).val(mobileVerifyFlag);
}
//点击支付成功，返回通知商家
function showPro(url){
	var $agreement2 = $(".agreement2");
	var dataStr="orderKey="+$("#orderKey").val();
	var isCheckBank = "isCheckBank=0";
	$.ajax({
		type: "post",
		url: url,
		dataType:"text",
		data: dataStr+"&"+isCheckBank+"&timeStamp="+(new Date().getTime()),
		success: function(result){
		var data = eval("("+result+")");
			if(data.result == "0") {
				postForm(data);
			} else {
				$("#pay_failed").hide();
			}
		}
	});
}

function checkSuccess(url){
	var dataStr="orderKey="+$("#orderKey").val();
	var isCheckBank = "isCheckBank=1";
	$.ajax({
		type: "post",
		url: url,
		dataType:"text",
		data: dataStr+"&"+isCheckBank+"&timeStamp="+(new Date().getTime()),
		success: function(result){
		var data = eval("("+result+")");
			if(data.result == "0") {
				postForm(data);
			} if (data.result == "2") {
				var turnForm = document.createElement("form");   
			    document.body.appendChild(turnForm);
			    turnForm.method = 'post';
			    turnForm.action = '/wap/pay_failed.jsp';
				 //创建隐藏表单
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","errorCode");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.errorCode);
			    turnForm.appendChild(newElement);
			    turnForm.submit();
			}
		}
	});
}

function getNewElement(newElementName,newElementValue){
	var newElement = document.createElement("input");
	newElement.setAttribute("name",newElementName);
	newElement.setAttribute("type","hidden");
	newElement.setAttribute("value",newElementValue);
	return newElement; 
}

/*
 * 添加h5收款通道表单数据
 * @param {Object} currentForm
 */
function appendReceiveChannelData(currentForm){
	var isReceivablePaymentInput=$("#isReceivablePaymentInput").val();
	if(undefined !=isReceivablePaymentInput){
		currentForm.append(getNewElement('isReceivablePayment',isReceivablePaymentInput));
	}
	$("#orderMsg input[type='text']").each(function(){
		currentForm.append(getNewElement($(this).attr("name"),$(this).val()));
	});
}

function checkPay(url){
	clearInterval(intime);
	var dataStr="orderKey="+$("#orderKey").val();
	var isCheckBank = "isCheckBank=0";
	$.ajax({
		type: "post",
		url: url,
		dataType:"text",
		data: dataStr+"&"+isCheckBank+"&timeStamp="+(new Date().getTime()),
		success: function(result){
		var data = eval("("+result+")");
			if(data.result == "0") {
				postForm(data);
			} else {
				$(".new_card_bg,.agreement,.agreement3").hide();
			}
		}
	});
}

function postForm(data){
	var turnForm = document.createElement("form");   
			    document.body.appendChild(turnForm);
			    turnForm.method = 'post';
			    turnForm.action = '../check_succeed.jsp';
				 //创建隐藏表单
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","orderId");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.orderId);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","txMoney");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.txMoney);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","txDate");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.txDate);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","gateWayID");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.gateWayID);
			    turnForm.appendChild(newElement);
			    //新增
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","order_version");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.order_version);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","newmd5info");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.newmd5info);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","DinpayOrderId");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.DinpayOrderId);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","m_id");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.m_id);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","m_orderid");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.m_orderid);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","m_oamount");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.m_oamount);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","m_ocurrency");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.m_ocurrency);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","m_language");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.m_language);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","s_name");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.s_name);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","s_addr");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.s_addr);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","s_postcode");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.s_postcode);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","s_tel");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.s_tel);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","s_eml");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.s_eml);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","r_name");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.r_name);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","r_addr");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.r_addr);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","r_postcode");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.r_postcode);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","r_eml");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.r_eml);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","r_tel");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.r_tel);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","m_ocomment");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.m_ocomment);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","m_status");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.m_status);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","modate");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.modate);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","OrderMessage");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.OrderMessage);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","Digest");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.Digest);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","merchant_code");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.merchant_code);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","notify_type");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.notify_type);
			    turnForm.appendChild(newElement);
		
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","notify_id");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.notify_id);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","interface_version");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.interface_version);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","sign_type");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.sign_type);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","order_no");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.order_no);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","order_amount");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.order_amount);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","order_time");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.order_time);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","trade_no");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.trade_no);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","trade_time");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.trade_time);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","trade_status");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.trade_status);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","extra_return_param");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.extra_return_param);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","bank_seq_no");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.bank_seq_no);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","page_sign");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.page_sign);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","page_return_url");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.page_return_url);
			    turnForm.appendChild(newElement);
			    var newElement = document.createElement("input");
			    newElement.setAttribute("name","s_postcode");
			    newElement.setAttribute("type","hidden");
			    newElement.setAttribute("value",data.s_postcode);
			    turnForm.appendChild(newElement);
			    turnForm.submit();
}

function checkNo (obj) {
		var mobileReg = /^1[3|4|5|7|8][0-9]\d{8}$/;
		var telVal = $(obj).val();
		telVal = $.trim(telVal);
		if (telVal.length <= 0) {
			$(".js-error").html("手机号码不能为空");
			return;
		} else if (!mobileReg.test(telVal)) {
			$(".js-error").html("手机号码格式错误");
			return;
		} else {
			return true;

		}
	}
function checkEmail (obj) {
	var reg1 = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		var telVal = $(obj).val();
		telVal = $.trim(telVal);
		if (telVal.length <= 0) {
			$(".js-error").html("邮箱地址不能为空");
			return;
		} else if (!reg1.test(telVal)) {
			$(".js-error").html("邮箱地址格式错误");
			return;
		} else {
			return true;

		}
	}

function checkVerifyAddr (obj) {
		var _this = this;
		var verifyType=$("#formSelect option:selected").val();  //获取选中的项
		var mobileVerifyFlag=$("#mobileVerifyFlagb2c").val();
		if(((mobileVerifyFlag=='3'&&verifyType=='1')||mobileVerifyFlag=='1')&&checkNo(obj)){
			return true;
		}else if(((mobileVerifyFlag=='3'&&verifyType=='2')||mobileVerifyFlag=='2')&&_this.checkEmail(obj)){
			return true;
		}
		return false;
	}

function checkVerifyCode(obj) {
		var codeVal = $(obj).val();
		codeVal = $.trim(codeVal);
		if (codeVal.length <= 0) {
			$(".js-error").html("验证码不能为空");
			return;
		} else {
			return true;
		}
	}

