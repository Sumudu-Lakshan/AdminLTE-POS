$('#btnSubmit').click(function(){
    var cstID = $("#customerID").val();
    var cstName = $("#customerName").val();
    var email = $("#email").val();
    var nic = $("#nic").val();


    $("#tblCustomers").append("<tr><td>"+ cstID + "</td><td>" + cstName + "</td><td>" + email + "</td><td>" + nic + "</td></tr>");
});