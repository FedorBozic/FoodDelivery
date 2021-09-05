package model;

public class Item {
	
	enum ItemType {FOOD, DRINK};
	
	private String name;
	private float price;
	private ItemType type;
	private Restaurant restaurant;
	private int amount;
	private String description;
	private String image; //slika string za sada
	
	public Item(String name, float price, ItemType type, Restaurant restaurant, int amount, String description, String image) {
		this.name = name;
		this.price = price;
		this.type = type;
		this.restaurant = restaurant;
		this.amount = amount;
		this.description = description;
		this.image = image;
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
		return restaurant;
	}
	public void setRestaurant(Restaurant restaurant) {
		this.restaurant = restaurant;
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
