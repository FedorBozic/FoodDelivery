package dao;

import java.util.HashMap;
import java.util.UUID;
import java.util.stream.Collectors;

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

    public void setUsers(HashMap<UUID, Restaurant> restaurants) {
        this.restaurants = restaurants;
    }
    
    public Restaurant newRestaurant(Restaurant restaurant) {
        var alreadyExisting = restaurants.values() //Mozda u foreachu da bi stao nakon prvog matcha?
                .stream()
                .filter(userInBase -> userInBase.getName().equals(restaurant.getName()))
                .collect(Collectors.toList());
        if (alreadyExisting.size() == 0) {
        	restaurant.setUuid(UUID.randomUUID());
        	restaurants.put(restaurant.getUuid(), restaurant);
            return restaurant;
        }
        return null;
    }
}
