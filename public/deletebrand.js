function deleteBrand(brand_ID){
    $.ajax({
        url: '/brands/' + brand_ID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};