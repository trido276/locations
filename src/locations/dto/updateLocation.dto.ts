export class UpdateLocationDto {
  id: string;
  locationName: string;
  // locationShortName: string;
  area: number;
  parent: ParentDto;
}

class ParentDto {
  id: string
}

export default UpdateLocationDto;