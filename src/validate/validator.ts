import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Repository, FindManyOptions } from 'typeorm'
// import Location from '../locations/location.entity'

/**
 * Validate input Location data, throw Error if any
 * @param location 
 */
export async function validate(location: Object): Promise<void> {
  /** TODO: validate
   * remove redundant keys
   * throw error if empty
  */
  if (!location || !Object.keys(location).length) {
    Logger.error(`Validate false with values: ${JSON.stringify(location)}`)
    throw new HttpException('Validation error', HttpStatus.BAD_REQUEST);
  }

  await validateShortname(location)

}

/**
 * ShortName in same level is unique, throw Error if not
 * @param location 
 */
async function validateShortname(location: Object): Promise<void> {

  let locationsRepository: Repository<Location>

  const find = await locationsRepository.find({
    where: {
      parent: location["parent"]
    }
  } as FindManyOptions<Location>)

  if (!find) {
    throw new HttpException('Location not found', HttpStatus.NOT_FOUND)
  }

  for (let each in find) {
    if (each["id"] == location["id"]) {
      throw new HttpException('LocationShortName has already taken', HttpStatus.NOT_FOUND)
    }
  }

}
