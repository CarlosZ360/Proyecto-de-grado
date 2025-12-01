package com.example.PwnCrack.dto

data class ClientDto (
        var clientId: Long,
        val name: String,
        val lastName: String,
        val phone: String,
        val email: String,
        val password: String,
        val position: String,
        val companyId: Int,
        val state: Boolean
)