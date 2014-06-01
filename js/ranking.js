var rankings = {};
var rankingsOld = {}
var tipoCountry = 'countryType';
var tipoChallenge = 'challengeType';
var imageOpened = null;
var currentType;
var totalRanking = 0;
var firstRankingUpdated = false;
var detailsOpened = false;


function onLoadPage(type){
    currentType = type;

    $('.cleanScreen').click(function(){
        var container = $('#rankingContent');
        $(container).isotope({filter: '.'+currentType});
        detailsOpened = false;
        startPooling();
        return false;
    });

    setTimeout(function(){
        loadRankingRest()
    }, 800);
}


function loadRankingRest(){
    if (!detailsOpened){
        var success = function(data) {
            if (rankingsOld == null){
                rankingsOld = data;
            }
            else  {
                rankingsOld = rankings;  
            }
            rankings = data;
            loadRanking(currentType);
        }
        var fail = function(error) {
            if (rankingsOld == null){
                rankingsOld = data;
            }
            else  {
                rankingsOld = rankings;  
            }
            rankings = rankingsDefault;
            loadRanking(currentType);
        }
        getRankingImages(success, fail);
    }
    
}

function startPooling(){
    setTimeout(function(){
            loadRankingRest()
    }, 4000);
}

function loadRanking() {
    var indexRank = 0;

    if (currentType == tipoCountry){
        for (var i=0; i<rankings.countries.length; i++) {
            criaBoxCountry(i); 
        }
    } else {
        for (var i=0; i<rankings.challenges.length; i++) {
            criaBoxChallenge(i)
        }
    }

    if (!firstRankingUpdated){
        firstRankingUpdated = true;
        

        var container = $('#rankingContent');

        $(container).isotope({
            filter: '.'+currentType,
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false
            }
        });

        $('.thumb').click(function(){
            var selector = $(this).attr('filter-attr');
            $(container).isotope({
                filter: '.'+selector
                
             });
             detailsOpened = true;
             return false;
        });

        $('.lightbox').click(function () {
            zoomPhoto(this);
        });

        $('body').click(function(){
            cleanZoomPhoto(this);
        });

        for (var i = 0; i < totalRanking; i++) {
            updateTotalPhotos(i);
        }
        startPooling();
    } else {
        startPooling();
    }
}

function zoomPhoto(photo){
    if (imageOpened != null){
        $(imageOpened).removeClass('goLight');
        imageOpened = null;
    }
    imageOpened = $(photo);
    $(photo).addClass('goLight');
}
function cleanZoomPhoto(photo){
    if (imageOpened != null){
        $(imageOpened).removeClass('goLight');
        imageOpened = null;
    }
}

function updateTotalPhotos(index){
    setTimeout(function() {
        var contador = $('.count.left h1');
        var temp = totalRanking - totalRanking + index;
        contador.text(temp + ' Fotos');
    }, index*100 + 100)
    
}

function criaBoxCountry(index){
    var container = $('#rankingContent');
    var boxes = [];
    var pais = rankings.countries[index];

    if (!firstRankingUpdated){
        var box = $("<a></a>").attr("href", "#").addClass("thumb").addClass(tipoCountry).addClass(pais.country);
        $(box).attr('filter-attr', pais.country)
        var bg;
        if (pais.img.length > 0){
            bg = pais.img[0];
        } else {
            bg = 'css/img/argentina.jpg'
        }
        $(box).css('background',' url('+bg+') center center');  
        $(box).html('<main><h1><span>#</span>' +pais.country+ '</h1><h2>'+pais.img.length+' Fotos</h2></main>');
        
        boxes.push(box);
        
        for (var j=0; j<pais.img.length; j++) {
            totalRanking=totalRanking+1;
            if (j != 0){
                var boxChildren = $('<a class="lightbox"></a>').attr("href", "#").addClass("thumb").addClass(pais.country);
                $(boxChildren).css('background',' url('+pais.img[j]+') center center'); 
                boxes.push(boxChildren);    
            }
            
        };

        $(container).append(boxes);
    } else {
        if (pais.img.length > 0){
            var indexTemp = 0;
            if (pais.img.length == rankingsOld.countries[index].img.length){
                indexTemp = Math.floor((Math.random() * pais.img.length));
            }
            $('.'+tipoCountry+'.'+pais.country).css('background',' url('+pais.img[indexTemp]+') center center')
        }
    }
    

}

function criaBoxChallenge(index){
    var container = $('#rankingContent');
    var boxes = [];
    var challenge = rankings.challenges[index];

    if (!firstRankingUpdated){
        var box = $("<a></a>").attr("href", "#").addClass("thumb").addClass(tipoChallenge).addClass(challenge.name);
        $(box).attr('filter-attr', challenge.name)
        var bg;
        if (challenge.img.length > 0){
            bg = challenge.img[0];
        } else {
            bg = 'css/img/argentina.jpg'
        }
        $(box).css('background',' url('+bg+') center center');  
        $(box).html('<main><h1><span>#</span>' +challenge.name+ '</h1><h2>'+challenge.img.length+' Fotos</h2></main>');
        
        boxes.push(box);

        for (var j=0; j<challenge.img.length; j++) {
            totalRanking=totalRanking+1;
            if (j != 0){
                var boxChildren = $('<a class="lightbox"></a>').attr("href", "#").addClass("thumb").addClass(challenge.name);
                $(boxChildren).attr('filter-attr', challenge.name)
                $(boxChildren).css('background',' url('+challenge.img[j]+') center center'); 
                boxes.push(boxChildren);    
            }
            
        };

        $(container).append(boxes);
    } else {
        if (challenge.img.length > 0){
            var indexTemp = 0;
            if (challenge.img.length == rankingsOld.challenges[index].img.length){
                var indexTemp = Math.floor((Math.random() * challenge.img.length));
            }
            $('.'+tipoChallenge+'.'+challenge.name).css('background',' url('+challenge.img[indexTemp]+') center center')    
            
        }
    }
    

}


function getRankingImages(successCallback, errorCallbacke){
	restCall("http://29days.myeyes.com.br/images", "application/json", null, successCallback, errorCallbacke);
}

function getRequest(url, successCallback, errorCallbacke){
	$.ajax({
	  url: url
	}).done(function(data, textStatus, jqXHR) {
	  if (successCallback)	
	  	successCallback(data);	
	}).fail(function(jqXHR, textStatus, errorThrown) {
	  if (errorCallbacke)
		errorCallbacke(errorThrown);
	});
}

