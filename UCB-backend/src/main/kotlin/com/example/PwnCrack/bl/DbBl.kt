package com.example.PwnCrack.bl

import at.favre.lib.crypto.bcrypt.BCrypt
import com.example.PwnCrack.dao.DashBoard
import com.example.PwnCrack.dao.Employee
import com.example.PwnCrack.dao.repository.DashBoardRepository
import com.example.PwnCrack.dao.repository.EmployeeRepository
import com.example.PwnCrack.dao.repository.HashRepository
import com.example.PwnCrack.dto.DashBoardConfigDto
import com.example.PwnCrack.dto.DashBoardDto
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import javax.annotation.PostConstruct
import javax.servlet.http.HttpServletResponse


@Service
class DbBl @Autowired constructor(
        private val employeeRepository: EmployeeRepository,
        private val dashBoardRepository: DashBoardRepository,
        private val hashRepository: HashRepository
)
{
    //Logger
    companion object {
        val LOGGER: Logger = LoggerFactory.getLogger(DbBl::class.java)
    }

    //Metodo para hacer un backup de la base de datos y obtener los datos en un string
    fun backupDatabase(): String {
        LOGGER.info("BL - Iniciando logica para hacer un backup de la base de datos")
        try {
            val pgDumpCommand = "docker exec -it postgres-PwnCrack pg_dump -U postgres -d pwncrack"
            val process = Runtime.getRuntime().exec(pgDumpCommand)
            LOGGER.info("BL - Backup realizado con exito")
            return process.inputStream.bufferedReader().use { it.readText() }

        } catch (e: Exception) {
            LOGGER.error("BL - Error al hacer el backup de la base de datos")
            throw e
        }
    }
    // Método para inicializar el administrador inicial
    @PostConstruct
    fun initAdmin() {
        LOGGER.info("BL - Iniciando logica para crear el administrador inicial")
        try {
            val admin = employeeRepository.findByEmailAndState("admin@gmail.com", true)

            val password: String = BCrypt.withDefaults().hashToString(12, "pwncrack123".toCharArray())
            if (admin == null) {
                val employee = Employee(
                        name = "admin",
                        lastName = "admin",
                        phone = "1234567890",
                        email = "admin@gmail.com",
                        role = "ADMINISTRADOR",
                        password = password,
                        state = true
                )
                employeeRepository.save(employee)
                LOGGER.info("BL - Administrador creado con exito")
            } else {
                LOGGER.info("BL - Administrador ya existe")
            }
        }catch (e: Exception){
            LOGGER.error("BL - Error al crear el administrador")
            throw e
        }
    }
    //Metodo para crear el dashboard
    @PostConstruct
    fun createDashBoard() {
        LOGGER.info("BL - Iniciando logica para crear el dashboard")
        try {
            val dashboard = dashBoardRepository.findById(1)
            if (dashboard.isEmpty) {
                val dashBoard = DashBoard(
                    countHashes = 0,
                    lengthOne = 0,
                    lengthTwo = 0,
                    lengthThree = 0,
                    lengthFour = 0,
                    empty = 0,
                    numeric = 0,
                    alpha = 0,
                    alphaNumeric = 0,
                    alphaSpecial = 0,
                    numericSpecial = 0,
                    alphaNumericSpecial = 0,
                    mostWord = "",
                    mostWordBase = "",
                    mostMask = "",
                    five = false,
                    thirteen = false,
                    twenty = false,
                    state = true
                )
                dashBoardRepository.save(dashBoard)
                LOGGER.info("BL - Dashboard creado con exito")
            } else {
                LOGGER.info("BL - Dashboard ya existe")
            }
        }catch (e: Exception){
            LOGGER.error("BL - Error al crear el dashboard")
            throw e
        }
    }
    //Metodo para obtener el dashboard
    fun getDashBoard(): DashBoardDto {
        LOGGER.info("BL - Iniciando logica para obtener el dashboard")
        try {
            val dashboard = dashBoardRepository.findById(1)
            if(dashboard.isPresent){
                LOGGER.info("BL - Dashboard obtenido con exito")
                return DashBoardDto(
                        dashBoardId = dashboard.get().dashBoardId,
                        countHashes = dashboard.get().countHashes,
                        lengthOne = dashboard.get().lengthOne,
                        lengthTwo = dashboard.get().lengthTwo,
                        lengthThree = dashboard.get().lengthThree,
                        lengthFour = dashboard.get().lengthFour,
                        empty = dashboard.get().empty,
                        numeric = dashboard.get().numeric,
                        alpha = dashboard.get().alpha,
                        alphaNumeric = dashboard.get().alphaNumeric,
                        alphaSpecial = dashboard.get().alphaSpecial,
                        numericSpecial = dashboard.get().numericSpecial,
                        alphaNumericSpecial = dashboard.get().alphaNumericSpecial,
                        mostWord = dashboard.get().mostWord,
                        mostWordBase = dashboard.get().mostWordBase,
                        mostMask = dashboard.get().mostMask,
                        five = dashboard.get().five,
                        thirteen = dashboard.get().thirteen,
                        twenty = dashboard.get().twenty,
                        state = dashboard.get().state
                )
            }else{
                LOGGER.error("BL - Error dashboard no existente")
                throw Exception("Dashboard no encontrado")
            }
        } catch (e: Exception) {
            LOGGER.error("BL - Error al obtener el dashboard")
            throw e
        }
    }
    //Metodo para actualizar el dia, hora y estado del dashboard
    fun updateDashBoard(dashBoardConfigDto: DashBoardConfigDto): String {
        LOGGER.info("BL - Iniciando logica para actualizar el dashboard")
        try {
            val dashboard = dashBoardRepository.findById(1)
            if(dashboard.isPresent){
                dashboard.get().five = dashBoardConfigDto.five
                dashboard.get().thirteen = dashBoardConfigDto.thirteen
                dashboard.get().twenty = dashBoardConfigDto.twenty
                dashboard.get().state = dashBoardConfigDto.state
                dashBoardRepository.save(dashboard.get())
                LOGGER.info("BL - Dashboard actualizado con exito")
                return "Fecha y hora actualizadas con exito"
            }else{
                LOGGER.error("BL - Error dashboard no existente")
                throw Exception("Dashboard no encontrado")
            }
        } catch (e: Exception) {
            LOGGER.error("BL - Error al actualizar el dashboard")
            throw e
        }
    }
    //Metodo para la logica de actualizar los datos del dashboard
    fun updateDashBoardData(){
        LOGGER.info("BL - Iniciando logica para actualizar los datos del dashboard")
        try {
            var countHashes = 0
            var lengthOne = 0
            var lengthTwo = 0
            var lengthThree = 0
            var lengthFour = 0
            // Contadores de formatos
            var empty = 0
            var numeric = 0
            var alpha = 0
            var alphaNumeric = 0
            var alphaSpecial = 0
            var numericSpecial = 0
            var alpharNumericSpecial = 0
            // Contador de palabras
            val wordCount = mutableMapOf<String, Int>()
            // Contador de palabras base
            val wordBase = mutableMapOf<String, Int>()
            // Contador de mascaras
            val maskCount = mutableMapOf<String, Int>()

            // Se obtienen todos los hashes
            val hashes = hashRepository.findAll()
            // Se recorren los hashes
            hashes.forEach {
                countHashes++
                // Se obtiene la longitud del hash
                when(it.clearHash.length){
                    //Rango de 0 a 5
                    in 0..5 -> {
                        lengthOne++
                    }
                    //Rango de 6 a 10
                    in 6..10 -> {
                        lengthTwo++
                    }
                    //Rango de 11 a 15
                    in 11..15 -> {
                        lengthThree++
                    }
                    //Rango de 16 o más
                    else -> {
                        lengthFour++
                    }
                }
                //Identificar que tipo de formato es el clear hash
                if (it.clearHash.isEmpty()) {
                    empty++
                } else if (it.clearHash.matches(Regex("^[0-9]+\$"))) {
                    numeric++
                } else if (it.clearHash.matches(Regex("^[a-zA-Z]+\$"))) {
                    alpha++
                } else if (it.clearHash.matches(Regex("^[a-zA-Z0-9]*\$"))) {
                    alphaNumeric++
                } else if (it.clearHash.matches(Regex("^(?=[a-zA-Z!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]*[a-z])(?=[a-zA-Z!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]*[A-Z])(?=[a-zA-Z!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]*[!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?])[a-zA-Z!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]+\$"))) {
                    alphaSpecial++
                } else if (it.clearHash.matches(Regex("^(?=.*[0-9])(?=.*[!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?])[0-9!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]+\$"))) {
                    numericSpecial++
                } else if (it.clearHash.matches(Regex("^(?=[a-zA-Z0-9!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]*[0-9])(?=[a-zA-Z0-9!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]*[a-z])(?=[a-zA-Z0-9!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]*[A-Z])(?=[a-zA-Z0-9!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]*[!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?])[a-zA-Z0-9!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]+\$"))) {
                    alpharNumericSpecial++
                }
                // Se obtiene la palabra mas repetida
                val words = it.clearHash.split("\n")
                words.forEach {
                    if(wordCount.containsKey(it)){
                        wordCount[it] = wordCount[it]!! + 1
                    }else{
                        wordCount[it] = 1
                    }
                }
                //Top 10 palabras base
                val matches = Regex("[a-zA-Z]{4,20}").findAll(it.clearHash)
                for (match in matches) {
                    val baseWord = match.value
                    wordBase[baseWord] = (wordBase[baseWord] ?: 0) + 1
                }

                //Top 10 de mascaras
                val mask = gen_mask(it.clearHash)
                maskCount[mask] = (maskCount[mask] ?: 0) + 1

            }

        //Cocatenar las palabras mas usadas y su conteo en un solo string separada por comas
        val wordCountString = wordCount.toList().sortedByDescending { (_, value) -> value }.take(10).joinToString(separator = ",") { (key, value) -> "$key: $value" }
        val mostUsedBase = wordBase.toList().sortedByDescending { (_, value) -> value }.take(10).joinToString(separator = ",") { (key, value) -> "$key: $value" }
        val mostMask = maskCount.toList().sortedByDescending { (_, value) -> value }.take(10).joinToString(separator = ",") { (key, value) -> "$key: $value" }

        //Se actualiza los datos del dashboard
        val dashboard = dashBoardRepository.findById(1)
            if(dashboard.isPresent){
                dashboard.get().countHashes = countHashes
                dashboard.get().lengthOne = lengthOne
                dashboard.get().lengthTwo = lengthTwo
                dashboard.get().lengthThree = lengthThree
                dashboard.get().lengthFour = lengthFour
                dashboard.get().empty = empty
                dashboard.get().numeric = numeric
                dashboard.get().alpha = alpha
                dashboard.get().alphaNumeric = alphaNumeric
                dashboard.get().alphaSpecial = alphaSpecial
                dashboard.get().numericSpecial = numericSpecial
                dashboard.get().alphaNumericSpecial = alpharNumericSpecial
                dashboard.get().mostWord = wordCountString
                dashboard.get().mostWordBase = mostUsedBase
                dashboard.get().mostMask = mostMask
                dashBoardRepository.save(dashboard.get())
                LOGGER.info("BL - Datos del dashboard actualizados con exito")
            }else{
                LOGGER.error("BL - Error dashboard no existente")
                throw Exception("Dashboard no encontrado")
            }
        } catch (e: Exception) {
            LOGGER.error("BL - Error al actualizar los datos del dashboard")
            throw e
        }

    }

    //Metodo para obtener la mascara de una contraseña
    fun gen_mask(password: String): String {
        return password.map { when {
            it.isUpperCase() -> 'U'
            it.isLowerCase() -> 'l'
            it.isDigit() -> 'd'
            else -> '$'
        }}.joinToString("")
    }

    //Metodo para ejecutar una tarea programada a las 5 AM
    @Scheduled(cron = "0 0 5 * * ?")
    fun performTask() {
        //Verificar que el atributo five sea true
        val dashboard = dashBoardRepository.findById(1)
        if(dashboard.get().five == true){
            LOGGER.info("Tarea ejecutada a las 5 AM: ${LocalDateTime.now()}")
            // Ejecutar la logica para actualizar los datos del dashboard
            updateDashBoardData()
        }
    }

    //Metodo para ejecutar una tarea programada a las 1 PM
    @Scheduled(cron = "0 0 13 * * ?")
    fun performTask2() {
        //Verificar que el atributo thirteen sea true
        val dashboard = dashBoardRepository.findById(1)
        if(dashboard.get().thirteen == true){
            LOGGER.info("Tarea ejecutada a la 1 PM: ${LocalDateTime.now()}")
            // Ejecutar la logica para actualizar los datos del dashboard
            updateDashBoardData()
        }
    }

    //Metodo para ejecutar una tarea programada a las 8 PM
    @Scheduled(cron = "0 0 20 * * ?")
    fun performTask3() {
        //Verificar que el atributo twenty sea true
        val dashboard = dashBoardRepository.findById(1)
        if(dashboard.get().twenty == true){
            LOGGER.info("Tarea ejecutada a las 8 PM: ${LocalDateTime.now()}")
            // Ejecutar la logica para actualizar los datos del dashboard
            updateDashBoardData()
        }
    }
}