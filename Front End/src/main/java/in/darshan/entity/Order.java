package in.darshan.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name="orders")
public class Order {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer orderId;
	
	private String status;
	
	private Double totalAmount;
	
	private String payMode;
	
	private String deliveryAddress;
	
	
	private LocalDate createdAt;
	
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name="id")
	private User user;
	
	
	@JsonIgnore
	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<OrderItem> orderItems;
	

}
