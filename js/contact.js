

$(document).ready(function() {

  getListData("고객센터");

});


function getListData(target){

  var counter = 0;
  var listRef= db.ref('/post');
  var resultData = new Array();

  // listRef.on('child_added', function(data){ //on 은 for 형식
  listRef.once('value').then(function(data){
    for(var i in data.val()){
      resultData.push(data.val()[i]);
    }
  }).then(function(){
    for(var i in resultData){
      if(resultData[i].section == target){

        var tab = '<li role="presentation">'+
        '<a href="#tab'+i+'" aria-controls="tab'+i+'" role="tab" data-toggle="tab">'+resultData[i].title+'</a>'+
        '</li>';
        $(".nav-tabs").append(tab);

        var tabContent = '<div role="tabpanel" class="tab-pane" id="tab'+i+'">'
        +'<div class="infoEtc">'+resultData[i].summary+'</div>'
        +'<div class="infoContent"><div class="infoImg">'+viewImgs(resultData[i].image)+'</div>'
        +'<div id="postContent'+i+'" class="infoBody"><textarea readonly class="form-control"></textarea></div></div>'
        +'</div>';
        $(".tab-content").append(tabContent);
        $("#postContent"+i+">textarea").val(resultData[i].body);

      }
    }

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
        imgViewer += '<img id="'+portfolio_id+'" class="img" src='+(url+img[i])+'>';
      }
    }
  }else{
    imgViewer += '<div id="'+portfolio_id+'"  class="doc">이미지 없음</div>';
  }

  return imgViewer;
}
