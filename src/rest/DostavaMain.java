package rest;

import static spark.Spark.*;

import java.io.File;
import java.io.IOException;
import java.util.UUID;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.google.gson.Gson;

import controller.CommentController;
import controller.DeliveryRequestController;
import controller.OrderController;
import controller.RestaurantController;
import controller.UserController;
import dao.UserDao;
import dao.CommentDao;
import dao.DeliveryRequestDao;
import dao.OrderDao;
import dao.RestaurantDao;
import model.Address;
import model.Cart;
import model.CartItem;
import model.Comment;
import model.Item;
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
	public static OrderDao orderDao = new OrderDao();
	public static DeliveryRequestDao deliveryRequestDao = new DeliveryRequestDao();
	public static CommentDao commentDao = new CommentDao();
	
	private static void createDummyData() {
		User defaultAdmin = new User();
		defaultAdmin.setUsername("ftn");
		defaultAdmin.setPassword("ftn");
		defaultAdmin.setFirstName("Fedor");
		defaultAdmin.setLastName("Bozic");
		defaultAdmin.setGender(User.Gender.valueOf("MALE"));
		defaultAdmin.setRole(User.Role.valueOf("ADMIN"));
		defaultAdmin.setType(userTypeDao.findByName("ADMIN"));
		userDao.addUser(defaultAdmin);
		
		User defaultManager = new User();
		defaultManager.setUsername("mng");
		defaultManager.setPassword("mng");
		defaultManager.setFirstName("Marko");
		defaultManager.setLastName("Markovic");
		defaultManager.setGender(User.Gender.valueOf("MALE"));
		defaultManager.setRole(User.Role.MANAGER);
		defaultManager.setType(userTypeDao.findByName("STAFF"));
		userDao.addUser(defaultManager);
		
		User defaultDelivery = new User();
		defaultDelivery.setUsername("del");
		defaultDelivery.setPassword("del");
		defaultDelivery.setFirstName("Marko");
		defaultDelivery.setLastName("Markovic");
		defaultDelivery.setGender(User.Gender.valueOf("MALE"));
		defaultDelivery.setRole(User.Role.DELIVERY);
		defaultDelivery.setType(userTypeDao.findByName("STAFF"));
		userDao.addUser(defaultDelivery);
		
		User defaultCustomer = new User();
		defaultCustomer.setUsername("cus");
		defaultCustomer.setPassword("cus");
		defaultCustomer.setFirstName("Branko");
		defaultCustomer.setLastName("Brankovic");
		defaultCustomer.setGender(User.Gender.valueOf("MALE"));
		defaultCustomer.setRole(User.Role.CUSTOMER);
		defaultCustomer.setType(userTypeDao.findByName("BRONZE"));
		
		Item tmpItem = new Item();
		tmpItem.setName("Sladoled");
		tmpItem.setDescription("Lep sladoled");
		tmpItem.setPrice(300);
		tmpItem.setType(Item.ItemType.FOOD);
		
		userDao.addUser(defaultCustomer);
		Restaurant defaultRestaurant = new Restaurant();
		defaultRestaurant.setName("ftnE Grill");
		defaultRestaurant.setStatus(RestaurantStatus.OPEN);
		defaultRestaurant.setType(RestaurantType.GRILL);
		Address tmpAdd = new Address("Nikole Tesle 13", "Novi Sad", "21000");
		Location tmpLoc = new Location(0, 0, tmpAdd);
		defaultRestaurant.setLocation(tmpLoc);
		defaultRestaurant.setManager(defaultManager);
		defaultManager.setRestaurant(defaultRestaurant);
		restaurantDao.newRestaurant(defaultRestaurant);
		
		tmpItem.setRestaurant(defaultRestaurant);
		defaultRestaurant.addItem(tmpItem);
		
		commentDao.addComment(new Comment(UUID.randomUUID(), defaultCustomer, defaultRestaurant, "ok", 4, true));
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
		userTypeDao.addUserType(new UserType("STAFF", -1, -1, "darkgreen", "forestgreen"));
		userTypeDao.addUserType(new UserType("ADMIN", -1, -1, "royalblue", "dodgerblue"));
		
		createDummyData();
		RestaurantController.restaurantDao = restaurantDao;
		RestaurantController.userDao = userDao;
		
		get("/api/getUsers", (request,response) -> gson.toJson(userDao.getUsers()));
		get("/api/users/managers", (request,response) -> gson.toJson(userDao.getManagers()));
		get("/api/users/availablemanagers", (request,response) -> gson.toJson(userDao.getAvailableManagers()));
        get("/api/users/logout", UserController.logOut);
        post("/api/users/login", UserController.logIn);
		get("/api/users/currentUser", (request,response) -> gson.toJson(UserController.currentUser));
		post("/api/users/newBuyer", UserController.newBuyer);
		post("/api/users/adduser", UserController.addUser);
		put("api/users/edit", "application/json", UserController.editUser);
		get("/api/users/getCart", UserController.getCart);
		post("/api/users/itemToCart", UserController.itemToCart);
		
		post("/api/users/newItem", UserController.newItemToRestaurant); //Zasto je ovo u /users/ ?
		post("/api/users/overwriteItem", UserController.overwriteItem);
		
		get("/api/orders/getorders/:id", OrderController.getOrders);
		get("/api/orders/getcustomerorders/:id", OrderController.getCustomerOrders);
		get("/api/orders/awaitingdeliveryorders/:id", (request,response) -> gson.toJson(orderDao.getAvailableOpenDeliveries(request.params(":id"))));
		post("/api/orders/checkout", OrderController.addOrder);
		put("/api/orders/upgradestatus", OrderController.upgradeStatus);
		get("api/orders/:id", OrderController.findByRestaurant);
		put("/api/orders/cancel/:id", OrderController.cancelOrder);
		
		get("/api/delivery/userdeliveries/:id", DeliveryRequestController.getDeliveryRequestsByUser);
		get("/api/delivery/mydeliveries/:id", DeliveryRequestController.getDeliveriesByUser);
		get("/api/delivery/opendeliveryrequestsforrestaurant/:id", DeliveryRequestController.getDeliveryRequestsByRestaurant);
		post("/api/delivery/requestdelivery/:id", DeliveryRequestController.addDeliveryRequest);
		post("/api/delivery/approvedelivery/:id", DeliveryRequestController.approveDelivery);
		
		get("/api/getRestaurants", RestaurantController.getRestaurants);
		get("/api/restaurants/getRestaurants", (request,response) -> gson.toJson(restaurantDao.getRestaurants()));
		post("/api/restaurants/newRestaurant", RestaurantController.addRestaurant);
		get("api/restaurants/:id", RestaurantController.findById);
		put("api/restaurants/edit", "application/json", RestaurantController.editRestaurant);
		
		get("api/comments/:id", CommentController.findByRestaurant);
	}

}
