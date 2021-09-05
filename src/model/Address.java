package model;

public class Address {
	private String streetAddress;
	private String townName;
	private String zipCode;
	
	public Address(String streetAddress, String townName, String zipCode) {
		this.streetAddress = streetAddress;
		this.townName = townName;
		this.zipCode = zipCode;
	}
	
	public String getStreetAddress() {
		return streetAddress;
	}
	public void setStreetAddress(String streetAddress) {
		this.streetAddress = streetAddress;
	}
	public String getTownName() {
		return townName;
	}
	public void setTownName(String townName) {
		this.townName = townName;
	}
	public String getZipCode() {
		return zipCode;
	}
	public void setZipCode(String zipCode) {
		this.zipCode = zipCode;
	}
}
