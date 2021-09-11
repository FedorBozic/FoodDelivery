package model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import rest.DostavaMain;

public class User {
	
	public enum Gender {MALE, FEMALE};
	public enum Role {ADMIN, MANAGER, DELIVERY, CUSTOMER};
	
	private UUID uuid;
	private String username;
	private String password;
	private String firstName;
	private String lastName;
	private Gender gender;
	private LocalDate birthday;
	private Role role;
	
	private List<Order> orders;
	private Cart cart;
	private Restaurant restaurant;
	private List<Order> deliveryOrders;
	private int points;
	private boolean deleted = false;
	
	private UserType type;
	
	public User()
	{
		this.uuid = UUID.randomUUID();
	}
	
	public User(UUID uuid, String username, String password, String firstName, String lastName, Gender gender, LocalDate birthday, Role role,
				List<Order> orders, Cart cart, Restaurant restaurant, List<Order> deliveryOrders, int points, UserType type) {
		this.uuid = uuid;
		this.username = username;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.gender = gender;
		this.birthday = birthday;
		this.role = role;
		this.orders = orders;
		this.cart = cart;
		this.restaurant = restaurant;
		this.deliveryOrders = deliveryOrders;
		this.points = points;
		this.type = type;
	}
	
	//ADMIN, mozda User da bude apstraktna klasa?
	public User(UUID uuid, String username, String password, String firstName, String lastName, Gender gender, LocalDate birthday) {
		this.uuid = uuid;
		this.username = username;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.gender = gender;
		this.birthday = birthday;
		this.role = Role.ADMIN;
		this.orders = null;
		this.cart = null;
		this.restaurant = null;
		this.deliveryOrders = null;
		this.points = 0;
		this.type = null;
	}
	
	//MANAGER
	public User(UUID uuid, String username, String password, String firstName, String lastName, Gender gender, LocalDate birthday, Restaurant restaurant) {
		this.uuid = uuid;
		this.username = username;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.gender = gender;
		this.birthday = birthday;
		this.restaurant = restaurant;
		this.role = Role.MANAGER;
		this.orders = null;
		this.cart = null;
		this.deliveryOrders = null;
		this.points = 0;
		this.type = null;
	}
	
	//DELIVERY
	public User(UUID uuid, String username, String password, String firstName, String lastName, Gender gender, LocalDate birthday, List<Order> deliveryOrders) {
		this.uuid = uuid;
		this.username = username;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.gender = gender;
		this.birthday = birthday;
		this.deliveryOrders = deliveryOrders;
		this.role = Role.DELIVERY;
		this.restaurant = null;
		this.orders = null;
		this.cart = null;
		this.points = 0;
		this.type = null;
	}
	
	//CUSTOMER
	public User(UUID uuid, String username, String password, String firstName, String lastName, Gender gender, LocalDate birthday, List<Order> orders, Cart cart,
				int points, UserType type) {
		this.uuid = uuid;
		this.username = username;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.gender = gender;
		this.birthday = birthday;
		this.orders = orders;
		this.cart = cart;
		this.points = points;
		this.type = type;
		this.role = Role.CUSTOMER;
		this.restaurant = null;
		this.deliveryOrders = null;
	}
	
	public UUID getUuid() {
        return uuid;
    }

    public void setUuid(UUID uuid) {
        this.uuid = uuid;
    }
	
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public Gender getGender() {
		return gender;
	}

	public void setGender(Gender gender) {
		this.gender = gender;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public LocalDate getBirthday() {
		return birthday;
	}

	public void setBirthday(LocalDate birthday) {
		this.birthday = birthday;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public List<Order> getOrders() {
		return orders;
	}

	public void setOrders(List<Order> orders) {
		this.orders = orders;
	}

	public Cart getCart() {
		return cart;
	}

	public void setCart(Cart cart) {
		this.cart = cart;
	}

	public Restaurant getRestaurant() {
		return restaurant;
	}

	public void setRestaurant(Restaurant restaurant) {
		this.restaurant = restaurant;
	}

	public List<Order> getDeliveryOrders() {
		return deliveryOrders;
	}

	public void setDeliveryOrders(List<Order> deliveryOrders) {
		this.deliveryOrders = deliveryOrders;
	}

	public int getPoints() {
		return points;
	}

	public void setPoints(int points) {
		this.points = points;
	}

	public UserType getType() {
		return type;
	}

	public void setType(UserType type) {
		this.type = type;
	}
	
	public void addCartItem(Item item) {
		CartItem tmpCartItem = new CartItem(item, 1);
		if(cart == null)
			cart = new Cart();
		
		cart.addCartItem(tmpCartItem);
	}
	
	public void addCartItem(Item item, int amount) {
		CartItem tmpCartItem = new CartItem(item, amount);
		if(cart == null)
			cart = new Cart();
		
		cart.addCartItem(tmpCartItem);
	}

	public boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}
	
	public void updateType() {
		type = DostavaMain.userTypeDao.getByPoints(points);
	}
	
	public void givePenalty(float price) {
		points -= (int) (((float) price) / 1000 * 133 * 4);
		updateType();
	}
	
	public void giveLoyaltyPoints(float price) {
		points += (int) (((float) price) / 1000 * 133);
		updateType();
	}
}
