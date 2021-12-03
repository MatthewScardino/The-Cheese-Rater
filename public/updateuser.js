function updateUser(user_ID){
    $.ajax({
        url: '/users/' + user_ID,
        type: 'PUT',
        data: $('#update-user').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
