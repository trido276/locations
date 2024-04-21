import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import LocationsService from './locations.service';
import CreateLocationDto from './dto/createLocation.dto';
import UpdateLocationDto from './dto/updateLocation.dto';

@Controller('locations')
export default class LocationsController {
  constructor(
    private readonly locationsService: LocationsService
  ) { }

  @Get()
  getAllLocations() {
    return this.locationsService.getAllLocations();
  }

  @Get(':id')
  getLocationById(@Param('id') id: string) {
    return this.locationsService.getLocationById(id);
  }

  @Post()
  async createLocation(@Body() location: CreateLocationDto) {
    return this.locationsService.createLocation(location);
  }

  @Patch(':id')
  async updateLocation(@Param('id') id: string, @Body() location: UpdateLocationDto) {
    return this.locationsService.updateLocation(id, location);
  }

  @Delete(':id')
  async deleteLocation(@Param('id') id: string) {
    return this.locationsService.deleteLocation(id);
  }
}