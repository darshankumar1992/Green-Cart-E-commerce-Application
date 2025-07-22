package in.darshan.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import in.darshan.entity.Admin;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Integer>{

	@Modifying
	@Transactional
	@Query("UPDATE Admin a SET a.revenue = a.revenue + :totalAmount, a.orders = a.orders + 1 WHERE a.aid = :aid")
	public void updateValues(@Param("totalAmount") Double totalAmount, @Param("aid") Integer aid);

	@Query("SELECT a FROM Admin a")
	public Admin getRevenueData();


}
