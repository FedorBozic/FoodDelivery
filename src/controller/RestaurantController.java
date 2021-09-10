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
    public static User currentUser;
    
    static Gson gson = new GsonBuilder()
            .setPrettyPrinting()
            .create();
    
    public static Route findById = (Request request, Response response) ->
    	gson.toJson(restaurantDao.findById(request.params(":id")));
    
    public static Route addRestaurant = (Request request, Response response) -> {
    	
    	var body = gson.fromJson((request.body()), HashMap.class);
    	
    	response.status(200);
    	
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
    	
    	System.out.println(restaurant.getUuid());
    	System.out.println(DostavaMain.userDao.findById((String) body.get("manager")).getRestaurant().getUuid());
    	
    	System.out.println(restaurant.getManager().getUuid());
    	System.out.println(DostavaMain.userDao.findById((String) body.get("manager")).getUuid());
    	
    	return response;
    };
    
    public static Route editRestaurant = (Request request, Response response) ->
    {
        if (currentUser == null) {
            response.status(400);
            return response;
        }
        
        var body = gson.fromJson((request.body()), HashMap.class);
        
        String idS = (String) body.get("uuid");
        String name = (String) body.get("name");
        String type = (String) body.get("type");
        String status = (String) body.get("status");
        String image = (String) body.get("image");
        String managerS = (String) body.get("manager");
        
        //TODO: Dodavanje lokacije i errorcheck
        
        Restaurant restaurant = DostavaMain.restaurantDao.findById(idS);
        User manager = DostavaMain.userDao.findById(managerS);
        if (restaurant == null) {
            response.status(400);
            response.body("Restaurant does not exist");
            return response;
        }
        var message = "Restaurant updated!";
        try {
        	if (name == null || name.equals(""))
        		message = "Name can't be empty!";
            if (type == null || type.equals(""))
            	message = "Type can't be empty!";
            if (manager == null || manager.getRole() != User.Role.MANAGER || manager.getRestaurant() != null)
            	message = "Invalid manager!";
            if (!message.equals("Restaurant updated!")) {
                response.status(400);
                response.body(message);
                return response;
            }
            restaurant.setName(name);
            restaurant.setType(RestaurantType.valueOf(type));
            restaurant.setStatus(RestaurantStatus.valueOf(status));
            restaurant.setLogo(image);

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
        
        var body = gson.fromJson((request.body()), HashMap.class);
        
        String id = (String) body.get("uuid");
        System.out.println(id);
        Restaurant r = DostavaMain.restaurantDao.findById(id);
        RestaurantStatus rs = r.getStatus();
        if(rs.equals(RestaurantStatus.CLOSED))
        	r.setStatus(RestaurantStatus.OPEN);
        else
        	r.setStatus(RestaurantStatus.CLOSED);
        
        return response;
    };
    
    public static Route getRestaurants = (Request request, Response response) -> {
		List<Restaurant> filtered = new ArrayList<Restaurant>();
		String name = request.queryParams("name");
		String type = request.queryParams("type");
		String location = request.queryParams("location");
		String rating = request.queryParams("rating");
		String open = request.queryParams("open");
		
		List<Restaurant> restaurants = restaurantDao.getAllRestaurants();
		
		for (Restaurant r : restaurants) {
			filtered.add(r);
		}
		
		if(type != null && !type.equals("ALL") && !type.equals("")) {
			filtered = filtered.stream().filter(r -> r.getType().equals(RestaurantType.valueOf(type))).collect(Collectors.toList());
		}
		
		if(name != null && !name.equals("")) {
			filtered = filtered.stream().filter(r -> r.getName().toLowerCase().contains(name.toLowerCase())).collect(Collectors.toList());
		}
		
		//Ignore za sada, treba komentare prvo implementirati
		/*
		int ratingVal = Integer.parseInt(rating);
		if(rating != null && !rating.equals("") && ratingVal <= 5 && ratingVal >= 0) {
			filtered = filtered.stream().filter(r -> r.getRating().equals(name)).collect(Collectors.toList());
		}
		*/
		
		//Ne za sada
		/*
		if(location != null && !location.equals("")) {
		}
		*/
		
		if(open != null && open.equals("true")) {
			filtered = filtered.stream().filter(r -> r.getStatus().equals(RestaurantStatus.OPEN)).collect(Collectors.toList());
		}
		
		return gson.toJson(filtered);
    };

    public static Route deleteRestaurant = (Request request, Response response) -> {
    	restaurantDao.deleteRestaurant(request.params("id"));
    	return response;
    };
    
	public static Route getRestaurants() {
		// TODO Auto-generated method stub
		return null;
	}
}
