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
import model.DeliveryRequest;
import model.Item;
import model.Restaurant;
import model.User;
import rest.DostavaMain;
import spark.Request;
import spark.Response;
import spark.Route;

public class DeliveryRequestController {
	static Gson gson = new GsonBuilder()
            .setPrettyPrinting()
            .create();
	
	public static Route getDeliveryRequestsByUser = (Request request, Response response) -> {
        
        var body = gson.fromJson((request.body()), HashMap.class);
        response.body("Successfully received deliveries!");
        response.status(200);
        
        User user = DostavaMain.userDao.findById(request.params(":id"));
        if(user == null)
        {
        	response.body("You are not logged in!");
            response.status(400);
            return response;
        }
        
        List<DeliveryRequest> userDeliveries = DostavaMain.deliveryRequestDao.getDeliveryRequestsByDeliverer(user.getUuid());
        
    	return gson.toJson(userDeliveries);
    };
    
    public static Route getDeliveriesByUser = (Request request, Response response) -> {
        
        var body = gson.fromJson((request.body()), HashMap.class);
        response.body("Successfully received deliveries!");
        response.status(200);
        
        User user = DostavaMain.userDao.findById(request.params(":id"));
        if(user == null)
        {
        	response.body("You are not logged in!");
            response.status(400);
            return response;
        }
        
        List<DeliveryRequest> userDeliveries = DostavaMain.deliveryRequestDao.getDeliveriesByDeliverer(user.getUuid());
        
    	return gson.toJson(userDeliveries);
    };
    
    public static Route getDeliveryRequestsByRestaurant = (Request request, Response response) -> {
        
        var body = gson.fromJson((request.body()), HashMap.class);
        response.body("Successfully received deliveries!");
        response.status(200);
        
        Restaurant r = DostavaMain.restaurantDao.findById(request.params(":id"));
        if(r == null)
        {
        	response.body("You do not have permission to access this!");
            response.status(400);
            return response;
        }
        
        List<DeliveryRequest> restaurantDeliveries = DostavaMain.deliveryRequestDao.getDeliveryRequestsByRestaurant(r.getUuid());
        
    	return gson.toJson(restaurantDeliveries);
    };
	
	public static Route addDeliveryRequest = (Request request, Response response) -> {
        
        var body = gson.fromJson((request.body()), HashMap.class);
        response.status(200);
        
        User user = DostavaMain.userDao.findById(request.params(":id"));
        if(user == null)
        {
        	response.body("You are not logged in!");
            response.status(400);
            return response;
        }
        
        DeliveryRequest newDeliveryRequest = new DeliveryRequest();
        newDeliveryRequest.setUuid(UUID.randomUUID());
        newDeliveryRequest.setOrder(DostavaMain.orderDao.findById((String) body.get("uuid")));
        newDeliveryRequest.setRequester(user);
        
        DostavaMain.deliveryRequestDao.addDeliveryRequest(newDeliveryRequest);
        
        return response;
    };
    
    public static Route approveDelivery = (Request request, Response response) -> {
        
        var body = gson.fromJson((request.body()), HashMap.class);
        response.status(200);
        
        DeliveryRequest deliveryRequest = DostavaMain.deliveryRequestDao.findById((String) body.get("uuid"));
        User user = DostavaMain.userDao.findById(request.params(":id"));

        deliveryRequest.setApproved(true);
        DostavaMain.deliveryRequestDao.removeUnapprovedDeliveryRequestsForOrder(deliveryRequest.getOrder());
        
        return response;
    };
}
