package dao;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import model.DeliveryRequest;
import model.Order;
import model.Restaurant;
import model.User;

public class DeliveryRequestDao {
	private HashMap<UUID, DeliveryRequest> deliveryRequests = new HashMap<>();
	
	public DeliveryRequestDao() { }
	
	public DeliveryRequestDao(HashMap<UUID, DeliveryRequest> deliveryRequests) {
		super();
		this.deliveryRequests = deliveryRequests;
	}

	public HashMap<UUID, DeliveryRequest> getOrders() {
		return deliveryRequests;
	}

	public void setDeliveryRequests(HashMap<UUID, DeliveryRequest> deliveryRequests) {
		this.deliveryRequests = deliveryRequests;
	}
	
	// SEARCHES
	
	public List<DeliveryRequest> getDeliveryRequestsByDeliverer(String u)
	{
		List<DeliveryRequest> tmpStep = deliveryRequests.values()
                .stream()
                .filter(deliveryRequest -> deliveryRequest.getRequester().getUuid().equals(UUID.fromString(u)))
                .filter(deliveryRequest -> !deliveryRequest.isApproved())
                .collect(Collectors.toList());
    	return tmpStep;
	}
	
	public List<DeliveryRequest> getDeliveryRequestsByDeliverer(UUID u)
	{
		List<DeliveryRequest> tmpStep = deliveryRequests.values()
                .stream()
                .filter(deliveryRequest -> deliveryRequest.getRequester().getUuid().equals(u) &&  !deliveryRequest.isApproved())
                .collect(Collectors.toList());
    	return tmpStep;
	}
	
	public List<DeliveryRequest> getDeliveriesByDeliverer(String u)
	{
		List<DeliveryRequest> tmpStep = deliveryRequests.values()
                .stream()
                .filter(deliveryRequest -> deliveryRequest.getRequester().getUuid().equals(UUID.fromString(u)) && deliveryRequest.isApproved())
                .collect(Collectors.toList());
    	return tmpStep;
	}
	
	public List<DeliveryRequest> getDeliveriesByDeliverer(UUID u)
	{
		List<DeliveryRequest> tmpStep = deliveryRequests.values()
                .stream()
                .filter(deliveryRequest -> deliveryRequest.getRequester().getUuid().equals(u))
                .filter(deliveryRequest -> deliveryRequest.isApproved())
                .collect(Collectors.toList());
    	return tmpStep;
	}
	
	public List<DeliveryRequest> getDeliveryRequestsByRestaurant(String r)
	{
		List<DeliveryRequest> tmpStep = deliveryRequests.values()
                .stream()
                .filter(deliveryRequest -> deliveryRequest.getOrder().getRestaurant().getUuid().equals(UUID.fromString(r)))
                .collect(Collectors.toList());
    	return tmpStep;
	}
	
	public List<DeliveryRequest> getDeliveryRequestsByRestaurant(UUID r)
	{
		List<DeliveryRequest> tmpStep = deliveryRequests.values()
                .stream()
                .filter(deliveryRequest -> deliveryRequest.getOrder().getRestaurant().getUuid().equals(r))
                .collect(Collectors.toList());
    	return tmpStep;
	}
	
	public DeliveryRequest findById(String uuid) {
        return deliveryRequests.getOrDefault(UUID.fromString(uuid), null);
    }
	
	// ADD
    
    public DeliveryRequest addDeliveryRequest(DeliveryRequest deliveryRequest) {
        var alreadyExisting = deliveryRequests.values()
                .stream()
                .filter(requestsInBase -> requestsInBase.getUuid().equals(deliveryRequest.getUuid()))
                .collect(Collectors.toList());
        if (alreadyExisting.size() == 0) {
        	deliveryRequest.setUuid(UUID.randomUUID());
        	deliveryRequests.put(deliveryRequest.getUuid(), deliveryRequest);
            return deliveryRequest;
        }
        return null;
    }
    
    // DELETE
    
    public void removeUnapprovedDeliveryRequestsForOrder(Order o)
    {
    	var requestsToDelete = deliveryRequests.values()
                .stream()
                .filter(requestsInBase -> requestsInBase.getOrder().getUuid().equals(o.getUuid()) && !requestsInBase.isApproved())
                .collect(Collectors.toList());
    	
    	for(DeliveryRequest d : requestsToDelete)
    	{
    		deliveryRequests.remove(d.getUuid());
    		d = null;
    	}
    }
}
