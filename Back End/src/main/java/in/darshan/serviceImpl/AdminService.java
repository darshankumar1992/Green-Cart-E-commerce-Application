package in.darshan.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import in.darshan.entity.Admin;
import in.darshan.repo.AdminRepository;
import in.darshan.service.IAdminService;

@Service
public class AdminService implements IAdminService{
	
	@Autowired
	private AdminRepository repo;

	@Override
	@Transactional
	public void updateValues(Double totalAmount, Integer aid) {
		repo.updateValues(totalAmount,aid);
		
	}

	@Override
	public Admin getRevenueData() {
		// TODO Auto-generated method stub
		return repo.getRevenueData();
	}

}
