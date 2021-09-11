package dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import controller.RestaurantController;
import model.Comment;
import model.DeliveryRequest;
import model.Order;
import model.Restaurant;
import model.User;
import model.Order.OrderStatus;
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
	
    public List<Order> getAllOrders() {
    	return orders.values()
    			.stream()
    			.filter(order -> !order.isDeleted())
    			.collect(Collectors.toList());
    }
	
	// SEARCHES
	private void updateRestaurantNames() {
		for (Order o : orders.values()) {
			Restaurant r = o.getRestaurant();
			o.setRestaurantName(r.getName());
		}
	}
	
	public Order findById(UUID uuid) {
		updateRestaurantNames();
       Order order = orders.getOrDefault(uuid, null);
        if(!order.isDeleted())
        	return order;
        return null;
    }
	
	public Order findById(String uuid) {
		return findById(UUID.fromString(uuid));
    }
	
	public List<Order> findByRestaurant(UUID r) {
		updateRestaurantNames();
    	List<Order> tmpStep = getAllOrders()
                .stream()
                .filter(order -> order.getRestaurant().getUuid().equals(r))
                .collect(Collectors.toList());
    	return tmpStep;
    }
	
	public List<Order> findByRestaurant(String r) {
		updateRestaurantNames();
    	return findByRestaurant(UUID.fromString(r));
    }
	
	public List<Order> findByRestaurant(Restaurant r) {
		updateRestaurantNames();
    	return findByRestaurant(r.getUuid());
    }
	
	public List<Order> findByCustomer(UUID r) {
		updateRestaurantNames();
    	List<Order> tmpStep = getAllOrders()
                .stream()
                .filter(order -> order.getCustomer() == r)
                .collect(Collectors.toList());
    	return tmpStep;
    }
	
	public List<Order> findByCustomer(User u) {
    	return findByCustomer(u.getUuid());
    }
	
	public List<Order> findByCustomer(String u) {
    	return findByCustomer(UUID.fromString(u));
    }
	
	public List<Order> getAvailableOpenDeliveries(String user) {
		updateRestaurantNames();
		List<DeliveryRequest> userDeliveries = DostavaMain.deliveryRequestDao.getDeliveryRequestsByDeliverer(user);
		List<DeliveryRequest> approvedUserDeliveries = DostavaMain.deliveryRequestDao.getDeliveriesByDeliverer(user);
		List<Order> userDeliveriesOrderCast = new ArrayList<>();
		for(DeliveryRequest userDelivery : userDeliveries)
		{
			userDeliveriesOrderCast.add(userDelivery.getOrder());
		}
		for(DeliveryRequest userDelivery : approvedUserDeliveries)
		{
			userDeliveriesOrderCast.add(userDelivery.getOrder());
		}
    	List<Order> tmpStep = getAllOrders()
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
    
    public List<Order> cancelOrder(UUID id) {
    	Order order = findById(id);
    	try {
    		System.out.println(order.getPrice());
    		order.setCancelled(true);
    		order.setStatus(OrderStatus.CANCELLED);
    		User customer = DostavaMain.userDao.findById(order.getCustomer());
    		customer.givePenalty(order.getPrice());
    	} catch (Exception e) {
    		
    	}
    	return getAllOrders().stream()
    			.filter(o -> o.getCustomer().equals(id)).collect(Collectors.toList());
    }
    
    public List<Order> cancelOrder(String id) {
    	return cancelOrder(UUID.fromString(id));
    }
    
    public boolean deleteOrder(UUID id) {
    	findById(id).setDeleted(true);
    	return true;
    }
    
    public boolean deleteOrder(String id) {
    	return deleteOrder(UUID.fromString(id));
    }
}
