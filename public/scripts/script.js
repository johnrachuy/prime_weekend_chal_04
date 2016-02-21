var values = {};

$(document).ready(function() {
    $('#submit-button').on('click', postData);
    $('#task-output').on('click', '.checkbox', taskComplete);

    getData();
});

function postData() {
    event.preventDefault();

    var values = {};
    $.each($('#task-form').serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });

    console.log(values);

    $('input').val('');

    $.ajax({
        type: 'POST',
        url: '/task',
        data: values,
        success: function(data) {
            if(data) {
                // everything went ok
                console.log('from server:', data);
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
            console.log(data);
            sendToDom(data);
        }
    });
}
function sendToDom(taskData){
    for (var task in taskData) {

        var tsk = taskData[task];

        $('#task-output').append('<div class="task"><form id="task-complete"><input class="checkbox" type="checkbox" data-id="' + tsk.id + '">' + tsk.task + '</form></div>');
    }
}

function taskComplete() {
    console.log("The complete click works!");

    values.id = $(this).data('id');
    console.log(values);



    $.ajax({
        type: 'POST',
        url: '/complete',
        data: values,
        success: function(data) {
            if(data) {
                // everything went ok
                console.log('from server:', data);
                getData();
            } else {
                console.log('error');
            }
        }
    });
}



