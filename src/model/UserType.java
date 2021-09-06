package model;

import java.util.UUID;

public class UserType {
	
	private UUID uuid;
	private String name;
	private int discount;
	private int pointRequirement;
	private String firstColor;
	private String secondColor;
	
	public UserType(String name, int discount, int pointRequirement, String firstColor, String secondColor) {
		this.name = name;
		this.discount = discount;
		this.pointRequirement = pointRequirement;
		this.firstColor = firstColor;
		this.secondColor = secondColor;
	}
	
	public UUID getUuid() {
		return uuid;
	}
	public void setUuid(UUID uuid) {
		this.uuid = uuid;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getDiscount() {
		return discount;
	}
	public void setDiscount(int discount) {
		this.discount = discount;
	}
	public int getPointRequirement() {
		return pointRequirement;
	}
	public void setPointRequirement(int pointRequirement) {
		this.pointRequirement = pointRequirement;
	}
}
