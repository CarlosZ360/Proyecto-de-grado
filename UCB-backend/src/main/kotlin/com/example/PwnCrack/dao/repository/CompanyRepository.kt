package com.example.PwnCrack.dao.repository

import com.example.PwnCrack.dao.Company
import org.springframework.data.repository.CrudRepository

interface CompanyRepository: CrudRepository<Company, Long>{
    fun findAllByState(state: Boolean): List<Company>
    fun findByCompanyIdAndState(companyId: Long, state: Boolean): Company
}