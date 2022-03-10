let categories, colors, discounts;
let filterNumber=0;
function ajaxCall(fileName,outcome){
    $.ajax({
        url:"json/"+fileName,
        method:"get",
        dataType:"json",
        success:outcome,
        error:function(xhr){
            console.log(xhr);
        }
    });
}

window.onload = function(){
   let url=window.location.pathname;
   if(url=="/dreamy/" || url=="/dreamy/index.html"){
    ajaxCall("nav.json", function (data){
      navigationBar(data)
    });
    ajaxCall("socialNetworks.json", function(data){
      socialNetHtml(data);
    })

    ajaxCall("productDes.json", function(data){
      productCardDes(data);
    })
    ajaxCall("roomsImg.json", function(data){
      roomsImg(data);
    })
    window.addEventListener("scroll", apperCard);



    }

   if(url=="/dreamy/products.html"){
    ajaxCall("nav.json", function (data){
      navigationBar(data)
    });
    ajaxCall("products.json", function (data){
      localStorage.setItem("products",JSON.stringify(data));
      productsHtml(data)

    });
    ajaxCall("categories.json", function(data){
        fetchCategories(data);
        categories=data;
    });
    ajaxCall("colors.json", function(data){
      fetchColors(data);
      colors=data;
    });
    ajaxCall("discounts.json",function(data){
      discounts=data;
    });

    
    ajaxCall("socialNetworks.json", function(data){
      socialNetHtml(data);
    })


    $("#priceSort").change(allFilters);
    $("#discountFilter").change(allFilters);
    $(".radioS").change(allFilters);
    $("#find").blur(allFilters);
    $("#removeFilter").click(removeAll);


    }

    if(url=="/dreamy/orders.html"){
      ajaxCall("nav.json", function (data){
        navigationBar(data)
      });
      ajaxCall("socialNetworks.json", function(data){
        socialNetHtml(data);
      })


    }
    if(url=="/dreamy/author.html"){
      ajaxCall("nav.json", function (data){
        navigationBar(data)
      });
      ajaxCall("socialNetworks.json", function(data){
        socialNetHtml(data);
      })

    }

}
function roomsImg(data){
  let html="";
  for(let img of data){
    html+=`<div class="col">
            <div class="card bg-dark text-white cardRoom">
              <img src="img/${img.img.src}" class="card-img"  alt="${img.img.alt}">
            </div>
          </div>`;
  }
  $("#room").html(html);
}

function productCardDes(data){
  let html="";
  for(let card of data){
    html+=`
          <div class="row top-margin borderCards cardP">
            <div class="col-sm-4 border-right">
              <img src="img/${card.img.src}" alt="${card.img.alt}" class="w-100"/>
            </div>
            <div class="col-sm-8">
              <div class="description  text-left">
                <h3 class="font-italic text-center">${card.title}</h3>
                <h4 class="mt-4">${card.description.h4}</h4>
                <h5 class="mt-4">${card.description.h5}</h5>
                <button class="btn dugme mt-4 checkedCat data-id="${card.id}"> View more</button>


              </div>
            </div>
          </div>`;
  }
  $("#productDes").html(html);
  $('.checkedCat').click(filterProdChek);

  //<a class="btn dugme mt-4 checked" data-id="${card.id}" href="products.html">View more</a>
}
function socialNetHtml(data){
  let html="";
  for(let soc of data){
    html+=`<a href="${soc.href}" target="_blank" class="colorA fontSI mr-2"><i class="${soc.icon}"></i></a>`
  }
  $('#socialN').html(html);
}

function fetchCategories(data){
  let html="";
  let divCategories=document.getElementById("categories");
  for(let cat of data){
      html+=`<li class="list-group-item borderLi">
                  <input type="checkbox" value="${cat.id}" name="chCat${cat.id}" class="chCat" id="${cat.id}"> ${cat.name}
             </li>`
  }
  divCategories.innerHTML=html;

  $(".chCat").change(allFilters);

}

