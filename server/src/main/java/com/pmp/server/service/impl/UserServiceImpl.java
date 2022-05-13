package com.pmp.server.service.impl;

import com.pmp.server.domain.User;
import com.pmp.server.dto.common.PagingRequest;
import com.pmp.server.dto.common.ResponseMessage;
import com.pmp.server.repo.UserRepo;
import com.pmp.server.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.pmp.server.utils.constants.ResponseMessageConstants.*;

@Service
public class UserServiceImpl implements UserService {
  private final UserRepo userRepo;

  public UserServiceImpl(UserRepo userRepo) {
    this.userRepo = userRepo;
  }

  @Override
  public ResponseMessage saveUser(User u) {
    User user = userRepo.save(u);
    return new ResponseMessage(SUCCESSFULLY_CREATED, HttpStatus.CREATED, user);
  }

  @Override
  public ResponseMessage getUserById(UUID id) {
    Optional<User> user = userRepo.findById(id);
    return new ResponseMessage(SUCCESSFUL_MESSAGE, HttpStatus.OK, user);

  }

  @Override
  public ResponseMessage getAllUser() {
    List<User> users = (List<User>) userRepo.findAll();
    return new ResponseMessage(SUCCESSFUL_MESSAGE, HttpStatus.OK, users);
  }

  @Override
  public Page<User> getAllUserPaginated(PagingRequest pagingRequest) {
    var direction = (pagingRequest.isAscending()) ? Sort.Direction.ASC : Sort.Direction.DESC;

    var request = PageRequest
      .of(pagingRequest.getPage(), pagingRequest.getPageSize(), direction,pagingRequest.getSortBy());

    return userRepo.findAll(request);
  }
}