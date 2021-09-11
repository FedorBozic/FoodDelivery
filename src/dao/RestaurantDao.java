package dao;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import model.Comment;
import model.Restaurant;

public class RestaurantDao {
	private HashMap<UUID, Restaurant> restaurants = new HashMap<>();
	
	public RestaurantDao()
	{
		
	}
	
    public RestaurantDao(HashMap<UUID, Restaurant> restaurants) 
    {
        this.restaurants = restaurants;
    }
    
    public HashMap<UUID, Restaurant> getRestaurants() {
        return restaurants;
    }
    
    public List<Restaurant> getAllRestaurants() {
    	return restaurants.values()
    			.stream()
    			.filter(restaurant -> !restaurant.isDeleted())
    			.collect(Collectors.toList());
    }

    public void setUsers(HashMap<UUID, Restaurant> restaurants) {
        this.restaurants = restaurants;
    }
    
    public Restaurant newRestaurant(Restaurant restaurant) {
        var alreadyExisting = restaurants.values()
                .stream()
                .filter(r -> !r.isDeleted())
                .filter(userInBase -> userInBase.getName().equals(restaurant.getName()))
                .collect(Collectors.toList());
        if (alreadyExisting.size() == 0) {
        	if(restaurant.getUuid() == null)
        		restaurant.setUuid(UUID.randomUUID());
        	restaurants.put(restaurant.getUuid(), restaurant);
            return restaurant;
        }
        return null;
    }
    
    public Restaurant findById(String id) {
    	return findById(UUID.fromString(id));
    }

	public Restaurant findById(UUID id) {
        Restaurant restaurant = restaurants.getOrDefault(id, null);
        if(!restaurant.isDeleted())
        	return restaurant;
        return null;
	}
	
	public boolean deleteRestaurant(UUID id) {
		findById(id).setDeleted(true);
		return true;
	}
	
	public boolean deleteRestaurant(String id) {
		return deleteRestaurant(UUID.fromString(id));
	}
}
