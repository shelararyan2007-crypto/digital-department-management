package com.digidept.backend.repository;

import com.digidept.backend.entity.Role;
import com.digidept.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository
        extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);


    long countByDepartmentIdAndRole(
            Long departmentId,
            Role role
    );


    List<User> findByDepartmentIdAndRole(
            Long departmentId,
            Role role
    );
}