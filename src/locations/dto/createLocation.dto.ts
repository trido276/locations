export class CreateLocationDto {
  locationName: string;
  locationShortName: string;
  area: number;
  parent: ParentDto;
}

class ParentDto {
  id: string
}

export default CreateLocationDto;