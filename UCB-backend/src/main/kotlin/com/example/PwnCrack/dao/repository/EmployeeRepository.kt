package com.example.PwnCrack.dao.repository

import com.example.PwnCrack.dao.Employee
import org.springframework.data.repository.CrudRepository

interface EmployeeRepository: CrudRepository<Employee, Long> {
    fun findAllByState(state: Boolean): List<Employee>
    fun findByEmailAndState(email: String, state: Boolean): Employee?
    fun findAllByRoleAndState(role: String, state: Boolean): List<Employee>
}