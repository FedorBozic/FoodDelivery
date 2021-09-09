package controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import model.Comment;
import model.User;
import rest.DostavaMain;
import spark.Request;
import spark.Response;
import spark.Route;

public class CommentController {
	static Gson gson = new GsonBuilder()
            .setPrettyPrinting()
            .create();
	
	public static Route findByUser = (Request request, Response response) ->
		gson.toJson(DostavaMain.commentDao.findByCustomer(request.params(":id")));
		
	public static Route findByRestaurant = (Request request, Response response) ->
		gson.toJson(DostavaMain.commentDao.findByRestaurant(request.params(":id")));
	
	public static Route addComment = (Request request, Response response) -> {
        
        var body = gson.fromJson((request.body()), HashMap.class);
        response.body("Comment added");
        response.status(200);
        
        User user = DostavaMain.userDao.findById((String) body.get("uuid"));
        if(user == null)
        {
        	response.body("You are not logged in!");
            response.status(400);
            return response;
        }
        
        String customerIdS = (String) body.get("customerId");
        String restaurantIdS = (String) body.get("restaurantId");
        String text = (String) body.get("text");
        String ratingS = (String) body.get("rating");
        
    	Comment comment = new Comment();
    	comment.setCustomer(DostavaMain.userDao.findById(customerIdS));
    	comment.setRestaurant(DostavaMain.restaurantDao.findById(restaurantIdS));
    	comment.setText(text);
    	comment.setApproved(false);
    	comment.setRating(Integer.parseInt(ratingS));
    	
    	DostavaMain.commentDao.addComment(comment);
    	        
        return response;
    };
}
