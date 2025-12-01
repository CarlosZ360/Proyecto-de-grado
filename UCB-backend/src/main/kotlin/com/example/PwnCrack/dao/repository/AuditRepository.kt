package com.example.PwnCrack.dao.repository

import com.example.PwnCrack.dao.Audit
import org.springframework.data.repository.CrudRepository

interface AuditRepository: CrudRepository<Audit, Long>{
    fun findByCompanyId (companyId: Long): List<Audit>
    fun findByCompanyIdAndState (companyId: Long, state: Boolean): List<Audit>
    fun findAllByCompanyId (companyId: Long): List<Audit>
}