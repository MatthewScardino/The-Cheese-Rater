function deleteProduct(product_ID){
    $.ajax({
        url: '/products/' + product_ID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};