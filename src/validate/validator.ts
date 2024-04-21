import { HttpException, HttpStatus, Logger } from '@nestjs/common';
// import Location from '../locations/location.entity';

function validate(location: Object) : void {
  /** TODO: validate
   * remove redundant keys
   * throw error if empty
   * PARENT AND CHILD CAN NOT BE NULL AT THE SAME TIME
   * IF SAME LEVEL : CAN NOT HAVE SAME SHORTNAME
  */
 if (!location || !Object.keys(location).length) {
    Logger.error(`Validate false with values: ${JSON.stringify(location)}`)
    throw new HttpException('Validation error', HttpStatus.BAD_REQUEST);
  }
}

export { validate }
