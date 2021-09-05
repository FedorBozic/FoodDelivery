package model;

public class UserType {
	enum TypeName {BRONZE, SILVER, GOLD};
	
	private TypeName name;
	private int discount;
	private int pointRequirement;
	
	public UserType(TypeName name, int discount, int pointRequirement) {
		this.name = name;
		this.discount = discount;
		this.pointRequirement = pointRequirement;
	}
	
	public TypeName getName() {
		return name;
	}
	public void setName(TypeName name) {
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
