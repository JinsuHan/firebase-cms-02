


$(document).ready(function() {

  $("#right").hide();

  $("#dialog").dialog();


  getListData("product_category");

});

$(document).on("click",".tab",function(e){
  var target = e.target.id;
  $("#sidebar_list_area_admin").empty();
  $("#sideInfo").show();
  $("#right").hide();

  $(".tab").removeClass("selected");
  e.target.className += " selected";


  if(target == "tab-category"){
    getListData("product_category");
  }else if(target == "tab-group"){
    getListData("product_group");
  }else if(target == "tab-product"){
    getListData("product");
  }else if(target == "tab-portfolio"){
    getListData("portfolio");
  }else if(target == "tab-post"){
    getListData("post");
  }else if(target == "tab-info"){
    $("#sideInfo").hide();
    $("#right").show();
    $("#admin-category").hide();
    $("#admin-group").hide();
    $("#admin-product").hide();
    $("#admin-portfolio").hide();
    $("#admin-post").hide();
    $("#admin-info").show();

    $("#targetName").text("기타 정보");
    $(".addBtn").hide();
    $(".updateBtn").show();
    $(".deleteBtn").hide();
    $("#sideInfo > #newItem").attr("name", "info");


    var ref = db.ref('/etc/info');
    ref.once('value').then(function(data){
      $("#info_name").val(data.val().company_title);
      $("#info_eng_name").val(data.val().company_title_eng);
      $("#info_phone").val(data.val().phone);
      $("#info_cellphone").val(data.val().cellphone);
      $("#info_email").val(data.val().email);
      $("#info_fax").val(data.val().fax);
      $("#info_pw").val(data.val().adminPw);
    });
  }
});

$(document).on("click","#newItem",function(e){
  var target = $("#newItem").attr("name");
  $("#right").show();

  $("#admin-category").hide();
  $("#admin-group").hide();
  $("#admin-product").hide();
  $("#admin-portfolio").hide();
  $("#admin-post").hide();
  $("#admin-info").hide();

  $("#targetId").val("");
  $("#targetCategoryId").val("");
  $("#targetGroupId").val("");
  $("#targetProductId").val("");

  $(".addBtn").show();
  $(".updateBtn").hide();
  $(".deleteBtn").hide();

  if(target == "product_category"){
    $("#admin-category").show();
    $("#targetName").text("신규 카테고리");

    $("#category_title").val("");
    $("#category_summary").val("");

  }else if(target == "product_group"){
    $("#admin-group").show();
    $("#targetName").text("신규 그룹");

    $("#group_title").val("");
    $("#group_category_id").val("");
    $("#group_summary").val("");
    $("#group_priority").val("");
    $("#group_extra").val("");
    $("#group_thumb").val("");
    $("#group_existImage").text("");

    addOptionMenu("category");
  }else if(target == "product"){
    $("#admin-product").show();
    $("#targetName").text("신규 제품");

    $("#product_title").val("");
    $("#product_portfolio").val("");
    $("#product_group_id").val("");
    $("#product_summary").val("");
    $("#product_body").val("");
    $("#product_publish").val("");
    $("#product_new").val("");
    $("#product_image").val("");
    $("#product_existImage").text("");

    addOptionMenu("group");

  }else if(target == "portfolio"){
    $("#admin-portfolio").show();
    $("#targetName").text("신규 포트폴리오");

    $("#portfolio_title").val("");
    $("#portfolio_city").val("");
    $("#portfolio_extra").val("");
    $("#portfolio_product_id").val("");
    $("#portfolio_image").val("");
    $("#portfolio_existImage").text("");

    addOptionMenu("product");
  }else if(target == "post"){
    $("#admin-post").show();
    $("#targetName").text("신규 글");

    $("#post_title").val("");
    $("#post_body").val("");
    $("#post_section").val("");
    $("#post_summary").val("");
    $("#post_image").val("");
    $("#post_existImage").text("");

  }
});

