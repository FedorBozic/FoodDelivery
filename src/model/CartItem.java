package model;

import java.util.UUID;

public class CartItem {
	private Item item;
	private int count;
	private UUID uuid;
	
	public CartItem(Item item, int count) {
		this.uuid = UUID.randomUUID();
		this.item = item;
		this.count = count;
	}
	
	public Item getItem() {
		return item;
	}
	public void setItem(Item item) {
		this.item = item;
	}
	public int getCount() {
		return count;
	}
	public void setCount(int count) {
		this.count = count;
	}

	public UUID getUuid() {
		return uuid;
	}

	public void setUuid(UUID uuid) {
		this.uuid = uuid;
	}
}
