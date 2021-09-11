package controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import model.Order;
import model.Cart;
import model.CartItem;
import model.Item;
import model.Restaurant;
import model.RestaurantStatus;
import model.RestaurantType;
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
        
        try {
	        List<Restaurant> restaurantsInBasket = new ArrayList<>();
	        List<Order> createdOrders = new ArrayList<>();
	        
	        float totalPrice = 0;
	        
	        for(CartItem ci : user.getCart().getCartItems())
	        {
	        	if(!restaurantsInBasket.contains(ci.getItem().getRestaurant()))
	        	{
	        		System.out.println(ci.getItem().getRestaurant().getName());
	        		restaurantsInBasket.add(ci.getItem().getRestaurant());
	        		Order newOrder = new Order();
	        		newOrder.setUuid(UUID.randomUUID());
	        		newOrder.setRestaurant(ci.getItem().getRestaurant());
	        		newOrder.setRestaurantName(ci.getItem().getRestaurant().getName());
	        		newOrder.setCustomer(user.getUuid());
	        		newOrder.setCustomerName(user.getUsername());
	        		newOrder.setPrice(0);
	        		newOrder.setStatus(Order.OrderStatus.PROCESSING);
	        		newOrder.setDateTime(LocalDateTime.now());
	        		createdOrders.add(newOrder);
	        	}
	        }
	        
	        for(CartItem ci : user.getCart().getCartItems())
	        {
	        	for(Order order : createdOrders)
	        	{
	        		if(ci.getItem().getRestaurant().getUuid().equals(order.getRestaurant().getUuid()))
	        		{
	        			order.addItem(ci);
	        			order.setPrice(order.getPrice() + (ci.getItem().getPrice() * ci.getCount()));
	        			totalPrice += order.getPrice();
	        		}
	        	}
	        }
	        
	        for(Order order : createdOrders)
	        {
	        	DostavaMain.orderDao.addOrder(order);
	        }
	        user.setCart(null);
	        user.giveLoyaltyPoints(totalPrice);
	        
        	response.status(200);
        	response.body("Order added successfully!");
        }
        catch (Exception e) {
        	response.status(400);
        	response.body("Failed to add order!");
        }
        return response;
    };
    
    public static Route upgradeStatus = (Request request, Response response) -> {
        
        var body = gson.fromJson((request.body()), HashMap.class);
        response.body("Successful upgrade!");
        response.status(200);
        
        try {
	        Order order = DostavaMain.orderDao.findById((String) body.get("uuid"));
	        if(order.getStatus().equals(Order.OrderStatus.PROCESSING))
	        	order.setStatus(Order.OrderStatus.PREPARATION);
	        else if(order.getStatus().equals(Order.OrderStatus.PREPARATION))
	        	order.setStatus(Order.OrderStatus.AWAITING_DELIVERY);
	        else if(order.getStatus().equals(Order.OrderStatus.AWAITING_DELIVERY))
	        	order.setStatus(Order.OrderStatus.IN_TRANSPORT);
	        else if(order.getStatus().equals(Order.OrderStatus.IN_TRANSPORT))
	        	order.setStatus(Order.OrderStatus.DELIVERED);
        }
        catch (Exception e) {
        	response.status(400);
        	response.body("Failed to upgrade status!");
        }
        return response;
	};
    
    public static Route getOrders = (Request request, Response response) -> {
		return gson.toJson(DostavaMain.orderDao.getAllOrders());
    };
    
    public static Route getCustomerOrders = (Request request, Response response) -> {
		List<Order> orders = new ArrayList<Order>();
		
		orders = DostavaMain.orderDao.getAllOrders().stream()
				.filter(order -> order.getCustomer().equals(UUID.fromString(request.params(":id"))))
				.collect(Collectors.toList());
		
		return gson.toJson(orders);
    };
    
    public static Route cancelOrder = (request, response) ->  {
    	response.status(200);
    	response.body("Order canceled successfully!");
    	try {
    		DostavaMain.orderDao.cancelOrder(request.params("id"));
    	}
    	catch (Exception e) {
        	response.status(400);
        	response.body("Failed to cancel order!");
    	}
    	return gson.toJson(DostavaMain.orderDao.getAllOrders());
    };
    
    public static Route deleteOrder = (request, response) ->  {
    	response.status(200);
    	response.body("Order canceled successfully!");
    	try {
    		DostavaMain.orderDao.deleteOrder(request.queryParams("id"));
    	}
    	catch (Exception e) {
        	response.status(400);
        	response.body("Failed to cancel order!");
    	}
    	return response;
    };

}