$(document).on("click",".listItem", function(e){
  var target_id = e.target.parentNode.id;
  var target = target_id.substr(0, target_id.length-14);

  var dataDiv = $("#"+e.target.parentNode.id+">div");

  var category = dataDiv.attr("data-category");
  var group = dataDiv.attr("data-group");
  var product = dataDiv.attr("data-product");

  $("#targetName").text(e.target.innerText).attr("name",target);

  $("#targetId").val(target_id);
  $("#targetCategoryId").val(category);
  $("#targetGroupId").val(group);
  $("#targetProductId").val(product);

  $("#right").show();

  $("#admin-category").hide();
  $("#admin-group").hide();
  $("#admin-product").hide();
  $("#admin-portfolio").hide();
  $("#admin-post").hide();
  $("#admin-info").hide();

  $(".addBtn").hide();
  $(".updateBtn").show();
  $(".deleteBtn").show();

  if(target == "product_category"){
    $("#admin-category").show();
    importListData("/product_category/"+category);
  }else if(target == "product_group"){
    $("#admin-group").show();
    addOptionMenu("category");
    importListData("/product_category/"+category+"/product_group/"+group);
  }else if(target == "product"){
    $("#admin-product").show();
    addOptionMenu("group");
    importListData("/product_category/"+category+"/product_group/"+group+"/product/"+product);
  }else if(target == "portfolio"){
    $("#admin-portfolio").show();
    addOptionMenu("product");
    importListData("/product_category/"+category+"/product_group/"+group+"/product/"+product+"/portfolio");
  }else if(target == "post"){
    $("#admin-post").show();
    importListData("/post/"+ target_id);
  }else if(target == "info"){
    $("#admin-info").show();
  }
});

$(document).on("click",".addBtn",function(e){
  var target = $("#sideInfo > #newItem").attr("name");

  if(target == "product_category"){
    uploadCategory();
  }else if(target == "product_group"){
    uploadProductGroup();
    addOptionMenu("category");
  }else if(target == "product"){
    uploadProduct();
    addOptionMenu("group");
  }else if(target == "portfolio"){
    uploadPortfolio();
    addOptionMenu("product");
  }else if(target == "post"){
    uploadPost();
  }

});

$(document).on("click",".updateBtn",function(e){
  var target = $("#sideInfo > #newItem").attr("name");
  var key = $("#targetId").val();

  if(target == "product_category"){
    uploadCategory(key);
  }else if(target == "product_group"){
    uploadProductGroup(key);
  }else if(target == "product"){
    uploadProduct($("#targetCategoryId").val(), key);
  }else if(target == "portfolio"){
    uploadPortfolio(key);
  }else if(target == "post"){
    uploadPost(key);
  }else if(target == "info"){
    uploadInfo();
  }


});

$(document).on("click",".deleteBtn",function(e){
  var target = $("#sideInfo > #newItem").attr("name");
  var root = "";
  var img;

  if(target == "product_category"){
    root = "/product_category/" + $("#targetId").val();

  }else if(target == "product_group"){
    root =
    "/product_category/" + $("#targetCategoryId").val() +
    "/product_group/" + $("#targetId").val();
    img = $("#group_existImage").text();

  }else if(target == "product"){
    root =
    "/product_category/" + $("#targetCategoryId").val() +
    "/product_group/" + $("#targetGroupId").val() +
    "/product/" + $("#targetId").val();
    img = $("#product_existImage").text();

  }else if(target == "portfolio"){
    root =
  "/product_category/" + $("#targetCategoryId").val() +
  "/product_group/" + $("#targetGroupId").val() +
  "/product/" + $("#targetProductId").val() +
  "/portfolio";
  img = $("#portfolio_existImage").text();

  }else if(target == "post"){
    root = "/post/" + $("#targetId").val();
    img = $("#post_existImage").text();
  }

  deleteItem(root, img);
  $("#sidebar_list_area_admin").empty();
  getListData(target);
});

function uploadInfo(){

  var companyName = $("#info_name").val();
  var companyEngName = $("#info_eng_name").val();
  var phone = $("#info_phone").val();
  var cellphone = $("#info_cellphone").val();
  var email = $("#info_email").val();
  var fax = $("#info_fax").val();
  var adminPw = $("#info_pw").val();

  if(!adminPw){return null;}

  var id = "info";
  db.ref('etc/info').update({
    company_title: companyName,
    company_title_eng: companyEngName,
    etc_id: id,
    phone: phone,
    cellphone: cellphone,
    email: email,
    fax: fax,
    adminPw : adminPw
  });

}

