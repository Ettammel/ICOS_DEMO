function TeleHealthSearch() {
    $.ajax({
        url: "/ICOS/TeleHealthSearchPage",
        type: "POST",
        dataType: "html",
        success: function (data) {
            $("#dynForm").html('');
            $("#dynForm").append(data);
            
        }
    })
}