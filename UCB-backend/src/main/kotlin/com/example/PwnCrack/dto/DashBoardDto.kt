package com.example.PwnCrack.dto

import com.example.PwnCrack.dao.Hash

data class DashBoardDto (
    var dashBoardId: Long,
    val countHashes: Int,
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
    val five: Boolean,
    val thirteen: Boolean,
    val twenty: Boolean,
    val state: Boolean
)