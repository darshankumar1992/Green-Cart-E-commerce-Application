package in.darshan.service;

import java.util.List;

import in.darshan.entity.User;

public interface IUserService {
	
	public User addUser(User user);
	public User findByEmail(String email);
	public User createUser(User user);
	public User findById(Integer userId);
	public List<User> getCustomerData();
	public Integer getTotalUser();

}
