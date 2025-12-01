package com.example.PwnCrack.dao.repository

import com.example.PwnCrack.dao.EmployeeAudit
import org.springframework.data.repository.CrudRepository

interface EmployeeAuditRepository: CrudRepository<EmployeeAudit, Long> {
    fun findByAuditId(auditId: Long): List<EmployeeAudit>
    fun deleteByAuditId(auditId: Long)
    fun findByAuditIdAndState(auditId: Long, state: Boolean): List<EmployeeAudit>
}