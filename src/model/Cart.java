package model;

import java.util.ArrayList;
import java.util.List;

public class Cart {
	private List<CartItem> cartItems;
	private User user;
	private float price;
	
	public Cart() {
		cartItems = new ArrayList<>();
	}
	
	public Cart(List<CartItem> cartItems, User user) {
		this.cartItems = cartItems;
		this.user = user;
		this.price = 0;
		for (CartItem ci : cartItems) {
			this.price += ci.getItem().getPrice();
		}
	}
	
	public Cart(User user) {
		this.cartItems = new ArrayList<CartItem>();
		this.user = user;
		this.price = 0;
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
	public void addCartItem(CartItem item)
	{
		this.cartItems.add(item);
	}
}
