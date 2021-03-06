package model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.UUID;

import rest.DostavaMain;

public class Order {
	
	public enum OrderStatus {PROCESSING, PREPARATION, AWAITING_DELIVERY, IN_TRANSPORT, DELIVERED, CANCELLED};
	
	private static String codeCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	
	private UUID uuid;
	private String code = "";
	private List<CartItem> items;
	private UUID restaurant;
	private UUID deliverer = null;
	private LocalDateTime dateTime;
	private Date date;
	private float price;
	private UUID customer;
	private String customerName;
	private OrderStatus status;
	private String restaurantName;
	private boolean deleted = false;
	private boolean cancelled = false;
	private boolean commented = false;
	
	public Order(UUID uuid, List<CartItem> items, Restaurant restaurant, LocalDateTime dateTime, float price, String customerName, OrderStatus status) {
		this.uuid = uuid;
		this.items = items;
		this.restaurant = restaurant.getUuid();
		this.dateTime = dateTime;
		this.price = price;
		this.customerName = customerName;
		this.status = status;
		generateCode();
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
		generateCode();
	}
	
	public Order() {
		items = new ArrayList<>();
		generateCode();
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
		
		LocalDate localDate = dateTime.toLocalDate();
		
		ZoneId defaultZoneId = ZoneId.systemDefault();
	    this.date = Date.from(localDate.atStartOfDay(defaultZoneId).toInstant());
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
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
	
	public UUID getDeliverer() {
		return deliverer;
	}

	public void setDeliverer(UUID deliverer) {
		this.deliverer = deliverer;
	}

	public UUID getCustomer() {
		return customer;
	}

	public void setCustomer(UUID customer) {
		this.customer = customer;
	}

	public void setRestaurant(UUID restaurant) {
		this.restaurant = restaurant;
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

	public boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}

	public boolean isCancelled() {
		return cancelled;
	}

	public void setCancelled(boolean canceled) {
		this.cancelled = canceled;
	}

	public boolean isCommented() {
		return commented;
	}

	public void setCommented(boolean commented) {
		this.commented = commented;
	}
	
	public void generateCode() {
		Random rand = new Random();
		for(int i = 0; i < 10; i++) {
			setCode(getCode() + codeCharacters.charAt(rand.nextInt(62)));
		}
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}
	
	
}
