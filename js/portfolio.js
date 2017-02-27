

$(document).ready(function() {

  getListData();


  $(document).on("click", ".breadcrumb>li", function(e){
    var offset = $("." + e.target.id).offset();
    $('#portfolioList').animate({scrollTop : offset.top - 90}, 400);
  });

});


function getListData(target){

  var counter = 0;
  var listRef= db.ref('/product_category');
  var resultData = new Array();

  // listRef.on('child_added', function(data){ //on 은 for 형식
  listRef.once('value').then(function(data){
    if(!data.val()){$("#loadingData").hide(); return null;} // 결과 없음
    var category = data.val();
    for(var key in category){
      if(category[key].product_group){
        var group = category[key].product_group;
        for(var i in group){
          if(group[i].product){
            var product = group[i].product;
            for(var j in product){
              if(product[j].portfolio){
                //필요한 값, 정리해서 입력
                resultData.push({
                  "category": key,
                  "group": i,
                  "product": j,
                  "portfolio": product[j].portfolio
                });
              }
            }
          }
        }
      }
    }
  }).then(function(){
    for(var i in resultData){

      if($("#portfolioList > ."+resultData[i].portfolio.city).length == 0){
        $("#portfolioList").append("<div class="+resultData[i].portfolio.city+">"
        +"<div class='resultTitle'>"+resultData[i].portfolio.city+"</div><div class='resultContent'></div>"
        +"</div>");


        // scrollPosition.push($("."+resultData[i].portfolio.city).offset().top);

        $("#center>.breadcrumb").append("<li id="+resultData[i].portfolio.city+">"+resultData[i].portfolio.city+"</li>");
      }

      $("."+resultData[i].portfolio.city+"> .resultContent").append(viewImgs(resultData[i].portfolio.image, resultData[i].portfolio.portfolio_id));



    }

    $(document).on("click","#center img", function(e){
      for(var i in resultData){
        if(resultData[i].portfolio.portfolio_id == e.target.id){
          $(".modal-title").text(resultData[i].portfolio.title);
          var bodyResult = '<div class="prevItem"></div>' +
            viewImgs(resultData[i].portfolio.image) +
            '<div class="nextItem"></div>';

          $(".modal-body").html(bodyResult);
          $("#portfolio_city").text("도시 : "+resultData[i].portfolio.city);
          $("#portfolio_extra").text("기타 : "+resultData[i].portfolio.extra);
        }
      }
    });
    $("#loadingData").hide();
  });
}

function viewImgs(imgUrl, portfolio_id){
  var url = "http://s3.ap-northeast-2.amazonaws.com/js-example-bucket/img-file/"
  var imgViewer = "";
  if(imgUrl != ""){
    var img =  imgUrl.split('|');
    for(var i = 0 ; i < img.length - 1; i++){
      var fileType = img[i].split('.').pop().toLowerCase();
       if(fileType == "jpg" || fileType == "png" || fileType == "gif" || fileType == "bmp" || fileType == "jpeg"){
        imgViewer += '<img id="'+portfolio_id+'" class="img" data-toggle="modal" data-target="#modal" src='+(url+img[i])+'>';
      }
    }
  }else{
    imgViewer += '<div id="'+portfolio_id+'" data-toggle="modal" data-target="#modal" class="doc">이미지 없음</div>';
  }

  return imgViewer;
}
