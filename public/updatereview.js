function updateReview(review_ID){
    $.ajax({
        url: '/reviews/' + review_ID,
        type: 'PUT',
        data: $('#update-review').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
