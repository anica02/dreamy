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
function setItem(name,data){
  localStorage.setItem(name,JSON.stringify(data));
}
function getItem(name){
  return JSON.parse(localStorage.getItem(name));
}
window.onload = function(){
   let url=window.location.pathname;
   if(url=="/dreamy/" || url=="/dreamy/index.html"){

    ajaxCall("nav.json", function (data){
      navigationBar(data)
    });
    cartLenght();
    ajaxCall("productDes.json", function(data){
      productCardDes(data);
    });

    ajaxCall("roomsImg.json", function(data){
      roomsImg(data);
    });

    ajaxCall("socialNetworks.json", function(data){
      socialNetHtml(data);
    });

    window.addEventListener("scroll", apperCard);
    }

   if(url=="/dreamy/products.html"){

    ajaxCall("nav.json", function (data){
      navigationBar(data)
    });

    ajaxCall("categories.json", function(data){
        fetchCategories(data);
        categories=data;
        ajaxCall("colors.json", function(data){
          fetchColors(data);
          colors=data;
          ajaxCall("discounts.json",function(data){
            discounts=data;
            ajaxCall("products.json", function (data){
              setItem('products', data);
              productsHtml(data);
              cartLenght();
              ajaxCall("socialNetworks.json", function(data){
                socialNetHtml(data);
              })
            });
          });
        });
    });


    $("#priceSort").change(allFilters);
    $("#nameSort").change(allFilters);
    $("#discountFilter").change(allFilters);
    $(".radioS").change(allFilters);
    $("#find").blur(allFilters);
    $("#removeFilter").click(removeAll);

    }

    if(url=="/dreamy/orders.html"){

      ajaxCall("nav.json", function (data){
        navigationBar(data)
      });
      cartLenght();
      let cartP = getItem('cart');
      getItem('products');
      if(cartP==null){
        emptyCart();
      }
      else{
        showCart();
      }

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
      });
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
                <a class="btn dugme mt-4" href="products.html">View more</a>
              </div>
            </div>
          </div>`;
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
  data=sortByName(data);
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
      html+=`<div class="col-6  col-lg-4 col-xl-3 product">
         <div class="card mb-5 py-3 px-4 text-center cardWidth">
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

}//DOBAR

function filterColors(data){
  let catArray=[];
     $('.chCol:checked').each(function (){
        catArray.push(parseInt($(this).val()));
     })

     if(catArray.length!=0){
       return data.filter((item) => catArray.includes(item.colorId));
     }
     return data;

}//DOBAR

function sortByPrice(data){
let sortType= document.getElementById("priceSort").value;
    if(sortType == 'asc'){
    return data.sort((a,b) => a.price.active > b.price.active? 1 : -1);

    }
    else if(sortType == 'desc'){
      return data.sort((a,b) => a.price.active < b.price.active ? 1 : -1);

    }
      return data;
}


function sortByName(data){
  let sortType= document.getElementById("nameSort").value;
  if(sortType!=""){
    data.sort(function (a,b){
     if(sortType=="asc"){
      if(a.name>b.name){
        return -1;
      }
      else if(a.name<b.name){
        return 1;
      }
      else{
         return 0;
      }
     }
     else{
      if(a.name<b.name){
        return -1;
      }
      else if(a.name>b.name){
        return 1;
      }
      else{
         return 0;
      }
     }
    });
       return data;
  }
    return data;
}

function filterByDiscount(data){

  let filterType= document.getElementById("discountFilter").value;

  if(filterType!=0){
    return data.filter(x=>x.discountId==filterType);
  }
  return data;

}//DOBAR


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
}//DOBAR


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

}//DOBAR

$('.colV').click(changeView);

function changeView(){

  var products=document.querySelectorAll('.product');

  if($(this).data('value')==2){
    for(let i=0;i<products.length;i++){
      products[i].classList.remove("col-lg-4","col-xl-3", "col-xl-4");
      products[i].classList.add("col-lg-5","col-xl-5");
    }
  }

  else if($(this).data('value')==3){
    for(let i=0;i<products.length;i++){
      products[i].classList.remove("col-xl-3", "col-xl-5","col-lg-5");
      products[i].classList.add("col-lg-4","col-xl-4");
    }
  }

  else{
    let product = getItem('products');
      productsHtml(product);
  }

}//DOBAR