function fetchColors(data){
  let html="";
  let divColors=document.getElementById("colors");
  for(let col of data){
      html+=`<li class="list-group-item borderLi">
                  <input type="checkbox" value="${col.id}" name="chCol${col.id}" class="chCol" id="chCol${col.id}"> ${col.name}
             </li>`
  }
  divColors.innerHTML=html;
  $(".chCol").change(allFilters);
}


function navigationBar(data){
  let html = "";
  let divNav = document.querySelector("#navigation");
  for(let id of data){
      html+=` <li class="nav-item"><a class="nav-link" href="${id.href}">${id.text}</a></li>`;
  }
  divNav.innerHTML=html;
}

function apperCard(){
  let pojava = document.querySelectorAll(".cardP");

  for(let i=0; i<pojava.length; i++){
      let visinaProzora = window.innerHeight;
      let pojavaGornja = pojava[i].getBoundingClientRect().top;
      let pojavaTacka = 200;

      if(pojavaGornja < visinaProzora - pojavaTacka){
          pojava[i].classList.add('active');
      }
      else{
          pojava[i].classList.remove('active');
      }
  }
}
function productsHtml(data){

  let html="";
  let divProducts=document.getElementById("products");
  data=sortByPrice(data);
  data=filterByDiscount(data);
  data=stockCheck(data);
  data=modelSearch(data);
  data=filterCategories(data);
  data=filterColors(data);

  if(data.length==0){
    html=`<div class="col-12">
            <p class="alert-danger my-5 text-center py-2 font-weight-bold">No products were found</p>
          </div>`;
  }
  else{
    for(let product of data){
      html+=`<div class="col-sm-12 col-md-6 col-lg-3 product">
         <div class="card my-5 py-3 px-4 text-center cardWidth">
            <div>
              ${addDiscount(product.discountId)}
            </div>

            <img src="img/${product.img.src}" class="card-img-top " alt="${product.img.alt}">
             <div class="card-body text-left">
                <h4 class="card-title">${product.name}</h4>
                <h5 class="card-text">${productPrice(product.price)}</h5>
                <h6 class="card-text">${addData(product.colorId, colors)} / ${addData(product.categoryId, categories)}</h6>
                <button type="button" class="btn btnCart" data-id="${product.id}">
                  PURCHASE
                </button>
                <div class="text-right">
                    ${productStatus(product.supplies)}
                </div>

              </div>
          </div>
     </div>`;
  }

  }
  divProducts.innerHTML=html;
  $(".btnCart").click(addToCart);


}

function addDiscount(disId){
let html="";
if(disId!=null){
  for(dis of discounts){
    if(dis.id==disId){
      html=`<div class="text-left pl-2 ${dis.cssStyle}">
            <h5 class="py-1 font-italic">${dis.name}</h5>
      </div>`;
    }
  }

}else{
  html=`<div class="text-left pl-2">
   </div>`;
}
return html;

}

function addData(id,array){
let html="";
for(let p of array){
  if(p.id==id){
    html=`${p.name}`;
  }
}
return html;
}

function productPrice(price){
let html="";
if(price.discount!=null){
  html=` ${price.active}$ &nbsp;<s>${price.discount}$</s>`;
}
else{
  html=` ${price.active}$`;
}
return html;
}

function productStatus(status){
  if(status){
     return `<p class="card-text inStock"><i class="fas fa-check-circle"></i> In stock</p>`;
  }
  else{
    return `<p class="card-text outStock"><i class="fas fa-times-circle"></i> Out of stock</p>`
  }
}

function filterCategories(data){


  let catArray=[];
     $('.chCat:checked').each(function (){
        catArray.push(parseInt($(this).val()));
     })

     if(catArray.length!=0){
      return data.filter((item) => catArray.includes(item.categoryId));


     }
     return data;

}//ovo je sredjeno


