package dao;

import java.util.HashMap;
import java.util.UUID;
import java.util.stream.Collectors;

import model.User;

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
    
    public User newBuyer(User user) {
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
}