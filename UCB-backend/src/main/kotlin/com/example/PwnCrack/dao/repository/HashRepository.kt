package com.example.PwnCrack.dao.repository

import com.example.PwnCrack.dao.Hash
import org.springframework.data.repository.CrudRepository

interface HashRepository: CrudRepository<Hash, Long>{
    fun existsByHash(hash: String): Boolean
    //Obtener el clearHash por medio de su hash
    fun findByHash(hash: String): Hash
}