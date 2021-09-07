package controller;

import java.awt.SystemColor;
import java.util.HashMap;
import java.util.Map;

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
    	
    	// TEMPORARNO, UKLONITI POSLE
    	Address tmpAdd = new Address("Nikole Tesle 13", "Novi Sad", "21000");
		Location tmpLoc = new Location(0, 0, tmpAdd);
    	restaurant.setLocation(tmpLoc);
    	
    	Item tmpItem = new Item();
		tmpItem.setName("Sladoled");
		tmpItem.setDescription("Lep sladoled");
		tmpItem.setPrice(300);
		tmpItem.setType(Item.ItemType.FOOD);
		restaurant.addItem(tmpItem);
    	
    	restaurantDao.newRestaurant(restaurant);
    	
    	User user = userDao.findById((String) body.get("manager"));
    	user.setRestaurant(restaurant);

    	System.out.println(user.getFirstName() + " " + user.getLastName() + " " + user.getRestaurant().getName());
    	
    	return response;
    };
}
