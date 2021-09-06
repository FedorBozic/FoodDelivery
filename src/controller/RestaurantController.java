package controller;

import java.awt.SystemColor;
import java.util.HashMap;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import dao.RestaurantDao;
import model.Restaurant;
import model.RestaurantStatus;
import model.RestaurantType;
import rest.DostavaMain;
import spark.Request;
import spark.Response;
import spark.Route;

public class RestaurantController {
    public static RestaurantDao restaurantDao;
    
    static Gson gson = new GsonBuilder()
            .setPrettyPrinting()
            .create();
    
    public static Route newRestaurant = (Request request, Response response) -> {
    	
    	var body = gson.fromJson((request.body()), HashMap.class);
    	
    	response.status(200);
    	
    	System.out.println((String) body.get("name"));
    	System.out.println((String) body.get("type"));
    	System.out.println((String) body.get("status"));
    	System.out.println("Image: " + ((String) body.get("image")).substring(0, 100));
    	
    	Restaurant restaurant = new Restaurant();
    	restaurant.setName((String) body.get("name"));
    	restaurant.setType((RestaurantType.valueOf((String) body.get("type"))));
    	restaurant.setStatus((RestaurantStatus.valueOf((String) body.get("status"))));
    	restaurant.setLogo((String) body.get("image"));
    	
    	restaurantDao.newRestaurant(restaurant);
    	
    	return response;
    };
}
