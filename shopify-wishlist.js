//Add shopify-wishlist.js in asset and install in theme.liquid with <script src="{{ 'shopify-wishlist.js' | asset_url }}" type="text/javascript"></script>


//JS to add item to wishlist

var myObj, myJSON, text, obj, newValue, list, i, k, newList;

if (localStorage.getItem("products") != null) {
  myObj = localStorage.getItem("products");
} else {
  myObj = "";
}

function upDateStorage() {
  
  let products = [];
  
  if(localStorage.getItem('products')){
    products = JSON.parse(localStorage.getItem('products'));
  }
  
  if (myObj.includes(document.getElementById("productHandle").value)) {
    
    document.getElementById("js-wish-list").innerHTML = '<p style="margin-top: 10px;">Added. <a href="/pages/favourites" style="text-decoration: underline;">View list</a></p>';
    
  } else {
    
    products.push({'productHandle' : document.getElementById("productHandle").value});

    localStorage.setItem('products', JSON.stringify(products));
    
    document.getElementById("js-wish-list").innerHTML = '<p style="margin-top: 10px;">Added. <a href="/pages/favourites" style="text-decoration: underline;">View list</a></p>';
  }
}

// JS to remove item from wishlist

var getImageName = function() {
  document.onclick = function(e) {
    if (e.target.getAttribute("data-product") != null) {

      if (document.querySelectorAll('.removeStorage').length > 1) {

        var handle = e.target.getAttribute("data-product");
        //alert(handle);
        //document.getElementById('demo').innerHTML = handle;

        let storageProducts = JSON.parse(localStorage.getItem('products'));

        let products = storageProducts.filter(product => product.productHandle !== handle );

        localStorage.setItem('products', JSON.stringify(products));

        location.reload();

      } else {

        localStorage.removeItem('products');
        location.reload();

      }
    }
  }
}

getImageName()

// JS for search on page

function searchP() {
  // Declare variables
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('myInput');
  filter = input.value.toUpperCase();
  ul = document.getElementById("favourite-container");
  li = ul.querySelectorAll('ul li');	
  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    a = li[i];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

//Propagating the wishlist page.. NOTE: the append code will need to be adjusted with your product-grid-card.liquid code for your collection's page css settings to be reflected on the wishlist page

$(document).ready(function() {
  if (window.location.href.indexOf("favourites") > -1) {
    var Obj, i, x, y = "";
    text = localStorage.getItem("products");

    if (text != null) {
      obj = JSON.parse(text);

      for (i in obj) {

        x += "," + obj[i].productHandle + ",";

      }

      document.getElementById("wishlist-here").innerHTML = x;

    } else {

      document.getElementById("wishlist-here2").innerHTML = '<div class="empty-page-content text-center" data-empty-page-content=""><h1>Your Wishlist</h1><p class="text-center">Your wishlist is currently empty.</p><a href="/" class="btn btn--has-icon-after cart__continue-btn">Continue shopping<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon--wide icon-arrow-right" viewBox="0 0 20 8"><path d="M15.186.445c.865.944 1.614 1.662 2.246 2.154.631.491 1.227.857 1.787 1.098v.44a9.933 9.933 0 0 0-1.875 1.196c-.606.485-1.328 1.196-2.168 2.134h-.752c.612-1.309 1.253-2.315 1.924-3.018H.77v-.986h15.577c-.495-.632-.84-1.1-1.035-1.406-.196-.306-.486-.843-.87-1.612h.743z" fill="#000" fill-rule="evenodd"></path></svg></a></div>';

    }

    var example = $('#wishlist-here').html();

    if (example != '') {

      var numbers = example.split(','),
          disabled = '',
          varianceId = '',
          btnLabel = '';

      for(var i = 0; i < numbers.length; i++) {

        jQuery.getJSON('/products/' + numbers[i] + '.js', function(product) {
          
          if (product.variants[0].available == true) {
            disabled = '';
            varianceId = product.variants[0].id;
            btnLabel = 'ADD TO BAG';
          } else {
            disabled = 'disabled';
            varianceId = '';
            btnLabel = 'SOLD OUT';
          }

          $('#wishlist-here2').append(
            '<li class="grid__item grid__item--collection-template small--one-half medium-up--one-quarter content"><div class="grid-view-item grid-view-item--sold-out product-card text-center"><a class="grid-view-item__link grid-view-item__image-container full-width-link" href="' + product.url + '"><span class="visually-hidden">' + product.title + '</span></a><div class="product-card__image-with-placeholder-wrapper" data-image-with-placeholder-wrapper=""><div id="ProductCardImageWrapper-collection-template-5047126818953" class="grid-view-item__image-wrapper product-card__image-wrapper js"><div style="padding-top:100.0%;"><img id="ProductCardImage-collection-template-5047126818953" class="grid-view-item__image" alt="" src="' + product.featured_image + '"></div></div><div class="placeholder-background placeholder-background--animation hide" data-image-placeholder=""></div></div>  <div class="price__vendor price__vendor--listing"><dt><span class="visually-hidden">Vendor</span></dt><dd style="margin: auto;">' + product.vendor + '</dd></div><div class="inner"><div class="grid-view-item__title product-card__title" aria-hidden="true">' + product.title + '</div><dl class="price price--listing"><div class="price__regular"><dt><span class="visually-hidden visually-hidden--inline">Regular price</span></dt><dd><span class="price-item price-item--regular">$' + (product.price/100).toFixed(2) + '</span></dd></div></dl></div></div><form method="post" action="/cart/add"><input type="hidden" name="id" value="' + varianceId + '" /><input class="hide" min="1" type="number" id="quantity" name="quantity" value="1"/><input type="submit" value="' + btnLabel + '" class="btn" style="width: 100%;"' + disabled + ' /></form><a class="btn removeStorage text-center" data-product="' + product.handle + '"><span style="font-size: larger;" data-product="' + product.handle + '">&#8553;</span><span data-product="' + product.handle + '">&ensp;REMOVE</span></a></li>'
          );

        });

      };
    }
  }
});

//Page's loadmore with 40 products loaded per time..

$(document).ready(function(){
  setTimeout(function(){
    $(".content").slice(0, 40).show();
    
    /*
		// Load more button
		
    $("#loadMore").on("click", function(e){
      
      e.preventDefault();
      $(".content:hidden").slice(0, 4).slideDown();
      if($(".content:hidden").length == 0) {
        $("#loadMore").text("All loaded").addClass("noContent").attr("href", "");
      }

    });
    */
    if ($('#wishlist-here2 li')[0]) {
      $('#favourite-container .section-header').fadeIn();
    }
  }, 3000);
	
	// load more of scroll!!
	
  setTimeout(function(){
    $(window).on('resize scroll', function() {
      var nearToBottom = $('#shopify-section-footer').outerHeight() - 200;

      if ($(window).scrollTop() + $(window).height() > $(document).height() - nearToBottom) {

        if($(".content:hidden").length > 0) {

          $("#loadMore").html('LOADING...').show();

          setTimeout(function(){
            $(".content:hidden").slice(0, 40).slideDown();
            $("#loadMore").fadeOut();
          }, 1000);

        } else if($(".content:hidden").length == 0) {

          $("#loadMore").fadeOut();
        }
      }
    });
  }, 4000);
});