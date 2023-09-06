import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  Body,
  Delete,
  Patch,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import * as fs from 'fs';
import { PropertySearchCriteria } from 'src/dtos/PropertySearchCriteria .dto';
import { Comment } from 'src/schemas/comment.schema';
import { Property } from 'src/models/property.model';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  // @Post('insert-data')
  // async insertData() {
  //   try {
  //     const jsonData = fs.readFileSync('src/data/csvjson.json', 'utf8');
  //     const parsedData = JSON.parse(jsonData);

  //     await this.propertyService.create(parsedData);
  //     return { message: 'Data inserted successfully' };
  //   } catch (error) {
  //     console.error('Error inserting data:', error);
  //     throw new Error('Failed to insert data');
  //   }
  // }
 

  @Get('paginated-properties')
  async getPaginatedProperties(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    try {
      const properties = await this.propertyService.findPaginatedProperties(
        page,
        limit,
      );
      const totalCount = await this.propertyService.getPropertyCount();
      return {
        properties,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      };
    } catch (error) {
      throw new InternalServerErrorException('Error while fetching properties');
    }
  }

  @Get('search')
  async searchProperties(@Query() criteria: PropertySearchCriteria) {
    try {
      const properties = await this.propertyService.searchProperties(criteria);
      return properties;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while searching properties',
      );
    }
  }

  @Post(':propertyId/comments')
  async addComment(
    @Param('propertyId') propertyId: string,
    @Body() comment: Comment,
  ) {
    try {
      const updatedProperty = await this.propertyService.addComment(
        propertyId,
        comment,
      );
      return updatedProperty;
    } catch (error) {
      throw new InternalServerErrorException('Error while posting comment');
    }
  }

  @Delete(':propertyId/comments/:commentId')
  async deleteComment(
    @Param('propertyId') propertyId: string,
    @Param('commentId') commentId: string,
  ) {
    try {
      const updatedProperty = await this.propertyService.deleteComment(
        propertyId,
        commentId,
      );
      return updatedProperty;
    } catch (error) {
      throw new InternalServerErrorException('Error while deleting comment');
    }
  }

  @Patch(':propertyId/comments/:commentId')
  async editComment(
    @Param('propertyId') propertyId: string,
    @Param('commentId') commentId: string,
    @Body('comment') updatedText: string,
  ) {
    try {
      const updatedProperty = await this.propertyService.editComment(
        propertyId,
        commentId,
        updatedText,
      );
      return updatedProperty;
    } catch (error) {
      throw new InternalServerErrorException('Error while updating comment');
    }
  }

  @Post(':id/upvote')
  async upvoteProperty(@Param('id') id: string): Promise<Property> {
    try {
      const property = await this.propertyService.findById(id);

      if (!property) {
        throw new NotFoundException('Property not found');
      }

      property.upvotes += 1;

      return this.propertyService.update(property);
    } catch (error) {
      throw new InternalServerErrorException('Error while upvoting');
    }
  }

  @Post(':id/downvote')
  async downvoteProperty(@Param('id') id: string): Promise<Property> {
    try {
      const property = await this.propertyService.findById(id);

      if (!property) {
        throw new NotFoundException('Property not found');
      }

      property.downvotes += 1;

      return this.propertyService.update(property);
    } catch (error) {
      throw new InternalServerErrorException('Error while down voting');
    }
  }

  @Get(':id')
  async getProperty(@Param('id') id: string): Promise<Property> {
    return this.propertyService.findById(id);
  }
}
