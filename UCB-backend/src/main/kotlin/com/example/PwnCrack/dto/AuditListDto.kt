package com.example.PwnCrack.dto

import java.util.*

data class AuditListDto (
        var auditId: Long,
        val name: String,
        val date: Date,
        val companyId: Long,
        val employee: List<AuditEmployee>,
        val state: Boolean
)