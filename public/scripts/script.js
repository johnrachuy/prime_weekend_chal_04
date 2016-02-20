$(document).ready(function() {
    $('#submit-button').on('click', postData);
    console.log("Ready!");

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
    $('.task-data').remove();
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

        $('#task-table').append('<tr class="task-data"><td>' + tsk.task + '</td><td>' + tsk.complete + '</td></tr>');
    }
}