function allFilters(){

  let product = getItem('products');
  productsHtml(product);

}//DOBAR

function removeAll(){
  $("#priceSort").val("");
  $("#nameSort").val("");
  $("#discountFilter").val(0);
  $("#find").val(null);
  $("input[type=radio][name=radioS]").prop('checked', false);
  $('.chCat').prop('checked', false);
  $('.chCol').prop('checked', false);
  var products=document.querySelectorAll('.product');
  for(let i=0;i<products.length;i++){
    products[i].classList.remove("col-lg-5"||"col-lg-4");
  }
  let product = getItem('products');
  productsHtml(product);
}//DOBAR


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
});//DOBAR



//KORPA

function addToCart(){
   let idProduct=$(this).data('id');
   let cartP = getItem('cart');

   if(cartP){
      if(existingProduct()){
        updateCart();
      }
      else{
        addNewProduct();
        cartLenght();
      }
   }else{
     addProduct();
     cartLenght();
   }

   function addProduct(){
      let products=[];
      products[0]={
        id:idProduct,
        quantity:1
      }
      setItem('cart', products);
   }
   function existingProduct(){
     return cartP.filter(p=>p.id==idProduct).length;
   }

   function updateCart(){
     let cartP=getItem('cart');
     for(let p of cartP){
       if(p.id==idProduct){
         p.quantity++;
         break;
       }
     }
     setItem('cart', cartP);
   }

  function addNewProduct(){
    let cartP=getItem('cart');

    cartP.push({
      id:idProduct,
      quantity:1
    });
    setItem('cart', cartP);
  }

}

function cartLenght(){
      let cartP = getItem('cart');
      let numberP="";

      if(cartP){
        numberP=cartP.length;
      }
      else{
       numberP=0;
      }
      $("#cart span").html(numberP);
}

function emptyCart(){
  let html=`<div class="col-12">
            <p class="alert-danger my-5 text-center py-2 font-weight-bold">Cart is empty</p>
          </div>`;
   $("#cartStatus").html(html);
}

function showCart(){
  let products=getItem('products');
  let cartP = getItem('cart');

  let product = products.filter(p=>{
    for(let prod of cartP){
        if(p.id==prod.id){
          p.quantity=prod.quantity;
          return true;
        }
    }
    return false;
  })
  showCartProducts(product);
}

function showCartProducts(product){
  let html="";
  let cartDiv=document.getElementById('cartStatus');
  let total=0;

  html=`<div class="row">
          <div class="col text-center">
              <p>Product</p>
          </div>
          <div class="col text-center">
            <p>Name</p>
          </div>
          <div class="col text-center">
            <p>Quantity</p>
          </div>
          <div class="col text-center">
            <p>Price</p>
           </div>
          <div class="col text-center">
            <p></p>
          </div>
        </div>`;
  for(let p of product){
     html+=`<div class="row">
              <div class="col text-center">
              <img src="img/${p.img.src}" class="w-100" alt="${p.img.alt}">
             </div>
            <div class="col text-center py-4">
              <p>${p.name}</p>
            </div>
            <div class="col text-center py-4">
              <p>${p.quantity}
            </div>
            <div class="col text-center py-4">
              <p>${p.price.active*p.quantity}</p>
            </div>
            <div class="col text-center py-4">
              <button onclick='remove(${p.id})' class="removeButton py-1 px-1">Remove</button>
            </div>
         </div>`;
         total+=p.price.active*p.quantity;
  }
      if(total==0){
        $("#totalPrice").html("");

      }else{
        $("#totalPrice").html(total);
      }
  cartDiv.innerHTML=html;

}

function remove(id){
   let product = getItem('cart');
   let filter = product.filter(p=>p.id!=id);
   setItem('cart', filter);
   showCart();
   cartLenght();
}

