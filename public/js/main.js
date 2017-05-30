$(document).ready(function(){
    $('.delete-article').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        console.log(id);

        $.ajax({
            type: 'DELETE',
            url: '/articles/'+id,
            success: function(response){
                alert('Deleting Article');
                window.location.href='/';
            },
            error: function(err){
                console.log(err);
            }
        });
    });


    $(".table-row").click(function() {
        window.document.location = $(this).data("href");
    });

    $('.child').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        window.location.href = id;
    });

    // $("textarea").focus();

});