function uploadPost(key){
  var postTitle = $("#post_title").val();
  var postBody = $("#post_body").val();

  var section =  $("#post_section").val();
  var summary =  $("#post_summary").val();

  if(!post_title){return null;}

  var fileListArray = [];
  var uploadFileName = "";

  if($("#post_image").get(0).files[0]){
    //업로드를 원하는 파일이 있는 경우
    fileListArray.push($("#post_image").get(0).files[0]);
    if(fileListArray[0]){
      uploadFileName = awsS3FileUpload(fileListArray);
      if($("#post_existImage").text()){
        awsS3FileDelete($("#post_existImage").text() + "|");
      }
    }
  }else{
    //없는 경우
    if($("#post_existImage").text()){
      // 이 전에 업로드한 이미지가 있는 경우
      uploadFileName = $("#post_existImage").text() + "|";
    }
  }


  if(key){
    db.ref('post/'+ key).update({
      title: postTitle,
      body: postBody,
      section: section,
      image: uploadFileName,
      summary: summary
    });
  }else{
    var id = "post_" + Date.now();
    db.ref("post/"+ id).set({
      post_id: id,
      title: postTitle,
      body: postBody,
      section: section,
      image: uploadFileName,
      summary: summary
    });
  }
  $("#targetName").text(postTitle);
  $("#sidebar_list_area_admin").empty();
  getListData("post");

}

function uploadCategory(key){


  var title = $("#category_title").val();
  var summary = $("#category_summary").val();

  if(!title){return null;}

  if(key){
    db.ref('product_category/' + key).update({
      title: title,
      summary: summary
    });
  }else{
    var id = "product_category_" + Date.now();
    db.ref('product_category/' + id).set({
      product_category_id: id,
      title: title,
      summary: summary
    });
  }

  $("#targetName").text(title);
  $("#sidebar_list_area_admin").empty();
  getListData("product_category");
}
function uploadProductGroup(key){

  var title =  $("#group_title").val();
  var category_id =  $("#group_category_id").val();
  var summary =  $("#group_summary").val();
  var priority =  $("#group_priority").val();
  var extra =  $("#group_extra").val();

  if(!title){return null;}
  if(!category_id){return null;}
  if(!priority){priority = 0;}

  var fileListArray = [];
  var uploadFileName = "";

  if($("#group_thumb").get(0).files[0]){
    //업로드를 원하는 파일이 있는 경우
    fileListArray.push($("#group_thumb").get(0).files[0]);
    if(fileListArray[0]){
      uploadFileName = awsS3FileUpload(fileListArray);
      if($("#group_existImage").text()){
        awsS3FileDelete($("#group_existImage").text() + "|");
      }
    }
  }else{
    //없는 경우
    if($("#group_existImage").text()){
      // 이 전에 업로드한 이미지가 있는 경우
      uploadFileName = $("#group_existImage").text() + "|";
    }
  }


  if(key){
    db.ref('product_category/'+category_id+"/product_group/" + key).update({
      product_category_id : category_id,
      title: title,
      summary: summary,
      thumb: uploadFileName,
      priority: priority,
      extra: extra
    });
  }else{
    var id = "product_group_" + Date.now();
    db.ref('product_category/'+category_id+"/product_group/"+ id).set({
      product_group_id: id,
      product_category_id : category_id,
      title: title,
      summary: summary,
      thumb: uploadFileName,
      priority: priority,
      extra: extra
    });

  }
  $("#targetName").text(title);
  $("#sidebar_list_area_admin").empty();
  getListData("product_group");

}
function uploadProduct(category, key){

  var title =  $("#product_title").val();
  var portfolio_id =  $("#product_portfolio").val();
  var product_group_id =  $("#product_group_id").val();
  var summary =  $("#product_summary").val();
  var body =  $("#product_body").val();
  var publish =  $("#product_publish").val();
  var product_new =  $("#product_new").val();


  var root = "/product_category/" + category + "/product_group/"+ product_group_id + "/product/";
  if(!title){return null;}
  if(!product_group_id){return null;}

  var fileListArray = [];
  var uploadFileName = "";

  if($("#product_image").get(0).files[0]){
    //업로드를 원하는 파일이 있는 경우
    fileListArray.push($("#product_image").get(0).files[0]);
    if(fileListArray[0]){
      uploadFileName = awsS3FileUpload(fileListArray);
      if($("#product_existImage").text()){
        awsS3FileDelete($("#product_existImage").text() + "|");
      }
    }
  }else{
    //없는 경우
    if($("#product_existImage").text()){
      // 이 전에 업로드한 이미지가 있는 경우
      uploadFileName = $("#product_existImage").text() + "|";
    }
  }



  if(key){
    db.ref(root + key).update({
      title: title,
      portfolio_id: portfolio_id,
      product_group_id: product_group_id,
      summary: summary,
      body: body,
      image: uploadFileName,
      publish: publish,
      new: product_new
    });

    $("#sidebar_list_area_admin").empty();
    getListData("product");
  }else{
    var id = "product_" + Date.now();
    var ref = db.ref('/product_category');
    ref.once('value').then(function(data){
      for(var category in data.val()){
        for(var i in data.val()[category].product_group){
          if(product_group_id == i){
          db.ref('product_category/'+category+"/product_group/"+ product_group_id+"/product/" + id).set({
            product_id : id,
            title: title,
            portfolio_id: portfolio_id,
            product_group_id: product_group_id,
            summary: summary,
            body: body,
            image: uploadFileName,
            publish: publish,
            new: product_new
          });
          }
        }
      }
    }).then(function(){
      $("#sidebar_list_area_admin").empty();
      getListData("product");
    });
  }
  $("#targetName").text(title);

}
function uploadPortfolio(key){

  var title =  $("#portfolio_title").val();
  var city =  $("#portfolio_city").val();
  var extra =  $("#portfolio_extra").val();
  var product_id =  $("#portfolio_product_id").val();

  var category_id = $("#targetCategoryId").val();
  var group_id = $("#targetGroupId").val();

  if(!title){return null;}

  var fileListArray = [];
  var uploadFileName = "";

  if($("#portfolio_image").get(0).files[0]){
    //업로드를 원하는 파일이 있는 경우
    fileListArray.push($("#portfolio_image").get(0).files[0]);
    if(fileListArray[0]){
      uploadFileName = awsS3FileUpload(fileListArray);
      if($("#portfolio_existImage").text()){
        awsS3FileDelete($("#portfolio_existImage").text() + "|");
      }
    }
  }else{
    //없는 경우
    if($("#portfolio_existImage").text()){
      // 이 전에 업로드한 이미지가 있는 경우
      uploadFileName = $("#portfolio_existImage").text() + "|";
    }
  }

  if(key){
    db.ref("/product_category/" + category_id + "/product_group/" + group_id + "/product/" + product_id + "/portfolio").update({
      title: title,
      city: city,
      image: uploadFileName,
      extra: extra,
      product_id: product_id
    });
    $("#sidebar_list_area_admin").empty();
    getListData("portfolio");
  }else{
    var id = "portfolio_" + Date.now();
    var ref = db.ref('/product_category');
    ref.once('value').then(function(data){
      for(var category in data.val()){
        for(var group in data.val()[category].product_group){
          for(var product in data.val()[category].product_group[group].product){
            if(product_id == product){
              db.ref('product_category/'+category+"/product_group/"+ group+"/product/" + product_id+"/portfolio").set({
                portfolio_id : id,
                title: title,
                city: city,
                image: uploadFileName,
                extra: extra,
                product_id: product_id
              });
            }
          }
        }
      }
    }).then(function(){
      $("#sidebar_list_area_admin").empty();
      getListData("portfolio");
    });
  }
  $("#targetName").text(title);
}


