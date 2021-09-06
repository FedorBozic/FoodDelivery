package rest;

import static spark.Spark.*;

import java.io.File;
import java.io.IOException;
import java.util.UUID;
import java.util.ArrayList;
import java.util.HashMap;

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
import dao.UserTypeDao;
import model.User;
import model.UserType;

public class DostavaMain {
	
	public static Gson gson = new Gson();
	public static UserDao userDao = new UserDao();
	public static UserTypeDao userTypeDao = new UserTypeDao();
	public static RestaurantDao restaurantDao = new RestaurantDao();
	
	private static void createDummyData() {
		User defaultAdmin = new User();
		defaultAdmin.setUsername("DefaultAdmin");
		defaultAdmin.setPassword("ftn");
		defaultAdmin.setFirstName("Fedor");
		defaultAdmin.setLastName("Bozic");
		defaultAdmin.setGender(User.Gender.valueOf("MALE"));
		defaultAdmin.setRole(User.Role.valueOf("ADMIN"));
		defaultAdmin.setType(userTypeDao.findByName("ADMIN"));
		userDao.newBuyer(defaultAdmin);
		
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
		
		userTypeDao.addUserType(new UserType("BRONZE", 0, 0, "saddlebrown", "sandybrown"));
		userTypeDao.addUserType(new UserType("SILVER", 10, 100, "grey", "silver"));
		userTypeDao.addUserType(new UserType("GOLD", 20, 500, "gold", "palegoldenrod"));
		userTypeDao.addUserType(new UserType("ADMIN", -1, -1, "royalblue", "dodgerblue"));
		
		createDummyData();
		RestaurantController.restaurantDao = restaurantDao;
		
		User testUser = new User();
		testUser.setUsername("Test");
		testUser.setFirstName("Test");
		testUser.setLastName("Test");
		userDao.newBuyer(testUser);
		
		get("/api/getUsers", (request,response) -> gson.toJson(userDao.getUsers()));
		
        get("/api/users/logout", UserController.logOut);
        post("/api/users/login", UserController.logIn);
		get("/api/users/currentUser", (request,response) -> gson.toJson(UserController.currentUser));
		post("/api/users/newBuyer", UserController.newBuyer);
		put("api/users/edit", "application/json", UserController.editUser);
		
		get("/api/getRestaurants", (request,response) -> gson.toJson(restaurantDao.getRestaurants()));
		post("/api/restaurants/newRestaurant", RestaurantController.newRestaurant);
	}

}
