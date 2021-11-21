function deleteSuggestion(product_ID, user_ID, brand_ID){
    $.ajax({
        url: '/suggestions/' + product_ID, user_ID, brand_ID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};