//리스트 데이터 가져오기
function getListData(target){

  $("#sideInfo > #newItem").attr("name",target.split("-"[1]));

  var counter = 0;
  var dbref;
  if(target == "post"){
    dbref = '/post';
  }else{
    dbref = '/product_category';
  }
  var listRef= db.ref(dbref);
  var root = "";

  listRef.on('child_added', function(data){

    if(target == "product_category"){
      var category = data.key;
      createLi(data.key, data.val(), category);

    }else if(target == "product_group"){
      for(var i in data.val().product_group){
        var category = data.key;
        var group = i;
        root = "/product_category/"+data.key+"/product_group/"+i;
        createLi(i, data.val().product_group[i], category, group);
      }

    }else if(target == "product"){
      for(var i in data.val().product_group){
        for(var j in data.val().product_group[i].product){
          var category = data.key;
          var group = i;
          var product = j;
          createLi(j, data.val().product_group[i].product[j], category, group, product);
        }
      }

    }else if(target == "portfolio"){
      for(var i in data.val().product_group){
        for(var j in data.val().product_group[i].product){
          if(data.val().product_group[i].product[j].portfolio){
            var category = data.key;
            var group = i;
            var product = j;
            createLi(data.val().product_group[i].product[j].portfolio.portfolio_id, data.val().product_group[i].product[j].portfolio, category, group, product);
          }
        }
      }
    }else if(target == "post"){
      var li = document.createElement('li');

      li.id = data.key;
      li.innerHTML = "<div class= 'listItem' >"+data.val().title+"</div>";

      counter++;
      $("#sidebar_list_area_admin").append(li);
      $("#sidebar_list_area_admin > li").addClass("list-group-item");
      $("#sideInfo>label").text("총 "+counter+" 개");
    }

  });
  function createLi(targetid, data, category, group, product){
    var li = document.createElement('li');

    li.id = targetid;
    li.innerHTML = "<div class= 'listItem'  data-category='"+category+"' data-product='"+product+"' data-group='"+group+"'>"+data.title+"</div>";

    counter++;
    $("#sidebar_list_area_admin").append(li);
    $("#sidebar_list_area_admin > li").addClass("list-group-item");
    $("#sideInfo>label").text("총 "+counter+" 개");
    $("#loadingData").hide();
  }

}

