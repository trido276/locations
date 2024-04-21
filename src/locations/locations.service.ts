import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import CreateLocationDto from './dto/createLocation.dto'
import Location from './location.entity'
import UpdateLocationDto from './dto/updateLocation.dto'
import { validate } from '../validate/validator'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { log } from 'console'

const HYPHEN_MINUS = "-"
@Injectable()
export default class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
  ) { }

  getAllLocations() {
    return this.locationsRepository.find()
  }

  async getLocationById(id: string) {
    try {
      const location = await this.locationsRepository.findOne({
        where: {
          id: id,
        }
      }
      )
      if (location) {
        return location;
      }
      throw new HttpException('Location not found', HttpStatus.NOT_FOUND)
    }
    catch {
      throw new HttpException('Invalid input syntax', HttpStatus.BAD_REQUEST)
    }
  }

  async createLocation(createLocationDto: CreateLocationDto) {
    /**
     * get parent then set locationame = append child
     * shortName = append each parent's shortName
     * new location doesnot have child
     * IF SAME LEVEL : CAN NOT HAVE SAME SHORTNAME
     * PARENT AND CHILD CAN NOT BE NULL AT THE SAME TIME
    */

    let loc = new Location
    loc.parse_to_location(createLocationDto)
    Logger.log(`Creating Location with values: ${loc.toString()}`)
    validate(loc)
    if (createLocationDto.parent) {
      const parentLocation = await this.getLocationById(createLocationDto.parent)
      loc.locationNumber = `${parentLocation.locationShortName} ${HYPHEN_MINUS} ${loc.locationShortName}`
    } else {
      loc.locationNumber = loc.locationShortName
    }

    const newLocation = this.locationsRepository.create(loc);
    await this.locationsRepository.save(newLocation);
    Logger.log(`Create successfully!`)
    return newLocation;
  }

  async updateLocation(id: string, location: UpdateLocationDto) {
    /** 
     * if B parent A, C parent A, -> 1-1: C parent A, remove A child in B
     * 
     */
    const loc = new Location
    loc.parse_to_location(location)
    Logger.log(`Update Location ${id} with values: ${loc.toString()}`)
    validate(loc)

    await this.locationsRepository.update(id, location);

    const updatedLocation = await this.getLocationById(id)
    if (updatedLocation) {
      return updatedLocation
    }
    Logger.log(`Create successfully!`)
    throw new HttpException('Location not found', HttpStatus.NOT_FOUND);
  }

  async deleteLocation(id: string) {
    /**
     * TODO: if remove the one have child: child must point to that one's parent and reupdate locationName
     */
    const deleteResponse = await this.locationsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Location not found', HttpStatus.NOT_FOUND);
    }
  }
}