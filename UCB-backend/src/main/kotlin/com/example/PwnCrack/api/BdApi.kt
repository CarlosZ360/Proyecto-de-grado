package com.example.PwnCrack.api

import com.example.PwnCrack.api.ReportApi.Companion
import org.springframework.beans.factory.annotation.Autowired
import com.example.PwnCrack.bl.DbBl
import com.example.PwnCrack.dto.DashBoardConfigDto
import com.example.PwnCrack.dto.DashBoardDto
import com.example.PwnCrack.dto.ResponseDto
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.io.BufferedReader
import java.io.InputStreamReader
import javax.servlet.http.HttpServletResponse
import com.example.PwnCrack.util.AuthUtil
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api/")
class BdApi @Autowired constructor(
        private val dbBl: DbBl,
        private val authUtil: AuthUtil
){
    //Logger
    companion object {
        val LOGGER: Logger = LoggerFactory.getLogger(BdApi::class.java)
    }
    //==============================================================
    // BASE DE DATOS
    /**
     * Endpoint GET para hacer un backup de la base de datos
     * @return ResponseDto<String>
     */
    @GetMapping("/backup")
    fun generateBackup(response: HttpServletResponse) {
        val processBuilder = ProcessBuilder("docker", "exec", "-it", "postgres-PwnCrack" , "pg_dump", "-U", "postgres", "-d", "pwncrack")
        processBuilder.redirectErrorStream(true) // Redirige la salida de error al mismo flujo de salida que la salida estándar
        processBuilder.redirectOutput(ProcessBuilder.Redirect.PIPE)

        val process = processBuilder.start()

        // Lee la salida del proceso línea por línea y almacénala en un StringBuilder
        val backupContent = StringBuilder()
        val reader = BufferedReader(InputStreamReader(process.inputStream))
        var line: String?
        while (reader.readLine().also { line = it } != null) {
            backupContent.append(line).append("\n") // Agrega la línea al StringBuilder
        }

        // Espera a que el proceso termine
        val exitCode = process.waitFor()
        if (exitCode != 0) {
            throw RuntimeException("Error al ejecutar el comando pg_dump. Código de salida: $exitCode")
        }

        // Configura la respuesta HTTP
        response.contentType = "application/octet-stream"
        response.setHeader("Content-Disposition", "attachment; filename=backup.sql")

        // Escribe el contenido del backup en el cuerpo de la respuesta
        response.writer.use { it.write(backupContent.toString()) }
    }
    /**
     * Endpoint GET para obtener los datos del dashboard
     * @return ResponseDto<DashBoardDto>
     */
    @GetMapping("/dashboard")
    fun getDashboard(@RequestHeader headers: Map<String, String>): ResponseDto<DashBoardDto> {
        LOGGER.info("API - Iniciando logica para obtener los datos del dashboard")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR" || role == "CONSULTOR") {
                // Se obtiene el dashboard
                val dashBoard = dbBl.getDashBoard()
                LOGGER.info("API - Datos del dashboard obtenidos con exito")
                ResponseDto(data = dashBoard,
                        message = "Datos del dashboard obtenidos con exito",
                        success = true)
            } else {
                ReportApi.LOGGER.error("API - Error al obtener el dashboard, no tiene permisos")
                ResponseDto(data = null, message = "Error al obtener el dashboard, no tiene permisos", success = false)
            }

        } catch (e: Exception) {
            LOGGER.error("API - Error al obtener los datos del dashboard")
            ResponseDto(data = null, message = "Error al obtener el dash board", success = false)

        }
    }
    /**
     * Endpoint PUT para actualizar el guardado de datos del dashboard
     * @return ResponseDto<String>
     */
    @PutMapping("/updateDashboard")
    fun updateDashboard(@RequestHeader headers: Map<String, String>, @RequestBody dashBoardConfigDto: DashBoardConfigDto): ResponseDto<String> {
        LOGGER.info("API - Iniciando logica para actualizar el dashboard")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR") {
                // Se actualiza el dashboard
                dbBl.updateDashBoard(dashBoardConfigDto)
                LOGGER.info("API - Dashboard actualizado con exito")
                ResponseDto(data = "Dashboard actualizado con exito",
                        message = "Dashboard actualizado con exito",
                        success = true)
            } else {
                ReportApi.LOGGER.error("API - Error al actualizar el dashboard, no tiene permisos")
                ResponseDto(data = null, message = "Error al actualizar el dashboard, no tiene permisos", success = false)
            }

        } catch (e: Exception) {
            LOGGER.error("API - Error al actualizar el dashboard")
            ResponseDto(data = null, message = "Error al actualizar el dashboard", success = false)

        }
    }

}