package com.example.PwnCrack.dao
import javax.persistence.*

@Entity
@Table(name = "client")
@SequenceGenerator(name = "seq_client", sequenceName = "seq_client", allocationSize = 1, initialValue = 1)
class Client (
        @Column(name="name", nullable = false, length = 150)
        var name: String,
        @Column(name="last_name", nullable = false, length = 150)
        var lastName: String,
        @Column(name="phone", nullable = false, length = 150)
        var phone: String,
        @Column(name="email", nullable = false, length = 150)
        var email: String,
        @Column(name="password", nullable = false, length = 150)
        var password: String,
        @Column(name="position", nullable = false, length = 150)
        var position: String,
        @Column(name="company_id", nullable = false) //FK
        var companyId: Int,
        @Column(name="state", nullable = false)
        var state: Boolean,
        @Id
        @GeneratedValue(strategy = javax.persistence.GenerationType.SEQUENCE, generator = "seq_client")
        @Column(name = "client_id")
        var clientId: Long = 0

)
{
    constructor(): this("","","","","","",0,true,0)
}
