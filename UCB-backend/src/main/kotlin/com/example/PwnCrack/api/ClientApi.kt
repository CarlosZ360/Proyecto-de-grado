package com.example.PwnCrack.api

import org.springframework.beans.factory.annotation.Autowired
import com.example.PwnCrack.bl.ClientBl
import com.example.PwnCrack.dto.ClientDto
import com.example.PwnCrack.dto.ClientStatsDto
import com.example.PwnCrack.dto.ResponseDto
import com.example.PwnCrack.util.AuthUtil
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api/")
class ClientApi @Autowired constructor(
        private val clientService: ClientBl,
        private val authUtil: AuthUtil
){
    //Logger
    companion object {
        val LOGGER: Logger = LoggerFactory.getLogger(CompanyApi::class.java)
    }
    //==============================================================
    // CLIENTE
    /**
     * Endpoint POST para crear un cliente
     * @param-clientDto
     * @return ResponseDto<Long>
     */
    @PostMapping("/client")
    fun createClient(@RequestHeader headers: Map<String, String>, @RequestBody clientDto: ClientDto): ResponseDto<Long> {
        LOGGER.info("API - Iniciando creación de cliente")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR") {
                // Se crea el cliente
                val clientId = clientService.createClient(clientDto)
                LOGGER.info("API - Cliente creado con exito")
                ResponseDto(data = clientId,
                        message = "Cliente creado con exito",
                        success = true)
            } else {
                LOGGER.error("API - Error al crear el cliente")
                ResponseDto(data = null, message = "Error al crear el cliente, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al crear el cliente")
            ResponseDto(data = null, message = "Error al crear el cliente, correo existente", success = false)
        }
    }
    /**
     * Endpoint GET para obtener un cliente por su id
     * @param-clientId
     * @return ResponseDto<ClientDto>
     */
    @GetMapping("/client/{clientId}")
    fun getClientById(@RequestHeader headers: Map<String, String>, @PathVariable clientId: Long): ResponseDto<ClientDto> {
        LOGGER.info("API - Iniciando obtención de cliente por id")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR" || role == "CONSULTOR" || role == "CLIENTE") {
                // Se obtiene el cliente
                val client = clientService.getClientById(clientId)
                LOGGER.info("API - Cliente obtenido con exito")
                ResponseDto(data = client,
                        message = "Cliente obtenido con exito",
                        success = true)
            } else {
                LOGGER.error("API - Error al obtener el cliente")
                ResponseDto(data = null, message = "Error al obtener el cliente, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al obtener el cliente")
            ResponseDto(data = null, message = "Error al obtener el cliente", success = false)
        }
    }
    /**
     * Endpoint PUT para actualizar un cliente
     * @param-clientId
     * @param-clientDto
     * @return ResponseDto<String>
     */
    @PutMapping("/client/{clientId}")
    fun updateClient(@RequestHeader headers: Map<String, String>, @PathVariable clientId: Long, @RequestBody clientDto: ClientDto): ResponseDto<String> {
        LOGGER.info("API - Iniciando actualización de cliente")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR" || role == "CLIENTE") {
                // Se actualiza el cliente
                val message = clientService.updateClient(clientId, clientDto)
                LOGGER.info("API - Cliente actualizado con exito")
                ResponseDto(data = message,
                        message = "Cliente actualizado con exito",
                        success = true)
            } else {
                LOGGER.error("API - Error al actualizar el cliente")
                ResponseDto(data = null, message = "Error al actualizar el cliente, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al actualizar el cliente")
            ResponseDto(data = null, message = "Error al actualizar el cliente", success = false)
        }
    }
    /**
     * Endpoint DELETE para eliminar un cliente
     * @param-clientId
     * @return ResponseDto<String>
     */
    @DeleteMapping("/client/{clientId}")
    fun deleteClient(@RequestHeader headers: Map<String, String>, @PathVariable clientId: Long): ResponseDto<String> {
        LOGGER.info("API - Iniciando eliminación de cliente")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR") {
                // Se elimina el cliente
                val message = clientService.deleteClient(clientId)
                LOGGER.info("API - Cliente eliminado con exito")
                ResponseDto(data = message,
                        message = "Cliente eliminado con exito",
                        success = true)
            } else {
                LOGGER.error("API - Error al eliminar el cliente")
                ResponseDto(data = null, message = "Error al eliminar el cliente, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al eliminar el cliente")
            ResponseDto(data = null, message = "Error al eliminar el cliente", success = false)
        }
    }
    /**
     * Endpoint GET para obtener todos los clientes
     * @return ResponseDto<List<ClientDto>>
     */
    @GetMapping("/clients")
    fun getAllClients(@RequestHeader headers: Map<String, String>): ResponseDto<List<ClientDto>> {
            LOGGER.info("API - Iniciando obtención de todos los clientes")
            return try {
                val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
                if(role == "ADMINISTRADOR" || role == "CONSULTOR") {
                    // Se obtienen los clientes
                    val clients = clientService.getAllClients()
                    LOGGER.info("API - Clientes obtenidos con exito")
                    ResponseDto(data = clients,
                            message = "Clientes obtenidos con exito",
                            success = true)
                } else {
                    LOGGER.error("API - Error al obtener los clientes")
                    ResponseDto(data = null, message = "Error al obtener los clientes, no tiene permisos", success = false)

                }
        } catch (e: Exception) {
            LOGGER.error("API - Error al obtener los clientes")
            ResponseDto(data = null, message = "Error al obtener los clientes", success = false)
        }
    }
    /**
     * Endpoint PUT para actualizar la contraseña de cliente por medio de su email
     * @param-email
     * @param-password
     * @return ResponseDto<String>
     */
    @PutMapping("/client/password")
    fun updatePassword(@RequestHeader headers: Map<String, String>, @RequestParam email: String, @RequestParam password: String): ResponseDto<String> {
        LOGGER.info("API - Iniciando actualización de contraseña de cliente")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR" || role == "CLIENTE") {
                // Se actualiza la contraseña
                val message = clientService.updatePassword(email, password)
                LOGGER.info("API - Contraseña actualizada con exito")
                ResponseDto(data = message,
                        message = "Contraseña actualizada con exito",
                        success = true)
            } else {
                LOGGER.error("API - Error al actualizar la contraseña del cliente")
                ResponseDto(data = null, message = "Error al actualizar la contraseña del cliente, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al actualizar la contraseña del cliente")
            ResponseDto(data = null, message = "Error al actualizar la contraseña del cliente", success = false)
        }
    }

    /**
     * Endpoint GET para obtener las estadisticas de un cliente (EMPRESA)
     * @param-clientId
     * @return ResponseDto<ClientStatsDto>
     */
    @GetMapping("/client/stats/{clientId}")
    fun getClientStats(@RequestHeader headers: Map<String, String>, @PathVariable clientId: Long): ResponseDto<ClientStatsDto> {
        LOGGER.info("API - Iniciando obtención de estadisticas de cliente")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR" || role == "CONSULTOR") {
                // Se obtienen las estadisticas del cliente
                val stats = clientService.getClientStats(clientId)
                LOGGER.info("API - Estadisticas obtenidas con exito")
                ResponseDto(data = stats,
                        message = "Estadisticas obtenidas con exito",
                        success = true)
            } else {
                LOGGER.error("API - Error al obtener las estadisticas del cliente")
                ResponseDto(data = null, message = "Error al obtener las estadisticas del cliente, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al obtener las estadisticas del cliente")
            ResponseDto(data = null, message = "Error al obtener las estadisticas del cliente", success = false)
        }
    }

}