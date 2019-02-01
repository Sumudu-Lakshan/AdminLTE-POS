//Disable the functions
$("#cmbCustomerID").attr("disabled", "disabled");
$("#cmbItemID").attr("disabled", "disabled");
$("#btnAddCart").attr("disabled", "disabled");
$("#btnPlaceOrder").attr("disabled", "disabled");


//New Button Functions
$("#btnNewOrder").click(function () {

    //Generate Order ID
    var orderid = $("#tblOrders tbody tr").length + 1;
    $("#lblOrderId").text(orderid);

    //Enable the Functions
    $("#cmbCustomerID").removeAttr("disabled");
    $("#cmbItemID").removeAttr("disabled");
    $("#btnAddCart").removeAttr("disabled");
    hardreset();


});

//Load Customers to the Combo box
$("#cmbCustomerID").append("<option selected>~Select Customer~</option>");

for (var i = 0, cuslength = CUSTOMERS.length; i < cuslength; i++) {
    var keys = Object.keys(CUSTOMERS[i]);

    $("#cmbCustomerID").append("<option>" + CUSTOMERS[i][keys[0]] + "</option>");
}

//Load items to the combo box
$("#cmbItemID").append("<option selected>~Select Item~</option>");
for (var i = 0, itemlength = ITEMS.length; i < itemlength; i++) {
    var keys = Object.keys(ITEMS[i]);
    $("#cmbItemID").append("<option>" + ITEMS[i][keys[0]] + "</option>");
}

//Get Customer Data
$("#cmbCustomerID").click(function () {
    if ($('#cmbCustomerID').val() == "~Select Customer~") {
        $("#lblCustomerName").text("");
    }
    for (var i = 0, cuslength = CUSTOMERS.length; i < cuslength; i++) {
        var name = $("#cmbCustomerID :selected").text();
        var keys = Object.keys(CUSTOMERS[i]);

        if (name == CUSTOMERS[i][keys[0]]) {
            $("#lblCustomerName").text(CUSTOMERS[i][keys[1]])
            return;
        }

    }
});
var qty = 0;

//Get Item Data

$("#cmbItemID").click(function () {
    if ($("#cmbItemID").val() == "~Select Item~") {
        $("#lblItemDescription").text("");
        $("#lblUnitPrice").text("");
        $("#lblQtyOnHand").text("");
    }

    for (var i = 0, itemlength = ITEMS.length; i < itemlength; i++) {
        var name = $("#cmbItemID :selected").text();
        var keys = Object.keys(ITEMS[i]);

        if (name == ITEMS[i][keys[0]]) {
            $("#lblItemDescription").text(ITEMS[i][keys[1]]);
            $("#lblUnitPrice").text(ITEMS[i][keys[3]]);
            $("#lblQtyOnHand").text(ITEMS[i][keys[2]]);

        }

        qty = $("#lblQtyOnHand").text();
        $("#txtQty").attr("max", qty);
        $("#txtQty").attr("min", 0);
    }
});

