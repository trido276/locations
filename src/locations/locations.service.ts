import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import CreateLocationDto from './dto/createLocation.dto'
import Location from './location.entity'
import UpdateLocationDto from './dto/updateLocation.dto'
import { validate } from '../validate/validator'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

const HYPHEN_MINUS = "-"
@Injectable()
export default class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
  ) { }

  /**
   * Return all locations in database
   */
  getAllLocations() {
    return this.locationsRepository.find()
  }
  /**
   * Validate ID then find location by the ID in database,
   * throw Error if any
   * @param id ID of the Location
   * @returns Location if found
   */
  async getLocationById(id: string) {
    try {
      const location = await this.locationsRepository.findOne({
        where: {
          id: id,
        }
      }
      )
      if (location) {
        return location
      }
      throw new HttpException('Location not found', HttpStatus.NOT_FOUND)
    }
    catch {
      throw new HttpException('Invalid input syntax', HttpStatus.BAD_REQUEST)
    }
  }

  /**
    * Get parent then set locatioName = append child,
    * shortName = append each parent's shortName,
    * new location doesnot have child,
    * IF SAME LEVEL : CAN NOT HAVE SAME SHORTNAME,
    * PARENT AND CHILD CAN NOT BE NULL AT THE SAME TIME ,
    * throw Error if any
    * @param createLocationDto Data of created Location
    * @returns Created Location
  */
  async createLocation(createLocationDto: CreateLocationDto) {

    validate(createLocationDto)
    let loc = new Location
    loc.parse_to_location(createLocationDto)
    Logger.log(`Creating Location with values: ${loc.toString()}`)
    if (createLocationDto.parent) {
      const parentLocation = await this.getLocationById(createLocationDto.parent)
      loc.locationNumber = `${parentLocation.locationShortName} ${HYPHEN_MINUS} ${loc.locationShortName}`
    } else {
      loc.locationNumber = loc.locationShortName
    }

    const newLocation = this.locationsRepository.create(loc)
    await this.locationsRepository.save(newLocation)
    Logger.log(`Create successfully!`)
    return newLocation
  }

  /**
   * 
   * if B parent A, C parent A, -> 1-1: C parent A, remove A child in B,
   * if update parent > find child and update them,
   * have to do in update/create or get func,
   * @param id ID of the updated Location
   * @param updateLocation Data of the updated Location
   * @returns Updated Location
   */
  async updateLocation(id: string, updateLocation: UpdateLocationDto) {
    validate(updateLocation)
    const location = new Location
    location.parse_to_location(updateLocation)
    Logger.log(`Update Location ${id} with values: ${location.toString()}`)

    // TODO: try catch
    /**
     *  get by ID / check if change parent
     * 
     *  */

    await this.locationsRepository.update(id, location)

    const updatedLocation = await this.getLocationById(id)
    if (!updatedLocation) {
      throw new HttpException('Location not found', HttpStatus.NOT_FOUND)
    }

    Logger.log(`Update successfully!`)
    return updatedLocation
  }

  /**
   * Delete a location by ID,
   * If the location have parent, move children to that parent, else remove their parent,
   * Finnaly update children's LocationName,
   * TODO: if remove the one have child: child must point to that one's parent and reupdate locationName,
   * throw Error if any
   * @param id ID of the deleted Location
   */
  async deleteLocation(id: string) {
    const deleteResponse = await this.locationsRepository.delete(id)
    if (!deleteResponse.affected) {
      throw new HttpException('Location not found', HttpStatus.NOT_FOUND)
    }
  }
}