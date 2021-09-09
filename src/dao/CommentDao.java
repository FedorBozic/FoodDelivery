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
	
	public Comment findById(String uuid) {
        return comments.getOrDefault(UUID.fromString(uuid), null);
    }
	
	public List<Comment> findByCustomer(User u) {
		return findByCustomer(u.getUuid());
    }
	
	public List<Comment> findByCustomer(String u) {
    	return findByCustomer(UUID.fromString(u));
    }
	
	public List<Comment> findByCustomer(UUID u) {
    	List<Comment> tmpStep = comments.values()
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
    	List<Comment> tmpStep = comments.values()
                .stream()
                .filter(comment -> comment.getRestaurant().getUuid() == r)
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
            return comment;
        }
        return null;
    }
}
