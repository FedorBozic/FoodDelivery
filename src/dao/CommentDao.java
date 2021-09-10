package dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import controller.RestaurantController;
import model.Comment;
import model.DeliveryRequest;
import model.Restaurant;
import model.User;
import rest.DostavaMain;

public class CommentDao {
	private HashMap<UUID, Comment> comments = new HashMap<>();
	
	public CommentDao() { }
	
	public CommentDao(HashMap<UUID, Comment> comments) {
		super();
		this.comments = comments;
	}

	public HashMap<UUID, Comment> getComments() {
		return comments;
	}

	public void setOrders(HashMap<UUID, Comment> comments) {
		this.comments = comments;
	}
	
	// SEARCHES
	
    public List<Comment> getAllComments() {
    	return comments.values()
    			.stream()
    			.filter(comment -> !comment.isDeleted())
    			.collect(Collectors.toList());
    }
    
    public List<Comment> getAllCommentsApproved() {
    	return comments.values()
    			.stream()
    			.filter(comment -> comment.isApproved())
    			.filter(comment -> !comment.isRejected())
    			.filter(comment -> !comment.isDeleted())
    			.collect(Collectors.toList());
    }
	
	public Comment findById(UUID uuid) {
        return comments.getOrDefault(uuid, null);
    }
	
	public Comment findById(String uuid) {
        return findById(UUID.fromString(uuid));
    }
	
	public List<Comment> findByCustomer(User u) {
		return findByCustomer(u.getUuid());
    }
	
	public List<Comment> findByCustomer(String u) {
    	return findByCustomer(UUID.fromString(u));
    }
	
	public List<Comment> findByCustomer(UUID u) {
    	List<Comment> tmpStep = getAllComments()
                .stream()
                .filter(comment -> comment.getCustomer().getUuid() == u)
                .collect(Collectors.toList());
    	return tmpStep;
    }
	
	public List<Comment> findByRestaurant(Restaurant r) {
		return findByRestaurant(r.getUuid());
    }
	
	public List<Comment> findByRestaurant(String r) {
    	return findByRestaurant(UUID.fromString(r));
    }
	
	public List<Comment> findByRestaurant(UUID r) {
    	List<Comment> tmpStep = getAllComments()
                .stream()
                .filter(comment -> comment.getRestaurant().getUuid().equals(r))
                .collect(Collectors.toList());
    	return tmpStep;
    }
	
	public List<Comment> findByRestaurantApproved(String r) {
    	return findByRestaurantApproved(UUID.fromString(r));
    }
	
	public List<Comment> findByRestaurantApproved(UUID r) {
    	List<Comment> tmpStep = getAllCommentsApproved()
                .stream()
                .filter(comment -> comment.getRestaurant().getUuid().equals(r))
                .collect(Collectors.toList());
    	return tmpStep;
    }
	
    public Comment addComment(Comment comment) {
        var alreadyExisting = comments.values()
                .stream()
                .filter(commentInBase -> commentInBase.getUuid().equals(comment.getUuid()))
                .collect(Collectors.toList());
        if (alreadyExisting.size() == 0) {
        	comment.setUuid(UUID.randomUUID());
            comments.put(comment.getUuid(), comment);
            Restaurant restaurant = comment.getRestaurant();
    		restaurant.recalculateRating();
            return comment;
        }
        return null;
    }
    
	public boolean deleteComment(UUID id) {
		Comment comment = findById(id);
		comment.setDeleted(true);
		Restaurant restaurant = comment.getRestaurant();
		restaurant.recalculateRating();
		return true;
	}
	
	public boolean deleteComment(String id) {
		return deleteComment(UUID.fromString(id));
	}
}
