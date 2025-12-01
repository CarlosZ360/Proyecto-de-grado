package com.example.PwnCrack.dto

import java.util.Date

data class AuditDto (
        var auditId: Long,
        val name: String,
        val date: Date,
        val companyId: Long,
        val employeeIds: List<Long>,
        val state: Boolean
)