function importListData(location, Key){
  var ref = db.ref('/'+location);
  var temp = new Object();
  var target = $("#sideInfo > #newItem").attr("name");
  ref.once('value').then(function(data){
    if(target == "product_category"){
      $("#category_title").val(data.val().title);
      $("#category_summary").val(data.val().summary);

    }else if(target == "product_group"){
      $("#group_title").val(data.val().title);
      $("#group_category_id").val(data.val().product_category_id);
      $("#group_summary").val(data.val().summary);
      $("#group_thumb").val("");
      var imageUrl = data.val().thumb ? data.val().thumb.split("|")[0]: "";
      $("#group_existImage").text(imageUrl);
      $("#group_priority").val(data.val().priority);
      $("#group_extra").val(data.val().extra);

    }else if(target == "product"){
      $("#product_title").val(data.val().title);
      var portfolioName = data.val().portfolio ? data.val().portfolio.title : "";
      $("#product_portfolio").val(portfolioName);
      $("#product_group_id").val(data.val().product_group_id);
      $("#product_summary").val(data.val().summary);
      $("#product_body").val(data.val().body);
      $("#product_image").val("");
      var imageUrl = data.val().image ? data.val().image.split("|")[0]: "";
      $("#product_existImage").text(imageUrl);
      $("#product_publish").val(data.val().publish);
      $("#product_new").val(data.val().new);

    }else if(target == "portfolio"){
      $("#portfolio_title").val(data.val().title);
      $("#portfolio_city").val(data.val().city);
      $("#portfolio_product_id").val(data.val().product_id);
      $("#portfolio_image").val("");
      var imageUrl = data.val().image ? data.val().image.split("|")[0]: "";
      $("#portfolio_existImage").text(imageUrl);
      $("#portfolio_extra").val(data.val().extra);
    }else if(target == "post"){
      $("#post_title").val(data.val().title);
      $("#post_body").val(data.val().body);
      $("#post_section").val(data.val().section);
      $("#post_summary").val(data.val().summary);
      $("#post_image").val("");
      var imageUrl = data.val().image ? data.val().image.split("|")[0]: "";
      $("#post_existImage").text(imageUrl);
    }
  });
}

function addOptionMenu(type){

  var ref = db.ref('/product_category/');

  $("#product_group_id").empty();
  $("#group_category_id").empty();
  $("#portfolio_product_id").empty();

  ref.once('value').then(function(data){

    for( var key in data.val() ) {
      if(type == "category"){
        $("#group_category_id").append('<option value='+key+'>'+data.val()[key].title+'</option>');
      }else if(type == "group"){
        var temp = data.val()[key].product_group;
        for(var gkey in temp){
          $("#product_group_id").append('<option value='+gkey+'>'+temp[gkey].title+'</option>');
        }
      }else if(type == "product"){
        var temp = data.val()[key].product_group;
        for(var gkey in temp){
          for(var pkey in temp[gkey].product){
            $("#portfolio_product_id").append('<option value='+pkey+'>'+temp[gkey].product[pkey].title+'</option>');
          }
        }
      }
    }
  });
}


//데이터베이스 삭제
function deleteItem(target, img){
  if(!target){return null;}
  if(img){
    awsS3FileDelete(img + "|");
  }
  console.log(target +" - "+ "삭제 됨");
  db.ref(target).remove();
}
