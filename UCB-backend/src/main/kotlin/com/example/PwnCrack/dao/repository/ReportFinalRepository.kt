package com.example.PwnCrack.dao.repository

import com.example.PwnCrack.dao.Report
import com.example.PwnCrack.dao.ReportFinal
import org.springframework.data.repository.CrudRepository

interface ReportFinalRepository:CrudRepository<ReportFinal, Long> {
    fun findByReportId(reportId: Long): List<ReportFinal>
}