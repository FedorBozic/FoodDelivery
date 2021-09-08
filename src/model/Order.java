package model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class Order {
	
	enum OrderStatus {PROCESSING, PREPARATION, AWAITING_DELIVERY, IN_TRANSPORT, DELIVERED, CANCELED};
	
	private UUID uuid;
	private List<Item> items;
	private Restaurant restaurant;
	private LocalDateTime dateTime;
	private float price;
	private String customerName;
	private OrderStatus status;
	
	public Order(UUID uuid, List<Item> items, Restaurant restaurant, LocalDateTime dateTime, float price, String customerName, OrderStatus status) {
		this.uuid = uuid;
		this.items = items;
		this.restaurant = restaurant;
		this.dateTime = dateTime;
		this.price = price;
		this.customerName = customerName;
		this.status = status;
	}
	
	public Order(List<Item> items, Restaurant restaurant, LocalDateTime dateTime, String customerName, OrderStatus status) {
		this.uuid = UUID.randomUUID(); //za sada random?
		this.items = items;
		this.restaurant = restaurant;
		this.dateTime = dateTime;
		float totalPrice = 0;
		for (Item i : items) {
			totalPrice += i.getPrice();
		}
		this.price = totalPrice;
		this.customerName = customerName;
		this.status = status;
	}
	
	public Order() {
		// TODO Auto-generated constructor stub
	}

	public UUID getUuid() {
		return uuid;
	}
	public void setUuid(UUID uuid) {
		this.uuid = uuid;
	}
	public Restaurant getRestaurant() {
		return restaurant;
	}
	public void setRestaurant(Restaurant restaurant) {
		this.restaurant = restaurant;
	}
	public List<Item> getItems() {
		return items;
	}
	public void setItems(List<Item> items) {
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
}
