package model;

import java.util.UUID;

import rest.DostavaMain;

public class Item {
	private UUID uuid;
	
	public enum ItemType {FOOD, DRINK};
	
	private String name;
	private float price;
	private ItemType type;
	private UUID restaurant;
	private int amount;
	private String description;
	private String image; //slika string za sada
	
	public Item() {
		this.uuid = UUID.randomUUID();
	}
	
	public Item(String name, float price, ItemType type, Restaurant restaurant, int amount, String description, String image) {
		this.uuid = UUID.randomUUID();
		this.name = name;
		this.price = price;
		this.type = type;
		this.restaurant = restaurant.getUuid();
		this.amount = amount;
		this.description = description;
		this.image = image;
	}
	
	public UUID getUuid() {
		return uuid;
	}

	public void setUuid(UUID uuid) {
		this.uuid = uuid;
	}

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public float getPrice() {
		return price;
	}
	public void setPrice(float price) {
		this.price = price;
	}
	public ItemType getType() {
		return type;
	}
	public void setType(ItemType type) {
		this.type = type;
	}
	public int getAmount() {
		return amount;
	}
	public void setAmount(int amount) {
		this.amount = amount;
	}
	public Restaurant getRestaurant() {
		return DostavaMain.restaurantDao.findById(restaurant);
	}
	public void setRestaurant(Restaurant restaurant) {
		this.restaurant = restaurant.getUuid();
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
}
