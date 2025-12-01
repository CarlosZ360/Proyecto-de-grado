package com.example.PwnCrack.bl
import at.favre.lib.crypto.bcrypt.BCrypt
import com.example.PwnCrack.dao.Client
import com.example.PwnCrack.dao.repository.*
import com.example.PwnCrack.dto.ClientDto
import com.example.PwnCrack.dto.ClientStatsDto

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.slf4j.Logger
import org.slf4j.LoggerFactory

@Service
class ClientBl @Autowired constructor(
    private val clientRepository: ClientRepository,
    private val employeeRepository: EmployeeRepository,
    private val auditRepository: AuditRepository,
    private val reportRepository: ReportRepository,
    private val reportFinalRepository: ReportFinalRepository,
    private val companyRepository: CompanyRepository

){
    companion object {
        val LOGGER: Logger = LoggerFactory.getLogger(ClientBl::class.java)
    }
    //Metodo para crear un cliente
    fun createClient(clientDto: ClientDto): Long {
        LOGGER.info("BL - Iniciando logica para crear un cliente")
        try {
            val password: String = BCrypt.withDefaults().hashToString(12, clientDto.password.toCharArray())

            // Se crea el cliente
            val client = Client()
            client.name = clientDto.name
            client.lastName = clientDto.lastName
            client.email = clientDto.email
            client.phone = clientDto.phone
            client.password = password
            client.position = clientDto.position
            client.companyId = clientDto.companyId
            //Verificar que el correo sea unico en empleados y clientes
            val employeeEmail = employeeRepository.findByEmailAndState(clientDto.email, true)
            val clientEmail = clientRepository.findByEmailAndState(clientDto.email, true)
            if(employeeEmail != null || clientEmail != null){
                EmployeeBl.LOGGER.error("BL - Error al crear el cliente, correo ya existente")
                throw Exception("Correo ya existente")
            }
            // Se guarda el cliente
            val clientSaved = clientRepository.save(client)
            LOGGER.info("BL - Cliente creado con exito")
            return clientSaved.clientId
        } catch (e: Exception) {
            LOGGER.error("BL - Error al crear el cliente")
            throw e
        }
    }

    //Metodo para obtener un cliente por su id
    fun getClientById(clientId: Long): ClientDto {
        LOGGER.info("BL - Iniciando logica para obtener un cliente por su id")
        try {
            // Se obtiene el cliente
            val client = clientRepository.findById(clientId)
            if(client.isPresent){
                LOGGER.info("BL - Cliente obtenido con exito")
                return ClientDto(
                        clientId = client.get().clientId,
                        name = client.get().name,
                        lastName = client.get().lastName,
                        email = client.get().email,
                        phone = client.get().phone,
                        state = client.get().state,
                        password = client.get().password,
                        position = client.get().position,
                        companyId = client.get().companyId
                )
            }else{
                LOGGER.error("BL - Error cliente no existente")
                throw Exception("Cliente no encontrado")
            }
        } catch (e: Exception) {
            LOGGER.error("BL - Error al obtener el cliente")
            throw e
        }
    }
    //Metodo para actualizar un cliente
    fun updateClient(clientId: Long, clientDto: ClientDto): String {
        LOGGER.info("BL - Iniciando logica para actualizar un cliente")
        //val password: String = BCrypt.withDefaults().hashToString(12, clientDto.password.toCharArray())

        try {
            // Se obtiene el cliente
            val client = clientRepository.findById(clientId)
            if(client.isPresent){
                // Se actualiza el cliente
                client.get().name = clientDto.name
                client.get().lastName = clientDto.lastName
                client.get().email = clientDto.email
                client.get().phone = clientDto.phone
                client.get().password = client.get().password
                client.get().position = clientDto.position
                client.get().companyId = clientDto.companyId
                // Se guarda el cliente
                clientRepository.save(client.get())
                LOGGER.info("BL - Cliente actualizado con exito")
                return "Cliente actualizado con exito"
            }else{
                LOGGER.error("BL - Error cliente no existente")
                throw Exception("Cliente no encontrado")
            }
        } catch (e: Exception) {
            LOGGER.error("BL - Error al actualizar el cliente")
            throw e
        }
    }

    //Metodo para eliminar un cliente - eliminado logico
    fun deleteClient(clientId: Long): String {
        LOGGER.info("BL - Iniciando logica para eliminar un cliente")
        try {
            // Se obtiene el cliente
            val client = clientRepository.findById(clientId)
            if(client.isPresent){
                // Se elimina el cliente
                client.get().state = false
                clientRepository.save(client.get())
                LOGGER.info("BL - Cliente eliminado con exito")
                return "Cliente eliminado con exito"
            }else{
                LOGGER.error("BL - Error cliente no existente")
                throw Exception("Cliente no encontrado")
            }
        } catch (e: Exception) {
            LOGGER.error("BL - Error al eliminar el cliente")
            throw e
        }
    }

    //Metodo para obtener todos los clientes activos
    fun getAllClients(): List<ClientDto> {
        LOGGER.info("BL - Iniciando logica para obtener todos los clientes activos")
        try {
            // Se obtienen los clientes
            val clients = clientRepository.findAllByState(true)
            val clientsDto = ArrayList<ClientDto>()
            clients.forEach {
                    clientsDto.add(ClientDto(
                            clientId = it.clientId,
                            name = it.name,
                            lastName = it.lastName,
                            email = it.email,
                            phone = it.phone,
                            state = it.state,
                            password = it.password,
                            position = it.position,
                            companyId = it.companyId
                    ))
            }
            LOGGER.info("BL - Clientes obtenidos con exito")
            return clientsDto
        } catch (e: Exception) {
            LOGGER.error("BL - Error al obtener los clientes")
            throw e
        }
    }
    //Funcion para actualizar contraseña de cliente por medio de su email
    fun updatePassword(email: String, password: String): String {
        LOGGER.info("BL - Iniciando logica para actualizar la contraseña de un cliente")
        try {
            // Se obtiene el cliente
            val client = clientRepository.findByEmailAndState(email, true)
            if(client != null){
                // Se actualiza la contraseña
                client.password = BCrypt.withDefaults().hashToString(12, password.toCharArray())
                // Se guarda el cliente
                clientRepository.save(client)
                LOGGER.info("BL - Contraseña actualizada con exito")
                return "Contraseña actualizada con exito"
            }else{
                LOGGER.error("BL - Error cliente no existente")
                throw Exception("Cliente no encontrado")
            }
        } catch (e: Exception) {
            LOGGER.error("BL - Error al actualizar la contraseña del cliente")
            throw e
        }
    }

    //Función para obtener el total de hashes procesados y crackeados de todos los reportes finales de un cliente
    fun getClientStats(clientId: Long): ClientStatsDto {
        LOGGER.info("BL - Iniciando logica para obtener las estadisticas de un cliente")
        try {
            // Se obtienen las auditorias del cliente
            val audits = auditRepository.findAllByCompanyId(clientId)
            var totalHashes = 0
            var totalCracked = 0
            // Para cada auditoria, obtener los reportes
            audits.forEach { audit ->
                val reports = reportRepository.findAllByAuditId(audit.auditId)
                // Para cada reporte, obtener los reportes finales
                reports.forEach { report ->
                    val finalReports = reportFinalRepository.findByReportId(report.reportId)
                    // Sumar todos los hashes procesados y crackeados de los reportes finales
                    finalReports.forEach { finalReport ->
                        totalHashes += finalReport.countHashesDumps
                        totalCracked += finalReport.countCracked
                    }
                }
            }

            LOGGER.info("BL - Estadisticas obtenidas con exito")
            return ClientStatsDto(
                name = companyRepository.findById(clientId).get().name,
                hashes = totalHashes,
                cracked = totalCracked
            )
        } catch (e: Exception) {
            LOGGER.error("BL - Error al obtener las estadisticas del cliente")
            throw e
        }
    }

}