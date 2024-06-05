jQuery(function($) {
	$('.search-form .search-field').autocomplete({		
		source: function(request, response) {
			$('.serach-loader').show();	
			$.ajax({
				dataType: 'json',
				url: AutocompleteSearch.ajax_url,
				data: {
					term: request.term,
					action: 'autocompleteSearch',
					security: AutocompleteSearch.ajax_nonce,
				},
				success: function(data) {
					$('.serach-loader').hide();
					response(data);
					console.log(data);
				}
			});
		},
		select: function(event, ui) {
			window.location.href = ui.item.link;
		},
        html: true,
        open: function(event, ui) {
          $(".ui-autocomplete").css("z-index", 1000);

        }	
	}).autocomplete( "instance" )._renderItem = function( ul, item ) {
        return $( "<li><div class='product-container'><div class='product search-product'><div class='row align-items-center'><div class='col-3 col-md-3 search_b'><img src='"+item.img+"'></div><div class='col-9 col-md-9 search_b'><div class='product-detail'><div class='product-name'>"+item.label+"</div><div class='price'>₹ "+item.price+"</div></div></div></div></div></div></li>" ).appendTo( ul ); 
      };
});