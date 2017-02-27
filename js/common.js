
var db = firebase.database();


$(document).ready(function() {

  $("#loadingData").show();

  getDropdownList("dropdown-category");

  var companyInfo = db.ref('/etc/info');
  companyInfo.once('value').then(function(data){
    if(data.val() == null){
      db.ref('etc/info').set({
        adminPw : "0000"
      });
    }else{
      $("#footer>.footerText01").text(new Date().getFullYear() + " " + data.val().company_title_eng);
      $("#footer>.footerText02").text("Phone "+data.val().phone +" / Fax "+data.val().fax);
      $(".navbar-header>.navbar-brand").text(data.val().company_title);
    }

  });

});

$(document).on("click",".returnHome", function(){
  location.href = '/another/';
});

$(document).on("click","#setting", function(){
  accessAdmin();
});
$(document).on("keypress","#adminPw", function(e){
  if(e.keyCode == 13){
    accessAdmin();
  }
});

function accessAdmin(){

  var input = $("#adminPw").val();

  var ref = db.ref('/etc/info');
  ref.once('value').then(function(data){
    if(input == data.val().adminPw){
      location.href = '/another/setting.html';
    }else{
      console.log("비밀번호 오류");
    }
  });
}


//리스트 데이터 가져오기
function getDropdownList(target){

  var listRef= db.ref('/product_category');

  listRef.on('child_added', function(data){
    var count = 0;
    for(var i in data.val().product_group){
      count++;
    }
    if(!data.val()){$("#loadingData").hide(); return null;}
    var li = document.createElement('li');

    li.id = data.key;
    li.innerHTML = "<a href='/another/pcategory.html?product_category_id="+data.val().product_category_id+"'>"+data.val().title+"<label> "+count+" 그룹</label></a>";

    $("#"+target).append(li);

    $("#loadingData").hide();
  });
}
