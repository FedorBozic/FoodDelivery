package model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Restaurant {
	
	private UUID uuid;
	private String name;
	private RestaurantType type;
	private List<Item> items;
	private RestaurantStatus status;
	private Location location;
	private String logo;
	
	public Restaurant() {
		items = new ArrayList<Item>();
	}
	
	public Restaurant(UUID uuid, String name, RestaurantType type, List<Item> items, RestaurantStatus status, Location location, String logo) {
		this.name = name;
		this.type = type;
		this.items = items;
		this.status = status;
		this.location = location;
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
}