function filterColors(data){


  let catArray=[];
     $('.chCol:checked').each(function (){
        catArray.push(parseInt($(this).val()));
     })

     if(catArray.length!=0){
       return data.filter((item) => catArray.includes(item.colorId));


     }
     return data;

}//ovo je sredjeno

function sortByPrice(data){

let sortType= document.getElementById("priceSort").value;
    if(sortType == 'asc'){
    return data.sort((a,b) => a.price.active > b.price.active? 1 : -1);

    }
    else if(sortType == 'desc'){
      return data.sort((a,b) => a.price.active < b.price.active ? 1 : -1);

    }
    else{
      return data;
    }


}//Ovo je sredjeno

function filterByDiscount(data){

let filterType= document.getElementById("discountFilter").value;

if(filterType!=0){
 return data.filter(x=>x.discountId==filterType);

}
  return data;
}//ovo je sredjeno


function stockCheck(data){

let filterStock = document.getElementsByName('radioS');

for(let fil in filterStock){
  if(filterStock[fil].checked && filterStock[fil].value=="inStock"){
   return data.filter(x => x.supplies);


 }
 else if(filterStock[fil].checked && filterStock[fil].value=="outOfStock"){
    return data.filter(x =>x.supplies==false);

 }
}
return data;
}//ovo je sredjeno


function modelSearch(data){
 let model= document.getElementById("find").value;

  if(model){
    return data.filter(function(el){
      if(el.name.toUpperCase().indexOf(model.trim().toUpperCase())!=-1){
         return el;

     }
   });
  }
  else{
      return data;
  }



}//ovo je sredjeno

$('.colV').click(changeView);

function changeView(){
  var products=document.querySelectorAll('.product');


    if($(this).data('value')==2){
       for(let i=0;i<products.length;i++){
        products[i].classList.remove("col-lg-3", "col-lg-4");
        products[i].classList.add("col-lg-5");
      }
    }
    else if($(this).data('value')==3){
      for(let i=0;i<products.length;i++){
        products[i].classList.remove("col-lg-3", "col-lg-5");
        products[i].classList.add("col-lg-4");
      }
    }
    else{
      let product = JSON.parse(localStorage.getItem('products'));
      productsHtml(product);
    }


}//ovo je sredjeno

function allFilters(){
  let product = JSON.parse(localStorage.getItem('products'));
    productsHtml(product);
}//ovo je sredjeno

function removeAll(){
  $("#priceSort").val("");
  $("#discountFilter").val(0);
  $("#find").val(null);
  $("input[type=radio][name=radioS]").prop('checked', false);
  $('.chCat').prop('checked', false);
  $('.chCol').prop('checked', false);
  var products=document.querySelectorAll('.product');
  for(let i=0;i<products.length;i++){
    products[i].classList.remove("col-lg-5"||"col-lg-4");
  }

  let product = JSON.parse(localStorage.getItem('products'));
  productsHtml(product);
}//ovo je sredjeno


$(document).ready(function(){
  $('#filterP ul > li ul')
    .click(function(e){
      e.stopPropagation();
    })
    .filter(':not(:first)')
    .hide();

  $('#filterP ul > li').click(function(){
    var selfClick = $(this).find('ul:first').is(':visible');
    if(!selfClick) {
      $(this)
        .parent()
        .find('> li ul:visible')
        .slideToggle();
    }

    $(this)
      .find('ul:first')
      .stop(true, true)
      .slideToggle();
  });
});

function filterProdChek(){
  location.href = 'products.html';


}

//KORPA

function addToCart(){
   let idProduct=$(this).data('id');
   let cartP = JSON.parse(localStorage.getItem("cart"));

   if(cartP){
      if(existingProduct()){
        updateCart();
      }
      else{
        addNewProduct();
      }
   }else{
     addProduct();
   }

   function addProduct(){
      let proizvod=[];
   }
   function existingProduct(){
     return cartP.filter(p=>p.id==idProduct.length);
   }

   
}




