function deletePairing(pairing_ID){
    $.ajax({
        url: '/pairings/' + pairing_ID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};