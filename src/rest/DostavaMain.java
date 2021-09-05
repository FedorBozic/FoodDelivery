package rest;

import static spark.Spark.*;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.google.gson.Gson;

import model.User;

public class DostavaMain {
	
	public static Gson gson = new Gson();
	
	public static void main(String[] args) {
		port(8080);
		
		try {
            staticFiles.externalLocation(new File("./static").getCanonicalPath());
        } catch (IOException e) {
            e.printStackTrace();
        }
		
		List<User> users = new ArrayList<>();
		User testUser = new User();
		testUser.setUsername("Test");
		testUser.setFirstName("Test");
		testUser.setLastName("Test");
		users.add(testUser);
		
		get("/api/getUsers", (request, response) -> gson.toJson(
                users.stream()
                        .distinct().collect(Collectors.toList())));
		
		System.out.println("fdsf");
	}

}
