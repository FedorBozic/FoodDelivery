package model;

import java.util.UUID;

public class Comment {
	private UUID uuid;
	private User customer;
	private Restaurant restaurant;
	private String text;
	private int rating;
	private boolean approved = false;
	private boolean rejected = false;
	private boolean deleted = false;
	
	public Comment() {
		
	}
	
	public Comment(UUID uuid, User customer, Restaurant restaurant, String text, int rating, boolean approved) {
		this.uuid = uuid;
		this.customer = customer;
		this.restaurant = restaurant;
		this.text = text;
		this.rating = rating; //Ovde provera da li je [0, 5]?
		this.setApproved(approved);
	}
	
	public User getCustomer() {
		return customer;
	}
	public void setCustomer(User customer) {
		this.customer = customer;
	}
	public Restaurant getRestaurant() {
		return restaurant;
	}
	public void setRestaurant(Restaurant restaurant) {
		this.restaurant = restaurant;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public int getRating() {
		return rating;
	}
	public void setRating(int rating) {
		this.rating = rating;
	}

	public UUID getUuid() {
		return uuid;
	}

	public void setUuid(UUID uuid) {
		this.uuid = uuid;
	}

	public boolean isApproved() {
		return approved;
	}

	public void setApproved(boolean approved) {
		this.approved = approved;
	}

	public boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}

	public boolean isRejected() {
		return rejected;
	}

	public void setRejected(boolean rejected) {
		this.rejected = rejected;
	}
}
