import { HttpException, HttpStatus, Logger } from "@nestjs/common";
import Location from "../locations/location.entity"

/**
 * Validate input Location data, throw Error if any
 * @param location 
 */
export async function validate(location: Object): Promise<void> {

  if (!location || !Object.keys(location).length) {
    Logger.error(`Validate false with values: ${JSON.stringify(location.toString)}`)
    throw new HttpException("Validation error", HttpStatus.BAD_REQUEST);
  }

  await validateShortName(location)

}

/**
 * ShortName in same level is unique, throw Error if not
 * @param location 
 */
async function validateShortName(location: Object): Promise<void> {
  Logger.log("validateShortName",location, location["locationShortName"], location["parent"]?.["id"])
  const shortName = location["locationShortName"]
  const find = await Location.find({
    relations: {
      parent: true
    },
    where: {
      parent: {
        id : location["parent"]?.["id"] || null
      }
    }
  }
)

if (!find) {
  return
}
Logger.log("find", find.toString())

  for (let each in find) {
    if (each["locationShortName"] == shortName) {
      throw new HttpException("ShortName has already taken", HttpStatus.NOT_FOUND)
    }
  }

}
