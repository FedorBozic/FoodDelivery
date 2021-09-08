package controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import model.Order;
import model.Cart;
import model.CartItem;
import model.Item;
import model.Restaurant;
import model.User;
import rest.DostavaMain;
import spark.Request;
import spark.Response;
import spark.Route;

public class OrderController {
	static Gson gson = new GsonBuilder()
            .setPrettyPrinting()
            .create();
	
	public static Route addOrder = (Request request, Response response) -> {
        
        var body = gson.fromJson((request.body()), HashMap.class);
        response.body("Successful checkout!");
        response.status(200);
        
        User user = DostavaMain.userDao.findById((String) body.get("uuid"));
        if(user == null)
        {
        	response.body("You are not logged in!");
            response.status(400);
            return response;
        }
        else if(user.getCart() == null || user.getCart().getCartItems().isEmpty())
        {
        	response.body("Your cart is empty!");
            response.status(400);
            return response;
        }
        
        Order newOrder = new Order();
        newOrder.setUuid(UUID.randomUUID());
        //newOrder.setRestaurant(user.getCart().getCartItems().get(0).getItem().getRestaurant());
        System.out.println(newOrder.getRestaurant().getUuid());
        
        for(CartItem ci : user.getCart().getCartItems())
        {
        	//user.setCart(null);
        	
        }
        
        /*User user = new User();
        List<Order> createdOrders = new ArrayList();
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
            
            User addedUser = DostavaMain.userDao.addUser(user);
        } catch (Exception e) {
            response.body("Not all fields have been filled!");
            response.status(400);
            return response;
        }*/
        
        return response;
    };
}
