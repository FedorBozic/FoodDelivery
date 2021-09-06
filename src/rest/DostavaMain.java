package rest;

import static spark.Spark.*;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import com.google.gson.Gson;

import controller.RestaurantController;
import controller.UserController;
import dao.UserDao;
import dao.RestaurantDao;
import model.Address;
import model.Location;
import model.Restaurant;
import model.RestaurantStatus;
import model.RestaurantType;
import model.User;

public class DostavaMain {
	
	public static Gson gson = new Gson();
	public static UserDao userDao = new UserDao();
	public static RestaurantDao restaurantDao = new RestaurantDao();
	
	private static void createDummyData() {
		User testUser = new User();
		testUser.setUsername("Test");
		testUser.setFirstName("Test");
		testUser.setLastName("Test");
		userDao.newBuyer(testUser);
		
		Restaurant testRestaurant = new Restaurant();
		testRestaurant.setName("Restoran 1");
		testRestaurant.setStatus(RestaurantStatus.OPEN);
		testRestaurant.setType(RestaurantType.CHINESE);
		Address tmpAdd = new Address("Nikole Tesle 13", "Novi Sad", "21000");
		Location tmpLoc = new Location(0, 0, tmpAdd);
		testRestaurant.setLocation(tmpLoc);
		restaurantDao.newRestaurant(testRestaurant);
		
		testRestaurant = new Restaurant();
		testRestaurant.setName("Restoran 2");
		testRestaurant.setStatus(RestaurantStatus.CLOSED);
		testRestaurant.setType(RestaurantType.GRILL);
		tmpAdd = new Address("Nikole Tesle 14", "Novi Sad", "21000");
		tmpLoc = new Location(0, 0, tmpAdd);
		testRestaurant.setLocation(tmpLoc);
		restaurantDao.newRestaurant(testRestaurant);
	}
	
	public static void main(String[] args) {
		port(8080);
		
		try {
            staticFiles.externalLocation(new File("./static").getCanonicalPath());
        } catch (IOException e) {
            e.printStackTrace();
        }
		
		after((request, response) -> {
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Allow-Methods", "*");
        });
		
		createDummyData();
		RestaurantController.restaurantDao = restaurantDao;
		
		get("/api/getUsers", (request,response) -> gson.toJson(userDao.getUsers()));
        get("/api/users/logout", UserController.logOut);
        post("/api/users/login", UserController.logIn);
		get("/api/users/currentUser", (request,response) -> gson.toJson(UserController.currentUser));
		post("/api/users/newBuyer", UserController.newBuyer);
		
		get("/api/getRestaurants", (request,response) -> gson.toJson(restaurantDao.getRestaurants()));
		post("/api/restaurants/newRestaurant", RestaurantController.newRestaurant);
	}

}
