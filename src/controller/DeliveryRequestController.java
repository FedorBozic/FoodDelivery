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
	
	public static Route addDeliveryRequest = (Request request, Response response) -> {
        
        var body = gson.fromJson((request.body()), HashMap.class);
        response.body("Successfully created delivery request!");
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
        
        System.out.println("Created this thing");
        System.out.println(newDeliveryRequest.getRequester().getFirstName());
        System.out.println(newDeliveryRequest.getOrder().getRestaurant().getName());
        
        return response;
    };
}
