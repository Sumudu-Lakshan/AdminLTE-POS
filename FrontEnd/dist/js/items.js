$('#btnSubmit').click(function(){

    
    var itemID = $("#itemID").val();
    var itemDescripiotn = $("#itemDescription").val();
    var qtyOnHand = $("#qtyOnHand").val();
    var quantity = $("#txtQty").val();


    $("#tblItems").append("<tr><td>"+ itemID + "</td><td>" + itemDescripiotn + "</td><td>" + qtyOnHand + "</td><td>" + quantity + "</td></tr>");
});