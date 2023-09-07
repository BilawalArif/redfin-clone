import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Property } from 'src/models/property.model';
import { Comment } from 'src/schemas/comment.schema';

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel('Property') private readonly propertyModel: Model<Property>,
  ) {}

  // async create(properties: Property[]): Promise<Property[]> {
  //   try {
  //     return this.propertyModel.create(properties);
  //   } catch (error) {
  //     throw new BadRequestException(error);
  //   }
  // }

  async findById(id: string): Promise<Property | null> {
    try {
      const property = await this.propertyModel.findById(id).exec();
      return property;
    } catch (error) {
      throw new NotFoundException('Property not found');
    }
  }

  async update(property: Property): Promise<Property> {
    try {
      const updatedProperty = await this.propertyModel.findByIdAndUpdate(
        property._id,
        property,
        { new: true },
      );

      return updatedProperty;
    } catch (error) {
      throw new InternalServerErrorException('Error while updating properties');
    }
  }

  async findPaginatedProperties(
    page: number,
    limit: number,
  ): Promise<Property[]> {
    try {
      const skip = (page - 1) * limit;
      return this.propertyModel.find().skip(skip).limit(limit).exec();
    } catch (error) {
      throw new InternalServerErrorException('Error while fetching properties');
    }
  }

  async getPropertyCount(): Promise<number> {
    try {
      return this.propertyModel.countDocuments().exec();
    } catch (error) {
      throw new InternalServerErrorException('Error while fetching properties');
    }
  }

  async searchProperties(criteria: {
    zip?: number;
    city?: string;
    address?: string;
  }): Promise<Property[]> {
    try {
      const query = this.propertyModel.find();

      if (criteria.zip) {
        query.where('zip').equals(criteria.zip);
      }

      if (criteria.city) {
        query.where('city').equals(criteria.city);
      }

      if (criteria.address) {
        query.where('address').equals(criteria.address);
      }

      const properties = await query.exec();
      return properties;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while searching properties',
      );
    }
  }

  async addComment(propertyId: string, comment: Comment): Promise<Property> {
    try {
      const property = await this.propertyModel.findById(propertyId);
      if (!property) {
        throw new NotFoundException('Property not found');
      }

      property.comments.push(comment);
      return property.save();
    } catch (error) {
      throw new InternalServerErrorException('Error while posting comment');
    }
  }

  async deleteComment(
    propertyId: string,
    commentId: string,
  ): Promise<Property> {
    try {
      const property = await this.propertyModel.findById(propertyId);
      if (!property) {
        throw new NotFoundException('Property not found');
      }

      const commentIndex = property.comments.findIndex(
        (comment) => comment._id.toString() === commentId,
      );
      if (commentIndex === -1) {
        throw new NotFoundException('Comment not found');
      }

      property.comments.splice(commentIndex, 1);
      return property.save();
    } catch (error) {
      throw new InternalServerErrorException('Error while deleting comment');
    }
  }

  async editComment(
    propertyId: string,
    commentId: string,
    updatedText: string,
  ): Promise<Property> {
    try {
      const property = await this.propertyModel.findById(propertyId);
      if (!property) {
        throw new NotFoundException('Property not found');
      }

      // Find the comment to update
      const commentIndex = property.comments.findIndex(
        (comment) => comment._id.toString() === commentId,
      );

      if (commentIndex === -1) {
        throw new NotFoundException('Comment not found');
      }

      // Update the comment text
      property.comments[commentIndex].comment = updatedText;

      // Save the property
      return property.save();
    } catch (error) {
      throw new InternalServerErrorException('Error while updating comment');
    }
  }

  generateRandomImageUrl() {
    const baseUrl = 'https://picsum.photos/'; // Base URL for Lorem Picsum
    const imageWidth = 800; // Adjust width as needed
    const imageHeight = 600; // Adjust height as needed

    // Generate a random image ID (replace '1000' with the desired range)
    const imageId = Math.floor(Math.random() * 1000);

    return `${baseUrl}${imageWidth}/${imageHeight}?random=${imageId}`;
  }

  async updatePropertiesWithImageUrl() {
    try {
      const properties = await this.propertyModel.find({}).exec();

      for (const property of properties) {
        property.image_url = this.generateRandomImageUrl(); // Use the function from the previous answer
        await property.save();
      }

      return 'All properties updated.';
    } catch (error) {
      throw error;
    }
  }
  async deleteImageUrlFromProperties() {
    // Update all documents to remove the 'image_url' property
    await this.propertyModel.updateMany({}, { $unset: { image_url: 1 } });
    
    return 'image_url property deleted from all properties.';
  }
  
}
