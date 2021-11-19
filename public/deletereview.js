function deleteReview(review_ID){
    $.ajax({
        url: '/reviews/' + review_ID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};