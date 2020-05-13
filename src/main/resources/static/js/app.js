var api = apiclient;
var Module = (function () {

    function table(result) {
        $("#stats > tbody").empty();
        result.map(function (product) {
            $("#stats > tbody").append(
                "<tr> <td>" +
                product.productId +
                "</td>" +
                "<td>" +
                product.productName +
                "</td> " +
                "<td>" +
                product.productDescription +
                "</td> " +
                "<td>" +
                product.productPrice +
                "</td>" +
                "<td>" +
                product.productCant +
                "</td> " +
                "<td>" +
                product.productEntity +
                "</td> " +
                "</tr>"
            );
        });
    };
    
    return {        
        init: function () {
            api.getStatistics().then(function (data){
            table(data);});
        }
    };
}());