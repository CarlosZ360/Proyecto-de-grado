package com.example.PwnCrack.dto

data class EmployeeDto (
        var employeeId: Long,
        val name: String,
        val lastName: String,
        val phone: String,
        val email: String,
        val role: String,
        val password: String,
        val state: Boolean
)