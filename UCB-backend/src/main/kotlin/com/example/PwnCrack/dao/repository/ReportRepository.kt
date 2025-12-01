package com.example.PwnCrack.dao.repository

import com.example.PwnCrack.dao.Report
import org.springframework.data.repository.CrudRepository

interface ReportRepository:CrudRepository<Report, Long>{
    fun findByAuditId(auditId: Long): List<Report>
    fun findAllByAuditId(auditId: Long): List<Report>
}