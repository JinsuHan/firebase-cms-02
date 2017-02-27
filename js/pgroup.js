
$("#centerWrap").hide();

$(document).ready(function() {

  var addr = location.href.split("/").pop().split("?");
  var category_id = addr[1].split("&")[0].split("=")[1];
  var group_id = addr[1].split("&")[1].split("=")[1];

  var groupRef = db.ref('/product_category/'+category_id+'/product_group/'+group_id);
  var tempProductList = new Array();
  groupRef.once('value').then(function(data){
    $("#groupTitle").text(data.val().title);
    $("#groupSummary").text(data.val().summary);
    $("#groupExtra").text(data.val().extra);
    tempProductList = data.val().product;
  }).then(function(){
    var resultKey;
    var tempId = 0;
    for(var i in tempProductList){
      if(tempId < tempProductList[i].product_id.split("_")[1]){
        tempId = tempProductList[i].product_id.split("_")[1];
        resultKey = tempProductList[i].product_id;
      }
    }

    importListData(resultKey, category_id, group_id);

  });


  getListData(category_id, group_id);

  $(document).on("click","#right > li", function(e){
    var target_id = e.target.id ? e.target.id : e.target.parentNode.id;

    importListData(target_id, category_id, group_id);
  });

});


function importListData(key, category, group){
    $("#centerWrap").show();
  var ref = db.ref("/product_category/"+category+"/product_group/"+group+"/product/"+key);
  ref.once('value').then(function(data){
    $("#imageArea").html(viewImgs(data.val().image));

    $("#product_title").text(data.val().title);
    $("#product_summary").text(data.val().summary);


    if(data.val().portfolio){
      $("#portfolio_img").html(viewImgs(data.val().portfolio.image)).show();

      $(".modal-title").text(data.val().portfolio.title);
      $(".modal-body").html(viewImgs(data.val().portfolio.image));
      $("#portfolio_city").text("도시 : "+data.val().portfolio.city);
      $("#portfolio_extra").text("기타 : "+data.val().portfolio.extra);
    }else{
      $("#portfolio > label").text("");
      $("#portfolio_img").hide();
    }
  });
}

//리스트 생성
function getListData(category, group){

  var listRef= db.ref('/product_category/'+category+"/product_group/"+group+"/product");

  listRef.on('child_added', function(data){
    if(!data.val()){$("#loadingData").hide(); return null;}
    var li = document.createElement('li');

    li.id = data.key;
    li.innerHTML =  viewImgs(data.val().image);
    // li.innerHTML = "<div >"+data.val().title+"</div>";

    $("#right").append(li);

    $("#loadingData").hide();
  });
}

function viewImgs(imgUrl){
  var url = "http://s3.ap-northeast-2.amazonaws.com/js-example-bucket/img-file/"
  var imgViewer = "";
  if(imgUrl != ""){
    var img =  imgUrl.split('|');
    for(var i = 0 ; i < img.length - 1; i++){
      var fileType = img[i].split('.').pop().toLowerCase();
       if(fileType == "jpg" || fileType == "png" || fileType == "gif" || fileType == "bmp" || fileType == "jpeg"){
        imgViewer += '<img class="img" src='+(url+img[i])+'>';
      }
    }
  }else{
    imgViewer += '<div class="doc">이미지 없음</div>';
  }

  return imgViewer;
}
