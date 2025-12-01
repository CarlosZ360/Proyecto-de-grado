package com.example.PwnCrack.dao

import javax.persistence.*


@Entity
@Table(name = "report")
@SequenceGenerator(name = "seq_report", sequenceName = "seq_report", allocationSize = 1, initialValue = 1)
class Report (

        @Column(name="audit_id", nullable = false) //FK
        var auditId: Long,
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
        @Column(name="file_cracked", nullable = false)
        var fileCracked: ByteArray,
        @Column(name="state", nullable = false)
        var state: Boolean,
        @Id
        @GeneratedValue(strategy = javax.persistence.GenerationType.SEQUENCE, generator = "seq_report")
        @Column(name = "report_id")
        var reportId: Long = 0
)
{
    constructor(): this(0,0,0,0,0,0,0, byteArrayOf(),true,0)
}