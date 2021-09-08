package dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import controller.RestaurantController;

import model.DeliveryRequest;
import model.Order;
import model.Restaurant;
import rest.DostavaMain;

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
	private void updateRestaurantNames() {
		for (Order o : orders.values()) {
			Restaurant r = o.getRestaurant();
			o.setRestaurantName(r.getName());
		}
	}
	
	public Order findById(String uuid) {
		updateRestaurantNames();
        return orders.getOrDefault(UUID.fromString(uuid), null);
    }
	
	public List<Order> findByRestaurant(Restaurant r) {
		updateRestaurantNames();
    	List<Order> tmpStep = orders.values()
                .stream()
                .filter(order -> order.getRestaurant().getUuid().equals(r.getUuid()))
                .collect(Collectors.toList());
    	return tmpStep;
    }
	
	public List<Order> findByRestaurant(UUID r) {
		updateRestaurantNames();
    	List<Order> tmpStep = orders.values()
                .stream()
                .filter(order -> order.getRestaurant().getUuid() == r)
                .collect(Collectors.toList());
    	return tmpStep;
    }
	
	public List<Order> findByRestaurant(String r) {
		updateRestaurantNames();
    	List<Order> tmpStep = orders.values()
                .stream()
                .filter(order -> order.getRestaurant().getUuid().equals(UUID.fromString(r)))
                .collect(Collectors.toList());
    	return tmpStep;
    }
	
	public List<Order> getAvailableOpenDeliveries(String user) {
		updateRestaurantNames();
		List<DeliveryRequest> userDeliveries = DostavaMain.deliveryRequestDao.getDeliveryRequestsByDeliverer(user);
		List<Order> userDeliveriesOrderCast = new ArrayList<>();
		for(DeliveryRequest userDelivery : userDeliveries)
		{
			userDeliveriesOrderCast.add(userDelivery.getOrder());
		}
    	List<Order> tmpStep = orders.values()
                .stream()
                .filter(order -> order.getStatus().equals(Order.OrderStatus.AWAITING_DELIVERY))
                .filter(order -> userDeliveriesOrderCast.size() < 1 || !userDeliveriesOrderCast.contains(order))
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
