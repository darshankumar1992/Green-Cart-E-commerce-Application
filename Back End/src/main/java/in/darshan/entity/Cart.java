package in.darshan.entity;



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
@Table(name = "cart")
public class Cart {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer cartId;
	
	private Integer quantity;
	

	@ManyToOne
	@JoinColumn(name = "userId")
	private User user;
	
	
	@ManyToOne
	@JoinColumn(name = "productId")
	private ProductItem productItem;

}
