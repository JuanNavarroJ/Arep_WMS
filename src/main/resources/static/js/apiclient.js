apiclient = (function() {
    return {
        getStatistics: function() {
            var getPromise=$.ajax({
                dataType: "json",
                url: "/api/products",
            });
            return getPromise;
        }
    };
})();