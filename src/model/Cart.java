package model;

import java.util.ArrayList;
import java.util.List;

public class Cart {
	private List<CartItem> cartItems;
	private User user;
	private float price;
	
	public Cart(List<CartItem> cartItems, User user, float price) {
		this.cartItems = cartItems;
		this.user = user;
		this.price = price;
	}
	
	public Cart(User user, float price) {
		this.cartItems = new ArrayList<CartItem>();
		this.user = user;
		this.price = price;
	}
	
	public List<CartItem> getCartItems() {
		return cartItems;
	}
	public void setCartItems(List<CartItem> cartItems) {
		this.cartItems = cartItems;
	}
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public float getPrice() {
		return price;
	}
	public void setPrice(float price) {
		this.price = price;
	}
}
