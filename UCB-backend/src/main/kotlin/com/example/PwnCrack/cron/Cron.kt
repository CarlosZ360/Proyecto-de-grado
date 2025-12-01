package com.example.PwnCrack.cron

import com.example.PwnCrack.bl.DbBl
import com.example.PwnCrack.dao.repository.DashBoardRepository
import com.example.PwnCrack.dao.repository.EmployeeRepository
import com.example.PwnCrack.dao.repository.HashRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.time.LocalDateTime

@Component
class Cron @Autowired constructor(
    private val dashBoardRepository: DashBoardRepository,
    private val dbBl: DbBl
){



}