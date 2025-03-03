import { Injectable, Logger } from '@nestjs/common';
import { render } from 'ejs';
import * as fs from 'fs';
import * as wkhtmltopdf from 'wkhtmltopdf';
import * as path from 'path';
import { Readable } from 'stream';

@Injectable()
export class PdfService {
  private readonly logger: Logger = new Logger(PdfService.name);

  async generatePdf(content: string): Promise<Readable | null> {
    try {
      this.logger.debug(
        'Generating PDF with content length: ' + content.length,
      );

      // Use improved options with enableLocalFileAccess
      const pdfStream = wkhtmltopdf(content, {
        pageSize: 'A4',
        orientation: 'Portrait',
        dpi: 300,
        marginTop: '10mm',
        marginBottom: '10mm',
        marginLeft: '10mm',
        marginRight: '10mm',
        enableLocalFileAccess: true, // Add this to allow access to local files
      });

      // Handle errors from the wkhtmltopdf process
      pdfStream.on('error', (err) => {
        this.logger.error('Error generating PDF:', err);
      });

      return pdfStream;
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async generateTemplate(
    template:
      | 'other'
      | 'broadcast-authorization'
      | 'broadcast-authorization-partner',
    data: object,
  ): Promise<string> {
    try {
      let file: string = undefined;
      const rootDir = path.resolve(process.cwd());
      let templatePath: string;

      switch (template) {
        case 'broadcast-authorization':
          templatePath = path.join(
            rootDir,
            'templates/pdfs/broadcast-authorization.ejs',
          );
          break;
        case 'broadcast-authorization-partner':
          templatePath = path.join(
            rootDir,
            'templates/pdfs/broadcast-authorization-partner.ejs',
          );
          break;
        case 'other':
        default:
          this.logger.warn(`No template found for type: ${template}`);
          return '';
      }

      // Check if template file exists
      if (!fs.existsSync(templatePath)) {
        this.logger.error(`Template file not found at path: ${templatePath}`);
        throw new Error(`Template file not found: ${templatePath}`);
      }

      // Read template file
      this.logger.debug(`Reading template from: ${templatePath}`);
      file = fs.readFileSync(templatePath, 'utf-8');

      // Render template with data
      this.logger.debug(
        `Rendering template with data keys: ${Object.keys(data).join(', ')}`,
      );
      const rendered = render(file, data);

      // Check if render was successful
      if (!rendered || rendered.trim() === '') {
        this.logger.error('Template rendered empty content');
        throw new Error('Template rendered empty content');
      }

      this.logger.debug(
        `Template rendered successfully, length: ${rendered.length}`,
      );
      return rendered;
    } catch (e) {
      this.logger.error(`Template generation failed: ${e.message}`, e.stack);
      throw e;
    }
  }

  async generateBroadcastAuthorizationPdf(
    data: any,
    templateType: string,
  ): Promise<any> {
    try {
      // Determine which template to use based on the templateType
      let template:
        | 'broadcast-authorization'
        | 'broadcast-authorization-partner';

      if (templateType === 'partner') {
        template = 'broadcast-authorization-partner';
      } else {
        template = 'broadcast-authorization';
      }

      this.logger.debug(
        `Using template: ${template} for templateType: ${templateType}`,
      );

      // Format data for the template
      const formattedData = this.formatBroadcastAuthorizationData(data);

      // Generate HTML content from template
      this.logger.debug('Generating HTML content from template');
      const content = await this.generateTemplate(template, formattedData);

      if (!content || content.trim() === '') {
        this.logger.error('Generated HTML content is empty');
        return null;
      }

      // For debugging: save the HTML content to a file
      const debugPath = path.join(process.cwd(), 'debug_output.html');
      fs.writeFileSync(debugPath, content);
      this.logger.debug(`Saved debug HTML to: ${debugPath}`);

      // Generate PDF from HTML content
      this.logger.debug('Generating PDF from HTML content');
      return this.generatePdf(content);
    } catch (e) {
      this.logger.error(
        `Error generating broadcast authorization PDF: ${e.message}`,
        e.stack,
      );
      return null;
    }
  }

  private formatBroadcastAuthorizationData(data: any): any {
    // Create a properly formatted data object for the template
    const rootDir = path.resolve(process.cwd());
    const logoPath = path.join(rootDir, 'resources/logos/logo.png');

    let logoUrl = process.env.LOGO_URL;

    try {
      // If no environment URL is set, use base64 encoding of the logo
      if (!logoUrl) {
        this.logger.debug('No LOGO_URL found, using base64 encoded image');

        // Check if the logo file exists
        if (!fs.existsSync(logoPath)) {
          this.logger.error(`Logo file not found at path: ${logoPath}`);
          throw new Error(`Logo file not found at path: ${logoPath}`);
        }

        // Read and convert logo to base64
        const logoData = fs.readFileSync(logoPath);
        const logoBase64 = Buffer.from(logoData).toString('base64');
        logoUrl = `data:image/png;base64,${logoBase64}`;
        this.logger.debug('Logo encoded as base64 successfully');
      }
    } catch (e) {
      this.logger.error(`Error processing logo: ${e.message}`);
      // Fallback to a default "image not found" placeholder
      logoUrl = '';
    }

    const formattedData = {
      // Use the base64 encoded logo or URL from environment
      logoUrl,
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
}
