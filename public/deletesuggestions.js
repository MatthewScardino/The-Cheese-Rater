function deleteSuggestion(suggestion_ID){
    $.ajax({
        url: '/suggestions/' + suggestion_ID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};