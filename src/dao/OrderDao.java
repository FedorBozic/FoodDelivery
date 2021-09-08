package dao;

import java.util.HashMap;
import java.util.UUID;
import java.util.stream.Collectors;

import model.Order;

public class OrderDao {
	private HashMap<UUID, Order> orders = new HashMap<>();
	
	public OrderDao() { }
	
	public OrderDao(HashMap<UUID, Order> orders) {
		super();
		this.orders = orders;
	}

	public HashMap<UUID, Order> getOrders() {
		return orders;
	}

	public void setOrders(HashMap<UUID, Order> orders) {
		this.orders = orders;
	}
	
	// SEARCHES
	
	public Order findById(String uuid) {
        return orders.getOrDefault(UUID.fromString(uuid), null);
    }
	
	// ADD
    
    public Order addOrder(Order order) {
        var alreadyExisting = orders.values()
                .stream()
                .filter(ordersInBase -> ordersInBase.getUuid().equals(order.getUuid()))
                .collect(Collectors.toList());
        if (alreadyExisting.size() == 0) {
        	order.setUuid(UUID.randomUUID());
            orders.put(order.getUuid(), order);
            return order;
        }
        return null;
    }
}
