var values = {};

$(document).ready(function() {
    $('#submit-button').on('click', postData);
    $('#task-output').on('click', '.checkbox', taskComplete);
    $('#task-output').on('click', '.delete-button', taskDelete);

    getData();
});

function postData() {
    event.preventDefault();

    $.each($('#task-form').serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });

    //console.log(values);

    $('input').val('');

    $.ajax({
        type: 'POST',
        url: '/task',
        data: values,
        success: function(data) {
            if(data) {
                // everything went ok
                //console.log('from server:', data);
                getData();
            } else {
                console.log('error');
            }
        }
    });

}

function getData() {
    $('.task').remove();
    $.ajax({
        type: 'GET',
        url: '/task',
        success: function(data){
            //console.log(data);
            sendToDom(data);
        }
    });
}
function sendToDom(taskData){
    for (var task in taskData) {

        var tsk = taskData[task];

        $('#task-output').append('<div class="task"><form id="task-complete"><input class="checkbox" type="checkbox" data-id="' + tsk.id + '">' + tsk.task + '<button class="delete-button" data-id="' + tsk.id + '">Delete</button>' + '</form></div>');
    }
}

function taskComplete() {
    //console.log("The complete click works!");

    values.id = $(this).data('id');
    //console.log(values);

    $.ajax({
        type: 'PUT',
        url: '/complete',
        data: values,
        success: function(data) {
            if(data) {
                // everything went ok
                //console.log('from server:', data);
                getData();
            } else {
                console.log('error');
            }
        }
    });
}

function taskDelete() {
    var result = confirm("Are you sure??? There's no turning back!");
    if (result) {
        event.preventDefault();
        //console.log("The delete click works!");

        values.id = $(this).data('id');
        //console.log(values);

        $.ajax({
            type: 'PUT',
            url: '/delete',
            data: values,
            success: function(data) {
                if(data) {
                    // everything went ok
                    //console.log('from server:', data);
                    getData();
                } else {
                    console.log('error');
                }
            }
        });
    }
}