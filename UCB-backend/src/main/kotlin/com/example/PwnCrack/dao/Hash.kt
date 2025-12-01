package com.example.PwnCrack.dao
import javax.persistence.*
@Entity
@Table(name = "hash")
@SequenceGenerator(name = "seq_hash", sequenceName = "seq_hash", allocationSize = 1, initialValue = 1)
class Hash (
        @Column(name="hash", nullable = false, length = 150)
        var hash: String,
        @Column(name="clear_hash", nullable = false, length = 150)
        var clearHash: String,
        @Column(name="state", nullable = false)
        var state: Boolean,
        @Column(name="type", nullable = false)
        var type: Int,
        @Id
        @GeneratedValue(strategy = javax.persistence.GenerationType.SEQUENCE, generator = "seq_hash")
        @Column(name = "hash_id")
        var hashId: Long = 0
)
{
    constructor(): this("","",true,0)
}
