package model;

import java.util.UUID;

public class DeliveryRequest {
	private UUID uuid;
	private Order order;
	private User requester;
	boolean approved = false;
	
	public DeliveryRequest()
	{
		this.uuid = UUID.randomUUID();
	}
	
	public DeliveryRequest(Order order, User requester, boolean approved) {
		super();
		this.uuid = UUID.randomUUID();
		this.order = order;
		this.requester = requester;
		this.approved = approved;
	}

	public UUID getUuid() {
		return uuid;
	}

	public void setUuid(UUID uuid) {
		this.uuid = uuid;
	}

	public Order getOrder() {
		return order;
	}

	public void setOrder(Order order) {
		this.order = order;
	}

	public User getRequester() {
		return requester;
	}

	public void setRequester(User requester) {
		this.requester = requester;
	}

	public boolean isApproved() {
		return approved;
	}

	public void setApproved(boolean approved) {
		this.approved = approved;
	}
	
	public User getRequestedManager()
	{
		User manager = null;
		if(order != null)
		{
			manager = order.getRestaurant().getManager();
		}
		return manager;
	}
}
