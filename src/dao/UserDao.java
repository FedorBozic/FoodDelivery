package dao;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import model.Cart;
import model.Order;
import model.User;
import rest.DostavaMain;

public class UserDao {
	private HashMap<UUID, User> users = new HashMap<>();
	
	public UserDao()
	{
		
	}
	
    public UserDao(HashMap<UUID, User> users) 
    {
        this.users = users;
    }
    
    public HashMap<UUID, User> getUsers() {
        return users;
    }

    public void setUsers(HashMap<UUID, User> users) {
        this.users = users;
    }
    
    public List<User> getManagers() {
    	List<User> tmpStep = users.values()
                .stream()
                .filter(user -> user.getRole() != null && user.getRole() == User.Role.MANAGER)
                .collect(Collectors.toList());
    	for (User u : tmpStep) {
			System.out.println(u.getFirstName() + " " + u.getLastName());
		}
    	return tmpStep;
    }
    
    public Cart getCartByUserId(String uuid) {
    	User user = findById(uuid);
    	return user.getCart();
    }
    
    public User addUser(User user) {
        var alreadyExisting = users.values()
                .stream()
                .filter(userInBase -> userInBase.getUsername().equals(user.getUsername()))
                .collect(Collectors.toList());
        if (alreadyExisting.size() == 0) {
            user.setUuid(UUID.randomUUID());
            users.put(user.getUuid(), user);
            return user;
        }
        return null;
    }
    
    public User findByUsernameAndPassword(String username, String password) {
        return users.values()
                .stream()
                .filter(user -> user.getUsername() != null && user.getPassword() != null)
                .filter(user -> user.getUsername().equals(username) && user.getPassword().equals(password))
                .findFirst().orElse(null);
    }
    
    public User findById(String uuid) {
        return users.getOrDefault(UUID.fromString(uuid), null);
    }
}
