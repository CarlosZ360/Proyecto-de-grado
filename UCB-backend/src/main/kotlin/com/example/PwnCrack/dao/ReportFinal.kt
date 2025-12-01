package com.example.PwnCrack.dao

import java.util.*
import javax.persistence.*



@Entity
@Table(name = "report_final")
@SequenceGenerator(name = "seq_report_final", sequenceName = "seq_report_final", allocationSize = 1, initialValue = 1)
class ReportFinal (

            @Column(name="report_id", nullable = false) //FK
            var reportId: Long,
            @Column(name="count_hashes_dumps", nullable = false)
            var countHashesDumps: Int,
            @Column(name="count_hashes_potfile", nullable = false)
            var countHashesPotfile: Int,
            @Column(name="count_hashes", nullable = false)
            var countHashes: Int,
            @Column(name="count_cracked", nullable = false)
            var countCracked: Int,
            @Column(name="length_one", nullable = false)
            var lengthOne: Int,
            @Column(name="length_two", nullable = false)
            var lengthTwo: Int,
            @Column(name="length_three", nullable = false)
            var lengthThree: Int,
            @Column(name="length_four", nullable = false)
            var lengthFour: Int,
            @Column(name="empty", nullable = false)
            var empty: Int,
            @Column(name="numeric", nullable = false)
            var numeric: Int,
            @Column(name="alpha", nullable = false)
            var alpha: Int,
            @Column(name="alpha_numeric", nullable = false)
            var alphaNumeric: Int,
            @Column(name="alpha_special", nullable = false)
            var alphaSpecial: Int,
            @Column(name="numeric_special", nullable = false)
            var numericSpecial: Int,
            @Column(name="alpha_numeric_special", nullable = false)
            var alphaNumericSpecial: Int,
            @Column(name="most_word", nullable = false, length = 150000)
            var mostWord: String,
            @Column(name="most_word_base", nullable = false, length = 150000)
            var mostWordBase: String,
            @Column(name="most_mask", nullable = false, length = 150000)
            var mostMask: String,
            @Column(name="file_cracked_hashes", nullable = false)
            var fileCrackedHashes: ByteArray,
            @Column(name="file_cracked_potfile", nullable = false)
            var fileCrackedPotfile: ByteArray,
            @Column(name="observation", nullable = false, length = 10000)
            var observation: String,
            @Column(name="date", nullable = false)
            var date: Date,
            @Column(name="state", nullable = false)
            var state: Boolean,
            @Id
            @GeneratedValue(strategy = javax.persistence.GenerationType.SEQUENCE, generator = "seq_report_final")
            @Column(name = "report_final_id")
            var reportFinalId: Long = 0
    )
    {
        constructor(): this(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"","","",byteArrayOf(), byteArrayOf(), "", Date(), true,0)
    }
