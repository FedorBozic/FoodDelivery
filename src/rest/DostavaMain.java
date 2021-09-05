package rest;

import static spark.Spark.*;

import java.io.File;
import java.io.IOException;

import com.google.gson.Gson;

import controller.UserController;
import dao.UserDao;
import model.User;

public class DostavaMain {
	
	public static Gson gson = new Gson();
	public static UserDao userDao = new UserDao();
	
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
		
		User testUser = new User();
		testUser.setUsername("Test");
		testUser.setFirstName("Test");
		testUser.setLastName("Test");
		userDao.newBuyer(testUser);
		
		get("/api/getUsers", (request,response) -> gson.toJson(userDao.getUsers()));
		get("/api/users/currentUser", (request,response) -> gson.toJson(UserController.currentUser));
		post("/api/users/newBuyer", UserController.newBuyer);
	}

}
