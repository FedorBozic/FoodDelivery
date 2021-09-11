package controller;

import java.awt.SystemColor;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import dao.RestaurantDao;
import dao.UserDao;
import model.Address;
import model.Item;
import model.Location;
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
    
    public static Route findById = (Request request, Response response) -> {
		try {
			response.status(200);
			return gson.toJson(restaurantDao.findById(request.params(":id")));
		}
		catch (Exception e){
			response.status(400);
			response.body("Invalid customer!");
		}
		return response;
	};
    
    public static Route addRestaurant = (Request request, Response response) -> {
        if (UserController.currentUser == null) {
            response.body("Not logged in!");
            response.status(400);
            return response;
        }
        if (UserController.currentUser.getRole() != User.Role.ADMIN) {
            response.body("Permission denied!");
            response.status(400);
            return response;
        }
    	var body = gson.fromJson((request.body()), HashMap.class);
    	
    	response.status(200);
    	
    	try {
	    	Restaurant restaurant = new Restaurant();
	    	restaurant.setName((String) body.get("name"));
	    	restaurant.setType((RestaurantType.valueOf((String) body.get("type"))));
	    	restaurant.setStatus((RestaurantStatus.valueOf((String) body.get("status"))));
	    	restaurant.setLogo((String) body.get("image"));
	    	restaurant.setManager((String) body.get("manager"));
	    	DostavaMain.userDao.findById((String) body.get("manager")).setRestaurant(restaurant);
	    	
	    	Address address = new Address((String) body.get("address"), (String) body.get("townName"), (String) body.get("postalCode"));
			Location location = new Location(Float.parseFloat(((String) body.get("latitude"))), Float.parseFloat(((String) body.get("longtitude"))), address);
	    	restaurant.setLocation(location);
	    	
	    	restaurantDao.newRestaurant(restaurant);
    	}
    	catch (Exception e) {
    		response.status(400);
    		response.body("Failed to add restaurant!");
    	}
    	
    	return response;
    };
    
    public static Route editRestaurant = (Request request, Response response) ->
    {
        if (UserController.currentUser == null) {
            response.status(400);
            return response;
        }
        
        var body = gson.fromJson((request.body()), HashMap.class);
        
        var message = "Restaurant updated!";
        
        try {
	        String idS = (String) body.get("uuid");
	        String name = (String) body.get("name");
	        String type = (String) body.get("type");
	        String status = (String) body.get("status");
	        String image = (String) body.get("logo");
	        
	        
	        Restaurant restaurant = DostavaMain.restaurantDao.findById(idS);
	        if (restaurant == null) {
	            response.status(400);
	            response.body("Restaurant does not exist");
	            return response;
	        }
	        
        	if (name == null || name.equals(""))
        		message = "Name can't be empty!";
            if (type == null || type.equals(""))
            	message = "Type can't be empty!";
            if (!message.equals("Restaurant updated!")) {
                response.status(400);
                response.body(message);
                return response;
            }
            
            double latitude = (double) body.get("latitude");
            double longitude  = (double) body.get("longitude");
            
            Address address = new Address((String) body.get("address"), (String) body.get("townName"), (String) body.get("postalCode"));
    		Location location = new Location((float) latitude,(float) longitude, address);
        	
        	restaurant.setName(name);
            restaurant.setType(RestaurantType.valueOf(type));
            restaurant.setStatus(RestaurantStatus.valueOf(status));
            restaurant.setLogo(image);
            restaurant.setLocation(location);
            
            response.status(200);

        } catch (Exception e) {
            message = "An error has occurred!";
            response.body(message);
            response.status(400);
            return response;
        }
        
        return response;
    };
    
    public static Route openCloseRestaurant = (Request request, Response response) ->
    {
        response.status(200);
        if (UserController.currentUser == null) {
            response.body("Not logged in!");
            response.status(400);
            return response;
        }
        if (UserController.currentUser.getRole() != User.Role.MANAGER) {
            response.body("Permission denied!");
            response.status(400);
            return response;
        }
        
        var body = gson.fromJson((request.body()), HashMap.class);
        
        try {
	        String id = (String) body.get("uuid");
	        System.out.println(id);
	        Restaurant r = DostavaMain.restaurantDao.findById(id);
	        RestaurantStatus rs = r.getStatus();
	        if(rs.equals(RestaurantStatus.CLOSED))
	        	r.setStatus(RestaurantStatus.OPEN);
	        else
	        	r.setStatus(RestaurantStatus.CLOSED);
        }
        catch (Exception e) {
        	response.status(400);
        	response.body("Failed to toggle restaurant!");
        }
        return response;
    };
    
    public static Route getRestaurants = (Request request, Response response) -> {
		return gson.toJson(restaurantDao.getAllRestaurants());
    };

    public static Route deleteRestaurant = (Request request, Response response) -> {
        if (UserController.currentUser == null) {
            response.body("Not logged in!");
            response.status(400);
            return response;
        }
        if (UserController.currentUser.getRole() != User.Role.ADMIN) {
            response.body("Permission denied!");
            response.status(400);
            return response;
        }
    	try {
    		restaurantDao.deleteRestaurant(request.queryParams("id"));
    		response.status(200);
    	}
    	catch (Exception e) {
    		response.status(400);
    		response.body("Failed to delete restaurant!");
    	}
    	return response;
    };
    
	public static Route getRestaurants() {
		// TODO Auto-generated method stub
		return null;
	}
}
