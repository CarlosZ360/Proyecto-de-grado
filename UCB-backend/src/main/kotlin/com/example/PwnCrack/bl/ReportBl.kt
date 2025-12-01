package com.example.PwnCrack.bl

import com.example.PwnCrack.dao.repository.DashBoardRepository
import com.example.PwnCrack.dao.repository.HashRepository
import com.example.PwnCrack.dao.repository.ReportFinalRepository
import com.example.PwnCrack.dao.repository.ReportRepository
import com.example.PwnCrack.dto.ReportDto
import com.example.PwnCrack.dto.ReportFinalDto
import com.example.PwnCrack.dto.ReportListDto
import com.example.PwnCrack.dto.ReportListFinalDto
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.BufferedReader
import java.io.File
import java.util.*
import kotlin.collections.ArrayList


@Service
class ReportBl @Autowired constructor(
        private val hashRepository: HashRepository,
        private val reportRepository: ReportRepository,
        private val reportFinalRepository: ReportFinalRepository,
        private val dbBl: DbBl,
        private val dashBoardRepository: DashBoardRepository
) {
    //Logger
    companion object {
        val LOGGER: Logger = LoggerFactory.getLogger(ReportBl::class.java)
    }
    //Metodo para leer un archivo .txt y guardar el conteo de hashes procesados y hashes crackeados
    fun readTxtFile(id:Long, archivo: MultipartFile): Long {
        LOGGER.info("BL - Iniciando lógica para leer un archivo .txt")
        try {
            // Crear un archivo temporal donde se guardará el archivo recibido
            val tempFile = File.createTempFile("temp", null)
            archivo.transferTo(tempFile)
            // Crear un archivo .txt en donde se guardaran los hashes crackeados
            val file = File("hashes_crackeados.txt")
            file.createNewFile()

            // Valores iniciales para el conteo de hashes procesados y hashes crackeados
            var countHashes = 0
            var countCracked = 0
            var lengthOne = 0
            var lengthTwo = 0
            var lengthThree = 0
            var lengthFour = 0
            // Leer el contenido del archivo temporal
            val inputString = tempFile.bufferedReader().use(BufferedReader::readText)
            val lines = inputString.split("\n")
            for (line in lines) {
                //val data = line.split(":")
                val hash = line.trim()
                if (hash.length == 32) {
                    countHashes++
                    //Comparar la existencia del hash en la base de datos
                    if(hashRepository.existsByHash(hash)) {
                        // Obtener el clearhash de la base de datos
                        val clearHash = hashRepository.findByHash(hash).clearHash
                        LOGGER.info("BL - El hash: $hash ya existe en la base de datos")
                        countCracked++
                        //Contar la longitud del clearHash
                        when (clearHash.length) {
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
                        //Guardar hash en el archivo .txt
                        file.appendText("$hash:$clearHash\n")
                    }
                }else{
                    //Otro formato alterno es ej. dominio\usuario:500:test:hash:::
                    val data = line.split(":")
                    if (data.size == 7 && !data[0].endsWith("$") && data[3].length == 32) {
                        LOGGER.info("BL - Formato alterno de tipo dumpeo detectado")
                        countHashes++
                        val hash = data[3]
                        //Comparar la existencia del hash en la base de datos
                        if(hashRepository.existsByHash(hash)) {
                            // Obtener el clearhash de la base de datos
                            val clearHash = hashRepository.findByHash(hash).clearHash
                            LOGGER.info("BL - El hash: $hash ya existe en la base de datos")
                            countCracked++
                            //Contar la longitud del clearHash
                            when (clearHash.length) {
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
                            //Guardar hash en el archivo .txt
                            file.appendText("$hash:$clearHash\n")
                        }
                    }
                }
            }
            val byteArray = file.readBytes()

            //Guardar reporte en base de datos
            val reportSave = reportRepository.save(com.example.PwnCrack.dao.Report(id, countHashes, countCracked, lengthOne, lengthTwo, lengthThree, lengthFour, byteArray,true))
            //reportRepository.save(com.example.PwnCrack.dao.Report(id, countHashes, countCracked, lengthOne, lengthTwo, lengthThree, lengthFour, true))
            LOGGER.info("BL - Guardando reporte en base de datos")

            // Imprimir por terminal el conteo de hashes procesados y hashes crackeados
            LOGGER.info("Hashes procesados: $countHashes, Hashes crackeados: $countCracked")
            LOGGER.info("BL - Archivo .txt leído con éxito")
            // Vaciar el archivo .txt
            file.writeText("")
            return reportSave.reportId
        } catch (e: Exception) {
            LOGGER.error("BL - Error al leer el archivo .txt")
            throw e
        }
    }
    //Metodo para obtener report por id
    fun getReportById(id: Long): ReportDto{
        LOGGER.info("BL - Iniciando lógica para obtener un reporte por su id")
        try {
            // Se obtiene el reporte
            val report = reportRepository.findById(id)
            if(report.isPresent){
                LOGGER.info("BL - Reporte esta presente")
                return ReportDto(
                        reportId = report.get().reportId,
                        auditId = report.get().auditId,
                        countHashes = report.get().countHashes,
                        countCracked = report.get().countCracked,
                        lengthOne = report.get().lengthOne,
                        lengthTwo = report.get().lengthTwo,
                        lengthThree = report.get().lengthThree,
                        lengthFour = report.get().lengthFour,
                        fileCracked = report.get().fileCracked,
                        state = report.get().state
                )
            }else{
                LOGGER.error("BL - Reporte no encontrado")
                throw Exception("Reporte no encontrado")
            }
        } catch (e: Exception) {
            LOGGER.error("BL - Error al obtener el reporte")
            throw e
        }
    }
    //Metodo para obtener todos los reportes de una auditoria
    fun getReportsByAuditId(auditId: Long): List<ReportListDto>{
        LOGGER.info("BL - Iniciando lógica para obtener reportes por auditId")
        try {
            // Se obtienen los reportes
            val reports = reportRepository.findByAuditId(auditId)
            val reportListDto = ArrayList<ReportListDto>()
            reports.forEach {
                reportListDto.add(ReportListDto(
                        reportId = it.reportId,
                        auditId = it.auditId,
                        state = it.state
                ))
            }
            return reportListDto
        } catch (e: Exception) {
            LOGGER.error("BL - Error al obtener los reportes")
            throw e
        }
    }
    //==================================================================================================
    //Logica de reporte final
    //Metodo para leer un archivo .txt y guardar el coteo de hashes procesados y hashes crackeados
    fun readTxtFiles(id:Long, archivo1: MultipartFile, archivo2: MultipartFile, observation: String): Long {
        LOGGER.info("BL - Iniciando lógica para leer un archivo .txt")
        try {
            // Crear un archivo temporal donde se guardará el archivo1 recibido
            val tempFile = File.createTempFile("temp", null)
            archivo1.transferTo(tempFile)
            // Crear un archivo temporal donde se guardará el archivo1 recibido
            val tempFile2 = File.createTempFile("temp", null)
            archivo2.transferTo(tempFile2)
            // Crear un archivo .txt en donde se guardaran los hashes crackeados
            val fileHashes = File("hashes_crackeados.txt")
            fileHashes.createNewFile()
            // Crear un archivo .txt en donde se guardaran los dumps crackeados
            val fileDumps = File("dumps_crackeados.txt")
            fileDumps.createNewFile()

            // Valores iniciales para el conteo de hashes procesados, hashes crackeados, formatos, palabras mas usadas y palabras base
            var countHashes = 0
            var countCracked = 0
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
            //Contador de hashes procesados del archivo 1
            var countHashesDump = 0
            //Contador de hashes procesados del archivo 2
            var countPotfile = 0
            // Contador de palabras
            val wordCount = mutableMapOf<String, Int>()
            // Contador de palabras base
            val wordBase = mutableMapOf<String, Int>()
            // Contador de mascaras
            val maskCount = mutableMapOf<String, Int>()

            // Leer el contenido del archivo temporal 2
            val inputString2 = tempFile2.bufferedReader().use(BufferedReader::readText)
            val lines2 = inputString2.split("\n")
            for (line in lines2) {
                val data = line.split(":")
                if (data.size == 2 && data[0].length == 32) {
                    countHashes++
                    countPotfile++
                    val hash = data[0]
                    val clearHash = data[1].trim()
                    //Imprimir por terminal el hash y el clearHash
                    println("Hash: $hash, ClearHash: $clearHash")
                    //Comparar la existencia del hash en la base de datos
                    if (hashRepository.existsByHash(hash)) {
                        LOGGER.info("BL - El hash: $hash ya existe en la base de datos")
                    }else{
                        // Guardar en la base de datos el hash y el clearHash
                        LOGGER.info("BL - Guardando hash: $hash en la base de datos")
                        hashRepository.save(com.example.PwnCrack.dao.Hash(hash, clearHash, true, 1))
                    }
                } else {
                    LOGGER.info("BL - Formato no aceptado $line" )
                }
            }
            //Cerrar la lectura del archivo 2
            tempFile2.bufferedReader().close()

            // Leer el contenido del archivo temporal 1
            val inputString = tempFile.bufferedReader().use(BufferedReader::readText)
            val lines = inputString.split("\n")
            for (line in lines) {
                val data = line.split(":")
                //quitar espacios en blanco
                val hash = line.trim()
                if (hash.length == 32) {
                    //Guardar hash en el archivo .txt
                    fileDumps.appendText("$line\n")
                    countHashes++
                    countHashesDump++
                    //val hash = line
                    //Imprimir por terminal el hash y el clearHash
                    //Comparar la existencia del hash en la base de datos
                    if (hashRepository.existsByHash(hash)) {
                        //Obtener el clearhash de la base de datos
                        val clearHash = hashRepository.findByHash(hash).clearHash

                        LOGGER.info("BL - El hash: $hash ya existe en la base de datos")
                        countCracked++
                        //Contar la longitud del clearHash
                        when (clearHash.length) {
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
                        //clearHash.trim()
                        //Identificar que tipo de formato es el clear hash
                        if (clearHash.isEmpty()) {
                            empty++
                        } else if (clearHash.matches(Regex("^[0-9]+\$"))) {
                            numeric++
                        } else if (clearHash.matches(Regex("^[a-zA-Z]+\$"))) {
                            alpha++
                        } else if (clearHash.matches(Regex("^[a-zA-Z0-9]*\$"))) {
                            alphaNumeric++
                        } else if (clearHash.matches(Regex("^(?=[a-zA-Z!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]*[a-z])(?=[a-zA-Z!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]*[A-Z])(?=[a-zA-Z!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]*[!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?])[a-zA-Z!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]+\$"))) {
                            alphaSpecial++
                        } else if (clearHash.matches(Regex("^(?=.*[0-9])(?=.*[!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?])[0-9!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]+\$"))) {
                            numericSpecial++
                        } else if (clearHash.matches(Regex("^(?=[a-zA-Z0-9!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]*[0-9])(?=[a-zA-Z0-9!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]*[a-z])(?=[a-zA-Z0-9!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]*[A-Z])(?=[a-zA-Z0-9!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]*[!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?])[a-zA-Z0-9!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]+\$"))) {
                            alpharNumericSpecial++
                        }
                        //Top 10 de hashes mas usados en el archivo
                        val words = clearHash.split("\n")
                        for (word in words) {
                            val count = wordCount[word]
                            if (count == null) {
                                wordCount[word] = 1
                            } else {
                                wordCount[word] = count + 1
                            }
                        }
                        //Top 10 palabras base
                        val matches = Regex("[a-zA-Z]{4,20}").findAll(clearHash)
                        for (match in matches) {
                            val baseWord = match.value
                            wordBase[baseWord] = (wordBase[baseWord] ?: 0) + 1
                        }

                        //Top 10 de mascaras
                        val mask = gen_mask(clearHash)
                        maskCount[mask] = (maskCount[mask] ?: 0) + 1

                        //Guardar hash en el archivo .txt
                        fileHashes.appendText("$hash:$clearHash\n")
                    }
                } else {
                    //Otro formato alterno es ej. dominio\usuario:500:test:hash:::
                    val data = line.split(":")
                    if (data.size == 7 && !data[0].endsWith("$") && data[3].length == 32) {
                        //Guardar hash en el archivo .txt
                        fileDumps.appendText("$line\n")
                        LOGGER.info("BL - Formato alterno de tipo dumpeo detectado")
                        countHashes++
                        countHashesDump++
                        val hash = data[3]
                        val clearHash = data[2].trim()
                        //Imprimir por terminal el hash y el clearHash
                        println("Hash: $hash, ClearHash: $clearHash")
                        //Comparar la existencia del hash en la base de datos
                        if (hashRepository.existsByHash(hash)) {
                            LOGGER.info("BL - El hash: $hash ya existe en la base de datos")
                            countCracked++
                            //Obtener el clearhash de la base de datos
                            val clearHash = hashRepository.findByHash(hash).clearHash
                            //Contar la longitud del clearHash
                            when (clearHash.length) {
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
                            //clearHash.trim()
                            //Identificar que tipo de formato es el clear hash
                            if (clearHash.isEmpty()) {
                                empty++
                            } else if (clearHash.matches(Regex("^[0-9]+\$"))) {
                                numeric++
                            } else if (clearHash.matches(Regex("^[a-zA-Z]+\$"))) {
                                alpha++
                            } else if (clearHash.matches(Regex("^[a-zA-Z0-9]*\$"))) {
                                alphaNumeric++
                            } else if (clearHash.matches(Regex("^(?=[a-zA-Z!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]*[a-z])(?=[a-zA-Z!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]*[A-Z])(?=[a-zA-Z!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]*[!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?])[a-zA-Z!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]+\$"))) {
                                alphaSpecial++
                            } else if (clearHash.matches(Regex("^(?=.*[0-9])(?=.*[!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?])[0-9!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]+\$"))) {
                                numericSpecial++
                            } else if (clearHash.matches(Regex("^(?=[a-zA-Z0-9!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]*[0-9])(?=[a-zA-Z0-9!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]*[a-z])(?=[a-zA-Z0-9!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]*[A-Z])(?=[a-zA-Z0-9!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]*[!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?])[a-zA-Z0-9!@#\$%^&*()_+\\-=\\[\\]{};\\':\"\\\\|,.<>\\/?]+\$"))) {
                                alpharNumericSpecial++
                            }
                            //Top 10 de hashes mas usados en el archivo
                            val words = clearHash.split("\n")
                            for (word in words) {
                                val count = wordCount[word]
                                if (count == null) {
                                    wordCount[word] = 1
                                } else {
                                    wordCount[word] = count + 1
                                }
                            }

                            // top 10 palabras base
                            val matches = Regex("[a-zA-Z]{4,20}").findAll(clearHash)
                            for (match in matches) {
                                val baseWord = match.value
                                wordBase[baseWord] = (wordBase[baseWord] ?: 0) + 1
                            }

                            //Top 10 de mascaras
                            val mask = gen_mask(clearHash)
                            maskCount[mask] = (maskCount[mask] ?: 0) + 1

                            //Guardar hash en el archivo .txt
                            fileHashes.appendText("$hash:$clearHash\n")
                        }
                    }
                }
            }
            //Cerrar la lectura del archivo 1
            tempFile.bufferedReader().close()

            //Cocatenar las palabras mas usadas y su conteo en un solo string separada por comas
            val wordCountString = wordCount.toList().sortedByDescending { (_, value) -> value }.take(10).joinToString(separator = ",") { (key, value) -> "$key: $value" }
            val mostUsedBase = wordBase.toList().sortedByDescending { (_, value) -> value }.take(10).joinToString(separator = ",") { (key, value) -> "$key: $value" }
            val mostMask = maskCount.toList().sortedByDescending { (_, value) -> value }.take(10).joinToString(separator = ",") { (key, value) -> "$key: $value" }
            // Guardar archivo de hashesCrackeados
            val byteArrayHashes = fileHashes.readBytes()
            // Guardar archivo de dumpsCrackeados
            val byteArrayDumps = fileDumps.readBytes()
            // Obtener fecha del sistema
            val date = Date()

            //Guardar reporte en base de datos
            val reportSave = reportFinalRepository.save(com.example.PwnCrack.dao.ReportFinal(id, countHashesDump, countPotfile, countHashes, countCracked, lengthOne, lengthTwo, lengthThree, lengthFour, empty, numeric, alpha, alphaNumeric, alphaSpecial, numericSpecial, alpharNumericSpecial, wordCountString, mostUsedBase ,mostMask, byteArrayHashes, byteArrayDumps, observation, date,true))
            LOGGER.info("BL - Guardando reporte en base de datos")

            // Imprimir por terminal el conteo de hashes procesados y hashes crackeados
            LOGGER.info("Hashes procesados: $countHashes, Hashes crackeados: $countCracked")
            LOGGER.info("BL - Archivo .txt leído con éxito")
            // Vaciar el archivo .txt
            fileHashes.writeText("")
            fileDumps.writeText("")

            val dashboard = dashBoardRepository.findById(1)
            if(dashboard.get().state == true){
                dbBl.updateDashBoardData()
            }

            return reportSave.reportId
        } catch (e: Exception) {
            LOGGER.error("BL - Error al leer el archivo .txt")
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

    //Metodo para obtener report final por su id
    fun getReportFinalById(id: Long): ReportFinalDto{
        LOGGER.info("BL - Iniciando lógica para obtener un reporte final por su id")
        try {
            // Se obtiene el reporte final
            val reportFinal = reportFinalRepository.findById(id)
            if(reportFinal.isPresent){
                LOGGER.info("BL - Reporte final esta presente")
                return ReportFinalDto(
                        reportFinalId = reportFinal.get().reportFinalId,
                        reportId = reportFinal.get().reportId,
                        countHashesDumps = reportFinal.get().countHashesDumps,
                        countHashesPotfile = reportFinal.get().countHashesPotfile,
                        countHashes = reportFinal.get().countHashes,
                        countCracked = reportFinal.get().countCracked,
                        lengthOne = reportFinal.get().lengthOne,
                        lengthTwo = reportFinal.get().lengthTwo,
                        lengthThree = reportFinal.get().lengthThree,
                        lengthFour = reportFinal.get().lengthFour,
                        empty = reportFinal.get().empty,
                        numeric = reportFinal.get().numeric,
                        alpha = reportFinal.get().alpha,
                        alphaNumeric = reportFinal.get().alphaNumeric,
                        alphaSpecial = reportFinal.get().alphaSpecial,
                        numericSpecial = reportFinal.get().numericSpecial,
                        alphaNumericSpecial = reportFinal.get().alphaNumericSpecial,
                        mostWord = reportFinal.get().mostWord,
                        mostWordBase = reportFinal.get().mostWordBase,
                        mostMask = reportFinal.get().mostMask,
                        fileCrackedHashes = reportFinal.get().fileCrackedHashes,
                        fileCrackedPotfile = reportFinal.get().fileCrackedPotfile,
                        observation = reportFinal.get().observation,
                        date = reportFinal.get().date,
                        state = reportFinal.get().state
                )
            }else{
                LOGGER.error("BL - Reporte final no encontrado")
                throw Exception("Reporte final no encontrado")
            }
        } catch (e: Exception) {
            LOGGER.error("BL - Error al obtener el reporte final")
            throw e
        }
    }
    //Metodo para obtener todos los reportes finales de un reporte por medio de su id
    fun getReportsFinalByReportId(reportId: Long): List<ReportListFinalDto> {
        LOGGER.info("BL - Iniciando lógica para obtener reportes finales por reportId")
        try {
            // Se obtienen los reportes finales
            val reportsFinal = reportFinalRepository.findByReportId(reportId)
            val reportFinalListDto = ArrayList<ReportListFinalDto>()
            reportsFinal.forEach {
                reportFinalListDto.add(ReportListFinalDto(
                        reportFinalId = it.reportFinalId,
                        reportId = it.reportId,
                        state = it.state
                ))
            }
            return reportFinalListDto
        } catch (e: Exception) {
            LOGGER.error("BL - Error al obtener los reportes finales")
            throw e
        }
    }

    //Metodo para obtener todos los hash y clearhash de la base de datos en un binario
    fun getHashes(): ByteArray {
        LOGGER.info("BL - Iniciando lógica para obtener todos los hashes de la base de datos")
        try {
            // Se obtienen los hashes
            val hashes = hashRepository.findAll()
            val file = File("hashes.txt")
            file.createNewFile()

            // Escribir en el archivo
            hashes.forEach {
                file.appendText("${it.hash}:${it.clearHash}\n")
            }
            val byteArray = file.readBytes()
            // Limpiar el archivo
            file.writeText("")
            return byteArray
        } catch (e: Exception) {
            LOGGER.error("BL - Error al obtener los hashes de la base de datos")
            throw e
        }
    }

    //Metodo para leer un archivo y comparar el hash y clearhash con la base de datos
    fun readFilePotfile (archivo: MultipartFile): String {
        LOGGER.info("BL - Iniciando lógica para leer un archivo .txt")
        try {
            // Crear un archivo temporal donde se guardará el archivo recibido
            val tempFile = File.createTempFile("temp", null)
            archivo.transferTo(tempFile)

            // Leer el contenido del archivo temporal
            val inputString = tempFile.bufferedReader().use(BufferedReader::readText)
            val lines = inputString.split("\n")
            for (line in lines) {
                val data = line.split(":")
                if (data.size == 2 && data[0].length == 32) {

                    val hash = data[0]
                    val clearHash = data[1].trim()
                    //Imprimir por terminal el hash y el clearHash
                    println("Hash: $hash, ClearHash: $clearHash")
                    //Comparar la existencia del hash en la base de datos
                    if (hashRepository.existsByHash(hash)) {
                        LOGGER.info("BL - El hash: $hash ya existe en la base de datos")
                    }else{
                        // Guardar en la base de datos el hash y el clearHash
                        LOGGER.info("BL - Guardando hash: $hash en la base de datos")
                        hashRepository.save(com.example.PwnCrack.dao.Hash(hash, clearHash, true, 1))
                    }
                } else {
                    LOGGER.info("BL - Formato no aceptado $line" )
                }
            }
            //Cerrar la lectura del archivo
            tempFile.bufferedReader().close()

            // Ejecutar la actualizacion de dashboard de la clase DbBL si state de dashboard es true
            val dashboard = dashBoardRepository.findById(1)
            if(dashboard.get().state == true){
                dbBl.updateDashBoardData()
            }

            return "Archivo leído con éxito"


        } catch (e: Exception) {
            LOGGER.error("BL - Error al leer el archivo .txt")
            throw e
        }
    }

}

