package controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import model.Order;
import model.Cart;
import model.CartItem;
import model.Item;
import model.Restaurant;
import model.User;
import rest.DostavaMain;
import spark.Request;
import spark.Response;
import spark.Route;

public class OrderController {
	static Gson gson = new GsonBuilder()
            .setPrettyPrinting()
            .create();
	
	public static Route findByRestaurant = (Request request, Response response) ->
		gson.toJson(DostavaMain.orderDao.findByRestaurant(request.params(":id")));
	
	public static Route addOrder = (Request request, Response response) -> {
        
        var body = gson.fromJson((request.body()), HashMap.class);
        response.body("Successful checkout!");
        response.status(200);
        
        User user = DostavaMain.userDao.findById((String) body.get("uuid"));
        if(user == null)
        {
        	response.body("You are not logged in!");
            response.status(400);
            return response;
        }
        else if(user.getCart() == null || user.getCart().getCartItems().isEmpty())
        {
        	response.body("Your cart is empty!");
            response.status(400);
            return response;
        }
        
        Order newOrder = new Order();
        newOrder.setUuid(UUID.randomUUID());
        newOrder.setRestaurant(user.getCart().getCartItems().get(0).getItem().getRestaurant());
        newOrder.setCustomerName(user.getUsername());
        newOrder.setStatus(Order.OrderStatus.PROCESSING);
        
        for(CartItem ci : user.getCart().getCartItems())
        {
        	newOrder.addItem(ci);
        }
        DostavaMain.orderDao.addOrder(newOrder);
        user.setCart(null);
        
        return response;
    };
    
    public static Route upgradeStatus = (Request request, Response response) -> {
        
        var body = gson.fromJson((request.body()), HashMap.class);
        response.body("Successful upgrade!");
        response.status(200);
        
        Order order = DostavaMain.orderDao.findById((String) body.get("uuid"));
        if(order.getStatus().equals(Order.OrderStatus.PROCESSING))
        	order.setStatus(Order.OrderStatus.PREPARATION);
        else if(order.getStatus().equals(Order.OrderStatus.PREPARATION))
        	order.setStatus(Order.OrderStatus.AWAITING_DELIVERY);
        else if(order.getStatus().equals(Order.OrderStatus.AWAITING_DELIVERY))
        	order.setStatus(Order.OrderStatus.IN_TRANSPORT);
        else if(order.getStatus().equals(Order.OrderStatus.IN_TRANSPORT))
        	order.setStatus(Order.OrderStatus.DELIVERED);
        
        return response;
    };
}
