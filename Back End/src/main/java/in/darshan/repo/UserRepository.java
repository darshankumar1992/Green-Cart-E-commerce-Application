package in.darshan.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import in.darshan.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>{
	
	public Optional<User> findByEmail(String email);

	@Query("SELECT u FROM User u WHERE u.id <> 1")
	public List<User> getCustomerData();

	@Query("SELECT COUNT(u) FROM User u WHERE u.id <> 1")
	public Integer getTotalUser();


}
