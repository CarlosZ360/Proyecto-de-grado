package com.example.PwnCrack.dao

import javax.persistence.*

@Entity
@Table(name = "dashboard")
@SequenceGenerator(name = "seq_dashboard", sequenceName = "seq_dashboard", allocationSize = 1, initialValue = 1)
class DashBoard (
    @Column(name="count_hashes", nullable = false)
    var countHashes: Int,
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
    @Column(name="five", nullable = false)
    var five: Boolean,
    @Column(name="thirteen", nullable = false)
    var thirteen: Boolean,
    @Column(name="twenty", nullable = false)
    var twenty: Boolean,
    @Column(name="state", nullable = false)
    var state: Boolean,
    @Id
    @GeneratedValue(strategy = javax.persistence.GenerationType.SEQUENCE, generator = "seq_dashboard")
    @Column(name = "dash_board_id")
    var dashBoardId: Long = 0
)
{
    constructor() : this(0,0,0,0,0,0,0,0,0,0,0,0,"","", "", false, false, false, true)
}