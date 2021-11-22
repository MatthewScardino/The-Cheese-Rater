function deleteSuggestion(suggestion_ID){
    console.log("Doing ajax delete");
    $.ajax({
        url: '/suggestions/' + suggestion_ID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};