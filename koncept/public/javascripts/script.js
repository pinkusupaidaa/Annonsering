$(document).ready(function () {

    $('.delete-ad').on('click', function (e) {
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
           type:'DELETE',
            url: '/users/allAdds/singleAdd/'+id,
            success: function (response) {
                alert('Tar bort annons');
                window.location.href = '/';
            },
            error: function(err){
               console.log(err);
            }
        });
    });

    var derp = 2; // Initierar till två för att det är en andra bild man vill ha med i annonsen.
    $('#newImage').on('click', function () {

        $('#image' + derp).show();
        derp++;
        console.log(derp);
        if(derp === 4){
            derp = 2;
        }
    });

    // filter-btn, visa städer och kategori att filterra på
    $('#filter-btn').on('click', function () {
        $('#filter-dropdown').show();
        console.log('ze FILTER!!!!!');
    })
});

var x = document.getElementById("demo");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;
}

// För senare användning av position
/*$('#testing').on('click', function () {
    var myjson;
    $.getJSON("http://maps.google.com/maps/api/geocode/json?address=längbrotorg%20Sweden", function(json){
        myjson = json;
        console.log(myjson);
        alert(JSON.stringify(myjson));
    });

});*/
