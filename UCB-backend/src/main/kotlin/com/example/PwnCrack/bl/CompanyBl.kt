package com.example.PwnCrack.bl

import com.example.PwnCrack.dao.Company
import com.example.PwnCrack.dao.repository.CompanyRepository
import com.example.PwnCrack.dto.CompanyDto
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class CompanyBl @Autowired constructor(
        private val companyRepository: CompanyRepository

){
    companion object {
        val LOGGER: Logger = LoggerFactory.getLogger(CompanyBl::class.java)
    }
    // Método para crear una compañia
    fun createCompany(companyDto: CompanyDto): Long {
        LOGGER.info("BL - Iniciando logica para crear una compañia")
        try {
            // Se crea la compañia
            val company = Company()
            company.name = companyDto.name
            company.abrevation = companyDto.abrevation
            // Se guarda la compañia
            val companySaved = companyRepository.save(company)
            LOGGER.info("BL - Compañia creada con exito")
            return companySaved.companyId
        } catch (e: Exception) {
            LOGGER.error("BL - Error al crear la compañia")
            throw e
        }
    }
    //Metodo para obtener una compañia por su id
    fun getCompanyById(companyId: Long): CompanyDto {
        LOGGER.info("BL - Iniciando logica para obtener una compañia por su id")
        try {
            // Se obtiene la compañia
            val company = companyRepository.findById(companyId)
            if(company.isPresent){
                LOGGER.info("BL - Compañia obtenida con exito")
                return CompanyDto(
                        companyId = company.get().companyId,
                        name = company.get().name,
                        abrevation = company.get().abrevation,
                        state = company.get().state
                )
            }else{
                LOGGER.error("BL - Error compañia no existente")
                throw Exception("Compañia no encontrada")
            }
        } catch (e: Exception) {
            LOGGER.error("BL - Error al obtener la compañia")
            throw e
        }
    }
    //Metodo para actualizar una compañia
    fun updateCompany(companyId: Long, companyDto: CompanyDto): String {
        LOGGER.info("BL - Iniciando logica para actualizar una compañia")
        try {
            // Se obtiene la compañia
            val company = companyRepository.findById(companyId)
            if(company.isPresent){
                // Se actualiza la compañia
                company.get().name = companyDto.name
                company.get().abrevation = companyDto.abrevation
                // Se guarda la compañia
                val companySaved = companyRepository.save(company.get())
                LOGGER.info("BL - Compañia actualizada con exito")
                return "Registro " + companyId + " actualizado correctamente"

            }else{
                LOGGER.error("BL - Error compañia no existente")
                throw Exception("Compañia no encontrada")
            }
        } catch (e: Exception) {
            LOGGER.error("BL - Error al actualizar la compañia")
            throw e
        }
    }
    //Metodo para eliminar una compañia por su id - eliminado logico
    fun deleteCompany(companyId: Long): String {
        LOGGER.info("BL - Iniciando logica para eliminar una compañia")
        try {
            // Se obtiene la compañia
            val company = companyRepository.findById(companyId)
            if(company.isPresent){
                // Se elimina la compañia
                company.get().state = false
                // Se guarda la compañia
                val companySaved = companyRepository.save(company.get())
                LOGGER.info("BL - Compañia eliminada con exito")
                return "Registro " + companyId + " eliminado correctamente"
            }else{
                LOGGER.error("BL - Error compañia no existente")
                throw Exception("Compañia no encontrada")
            }
        } catch (e: Exception) {
            LOGGER.error("BL - Error al eliminar la compañia")
            throw e
        }
    }

    //Metodo para obtener todas las compañias
    fun getAllCompanies(): List<CompanyDto> {
        LOGGER.info("BL - Iniciando logica para obtener todas las compañias")
        try {
            // Se obtienen todas las compañias
            val companies = companyRepository.findAll()
            val companiesDto = mutableListOf<CompanyDto>()
            companies.forEach {
                companiesDto.add(CompanyDto(
                        companyId = it.companyId,
                        name = it.name,
                        abrevation = it.abrevation,
                        state = it.state
                ))
            }
            LOGGER.info("BL - Compañias obtenidas con exito")
            return companiesDto
        } catch (e: Exception) {
            LOGGER.error("BL - Error al obtener las compañias")
            throw e
        }
    }

    //Metodo para obtener todas las compañias activas
    fun getAllCompaniesActive(): List<CompanyDto> {
        LOGGER.info("BL - Iniciando logica para obtener todas las compañias activas")
        try {
            // Se obtienen todas las compañias activas
            val companies = companyRepository.findAllByState(true)
            val companiesDto = mutableListOf<CompanyDto>()
            companies.forEach {
                companiesDto.add(CompanyDto(
                        companyId = it.companyId,
                        name = it.name,
                        abrevation = it.abrevation,
                        state = it.state
                ))
            }
            LOGGER.info("BL - Compañias activas obtenidas con exito")
            return companiesDto
        } catch (e: Exception) {
            LOGGER.error("BL - Error al obtener las compañias activas")
            throw e
        }
    }
}