function restCall(url, type, data, success, error){
	var request = $.ajax({
			type: type,
			url: url,
			data: data,
			success: success,
			error: error
	});
}

function getNextLogin(successCallback, errorCallbacke){
	$.ajax({
	  url: "/rest/user"
	}).done(function(data, textStatus, jqXHR) {
	  if (successCallback)	
	  	successCallback(data);	
	}).fail(function(jqXHR, textStatus, errorThrown) {
	  if (errorCallbacke)
		errorCallbacke(errorThrown);
	});
}

var rankingsDefault = {
  "challenges": [
    {
      "img": [
        "http://pbs.twimg.com/media/Bo68XF0IAAAVU6N.jpg", 
        "http://pbs.twimg.com/media/Bo68PbPIYAA977u.jpg", 
        "http://pbs.twimg.com/media/Bo68ijzCEAA31LW.jpg", 
        "http://pbs.twimg.com/media/Bo6802aIYAA8ibY.jpg", 
        "http://pbs.twimg.com/media/Bo6-2FsIMAEtN0i.jpg", 
        "http://pbs.twimg.com/media/Bo9mn34IMAA7sZT.jpg", 
        "http://pbs.twimg.com/media/Bo_xChZIEAArffv.jpg", 
        "http://pbs.twimg.com/media/Bo6783UIIAA8Lfd.jpg", 
        "http://pbs.twimg.com/media/Bo68ijzCEAA31LW.jpg", 
        "http://pbs.twimg.com/media/Bo_7Lj8CAAEx1XY.jpg", 
        "http://pbs.twimg.com/media/Bo_90LTCIAAi3ZB.jpg", 
        "http://pbs.twimg.com/media/BpB3pufIQAA3IPb.jpg", 
        "http://pbs.twimg.com/media/BpBsE_yIIAAIgej.jpg", 
        "http://pbs.twimg.com/media/Bo6h8CCCEAA1ZYA.jpg", 
        "http://pbs.twimg.com/media/BpB5wPBIUAA7iTd.jpg", 
        "http://pbs.twimg.com/media/BoAUqNRIMAAkE2N.jpg", 
        "http://pbs.twimg.com/media/Bo_7KwCCMAAiBxj.jpg", 
        "http://pbs.twimg.com/media/Bo_7NqvCEAAbijR.jpg", 
        "http://pbs.twimg.com/media/Bo_7ObqCMAARd9R.jpg", 
        "http://pbs.twimg.com/media/Bo_7nNpIUAANtj_.jpg", 
        "http://pbs.twimg.com/media/Bo_7yU7CMAAD4N6.jpg", 
        "http://pbs.twimg.com/media/Bo_8ILbCAAAtqwI.jpg", 
        "http://pbs.twimg.com/media/Bo_8RaOCQAAK3Cj.jpg", 
        "http://pbs.twimg.com/media/Bo_9fgtCUAEfNj8.jpg", 
        "http://pbs.twimg.com/media/Bo_-TLjCMAEVC0L.jpg", 
        "http://pbs.twimg.com/media/Bo_G154CAAEYdF6.jpg", 
        "http://pbs.twimg.com/media/BpB8H_uIUAAkf2r.jpg", 
        "http://pbs.twimg.com/media/Bo_7ObqCMAARd9R.jpg", 
        "http://pbs.twimg.com/media/Bo_7Y4LCEAE34cR.jpg", 
        "http://pbs.twimg.com/media/Bo_7nNpIUAANtj_.jpg", 
        "http://pbs.twimg.com/media/Bo_8RaOCQAAK3Cj.jpg", 
        "http://pbs.twimg.com/media/Bo_8g_VCYAA-gLq.jpg", 
        "http://pbs.twimg.com/media/Bo_8y9vCEAAkbg7.jpg", 
        "http://pbs.twimg.com/media/Bo_9CfbCcAAEwxs.jpg", 
        "http://pbs.twimg.com/media/BpB9FkPIIAArS0L.jpg", 
        "http://pbs.twimg.com/media/Bo6h8CCCEAA1ZYA.jpg", 
        "http://pbs.twimg.com/media/Bo_8g_VCYAA-gLq.jpg", 
        "http://pbs.twimg.com/media/BpB9UCGIcAAl2cM.jpg", 
        "http://pbs.twimg.com/media/BpB9XbIIIAA9nuP.jpg", 
        "http://pbs.twimg.com/media/BpB9XhkIAAEVNuy.jpg", 
        "http://pbs.twimg.com/media/BpB9XrPIAAAUsh8.jpg", 
        "http://pbs.twimg.com/media/Bo8aHf8IQAAmvvT.jpg", 
        "http://pbs.twimg.com/media/Bo7RCprIQAE24Xl.jpg", 
        "http://pbs.twimg.com/media/Bo7-2wHIIAAm7Dp.jpg", 
        "http://pbs.twimg.com/media/Bo7-2wHIIAAm7Dp.jpg", 
        "http://pbs.twimg.com/media/BpB-ID5IYAAUmTo.jpg", 
        "http://pbs.twimg.com/media/BlBTr3-IgAATdgR.jpg", 
        "http://pbs.twimg.com/media/BipCoytCUAAfb2O.jpg", 
        "http://pbs.twimg.com/media/Bo4z88FCcAEjYOc.jpg", 
        "http://pbs.twimg.com/media/BipCoytCUAAfb2O.jpg"
      ], 
      "name": "hadouken"
    }, 
    {
      "img": [
        "http://pbs.twimg.com/media/Bo68FPxIQAE5K9P.jpg", 
        "http://pbs.twimg.com/media/Bo6783UIIAA8Lfd.jpg", 
        "http://pbs.twimg.com/media/Bo69PV3IIAAv6zA.jpg", 
        "http://pbs.twimg.com/media/Bo69aiHIUAA4fq2.jpg", 
        "http://pbs.twimg.com/media/Bo69zrOIgAAzEXv.jpg", 
        "http://pbs.twimg.com/media/Bn6kWj3IMAAIWjI.jpg", 
        "http://pbs.twimg.com/media/Bo6-Mk4CAAEScLU.jpg", 
        "http://pbs.twimg.com/media/Bo_G154CAAEYdF6.jpg", 
        "http://pbs.twimg.com/media/Bo9mn34IMAA7sZT.jpg", 
        "http://pbs.twimg.com/media/Bo68sRuIAAAxpX5.jpg", 
        "http://pbs.twimg.com/media/Bo69aiHIUAA4fq2.jpg", 
        "http://pbs.twimg.com/media/Bo6-Eh1IIAEsFgG.jpg", 
        "http://pbs.twimg.com/media/Bo6-Mk4CAAEScLU.jpg", 
        "http://pbs.twimg.com/media/Bo6-UvFIcAALnFK.jpg", 
        "http://pbs.twimg.com/media/Bo7-2wHIIAAm7Dp.jpg", 
        "http://pbs.twimg.com/media/Bo6-Mk4CAAEScLU.jpg", 
        "http://pbs.twimg.com/media/Bo_8UhPIcAA1K7r.jpg", 
        "http://pbs.twimg.com/media/Bo_7NqvCEAAbijR.jpg", 
        "http://pbs.twimg.com/media/Bo_8UhPIcAA1K7r.jpg", 
        "http://pbs.twimg.com/media/Bo_7ObqCMAARd9R.jpg", 
        "http://pbs.twimg.com/media/Bo9mn34IMAA7sZT.jpg", 
        "http://pbs.twimg.com/media/BpB5vtQIEAAnzad.jpg", 
        "http://pbs.twimg.com/media/BpB5vtrIUAAwxIr.jpg", 
        "http://pbs.twimg.com/media/BpBsE_yIIAAIgej.jpg", 
        "http://pbs.twimg.com/media/Bo_9CfbCcAAEwxs.jpg", 
        "http://pbs.twimg.com/media/Bo_79h3CIAEnIPY.jpg", 
        "http://pbs.twimg.com/media/Bo_8g_VCYAA-gLq.jpg", 
        "http://pbs.twimg.com/media/Bo_90LTCIAAi3ZB.jpg", 
        "http://pbs.twimg.com/media/Bo_-wrMCMAApvpj.jpg", 
        "http://pbs.twimg.com/media/BpAARZCIUAI0PWC.jpg", 
        "http://pbs.twimg.com/media/Bowan6EIYAEiLjo.jpg", 
        "http://pbs.twimg.com/media/Bo_7JLsCUAAoMAm.jpg", 
        "http://pbs.twimg.com/media/Bo_7J6uCYAAo0FW.jpg", 
        "http://pbs.twimg.com/media/Bo_7KwCCMAAiBxj.jpg", 
        "http://pbs.twimg.com/media/Bo_7Lj8CAAEx1XY.jpg", 
        "http://pbs.twimg.com/media/Bo_7JLsCUAAoMAm.jpg", 
        "http://pbs.twimg.com/media/Bo_7NqvCEAAbijR.jpg", 
        "http://pbs.twimg.com/media/BpB8T7BIEAAC-5m.jpg", 
        "http://pbs.twimg.com/media/Bo_7yU7CMAAD4N6.jpg", 
        "http://pbs.twimg.com/media/Bo_8ILbCAAAtqwI.jpg", 
        "http://pbs.twimg.com/media/Bo_7JLsCUAAoMAm.jpg", 
        "http://pbs.twimg.com/media/Bo_7J6uCYAAo0FW.jpg", 
        "http://pbs.twimg.com/media/Bo_7Lj8CAAEx1XY.jpg", 
        "http://pbs.twimg.com/media/Bo_7Mc8CUAA5dVu.jpg", 
        "http://pbs.twimg.com/media/Bo_7Mc8CUAA5dVu.jpg", 
        "http://pbs.twimg.com/media/Bo_8ILbCAAAtqwI.jpg", 
        "http://pbs.twimg.com/media/BpB9XB6IEAACYFz.jpg", 
        "http://pbs.twimg.com/media/BpB9hnCIEAA7yGN.jpg", 
        "http://pbs.twimg.com/media/Bo_7Y4LCEAE34cR.jpg", 
        "http://pbs.twimg.com/media/BpB9yHGIIAALbqI.jpg", 
        "http://pbs.twimg.com/media/BpB8H_uIUAAkf2r.jpg", 
        "http://pbs.twimg.com/media/Bo7-2wHIIAAm7Dp.jpg", 
        "http://pbs.twimg.com/media/BpB_AxDIIAAEAbU.jpg", 
        "http://pbs.twimg.com/media/BpB_oqtIcAA1ZDM.jpg"
      ], 
      "name": "vemprarua"
    }, 
    {
      "img": [
        "http://pbs.twimg.com/media/Bo_9fgtCUAEfNj8.jpg", 
        "http://pbs.twimg.com/media/Bo68sRuIAAAxpX5.jpg", 
        "http://pbs.twimg.com/media/Bo68XF0IAAAVU6N.jpg", 
        "http://pbs.twimg.com/media/BpBzyTHIMAA5dcF.jpg", 
        "http://pbs.twimg.com/media/Bo7-2wHIIAAm7Dp.jpg", 
        "http://pbs.twimg.com/media/Bo6-tYFIEAATgWy.jpg", 
        "http://pbs.twimg.com/media/Bo698GYIIAAYZQn.jpg", 
        "http://pbs.twimg.com/media/Bo698GYIIAAYZQn.jpg", 
        "http://pbs.twimg.com/media/Bo7-2wHIIAAm7Dp.jpg", 
        "http://pbs.twimg.com/media/Bo68PbPIYAA977u.jpg", 
        "http://pbs.twimg.com/media/Bo6802aIYAA8ibY.jpg", 
        "http://pbs.twimg.com/media/Bo69zrOIgAAzEXv.jpg", 
        "http://pbs.twimg.com/media/BpB0-XoCMAEtsiN.jpg", 
        "http://pbs.twimg.com/media/Bo-PuwwIgAEX2Cs.jpg", 
        "http://pbs.twimg.com/media/Bo_8ILbCAAAtqwI.jpg", 
        "http://pbs.twimg.com/media/BpB23SRCEAAv16P.jpg", 
        "http://pbs.twimg.com/media/Bo_3IpPCIAAG15l.jpg", 
        "http://pbs.twimg.com/media/Bo_8UhPIcAA1K7r.jpg", 
        "http://pbs.twimg.com/media/BpBOcyHIEAAEoQJ.jpg", 
        "http://pbs.twimg.com/media/Bo-roJ7CAAA68LM.jpg", 
        "http://pbs.twimg.com/media/BpBRhH-IMAAf0Bh.jpg", 
        "http://pbs.twimg.com/media/Bo6h8CCCEAA1ZYA.jpg", 
        "http://pbs.twimg.com/media/Bo2mzxlIcAAUFl7.jpg", 
        "http://pbs.twimg.com/media/BpB5wv_IMAAJROi.jpg", 
        "http://pbs.twimg.com/media/BpB5xkxIMAAibag.jpg", 
        "http://pbs.twimg.com/media/Bo_90LTCIAAi3ZB.jpg", 
        "http://pbs.twimg.com/media/Bo_7JLsCUAAoMAm.jpg", 
        "http://pbs.twimg.com/media/Bo_7J6uCYAAo0FW.jpg", 
        "http://pbs.twimg.com/media/Bo_7Mc8CUAA5dVu.jpg", 
        "http://pbs.twimg.com/media/Bo_8y9vCEAAkbg7.jpg", 
        "http://pbs.twimg.com/media/Bo_9CfbCcAAEwxs.jpg", 
        "http://pbs.twimg.com/media/Bo_GSRBCMAAUdlx.jpg", 
        "http://pbs.twimg.com/media/Bo__SXjCAAAWeB_.jpg", 
        "http://pbs.twimg.com/media/Bo__zOpCIAESne4.jpg", 
        "http://pbs.twimg.com/media/Bo__8PLCEAA6-wF.jpg", 
        "http://pbs.twimg.com/media/BpAA7YECAAAGlqY.jpg", 
        "http://pbs.twimg.com/media/Bo_xChZIEAArffv.jpg", 
        "http://pbs.twimg.com/media/Bo_-wrMCMAApvpj.jpg", 
        "http://pbs.twimg.com/media/Bo_9CfbCcAAEwxs.jpg", 
        "http://pbs.twimg.com/media/Bo_7Mc8CUAA5dVu.jpg", 
        "http://pbs.twimg.com/media/Bo_7Mc8CUAA5dVu.jpg", 
        "http://pbs.twimg.com/media/BpB8T7BIEAAC-5m.jpg", 
        "http://pbs.twimg.com/media/Bo_7Mc8CUAA5dVu.jpg", 
        "http://pbs.twimg.com/media/Bo_8RaOCQAAK3Cj.jpg", 
        "http://pbs.twimg.com/media/Bo_7yU7CMAAD4N6.jpg", 
        "http://pbs.twimg.com/media/BpB9cFnIEAAjXHY.jpg", 
        "http://pbs.twimg.com/media/BpB9fumIcAAFDsB.jpg", 
        "http://pbs.twimg.com/media/Bo_7nNpIUAANtj_.jpg", 
        "http://pbs.twimg.com/media/Bo_7NqvCEAAbijR.jpg", 
        "http://pbs.twimg.com/media/Bo7RCprIQAE24Xl.jpg", 
        "http://pbs.twimg.com/media/Bo7V9ilIcAAGD9L.jpg", 
        "http://pbs.twimg.com/media/Bo7qlq-IMAA2eNP.jpg", 
        "http://pbs.twimg.com/media/Bo7-2wHIIAAm7Dp.jpg", 
        "http://pbs.twimg.com/media/Bo7-2wHIIAAm7Dp.jpg", 
        "http://pbs.twimg.com/media/Bo6h8CCCEAA1ZYA.jpg", 
        "http://pbs.twimg.com/media/BpB-qDkIYAAH2LF.jpg", 
        "http://pbs.twimg.com/media/Bo_7ObqCMAARd9R.jpg", 
        "http://pbs.twimg.com/media/BpB_BNlIgAETUQz.jpg", 
        "http://pbs.twimg.com/media/Bo9CMVnIcAAWmG4.jpg", 
        "http://pbs.twimg.com/media/Bo_7yU7CMAAD4N6.jpg", 
        "http://pbs.twimg.com/media/BipCoytCUAAfb2O.jpg"
      ], 
      "name": "amornacopa"
    }, 
    {
      "img": [
        "http://pbs.twimg.com/media/Bo68ijzCEAA31LW.jpg", 
        "http://pbs.twimg.com/media/Bo_7Lj8CAAEx1XY.jpg", 
        "http://pbs.twimg.com/media/Bo6-Eh1IIAEsFgG.jpg", 
        "http://pbs.twimg.com/media/Bo6-UvFIcAALnFK.jpg", 
        "http://pbs.twimg.com/media/Bo_8UhPIcAA1K7r.jpg", 
        "http://pbs.twimg.com/media/Bo_G154CAAEYdF6.jpg", 
        "http://pbs.twimg.com/media/Bo68XF0IAAAVU6N.jpg", 
        "http://pbs.twimg.com/media/Bo68FPxIQAE5K9P.jpg", 
        "http://pbs.twimg.com/media/Bo68XF0IAAAVU6N.jpg", 
        "http://pbs.twimg.com/media/Bo69PV3IIAAv6zA.jpg", 
        "http://pbs.twimg.com/media/Bo69pL-CQAAL9BY.jpg", 
        "http://pbs.twimg.com/media/Bo_8RaOCQAAK3Cj.jpg", 
        "http://pbs.twimg.com/media/BpB1fdMIgAAAdfn.jpg", 
        "http://pbs.twimg.com/media/Bo9mn34IMAA7sZT.jpg", 
        "http://pbs.twimg.com/media/Bo9mn34IMAA7sZT.jpg", 
        "http://pbs.twimg.com/media/BopTdQzCMAAO18S.jpg", 
        "http://pbs.twimg.com/media/Bo9mn34IMAA7sZT.jpg", 
        "http://pbs.twimg.com/media/Bo_8UhPIcAA1K7r.jpg", 
        "http://pbs.twimg.com/media/BpADfu5IQAAWNUI.jpg", 
        "http://pbs.twimg.com/media/Bo_vubhIQAAfnkK.jpg", 
        "http://pbs.twimg.com/media/Bo_xChZIEAArffv.jpg", 
        "http://pbs.twimg.com/media/Bo_7Lj8CAAEx1XY.jpg", 
        "http://pbs.twimg.com/media/Bo_7Y4LCEAE34cR.jpg", 
        "http://pbs.twimg.com/media/Bo_3qBXCEAAe6xG.jpg", 
        "http://pbs.twimg.com/media/Bo_9SiPCIAAHS8t.jpg", 
        "http://pbs.twimg.com/media/Bo_9CfbCcAAEwxs.jpg", 
        "http://pbs.twimg.com/media/BpAAadTCAAAaGtx.jpg", 
        "http://pbs.twimg.com/media/BpAAoQhCYAAmtU_.jpg", 
        "http://pbs.twimg.com/media/Bo_9CfbCcAAEwxs.jpg", 
        "http://pbs.twimg.com/media/BpABczBCMAEDB9q.jpg", 
        "http://pbs.twimg.com/media/BoJz3tHIAAEwYLx.jpg", 
        "http://pbs.twimg.com/media/Bo_79h3CIAEnIPY.jpg", 
        "http://pbs.twimg.com/media/Bo_7KwCCMAAiBxj.jpg", 
        "http://pbs.twimg.com/media/Bo_EEPUCMAA7BJD.jpg", 
        "http://pbs.twimg.com/media/Bo_7Lj8CAAEx1XY.jpg", 
        "http://pbs.twimg.com/media/BpB8H_uIUAAkf2r.jpg", 
        "http://pbs.twimg.com/media/BpB9c97IgAAY5yX.jpg", 
        "http://pbs.twimg.com/media/Bo7RCprIQAE24Xl.jpg", 
        "http://pbs.twimg.com/media/BpB9rlKIMAACprg.jpg", 
        "http://pbs.twimg.com/media/Bo7-2wHIIAAm7Dp.jpg", 
        "http://pbs.twimg.com/media/Bo7-2wHIIAAm7Dp.jpg", 
        "http://pbs.twimg.com/media/BlXlWq9CUAAPyyl.jpg", 
        "http://pbs.twimg.com/media/BpB8H_uIUAAkf2r.jpg", 
        "http://pbs.twimg.com/media/Bo_7NqvCEAAbijR.jpg", 
        "http://pbs.twimg.com/media/BpB__0-IUAAjjVx.jpg", 
        "http://pbs.twimg.com/media/Bo-X1hdIcAAUVQ8.jpg", 
        "http://pbs.twimg.com/media/BpCAiPKIIAE0jK2.jpg"
      ], 
      "name": "pettorcedor"
    }
  ], 
  "countries": [
    {
      "country": "brasil", 
      "img": [
        "http://pbs.twimg.com/media/BpCCl0cIgAAI92c.jpg", 
        "http://pbs.twimg.com/media/BpCU-tHIUAA9qBA.jpg", 
        "http://pbs.twimg.com/media/BpCloufIEAAcXSb.jpg", 
        "http://pbs.twimg.com/media/BpCmCEcIUAA9Lpw.jpg"
      ]
    }, 
    {
      "country": "brazil", 
      "img": [
        "http://pbs.twimg.com/media/Bo68PbPIYAA977u.jpg", 
        "http://pbs.twimg.com/media/Bo69zrOIgAAzEXv.jpg", 
        "http://pbs.twimg.com/media/Bo6-Eh1IIAEsFgG.jpg", 
        "http://pbs.twimg.com/media/Bo_8UhPIcAA1K7r.jpg", 
        "http://pbs.twimg.com/media/Bo7-2wHIIAAm7Dp.jpg", 
        "http://pbs.twimg.com/media/Bo6783UIIAA8Lfd.jpg", 
        "http://pbs.twimg.com/media/Bo68XF0IAAAVU6N.jpg", 
        "http://pbs.twimg.com/media/Bo_7ObqCMAARd9R.jpg", 
        "http://pbs.twimg.com/media/BpB3pufIQAA3IPb.jpg", 
        "http://pbs.twimg.com/media/Bo_7Lj8CAAEx1XY.jpg", 
        "http://pbs.twimg.com/media/Bo_8g_VCYAA-gLq.jpg", 
        "http://pbs.twimg.com/media/Bo_9fgtCUAEfNj8.jpg", 
        "http://pbs.twimg.com/media/Bo_90LTCIAAi3ZB.jpg", 
        "http://pbs.twimg.com/media/Bo_-TLjCMAEVC0L.jpg", 
        "http://pbs.twimg.com/media/Bo_G154CAAEYdF6.jpg", 
        "http://pbs.twimg.com/media/Bo_7J6uCYAAo0FW.jpg", 
        "http://pbs.twimg.com/media/Bo_7NqvCEAAbijR.jpg", 
        "http://pbs.twimg.com/media/BpB8T7BIEAAC-5m.jpg", 
        "http://pbs.twimg.com/media/Bo_8g_VCYAA-gLq.jpg", 
        "http://pbs.twimg.com/media/Bo_8y9vCEAAkbg7.jpg", 
        "http://pbs.twimg.com/media/Bo_7JLsCUAAoMAm.jpg", 
        "http://pbs.twimg.com/media/Bo_7Lj8CAAEx1XY.jpg", 
        "http://pbs.twimg.com/media/BpB9UCGIcAAl2cM.jpg", 
        "http://pbs.twimg.com/media/BpB9XrPIAAAUsh8.jpg", 
        "http://pbs.twimg.com/media/Bo8aHf8IQAAmvvT.jpg", 
        "http://pbs.twimg.com/media/Bo_7nNpIUAANtj_.jpg", 
        "http://pbs.twimg.com/media/BpB9yHGIIAALbqI.jpg", 
        "http://pbs.twimg.com/media/Bo7qlq-IMAA2eNP.jpg", 
        "http://pbs.twimg.com/media/Bo7-2wHIIAAm7Dp.jpg", 
        "http://pbs.twimg.com/media/Bo7-2wHIIAAm7Dp.jpg", 
        "http://pbs.twimg.com/media/Bo7-2wHIIAAm7Dp.jpg", 
        "http://pbs.twimg.com/media/BpB_oqtIcAA1ZDM.jpg", 
        "http://pbs.twimg.com/media/BpB__0-IUAAjjVx.jpg", 
        "http://pbs.twimg.com/media/Bo-X1hdIcAAUVQ8.jpg", 
        "http://pbs.twimg.com/media/BipCoytCUAAfb2O.jpg"
      ]
    }, 
    {
      "country": "argentina", 
      "img": [
        "http://pbs.twimg.com/media/Bo68FPxIQAE5K9P.jpg", 
        "http://pbs.twimg.com/media/Bn6kWj3IMAAIWjI.jpg", 
        "http://pbs.twimg.com/media/Bo6-2FsIMAEtN0i.jpg", 
        "http://pbs.twimg.com/media/Bo698GYIIAAYZQn.jpg", 
        "http://pbs.twimg.com/media/Bo9mn34IMAA7sZT.jpg", 
        "http://pbs.twimg.com/media/Bo68PbPIYAA977u.jpg", 
        "http://pbs.twimg.com/media/Bo68sRuIAAAxpX5.jpg", 
        "http://pbs.twimg.com/media/Bo69aiHIUAA4fq2.jpg", 
        "http://pbs.twimg.com/media/Bo69zrOIgAAzEXv.jpg", 
        "http://pbs.twimg.com/media/BpB0-XoCMAEtsiN.jpg", 
        "http://pbs.twimg.com/media/Bo_7Lj8CAAEx1XY.jpg", 
        "http://pbs.twimg.com/media/Bo_8RaOCQAAK3Cj.jpg", 
        "http://pbs.twimg.com/media/Bo6-Mk4CAAEScLU.jpg", 
        "http://pbs.twimg.com/media/BpB23SRCEAAv16P.jpg", 
        "http://pbs.twimg.com/media/Bo_3IpPCIAAG15l.jpg", 
        "http://pbs.twimg.com/media/Bo_8UhPIcAA1K7r.jpg", 
        "http://pbs.twimg.com/media/Bo6h8CCCEAA1ZYA.jpg", 
        "http://pbs.twimg.com/media/BpB5vtQIEAAnzad.jpg", 
        "http://pbs.twimg.com/media/BpB5xkxIMAAibag.jpg", 
        "http://pbs.twimg.com/media/Bo9mn34IMAA7sZT.jpg", 
        "http://pbs.twimg.com/media/BoAUqNRIMAAkE2N.jpg", 
        "http://pbs.twimg.com/media/Bo_90LTCIAAi3ZB.jpg", 
        "http://pbs.twimg.com/media/Bo_7Mc8CUAA5dVu.jpg", 
        "http://pbs.twimg.com/media/Bo_7NqvCEAAbijR.jpg", 
        "http://pbs.twimg.com/media/Bo_7nNpIUAANtj_.jpg", 
        "http://pbs.twimg.com/media/Bo__zOpCIAESne4.jpg", 
        "http://pbs.twimg.com/media/BpAAoQhCYAAmtU_.jpg", 
        "http://pbs.twimg.com/media/Bo_7JLsCUAAoMAm.jpg", 
        "http://pbs.twimg.com/media/Bo6h8CCCEAA1ZYA.jpg", 
        "http://pbs.twimg.com/media/Bo_8RaOCQAAK3Cj.jpg", 
        "http://pbs.twimg.com/media/BpB9XB6IEAACYFz.jpg", 
        "http://pbs.twimg.com/media/Bo7RCprIQAE24Xl.jpg", 
        "http://pbs.twimg.com/media/Bo7RCprIQAE24Xl.jpg", 
        "http://pbs.twimg.com/media/BpB8H_uIUAAkf2r.jpg", 
        "http://pbs.twimg.com/media/Bo7-2wHIIAAm7Dp.jpg", 
        "http://pbs.twimg.com/media/Bo9CMVnIcAAWmG4.jpg", 
        "http://pbs.twimg.com/media/BipCoytCUAAfb2O.jpg", 
        "http://pbs.twimg.com/media/BpCAiPKIIAE0jK2.jpg"
      ]
    }, 
    {
      "country": "fran\u00e7a", 
      "img": [
        "http://pbs.twimg.com/media/Bo68XF0IAAAVU6N.jpg", 
        "http://pbs.twimg.com/media/Bo_7Lj8CAAEx1XY.jpg", 
        "http://pbs.twimg.com/media/Bo_G154CAAEYdF6.jpg", 
        "http://pbs.twimg.com/media/Bo_xChZIEAArffv.jpg", 
        "http://pbs.twimg.com/media/Bo68XF0IAAAVU6N.jpg", 
        "http://pbs.twimg.com/media/Bo69PV3IIAAv6zA.jpg", 
        "http://pbs.twimg.com/media/Bo6-Mk4CAAEScLU.jpg", 
        "http://pbs.twimg.com/media/Bo6-UvFIcAALnFK.jpg", 
        "http://pbs.twimg.com/media/Bo-PuwwIgAEX2Cs.jpg", 
        "http://pbs.twimg.com/media/Bo_7NqvCEAAbijR.jpg", 
        "http://pbs.twimg.com/media/BopTdQzCMAAO18S.jpg", 
        "http://pbs.twimg.com/media/Bo6h8CCCEAA1ZYA.jpg", 
        "http://pbs.twimg.com/media/BpB5wv_IMAAJROi.jpg", 
        "http://pbs.twimg.com/media/Bo_9CfbCcAAEwxs.jpg", 
        "http://pbs.twimg.com/media/Bo__SXjCAAAWeB_.jpg", 
        "http://pbs.twimg.com/media/Bo__8PLCEAA6-wF.jpg", 
        "http://pbs.twimg.com/media/Bo_xChZIEAArffv.jpg", 
        "http://pbs.twimg.com/media/BpABczBCMAEDB9q.jpg", 
        "http://pbs.twimg.com/media/Bo_9CfbCcAAEwxs.jpg", 
        "http://pbs.twimg.com/media/Bo_7KwCCMAAiBxj.jpg", 
        "http://pbs.twimg.com/media/Bo_79h3CIAEnIPY.jpg", 
        "http://pbs.twimg.com/media/Bo_7KwCCMAAiBxj.jpg", 
        "http://pbs.twimg.com/media/Bo_8g_VCYAA-gLq.jpg", 
        "http://pbs.twimg.com/media/Bo_7Lj8CAAEx1XY.jpg", 
        "http://pbs.twimg.com/media/Bo_7Mc8CUAA5dVu.jpg", 
        "http://pbs.twimg.com/media/BpB9fumIcAAFDsB.jpg", 
        "http://pbs.twimg.com/media/Bo_7Y4LCEAE34cR.jpg", 
        "http://pbs.twimg.com/media/Bo7RCprIQAE24Xl.jpg", 
        "http://pbs.twimg.com/media/Bo7V9ilIcAAGD9L.jpg", 
        "http://pbs.twimg.com/media/BpB_AxDIIAAEAbU.jpg"
      ]
    }, 
    {
      "country": "alemanha", 
      "img": [
        "http://pbs.twimg.com/media/Bo7-2wHIIAAm7Dp.jpg", 
        "http://pbs.twimg.com/media/Bo6-Mk4CAAEScLU.jpg", 
        "http://pbs.twimg.com/media/Bo6-UvFIcAALnFK.jpg", 
        "http://pbs.twimg.com/media/Bo9mn34IMAA7sZT.jpg", 
        "http://pbs.twimg.com/media/Bo68FPxIQAE5K9P.jpg", 
        "http://pbs.twimg.com/media/Bo68ijzCEAA31LW.jpg", 
        "http://pbs.twimg.com/media/Bo6802aIYAA8ibY.jpg", 
        "http://pbs.twimg.com/media/Bo6-Eh1IIAEsFgG.jpg", 
        "http://pbs.twimg.com/media/Bo_8UhPIcAA1K7r.jpg", 
        "http://pbs.twimg.com/media/Bo9mn34IMAA7sZT.jpg", 
        "http://pbs.twimg.com/media/Bo_90LTCIAAi3ZB.jpg", 
        "http://pbs.twimg.com/media/BpBOcyHIEAAEoQJ.jpg", 
        "http://pbs.twimg.com/media/BpBRhH-IMAAf0Bh.jpg", 
        "http://pbs.twimg.com/media/BpBsE_yIIAAIgej.jpg", 
        "http://pbs.twimg.com/media/BpB5vtrIUAAwxIr.jpg", 
        "http://pbs.twimg.com/media/BpB5wPBIUAA7iTd.jpg", 
        "http://pbs.twimg.com/media/Bo_7ObqCMAARd9R.jpg", 
        "http://pbs.twimg.com/media/Bo_7Y4LCEAE34cR.jpg", 
        "http://pbs.twimg.com/media/Bo_8ILbCAAAtqwI.jpg", 
        "http://pbs.twimg.com/media/Bo_9SiPCIAAHS8t.jpg", 
        "http://pbs.twimg.com/media/Bo_9CfbCcAAEwxs.jpg", 
        "http://pbs.twimg.com/media/Bo_GSRBCMAAUdlx.jpg", 
        "http://pbs.twimg.com/media/BpAARZCIUAI0PWC.jpg", 
        "http://pbs.twimg.com/media/BpAAadTCAAAaGtx.jpg", 
        "http://pbs.twimg.com/media/Bo_9CfbCcAAEwxs.jpg", 
        "http://pbs.twimg.com/media/Bowan6EIYAEiLjo.jpg", 
        "http://pbs.twimg.com/media/Bo_7JLsCUAAoMAm.jpg", 
        "http://pbs.twimg.com/media/BoJz3tHIAAEwYLx.jpg", 
        "http://pbs.twimg.com/media/Bo_7nNpIUAANtj_.jpg", 
        "http://pbs.twimg.com/media/Bo_7J6uCYAAo0FW.jpg", 
        "http://pbs.twimg.com/media/Bo_EEPUCMAA7BJD.jpg", 
        "http://pbs.twimg.com/media/Bo_7Mc8CUAA5dVu.jpg", 
        "http://pbs.twimg.com/media/BpB9XhkIAAEVNuy.jpg", 
        "http://pbs.twimg.com/media/BpB9hnCIEAA7yGN.jpg", 
        "http://pbs.twimg.com/media/Bo7-2wHIIAAm7Dp.jpg", 
        "http://pbs.twimg.com/media/BpB8H_uIUAAkf2r.jpg", 
        "http://pbs.twimg.com/media/Bo_7NqvCEAAbijR.jpg", 
        "http://pbs.twimg.com/media/BpB_BNlIgAETUQz.jpg"
      ]
    }, 
    {
      "country": "espanha", 
      "img": [
        "http://pbs.twimg.com/media/Bo_9fgtCUAEfNj8.jpg", 
        "http://pbs.twimg.com/media/Bo68sRuIAAAxpX5.jpg", 
        "http://pbs.twimg.com/media/Bo68ijzCEAA31LW.jpg", 
        "http://pbs.twimg.com/media/BpBzyTHIMAA5dcF.jpg", 
        "http://pbs.twimg.com/media/Bo6802aIYAA8ibY.jpg", 
        "http://pbs.twimg.com/media/Bo6-tYFIEAATgWy.jpg", 
        "http://pbs.twimg.com/media/Bo_G154CAAEYdF6.jpg", 
        "http://pbs.twimg.com/media/Bo9mn34IMAA7sZT.jpg", 
        "http://pbs.twimg.com/media/Bo_8ILbCAAAtqwI.jpg", 
        "http://pbs.twimg.com/media/Bo2mzxlIcAAUFl7.jpg", 
        "http://pbs.twimg.com/media/BpBsE_yIIAAIgej.jpg", 
        "http://pbs.twimg.com/media/BpADfu5IQAAWNUI.jpg", 
        "http://pbs.twimg.com/media/Bo_xChZIEAArffv.jpg", 
        "http://pbs.twimg.com/media/Bo_7JLsCUAAoMAm.jpg", 
        "http://pbs.twimg.com/media/Bo_7J6uCYAAo0FW.jpg", 
        "http://pbs.twimg.com/media/Bo_3qBXCEAAe6xG.jpg", 
        "http://pbs.twimg.com/media/Bo_79h3CIAEnIPY.jpg", 
        "http://pbs.twimg.com/media/Bo_8y9vCEAAkbg7.jpg", 
        "http://pbs.twimg.com/media/Bo_-wrMCMAApvpj.jpg", 
        "http://pbs.twimg.com/media/BpAA7YECAAAGlqY.jpg", 
        "http://pbs.twimg.com/media/Bo_7Mc8CUAA5dVu.jpg", 
        "http://pbs.twimg.com/media/Bo_7Lj8CAAEx1XY.jpg", 
        "http://pbs.twimg.com/media/BpB8H_uIUAAkf2r.jpg", 
        "http://pbs.twimg.com/media/Bo_7ObqCMAARd9R.jpg", 
        "http://pbs.twimg.com/media/Bo_7Y4LCEAE34cR.jpg", 
        "http://pbs.twimg.com/media/Bo_8RaOCQAAK3Cj.jpg", 
        "http://pbs.twimg.com/media/Bo_9CfbCcAAEwxs.jpg", 
        "http://pbs.twimg.com/media/BpB9FkPIIAArS0L.jpg", 
        "http://pbs.twimg.com/media/Bo_8ILbCAAAtqwI.jpg", 
        "http://pbs.twimg.com/media/BpB9XbIIIAA9nuP.jpg", 
        "http://pbs.twimg.com/media/Bo_7yU7CMAAD4N6.jpg", 
        "http://pbs.twimg.com/media/BpB9cFnIEAAjXHY.jpg", 
        "http://pbs.twimg.com/media/BpB9c97IgAAY5yX.jpg", 
        "http://pbs.twimg.com/media/BpB9rlKIMAACprg.jpg", 
        "http://pbs.twimg.com/media/Bo7-2wHIIAAm7Dp.jpg", 
        "http://pbs.twimg.com/media/Bo7-2wHIIAAm7Dp.jpg", 
        "http://pbs.twimg.com/media/Bo6h8CCCEAA1ZYA.jpg", 
        "http://pbs.twimg.com/media/BlXlWq9CUAAPyyl.jpg", 
        "http://pbs.twimg.com/media/BpB-ID5IYAAUmTo.jpg", 
        "http://pbs.twimg.com/media/BpB-qDkIYAAH2LF.jpg", 
        "http://pbs.twimg.com/media/Bo4z88FCcAEjYOc.jpg", 
        "http://pbs.twimg.com/media/Bo_7yU7CMAAD4N6.jpg"
      ]
    }, 
    {
      "country": "italia", 
      "img": [
        "http://pbs.twimg.com/media/Bo68XF0IAAAVU6N.jpg", 
        "http://pbs.twimg.com/media/Bo6783UIIAA8Lfd.jpg", 
        "http://pbs.twimg.com/media/Bo68ijzCEAA31LW.jpg", 
        "http://pbs.twimg.com/media/Bo69PV3IIAAv6zA.jpg", 
        "http://pbs.twimg.com/media/Bo69aiHIUAA4fq2.jpg", 
        "http://pbs.twimg.com/media/Bo698GYIIAAYZQn.jpg", 
        "http://pbs.twimg.com/media/Bo69pL-CQAAL9BY.jpg", 
        "http://pbs.twimg.com/media/Bo7-2wHIIAAm7Dp.jpg", 
        "http://pbs.twimg.com/media/BpB1fdMIgAAAdfn.jpg", 
        "http://pbs.twimg.com/media/Bo9mn34IMAA7sZT.jpg", 
        "http://pbs.twimg.com/media/Bo_8UhPIcAA1K7r.jpg", 
        "http://pbs.twimg.com/media/Bo-roJ7CAAA68LM.jpg", 
        "http://pbs.twimg.com/media/Bo_8UhPIcAA1K7r.jpg", 
        "http://pbs.twimg.com/media/Bo_9CfbCcAAEwxs.jpg", 
        "http://pbs.twimg.com/media/Bo_vubhIQAAfnkK.jpg", 
        "http://pbs.twimg.com/media/Bo_7KwCCMAAiBxj.jpg", 
        "http://pbs.twimg.com/media/Bo_7yU7CMAAD4N6.jpg", 
        "http://pbs.twimg.com/media/Bo_8RaOCQAAK3Cj.jpg", 
        "http://pbs.twimg.com/media/Bo_-wrMCMAApvpj.jpg", 
        "http://pbs.twimg.com/media/Bo_7Mc8CUAA5dVu.jpg", 
        "http://pbs.twimg.com/media/Bo_7yU7CMAAD4N6.jpg", 
        "http://pbs.twimg.com/media/BpB8T7BIEAAC-5m.jpg", 
        "http://pbs.twimg.com/media/Bo_8ILbCAAAtqwI.jpg", 
        "http://pbs.twimg.com/media/Bo_7Mc8CUAA5dVu.jpg", 
        "http://pbs.twimg.com/media/BpB8H_uIUAAkf2r.jpg", 
        "http://pbs.twimg.com/media/Bo_7NqvCEAAbijR.jpg", 
        "http://pbs.twimg.com/media/BlBTr3-IgAATdgR.jpg", 
        "http://pbs.twimg.com/media/Bo_7ObqCMAARd9R.jpg", 
        "http://pbs.twimg.com/media/BipCoytCUAAfb2O.jpg"
      ]
    }
  ]
};
/*var rankingsDefault = {
				countries: [{country: "Argentina", img: ["css/img/argentina.jpg",
													  "css/img/argentina.jpg",
													  "css/img/argentina.jpg",
													  "css/img/argentina.jpg",
													  "css/img/argentina.jpg",
													  "css/img/argentina.jpg",
													  "css/img/argentina.jpg",
													  "css/img/argentina.jpg",
													  "css/img/argentina.jpg",
													  "css/img/argentina.jpg",
													  "css/img/argentina.jpg",
													  "css/img/argentina.jpg",
													  "css/img/argentina.jpg"]},
						 {country: "Brazil", img: ["css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg"]},
			              {country: "Espanha", img: ["css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg"]},
						  {country: "Chile", img: ["css/img/france.jpg",
													  "css/img/france.jpg",
													  "css/img/france.jpg",
													  "css/img/france.jpg",
													  "css/img/france.jpg",
													  "css/img/france.jpg",
													  "css/img/france.jpg",
													  "css/img/france.jpg",
													  "css/img/france.jpg",
													  "css/img/france.jpg",
													  "css/img/france.jpg",
													  "css/img/france.jpg",
													  "css/img/france.jpg"]}
		        ],
				challenges: [{name: "Desafio 1", img: ["css/img/france.jpg",
													  "css/img/france.jpg",
													  "css/img/france.jpg",
													  "css/img/france.jpg",
													  "css/img/france.jpg",
													  "css/img/france.jpg",
													  "css/img/france.jpg",
													  "css/img/france.jpg",
													  "css/img/france.jpg",
													  "css/img/france.jpg",
													  "css/img/france.jpg",
													  "css/img/france.jpg",
													  "css/img/france.jpg"]},
							{name: "Desafio 2", img: ["css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg",
													  "css/img/espanha.jpg"]},
							{name: "Desafio 3", img: ["css/img/argentina.jpg",
													  "css/img/argentina.jpg",
													  "css/img/argentina.jpg",
													  "css/img/argentina.jpg",
													  "css/img/argentina.jpg",
													  "css/img/argentina.jpg",
													  "css/img/argentina.jpg",
													  "css/img/argentina.jpg",
													  "css/img/argentina.jpg",
													  "css/img/argentina.jpg",
													  "css/img/argentina.jpg",
													  "css/img/argentina.jpg",
													  "css/img/argentina.jpg"]},						  
					 	]
			};*/