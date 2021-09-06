package rest;

import static spark.Spark.*;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

import com.google.gson.Gson;

import controller.UserController;
import dao.UserDao;
import dao.UserTypeDao;
import model.User;
import model.UserType;

public class DostavaMain {
	
	public static Gson gson = new Gson();
	public static UserDao userDao = new UserDao();
	public static UserTypeDao userTypeDao = new UserTypeDao();
	
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
		
		userTypeDao.addUserType(new UserType("BRONZE", 0, 0));
		userTypeDao.addUserType(new UserType("SILVER", 10, 100));
		userTypeDao.addUserType(new UserType("GOLD", 20, 500));
		
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
	}

}
