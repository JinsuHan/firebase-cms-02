
var pcategory_id;

$(document).ready(function() {


  var addr = location.href.split("/").pop().split("?");
  pcategory_id = addr[1].split("=").pop();

  var categoryRef = db.ref('/product_category/'+pcategory_id);
  categoryRef.once('value').then(function(data){
    $("#categoryTitle").text(data.val().title);
    $("#categorySummary").text(data.val().summary);
  });

  getListData(pcategory_id);

});

$(document).on("click","#categoryList > div", function(e){
  var target_id = e.target.id ? e.target.id : e.target.parentNode.id;

  if(pcategory_id && target_id){
    location.href = '/another/pgroup.html'+"?pcid="+pcategory_id+"&pgid="+target_id;
  }
});

//리스트 데이터 가져오기
function getListData(target){

  var counter = 0;
  var listRef= db.ref('/product_category/'+target+"/product_group");

  listRef.on('child_added', function(data){

      if(!data.val()){$("#loadingData").hide(); return null;}
      var result = viewImgs(data.val().thumb);
      var temp = document.createElement('div');
      var posts = document.getElementById('categoryList');
      var title = "<div class='groupTitle'>"+data.val().title+"</div>"

      temp.id = data.val().product_group_id ;
      temp.innerHTML = result + title;

      posts.appendChild(temp);
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
        imgViewer += '<img class="img previewImg img-thumbnail" src='+(url+img[i])+'>';
      }
    }
  }else{
    imgViewer += '<div class="doc previewImg img-thumbnail">이미지 없음</div>';
  }

  return imgViewer;
}
