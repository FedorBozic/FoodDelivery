package dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import model.UserType;

public class UserTypeDao {
	private HashMap<UUID, UserType> userTypes = new HashMap<>();
	
	public UserTypeDao()
	{
		
	}
	
    public UserTypeDao(HashMap<UUID, UserType> userTypes) 
    {
        this.userTypes = userTypes;
    }
    
    public HashMap<UUID, UserType> getUserTypes() {
        return userTypes;
    }

    public void setUserTypes(HashMap<UUID, UserType> userTypes) {
        this.userTypes = userTypes;
    }
    
    public UserType addUserType(UserType userType) {
        var alreadyExisting = userTypes.values()
                .stream()
                .filter(userInBase -> userInBase.getName().equals(userType.getName()))
                .collect(Collectors.toList());
        if (alreadyExisting.size() == 0) {
        	userType.setUuid(UUID.randomUUID());
        	userTypes.put(userType.getUuid(), userType);
            return userType;
        }
        return null;
    }
    
    public UserType getByPoints(int points) {
    	UserType maxType = null;
    	for (UserType ut : userTypes.values()) {
    		if(maxType == null && ut.getPointRequirement() <= points)
    			maxType = ut;
    		else if(maxType != null && ut.getPointRequirement() > maxType.getPointRequirement() && ut.getPointRequirement() <= points)
				maxType = ut;
		}
    	return maxType;
    }
    
    public UserType getNextRank(int points) {
    	UserType minType = null;
    	for (UserType ut : userTypes.values()) {
    		if(minType == null && ut.getPointRequirement() > points)
    			minType = ut;
    		else if(minType != null && ut.getPointRequirement() < minType.getPointRequirement() && ut.getPointRequirement() > points)
    			minType = ut;
		}
    	return minType;
    }
    
    public UserType findByName(String userType) {
        return userTypes.values()
                .stream()
                .filter(user -> user.getName() != null)
                .filter(user -> user.getName().equals(userType))
                .findFirst().orElse(null);
    }
}
