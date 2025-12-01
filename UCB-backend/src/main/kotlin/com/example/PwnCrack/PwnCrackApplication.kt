package com.example.PwnCrack

import jdk.jfr.Enabled
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling

@EnableScheduling
@SpringBootApplication
class PwnCrackApplication

fun main(args: Array<String>) {
	runApplication<PwnCrackApplication>(*args)
}
