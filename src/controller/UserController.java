package controller;

import java.awt.SystemColor;
import java.util.HashMap;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import model.Cart;
import model.CartItem;
import model.Item;
import model.Restaurant;
import model.RestaurantStatus;
import model.RestaurantType;
import model.User;
import rest.DostavaMain;
import spark.Request;
import spark.Response;
import spark.Route;

public class UserController {
    public static User currentUser;
    
    static Gson gson = new GsonBuilder()
            .setPrettyPrinting()
            .create();
    
    public static Route newBuyer = (Request request, Response response) -> {
    	
        if (currentUser != null) {
            response.body("Cannot register when already logged in !");
            response.status(400);
            return response;
        }
        
        var body = gson.fromJson((request.body()), HashMap.class);
        
        User user = new User();
        try {
        	user.setUsername((String) body.get("username"));
        	user.setPassword((String) body.get("password"));
            user.setFirstName((String) body.get("firstName"));
            user.setLastName((String) body.get("lastName"));
            user.setGender(User.Gender.valueOf((String) body.get("gender")));
            user.setType(DostavaMain.userTypeDao.findByName("BRONZE"));
            if(body.get("role") != null && !((String) body.get("role")).isEmpty())
            {
            	user.setRole(User.Role.valueOf((String) body.get("role")));
            }
            user.setRole(User.Role.valueOf("CUSTOMER"));
            
            User addedUser = DostavaMain.userDao.addUser(user);

            if (addedUser != null) {
                response.body("Registration successful!");
                response.status(200);
                request.session().attribute("currentUser", addedUser);
                currentUser = addedUser;
            }
        } catch (Exception e) {
            response.body("Not all fields have been filled!");
            response.status(400);
            return response;
        }
        
        return response;
    };
    
    public static Route addUser = (Request request, Response response) -> {
        
        var body = gson.fromJson((request.body()), HashMap.class);
        User user = null;
        boolean overwritingUserMode = false;
        
        if(body.get("uuid") == null || ((String) body.get("uuid")).equals("nouuid"))
        {
        	user = new User();
        }
        else
        {
        	user = DostavaMain.userDao.findById((String) body.get("uuid"));
        	overwritingUserMode = true; 
        }
        
        if(user == null)
        {
        	response.status(400);
        	response.body("An unknown error has occurred");
        }
        
        try {
        	user.setUsername((String) body.get("username"));
        	user.setPassword((String) body.get("password"));
            user.setFirstName((String) body.get("firstName"));
            user.setLastName((String) body.get("lastName"));
            user.setGender(User.Gender.valueOf((String) body.get("gender")));
            user.setType(DostavaMain.userTypeDao.findByName("BRONZE"));
            if(body.get("role") != null && !((String) body.get("role")).isEmpty())
            {
            	user.setRole(User.Role.valueOf((String) body.get("role")));
            	if(!((String) body.get("role")).equals("CUSTOMER"))
            	{
            		user.setType(DostavaMain.userTypeDao.findByName("STAFF"));
            	}
            }
            else
            {
            	user.setRole(User.Role.valueOf("CUSTOMER"));
            }
            
            if(!overwritingUserMode)
            {
            	DostavaMain.userDao.addUser(user);
            }
        } catch (Exception e) {
            response.body("Not all fields have been filled!");
            response.status(400);
            return response;
        }
        
        return response;
    };

    public static Route logOut = (Request request, Response response)
            ->
    {
        request.session().invalidate();
        currentUser = null;
        return response;
    };
    
    public static Route logIn = (Request request, Response response)
            ->
    {
        if (currentUser != null) {
            response.body("You are already logged in!");
            response.status(400);
            return response;
        }

        var body = gson.fromJson((request.body()), HashMap.class);

        User user = DostavaMain.userDao.findByUsernameAndPassword(body.getOrDefault("username", "-1").toString(),
                body.getOrDefault("password", "-1").toString());

        if (user != null) {
            request.session().attribute("currentUser", user);
            currentUser = user;
            response.body(gson.toJson(user));
            response.status(200);
        } else {
            response.body("Username or password incorrect!");
            response.status(400);
        }

        return response;
    };
    
    public static Route editUser = (Request request, Response response) ->
    {
        if (currentUser == null) {
            response.status(400);
            return response;
        }
        var body = gson.fromJson((request.body()), HashMap.class);
        User user = DostavaMain.userDao.findById((String) body.get("uuid"));
        if (user == null) {
            response.status(400);
            response.body("User does not exist");
            return response;
        }
        var message = "Profile updated!";
        try {
        	if (body.get("firstName") == null || body.get("firstName").equals("")) message = "First name can't be empty!";
            if (body.get("lastName") == null || body.get("lastName").equals("")) message = "Last name can't be empty!";
            if (!message.equals("Profile updated!")) {
                response.status(400);
                response.body(message);
                return response;
            }
            user.setFirstName((String) body.get("firstName"));
            user.setLastName((String) body.get("lastName"));
            user.setGender(User.Gender.valueOf((String) body.get("gender")));

        } catch (Exception e) {
            message = "An error has occurred!";
            response.body(message);
            response.status(400);
            return response;
        }
        return response;
    };
    
