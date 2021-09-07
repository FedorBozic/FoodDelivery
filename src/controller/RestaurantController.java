package controller;

import java.awt.SystemColor;
import java.util.HashMap;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import dao.RestaurantDao;
import dao.UserDao;
import model.Restaurant;
import model.RestaurantStatus;
import model.RestaurantType;
import model.User;
import rest.DostavaMain;
import spark.Request;
import spark.Response;
import spark.Route;

public class RestaurantController {
    public static RestaurantDao restaurantDao;
    public static UserDao userDao;
    
    static Gson gson = new GsonBuilder()
            .setPrettyPrinting()
            .create();
    
    public static Route newRestaurant = (Request request, Response response) -> {
    	
    	var body = gson.fromJson((request.body()), HashMap.class);
    	
    	response.status(200);
    	
    	System.out.println((String) body.get("name"));
    	System.out.println((String) body.get("type"));
    	System.out.println((String) body.get("status"));
    	System.out.println((String) body.get("manager"));
    	System.out.println("Image: " + ((String) body.get("image")).substring(0, 100));
    	
    	Restaurant restaurant = new Restaurant();
    	restaurant.setName((String) body.get("name"));
    	restaurant.setType((RestaurantType.valueOf((String) body.get("type"))));
    	restaurant.setStatus((RestaurantStatus.valueOf((String) body.get("status"))));
    	restaurant.setLogo((String) body.get("image"));
    	
    	restaurantDao.newRestaurant(restaurant);
    	
    	User user = userDao.findById((String) body.get("manager"));
    	user.setRestaurant(restaurant);

    	System.out.println(user.getFirstName() + " " + user.getLastName() + " " + user.getRestaurant().getName());
    	
    	return response;
    };
}
