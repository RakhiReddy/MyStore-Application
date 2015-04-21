var customerList;
var myRouter;

//Create the model for customer
var Customer = Backbone.Model.extend({

    idAttribute: "id",
});


//Create the model for customer list
var CustomerList = Backbone.Collection.extend({
    model: Customer,
    url: 'Customer.json' //Update this with the url for the original json
});


var OrdersView = Backbone.View.extend({

    model: Customer,
    template: '',
    initialize: function () {
        console.info("Initializing order view");
        this.template = $($("#order-template").html());

        this.render();
    },
    render: function () {

        var self = this.$el;
        var customer = this.model;
        var orders = customer.get("orders");

        console.info("rendering orders");
        for (var i = 0; i < orders.length; ++i) {


            var row = "<tr><td>" + orders[i].id
                    + "</td><td>" + orders[i].product
                    + "</td><td>" +"$"+orders[i].total
                    + "</td></tr>";

            $(this.template).append(row);
        }

        console.info(this.template);
        $(self).html(this.template);
        return this;
    }
});

//View for rendering all the customers
var CustomerListView = Backbone.View.extend({
    model: CustomerList,
    template: '',
    initialize: function () {
        this.template = $($("#customer-template").html());

        this.render();
    },
    render: function () {

        var self = this.$el;
        var table = $(this.template);


        for (var i = 0; i < this.model.length; ++i) {

            var customer = this.model.at(i);

            var row = "<tr><td>" + customer.get("name")
            + "</td><td>" + customer.get("city")
            + "</td><td>" +"$"+ customer.get("orderTotal")
            + "</td><td>" + customer.get("joined")
            + "</td><td><a href='#Orders/" + customer.get("id") + "'>" + customer.get("orders").length + "View Orders"+"</a></td></tr>";

            $(this.template).append(row);



        }
        $(self).html(this.template);

        //$(".customerrow").click(function () {

        //    console.info("Clicked");
        //    var id = $(this).attr("customerid");


        //});



        return this;
    },
});


var MyCustomRouter = Backbone.Router.extend({

    customer: null,

    routes: {
        "" : "handleCustomers",
        "Orders/:viewid": "handleCustomerOrders"
    },

    handleCustomers: function () {
        var customerListView = new CustomerListView({ el: $("#data-container"), model: customerList });
    },
    handleCustomerOrders: function (viewid) {
        var customer = customerList.get(viewid);
        var ordersView = new OrdersView({ el: $("#data-container"), model: customer });
    }
});



//We need an entry point to initiate rendering
$(document).ready(function () {


    customerList = new CustomerList();
    customerList.fetch({
        success: function () {
            console.info("Loaded " + customerList.length); // => 4 (collection have been populated)
            var customerListView = new CustomerListView({ el: $("#data-container"), model: customerList });

        }
    });

    myRouter = new MyCustomRouter();
    Backbone.history.start();

});
