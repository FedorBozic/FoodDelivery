package controller;

import java.util.HashMap;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

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
            user.setFirstName((String) body.get("firstName"));
            user.setLastName((String) body.get("lastName"));
            
            User addedUser = DostavaMain.userDao.newBuyer(user);

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
}
