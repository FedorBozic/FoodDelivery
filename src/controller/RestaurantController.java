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
    
    public static Route findById = (Request request, Response response) ->
    	gson.toJson(restaurantDao.findById(request.params(":id")));
    
    public static Route newRestaurant = (Request request, Response response) -> {
    	
    	var body = gson.fromJson((request.body()), HashMap.class);
    	
    	response.status(200);
    	
    	Restaurant restaurant = new Restaurant();
    	restaurant.setName((String) body.get("name"));
    	restaurant.setType((RestaurantType.valueOf((String) body.get("type"))));
    	restaurant.setStatus((RestaurantStatus.valueOf((String) body.get("status"))));
    	restaurant.setLogo((String) body.get("image"));
    	restaurant.setManager((String) body.get("manager"));
    	DostavaMain.userDao.findById((String) body.get("manager")).setRestaurant(restaurant);
    	
    	// TEMPORARNO, UKLONITI POSLE
    	Address tmpAdd = new Address("Nikole Tesle 13", "Novi Sad", "21000");
		Location tmpLoc = new Location(0, 0, tmpAdd);
    	restaurant.setLocation(tmpLoc);
    	
    	restaurantDao.newRestaurant(restaurant);
    	
    	System.out.println(restaurant.getUuid());
    	System.out.println(DostavaMain.userDao.findById((String) body.get("manager")).getRestaurant().getUuid());
    	
    	System.out.println(restaurant.getManager().getUuid());
    	System.out.println(DostavaMain.userDao.findById((String) body.get("manager")).getUuid());
    	
    	return response;
    };
    
    public static Route getRestaurants = (Request request, Response response) -> {
		List<Restaurant> filtered = new ArrayList<Restaurant>();
		String name = request.queryParams("name");
		String type = request.queryParams("type");
		String location = request.queryParams("location");
		String rating = request.queryParams("rating");
		String open = request.queryParams("open");
		
		//CHECK CAST
		List<Restaurant> restaurants = new ArrayList<Restaurant>(restaurantDao.getRestaurants().values());
		
		for (Restaurant r : restaurants) {
			filtered.add(r);
		}
		
		System.out.println(type);
		if(type != null && !type.equals("ALL") && !type.equals("")) {
			filtered = filtered.stream().filter(r -> r.getType().equals(RestaurantType.valueOf(type))).collect(Collectors.toList());
		}
		
		System.out.println("Name: " + name);
		if(name != null && !name.equals("")) {
			filtered = filtered.stream().filter(r -> r.getName().toLowerCase().contains(name.toLowerCase())).collect(Collectors.toList());
		}
		
		System.out.println("Rating: " + rating);
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
		
		System.out.println("Open: " + open);
		if(open != null && open.equals("true")) {
			filtered = filtered.stream().filter(r -> r.getStatus().equals(RestaurantStatus.OPEN)).collect(Collectors.toList());
		}
		
		return gson.toJson(filtered);
    };

	public static Route getRestaurants() {
		// TODO Auto-generated method stub
		return null;
	}
	
	public static Restaurant findByid(UUID id) {
		return restaurantDao.findById(id);
	}
}
