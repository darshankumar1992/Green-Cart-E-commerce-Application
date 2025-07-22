package in.darshan.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name="order_items")
public class OrderItem {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer orderItemId;
	
	private Integer quantity;
	
	private Double price;
	
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "orderId")
	private Order order;
	
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "ProductId")
	private ProductItem productItem;

}
