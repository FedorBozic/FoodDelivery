package model;

public class Location {
	private float hCoordinate;
	private float vCoordinate;
	private Address address;
	
	public Location(float hCoordinate, float vCoordinate, Address address) {
		this.hCoordinate = hCoordinate;
		this.vCoordinate = vCoordinate;
		this.address = address;
	}
	
	public float getvCoordinate() {
		return vCoordinate;
	}
	public void setvCoordinate(float vCoordinate) {
		this.vCoordinate = vCoordinate;
	}
	public float gethCoordinate() {
		return hCoordinate;
	}
	public void sethCoordinate(float hCoordinate) {
		this.hCoordinate = hCoordinate;
	}
	public Address getAddress() {
		return address;
	}
	public void setAddress(Address address) {
		this.address = address;
	}
}