function removeAll(){
  localStorage.removeItem('cart');
  emptyCart();
  cartLenght();
  $("#totalPrice").html("");
}

//FORM

function submitPurches(){

  var name,adress, number, payment, delivery;
  var valueName, valueAdress, valueNumber, total;
  nizPodaci = [];
  name = document.querySelector("#flName");
  valueName = name.value;
  adress = document.querySelector("#adress");
  valueAdress = adress.value;
  number = document.querySelector("#phoneNumber");
  valueNumber = number.value;
  payment = document.querySelector("#payment");
  delivery = document.getElementsByName("delivery");
  
  let errors=0;

  //name

  let reName=/^[A-ZČĆŠĐŽ]{1}[a-zčćšđž]{2,15}(\s[A-ZČĆŠĐŽ]{1}[a-zčćšđž]{2,15})+$/;

  if(reName.test(valueName)){
    document.querySelector("#inputName > div").innerHTML = `<p class=" text-success"><i class="far fa-check-circle"></i></p>`;
   
  }
  else{
    document.querySelector("#inputName > div").innerHTML =  `<p class="text-danger"><i class="fas fa-exclamation-circle "></i> Name and surname aren't entered in a good format</p>`;
    errors++;
  }

  //adress

  let reAdress=/^[A-ZČĆŠĐŽ]{1}[a-zčćšđž]{2,15}(\s[A-ZČĆŠĐŽ]{1}[a-zčćšđž]{0,15})*\s[\d]{1,5}(\s[A-ZČĆŠĐŽ]{1}[a-zčćšđž]{2,15})*,(\s[A-ZČĆŠĐŽ]{1}[a-zčćšđž]{2,10})+\s[\d]{5}$/;

  if(reAdress.test(valueAdress)){
    document.querySelector("#inputAdress > div").innerHTML = `<p class="text-success"><i class="far fa-check-circle  "></i></p>`;
    
  }
  else{
    document.querySelector("#inputAdress > div").innerHTML = `<p class="text-danger"><i class="fas fa-exclamation-circle "></i> Address is not entered in a good form</p>`;
    
    errors++;

  }
   //phoneNumber

   let reNumber=/^06[0-689][0-9]{6,9}$/;
   if(reNumber.test(valueNumber)){
    document.querySelector("#inputNumber > div").innerHTML = `<p class="text-success"><i class="far fa-check-circle "></i></p>`;
   }
   else{
    document.querySelector("#inputNumber > div").innerHTML =`<p class="text-danger"><i class="fas fa-exclamation-circle "></i> Phone number is not entered in a good form</p>`;
    
     errors++;

   }

   //payment

  if(payment.options[payment.options.selectedIndex].value=="0"){
    document.querySelector("#selectPayment > div").innerHTML =`<p class="text-danger" <i class="fas fa-exclamation-circle  "></i> You must select a payment method</p>`;
    errors++;
  }
  else{
    document.querySelector("#selectPayment > div").innerHTML = `<p class="text-success"><i class="far fa-check-circle "></i></p>`;
   
   
  }

 
  //delivery

  var value=" ";
  for(let i=0;i<delivery.length;i++){
    if(delivery[i].checked){
      value = delivery[i].value;
      break;
    }
  }
  if(value==" "){
    document.querySelector("#inputDelivery > div").innerHTML = `<p class="text-danger"><i class="fas fa-exclamation-circle  "></i>You must select a delivery method</p>`;
    errors++;
  }
  else{
    document.querySelector("#inputDelivery > idv").innerHTML =`<p class=" text-success"><i class="far fa-check-circle"></i></p>`;
  }

  //chechCart
  totla=$("#totalPrice").val();
   let errorMessage =`<p class="text-danger"><i class="fas fa-exclamation-circle "></i> Your cart is empty, add products so you can purchase them</p>`;
  if(total==null){
   errors++;
    $("#cartError").html(errorMessage);
  }
  else{
    console.log("Moze");
  }

  
}