//Add to Cart Function
var grandtot = 0;
$("#btnAddCart").click(function () {

    var customer = $('#lblCustomerName').text();
    var itemID = $('#cmbItemID').val();
    var itemDescription = $('#lblItemDescription').text();
    var qtyonHand = parseInt($('#lblQtyOnHand').text());
    var unitPrice = $('#lblUnitPrice').text();
    var qty = parseInt($('#txtQty').val());
    var tot = parseInt(unitPrice * qty);
    var lngth = $("#tblOrderDetails tbody tr").length;

    if ($("#btnAddCart").text() == "Update Cart") {
        var updateQty = $("#txtQty").val();

        for (i = 0; i < lngth; i++) {
            $("#tblOrderDetails tbody tr").find("td:nth-child(4)").text(updateQty);
        }
        reset();
        return;
    }

    for (i = 0; i < lngth; i++) {
        var tblID = $("#tblOrderDetails tbody tr").find("td:nth-child(1)").text();
        if (tblID == itemID) {
            var tblqty = $("#tblOrderDetails tbody tr").find("td:nth-child(4)").text();
            var newqty = qty + parseInt(tblqty);
            $("#tblOrderDetails tbody tr").find("td:nth-child(4)").text(newqty);

        }
        updateqty();
        reset();
        return;
    }

    if (customer == "") {
        alert("Empty Customer Records Are Not Allowed");
        return;
    }

    if (itemDescription == "") {
        alert("Empty Item Records Are Not Allowed");
        return;
    }

    if (qty == "") {
        alert("Select a Quantity");
        return;
    }

    if (qty > qtyonHand) {
        alert("Invalid Quantity");
        return;

    }

    //Update the Quantity on Hand in Database Function
    updateqty();

    $('#tblOrderDetails').append("<tr id='tablerow'><td>" + itemID + "</td><td>" + itemDescription + "</td><td>" + unitPrice + "</td><td>" + qty + "</td><td>" + tot + "</td><td>" + "<div id='image'></div>" + "</td></tr>");

    grandtot = grandtot + tot;
    $('#lblTotal').text(grandtot);

    //Delete Rows Function

    var deltot = 0;

    $('#tblOrderDetails tr td:last-child div').off("click");
    $('#tblOrderDetails tr td:last-child div').click(function () {

        $(this).parents("tr").hide(500);


        var alterQty = parseInt($(this).parents("tr").find('td:nth-child(4)').text());
        var id = $(this).parents("tr").find("td:first-child").text();
        for (i = 0; i < ITEMS.length; i++) {
            var key = ITEMS[i].code;
            if (id == key) {
                var qtyIn = parseInt(ITEMS[i].qtyOnHand);
                var newQt = qtyIn + alterQty
                ITEMS[i].qtyOnHand = newQt;

            }
        }

        deltot = $(this).parents("tr").find('td:nth-child(5)').text();
        grandtot = (grandtot - deltot);
        $('#lblTotal').text(grandtot);
        setTimeout(function () {
            $(this).parents("tr").remove();
        }, 600);

    });

    //Order Details Table Select Row Function
    $("#tblOrderDetails tbody tr").click(function () {
        var itemCode = $(this).children().first().text();
        var quantity = $(this).find("td:nth-child(4)").text();
        var total = $("#tblOrderDetails tbody tr td:nth-child(5)").text();
        var qtyhnd = 0;

        for (i = 0; i < ITEMS.length; i++) {
            var id = ITEMS[i].code;
            if (id == itemCode) {
                qtyhnd = ITEMS[i].qtyOnHand;
                var description = ITEMS[i].description;
                var untprc = ITEMS[i].unitPrice;

            }
        }

        $('#cmbItemID').val(itemCode);
        $("#lblItemDescription").text(description);
        $("#lblUnitPrice").text(untprc);
        $("#txtQty").val(quantity);
        $("#lblQtyOnHand").text(qtyhnd);
        $("#btnAddCart").html("Update Cart")

    });

    reset();
    $("#btnPlaceOrder").removeAttr("disabled");

});


$('#btnPlaceOrder').click(function () {
    var orderID = $('#lblOrderId').text();
    var orderDate = $('#lblOrderDate').text();
    var customerID = $('#cmbCustomerID').val();
    var customerName = $('#lblCustomerName').text();
    var orderTotal = $('#lblTotal').text();

    // $('#tblOrders').append("<tr><td>" + orderID + "</td><td>" + orderDate + "</td><td>" + customerID + "</td><td>" + customerName + "</td><td>" + orderTotal + "</td></tr>");


    $("#cmbCustomerID").attr("disabled", "disabled");
    $("#cmbItemID").attr("disabled", "disabled");
    $("#btnAddCart").attr("disabled", "disabled");
    $("#btnPlaceOrder").attr("disabled", "disabled");
    hardreset();
});





function reset() {

    $("#cmbItemID").val("~Select Item~");
    $("#lblItemDescription").text("");
    $("#lblUnitPrice").text("");
    $("#lblQtyOnHand").text("");
    $('#txtQty').val("");

};

function hardreset() {
    reset();
    $('#cmbCustomerID').val("~Select Customer~");
    $("#lblCustomerName").text("");
    $("#lblTotal").text("0.0")
    $("#tblOrderDetails tbody").empty();
    $("#btnAddCart").html(' <i class="fas fa-cart-plus"></i> Add to Cart')


}

function updateqty() {

    var QuantityOnHand = parseInt($('#lblQtyOnHand').text());
    var QuantityRequest = parseInt($('#txtQty').val());
    var newQtyOnHand = QuantityOnHand - QuantityRequest;

    for (i = 0; i < ITEMS.length; i++) {
        var id = $('#cmbItemID :selected').text();
        var key = ITEMS[i].code;
        if (id == key) {
            ITEMS[i].qtyOnHand = newQtyOnHand;
            $('lblQtyOnHand').text(newQtyOnHand);
        }
    }
};





