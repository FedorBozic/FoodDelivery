package model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import rest.DostavaMain;

public class Order {
	
	public enum OrderStatus {PROCESSING, PREPARATION, AWAITING_DELIVERY, IN_TRANSPORT, DELIVERED, CANCELED};
	
	private UUID uuid;
	private List<CartItem> items;
	private UUID restaurant;
	private UUID deliverer = null;
	private LocalDateTime dateTime;
	private float price;
	private String customerName;
	private OrderStatus status;
	private String restaurantName;
	
	public Order(UUID uuid, List<CartItem> items, Restaurant restaurant, LocalDateTime dateTime, float price, String customerName, OrderStatus status) {
		this.uuid = uuid;
		this.items = items;
		this.restaurant = restaurant.getUuid();
		this.dateTime = dateTime;
		this.price = price;
		this.customerName = customerName;
		this.status = status;
	}
	
	public Order(List<CartItem> items, Restaurant restaurant, LocalDateTime dateTime, String customerName, OrderStatus status) {
		this.uuid = UUID.randomUUID(); //za sada random?
		this.items = items;
		this.restaurant = restaurant.getUuid();
		this.dateTime = dateTime;
		float totalPrice = 0;
		this.price = totalPrice;
		this.customerName = customerName;
		this.status = status;
	}
	
	public Order() {
		items = new ArrayList<>();
	}

	public UUID getUuid() {
		return uuid;
	}
	public void setUuid(UUID uuid) {
		this.uuid = uuid;
	}
	public Restaurant getRestaurant() {
		return DostavaMain.restaurantDao.findById(restaurant);
	}
	public void setRestaurant(Restaurant restaurant) {
		this.restaurant = restaurant.getUuid();
	}
	public List<CartItem> getItems() {
		return items;
	}
	public void setItems(List<CartItem> items) {
		this.items = items;
	}
	public LocalDateTime getDateTime() {
		return dateTime;
	}
	public void setDateTime(LocalDateTime dateTime) {
		this.dateTime = dateTime;
	}
	public float getPrice() {
		return price;
	}
	public void setPrice(float price) {
		this.price = price;
	}
	public String getCustomerName() {
		return customerName;
	}
	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}
	public OrderStatus getStatus() {
		return status;
	}
	public void setStatus(OrderStatus status) {
		this.status = status;
	}
	
	public void addItem(CartItem item)
	{
		items.add(item);
	}
	
	public void addItem(Item item, int amount)
	{
		CartItem tmpCartItem = new CartItem(item, amount);
		items.add(tmpCartItem);
	}

	public String getRestaurantName() {
		return restaurantName;
	}

	public void setRestaurantName(String restaurantName) {
		this.restaurantName = restaurantName;
	}
}
