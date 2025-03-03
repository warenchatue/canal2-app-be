import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  Res,
  Logger,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { BroadcastAuthorizationService } from './broadcast-authorization.service';
import { Response } from 'express';
import { CreateBroadcastAuthorizationDto } from './dto/create-broadcast-authorization.dto';
import { UpdateBroadcastAuthorizationDto } from './dto/update-broadcast-authorization.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { BaseController } from 'src/common/shared/base-controller';
import { UseJwt } from '../../auth/auth.decorator';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { sendError } from 'src/common/helpers';
import { PdfService } from 'src/features/providers/pdf/pdf.service';

@Controller('broadcast-authorization')
@ApiTags('BroadcastAuthorization')
export class BroadcastAuthorizationController extends BaseController {
  private readonly logger = new Logger(BroadcastAuthorizationController.name);

  constructor(
    private readonly broadcastAuthorizationService: BroadcastAuthorizationService,
    private readonly event: EventEmitter2,
    private readonly pdfService: PdfService,
  ) {
    super();
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  @ApiOperation({ summary: 'Create a new broadcast authorization' })
  @ApiResponse({ status: 201, description: 'Successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() dto: CreateBroadcastAuthorizationDto) {
    try {
      return await this.run(async () => {
        const result = await this.broadcastAuthorizationService.create(dto);
        this.event.emit('broadcast-authorization-created', result);
        return result;
      });
    } catch (error) {
      this.logger.error(
        `Error creating broadcast authorization: ${error.message}`,
        error.stack,
      );
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get()
  @ApiOperation({ summary: 'Get all active broadcast authorizations' })
  @ApiResponse({
    status: 200,
    description: 'Return all active broadcast authorizations',
  })
  async findAll() {
    try {
      const data = await this.broadcastAuthorizationService.findActive();
      const totalItems = data.length;
      const finalResult = data.map((e) => e.toJSON());

      return {
        metaData: {
          totalItems,
        },
        data: finalResult,
      };
    } catch (error) {
      this.logger.error(
        `Error finding all broadcast authorizations: ${error.message}`,
        error.stack,
      );
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get(':id')
  @ApiOperation({ summary: 'Get a broadcast authorization by id' })
  @ApiParam({ name: 'id', description: 'Broadcast authorization ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the broadcast authorization',
  })
  @ApiResponse({
    status: 404,
    description: 'Broadcast authorization not found',
  })
  async findOne(@Param('id') id: string) {
    try {
      const result = await this.broadcastAuthorizationService.findOne(id);
      if (!result) {
        throw new HttpException(
          'Broadcast authorization not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return result;
    } catch (error) {
      this.logger.error(
        `Error finding broadcast authorization ${id}: ${error.message}`,
        error.stack,
      );
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':id')
  @ApiOperation({ summary: 'Update a broadcast authorization' })
  @ApiParam({ name: 'id', description: 'Broadcast authorization ID' })
  @ApiResponse({ status: 200, description: 'Successfully updated' })
  @ApiResponse({
    status: 404,
    description: 'Broadcast authorization not found',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBroadcastAuthorizationDto,
  ) {
    try {
      const result = await this.broadcastAuthorizationService.update(id, dto);
      if (!result) {
        throw new HttpException(
          'Broadcast authorization not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return result;
    } catch (error) {
      this.logger.error(
        `Error updating broadcast authorization ${id}: ${error.message}`,
        error.stack,
      );
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':bauthID')
  @ApiOperation({ summary: 'Delete a broadcast authorization' })
  @ApiParam({ name: 'bauthID', description: 'Broadcast authorization ID' })
  @ApiResponse({ status: 200, description: 'Successfully deleted' })
  @ApiResponse({
    status: 404,
    description: 'Broadcast authorization not found',
  })
  async deleteBroadAuth(@Param('bauthID') bauthID: string) {
    try {
      return await this.run(async () => {
        const result = await this.broadcastAuthorizationService.deleteOne(
          bauthID,
        );
        if (!result) {
          throw new HttpException(
            'Broadcast authorization not found',
            HttpStatus.NOT_FOUND,
          );
        }
        return result;
      });
    } catch (error) {
      this.logger.error(
        `Error deleting broadcast authorization ${bauthID}: ${error.message}`,
        error.stack,
      );
      sendError(error);
    }
  }

  async formatBroadcastAuthorizationData(data: any) {
    // Create a properly formatted data object for the template
    const formattedData = {
      // Add a default logo URL or use from environment config
      logoUrl: process.env.LOGO_URL || '/path/to/logo.png',

      // Core fields from the broadcast authorization
      announcer: data.announcer || { name: 'N/A' },
      natureDescription: data.natureDescription || '',
      endDate: data.endDate ? new Date(data.endDate) : new Date(),
      duration: data.duration || '',
      description: data.description || '',
      hour: data.hour || '',
      date: data.date ? new Date(data.date) : new Date(),

      // Participants and questions with fallbacks
      participants: Array.isArray(data.participants) ? data.participants : [],
      questions: Array.isArray(data.questions) ? data.questions : [],

      // Contact information
      contactDetailsToShow: data.contactDetailsToShow || '',
      serviceInCharge: data.serviceInCharge || '',

      // Additional fields that might be in the template
      startDate: data.startDate ? new Date(data.startDate) : new Date(),
      realHour: data.realHour || '',
      hours: Array.isArray(data.hours) ? data.hours : [],
      realHours: Array.isArray(data.realHours) ? data.realHours : [],
      note: data.note || '',
      location: data.location || '',
      productionPartner: data.productionPartner || '',
      keyContact: data.keyContact || '',
    };

    this.logger.debug(
      `Formatted data keys: ${Object.keys(formattedData).join(', ')}`,
    );
    return formattedData;
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get(':id/generate-pdf')
  @ApiOperation({ summary: 'Generate a PDF for a broadcast authorization' })
  @ApiParam({ name: 'id', description: 'Broadcast authorization ID' })
  @ApiQuery({
    name: 'templateType',
    description: 'Template type (standard or partner)',
    required: false,
  })
  @ApiResponse({ status: 200, description: 'Return the PDF' })
  @ApiResponse({
    status: 404,
    description: 'Broadcast authorization not found',
  })
  @ApiResponse({ status: 500, description: 'Error generating PDF' })
  async generatePdf(
    @Param('id') id: string,
    @Query('templateType')
    templateType:
      | 'other'
      | 'broadcast-authorization'
      | 'broadcast-authorization-partner',
    @Res() res: Response,
  ) {
    try {
      this.logger.debug(
        `Generating PDF for broadcast authorization ${id} with template type ${templateType}`,
      );

      // Fetch the broadcast authorization data
      const broadcastAuth = await this.broadcastAuthorizationService.findOne(
        id,
      );

      if (!broadcastAuth) {
        this.logger.warn(`Broadcast authorization ${id} not found`);
        return res
          .status(404)
          .json({ message: 'Broadcast authorization not found' });
      }

      this.logger.debug(
        `Found broadcast authorization: ${JSON.stringify(broadcastAuth)}`,
      );

      // Generate the PDF
      const content = await this.pdfService.generateTemplate(
        templateType,
        this.formatBroadcastAuthorizationData(broadcastAuth),
      );

      const pdfStream = await this.pdfService.generatePdf(content);

      if (!pdfStream) {
        this.logger.error(
          `Failed to generate PDF for broadcast authorization ${id}`,
        );
        return res.status(500).json({ message: 'Error generating PDF Buffer' });
      }

      // Set headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="broadcast-authorization-${id}.pdf"`,
      );

      // Set up error handler for the PDF stream
      pdfStream.on('error', (error) => {
        this.logger.error(`Error in PDF stream: ${error.message}`, error.stack);
        // Only send response if it hasn't been sent already
        if (!res.headersSent) {
          res
            .status(500)
            .json({ message: 'Error streaming PDF', error: error.message });
        }
      });

      // Pipe the PDF stream to the response
      pdfStream.pipe(res);
    } catch (error) {
      this.logger.error(`Error generating PDF: ${error.message}`, error.stack);
      // Only send response if it hasn't been sent already
      if (!res.headersSent) {
        res
          .status(500)
          .json({ message: 'Error generating PDF', error: error.message });
      }
    }
  }
}
