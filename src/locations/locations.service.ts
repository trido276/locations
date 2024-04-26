import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common"
import CreateLocationDto from "./dto/createLocation.dto"
import Location from "./location.entity"
import UpdateLocationDto from "./dto/updateLocation.dto"
import { validate } from "../validate/validator"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

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
  async getAllLocations(): Promise<any[]> {
    const data = await this.locationsRepository.find()

    return data
  }

  pushChildData(parentShortName: string, children: Location[]) {
    let result = []
    for (let index in children) {
      let childrenData = children[index]
      childrenData.locationNumber= parentShortName.concat(`-${childrenData.locationShortName}`)
      result.push(childrenData)
      if (childrenData.child) {
        result.concat(this.pushChildData(childrenData.locationShortName, childrenData.child))
      }
    }
    return result
  }


  /**
   * Get Location by ID, throw Error if any
   * @param id ID of the Location
   * @returns Location if found
   */
  async getLocationById(id: string): Promise<Location> {
    try {
      const location = await this.locationsRepository.findOne({
        where: {
          id: id,
        }
      })
      if (!location) {
        throw new HttpException("Location not found", HttpStatus.NOT_FOUND)
      }
      return location
    }
    catch {
      throw new HttpException("Invalid input syntax", HttpStatus.BAD_REQUEST)
    }
  }

  /**
    * Get parent then set locatioName = append child,
    * shortName = append each parent"s shortName,
    * new location doesnot have child,
    * throw Error if any
    * @param createLocationDto Data of created Location
    * @returns Created Location
  */
  async createLocation(createLocationDto: CreateLocationDto): Promise<Location> {

    await validate(createLocationDto)
    let loc = new Location
    loc.parse(createLocationDto)
    Logger.log(`Creating Location with values: ${loc.toString()}`)
    
    if (createLocationDto.parent?.id) {
      Logger.log(`createLocationDto.parent?.id: ${createLocationDto.parent?.id}`)

      const parentLocation = await this.getLocationById(createLocationDto.parent.id)
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
   * Update Location of the given ID
   * TODO: handle update CHILD locationNumber when update PARENT
   * @param id ID of the updated Location
   * @param updateLocation Data of the updated Location
   * @returns Updated Location
   */
  async updateLocation(id: string, updateLocation: UpdateLocationDto): Promise<Location> {
    await validate(updateLocation)
    const loc = new Location
    loc.parse(updateLocation)
    Logger.log(`Update Location ${id} with values: ${loc.toString()}`)
    
    
    const foundLocation = await this.getLocationById(id)
    if (!foundLocation) {
      throw new HttpException("Location not found", HttpStatus.NOT_FOUND)
    }
  
    if (updateLocation.parent?.id != foundLocation.parent.id) {
      if (updateLocation.parent?.id) {
        Logger.log(`Update Location ShortName with id: ${foundLocation.parent?.id}`)
        const parentLocation = await this.getLocationById(updateLocation.parent?.id)
        loc.locationNumber = `${parentLocation.locationShortName} ${HYPHEN_MINUS} ${loc.locationShortName}`
      } else {
        loc.locationNumber = loc.locationShortName
      }
    }

    

    await this.locationsRepository.update(id, loc)

    Logger.log(`Update successfully!`)
    return foundLocation
  }

  /**
   * Delete a location by ID,
   * If the location have parent, move children to that parent, else remove their parent,
   * Finnaly update children"s LocationName,
   * TODO: if remove the one have child: child must point to that one"s parent and reupdate locationName,
   * throw Error if any
   * @param id ID of the deleted Location
   */
  async deleteLocation(id: string): Promise<void> {
    const deleteResponse = await this.locationsRepository.delete(id)
    if (!deleteResponse.affected) {
      throw new HttpException("Location not found", HttpStatus.NOT_FOUND)
    }
  }

}