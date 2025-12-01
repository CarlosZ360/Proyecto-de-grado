package com.example.PwnCrack.dto

data class ReportListDto (
    var reportId: Long,
    val auditId: Long,
    val state: Boolean
)