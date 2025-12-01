package com.example.PwnCrack.dao.repository

import com.example.PwnCrack.dao.Client
import org.springframework.data.repository.CrudRepository

interface ClientRepository: CrudRepository<Client, Long>{
    fun findAllByState(state: Boolean): List<Client>
    fun findByEmailAndState(email: String, state: Boolean): Client?
}