    public static Route getCart = (Request request, Response response) -> {
    	response.status(200);
    	response.body(gson.toJson(currentUser.getCart()));
    	return response;
    };
    
    public static Route newItemToRestaurant = (Request request, Response response) -> {
    	response.status(200);
    	
    	var body = gson.fromJson((request.body()), HashMap.class);
    	
        if (currentUser == null) {
            response.body("Not logged in!");
            response.status(400);
            return response;
        
        }
    	
    	String name = (String) body.get("name");
    	Item.ItemType type = Item.ItemType.valueOf(((String) body.get("type")));
    	String description = (String) body.get("description");
    	float price = Float.parseFloat(((String) body.get("price")));
    	//int amount = Integer.parseInt((String) body.get("amount"));
    	int amount = 0;
    	String image = (String) body.get("image");
    	
    	Item item = new Item();
    	item.setName(name);
    	item.setType(type);
    	item.setAmount(amount);
    	item.setDescription(description);
    	item.setPrice(price);
    	item.setImage(image);
    	
    	if(body.get("restaurant") != null && DostavaMain.restaurantDao.findById((String) body.get("restaurant")) != null)
    	{
    		DostavaMain.restaurantDao.findById((String) body.get("restaurant")).addItem(item);
        	item.setRestaurant(DostavaMain.restaurantDao.findById((String) body.get("restaurant")));
    	}
    	else
    	{
    		currentUser.getRestaurant().getItems().add(item);
    	}
    	
    	/*Restaurant restaurant = new Restaurant();
    	restaurant.setName((String) body.get("name"));
    	restaurant.setType((RestaurantType.valueOf((String) body.get("type"))));
    	restaurant.setStatus((RestaurantStatus.valueOf((String) body.get("status"))));
    	restaurant.setLogo((String) body.get("image"));
    	
    	restaurantDao.newRestaurant(restaurant);
    	
    	User user = userDao.findById((String) body.get("manager"));
    	user.setRestaurant(restaurant);

    	System.out.println(user.getFirstName() + " " + user.getLastName() + " " + user.getRestaurant().getName());*/
    	
        return response;
    };
    
    public static Route itemToCart = (Request request, Response response) -> {
    	response.status(200);
    	
    	var body = gson.fromJson((request.body()), HashMap.class);
    	
        if (currentUser == null) {
            response.body("Not logged in!");
            response.status(400);
            return response;
        }
    	
    	Restaurant r = DostavaMain.restaurantDao.findById((String) body.get("restaurant"));
    	Item itemToAdd = r.findItemByName((String) body.get("name"));
    	
    	String purchaseAmountS = (String) body.get("purchase_amount");
    	int amount;
    	if(purchaseAmountS == null || purchaseAmountS.equals(""))
    	{
    		amount = 1;
    	}
    	else
    	{
    		try {
    			amount = Integer.parseInt(purchaseAmountS);
    		}
    		catch (Exception e){
    			amount = 1; //Ili ovo, ili skroz da rejectuje?
    		}
    	}
    	if(amount < 1)
    		amount = 1;
    	
    	//int amount = 1;
    	CartItem cartItem = new CartItem(itemToAdd, amount);
    	
    	if(currentUser.getCart() == null)
    	{
    		currentUser.setCart(new Cart());
    		currentUser.getCart().setUser(currentUser);
    	}
    	
    	currentUser.getCart().addCartItem(cartItem);
    	
        return response;
    };
    
    public static Route overwriteItem = (Request request, Response response) -> {
    	response.status(200);
    	
    	var body = gson.fromJson((request.body()), HashMap.class);
    	
    	Restaurant r = DostavaMain.restaurantDao.findById((String) body.get("restaurant"));
    	Item itemToOverwrite = r.findItemById((String) body.get("uuid"));

    	String name = (String) body.get("name");
    	Item.ItemType type = Item.ItemType.valueOf(((String) body.get("type")));
    	String description = (String) body.get("description");
    	float price = Float.parseFloat(((String) body.get("price")));
    	int amount = 0;
    	String image = (String) body.get("image");
    	
    	if(r.findItemByName(name) != null && !r.findItemByName(name).getUuid().equals(itemToOverwrite.getUuid()))
    	{
    		response.status(400);
    		response.body("Invalid name: name is already taken by another item!");
    		return response;
    	}
    	
    	itemToOverwrite.setName(name);
    	itemToOverwrite.setType(type);
    	itemToOverwrite.setAmount(amount);
    	itemToOverwrite.setDescription(description);
    	itemToOverwrite.setPrice(price);
    	itemToOverwrite.setImage(image);
    	
        return response;
    };
    
    public static Route deleteUser = (Request request, Response response) -> {
    	DostavaMain.userDao.deleteUser(request.params("id"));
    	return response;
    };
}
