package model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import rest.DostavaMain;

public class Cart {
	private List<CartItem> cartItems;
	private UUID user;
	private float price;
	
	public Cart() {
		cartItems = new ArrayList<>();
	}
	
	public Cart(List<CartItem> cartItems, User user) {
		this.cartItems = cartItems;
		this.user = user.getUuid();
		this.price = 0;
		for (CartItem ci : cartItems) {
			this.price += ci.getItem().getPrice();
		}
	}
	
	public Cart(User user) {
		this.cartItems = new ArrayList<CartItem>();
		this.user = user.getUuid();
		this.price = 0;
	}
	
	public List<CartItem> getCartItems() {
		return cartItems;
	}
	public void setCartItems(List<CartItem> cartItems) {
		this.cartItems = cartItems;
	}
	public User getUser() {
		return DostavaMain.userDao.findById(user);
	}
	public void setUser(User user) {
		this.user = user.getUuid();
	}
	public float getPrice() {
		return price;
	}
	public void setPrice(float price) {
		this.price = price;
	}
	public void addCartItem(CartItem item)
	{
		if(this.cartItems != null && this.cartItems.size() > 0)
		{
			for(CartItem c : this.cartItems)
			{
				if(c.getItem().getUuid() == item.getItem().getUuid())
				{
					c.setCount(c.getCount() + item.getCount());
					return;
				}
			}
		}
		this.cartItems.add(item);
	}
	
	public boolean removeItem(UUID id) {
		for (CartItem ci : cartItems) {
			if(ci.getUuid() == id) {
				cartItems.remove(ci);
				return true;
			}
		}
		return false;
	}
}
