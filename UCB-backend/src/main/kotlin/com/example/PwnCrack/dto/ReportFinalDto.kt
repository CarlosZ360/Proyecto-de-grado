package com.example.PwnCrack.dto

import java.util.*

data class ReportFinalDto (
        var reportFinalId: Long,
        val reportId: Long,
        val countHashesDumps: Int,
        val countHashesPotfile: Int,
        val countHashes: Int,
        val countCracked: Int,
        val lengthOne: Int,
        val lengthTwo: Int,
        val lengthThree: Int,
        val lengthFour: Int,
        val empty: Int,
        val numeric: Int,
        val alpha: Int,
        val alphaNumeric: Int,
        val alphaSpecial: Int,
        val numericSpecial: Int,
        val alphaNumericSpecial: Int,
        val mostWord: String,
        val mostWordBase: String,
        val mostMask: String,
        val fileCrackedHashes: ByteArray,
        val fileCrackedPotfile: ByteArray,
        val observation: String,
        val date: Date,
        val state: Boolean
)