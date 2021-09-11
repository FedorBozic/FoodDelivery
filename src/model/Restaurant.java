package model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import rest.DostavaMain;

public class Restaurant {
	
	private UUID uuid;
	private String name;
	private RestaurantType type;
	private List<Item> items;
	private RestaurantStatus status;
	private Location location;
	private String logo;
	private UUID manager;
	private float rating = 0f;
	private int[] ratings;
	private boolean deleted = false;
	
	public Restaurant() {
		this.uuid = UUID.randomUUID();
		items = new ArrayList<Item>();
		ratings = new int[5];
		ratings[0] = 0;
		ratings[0] = 0;
		ratings[0] = 0;
		ratings[0] = 0;
		ratings[0] = 0;
	}
	
	public Restaurant(UUID uuid, String name, RestaurantType type, List<Item> items, RestaurantStatus status, Location location, String logo) {
		this.uuid = UUID.randomUUID();
		this.name = name;
		this.type = type;
		this.items = items;
		this.status = status;
		this.location = location;
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public RestaurantType getType() {
		return type;
	}
	public void setType(RestaurantType type) {
		this.type = type;
	}
	public List<Item> getItems() {
		return items;
	}
	public void setItems(List<Item> items) {
		this.items = items;
	}
	public RestaurantStatus getStatus() {
		return status;
	}
	public void setStatus(RestaurantStatus status) {
		this.status = status;
	}
	public Location getLocation() {
		return location;
	}
	public void setLocation(Location location) {
		this.location = location;
	}
	public String getLogo() {
		return logo;
	}
	public void setLogo(String logo) {
		this.logo = logo;
	}

	public UUID getUuid() {
		return uuid;
	}

	public void setUuid(UUID uuid) {
		this.uuid = uuid;
	}
	
	public User getManager() {
		return DostavaMain.userDao.findById(manager);
	}

	public void setManager(UUID manager) {
		this.manager = manager;
	}
	
	public void setManager(String manager) {
		this.manager = UUID.fromString(manager);
	}
	
	public void setManager(User manager) {
		this.manager = manager.getUuid();
	}

	public void addItem(Item item) {
		this.items.add(item);
	}
	
	public Item findItemByName(String name) {
		Item foundItem = null;
		for(Item i : this.items)
		{
			if(i.getName().equals(name))
				foundItem = i;
		}
        return foundItem;
    }
	
	public Item findItemById(String uuid) {
		Item foundItem = null;
		for(Item i : this.items)
		{
			if(i.getUuid().equals(UUID.fromString(uuid)))
				foundItem = i;
		}
        return foundItem;
    }

	public float getRating() {
		return rating;
	}

	public void setRating(float rating) {
		this.rating = rating;
	}

	public boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}
	
	public void addRating(int rating) {
		ratings[rating-1]++;
	}
	
	public void recalculateRating() {
		for (int i = 0; i < 5; i++)
			ratings[i] = 0;
		for (Comment c : DostavaMain.commentDao.findByRestaurantApproved(uuid)) {
			ratings[c.getRating() - 1]++;
		}
	}
	
	public boolean removeItem(UUID uuid) {
		return items.removeIf(i -> i.getUuid().equals(uuid));
	}
	
	public boolean removeItem(String uuid) {
		return removeItem(UUID.fromString(uuid));
	}
}
