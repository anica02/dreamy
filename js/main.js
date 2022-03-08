let categories, colors, discounts;
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
   if(url=="/" || url=="/index.html"){
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

   if(url=="/products.html"){
    ajaxCall("nav.json", function (data){
      navigationBar(data)
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
    
    ajaxCall("products.json", function (data){
      localStorage.setItem("products",JSON.stringify(data));
      productsHtml(data)
     
    });
    ajaxCall("socialNetworks.json", function(data){
      socialNetHtml(data);
    })
    
    $("#priceSort").change(sortByPrice);
    $("#discountFilter").change(filterByDiscount);
    $(".radioS").change(stockCheck);
    $("#find").blur(modelSearch);
    
    }
    if(url=="/orders.html"){
      ajaxCall("nav.json", function (data){
        navigationBar(data)
      });
      ajaxCall("socialNetworks.json", function(data){
        socialNetHtml(data);
      })
    }
    if(url=="/author.html"){
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
  for(let soc of data){
    html+=`
          <div class="row top-margin borderCards cardP">
            <div class="col-sm-4 border-right">
              <img src="img/${soc.img.src}" alt="${soc.img.alt}" class="w-100"/>
            </div>
            <div class="col-sm-8">
              <div class="description  text-left">
                <h3 class="font-italic text-center">${soc.title}</h3>
                <h4 class="mt-4">${soc.description.h4}</h4>
                <h5 class="mt-4">${soc.description.h5}</h5>
                <a class="btn dugme mt-4" data-id="${soc.id}" href="products">View more</a>
              </div>
            </div>
          </div>
    `;
  }
  $("#productDes").html(html);
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
                  <input type="checkbox" value="${cat.id}" name="chCat" class="chCat" id="${cat.id}"> ${cat.name}
             </li>`
  }
  divCategories.innerHTML=html;

  $(".chCat").change(filterCategories);
 
}
function fetchColors(data){
  let html="";
  let divColors=document.getElementById("colors");
  for(let col of data){
      html+=`<li class="list-group-item borderLi">
                  <input type="checkbox" value="${col.name}" name="chCol${col.id}" id="chCol${col.id}"> ${col.name}
             </li>`
  }
  divColors.innerHTML=html;
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
  if(data.length==0){
    html=`<div class="col-12">
            <p class="alert-danger">Trenutno nema proizvoda</p>
          </div>`;
  }
  else{
    for(let product of data){
      html+=`<div class="col-12  col-md-6 col-lg-3 product">
         <div class="card my-5 py-3 px-4 text-center cardWidth">
            <div>
              ${addDiscount(product.discountId)}
            </div>
        
            <img src="../img/${product.img.src}" class="card-img-top " alt="${product.img.alt}">
             <div class="card-body text-left">
                <h4 class="card-title">${product.name}</h4>
                <h5 class="card-text">${productPrice(product.price)}</h5>
                <h6 class="card-text">${addData(product.colorId, colors)} / ${addData(product.categoryId, categories)}</h6>
                <button type="button" class="btn btnCart">
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

function filterCategories(){

  let product= JSON.parse(localStorage.getItem('products'));
  let catArray=[];
     $('.chCat:checked').each(function (){
        catArray.push(parseInt($(this).val()));
     })
    
     if(catArray.length!=0){
       let filtrirano;
       for(let cat of catArray){
          filtrirano = product.filter(x=>x.categoryId==cat);
          
       }
  
       return productsHtml(filtrirano);
     }
     return productsHtml(product);

}//Ovo da sredis!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//


function sortByPrice(){
let product= JSON.parse(localStorage.getItem('products'));
let sortType= document.getElementById("priceSort").value;
    if(sortType == 'asc'){
    product.sort((a,b) => a.price.active > b.price.active? 1 : -1);
    return productsHtml(product);
    }
    else if(sortType == 'desc'){
      product.sort((a,b) => a.price.active < b.price.active ? 1 : -1);
      return productsHtml(product);
    }
    else{
      return productsHtml(product);
    }

}//Ovo je sredjeno

function filterByDiscount(){
let product= JSON.parse(localStorage.getItem('products'));
let filterType= document.getElementById("discountFilter").value;

if(filterType!=0){
  filtrirano=product.filter(x=>x.discountId==filterType);
  return productsHtml(filtrirano);
}
  return productsHtml(product);
}//ovo je sredjeno


function stockCheck(){
let product = JSON.parse(localStorage.getItem('products'));
let filterStock = document.getElementsByName('radioS');

for(let fil in filterStock){
  if(filterStock[fil].checked && filterStock[fil].value=="inStock"){
   let filtered = product.filter(x => x.supplies);
   return productsHtml(filtered);
   
 }
 else if(filterStock[fil].checked && filterStock[fil].value=="outOfStock"){
    let filtered = product.filter(x =>x.supplies==false);
    return productsHtml(filtered);
 }
}
return productsHtml(product);
}//ovo je sredjeno


function modelSearch(){
 let model= document.getElementById("find").value;
 let product = JSON.parse(localStorage.getItem('products'));

 let filter = product.filter(function(el){
   if(el.name.toUpperCase().indexOf(model.trim().toUpperCase())!=-1){
      return el;
      
   }
 });

 return productsHtml(filter);
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
    
    
    
}
  
    
  

 
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

