package com.example.PwnCrack.dto

import at.favre.lib.bytes.BytesValidator.Length

data class ReportDto (
        var reportId: Long,
        val auditId: Long,
        val countHashes: Int,
        val countCracked: Int,
        val lengthOne: Int,
        val lengthTwo: Int,
        val lengthThree: Int,
        val lengthFour: Int,
        val fileCracked: ByteArray,
        val state: Boolean
)