import { HttpException, HttpStatus } from '@nestjs/common';
import Location from '../locations/location.entity';

function validate(location: Location) {
  /** TODO: validate
   * PARENT AND CHILD CAN NOT BE NULL AT THE SAME TIME
   * IF SAME LEVEL : CAN NOT HAVE SAME SHORTNAME
  */
  if (!location)
    throw new HttpException('Validation error', HttpStatus.BAD_REQUEST);
  return location
}

export { validate }
