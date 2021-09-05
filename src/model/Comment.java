package model;

public class Comment {
	private User customer;
	private Restaurant restaurant;
	private String text;
	private int rating;
	
	public Comment(User customer, Restaurant restaurant, String text, int rating) {
		this.customer = customer;
		this.restaurant = restaurant;
		this.text = text;
		this.rating = rating; //Ovde provera da li je [0, 5]?
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
}
