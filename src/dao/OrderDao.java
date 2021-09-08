package dao;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import model.Order;
import model.Restaurant;

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
	
	public List<Order> findByRestaurant(Restaurant r) {
    	List<Order> tmpStep = orders.values()
                .stream()
                .filter(order -> order.getRestaurant().getUuid() == r.getUuid())
                .collect(Collectors.toList());
    	return tmpStep;
    }
	
	public List<Order> findByRestaurant(UUID r) {
    	List<Order> tmpStep = orders.values()
                .stream()
                .filter(order -> order.getRestaurant().getUuid() == r)
                .collect(Collectors.toList());
    	return tmpStep;
    }
	
	public List<Order> findByRestaurant(String r) {
    	List<Order> tmpStep = orders.values()
                .stream()
                .filter(order -> order.getRestaurant().getUuid().equals(UUID.fromString(r)))
                .collect(Collectors.toList());
    	return tmpStep;
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
