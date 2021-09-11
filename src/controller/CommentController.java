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
import model.Order;
import model.Restaurant;
import model.User;
import rest.DostavaMain;
import spark.Request;
import spark.Response;
import spark.Route;

public class CommentController {
	static Gson gson = new GsonBuilder()
            .setPrettyPrinting()
            .create();
	
	public static Route findByUser = (Request request, Response response) -> {
		try {
			response.status(200);
			return gson.toJson(DostavaMain.commentDao.findByCustomer(request.params(":id")));
		}
		catch (Exception e){
			response.status(400);
			response.body("Invalid customer!");
		}
		return response;
	};
		
		
	public static Route findByRestaurant = (Request request, Response response) -> {
		try {
			response.status(200);
			return gson.toJson(DostavaMain.commentDao.findByRestaurant(request.params(":id")));
		}
		catch (Exception e){
			response.status(400);
			response.body("Invalid restaurant!");
		}
		return response;
	};
		
		public static Route findByRestaurantApproved = (Request request, Response response) -> {
		try {
			response.status(200);
			return gson.toJson(DostavaMain.commentDao.findByRestaurantApproved(request.params(":id")));
		}
		catch (Exception e){
			response.status(400);
			response.body("Invalid restaurant!");
		}
		return response;
	};

	
	public static Route addComment = (Request request, Response response) -> {
        
        var body = gson.fromJson((request.body()), HashMap.class);
        response.body("Comment added");
        response.status(200);
        
        User user = DostavaMain.userDao.findById((String) body.get("customer"));
        if(user == null)
        {
        	response.body("You are not logged in!");
            response.status(400);
            return response;
        }
        
        try {
	        String customerIdS = (String) body.get("customer");
	        String restaurantIdS = (String) body.get("restaurant");
	        String text = (String) body.get("text");
	        double ratingS = (double) body.get("rating");
	        String orderS = (String) body.get("order");
	        
	    	Comment comment = new Comment();
	    	comment.setCustomer(DostavaMain.userDao.findById(customerIdS));
	    	comment.setRestaurant(DostavaMain.restaurantDao.findById(restaurantIdS));
	    	comment.setText(text);
	    	comment.setApproved(false);
	    	comment.setRating((int)ratingS);
	    	
	    	DostavaMain.orderDao.findById(orderS).setCommented(true);
	    	DostavaMain.commentDao.addComment(comment);
        }
        catch (Exception e) {
        	response.status(400);
        	response.body("Failed to add comment!");
        }
    	        
        return response;
    };
    
    public static Route approveComment = (Request request, Response response) -> {
        
        User user = UserController.currentUser;
        if(user == null)
        {
        	response.body("You are not logged in!");
            response.status(400);
            return response;
        }
        else if(user.getRole() != User.Role.MANAGER) {
        	response.body("Action not allowed!");
            response.status(400);
            return response;
        }
    	
        try {
	        var body = gson.fromJson((request.body()), HashMap.class);
	        response.body("Approved successfully!");
	        response.status(200);
	        
	        Comment comment = DostavaMain.commentDao.findById((String) body.get("uuid"));
	        comment.setApproved(true);
	        
	        Restaurant restaurant = DostavaMain.restaurantDao.findById(comment.getRestaurant().getUuid());
	        restaurant.recalculateRating();
        }
        catch (Exception e) {
        	response.status(400);
        	response.body("Failed to approve comment!");
        }
        
        return response;
	};
	
    public static Route rejectComment = (Request request, Response response) -> {
        
        User user = UserController.currentUser;
        if(user == null)
        {
        	response.body("You are not logged in!");
            response.status(400);
            return response;
        }
        else if(user.getRole() != User.Role.MANAGER) {
        	response.body("Action not allowed!");
            response.status(400);
            return response;
        }
    	
        try {
	        var body = gson.fromJson((request.body()), HashMap.class);
	        response.body("Rejected successfully!");
	        response.status(200);
	        
	        Comment comment = DostavaMain.commentDao.findById((String) body.get("uuid"));
	        comment.setRejected(true);
        }
        catch (Exception e) {
        	response.status(400);
        	response.body("Failed to reject comment!");
        }
        
        return response;
	};
    
    public static Route deleteComment = (Request request, Response response) -> {
    	try {
    		response.status(200);
    		response.body("Deleted successfully!");
    		DostavaMain.commentDao.deleteComment(request.params("id"));
    	}
    	catch (Exception e) {
        	response.status(400);
        	response.body("Failed to delete comment!");
    	}
    	return response;
    };
}
