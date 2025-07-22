package in.darshan.serviceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



import in.darshan.entity.User;
import in.darshan.exception.UserException;
import in.darshan.repo.UserRepository;
import in.darshan.service.IUserService;

@Service
public class UserService implements IUserService{
	
	@Autowired
	private UserRepository repo;

	@Override
	public User addUser(User user) {
		return repo.save(user);
	}

	@Override
	public User findByEmail(String mail) {
		// TODO Auto-generated method stub
		return repo.findByEmail(mail).orElse(null);
	}

	@Override
	public User createUser(User user) {
		// TODO Auto-generated method stub
		return repo.save(user);
	}

	@Override
	public User findById(Integer userId) {
		// TODO Auto-generated method stub
		return repo.findById(userId).orElseThrow(()->new UserException("User Not Found"));
	}

	@Override
	public List<User> getCustomerData() {
		// TODO Auto-generated method stub
		return repo.getCustomerData();
	}

	@Override
	public Integer getTotalUser() {
		// TODO Auto-generated method stub
		return repo.getTotalUser();
	}

	



}
